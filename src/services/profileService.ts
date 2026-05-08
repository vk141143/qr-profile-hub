import { Profile, CompanyEntry, SocialLinks, Theme, DEFAULT_THEME } from '@/types';
import { getSupabase } from '@/lib/supabase';
import { generateSlug, generateId } from '@/utils';

// ── DB row types ──────────────────────────────────────────────
interface DBProfile {
  id: string;
  user_id: string;
  slug: string;
  full_name: string;
  tagline: string | null;
  bio: string | null;
  profile_image: string | null;
  theme: Theme;
  is_public: boolean;
  scan_count: number;
  created_at: string;
  updated_at: string;
  companies?: DBCompany[];
}

interface DBCompany {
  id: string;
  profile_id: string;
  name: string;
  tagline: string | null;
  logo: string | null;
  sort_order: number;
  social_links?: DBSocialLink[];
}

interface DBSocialLink {
  id: string;
  company_id: string;
  platform: string;
  label: string | null;
  url: string;
  sort_order: number;
}

// ── Mappers ───────────────────────────────────────────────────
function dbToProfile(row: DBProfile): Profile {
  const companies: CompanyEntry[] = (row.companies ?? []).map(c => ({
    id: c.id,
    name: c.name,
    tagline: c.tagline ?? undefined,
    logo: c.logo ?? undefined,
    socialLinks: buildSocialLinks(c.social_links ?? []),
  }));

  return {
    id: row.id,
    slug: row.slug,
    fullName: row.full_name,
    tagline: row.tagline ?? undefined,
    bio: row.bio ?? undefined,
    profileImage: row.profile_image ?? undefined,
    companies,
    theme: row.theme ?? DEFAULT_THEME,
    isPublic: row.is_public,
    scanCount: row.scan_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildSocialLinks(rows: DBSocialLink[]): SocialLinks {
  const links: SocialLinks = {};
  const custom: SocialLinks['customLinks'] = [];

  for (const r of rows) {
    if (r.platform === 'custom') {
      custom.push({ id: r.id, label: r.label ?? r.url, url: r.url });
    } else {
      (links as any)[r.platform] = r.url;
    }
  }
  if (custom.length) links.customLinks = custom;
  return links;
}

// ── Service ───────────────────────────────────────────────────
export const profileService = {

  async getAll(userId: string): Promise<Profile[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        companies (
          *,
          social_links ( * )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as DBProfile[]).map(dbToProfile);
  },

  async getBySlug(slug: string): Promise<Profile | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        companies (
          *,
          social_links ( * )
        )
      `)
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (error || !data) return null;
    return dbToProfile(data as DBProfile);
  },

  async getById(id: string): Promise<Profile | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        companies (
          *,
          social_links ( * )
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return dbToProfile(data as DBProfile);
  },

  async create(userId: string, data: Partial<Profile>): Promise<Profile> {
    const supabase = getSupabase();

    // 1. Generate unique slug
    const baseSlug = generateSlug(data.fullName || 'user');
    const { data: existing } = await supabase
      .from('profiles')
      .select('slug')
      .eq('slug', baseSlug)
      .maybeSingle();
    const slug = existing ? `${baseSlug}${generateId().slice(0, 4)}` : baseSlug;

    // 2. Insert profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        slug,
        full_name: data.fullName || '',
        tagline: data.tagline || null,
        bio: data.bio || null,
        profile_image: data.profileImage || null,
        theme: data.theme ?? DEFAULT_THEME,
        is_public: true,
        scan_count: 0,
      })
      .select()
      .single();

    if (profileErr) throw profileErr;

    // 3. Insert companies + social links
    await insertCompanies(supabase, profile.id, data.companies ?? []);

    // 4. Return full profile
    return (await this.getById(profile.id))!;
  },

  async update(id: string, data: Partial<Profile>): Promise<Profile | null> {
    const supabase = getSupabase();

    // 1. Update profile row
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({
        full_name: data.fullName,
        tagline: data.tagline ?? null,
        bio: data.bio ?? null,
        profile_image: data.profileImage ?? null,
        theme: data.theme,
        is_public: data.isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (profileErr) throw profileErr;

    // 2. Replace companies — delete old, insert new
    if (data.companies !== undefined) {
      await supabase.from('companies').delete().eq('profile_id', id);
      await insertCompanies(supabase, id, data.companies);
    }

    return this.getById(id);
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabase();
    // Cascade deletes companies → social_links automatically
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw error;
  },

  async togglePublic(id: string): Promise<Profile | null> {
    const supabase = getSupabase();
    const profile = await this.getById(id);
    if (!profile) return null;
    const { error } = await supabase
      .from('profiles')
      .update({ is_public: !profile.isPublic })
      .eq('id', id);
    if (error) throw error;
    return this.getById(id);
  },

  async incrementScan(slug: string): Promise<void> {
    const supabase = getSupabase();
    // Use the SQL function for atomic increment
    await supabase.rpc('increment_scan_count', { p_slug: slug });
    // Also record the scan event
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('slug', slug)
      .single();
    if (profile) {
      await supabase.from('scan_events').insert({ profile_id: profile.id });
    }
  },
};

// ── Helper: insert companies + their social links ─────────────
async function insertCompanies(
  supabase: ReturnType<typeof getSupabase>,
  profileId: string,
  companies: CompanyEntry[]
) {
  for (let i = 0; i < companies.length; i++) {
    const c = companies[i];

    const { data: company, error: compErr } = await supabase
      .from('companies')
      .insert({
        profile_id: profileId,
        name: c.name,
        tagline: c.tagline || null,
        logo: c.logo || null,
        sort_order: i,
      })
      .select()
      .single();

    if (compErr) throw compErr;

    // Build social link rows
    const linkRows: any[] = [];
    const PLATFORMS = ['instagram','youtube','facebook','twitter','linkedin','website','whatsapp','telegram','email'] as const;

    PLATFORMS.forEach((platform, idx) => {
      const val = c.socialLinks[platform];
      if (val) {
        linkRows.push({ company_id: company.id, platform, url: val, sort_order: idx });
      }
    });

    (c.socialLinks.customLinks ?? []).forEach((cl, idx) => {
      if (cl.url) {
        linkRows.push({
          company_id: company.id,
          platform: 'custom',
          label: cl.label,
          url: cl.url,
          sort_order: PLATFORMS.length + idx,
        });
      }
    });

    if (linkRows.length > 0) {
      const { error: linkErr } = await supabase.from('social_links').insert(linkRows);
      if (linkErr) throw linkErr;
    }
  }
}

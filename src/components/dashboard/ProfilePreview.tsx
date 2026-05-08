'use client';
import { Profile } from '@/types';
import { SOCIAL_KEYS } from '@/components/ui/SocialIcons';

interface ProfilePreviewProps {
  profile: Partial<Profile>;
}

export default function ProfilePreview({ profile }: ProfilePreviewProps) {
  const theme = profile.theme;
  if (!theme) return null;

  const cardRadius = { rounded: 'rounded-xl', sharp: 'rounded-none', pill: 'rounded-full' }[theme.cardStyle];

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[60px] opacity-25 pointer-events-none"
        style={{ background: theme.primaryColor }}
      />

      <div className="relative p-5 flex flex-col items-center text-center">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white mb-3 overflow-hidden flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
        >
          {profile.profileImage
            ? <img src={profile.profileImage} alt="" className="w-full h-full object-cover" />
            : (profile.fullName || 'U').charAt(0).toUpperCase()
          }
        </div>

        <p className="font-black text-sm mb-0.5" style={{ color: theme.textColor }}>
          {profile.fullName || 'Your Name'}
        </p>
        {profile.tagline && (
          <p className="text-xs opacity-40 mb-3" style={{ color: theme.textColor }}>
            {profile.tagline}
          </p>
        )}

        {/* CTA button */}
        <div
          className="w-full py-2.5 rounded-xl text-white text-xs font-bold mb-4"
          style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
        >
          View All Links ↓
        </div>

        {/* Companies preview */}
        <div className="w-full space-y-2">
          {(profile.companies || []).slice(0, 3).map((company, ci) => {
            const linkCount = SOCIAL_KEYS.filter(k => company.socialLinks[k]).length
              + (company.socialLinks.customLinks?.length || 0);
            const ACCENTS = ['#6366f1','#8b5cf6','#ec4899','#0ea5e9','#10b981','#f97316'];
            const accent = ACCENTS[ci % ACCENTS.length];
            return (
              <div
                key={company.id}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 ${cardRadius}`}
                style={{
                  background: `${accent}18`,
                  border: `1px solid ${accent}30`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden text-xs font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${accent}cc, ${accent}88)` }}
                >
                  {company.logo
                    ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                    : company.name.charAt(0).toUpperCase()
                  }
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: theme.textColor }}>
                    {company.name || 'Company Name'}
                  </p>
                  {company.tagline && (
                    <p className="text-xs opacity-40 truncate" style={{ color: theme.textColor }}>
                      {company.tagline}
                    </p>
                  )}
                </div>
                {linkCount > 0 && (
                  <span className="text-xs opacity-50 flex-shrink-0" style={{ color: theme.primaryColor }}>
                    {linkCount}
                  </span>
                )}
              </div>
            );
          })}
          {(profile.companies || []).length === 0 && (
            <p className="text-xs opacity-20 py-2" style={{ color: theme.textColor }}>
              Add companies to preview
            </p>
          )}
          {(profile.companies || []).length > 3 && (
            <p className="text-xs opacity-30 text-center" style={{ color: theme.textColor }}>
              +{(profile.companies || []).length - 3} more
            </p>
          )}
        </div>

        <p className="text-xs opacity-15 mt-4" style={{ color: theme.textColor }}>
          Powered by QR Profile Hub
        </p>
      </div>
    </div>
  );
}

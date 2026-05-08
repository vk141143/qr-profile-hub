'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile, Theme, CompanyEntry, CustomLink, DEFAULT_THEME, makeCompany } from '@/types';
import { SOCIAL_CONFIG, SOCIAL_KEYS } from '@/components/ui/SocialIcons';
import { THEME_PRESETS } from '@/data/mockData';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ImageUploader from '@/components/ui/ImageUploader';
import {
  Plus, Trash2, User, Save, Building2,
  ChevronDown, ChevronUp, Link as LinkIcon,
} from 'lucide-react';
import { generateId } from '@/utils';
import toast from 'react-hot-toast';

interface ProfileFormProps {
  initial?: Partial<Profile>;
  onSave: (data: Partial<Profile>) => void;
  onPreviewChange?: (data: Partial<Profile>) => void;
  loading?: boolean;
}

const TABS = ['Basic', 'Companies', 'Theme'] as const;
type Tab = (typeof TABS)[number];

export default function ProfileForm({ initial, onSave, onPreviewChange, loading }: ProfileFormProps) {
  const [tab, setTab] = useState<Tab>('Basic');
  const [fullName, setFullName] = useState(initial?.fullName || '');
  const [tagline, setTagline] = useState(initial?.tagline || '');
  const [bio, setBio] = useState(initial?.bio || '');
  const [profileImage, setProfileImage] = useState(initial?.profileImage || '');
  const [companies, setCompanies] = useState<CompanyEntry[]>(
    initial?.companies?.length ? initial.companies : [makeCompany()]
  );
  const [expandedCompany, setExpandedCompany] = useState<string>(companies[0]?.id || '');
  const [theme, setTheme] = useState<Theme>(initial?.theme || DEFAULT_THEME);

  // Notify parent for live preview
  useEffect(() => {
    onPreviewChange?.({ fullName, tagline, profileImage, companies, theme });
  }, [fullName, tagline, profileImage, companies, theme]);

  const handleSave = () => {
    if (!fullName.trim()) { toast.error('Name is required'); return; }
    if (companies.some(c => !c.name.trim())) { toast.error('Each company needs a name'); return; }
    onSave({ fullName, tagline, bio, profileImage, companies, theme });
  };

  // ── Company helpers ──
  const addCompany = () => {
    const c = makeCompany();
    setCompanies(prev => [...prev, c]);
    setExpandedCompany(c.id);
  };

  const removeCompany = (id: string) => {
    if (companies.length === 1) { toast.error('At least one company is required'); return; }
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  const updateCompany = (id: string, field: keyof Omit<CompanyEntry, 'id' | 'socialLinks'>, value: string) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // ── Social link helpers (per company) ──
  const updateSocialLink = (companyId: string, key: string, value: string) => {
    setCompanies(prev => prev.map(c =>
      c.id === companyId
        ? { ...c, socialLinks: { ...c.socialLinks, [key]: value } }
        : c
    ));
  };

  const addCustomLink = (companyId: string) => {
    const newLink: CustomLink = { id: generateId(), label: '', url: '' };
    setCompanies(prev => prev.map(c =>
      c.id === companyId
        ? { ...c, socialLinks: { ...c.socialLinks, customLinks: [...(c.socialLinks.customLinks || []), newLink] } }
        : c
    ));
  };

  const updateCustomLink = (companyId: string, linkId: string, field: 'label' | 'url', value: string) => {
    setCompanies(prev => prev.map(c =>
      c.id === companyId
        ? {
            ...c,
            socialLinks: {
              ...c.socialLinks,
              customLinks: (c.socialLinks.customLinks || []).map(l =>
                l.id === linkId ? { ...l, [field]: value } : l
              ),
            },
          }
        : c
    ));
  };

  const removeCustomLink = (companyId: string, linkId: string) => {
    setCompanies(prev => prev.map(c =>
      c.id === companyId
        ? { ...c, socialLinks: { ...c.socialLinks, customLinks: (c.socialLinks.customLinks || []).filter(l => l.id !== linkId) } }
        : c
    ));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === t ? 'bg-indigo-600 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Basic Tab ── */}
      {tab === 'Basic' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="John Smith"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            icon={<User className="w-4 h-4" />}
          />
          <Input
            label="Personal Tagline"
            placeholder="Designer & Brand Strategist"
            value={tagline}
            onChange={e => setTagline(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Bio</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 resize-none transition-all"
              rows={3}
              placeholder="Tell people about yourself..."
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </div>
          <ImageUploader
            label="Profile Image"
            value={profileImage}
            onChange={setProfileImage}
            shape="circle"
            bucket="avatars"
            folder="profiles"
          />
        </motion.div>
      )}

      {/* ── Companies Tab ── */}
      {tab === 'Companies' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/50">{companies.length} {companies.length === 1 ? 'company' : 'companies'}</p>
            <Button variant="secondary" size="sm" onClick={addCompany}>
              <Plus className="w-4 h-4" /> Add Company
            </Button>
          </div>

          <AnimatePresence>
            {companies.map((company, idx) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="border border-white/10 rounded-2xl overflow-hidden"
              >
                {/* Company header — click to expand/collapse */}
                <button
                  type="button"
                  onClick={() => setExpandedCompany(expandedCompany === company.id ? '' : company.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] transition-all text-left"
                >
                  {/* Logo or icon */}
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1cc, #8b5cf6aa)' }}>
                    {company.logo
                      ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                      : (company.name || `${idx+1}`).charAt(0).toUpperCase()
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {company.name || `Company ${idx + 1}`}
                    </p>
                    {company.tagline && (
                      <p className="text-white/40 text-xs truncate">{company.tagline}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Social count badge */}
                    {(() => {
                      const count = SOCIAL_KEYS.filter(k => company.socialLinks[k]).length
                        + (company.socialLinks.customLinks?.length || 0);
                      return count > 0 ? (
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                          {count} link{count !== 1 ? 's' : ''}
                        </span>
                      ) : null;
                    })()}
                    {expandedCompany === company.id
                      ? <ChevronUp className="w-4 h-4 text-white/40" />
                      : <ChevronDown className="w-4 h-4 text-white/40" />
                    }
                  </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedCompany === company.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-3 space-y-4 border-t border-white/5">
                        {/* Company details */}
                        <div className="space-y-3">
                          <Input
                            label="Company Name *"
                            placeholder="Smith Creative Studio"
                            value={company.name}
                            onChange={e => updateCompany(company.id, 'name', e.target.value)}
                            icon={<Building2 className="w-4 h-4" />}
                          />
                          <Input
                            label="Company Tagline"
                            placeholder="Design & Branding Agency"
                            value={company.tagline || ''}
                            onChange={e => updateCompany(company.id, 'tagline', e.target.value)}
                          />
                          <ImageUploader
                            label="Company Logo"
                            value={company.logo || ''}
                            onChange={url => updateCompany(company.id, 'logo', url)}
                            shape="square"
                            bucket="avatars"
                            folder="logos"
                          />
                        </div>

                        {/* Social links for this company */}
                        <div>
                          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                            Social Links
                          </p>
                          <div className="space-y-2">
                            {SOCIAL_KEYS.map(key => {
                              const config = SOCIAL_CONFIG[key];
                              const Icon = config.icon;
                              return (
                                <div key={key} className="relative">
                                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                                  </div>
                                  <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                                    placeholder={config.placeholder}
                                    value={(company.socialLinks[key] as string) || ''}
                                    onChange={e => updateSocialLink(company.id, key, e.target.value)}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom links for this company */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                              Custom Links
                            </p>
                            <button
                              onClick={() => addCustomLink(company.id)}
                              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(company.socialLinks.customLinks || []).map(link => (
                              <div key={link.id} className="flex gap-2">
                                <input
                                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500 text-sm"
                                  placeholder="Label"
                                  value={link.label}
                                  onChange={e => updateCustomLink(company.id, link.id, 'label', e.target.value)}
                                />
                                <input
                                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500 text-sm"
                                  placeholder="https://..."
                                  value={link.url}
                                  onChange={e => updateCustomLink(company.id, link.id, 'url', e.target.value)}
                                />
                                <button
                                  onClick={() => removeCustomLink(company.id, link.id)}
                                  className="text-red-400/60 hover:text-red-400 p-2 transition-colors flex-shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            {(company.socialLinks.customLinks || []).length === 0 && (
                              <p className="text-xs text-white/20 py-1">No custom links yet</p>
                            )}
                          </div>
                        </div>

                        {/* Remove company */}
                        {companies.length > 1 && (
                          <button
                            onClick={() => removeCompany(company.id)}
                            className="flex items-center gap-2 text-xs text-red-400/60 hover:text-red-400 transition-colors mt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove this company
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add company bottom CTA */}
          <button
            onClick={addCompany}
            className="w-full py-3 border border-dashed border-white/15 rounded-2xl text-white/40 hover:text-white/70 hover:border-white/30 transition-all text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Another Company
          </button>
        </motion.div>
      )}

      {/* ── Theme Tab ── */}
      {tab === 'Theme' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div>
            <p className="text-sm font-medium text-white/70 mb-3">Theme Presets</p>
            <div className="grid grid-cols-3 gap-2">
              {THEME_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => setTheme(t => ({ ...t, ...preset }))}
                  className="p-3 rounded-xl border border-white/10 hover:border-white/30 transition-all text-center"
                  style={{ background: preset.backgroundColor }}
                >
                  <div className="flex gap-1 justify-center mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: preset.primaryColor }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: preset.secondaryColor }} />
                  </div>
                  <span className="text-xs text-white/60">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Primary Color',   key: 'primaryColor' },
              { label: 'Secondary Color', key: 'secondaryColor' },
              { label: 'Background',      key: 'backgroundColor' },
              { label: 'Button Color',    key: 'buttonColor' },
              { label: 'Text Color',      key: 'textColor' },
            ].map(({ label, key }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">{label}</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <input
                    type="color"
                    value={(theme as unknown as Record<string, string>)[key]}
                    onChange={e => setTheme(t => ({ ...t, [key]: e.target.value }))}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs text-white/50 font-mono">
                    {(theme as unknown as Record<string, string>)[key]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm font-medium text-white/70 mb-2">Button Style</p>
            <div className="flex gap-2">
              {(['rounded', 'sharp', 'pill'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => setTheme(t => ({ ...t, cardStyle: style }))}
                  className={`flex-1 py-2 text-xs font-medium border transition-all capitalize ${
                    theme.cardStyle === style
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                      : 'border-white/10 text-white/50 hover:border-white/30'
                  } ${style === 'rounded' ? 'rounded-xl' : style === 'pill' ? 'rounded-full' : 'rounded-none'}`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-white/70 mb-2">Font Style</p>
            <div className="flex gap-2">
              {(['modern', 'classic', 'playful'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => setTheme(t => ({ ...t, fontStyle: style }))}
                  className={`flex-1 py-2 text-xs font-medium border rounded-xl transition-all capitalize ${
                    theme.fontStyle === style
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                      : 'border-white/10 text-white/50 hover:border-white/30'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <Button onClick={handleSave} loading={loading} className="w-full" size="lg">
        <Save className="w-5 h-5" /> Save Profile
      </Button>
    </div>
  );
}

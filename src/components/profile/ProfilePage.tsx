'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile, CompanyEntry } from '@/types';
import { SOCIAL_CONFIG, SOCIAL_KEYS } from '@/components/ui/SocialIcons';
import { formatUrl, getWhatsAppUrl, copyToClipboard, getProfileUrl } from '@/utils';
import { ExternalLink, Copy, Share2, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ACCENTS = ['#6366f1', '#8b5cf6', '#ec4899', '#0ea5e9', '#10b981', '#f97316'];

interface ProfilePageProps { profile: Profile }

export default function ProfilePage({ profile }: ProfilePageProps) {
  // null = companies list view, string = selected company id
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { theme } = profile;

  const fontClass = { modern: 'font-sans', classic: 'font-serif', playful: 'font-mono' }[theme.fontStyle];
  const cardRadius = { rounded: 'rounded-2xl', sharp: 'rounded-none', pill: 'rounded-full' }[theme.cardStyle];

  const selectedCompany = profile.companies.find(c => c.id === selectedId) ?? null;
  const selectedIndex   = profile.companies.findIndex(c => c.id === selectedId);
  const accent          = selectedIndex >= 0 ? ACCENTS[selectedIndex % ACCENTS.length] : theme.primaryColor;

  const handleShare = async () => {
    const url = getProfileUrl(profile.slug);
    if (navigator.share) await navigator.share({ title: profile.fullName, url });
    else { await copyToClipboard(url); toast.success('Link copied!'); }
  };

  const getLinkUrl = (key: string, value: string) => {
    if (key === 'email') return `mailto:${value}`;
    if (key === 'whatsapp') return getWhatsAppUrl(value);
    return formatUrl(value);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start py-10 px-4 ${fontClass}`}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${selectedCompany ? accent : theme.primaryColor}, ${theme.secondaryColor})` }}
      />

      <div className="relative z-10 w-full max-w-sm">

        {/* ── SCREEN 1: Profile header + companies list ── */}
        <AnimatePresence mode="wait">
          {!selectedCompany && (
            <motion.div
              key="companies"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              {/* Profile header */}
              <div className="flex flex-col items-center text-center mb-8">
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.05 }}
                  className="relative mb-4"
                >
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-2xl overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
                  >
                    {profile.profileImage
                      ? <img src={profile.profileImage} alt={profile.fullName} className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      : profile.fullName.charAt(0).toUpperCase()
                    }
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 flex items-center justify-center"
                    style={{ backgroundColor: theme.primaryColor, borderColor: theme.backgroundColor }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="text-2xl font-black mb-1" style={{ color: theme.textColor }}
                >
                  {profile.fullName}
                </motion.h1>

                {profile.tagline && (
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="text-xs opacity-50 mb-4" style={{ color: theme.textColor }}
                  >
                    {profile.tagline}
                  </motion.p>
                )}

                {/* Copy / Share */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                  className="flex gap-2"
                >
                  {[
                    { icon: Copy,   label: 'Copy Link', action: async () => { await copyToClipboard(getProfileUrl(profile.slug)); toast.success('Copied!'); } },
                    { icon: Share2, label: 'Share',     action: handleShare },
                  ].map(({ icon: Icon, label, action }) => (
                    <button key={label} onClick={action}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95"
                      style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor, border: `1px solid ${theme.primaryColor}40` }}
                    >
                      <Icon className="w-3 h-3" /> {label}
                    </button>
                  ))}
                </motion.div>
              </div>

              {/* Companies list — shown directly, no button needed */}
              <div className="space-y-3">
                {profile.companies.map((company, ci) => {
                  const a = ACCENTS[ci % ACCENTS.length];
                  const linkCount = SOCIAL_KEYS.filter(k => company.socialLinks[k]).length
                    + (company.socialLinks.customLinks?.length || 0);

                  return (
                    <motion.button
                      key={company.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + ci * 0.07 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedId(company.id)}
                      className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${a}22, ${a}0d)`,
                        border: `1px solid ${a}40`,
                        boxShadow: `0 4px 20px ${a}15`,
                      }}
                    >
                      <CompanyLogo logo={company.logo} name={company.name} accent={a} size="md" />

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: theme.textColor }}>
                          {company.name}
                        </p>
                        {company.tagline && (
                          <p className="text-xs truncate opacity-50" style={{ color: theme.textColor }}>
                            {company.tagline}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {linkCount > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: `${a}30`, color: a }}>
                            {linkCount}
                          </span>
                        )}
                        {/* Arrow right */}
                        <svg className="w-4 h-4 opacity-50" style={{ color: a }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="text-center text-xs opacity-20 mt-8" style={{ color: theme.textColor }}
              >
                {profile.scanCount} profile views · Powered by QR Profile Hub
              </motion.p>
            </motion.div>
          )}

          {/* ── SCREEN 2: Selected company social links ── */}
          {selectedCompany && (
            <motion.div
              key={`links-${selectedCompany.id}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              {/* Back button + company header */}
              <div className="flex items-center gap-3 mb-6">
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedId(null)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ background: `${accent}25`, border: `1px solid ${accent}40` }}
                >
                  <ArrowLeft className="w-4 h-4" style={{ color: accent }} />
                </motion.button>

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <CompanyLogo logo={selectedCompany.logo} name={selectedCompany.name} accent={accent} size="sm" />
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: theme.textColor }}>
                      {selectedCompany.name}
                    </p>
                    {selectedCompany.tagline && (
                      <p className="text-xs opacity-40 truncate" style={{ color: theme.textColor }}>
                        {selectedCompany.tagline}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="space-y-2.5">
                {SOCIAL_KEYS.filter(k => selectedCompany.socialLinks[k]).map((key, i) => {
                  const config = SOCIAL_CONFIG[key];
                  const Icon   = config.icon;
                  return (
                    <motion.a
                      key={key}
                      href={getLinkUrl(key, selectedCompany.socialLinks[key] as string)}
                      target={key !== 'email' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 w-full px-4 py-4 ${cardRadius} font-semibold text-white`}
                      style={{
                        background: `linear-gradient(135deg, ${theme.buttonColor}cc, ${theme.buttonColor}88)`,
                        border: `1px solid ${theme.buttonColor}35`,
                        boxShadow: `0 2px 16px ${theme.buttonColor}20`,
                      }}
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${config.color}25` }}>
                        <Icon className="w-5 h-5" style={{ color: config.color }} />
                      </div>
                      <span className="flex-1">{config.label}</span>
                      <ExternalLink className="w-4 h-4 opacity-35" />
                    </motion.a>
                  );
                })}

                {(selectedCompany.socialLinks.customLinks || []).map((link, i) => {
                  const base = SOCIAL_KEYS.filter(k => selectedCompany.socialLinks[k]).length;
                  return (
                    <motion.a
                      key={link.id}
                      href={formatUrl(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (base + i) * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 w-full px-4 py-4 ${cardRadius} font-semibold text-white`}
                      style={{
                        background: `linear-gradient(135deg, ${theme.buttonColor}cc, ${theme.buttonColor}88)`,
                        border: `1px solid ${theme.buttonColor}35`,
                      }}
                    >
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <LinkIcon className="w-5 h-5 opacity-60" />
                      </div>
                      <span className="flex-1">{link.label || link.url}</span>
                      <ExternalLink className="w-4 h-4 opacity-35" />
                    </motion.a>
                  );
                })}

                {SOCIAL_KEYS.filter(k => selectedCompany.socialLinks[k]).length === 0 &&
                  (selectedCompany.socialLinks.customLinks || []).length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center text-sm opacity-30 py-8" style={{ color: theme.textColor }}
                  >
                    No links added yet
                  </motion.p>
                )}
              </div>

              {/* Back to companies link at bottom */}
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                onClick={() => setSelectedId(null)}
                className="w-full mt-6 py-3 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}
              >
                <ArrowLeft className="w-4 h-4" /> Back to all companies
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Reusable logo with fallback ───────────────────────────────
function CompanyLogo({ logo, name, accent, size }: { logo?: string; name: string; accent: string; size: 'sm' | 'md' }) {
  const [err, setErr] = useState(false);
  const dim  = size === 'md' ? 'w-11 h-11' : 'w-8 h-8';
  const text = size === 'md' ? 'text-base' : 'text-xs';
  const rad  = size === 'md' ? 'rounded-xl' : 'rounded-lg';

  if (logo && !err) {
    return (
      <div className={`${dim} ${rad} overflow-hidden flex-shrink-0 border`}
        style={{ borderColor: `${accent}40` }}>
        <img src={logo} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />
      </div>
    );
  }

  return (
    <div className={`${dim} ${rad} flex items-center justify-center flex-shrink-0 font-black text-white ${text}`}
      style={{ background: `linear-gradient(135deg, ${accent}dd, ${accent}99)` }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Eye, ExternalLink, Download, Copy, Share2, ChevronDown, Building2, Link as LinkIcon } from 'lucide-react';
import QRGenerator from './QRGenerator';
import { Profile, CompanyEntry } from '@/types';
import { getProfileUrl, copyToClipboard, formatUrl, getWhatsAppUrl } from '@/utils';
import { SOCIAL_CONFIG, SOCIAL_KEYS } from '@/components/ui/SocialIcons';
import toast from 'react-hot-toast';

interface QRModalProps {
  profile: Profile;
  open: boolean;
  onClose: () => void;
}

type ModalTab = 'qr' | 'preview';

export default function QRModal({ profile, open, onClose }: QRModalProps) {
  const [tab, setTab] = useState<ModalTab>('qr');
  const url = getProfileUrl(profile.slug);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="bg-[#0f0f1a] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8">
              <h3 className="text-white font-bold text-lg">
                {profile.fullName}
              </h3>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 mx-6 mt-4 mb-1 bg-white/5 rounded-xl p-1">
              {([
                { id: 'qr' as ModalTab, icon: QrCode, label: 'QR Code' },
                { id: 'preview' as ModalTab, icon: Eye, label: 'Preview Profile' },
              ]).map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                    tab === t.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="px-6 pb-6 pt-3">
              <AnimatePresence mode="wait">
                {tab === 'qr' ? (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.18 }}
                  >
                    <QRGenerator
                      url={url}
                      profileName={profile.slug}
                      foreground={profile.theme.textColor}
                      background={profile.theme.backgroundColor}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ProfilePhonePreview profile={profile} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Inline phone-frame profile preview ──
function ProfilePhonePreview({ profile }: { profile: Profile }) {
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const { theme } = profile;

  const cardRadius = {
    rounded: 'rounded-xl',
    sharp: 'rounded-none',
    pill: 'rounded-full',
  }[theme.cardStyle];

  const getLinkUrl = (key: string, value: string) => {
    if (key === 'email') return `mailto:${value}`;
    if (key === 'whatsapp') return getWhatsAppUrl(value);
    return formatUrl(value);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Phone frame */}
      <div
        className="relative w-full rounded-[2rem] overflow-hidden border-2 border-white/15 shadow-2xl"
        style={{ maxHeight: '480px' }}
      >
        {/* Phone notch bar */}
        <div className="absolute top-0 left-0 right-0 h-7 z-10 flex items-center justify-center"
          style={{ background: theme.backgroundColor }}>
          <div className="w-16 h-1.5 bg-white/20 rounded-full" />
        </div>

        {/* Scrollable profile content */}
        <div
          className="overflow-y-auto"
          style={{
            backgroundColor: theme.backgroundColor,
            maxHeight: '480px',
            paddingTop: '28px',
          }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${theme.primaryColor}, ${theme.secondaryColor})` }}
          />

          <div className="relative px-4 py-6 flex flex-col items-center text-center">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white mb-3 overflow-hidden flex-shrink-0 shadow-xl"
              style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
            >
              {profile.profileImage
                ? <img src={profile.profileImage} alt={profile.fullName} className="w-full h-full object-cover" />
                : profile.fullName.charAt(0).toUpperCase()
              }
            </div>

            <p className="font-black text-base mb-0.5" style={{ color: theme.textColor }}>
              {profile.fullName}
            </p>
            {profile.tagline && (
              <p className="text-xs opacity-50 mb-4" style={{ color: theme.textColor }}>
                {profile.tagline}
              </p>
            )}

            {/* Copy / Share pills */}
            <div className="flex gap-2 mb-4">
              {[
                { icon: Copy, label: 'Copy Link' },
                { icon: Share2, label: 'Share' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: `${theme.primaryColor}20`, color: theme.primaryColor, border: `1px solid ${theme.primaryColor}40` }}
                >
                  <Icon className="w-3 h-3" /> {label}
                </div>
              ))}
            </div>

            {/* View All Links button */}
            <div
              className="w-full py-3 rounded-2xl text-white text-sm font-bold mb-5 flex items-center justify-center gap-2 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                boxShadow: `0 6px 24px ${theme.primaryColor}35`,
              }}
            >
              View All Links <ChevronDown className="w-4 h-4" />
            </div>

            {/* Companies */}
            <div className="w-full space-y-2.5">
              {profile.companies.map((company, ci) => {
                const activeLinks = SOCIAL_KEYS.filter(k => company.socialLinks[k]);
                const customLinks = company.socialLinks.customLinks || [];
                const totalLinks = activeLinks.length + customLinks.length;
                const isOpen = expandedCompany === company.id;

                return (
                  <div
                    key={company.id}
                    className="overflow-hidden"
                    style={{ borderRadius: '1rem', border: `1px solid ${theme.primaryColor}25` }}
                  >
                    {/* Company row */}
                    <button
                      onClick={() => setExpandedCompany(isOpen ? null : company.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-3 text-left transition-all"
                      style={{ background: `${theme.primaryColor}12` }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{ background: `${theme.primaryColor}30` }}
                      >
                        {company.logo
                          ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                          : <Building2 className="w-4 h-4" style={{ color: theme.primaryColor }} />
                        }
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-bold text-xs truncate" style={{ color: theme.textColor }}>
                          {company.name}
                        </p>
                        {company.tagline && (
                          <p className="text-xs opacity-40 truncate" style={{ color: theme.textColor }}>
                            {company.tagline}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {totalLinks > 0 && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                            style={{ background: `${theme.primaryColor}25`, color: theme.primaryColor }}
                          >
                            {totalLinks}
                          </span>
                        )}
                        <ChevronDown
                          className={`w-3.5 h-3.5 opacity-40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          style={{ color: theme.textColor }}
                        />
                      </div>
                    </button>

                    {/* Links */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-2.5 pb-2.5 pt-1 space-y-1.5">
                            {activeLinks.map(key => {
                              const config = SOCIAL_CONFIG[key];
                              const Icon = config.icon;
                              return (
                                <a
                                  key={key}
                                  href={getLinkUrl(key, company.socialLinks[key] as string)}
                                  target={key !== 'email' ? '_blank' : undefined}
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 ${cardRadius} text-white text-xs font-semibold transition-all hover:opacity-90`}
                                  style={{
                                    background: `${theme.buttonColor}bb`,
                                    border: `1px solid ${theme.buttonColor}35`,
                                  }}
                                >
                                  <div
                                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${config.color}25` }}
                                  >
                                    <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
                                  </div>
                                  <span className="flex-1">{config.label}</span>
                                  <ExternalLink className="w-3 h-3 opacity-30" />
                                </a>
                              );
                            })}
                            {customLinks.map(link => (
                              <a
                                key={link.id}
                                href={formatUrl(link.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2.5 w-full px-3 py-2.5 ${cardRadius} text-white text-xs font-semibold transition-all hover:opacity-90`}
                                style={{
                                  background: `${theme.buttonColor}bb`,
                                  border: `1px solid ${theme.buttonColor}35`,
                                }}
                              >
                                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                  <LinkIcon className="w-3.5 h-3.5 opacity-60" />
                                </div>
                                <span className="flex-1">{link.label}</span>
                                <ExternalLink className="w-3 h-3 opacity-30" />
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <p className="text-xs opacity-15 mt-5" style={{ color: theme.textColor }}>
              Powered by QR Profile Hub
            </p>
          </div>
        </div>
      </div>

      {/* Open full page link */}
      <a
        href={getProfileUrl(profile.slug)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open full profile page
      </a>
    </div>
  );
}

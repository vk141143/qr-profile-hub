'use client';
import { motion } from 'framer-motion';
import { Profile } from '@/types';
import { getProfileUrl, copyToClipboard } from '@/utils';
import { QrCode, Edit, Trash2, Eye, EyeOff, Copy, BarChart3, ExternalLink, Building2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ProfileCardProps {
  profile: Profile;
  onDelete: (id: string) => void;
  onTogglePublic: (id: string) => void;
  onShowQR: (profile: Profile) => void;
}

export default function ProfileCard({ profile, onDelete, onTogglePublic, onShowQR }: ProfileCardProps) {
  const url = getProfileUrl(profile.slug);

  const handleCopy = async () => {
    await copyToClipboard(url);
    toast.success('URL copied!');
  };

  const totalLinks = profile.companies.reduce((sum, c) => {
    const SOCIAL_KEYS = ['instagram','youtube','facebook','twitter','linkedin','website','whatsapp','telegram','email'] as const;
    return sum + SOCIAL_KEYS.filter(k => c.socialLinks[k]).length + (c.socialLinks.customLinks?.length || 0);
  }, 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white flex-shrink-0 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${profile.theme.primaryColor}, ${profile.theme.secondaryColor})` }}
        >
          {profile.profileImage
            ? <img src={profile.profileImage} alt={profile.fullName} className="w-full h-full object-cover" />
            : profile.fullName.charAt(0)
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold truncate">{profile.fullName}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${profile.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {profile.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
          {profile.tagline && (
            <p className="text-white/50 text-sm truncate">{profile.tagline}</p>
          )}
          <p className="text-xs text-white/30 font-mono mt-0.5">/u/{profile.slug}</p>
        </div>
      </div>

      {/* Companies summary */}
      {profile.companies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.companies.slice(0, 3).map(c => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1 text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white/50"
            >
              <Building2 className="w-3 h-3 text-indigo-400" />
              {c.name || 'Unnamed'}
            </span>
          ))}
          {profile.companies.length > 3 && (
            <span className="text-xs text-white/30 px-2 py-1">+{profile.companies.length - 3} more</span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-white/40 text-xs">
          <BarChart3 className="w-3.5 h-3.5" />
          {profile.scanCount} scans
        </div>
        <div className="flex items-center gap-1.5 text-white/40 text-xs">
          <Building2 className="w-3.5 h-3.5" />
          {profile.companies.length} {profile.companies.length === 1 ? 'company' : 'companies'}
        </div>
        <div className="flex items-center gap-1.5 text-white/40 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: profile.theme.primaryColor }} />
          {totalLinks} links
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 mt-4 flex-wrap">
        <Button variant="ghost" size="sm" onClick={() => onShowQR(profile)}>
          <QrCode className="w-4 h-4" /> QR
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          <Copy className="w-4 h-4" /> Copy
        </Button>
        <Link href={`/u/${profile.slug}`} target="_blank">
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4" /> View
          </Button>
        </Link>
        <Link href={`/dashboard/edit/${profile.id}`}>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" /> Edit
          </Button>
        </Link>
        <button
          onClick={() => onTogglePublic(profile.id)}
          className="ml-auto text-white/40 hover:text-white transition-colors p-1.5"
          title={profile.isPublic ? 'Make Private' : 'Make Public'}
        >
          {profile.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button
          onClick={() => onDelete(profile.id)}
          className="text-red-400/60 hover:text-red-400 transition-colors p-1.5"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

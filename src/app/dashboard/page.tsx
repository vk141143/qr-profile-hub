'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profileService';
import { Profile } from '@/types';
import ProfileCard from '@/components/dashboard/ProfileCard';
import QRModal from '@/components/qr/QRModal';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Plus, QrCode, Users, BarChart3, Zap } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [fetching, setFetching] = useState(true);
  const [qrProfile, setQrProfile] = useState<Profile | null>(null);

  const loadProfiles = useCallback(async () => {
    if (!user) return;
    try {
      const data = await profileService.getAll(user.id);
      setProfiles(data);
    } catch (err) {
      toast.error('Failed to load profiles');
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.push('/login'); return; }
    if (!isLoading && isAuthenticated) loadProfiles();
  }, [isAuthenticated, isLoading, loadProfiles, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this profile? This cannot be undone.')) return;
    try {
      await profileService.delete(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
      toast.success('Profile deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleTogglePublic = async (id: string) => {
    try {
      const updated = await profileService.togglePublic(id);
      if (updated) setProfiles(prev => prev.map(p => p.id === id ? updated : p));
    } catch {
      toast.error('Failed to update');
    }
  };

  if (isLoading || fetching) {
    return (
      <div className="min-h-screen bg-[#0a0a12]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-24 space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-44 w-full" />)}
        </div>
      </div>
    );
  }

  const totalScans = profiles.reduce((s, p) => s + p.scanCount, 0);

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Dashboard</h1>
            <p className="text-white/50 mt-1">
              {user?.name ? `Welcome, ${user.name}` : 'Manage your QR profiles'}
            </p>
          </div>
          <Link href="/dashboard/new">
            <Button size="md">
              <Plus className="w-4 h-4" /> New Profile
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users,    label: 'Profiles',    value: profiles.length },
            { icon: BarChart3, label: 'Total Scans', value: totalScans },
            { icon: Zap,      label: 'Active',       value: profiles.filter(p => p.isPublic).length },
          ].map(stat => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
              <stat.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Profiles list */}
        {profiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-3xl"
          >
            <QrCode className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">No profiles yet</h3>
            <p className="text-white/40 mb-6">Create your first QR profile to get started</p>
            <Link href="/dashboard/new">
              <Button><Plus className="w-4 h-4" /> Create Profile</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence>
              {profiles.map(profile => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onDelete={handleDelete}
                  onTogglePublic={handleTogglePublic}
                  onShowQR={setQrProfile}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {qrProfile && (
        <QRModal profile={qrProfile} open={!!qrProfile} onClose={() => setQrProfile(null)} />
      )}
    </div>
  );
}

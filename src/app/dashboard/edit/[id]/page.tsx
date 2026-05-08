'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { profileService } from '@/services/profileService';
import { Profile } from '@/types';
import ProfileForm from '@/components/dashboard/ProfileForm';
import ProfilePreview from '@/components/dashboard/ProfilePreview';
import Navbar from '@/components/layout/Navbar';
import QRModal from '@/components/qr/QRModal';
import Skeleton from '@/components/ui/Skeleton';
import { ArrowLeft, QrCode } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [previewData, setPreviewData] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    profileService.getById(params.id as string).then(p => {
      if (!p) { router.push('/dashboard'); return; }
      setProfile(p);
      setPreviewData(p);
    });
  }, [params.id, router]);

  const handleSave = async (data: Partial<Profile>) => {
    if (!profile) return;
    setLoading(true);
    try {
      await profileService.update(profile.id, data);
      toast.success('Profile updated!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a12]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 pt-24 space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white">Edit Profile</h1>
              <p className="text-white/50 text-sm">/u/{profile.slug}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowQR(true)}>
            <QrCode className="w-4 h-4" /> QR Code
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-6"
          >
            <ProfileForm
              initial={profile}
              onSave={handleSave}
              loading={loading}
              onPreviewChange={setPreviewData}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:block"
          >
            <p className="text-white/40 text-sm font-medium mb-4 text-center">Live Preview</p>
            <div className="sticky top-24">
              <ProfilePreview profile={previewData} />
            </div>
          </motion.div>
        </div>
      </div>

      <QRModal profile={profile} open={showQR} onClose={() => setShowQR(false)} />
    </div>
  );
}

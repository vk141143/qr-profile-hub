'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profileService';
import { Profile, DEFAULT_THEME } from '@/types';
import ProfileForm from '@/components/dashboard/ProfileForm';
import ProfilePreview from '@/components/dashboard/ProfilePreview';
import Navbar from '@/components/layout/Navbar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NewProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<Profile>>({
    fullName: '',
    tagline: '',
    profileImage: '',
    companies: [],
    theme: DEFAULT_THEME,
  });
  const router = useRouter();

  const handleSave = async (data: Partial<Profile>) => {
    if (!user) { toast.error('Not authenticated'); return; }
    setLoading(true);
    try {
      await profileService.create(user.id, data);
      toast.success('Profile created!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Create Profile</h1>
            <p className="text-white/50 text-sm">Set up your QR profile page</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-6"
          >
            <ProfileForm onSave={handleSave} loading={loading} onPreviewChange={setPreviewData} />
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
    </div>
  );
}

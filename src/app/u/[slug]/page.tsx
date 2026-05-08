import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { profileService } from '@/services/profileService';
import ProfilePage from '@/components/profile/ProfilePage';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await profileService.getBySlug(slug);
  if (!profile) return { title: 'Profile Not Found' };
  return {
    title: `${profile.fullName} — ${profile.companies[0]?.name || 'QR Profile Hub'}`,
    description: profile.tagline || profile.bio || `Connect with ${profile.fullName}`,
    openGraph: {
      title: profile.fullName,
      description: profile.tagline || `Connect with ${profile.fullName}`,
      type: 'profile',
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await profileService.getBySlug(slug);
  if (!profile || !profile.isPublic) notFound();

  // Fire-and-forget scan increment (non-blocking)
  profileService.incrementScan(slug).catch(() => {});

  return <ProfilePage profile={profile} />;
}

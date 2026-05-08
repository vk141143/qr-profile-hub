import { Profile, User, Theme, CardStyle, FontStyle, CompanyEntry } from '@/types';

export const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    slug: 'johnsmith',
    fullName: 'John Smith',
    tagline: 'Designer & Brand Strategist',
    bio: 'Helping brands tell their story through design. 10+ years of experience in visual identity and digital experiences.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    companies: [
      {
        id: 'c1',
        name: 'Smith Creative Studio',
        logo: '',
        tagline: 'Design & Branding',
        socialLinks: {
          instagram: 'https://instagram.com/smithcreative',
          linkedin: 'https://linkedin.com/company/smithcreative',
          website: 'https://smithcreative.design',
          email: 'hello@smithcreative.design',
          customLinks: [
            { id: 'cl1', label: 'Portfolio', url: 'https://portfolio.smithcreative.design' },
          ],
        },
      },
      {
        id: 'c2',
        name: 'John Smith Personal',
        logo: '',
        tagline: 'Personal Brand',
        socialLinks: {
          instagram: 'https://instagram.com/johnsmith',
          youtube: 'https://youtube.com/@johnsmith',
          twitter: 'https://twitter.com/johnsmith',
          whatsapp: '+1234567890',
          customLinks: [
            { id: 'cl2', label: 'Book a Call', url: 'https://calendly.com/johnsmith' },
          ],
        },
      },
    ],
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      backgroundColor: '#0f0f1a',
      buttonColor: '#6366f1',
      textColor: '#ffffff',
      cardStyle: 'rounded' as CardStyle,
      fontStyle: 'modern' as FontStyle,
      darkMode: true,
    },
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: 142,
  },
  {
    id: '2',
    slug: 'sarahjohnson',
    fullName: 'Sarah Johnson',
    tagline: 'Full-Stack Developer & Tech Lead',
    bio: 'Building scalable web applications and leading engineering teams.',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    companies: [
      {
        id: 'c3',
        name: 'Bloom Digital Agency',
        logo: '',
        tagline: 'Web & Mobile Development',
        socialLinks: {
          linkedin: 'https://linkedin.com/company/bloomdigital',
          website: 'https://bloomdigital.io',
          email: 'sarah@bloomdigital.io',
        },
      },
    ],
    theme: {
      primaryColor: '#ec4899',
      secondaryColor: '#f97316',
      backgroundColor: '#0a0a0f',
      buttonColor: '#ec4899',
      textColor: '#ffffff',
      cardStyle: 'pill' as CardStyle,
      fontStyle: 'modern' as FontStyle,
      darkMode: true,
    },
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: 89,
  },
];

export const MOCK_USER: User = {
  id: 'user_1',
  email: 'demo@qrprofilehub.com',
  name: 'Demo User',
  profiles: MOCK_PROFILES,
  createdAt: new Date().toISOString(),
};

export const THEME_PRESETS: (Theme & { name: string })[] = [
  { name: 'Indigo Night', primaryColor: '#6366f1', secondaryColor: '#8b5cf6', backgroundColor: '#0f0f1a', buttonColor: '#6366f1', textColor: '#ffffff', cardStyle: 'rounded', fontStyle: 'modern', darkMode: true },
  { name: 'Rose Gold',    primaryColor: '#ec4899', secondaryColor: '#f97316', backgroundColor: '#0a0a0f', buttonColor: '#ec4899', textColor: '#ffffff', cardStyle: 'pill',    fontStyle: 'modern', darkMode: true },
  { name: 'Ocean Blue',  primaryColor: '#0ea5e9', secondaryColor: '#06b6d4', backgroundColor: '#020617', buttonColor: '#0ea5e9', textColor: '#ffffff', cardStyle: 'rounded', fontStyle: 'classic', darkMode: true },
  { name: 'Emerald',     primaryColor: '#10b981', secondaryColor: '#34d399', backgroundColor: '#022c22', buttonColor: '#10b981', textColor: '#ffffff', cardStyle: 'rounded', fontStyle: 'modern', darkMode: true },
  { name: 'Sunset',      primaryColor: '#f97316', secondaryColor: '#eab308', backgroundColor: '#1c0a00', buttonColor: '#f97316', textColor: '#ffffff', cardStyle: 'rounded', fontStyle: 'playful', darkMode: true },
  { name: 'Clean White', primaryColor: '#6366f1', secondaryColor: '#8b5cf6', backgroundColor: '#f8fafc', buttonColor: '#6366f1', textColor: '#1e293b', cardStyle: 'rounded', fontStyle: 'modern', darkMode: false },
];

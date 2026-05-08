export interface CustomLink {
  id: string;
  label: string;
  url: string;
}

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  whatsapp?: string;
  telegram?: string;
  email?: string;
  customLinks?: CustomLink[];
}

// A company entry with its own social links
export interface CompanyEntry {
  id: string;
  name: string;
  logo?: string;
  tagline?: string;
  socialLinks: SocialLinks;
}

export type CardStyle = 'rounded' | 'sharp' | 'pill';
export type FontStyle = 'modern' | 'classic' | 'playful';

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textColor: string;
  cardStyle: CardStyle;
  fontStyle: FontStyle;
  darkMode: boolean;
}

export interface Profile {
  id: string;
  slug: string;
  fullName: string;
  tagline?: string;
  bio?: string;
  profileImage?: string;
  // Multiple companies, each with their own social links
  companies: CompanyEntry[];
  theme: Theme;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  scanCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profiles: Profile[];
  createdAt: string;
}

export interface QRCodeConfig {
  id: string;
  profileId: string;
  url: string;
  style: 'classic' | 'rounded' | 'dots';
  foregroundColor: string;
  backgroundColor: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const DEFAULT_THEME: Theme = {
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  backgroundColor: '#0f0f1a',
  buttonColor: '#6366f1',
  textColor: '#ffffff',
  cardStyle: 'rounded',
  fontStyle: 'modern',
  darkMode: true,
};

export function makeCompany(overrides?: Partial<CompanyEntry>): CompanyEntry {
  return {
    id: Math.random().toString(36).slice(2, 9),
    name: '',
    logo: '',
    tagline: '',
    socialLinks: {},
    ...overrides,
  };
}

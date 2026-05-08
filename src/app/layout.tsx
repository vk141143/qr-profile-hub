import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QR Profile Hub — Smart Digital Business Cards',
  description: 'Create a stunning digital profile page with all your links and generate a QR code to share your entire digital presence instantly.',
  keywords: ['QR code', 'digital business card', 'link in bio', 'profile page'],
  openGraph: {
    title: 'QR Profile Hub',
    description: 'Your digital identity, one QR away.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a12] text-white antialiased`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

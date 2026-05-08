import Link from 'next/link';
import { QrCode } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-indigo-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <QrCode className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <p className="text-white/50 text-lg mb-8">This profile doesn&apos;t exist or has been made private.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
          Go Home
        </Link>
      </div>
    </div>
  );
}

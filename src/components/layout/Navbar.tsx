'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { QrCode, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="hidden sm:block">QR Profile Hub</span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Button>
              </Link>
              <Button variant="secondary" size="sm" onClick={() => logout()}>
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Get Started Free</Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex flex-col gap-3"
          >
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" onClick={() => { logout().then(() => setOpen(false)); }}>
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">Login</Button>
                </Link>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full">Get Started Free</Button>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

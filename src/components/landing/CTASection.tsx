'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight, QrCode } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-28 px-4 sm:px-6 bg-[#0a0a12]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center relative"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 rounded-3xl blur-xl" />

        <div className="relative bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border border-indigo-500/20 rounded-3xl p-12 sm:p-16">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30"
          >
            <QrCode className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Ready to go digital?
          </h2>
          <p className="text-white/55 text-lg mb-10 max-w-lg mx-auto">
            Join thousands of professionals sharing their digital identity with a single scan.
            Free to start, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/30"
              >
                Create Your Free Profile <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/u/johnsmith">
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#080810] border-t border-white/5 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 text-white font-bold text-lg">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            QR Profile Hub
          </div>

          <div className="flex items-center gap-6 text-white/40 text-sm">
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/u/johnsmith" className="hover:text-white transition-colors">
              Demo
            </Link>
          </div>

          <p className="text-white/25 text-sm">
            © {new Date().getFullYear()} QR Profile Hub
          </p>
        </div>
      </div>
    </footer>
  );
}

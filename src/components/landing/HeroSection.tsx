'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight, Sparkles, QrCode, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Layered background */}
      <div className="absolute inset-0 bg-[#0a0a12]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-600/15 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-pink-600/8 rounded-full blur-[100px]" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 text-indigo-300 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          Smart Digital Business Cards — Free to Start
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
        >
          Your Digital Identity,
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            One QR Away
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/55 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Create a stunning profile page with all your links, generate a QR code,
          and share your entire digital presence in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link href="/login">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all"
            >
              Create Your QR Profile <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/u/johnsmith">
            <Button variant="glass" size="lg" className="w-full sm:w-auto">
              <QrCode className="w-5 h-5" /> View Demo Profile
            </Button>
          </Link>
        </motion.div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Fade bottom */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a12] to-transparent z-10 pointer-events-none rounded-b-3xl" />

          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Phone mockup */}
              <div className="flex-shrink-0 flex justify-center">
                <PhoneMockup />
              </div>

              {/* Stats grid */}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Profiles Created', value: '12,400+', color: 'text-indigo-400' },
                    { label: 'QR Scans', value: '890K+', color: 'text-violet-400' },
                    { label: 'Countries', value: '45+', color: 'text-pink-400' },
                    { label: 'Avg Load Time', value: '<1s', color: 'text-emerald-400' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center hover:border-white/10 transition-all"
                    >
                      <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {['QR Code', 'Custom Theme', 'All Links', 'Analytics', 'Mobile First', 'Instant Setup'].map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/60"
                    >
                      <Zap className="w-3 h-3 text-indigo-400" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-52 h-[22rem] bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] rounded-[2.8rem] border-2 border-white/20 shadow-2xl overflow-hidden"
    >
      {/* Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-white/20 rounded-full" />

      {/* Screen content */}
      <div className="p-4 pt-9 flex flex-col items-center gap-2.5">
        {/* Avatar */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/40"
        />
        <div className="w-28 h-2.5 bg-white/30 rounded-full" />
        <div className="w-20 h-2 bg-white/15 rounded-full" />

        {/* CTA button */}
        <div className="w-full h-9 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl mt-1 flex items-center justify-center">
          <div className="w-20 h-2 bg-white/50 rounded-full" />
        </div>

        {/* Link buttons */}
        {[
          { color: '#E1306C', label: 'Instagram' },
          { color: '#0A66C2', label: 'LinkedIn' },
          { color: '#25D366', label: 'WhatsApp' },
        ].map((s) => (
          <div
            key={s.label}
            className="w-full h-9 rounded-xl flex items-center px-3 gap-2"
            style={{ background: `${s.color}22`, border: `1px solid ${s.color}44` }}
          >
            <div className="w-4 h-4 rounded-full" style={{ background: s.color }} />
            <div className="w-14 h-1.5 bg-white/25 rounded-full" />
          </div>
        ))}
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-indigo-600/20 to-transparent" />
    </motion.div>
  );
}

'use client';
import { motion } from 'framer-motion';
import { QrCode, Palette, Share2, BarChart3, Smartphone, Zap } from 'lucide-react';

const features = [
  {
    icon: QrCode,
    title: 'Smart QR Codes',
    desc: 'Generate high-quality QR codes that link directly to your profile. Download as PNG or SVG for print.',
    color: 'from-indigo-500 to-violet-500',
    glow: 'shadow-indigo-500/20',
  },
  {
    icon: Palette,
    title: 'Custom Themes',
    desc: 'Personalize every color, font, and style. Choose from presets or build your own brand identity.',
    color: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/20',
  },
  {
    icon: Share2,
    title: 'All Your Links',
    desc: 'Instagram, LinkedIn, YouTube, WhatsApp — all in one beautiful, shareable profile page.',
    color: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-500/20',
  },
  {
    icon: BarChart3,
    title: 'Scan Analytics',
    desc: 'Track how many times your QR code has been scanned and monitor your profile engagement.',
    color: 'from-green-500 to-emerald-500',
    glow: 'shadow-green-500/20',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    desc: 'Designed for mobile. Looks stunning on every device — iPhone, Android, tablet, and desktop.',
    color: 'from-sky-500 to-cyan-500',
    glow: 'shadow-sky-500/20',
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    desc: 'Create your profile in under 2 minutes. No technical skills required. Share immediately.',
    color: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/20',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-28 px-4 sm:px-6 bg-[#0a0a12] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium mb-4">
            Everything included
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Everything you need to
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              {' '}stand out
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            A complete digital identity platform for creators, professionals, and businesses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/[0.05] transition-all cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg ${f.glow} group-hover:scale-110 transition-transform`}
              >
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

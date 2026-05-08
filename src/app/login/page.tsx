'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { QrCode, Mail, Lock, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    if (mode === 'signup' && !name.trim()) { toast.error('Name is required'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);

    if (mode === 'login') {
      const { error } = await login(email, password);
      setLoading(false);
      if (error) { toast.error(error); return; }
      toast.success('Welcome back!');
      router.push('/dashboard');
    } else {
      const { error } = await signup(email, password, name);
      setLoading(false);
      if (error) { toast.error(error); return; }
      toast.success('Account created! Check your email to confirm.');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-xl mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            QR Profile Hub
          </Link>
          <h1 className="text-3xl font-black text-white">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-white/50 mt-2">
            {mode === 'login' ? 'Sign in to manage your profiles' : 'Start building your QR profile'}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
          {/* Mode switcher */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
            {(['login', 'signup'] as AuthMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${
                  mode === m ? 'bg-indigo-600 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  icon={<User className="w-4 h-4" />}
                />
              )}
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
              />

              <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-white/30 text-sm mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

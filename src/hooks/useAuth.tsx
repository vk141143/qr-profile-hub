'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@/types';
import { getSupabase } from '@/lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function supabaseUserToUser(sbUser: any): User {
  return {
    id: sbUser.id,
    email: sbUser.email ?? '',
    name: sbUser.user_metadata?.name ?? sbUser.email?.split('@')[0] ?? 'User',
    profiles: [],
    createdAt: sbUser.created_at ?? new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const supabase = getSupabase();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setState({ user: supabaseUserToUser(session.user), isAuthenticated: true, isLoading: false });
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setState({ user: supabaseUserToUser(session.user), isAuthenticated: true, isLoading: false });
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ error: string | null }> => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const logout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

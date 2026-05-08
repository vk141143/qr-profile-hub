import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = 'https://ldlcwpfynawrqveffsyp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkbGN3cGZ5bmF3cnF2ZWZmc3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMjEwNzMsImV4cCI6MjA5Mzc5NzA3M30.dzrPHGNbQ7_CZdGuAtIhvM4buw-Xxa7rQTB5yvSejn8';

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

let client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!client) client = createClient();
  return client;
}

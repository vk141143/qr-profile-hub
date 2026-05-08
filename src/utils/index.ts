import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .slice(0, 30);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function getProfileUrl(slug: string): string {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://yourdomain.com';
  return `${base}/u/${slug}`;
}

export function formatUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

export function getWhatsAppUrl(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return `https://wa.me/${cleaned}`;
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

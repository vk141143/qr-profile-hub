'use client';
import { useState, useRef } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Upload, Link, X, Loader2, ImageIcon } from 'lucide-react';
import { cn } from '@/utils';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  shape?: 'circle' | 'square';
  bucket?: string;       // supabase storage bucket name
  folder?: string;       // subfolder inside bucket
}

type InputMode = 'url' | 'upload';

export default function ImageUploader({
  label,
  value,
  onChange,
  shape = 'square',
  bucket = 'avatars',
  folder = 'uploads',
}: ImageUploaderProps) {
  const [mode, setMode] = useState<InputMode>('url');
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const [imgError, setImgError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const previewClass = shape === 'circle'
    ? 'w-20 h-20 rounded-full'
    : 'w-20 h-20 rounded-xl';

  // ── URL mode: apply on blur or Enter ──
  const applyUrl = () => {
    setImgError(false);
    onChange(urlInput.trim());
  };

  // ── Upload mode: upload file to Supabase Storage ──
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size (max 5 MB)
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5 MB'); return; }

    setUploading(true);
    try {
      const supabase = getSupabase();
      const ext = file.name.split('.').pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true, contentType: file.type });

      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
      setUrlInput(data.publicUrl);
      setImgError(false);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
    setImgError(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white/70">{label}</label>

      <div className="flex gap-3 items-start">
        {/* Preview */}
        <div className="flex-shrink-0 relative">
          <div
            className={cn(
              previewClass,
              'bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center'
            )}
          >
            {value && !imgError ? (
              <img
                src={value}
                alt="preview"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <ImageIcon className="w-7 h-7 text-white/20" />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>
          {value && (
            <button
              onClick={clearImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>

        {/* Input area */}
        <div className="flex-1 space-y-2">
          {/* Mode toggle */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setMode('url')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all',
                mode === 'url' ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white'
              )}
            >
              <Link className="w-3 h-3" /> URL
            </button>
            <button
              onClick={() => setMode('upload')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all',
                mode === 'upload' ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white'
              )}
            >
              <Upload className="w-3 h-3" /> Upload
            </button>
          </div>

          {/* URL input */}
          {mode === 'url' && (
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500 text-sm transition-all"
              placeholder="https://example.com/image.png"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onBlur={applyUrl}
              onKeyDown={e => e.key === 'Enter' && applyUrl()}
            />
          )}

          {/* File upload */}
          {mode === 'upload' && (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl px-3 py-3 text-white/40 hover:text-white hover:border-white/40 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="w-4 h-4" /> Click to upload image</>
              )}
            </button>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <p className="text-xs text-white/25">JPG, PNG, GIF, WebP · max 5 MB</p>
        </div>
      </div>
    </div>
  );
}

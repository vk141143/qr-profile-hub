-- ============================================================
--  Supabase Storage — Image Upload Setup
--  Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. Create the storage bucket ─────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,                          -- public bucket so images load without auth
  5242880,                       -- 5 MB max per file
  array['image/jpeg','image/jpg','image/png','image/gif','image/webp','image/svg+xml']
)
on conflict (id) do update set
  public            = true,
  file_size_limit   = 5242880,
  allowed_mime_types = array['image/jpeg','image/jpg','image/png','image/gif','image/webp','image/svg+xml'];

-- ── 2. Storage RLS policies ───────────────────────────────────

-- Anyone can view/download images (public bucket)
create policy "Public read access on avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Authenticated users can upload their own images
create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
  );

-- Users can update/replace their own uploads
create policy "Users can update own avatars"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own uploads
create policy "Users can delete own avatars"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

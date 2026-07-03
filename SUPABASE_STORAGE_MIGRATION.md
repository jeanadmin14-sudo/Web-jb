# Migrasi Gambar ke Supabase Storage

Tujuan: database hanya menyimpan URL gambar, bukan base64 panjang. Ini mengurangi `Fast Origin Transfer`, ukuran response API, dan beban ISR.

## 1. Buat bucket Storage

Di Supabase SQL Editor, jalankan:

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'jbjean-images',
  'jbjean-images',
  true,
  4194304,
  array['image/webp', 'image/png', 'image/jpeg', 'image/jpg']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read JBJean images"
on storage.objects for select
using (bucket_id = 'jbjean-images');
```

Jangan buat policy public insert/upload. Upload dilakukan oleh API admin memakai service role key.

## 2. Isi environment variable

Di Vercel Project Settings -> Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key-dari-supabase
SUPABASE_SERVICE_ROLE_KEY=service-role-key-dari-supabase
```

`SUPABASE_SERVICE_ROLE_KEY` jangan pernah dipasang dengan prefix `NEXT_PUBLIC_`.

## 3. Deploy ulang

Setelah env terisi, deploy ulang project. Saat admin upload gambar produk, partner, atau galeri:

- browser mengompres gambar ke WebP,
- file dikirim ke `/api/media/upload`,
- API mengecek session admin,
- server upload ke bucket `jbjean-images`,
- database menyimpan URL publik Supabase.

## 4. Membersihkan data lama

Produk lama yang gambarnya masih base64 perlu diedit ulang dari dashboard dan upload ulang gambar. Setelah disimpan, kolom `image_url` dan `gallery` akan berisi URL Supabase.


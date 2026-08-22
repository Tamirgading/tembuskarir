-- 2026-08-21T02-00-00_session_nonce.sql
-- Anti-sharing: device nonce untuk memastikan 1 akun = 1 perangkat aktif.
-- Di-set ulang setiap login; halaman menolak jika cookie tidak cocok.

alter table public.users add column if not exists session_nonce text;

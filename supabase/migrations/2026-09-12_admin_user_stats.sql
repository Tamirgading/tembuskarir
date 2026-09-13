-- ============================================================
-- Statistik user untuk halaman admin/users
-- ============================================================
-- View agregat per user: jumlah sesi ujian + total spending (transaksi paid).
-- Dipakai untuk sorting "paling banyak mencoba" / "paling banyak spending".

create or replace view public.admin_user_stats as
select
  u.id                                                   as user_id,
  coalesce(a.attempt_count, 0)::int                      as attempt_count,
  coalesce(s.paid_count, 0)::int                         as paid_count,
  coalesce(s.total_spending, 0)::bigint                  as total_spending
from public.users u
left join (
  select user_id, count(*) as attempt_count
  from public.attempts
  group by user_id
) a on a.user_id = u.id
left join (
  select user_id, count(*) as paid_count, sum(amount) as total_spending
  from public.subscriptions
  where status = 'paid'
  group by user_id
) s on s.user_id = u.id;

-- Hanya boleh diakses lewat service role (admin server-side)
revoke all on public.admin_user_stats from anon, authenticated;
grant select on public.admin_user_stats to service_role;

create index if not exists attempts_user_id_idx on public.attempts (user_id);
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);

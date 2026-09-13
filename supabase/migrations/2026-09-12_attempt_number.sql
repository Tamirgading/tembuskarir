-- ============================================================
-- Nomor percobaan (attempt number) per user + paket
-- ============================================================
-- Disimpan sebagai kolom agar bisa difilter & diurutkan langsung di query,
-- dan tidak terpengaruh batas 1000 baris PostgREST.

alter table public.attempts
  add column if not exists attempt_number int;

-- Backfill attempt_number untuk data lama
with numbered as (
  select id,
         row_number() over (partition by user_id, package_id order by started_at asc, id asc) as rn
  from public.attempts
)
update public.attempts a
set attempt_number = n.rn
from numbered n
where a.id = n.id
  and (a.attempt_number is null or a.attempt_number <> n.rn);

-- Isi otomatis untuk attempt baru
create or replace function public.set_attempt_number()
returns trigger
language plpgsql
as $$
begin
  if new.attempt_number is null then
    select count(*) + 1
      into new.attempt_number
      from public.attempts
     where user_id = new.user_id
       and package_id = new.package_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_attempt_number on public.attempts;
create trigger trg_set_attempt_number
  before insert on public.attempts
  for each row execute function public.set_attempt_number();

create index if not exists attempts_user_pkg_attempt_idx
  on public.attempts (user_id, package_id, attempt_number);

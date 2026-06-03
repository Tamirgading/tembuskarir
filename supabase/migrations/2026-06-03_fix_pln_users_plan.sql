-- ================================================================
-- Fix: Reset users.plan yang salah di-set oleh bug webhook PLN
--
-- Bug: webhook lama meng-update users.plan='premium' untuk semua
-- langganan, termasuk PLN (pln_gat_monthly / pln_tahap2 / pln_complete).
-- Akibatnya PLN subscriber mendapat akses ke semua paket premium.
--
-- Fix: hanya user yang TIDAK punya langganan premium generik aktif
-- yang di-reset ke 'free'. User dengan premium generik aktif dibiarkan.
-- ================================================================

-- ── Preview dulu (jalankan ini untuk lihat siapa yang akan terpengaruh) ──
SELECT
  u.id,
  u.email,
  u.plan,
  u.plan_expires_at,
  (
    SELECT STRING_AGG(s.plan_type || ' (' || s.status || ')', ', ')
    FROM public.subscriptions s
    WHERE s.user_id = u.id
  ) AS semua_langganan
FROM public.users u
WHERE
  u.plan = 'premium'
  -- Tidak punya langganan Premium generik yang masih aktif
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = u.id
      AND s.plan_type IN ('premium_monthly', 'premium_quarterly', 'monthly', 'yearly')
      AND s.status = 'paid'
      AND s.expires_at > NOW()
  );

-- ── Jalankan reset setelah preview di atas terlihat benar ─────────────────
UPDATE public.users u
SET
  plan            = 'free',
  plan_expires_at = NULL
WHERE
  u.plan = 'premium'
  -- Tidak punya langganan Premium generik yang masih aktif
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = u.id
      AND s.plan_type IN ('premium_monthly', 'premium_quarterly', 'monthly', 'yearly')
      AND s.status = 'paid'
      AND s.expires_at > NOW()
  );

-- ── Verifikasi setelah update ─────────────────────────────────────────────
SELECT
  plan,
  COUNT(*) AS jumlah_user
FROM public.users
GROUP BY plan
ORDER BY plan;

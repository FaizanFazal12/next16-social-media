// pg ≥ 8.13 deprecates the `sslmode=prefer|require|verify-ca` aliases for
// `verify-full`. They keep working today but emit a security warning, and
// pg v9 will adopt looser libpq semantics. Rewrite to explicit `verify-full`
// so the warning goes away and behavior is locked in.
//
// Neon / Supabase / Vercel Postgres ship trusted certs, so `verify-full` is
// the right default for remote hosts. Local PostgreSQL instances (like the
// Docker container in this repo) do not expose TLS and must use `sslmode=disable`.
// Only an explicit `sslmode=disable` is left as-is; weak modes are still
// upgraded so remote URLs never skip server-certificate verification.
export function normalizeDatabaseUrl(url: string): string {
  const u = new URL(url);
  const sslmode = u.searchParams.get('sslmode');

  if (sslmode === 'disable') {
    return u.toString();
  }

  if (!sslmode) {
    const hostname = u.hostname.toLowerCase();
    const isLocalHost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.endsWith('.local');

    if (isLocalHost) {
      u.searchParams.set('sslmode', 'disable');
      return u.toString();
    }
  }

  u.searchParams.set('sslmode', 'verify-full');
  return u.toString();
}

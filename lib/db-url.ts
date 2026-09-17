// pg ≥ 8.13 deprecates the `sslmode=prefer|require|verify-ca` aliases for
// `verify-full`. They keep working today but emit a security warning, and
// pg v9 will adopt looser libpq semantics. Rewrite to explicit `verify-full`
// so the warning goes away and behavior is locked in.
//
// Neon / Supabase / Vercel Postgres ship trusted certs, so `verify-full` is
// the right default for remote hosts. Local PostgreSQL instances (like the
// Docker container in this repo) do not expose TLS and must use `sslmode=disable`.
// Explicit `sslmode` values always win so local teams can override the defaults.
export function normalizeDatabaseUrl(url: string): string {
  const u = new URL(url);

  if (u.searchParams.has('sslmode')) {
    return u.toString();
  }

  const hostname = u.hostname.toLowerCase();
  const isLocalHost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.endsWith('.local');

  u.searchParams.set('sslmode', isLocalHost ? 'disable' : 'verify-full');
  return u.toString();
}

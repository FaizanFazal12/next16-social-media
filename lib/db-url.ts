// pg ≥ 8.13 deprecates the `sslmode=prefer|require|verify-ca` aliases for
// `verify-full`. They keep working today but emit a security warning, and
// pg v9 will adopt looser libpq semantics. Rewrite to explicit `verify-full`
// so the warning goes away and behavior is locked in.
//
// Neon / Supabase / Vercel Postgres ship trusted certs, so `verify-full` is
// the right default. Exception: an explicit `sslmode=disable` is left as-is so
// a local or CI Postgres without TLS (the service container in e2e.yml) can
// connect; remote URLs never set `disable`, so they still get `verify-full`.
export function normalizeDatabaseUrl(url: string): string {
  const u = new URL(url);
  if (u.searchParams.get('sslmode') !== 'disable') {
    u.searchParams.set('sslmode', 'verify-full');
  }
  return u.toString();
}

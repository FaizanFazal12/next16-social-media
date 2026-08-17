import { Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { EmptyState } from '@/components/ui/empty-state';
import ErrorBoundary from '@/components/ui/error-boundary';
import { PageHeader } from '@/components/ui/page-header';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { Search } from '@/features/search/components/search';
import { SearchResults } from '@/features/search/components/search-results';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
};

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <div>
      <PageHeader back title="Search" />
      <Search>
        <ErrorBoundary title="Search is taking a breather">
          <Suspense fallback={<DropListSkeleton count={3} />}>
            <Crossfade>
              {searchParams.then(sp => {
                const q = typeof sp.q === 'string' ? sp.q : '';
                if (!q) return <EmptyState title="Search drops" body="Type something to search." />;
                return <SearchResults query={q} />;
              })}
            </Crossfade>
          </Suspense>
        </ErrorBoundary>
      </Search>
    </div>
  );
}

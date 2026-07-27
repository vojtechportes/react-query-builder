import type { ISiteSearchResult } from './site-search-result';

export type SiteSearchHook = (query: string) => ISiteSearchResult[];

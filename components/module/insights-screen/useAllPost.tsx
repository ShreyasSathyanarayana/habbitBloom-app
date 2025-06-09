// src/hooks/usePosts.ts

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostsWithDetails } from "@/api/api";

const PAGE_SIZE = 10;

export function usePosts() {
  return useInfiniteQuery({
    queryKey: ["all-posts"],
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) =>
      await getPostsWithDetails({ page: pageParam, pageSize: PAGE_SIZE }),
    getNextPageParam: (lastPage: any[], allPages: any[]) => {
      // If lastPage has data, fetch next page
      if (lastPage.length < PAGE_SIZE) return undefined; // no more pages
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
}

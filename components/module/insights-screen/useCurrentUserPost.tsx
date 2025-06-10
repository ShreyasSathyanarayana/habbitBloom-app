// src/hooks/usePosts.ts

import { useInfiniteQuery } from "@tanstack/react-query";
import { getCurrentUserPostsWithDetails } from "@/api/api";

const PAGE_SIZE = 10;

type Props = {
  userId: string;
};

export function useMyPosts({ userId }: Props) {
  return useInfiniteQuery({
    queryKey: ["my-posts"],
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) =>
      await getCurrentUserPostsWithDetails({
        page: pageParam,
        pageSize: PAGE_SIZE,
        currentUserId: userId,
      }),
    getNextPageParam: (lastPage: any[], allPages: any[]) => {
      // If lastPage has data, fetch next page
      if (lastPage.length < PAGE_SIZE) return undefined; // no more pages
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
}

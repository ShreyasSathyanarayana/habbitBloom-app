import { getPaginatedNestedComments, PostCommentDetails } from "@/api/api";
import { useInfiniteQuery } from "@tanstack/react-query";


const PAGE_SIZE = 10;

export function useComments(postId: string) {
  return useInfiniteQuery<PostCommentDetails[], Error>({
    queryKey: ["comments", postId],
    queryFn: async (context) => {
      const pageParam  = context.pageParam ?? 1;
      return await getPaginatedNestedComments(postId, pageParam as number);
    },
    getNextPageParam: (lastPage, allPages) => {
      // If the last page returned less than PAGE_SIZE comments, there's no more data
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length + 1; // next page number
    },
    initialPageParam:1
  });
}

import { cache } from "react";
import { db } from "@/db/index";
import type { Comment } from "@prisma/client";

export type CommentWithAuthor = Comment & {
  user: { name: string; image: string | null };
};

export const fetchCommentByPostId = cache(
  (postId: string): Promise<CommentWithAuthor[]> => {
    return db.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }
);

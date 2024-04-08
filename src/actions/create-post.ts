"use server";
import { auth } from "@/auth";
import { z } from "zod";
import type { Post } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "@/db/index";
import paths from "@/paths";
import { revalidatePath } from "next/cache";

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

interface CreatePostFormState {
  title?: string[];
  content?: string[];
  _form?: string;
}

export async function createPost(
  slug: string,
  formState: CreatePostFormState,
  formData: any
): Promise<CreatePostFormState> {
  // Validation Check
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  // Auth Check
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this."],
      },
    };
  }

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const topic = await db.topic.findFirst({
    where: {
      slug,
    },
  });

  // Topic doesn't exist
  if (!topic) {
    return {
      errors: {
        _form: ["Topic not found."],
      },
    };
  }

  let post: Post;
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id,
      },
    });
  } catch (err: unknown) {
    // General Errors
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }

  revalidatePath(paths.topicShow(slug));
  redirect(paths.postShow(slug, post.id));

  return {
    errors: {},
  };

  // TODO: validate

  // TODO: revalidate the homepage
}

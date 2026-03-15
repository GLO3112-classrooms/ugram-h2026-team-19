import * as z from "zod";
import { query, form, getRequestEvent, command } from "$app/server";
import { API_URL } from "$env/static/private";
import {
  postCreateSchema,
  type PostData,
  type PostDataList,
  postImageUploadSchema,
  getPostsQuerySchema
} from "backend/schemas";
import { error, invalid, redirect } from "@sveltejs/kit";
import { getUsers } from "$lib/remotes/user.remote";

async function getMentionId(mention: string) {
  const { users } = await getUsers({ search: mention, limit: 1 });

  if (!users.length || users[0].username !== mention) return null;

  return users[0].id;
}

const createPostSchema = postCreateSchema
  .extend(postImageUploadSchema.shape)
  .extend({ keywords: z.string().optional(), mention: z.string().optional() })
  .omit({ mentions: true });

export const createPost = form(createPostSchema, async (data, issue) => {
  const { cookies } = getRequestEvent();
  const token = cookies.get("token");

  const mention = data.mention ? await getMentionId(data.mention) : null;
  if (data.mention && !mention) return invalid(issue.mention("User not found"));

  let response = await fetch(API_URL + "/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      description: data.description,
      keywords: (data.keywords ?? "")
        .replace(/[^\w-_]+/g, " ")
        .trim()
        .split(" ")
        .filter((keyword) => keyword.length),
      mentions: mention ? [mention] : []
    })
  });

  if (!response.ok) {
    switch (response.status) {
      case 400:
        return invalid(...(await response.json()).errors);
      case 401:
        return redirect(303, "/signin");
      default:
        return error(500, "Something went wrong");
    }
  }

  const id = (await response.json()).id;
  const formData = new FormData();
  formData.append("image", data.image);

  response = await fetch(API_URL + `/posts/${id}/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  switch (response.status) {
    case 201:
      return redirect(303, `/post/${id}`);
    case 400:
      return invalid(...(await response.json()).errors);
    case 401:
      return redirect(303, "/signin");
    // 403 and 404 are not intended to happen here, so we treat them as unexpected errors
    case 403:
    case 404:
    default:
      return error(500, "Something went wrong");
  }
});

export const getPost = query(z.uuid(), async (id): Promise<PostData> => {
  const { cookies } = getRequestEvent();
  const token = cookies.get("token");

  const response = await fetch(API_URL + `/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  switch (response.status) {
    case 200:
      return await response.json();
    case 401:
      return redirect(303, "/signin");
    case 404:
      return error(404, "Post not found");
    default:
      return error(500, "Something went wrong");
  }
});

export const getPosts = query(
  getPostsQuerySchema.extend({ userId: z.uuid().optional() }),
  async ({ userId, skip, limit, description, keywords }): Promise<PostDataList> => {
    const { cookies } = getRequestEvent();
    const token = cookies.get("token");

    const url = new URL(userId ? `/posts/list/${userId}` : "/posts/list", API_URL);
    url.searchParams.append("skip", skip.toString());
    url.searchParams.append("limit", limit.toString());
    if (description) url.searchParams.append("description", description);
    if (keywords) url.searchParams.append("keywords", keywords);

    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

    switch (response.status) {
      case 200:
        return await response.json();
      case 401:
        return redirect(303, "/signin");
      default:
        return error(500, "Something went wrong");
    }
  }
);

const updatePostSchema = z.object({
  id: z.uuid(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  mention: z.string().optional()
});

export const updatePost = form(updatePostSchema, async (data, issue) => {
  const { cookies } = getRequestEvent();
  const token = cookies.get("token");

  const mention = data.mention ? await getMentionId(data.mention) : null;
  if (data.mention && !mention) return invalid(issue.mention("User not found"));

  const response = await fetch(API_URL + `/posts/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      description: data.description,
      keywords: (data.keywords ?? "")
        .replace(/[^\w-_]+/g, " ")
        .trim()
        .split(" ")
        .filter((keyword) => keyword.length),
      mentions: mention ? [mention] : []
    })
  });

  switch (response.status) {
    case 204:
      return redirect(303, `/post/${data.id}`);
    case 400:
      return invalid(...(await response.json()).errors);
    case 401:
      return redirect(303, "/signin");
    case 403:
      return invalid(issue.id("You don't have permission to edit this post"));
    case 404:
      return invalid(issue.id("Post not found"));
    default:
      return error(500, "Something went wrong");
  }
});

export const deletePost = command(z.uuid(), async (id) => {
  const { cookies } = getRequestEvent();
  const token = cookies.get("token");

  const response = await fetch(API_URL + `/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  switch (response.status) {
    case 204:
      return { success: true, redirect: "/" } as const;
    case 401:
      return { success: false, redirect: "/signin" } as const;
    case 403:
      return { success: false, message: "You don't have permission to delete this post" } as const;
    case 404:
      return { success: false, message: "Post not found" } as const;
    default:
      return error(500, "Something went wrong");
  }
});

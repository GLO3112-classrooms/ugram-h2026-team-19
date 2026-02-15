import * as z from "zod";
import { query, form, getRequestEvent } from "$app/server";
import { API_URL } from "$env/static/private";
import { postCreateSchema, postImageUploadSchema } from "backend/schemas";
import { error, invalid, redirect } from "@sveltejs/kit";

const createPostSchema = postCreateSchema
  .extend(postImageUploadSchema.shape)
  .extend({ keywords: z.string().optional(), mention: z.string().optional() }) // TODO: uuid
  .omit({ mentions: true });

export const createPost = form(createPostSchema, async (data) => {
  const { cookies } = getRequestEvent();
  const token = cookies.get("token");

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
      mentions: data.mention ? [data.mention] : []
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

export const getPost = query(z.uuid(), async (id) => {
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

export const getPosts = query(z.number(), async (skip) => {
  const { cookies } = getRequestEvent();
  const token = cookies.get("token");

  const response = await fetch(API_URL + `/posts/list?skip=${skip}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  switch (response.status) {
    case 200:
      return await response.json();
    case 401:
      return redirect(303, "/signin");
    default:
      return error(500, "Something went wrong");
  }
});

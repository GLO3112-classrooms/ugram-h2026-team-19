// TODO: Replace placeholder data with actual data from the backend when the API is ready

import * as z from "zod";
import { query, form, getRequestEvent } from "$app/server";
import { API_URL } from "$env/static/private";
import { postCreateSchema, postImageUploadSchema } from "backend/schemas";
import { error, invalid, redirect } from "@sveltejs/kit";

function getRandomArbitrary(min = 100, max = 1000) {
  return Math.floor(Math.random() * (max - min) + min);
}

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
        console.log("Unauthorized, redirecting to signin");
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

export const getPosts = query(async () => {
  return [
    {
      id: Math.random().toString(36).substring(2, 15),
      user: {
        username: "rastley",
        firstname: "John",
        lastname: "Doe",
        profilePicture:
          "https://www.visitbournemouth.com/images/events/rick-astley-the-reflection-tour-2026.jpg"
      },
      picture: `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor iriure odio.",
      keywords: ["nature", "photography", "travel", "adventure", "explore", "wanderlust", "test"],
      mentions: ["anakamura"],
      createdAt: "2025-07-01T12:00:00Z"
    },
    {
      id: Math.random().toString(36).substring(2, 15),
      user: {
        username: "anakamura",
        firstname: "John",
        lastname: "Doe",
        profilePicture:
          "https://numero.com/wp-content/uploads/2025/07/aya-nakamura-meilleurs-looks-flammes-2025-1.webp"
      },
      picture: `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor iriure odio.",
      keywords: ["nature", "photography", "travel", "adventure", "explore", "wanderlust"],
      mentions: ["rastley"],
      createdAt: "2025-06-30T12:00:00Z"
    },
    {
      id: Math.random().toString(36).substring(2, 15),
      user: {
        username: "cdion",
        firstname: "John",
        lastname: "Doe",
        profilePicture: "https://browvopetshop.com/wp-content/uploads/2024/07/Celine-Dion.jpg"
      },
      picture: `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor iriure odio.",
      keywords: ["nature", "photography", "travel", "adventure", "explore", "wanderlust"],
      mentions: ["rastley"],
      createdAt: "2025-06-29T12:00:00Z"
    }
  ];
});

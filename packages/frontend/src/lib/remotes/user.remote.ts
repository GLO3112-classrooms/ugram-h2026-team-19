// TODO: Replace placeholder data with actual data from the backend when the API is ready

import {
  userAvatarUploadSchema,
  userUpdateDataSchema,
  type UserData,
  type UserUpdateData
} from "backend/schemas";
import { z } from "zod";
import { error, redirect } from "@sveltejs/kit";
import { form, getRequestEvent, query } from "$app/server";
import { API_URL } from "$env/static/private";

function getRandomArbitrary(min = 100, max = 1000) {
  return Math.floor(Math.random() * (max - min) + min);
}

function picture() {
  return {
    id: Math.random().toString(36).substring(2, 15),
    url: `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`
  };
}

export const getMe = query(async (): Promise<UserData> => {
  const { cookies } = getRequestEvent();
  const token = cookies.get("token");

  const response = await fetch(API_URL + "/users/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  switch (response.status) {
    case 200:
      return await response.json();
    case 401:
    case 404:
      return redirect(303, "/signin");
    default:
      return error(500, "Something went wrong");
  }
});

export const patchMe = form(userUpdateDataSchema, async (body): Promise<UserData> => {
  const token = getRequestEvent().cookies.get("token");

  const response = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  switch (response.status) {
    case 200:
      break;
    case 400:
      return error(400, "Malformed body");
    case 401:
      return redirect(303, "/signin");
    default:
      return error(500, "Something went wrong");
  }
});

export const getUser = query(z.string(), async (username) => {
  return {
    username: username,
    firstname: "John",
    lastname: "Doe",
    profilePicture:
      "https://www.visitbournemouth.com/images/events/rick-astley-the-reflection-tour-2026.jpg",
    posts: [
      picture(),
      picture(),
      picture(),
      picture(),
      picture(),
      picture(),
      picture(),
      picture(),
      picture(),
      picture()
    ]
  };
});

export const getUsers = query(
  z.object({
    search: z.string().optional().default(""),
    limit: z.number().optional().default(10),
    skip: z.number().optional().default(0)
  }),
  async ({ search, limit, skip }) => {
    const { cookies } = getRequestEvent();
    const token = cookies.get("token");

    const response = await fetch(
      `${API_URL}/users?${new URLSearchParams({ search, limit: limit.toString(), skip: skip.toString() })}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

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

export const postAvatar = form(userAvatarUploadSchema, async ({ avatar }) => {
  const token = getRequestEvent().cookies.get("token");

  const body = new FormData();
  body.append("avatar", avatar);

  const response = await fetch(`${API_URL}/users/me/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body
  });

  switch (response.status) {
    case 201:
      break;
    case 400:
      return error(400, "Malformed body");
    case 401:
      return redirect(303, "/signin");
    default:
      return error(500, await response.text());
  }
});

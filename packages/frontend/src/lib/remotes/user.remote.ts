import { command, form, getRequestEvent, query } from "$app/server";
import { env } from "$env/dynamic/private";
import { error, redirect } from "@sveltejs/kit";
import {
  userAvatarUploadSchema,
  userUpdateDataSchema,
  type UserData,
  type UserDataListSchema
} from "backend/schemas";
import { z } from "zod";

export const getMe = query(async (): Promise<UserData> => {
  const { cookies } = getRequestEvent();
  const token = cookies.get("token");

  const response = await fetch(env.API_URL + "/users/me", {
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

export const patchMe = form(userUpdateDataSchema, async (body) => {
  const token = getRequestEvent().cookies.get("token");

  const response = await fetch(`${env.API_URL}/users/me`, {
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

export const deleteMe = command(async () => {
  const { cookies } = getRequestEvent();

  const response = await fetch(env.API_URL + `/users/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${cookies.get("token")}` }
  });

  switch (response.status) {
    case 204:
      cookies.delete("token", { path: "/" });
      return { success: true, redirect: "/signin" } as const;
    case 401:
      return { success: false, redirect: "/signin" } as const;
    case 404:
      return { success: false, message: "User not found" } as const;
    default:
      return error(500, "Something went wrong");
  }
});

export const getUser = query(z.uuid(), async (id) => {
  const { cookies } = getRequestEvent();
  const token = cookies.get("token");

  const response = await fetch(env.API_URL + `/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  switch (response.status) {
    case 200:
      return await response.json();
    case 401:
      return redirect(303, "/signin");
    case 404:
      return error(404, "User not found");
    default:
      return error(500, "Something went wrong");
  }
});

export const getUsers = query(
  z.object({
    search: z.string().optional().default(""),
    limit: z.number().optional().default(10),
    skip: z.number().optional().default(0)
  }),
  async ({ search, limit, skip }): Promise<UserDataListSchema> => {
    const { cookies } = getRequestEvent();
    const token = cookies.get("token");

    const response = await fetch(
      `${env.API_URL}/users?${new URLSearchParams({ search, limit: limit.toString(), skip: skip.toString() })}`,
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

  const response = await fetch(`${env.API_URL}/users/me/avatar`, {
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

import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) return error(400, "Missing code or state");

  const response = await fetch(
    `${env.API_URL}/auth/google/callback?${new URLSearchParams({ code, state })}`
  );

  if (!response.ok) return error(response.status, "Failed to authenticate with Google");

  cookies.set("token", (await response.json()).token, { path: "/" });
  return redirect(303, "/");
};

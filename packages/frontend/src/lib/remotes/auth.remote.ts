import { error, invalid, redirect } from "@sveltejs/kit";
import { form, getRequestEvent } from "$app/server";
import { apiFetch } from "$lib/server/api";
import { authLoginSchema, authRegisterSchema } from "backend/schemas";

export const signUp = form(authRegisterSchema, async (data, issue) => {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  switch (response.status) {
    case 201:
      return redirect(303, "/signin");
    case 400:
      return invalid(...(await response.json()).errors);
    case 409:
      return invalid(
        issue.username("Username or email is already taken"),
        issue.email("Username or email is already taken")
      );
    default:
      return error(500, (await response.text()) || "Something went wrong");
  }
});

export const signIn = form(authLoginSchema, async (data, issue) => {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  switch (response.status) {
    case 200: {
      const { cookies } = getRequestEvent();
      cookies.set("token", (await response.json()).token, { path: "/" });
      return redirect(303, "/");
    }
    case 401:
      return invalid(
        issue.email("Invalid email or password"),
        issue.password("Invalid email or password")
      );
    default:
      return error(500, (await response.text()) || "Something went wrong");
  }
});

export const signOut = form(async () => {
  const { cookies } = getRequestEvent();

  const response = await apiFetch("/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${cookies.get("token")}` }
  });

  switch (response.status) {
    case 204:
    case 401:
      getRequestEvent().cookies.delete("token", { path: "/" });
      return redirect(303, "/signin");
    default:
      return error(500, (await response.text()) || "Something went wrong");
  }
});

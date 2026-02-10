import { error, invalid, redirect } from "@sveltejs/kit";
import { form, getRequestEvent } from "$app/server";
import { API_URL } from "$env/static/private";
import { authLoginSchema } from "backend/schemas";

export const signUp = form("unchecked", async () => {});

export const signIn = form(authLoginSchema, async (data) => {
	const response = await fetch(API_URL + "/auth/login", {
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
		case 400:
			return invalid(...(await response.json()).errors);
		default:
			return error(500, "Something went wrong");
	}
});

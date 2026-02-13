import { form } from "$app/server";
import { API_URL } from "$env/static/private";
import { error, invalid, redirect } from "@sveltejs/kit";
import { authRegisterSchema } from "backend/schemas";

export const signUp = form(authRegisterSchema, async (data, issue) => {
	const response = await fetch(API_URL + "/auth/register", {
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
			return invalid(issue.email("Email is already taken"));
		default:
			return error(500, "Something went wrong");
	}
});

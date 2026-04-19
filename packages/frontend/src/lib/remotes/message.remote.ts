import { form, getRequestEvent, query } from "$app/server";
import { apiFetch } from "$lib/server/api";
import { error, redirect } from "@sveltejs/kit";
import {
  privateMessageCreateSchema,
  type PrivateMessageCreate,
  type PrivateMessageList
} from "backend/schemas";
import z from "zod";

export const getMessages = query(
  z.object({ id: z.uuid(), since: z.iso.datetime().optional() }),
  async ({ id, since }): Promise<PrivateMessageList> => {
    const token = getRequestEvent().cookies.get("token");

    const response = await apiFetch(
      since ? `/private-messages/${id}?since=${since}` : `/private-messages/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    switch (response.status) {
      case 200:
        return await response.json();
      case 401:
        return redirect(303, "/signin");
      default:
        return error(500, (await response.text()) || "Something went wrong");
    }
  }
);

export const sendMessage = form(
  privateMessageCreateSchema,
  async (body): Promise<PrivateMessageCreate> => {
    const token = getRequestEvent().cookies.get("token");

    const response = await apiFetch("/private-messages", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    switch (response.status) {
      case 201:
        return await response.json();
      case 400:
        return error(400, (await response.text()) || "Something went wrong");
      case 401:
        return redirect(303, "/signin");
      default:
        return error(500, (await response.text()) || "Something went wrong");
    }
  }
);

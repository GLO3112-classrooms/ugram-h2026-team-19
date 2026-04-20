import { env } from "$env/dynamic/private";

export async function apiFetch(url: string | URL, init?: RequestInit) {
  try {
    if (typeof url === "string" && !url.startsWith("http")) url = env.API_URL + url;
    const response = await fetch(url, init);
    if (!response.ok) console.error(`Error fetching ${url}`, response);
    return response;
  } catch (error) {
    console.error(`Error fetching ${url}`, error);
    return {
      ok: false,
      status: 500,
      text: async () => "Something went wrong. The API is certainly not accessible via the frontend"
    } as const;
  }
}

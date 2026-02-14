// TODO: Replace placeholder data with actual data from the backend when the API is ready

import { z } from "zod";
import { query } from "$app/server";

function getRandomArbitrary(min = 100, max = 1000) {
  return Math.floor(Math.random() * (max - min) + min);
}

function picture() {
  return {
    id: Math.random().toString(36).substring(2, 15),
    url: `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`
  };
}

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

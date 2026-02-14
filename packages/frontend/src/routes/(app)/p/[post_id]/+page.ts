// TODO: Replace placeholder data with actual data from the backend when the API is ready

import type { PageLoad } from "./$types";

function getRandomArbitrary(min = 500, max = 1000) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const load: PageLoad = () => {
  return {
    user: {
      username: "rastley",
      firstname: "John",
      lastname: "Doe",
      profilePicture:
        "https://www.visitbournemouth.com/images/events/rick-astley-the-reflection-tour-2026.jpg"
    },
    picture: `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor iriure odio.",
    tags: ["nature", "photography", "travel", "adventure", "explore", "wanderlust", "test"],
    mention: "anakamura",
    date: "2025-07-01T12:00:00Z"
  };
};

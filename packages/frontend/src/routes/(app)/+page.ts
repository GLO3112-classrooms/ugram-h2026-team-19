// TODO: Replace placeholder data with actual data from the backend when the API is ready (⚠️ data sorted by date)

import type { PageLoad } from "./$types";

function getRandomArbitrary(min = 500, max = 1000) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const load: PageLoad = () => {
  return {
    posts: [
      {
        id: Math.random().toString(36).substring(2, 15),
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
      },
      {
        id: Math.random().toString(36).substring(2, 15),
        user: {
          username: "anakamura",
          firstname: "John",
          lastname: "Doe",
          profilePicture:
            "https://numero.com/wp-content/uploads/2025/07/aya-nakamura-meilleurs-looks-flammes-2025-1.webp"
        },
        picture: `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor iriure odio.",
        tags: ["nature", "photography", "travel", "adventure", "explore", "wanderlust"],
        mention: "rastley",
        date: "2025-06-30T12:00:00Z"
      },
      {
        id: Math.random().toString(36).substring(2, 15),
        user: {
          username: "cdion",
          firstname: "John",
          lastname: "Doe",
          profilePicture: "https://browvopetshop.com/wp-content/uploads/2024/07/Celine-Dion.jpg"
        },
        picture: `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor iriure odio.",
        tags: ["nature", "photography", "travel", "adventure", "explore", "wanderlust"],
        mention: "rastley",
        date: "2025-06-29T12:00:00Z"
      }
    ]
  };
};

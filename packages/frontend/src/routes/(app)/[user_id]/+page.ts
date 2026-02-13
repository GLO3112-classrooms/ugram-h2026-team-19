// TODO: Replace placeholder data with actual data from the backend when the API is ready

import type { PageLoad } from "./$types";

function getRandomArbitrary(min = 100, max = 1000) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const load: PageLoad = ({ params }) => {
  return {
    username: params.user_id,
    firstname: "John",
    lastname: "Doe",
    profilePicture:
      "https://www.visitbournemouth.com/images/events/rick-astley-the-reflection-tour-2026.jpg",
    posts: [
      `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`,
      `https://picsum.photos/${getRandomArbitrary()}/${getRandomArbitrary()}`
    ]
  };
};

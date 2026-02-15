<script lang="ts">
  import { PencilIcon } from "@lucide/svelte";
  import { resolve } from "$app/paths";
  import { Button } from "$lib/components/ui/button";
  import Avatar from "./Avatar.svelte";
  import type { PostData } from "backend/schemas";

  interface Props {
    id: string;
    user: {
      username: string;
      profilePicture: string;
    };
    image: string;
    description: string;
    keywords: string[];
    mentions: PostData["mentions"];
    date: string;
    own: boolean;
  }

  let { id, user, image, description, keywords, mentions, date, own }: Props = $props();
</script>

<div class="space-y-1">
  <div class="flex items-center justify-between">
    <a class="flex h-10 items-center gap-2" href={resolve(`/user/${user.username}`)}>
      <Avatar src={user.profilePicture} username={user.username} />
      <p>@{user.username}</p>
    </a>
    <div class="flex items-center gap-2">
      <p class="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</p>
      {#if own}
        <a href={resolve(`/update/${id}`)}>
          <Button variant="ghost" size="icon" aria-label="Submit">
            <PencilIcon />
          </Button>
        </a>
      {/if}
    </div>
  </div>
  <!-- `alt` is empty because both non-present or non-empty trigger a warning -->
  <img class="w-full rounded-sm" src={image} alt="" />
  <p>{description}</p>
  <p class="flex flex-wrap space-x-1">
    {#each keywords as keyword (keyword)}
      <span class="text-sm text-cyan-600">#{keyword}</span>
    {/each}
  </p>
  {#each mentions as mention (mention)}
    <a class="text-cyan-600" href={resolve(`/user/${mention.id}`)}>@{mention.username}</a>
  {/each}
</div>

<script lang="ts">
  import { HeartIcon, MessageCircleIcon, PencilIcon } from "@lucide/svelte";
  import { resolve } from "$app/paths";
  import { Button } from "$lib/shadcn/button";
  import Avatar from "./Avatar.svelte";
  import type { PostData } from "backend/schemas";
  import DialogLikers from "$lib/components/dialogs/DialogLikers.svelte";
  import DialogComments from "$lib/components/dialogs/DialogComments.svelte";

  interface Props {
    id: string;
    user: {
      id: string;
      username: string;
      profilePicture: string;
    };
    image: string;
    description: string;
    keywords: string[];
    mentions: PostData["mentions"];
    createdAt: string;
    own: boolean;
  }

  let { id, user, image, description, keywords, mentions, createdAt, own }: Props = $props();
</script>

<div class="my-2.5 space-y-1">
  <div class="flex items-center justify-between">
    <a class="flex h-10 items-center gap-2" href={resolve(`/user/${user.id}`)}>
      <Avatar src={user.profilePicture} username={user.username} />
      <p>@{user.username}</p>
    </a>
    <div class="flex items-center gap-2">
      <p class="text-xs text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
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
  <div class="flex justify-between">
    <!-- TODO: replace placeholder data with actual one -->
    <div class="flex items-center gap-1">
      {#if true}
        <!-- TODO: add remote -->
        <form>
          <button type="submit" class="cursor-pointer" aria-label="Dislike">
            <HeartIcon color="red" fill="red" />
          </button>
        </form>
      {:else}
        <!-- TODO: add remote -->
        <form>
          <button type="submit" class="cursor-pointer" aria-label="Like">
            <HeartIcon />
          </button>
        </form>
      {/if}
      <DialogLikers likers={[]}>{10}</DialogLikers>
    </div>
    <DialogComments comments={[]}>
      {10}
      <MessageCircleIcon />
    </DialogComments>
  </div>
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

<script lang="ts">
  import { resolve } from "$app/paths";
  import Avatar from "./Avatar.svelte";

  interface Props {
    user: {
      username: string;
      profilePicture: string;
    };
    picture: string;
    description: string;
    keywords: string[];
    mentions: string;
    date: string;
  }

  let { user, picture, description, keywords, mentions, date }: Props = $props();
</script>

<div class="space-y-1">
  <div class="flex items-center justify-between">
    <a class="flex h-10 items-center gap-2" href={resolve(`/user/${user.username}`)}>
      <Avatar src={user.profilePicture} username={user.username} />
      <p>@{user.username}</p>
    </a>
    <p class="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</p>
  </div>
  <!-- `alt` is empty because both non-present or non-empty trigger a warning -->
  <img class="w-full rounded-sm" src={picture} alt="" />
  <p>{description}</p>
  <p class="flex flex-wrap space-x-1">
    {#each keywords as keyword (keyword)}
      <span class="text-sm text-cyan-600">#{keyword}</span>
    {/each}
  </p>
  {#each mentions as mention (mention)}
    <a class="text-cyan-600" href={resolve(`/user/${mention}`)}>@{mention}</a>
  {/each}
</div>

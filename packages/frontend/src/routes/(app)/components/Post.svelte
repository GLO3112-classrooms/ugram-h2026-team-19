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
    tags: string[];
    mention: string;
  }

  let { user, picture, description, tags, mention }: Props = $props();
</script>

<div class="space-y-2">
  <a class="flex h-10 items-center gap-2 pl-2" href={resolve(`/${user.username}`)}>
    <Avatar src={user.profilePicture} username={user.username} />
    <p>@{user.username}</p>
  </a>
  <!-- `alt` is empty because both non-present or non-empty trigger a warning -->
  <img class="w-full rounded-sm" src={picture} alt="" />
  <p>{description}</p>
  <p class="flex space-x-1">
    {#each tags as tag (tag)}
      <span class="text-sm text-cyan-600">#{tag}</span>
    {/each}
  </p>
  <a class="text-cyan-600" href={resolve(`/${mention}`)}>@{mention}</a>
</div>

<script lang="ts">
  import { resolve } from "$app/paths";
  import type { PageProps } from "./$types";
  import Avatar from "../../components/Avatar.svelte";

  let { data }: PageProps = $props();
</script>

<div class="mx-auto max-w-5xl space-y-2 p-7">
  <a class="flex h-10 items-center gap-2 pl-2" href={resolve(`/${data.user.username}`)}>
    <Avatar src={data.user.profilePicture} username={data.user.username} />
    <p>@{data.user.username}</p>
  </a>
  <!-- `alt` is empty because both non-present or non-empty trigger a warning -->
  <img class="w-full rounded-sm" src={data.picture} alt="" />
  <p>{data.description}</p>
  <p class="flex space-x-1">
    {#each data.tags as tag (tag)}
      <span class="text-sm text-cyan-600">#{tag}</span>
    {/each}
  </p>
  <a class="text-cyan-600" href={resolve(`/${data.mention}`)}>@{data.mention}</a>
</div>

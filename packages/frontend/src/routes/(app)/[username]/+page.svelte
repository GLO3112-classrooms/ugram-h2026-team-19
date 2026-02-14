<script lang="ts">
  import type { PageProps } from "./$types";
  import Avatar from "./components/Avatar.svelte";
  import { Separator } from "$lib/components/ui/separator";

  let { data }: PageProps = $props();
</script>

<div class="mx-auto max-w-5xl p-7">
  <div class="flex items-center gap-2 pl-2">
    <Avatar
      src={data.profilePicture}
      username={data.username}
      firstname={data.firstname}
      lastname={data.lastname}
    />
    <div>
      <p class="text-xs">@{data.username}</p>
      <p>{data.firstname} {data.lastname}</p>
    </div>
  </div>
  <Separator class="my-5" />
  <div class="grid grid-cols-3 gap-1 pt-2">
    {#each data.posts as post, index (index)}
      <img
        class="aspect-square size-full rounded-sm object-cover hover:grayscale"
        src={post}
        alt="Random"
      />
    {/each}
  </div>
</div>

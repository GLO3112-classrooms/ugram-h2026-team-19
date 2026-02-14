<script lang="ts">
  import { resolve } from "$app/paths";
  import { Separator } from "$lib/components/ui/separator";
  import { getUser } from "$lib/remotes/user.remote";
  import Avatar from "../../components/Avatar.svelte";

  let { params } = $props();

  const user = $derived(await getUser(params.username));
</script>

<div class="mx-auto max-w-5xl p-7">
  <div class="flex h-20 items-center gap-2 pl-2">
    <Avatar src={user.profilePicture} username={user.username} />
    <div>
      <p class="text-xs">@{user.username}</p>
      <p>{user.firstname} {user.lastname}</p>
    </div>
  </div>
  <Separator class="my-5" />
  <div class="grid grid-cols-3 gap-1 pt-2">
    {#each user.posts as post (post.id)}
      <a href={resolve(`/post/${post.id}`)}>
        <img
          class="aspect-square size-full rounded-sm bg-muted object-cover hover:grayscale"
          src={post.url}
          alt=""
        />
      </a>
    {/each}
  </div>
</div>

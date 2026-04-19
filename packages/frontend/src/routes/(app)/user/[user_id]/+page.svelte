<script lang="ts">
  import { resolve } from "$app/paths";
  import InfiniteScroll from "$lib/components/InfiniteScroll.svelte";
  import User from "$lib/components/User.svelte";
  import { getPosts } from "$lib/remotes/post.remote";
  import { getMe, getUser } from "$lib/remotes/user.remote";
  import Button from "$lib/shadcn/button/button.svelte";
  import { Separator } from "$lib/shadcn/separator";
  import { MessageCircleIcon } from "@lucide/svelte";

  let { params } = $props();

  const me = await getMe();
  const user = $derived(params.user_id === "me" ? me : await getUser(params.user_id));
</script>

<div>
  <div class="flex items-center justify-between">
    <User {...user} />
    {#if user.id !== me.id}
      <Button variant="outline" class="cursor-pointer" href={resolve(`/messages/${user.id}`)}>
        <MessageCircleIcon />
        message
      </Button>
    {/if}
  </div>
  <Separator class="my-5" />
  <InfiniteScroll callback={(skip, limit) => getPosts({ userId: user.id, skip, limit })}>
    {#snippet children({ posts })}
      <div class="grid grid-cols-3 gap-1 pt-2">
        {#each posts as post (post.id)}
          <a href={resolve(`/post/${post.id}`)}>
            <img
              class="aspect-square size-full rounded-sm bg-muted object-cover hover:grayscale"
              src={post.image}
              alt=""
            />
          </a>
        {/each}
      </div>
    {/snippet}
  </InfiniteScroll>
</div>

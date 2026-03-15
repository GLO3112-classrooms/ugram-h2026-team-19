<script lang="ts">
  import { resolve } from "$app/paths";
  import { Separator } from "$lib/shadcn/separator";
  import { getUser } from "$lib/remotes/user.remote";
  import User from "$lib/components/User.svelte";
  import type { PostData } from "backend/schemas";
  import { getPosts } from "$lib/remotes/post.remote";
  import { onMount } from "svelte";

  let { params } = $props();

  const user = $derived(await getUser(params.user_id));

  let posts = $state<PostData[]>([]);
  let loading = $state(false);
  let hasMore = $state(true);
  let error = $state(false);
  let total = 0;

  async function loadMorePosts() {
    if (error || loading || !hasMore) return;

    loading = true;
    try {
      const result = await getPosts({ userId: user.id, skip: posts.length });
      posts = [...posts, ...result.posts];
      total = result.total;
      hasMore = posts.length < total;

      if (hasMore && !isPageScrollable()) {
        loading = false;
        await loadMorePosts();
      }
    } catch {
      error = true;
    } finally {
      loading = false;
    }
  }

  function isPageScrollable() {
    return document.documentElement.scrollHeight > window.innerHeight;
  }

  function handleScroll() {
    if (error || loading || !hasMore) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight * 0.8) {
      loadMorePosts();
    }
  }

  onMount(() => {
    loadMorePosts();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<div>
  <User {...user} />
  <Separator class="my-5" />
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

  {#if error}
    <p class="py-8 text-center text-red-500">
      Oops! Something went wrong while loading posts. Please try again later.
    </p>
  {:else if loading}
    <div class="flex justify-center py-8">
      <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  {:else if !posts.length}
    <p class="py-8 text-center text-gray-500">This user hasn't posted anything yet.</p>
  {/if}
</div>

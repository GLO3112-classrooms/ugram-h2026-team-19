<script lang="ts">
  import type { PostData } from "backend/schemas";
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { getMe } from "$lib/remotes/user.remote";
  import { getPosts } from "$lib/remotes/post.remote";
  import Post from "$lib/components/Post.svelte";

  const me = await getMe();

  let posts = $state<PostData[]>([]);
  let loading = $state(false);
  let hasMore = $state(true);
  let error = $state(false);
  let total = 0;

  async function loadMorePosts() {
    if (error || loading || !hasMore) return;

    loading = true;
    try {
      const result = await getPosts({ skip: posts.length });
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
  {#each posts as post (post.id)}
    <Post {...post} own={me?.id === post.user.id} />
  {/each}

  {#if error}
    <p class="py-8 text-center text-red-500">
      Oops! Something went wrong while loading posts. Please try again later.
    </p>
  {:else if loading}
    <div class="flex justify-center py-8">
      <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  {:else if !hasMore && posts.length}
    <p class="py-8 text-center text-gray-500">You've reached the end of the posts! 😱</p>
  {:else if !posts.length}
    <p class="py-8 text-center text-gray-500">
      No post yet! 😔 Be the first to share something, <a
        class="text-cyan-600 underline"
        href={resolve("/create")}>create a post</a
      >!
    </p>
  {/if}
</div>

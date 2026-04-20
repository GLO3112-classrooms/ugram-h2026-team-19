<script lang="ts">
  import InfiniteScroll from "$lib/components/InfiniteScroll.svelte";
  import Post from "$lib/components/Post.svelte";
  import { getPosts } from "$lib/remotes/post.remote";
  import { getMe } from "$lib/remotes/user.remote";
  import AppBar from "./components/AppBar.svelte";

  const me = await getMe();
</script>

<div>
  <AppBar />

  <InfiniteScroll callback={(skip, limit) => getPosts({ skip, limit })}>
    {#snippet children({ posts })}
      {#each posts as post (post.id)}
        <Post {post} own={me?.id === post.user.id} currentUser={me} />
      {/each}
    {/snippet}
  </InfiniteScroll>
</div>

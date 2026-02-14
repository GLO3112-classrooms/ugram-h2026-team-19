<script lang="ts">
  import { getPosts } from "$lib/remotes/post.remote";
  import Post from "./components/Post.svelte";
</script>

<div class="mx-auto max-w-5xl space-y-5 p-7">
  {#each await getPosts() as post (post.id)}
    <Post
      user={post.user}
      picture={post.picture}
      description={post.description}
      keywords={post.keywords}
      mention={post.mention}
      date={post.date}
    />
  {/each}
</div>

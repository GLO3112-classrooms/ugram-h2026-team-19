<script lang="ts">
  import type { PageProps } from "./$types";
  import Post from "./components/Post.svelte";

  let { data }: PageProps = $props();
</script>

<div class="mx-auto max-w-5xl space-y-5 p-7">
  {#each data.posts as post (post.id)}
    <Post
      user={post.user}
      picture={post.picture}
      description={post.description}
      tags={post.tags}
      mention={post.mention}
      date={post.date}
    />
  {/each}
</div>

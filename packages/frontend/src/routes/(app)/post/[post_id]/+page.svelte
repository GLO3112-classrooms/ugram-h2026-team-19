<script lang="ts">
  import { getPost } from "$lib/remotes/post.remote";
  import Post from "../../components/Post.svelte";

  let post = await getPost();
</script>

<div class="mx-auto max-w-5xl space-y-5 p-7">
  <Post
    user={post.user}
    picture={post.picture}
    description={post.description}
    tags={post.tags}
    mention={post.mention}
    date={post.date}
  />
</div>

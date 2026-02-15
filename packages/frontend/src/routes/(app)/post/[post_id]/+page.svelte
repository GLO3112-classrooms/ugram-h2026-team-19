<script lang="ts">
  import { getPost } from "$lib/remotes/post.remote";
  import Post from "../../components/Post.svelte";

  let { params } = $props();

  const post = $derived(await getPost(params.post_id));
</script>

<div class="mx-auto max-w-5xl space-y-5 p-7">
  <Post
    user={post.user}
    picture={post.image}
    description={post.description}
    keywords={post.keywords}
    mentions={post.mentions}
    date={post.createdAt}
  />
</div>

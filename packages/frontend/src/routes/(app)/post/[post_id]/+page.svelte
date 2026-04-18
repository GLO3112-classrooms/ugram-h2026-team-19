<script lang="ts">
  import { getMe } from "$lib/remotes/user.remote";
  import { getPost } from "$lib/remotes/post.remote";
  import Post from "$lib/components/Post.svelte";

  const me = await getMe();

  let { params } = $props();

  const post = $derived(await getPost(params.post_id));
</script>

<div>
  <Post {post} own={me?.id === post.user.id} currentUser={me} />
</div>

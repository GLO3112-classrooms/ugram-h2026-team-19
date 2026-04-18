<script lang="ts">
  import { getMe } from "$lib/remotes/user.remote";
  import { getPost } from "$lib/remotes/post.remote";
  import Post from "$lib/components/Post.svelte";

  const me = await getMe();

  let { params } = $props();

  const post = $derived(await getPost(params.post_id));
</script>

<div>
  <Post
    id={post.id}
    user={post.user}
    image={post.image}
    description={post.description}
    keywords={post.keywords.map((keyword) => keyword.value)}
    mentions={post.mentions}
    createdAt={post.createdAt}
    own={me?.id === post.user.id}
  />
</div>

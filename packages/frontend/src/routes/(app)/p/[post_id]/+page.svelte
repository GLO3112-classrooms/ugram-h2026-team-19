<script lang="ts">
  import type { PageProps } from "./$types";
  import Post from "../../components/Post.svelte";

  let { data }: PageProps = $props();
</script>

<div class="mx-auto max-w-5xl space-y-5 p-7">
  <Post
    user={data.user}
    picture={data.picture}
    description={data.description}
    tags={data.tags}
    mention={data.mention}
    date={data.date}
  />
</div>

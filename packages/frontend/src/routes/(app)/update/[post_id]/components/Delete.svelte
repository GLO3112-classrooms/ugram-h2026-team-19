<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import DestructiveConfirmationButton from "$lib/components/buttons/DestructiveConfirmationButton.svelte";
  import { deletePost } from "$lib/remotes/post.remote";

  interface Props {
    id: string;
  }

  let { id }: Props = $props();

  let error = $state("");

  async function handleDelete() {
    try {
      const { success } = await deletePost(id);
      if (success) await goto(resolve("/"));
      else await goto(resolve("/signin"));
    } catch {
      error = "Unable to delete post";
    }
  }
</script>

<DestructiveConfirmationButton action="Delete Post" callback={handleDelete} {error} />

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
      const { redirect, message } = await deletePost(id);
      if (redirect) await goto(resolve(redirect));
      else if (message) error = message;
      else error = "Unable to delete post";
    } catch {
      error = "Unable to delete post";
    }
  }
</script>

<DestructiveConfirmationButton action="Delete Post" callback={handleDelete} {error} />

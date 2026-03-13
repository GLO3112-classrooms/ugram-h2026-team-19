<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import DestructiveConfirmationButton from "$lib/components/buttons/DestructiveConfirmationButton.svelte";
  import { deleteMe } from "$lib/remotes/user.remote";

  let error = $state("");

  async function handleDelete() {
    try {
      await deleteMe();
      await goto(resolve("/signin"));
    } catch {
      error = "Unable to delete account";
    }
  }
</script>

<DestructiveConfirmationButton action="Delete Account" callback={handleDelete} {error} />

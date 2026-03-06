<script lang="ts">
  import { Trash2Icon } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { deletePost } from "$lib/remotes/post.remote";
  import { Button } from "$lib/shadcn/button/index.js";
  import * as Field from "$lib/shadcn/field/index.js";

  interface Props {
    id: string;
  }

  let { id }: Props = $props();

  let confirmDelete = $state(false);

  async function handleDelete() {
    if (!confirmDelete) {
      confirmDelete = true;
      return;
    }

    const { success } = await deletePost(id);
    if (success) await goto(resolve("/"));
    else await goto(resolve("/signin"));
  }
</script>

<Field.Field>
  <Button type="button" variant={confirmDelete ? "destructive" : "outline"} onclick={handleDelete}>
    <Trash2Icon />
    {confirmDelete ? "Are you sure?" : "Delete Post"}
  </Button>
</Field.Field>

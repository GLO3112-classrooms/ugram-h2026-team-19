<script module lang="ts">
  import type { Snippet } from "svelte";
  import { Trash2Icon } from "@lucide/svelte";
  import { Button } from "$lib/shadcn/button/index.js";
  import * as Field from "$lib/shadcn/field/index.js";
</script>

<script lang="ts">
  interface Props {
    action: string;
    callback: () => unknown;
    error?: string;
    children?: Snippet;
  }

  let { action, callback, error, children }: Props = $props();

  let confirm = $state(false);

  async function handleConfirm() {
    if (!confirm) {
      confirm = true;
      return;
    }
    callback();
  }
</script>

<Field.Field class="text-center">
  <Button type="button" variant={confirm ? "destructive" : "outline"} onclick={handleConfirm}>
    {#if children}
      {@render children()}
    {:else}
      <Trash2Icon />
    {/if}
    {confirm ? "Are you sure?" : action}
  </Button>
  {#if error}
    <Field.Error>{error}</Field.Error>
  {/if}
</Field.Field>

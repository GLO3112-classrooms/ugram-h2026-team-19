<script lang="ts">
  import * as Field from "$lib/shadcn/field/index.js";
  import { Button } from "$lib/shadcn/button/index.js";
  import type { ComponentProps, Snippet } from "svelte";

  type Props = {
    footer?: Snippet;
  } & ComponentProps<typeof Button>;

  let { children, footer, ...props }: Props = $props();
</script>

<Field.Field>
  <Button class="capitalize" {...props}>
    {@render children?.()}
  </Button>

  {#if footer}
    <Field.Description class="text-center">
      {@render footer()}
    </Field.Description>
  {/if}
</Field.Field>

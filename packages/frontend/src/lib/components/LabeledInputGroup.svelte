<script lang="ts">
  import type { Input } from "$lib/components/ui/input";
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import * as Label from "$lib/components/ui/label/index.js";
  import { Icon } from "@lucide/svelte";
  import type { ComponentProps } from "svelte";

  type Props = {
    label: string;
    icon?: typeof Icon;
  } & ComponentProps<typeof Input>;

  let { label, icon, ...props }: Props = $props();
</script>

<InputGroup.Root>
  {@const Icon = icon}
  <InputGroup.Input id={label} {...props} />
  <InputGroup.Addon align="block-start">
    {#if icon}
      <Icon />
    {/if}
    <Label.Root for={label} class="text-foreground">{label}</Label.Root>
  </InputGroup.Addon>
</InputGroup.Root>

<script module lang="ts">
  import * as Field from "$lib/shadcn/field";
  import { Input } from "$lib/shadcn/input";
  import type { RemoteFormIssue } from "@sveltejs/kit";
  import type { ComponentProps } from "svelte";

  type Props = {
    label: string;
    issues?: RemoteFormIssue[];
  } & ComponentProps<typeof Input>;
</script>

<script lang="ts">
  let { label, issues, ...props }: Props = $props();
</script>

<Field.Field>
  <Field.Label for={label} class="capitalize">{label}</Field.Label>

  <Input {...props} id={label} />

  {#each issues as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</Field.Field>

<script lang="ts">
  import * as Field from "$lib/shadcn/field";
  import { patchMe } from "$lib/remotes/user.remote";
  import { MailIcon } from "@lucide/svelte";
  import LabeledInputGroup from "$lib/components/LabeledInputGroup.svelte";

  interface Props {
    value: string;
  }

  let { value }: Props = $props();
</script>

<LabeledInputGroup
  icon={MailIcon}
  label="Email"
  placeholder="email@example.com"
  {...patchMe.fields.email.as("email")}
  {value}
/>
{#each patchMe.fields.email.issues() as issue, index (index)}
  <Field.Error>{issue.message}</Field.Error>
{/each}

<script lang="ts">
  import * as Field from "$lib/shadcn/field";
  import { patchMe } from "$lib/remotes/user.remote";
  import { PhoneIcon } from "@lucide/svelte";
  import LabeledInputGroup from "$lib/components/LabeledInputGroup.svelte";

  interface Props {
    value: string;
  }

  let { value }: Props = $props();
</script>

<LabeledInputGroup
  icon={PhoneIcon}
  label="Phone Number"
  placeholder="(123) 456-7890"
  {...patchMe.fields.phoneNumber.as("tel")}
  {value}
/>
{#each patchMe.fields.phoneNumber.issues() as issue, index (index)}
  <Field.Error>{issue.message}</Field.Error>
{/each}

<script lang="ts">
  import * as Field from "$lib/components/ui/field";
  import { patchMe } from "$lib/remotes/user.remote";
  import LabeledInputGroup from "$lib/components/LabeledInputGroup.svelte";

  interface Props {
    firstname: string;
    lastname: string;
  }

  let { firstname, lastname }: Props = $props();
</script>

<div class="grid grid-cols-2 gap-2">
  <LabeledInputGroup
    label="First Name"
    {...patchMe.fields.firstname.as("text")}
    value={firstname}
  />
  {#each patchMe.fields.firstname.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}

  <LabeledInputGroup label="Last Name" {...patchMe.fields.lastname.as("text")} value={lastname} />
  {#each patchMe.fields.lastname.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</div>

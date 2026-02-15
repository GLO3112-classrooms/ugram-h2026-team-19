<script lang="ts">
  import { AtSignIcon } from "@lucide/svelte";
  import * as Field from "$lib/components/ui/field/index.js";
  import * as InputGroup from "$lib/components/ui/input-group";
  import { createPost } from "$lib/remotes/post.remote";
</script>

<Field.Field>
  <Field.Label for="mention">Mention</Field.Label>
  <InputGroup.Root>
    <InputGroup.Input {...createPost.fields.mention.as("text")} id="mention" />
    <InputGroup.Addon>
      <AtSignIcon />
    </InputGroup.Addon>
  </InputGroup.Root>
  {#each createPost.fields.mention.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</Field.Field>

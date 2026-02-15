<script lang="ts">
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Field from "$lib/components/ui/field";
  import { updatePost } from "$lib/remotes/post.remote";

  interface Props {
    value: string;
  }

  let { value }: Props = $props();

  $effect(() => {
    updatePost.fields.description.set(value);
  });
</script>

<div class="grid w-full gap-1.5">
  <Label for="description">Description</Label>
  <Textarea {...updatePost.fields.description.as("text")} id="description" required />
  {#each updatePost.fields.description.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</div>

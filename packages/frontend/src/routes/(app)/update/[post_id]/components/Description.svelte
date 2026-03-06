<script lang="ts">
  import { Label } from "$lib/shadcn/label";
  import { Textarea } from "$lib/shadcn/textarea";
  import * as Field from "$lib/shadcn/field";
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

<script lang="ts">
  import { Label } from "$lib/shadcn/label";
  import { Textarea } from "$lib/shadcn/textarea";
  import * as Field from "$lib/shadcn/field";
  import { createPost } from "$lib/remotes/post.remote";
</script>

<div class="grid w-full gap-1.5">
  <Label for="description">Description</Label>
  <Textarea {...createPost.fields.description.as("text")} id="description" required />
  {#each createPost.fields.description.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</div>

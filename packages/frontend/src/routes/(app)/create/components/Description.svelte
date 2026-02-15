<script lang="ts">
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Field from "$lib/components/ui/field";
  import { createPost } from "$lib/remotes/post.remote";
</script>

<div class="grid w-full gap-1.5">
  <Label for="description">Description</Label>
  <Textarea {...createPost.fields.description.as("text")} id="description" required />
  {#each createPost.fields.description.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</div>

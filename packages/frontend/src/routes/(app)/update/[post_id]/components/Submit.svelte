<script lang="ts">
  import { Button } from "$lib/shadcn/button/index.js";
  import * as Field from "$lib/shadcn/field/index.js";
  import { updatePost } from "$lib/remotes/post.remote";
</script>

<Field.Field class="text-center">
  <Button type="submit">Update Post</Button>
  {#each updatePost.fields.id.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</Field.Field>

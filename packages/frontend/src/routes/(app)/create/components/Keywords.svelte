<script lang="ts">
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Field from "$lib/components/ui/field";
  import { createPost } from "$lib/remotes/post.remote";
  import Code from "$lib/components/Code.svelte";
</script>

<div class="grid w-full gap-1.5">
  <Label for="keywords">Keywords</Label>
  <Textarea {...createPost.fields.keywords.as("text")} id="keywords" />
  {#each createPost.fields.keywords.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
  <p class="text-xs text-muted-foreground">
    All non-alphanumeric characters will be considered as separators, except for the dash (<Code
      >-</Code
    >) and the underscore (<Code>_</Code>).
  </p>
</div>

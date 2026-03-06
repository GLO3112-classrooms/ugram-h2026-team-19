<script lang="ts">
  import { Input } from "$lib/shadcn/input/index.js";
  import { Label } from "$lib/shadcn/label/index.js";
  import * as Field from "$lib/shadcn/field";
  import { createPost } from "$lib/remotes/post.remote";

  let file = $derived(createPost.fields.image.value());
  let image = $derived(file ? URL.createObjectURL(file) : "");
</script>

<div class="grid w-full max-w-sm items-center gap-1.5">
  <Label for="image">Image</Label>
  <Input {...createPost.fields.image.as("file")} id="image" accept="image/*" required />
  {#each createPost.fields.image.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
  {#if image}
    <img class="max-h-64 w-full rounded-sm object-cover" src={image} alt="" />
  {/if}
</div>

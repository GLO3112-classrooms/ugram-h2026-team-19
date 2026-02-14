<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { createPost } from "$lib/remotes/post.remote";

  let file = $derived(createPost.fields.picture.value());
  let picture = $derived(file ? URL.createObjectURL(file) : "");
</script>

<div class="grid w-full max-w-sm items-center gap-1.5">
  <Label for="picture">Picture</Label>
  <Input {...createPost.fields.picture.as("file")} id="picture" accept="image/*" required />
  {#if picture}
    <img class="max-h-64 w-full rounded-sm object-cover" src={picture} alt="" />
  {/if}
</div>

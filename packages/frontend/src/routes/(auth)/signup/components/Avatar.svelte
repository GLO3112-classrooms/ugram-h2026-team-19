<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { signUp } from "$lib/remotes/auth.remote";
  import { PencilIcon, UserIcon } from "@lucide/svelte";

  let input: HTMLInputElement | null = $state(null);
  let files: FileList | null = $state(null);
  let image = $derived(files ? URL.createObjectURL(files[0]) : "");
</script>

<div class="flex items-center justify-center gap-2">
  <button
    class="group flex size-12 cursor-pointer items-center justify-center rounded-full bg-muted"
    type="button"
    onclick={() => input?.click()}
  >
    <Avatar.Root class="size-12 group-hover:hidden">
      <Avatar.Image src={image} />
      <Avatar.Fallback class="group-hover:hidden"><UserIcon /></Avatar.Fallback>
    </Avatar.Root>
    <PencilIcon class="hidden group-hover:inline" />
  </button>
</div>

<input
  {...signUp.fields.avatar.as("file")}
  type="file"
  accept="image/*"
  id="avatar"
  class="hidden"
  bind:this={input}
  bind:files
/>

<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { postAvatar } from "$lib/remotes/user.remote";
  import { PenIcon, TrashIcon, UploadIcon, UserIcon } from "@lucide/svelte";

  interface Props {
    avatarUrl: string;
  }

  let { avatarUrl }: Props = $props();

  let input: HTMLInputElement | null = $state(null);
</script>

<Dialog.Root>
  <Dialog.Trigger type="button" class="relative outline-none *:size-28">
    <Avatar.Root>
      <Avatar.Image class="object-cover" src={avatarUrl} />
      <Avatar.Fallback />
    </Avatar.Root>
    <span class="absolute top-0 flex cursor-pointer items-center justify-center bg-background/75">
      <PenIcon />
    </span>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Change Profile Picture</Dialog.Title>
    </Dialog.Header>

    <div class="grid grid-cols-2 justify-stretch gap-2">
      <Button class="cursor-pointer" size="lg" variant="secondary" onclick={() => input?.click()}>
        <UploadIcon /> Upload new
      </Button>
      <Button class="cursor-pointer" size="lg" variant="outline" disabled>
        <TrashIcon /> Delete current
      </Button>
    </div>

    <Dialog.Footer>
      <form {...postAvatar} enctype="multipart/form-data" class="w-full">
        <input {...postAvatar.fields.avatar.as("file")} bind:this={input} hidden />
        <Button type="submit" class="w-full cursor-pointer">Submit</Button>
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<script module lang="ts">
  import type { Snippet } from "svelte";
  import { resolve } from "$app/paths";
  import type { UserPartialData } from "backend/schemas";
  import * as Dialog from "$lib/shadcn/dialog";
  import { Button } from "$lib/shadcn/button";
  import { Input } from "$lib/shadcn/input";

  // TODO: replace with backend type
  type Comment = {
    id: string;
    comment: string;
    user: UserPartialData;
  };

  interface Props {
    comments: Comment[];
    children: Snippet;
  }
</script>

<script lang="ts">
  let { children, comments }: Props = $props();
</script>

<Dialog.Root>
  <Dialog.Trigger type="button" class="flex cursor-pointer gap-1">
    {@render children()}
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Comments</Dialog.Title>
    </Dialog.Header>
    <div class="max-h-[80vh] space-y-1 overflow-y-auto">
      {#each comments as comment (comment.id)}
        <p class="text-sm">
          <a
            href={resolve(`/user/${comment.user.id}`)}
            class="text-xs text-gray-300 hover:underline">{comment.user.username}</a
          >
          {comment.comment}
        </p>
      {/each}
    </div>
    <Dialog.Footer>
      <!-- TODO: add remote -->
      <form class="flex w-full max-w-sm items-center gap-2">
        <Input placeholder="Add a comment..." />
        <Button type="submit" variant="outline">Send</Button>
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

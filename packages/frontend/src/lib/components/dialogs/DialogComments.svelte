<script module lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import type { Snippet } from "svelte";
  import type { PostComment } from "backend/schemas";
  import * as Dialog from "$lib/shadcn/dialog";
  import { Button } from "$lib/shadcn/button";
  import { Input } from "$lib/shadcn/input";
  import { commentPost } from "$lib/remotes/post.remote";

  interface Props {
    postId: string;
    comments: PostComment[];
    children: Snippet;
    onCommentCreated?: (comment: PostComment) => void;
  }
</script>

<script lang="ts">
  let { children, comments, postId, onCommentCreated }: Props = $props();

  let content = $state("");
  let isSubmitting = $state(false);
  let errorMessage = $state<string | null>(null);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedContent = content.trim();
    if (!trimmedContent.length) {
      errorMessage = "Comment cannot be empty";
      return;
    }

    isSubmitting = true;
    errorMessage = null;

    await commentPost({ id: postId, content: trimmedContent })
      .then(async (result) => {
        // @ts-expect-error false positive
        if (!result.success) {
          // @ts-expect-error false positive
          if (result.redirect) {
            // @ts-expect-error false positive
            await goto(resolve(result.redirect));
            return;
          }
          // @ts-expect-error false positive
          errorMessage = result.message ?? "Something went wrong";
          return;
        }
        // @ts-expect-error false positive
        onCommentCreated?.(result.comment);
        content = "";
      })
      .catch(() => {
        errorMessage = "Network error. Please try again.";
      })
      .finally(() => {
        isSubmitting = false;
      });
  }
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
          {comment.content}
        </p>
      {/each}
    </div>
    <Dialog.Footer>
      <form class="flex w-full max-w-sm flex-col gap-2" onsubmit={handleSubmit}>
        <div class="flex w-full items-center gap-2">
          <Input placeholder="Add a comment..." bind:value={content} />
          <Button type="submit" variant="outline" disabled={isSubmitting}>Send</Button>
        </div>
        {#if errorMessage}
          <p class="text-xs text-red-500">{errorMessage}</p>
        {/if}
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

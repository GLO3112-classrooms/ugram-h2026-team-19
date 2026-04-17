<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { UserPartialData } from "backend/schemas";
  import * as Dialog from "$lib/shadcn/dialog";
  import UserLink from "$lib/components/UserLink.svelte";

  interface Props {
    likers: UserPartialData[];
    children: Snippet;
  }
</script>

<script lang="ts">
  let { children, likers }: Props = $props();
</script>

<Dialog.Root>
  <Dialog.Trigger type="button" class="flex cursor-pointer gap-1 hover:underline">
    {@render children()}
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Likes</Dialog.Title>
    </Dialog.Header>
    {#each likers as liker (liker.id)}
      <UserLink {...liker} />
    {/each}
  </Dialog.Content>
</Dialog.Root>

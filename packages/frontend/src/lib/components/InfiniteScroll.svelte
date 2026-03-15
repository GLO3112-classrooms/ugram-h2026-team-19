<script module lang="ts">
  import * as Empty from "$lib/shadcn/empty/index.js";
  import { FrownIcon, LoaderCircleIcon } from "@lucide/svelte";
  import type { RemoteQuery } from "@sveltejs/kit";
  import { onMount, type Snippet } from "svelte";
</script>

<script lang="ts" generics="T extends Record<string, unknown[] | number> & { total: number }">
  interface Props {
    children: Snippet<[Omit<T, "total">]>;
    callback: (skip: number, limit: number) => RemoteQuery<T>;
    limit?: number;
  }

  let { children, callback, limit = 10 }: Props = $props();

  let queries: T[] = $state([]);
  let count = $derived(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queries.reduce((acc, { total, ...rest }) => (acc += Object.values(rest)[0].length), 0)
  );
  async function loadMore() {
    queries.push(await callback(queries.length * limit, limit));
  }
  onMount(loadMore);
</script>

<div class="flex flex-col gap-2">
  <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
  {#each queries as { total, ...rest }, index (index)}
    {@render children(rest)}
  {/each}

  <Empty.Root>
    <Empty.Header>
      {#if (queries.at(-1)?.total ?? 0) - count}
        <Empty.Media variant="icon">
          <LoaderCircleIcon class="animate-spin" />
        </Empty.Media>
        <Empty.Description>Loading more content..</Empty.Description>
      {:else}
        <Empty.Media variant="icon">
          <FrownIcon />
        </Empty.Media>
        <Empty.Title>The End.</Empty.Title>
        <Empty.Description>Nothing to see here anymore</Empty.Description>
      {/if}
    </Empty.Header>
  </Empty.Root>
</div>

<svelte:window
  onscrollend={() => {
    if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight * 0.9) return;
    loadMore();
  }}
/>

<script module lang="ts">
  import { resolve } from "$app/paths";
  import type { Snippet } from "svelte";
  import type { NavigationBar } from "../Navbar.svelte";

  interface Props extends Omit<NavigationBar, "header"> {
    children: Snippet;
  }
</script>

<script lang="ts">
  let { children, content, footer }: Props = $props();
</script>

<div
  class="fixed bottom-0 z-50 flex h-18 w-screen items-center justify-around border-t bg-background *:size-full *:place-items-center *:content-center"
>
  {#each content.concat(footer) as { label, icon, url } (label)}
    {@const Icon = icon}
    <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
    <a href={resolve(url as any)}>
      <Icon />
    </a>
  {/each}
</div>

<main class="mx-auto mb-18 flex w-full max-w-lg flex-1 flex-col bg-background p-2">
  {@render children()}
</main>

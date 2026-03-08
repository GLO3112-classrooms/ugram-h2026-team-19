<script module lang="ts">
  import { resolve } from "$app/paths";
  import { getMe } from "$lib/remotes/user.remote";
  import * as Avatar from "$lib/shadcn/avatar";
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
  class="fixed bottom-0 flex h-18 w-screen items-center justify-around border-t bg-background *:size-full *:place-items-center *:content-center"
>
  {#each content as { label, icon, url } (label)}
    {@const Icon = icon}
    <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
    <a href={resolve(url as any)}>
      <Icon />
    </a>
  {/each}

  <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
  <a href={resolve(footer.url as any)}>
    <Avatar.Root>
      {#await getMe() then { profilePicture, username }}
        <Avatar.Image src={profilePicture} alt={username} />
      {/await}
      <Avatar.Fallback>
        <footer.icon />
      </Avatar.Fallback>
    </Avatar.Root>
  </a>
</div>

<main class="flex w-full flex-1 flex-col bg-background">
  {@render children()}
</main>

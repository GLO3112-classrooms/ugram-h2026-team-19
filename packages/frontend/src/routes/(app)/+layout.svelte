<script lang="ts">
  import * as Avatar from "$lib/shadcn/avatar/index.js";
  import { Button } from "$lib/shadcn/button/index.js";
  import * as Tooltip from "$lib/shadcn/tooltip/index.js";
  import {
    GalleryVerticalEndIcon,
    HouseIcon,
    PlusIcon,
    SearchIcon,
    UserIcon
  } from "@lucide/svelte";
  let { children } = $props();

  const items = [
    {
      tooltip: "Home",
      url: "/",
      icon: HouseIcon
    },
    {
      tooltip: "Search",
      url: "/search",
      icon: SearchIcon
    },
    {
      tooltip: "Create",
      url: "/create",
      icon: PlusIcon
    }
  ];
</script>

<nav
  class="fixed top-0 flex h-screen w-11 shrink-0 flex-col items-center justify-between py-2 md:w-16 md:px-2"
>
  <Button variant="link" size="icon-lg" class="cursor-pointer">
    <GalleryVerticalEndIcon />
  </Button>

  <div class="flex flex-col gap-1">
    {#each items as item (item.url)}
      {@const Icon = item.icon}
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button href={item.url} variant="ghost" size="icon-lg" class="cursor-pointer">
            <Icon />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">
          <p>{item.tooltip}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    {/each}
  </div>

  <Button variant="link" size="icon-lg" href="/account">
    <Avatar.Root>
      <Avatar.Image />
      <Avatar.Fallback>
        <UserIcon />
      </Avatar.Fallback>
    </Avatar.Root>
  </Button>
</nav>

<main class="mx-11 flex flex-col items-center md:mx-16">
  {@render children?.()}
</main>

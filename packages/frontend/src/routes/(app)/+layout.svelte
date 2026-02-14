<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
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

<div class="flex">
  <nav class="sticky top-0 flex h-screen w-16 shrink-0 flex-col items-center justify-between p-2">
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

  <main class="mr-16 grow">
    {@render children?.()}
  </main>
</div>

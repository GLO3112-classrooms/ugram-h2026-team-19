<script lang="ts">
  import { resolve } from "$app/paths";
  import Logo from "$lib/components/Logo.svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";
  import { getNotifications } from "$lib/remotes/user.remote";
  import Button from "$lib/shadcn/button/button.svelte";
  import * as Drawer from "$lib/shadcn/drawer/index.js";
  import * as Empty from "$lib/shadcn/empty/index.js";
  import * as Item from "$lib/shadcn/item/index.js";
  import { BellIcon, BellOffIcon, HeartIcon, MessageCircleIcon } from "@lucide/svelte";

  const isMobile = new IsMobile();
</script>

<div class="flex justify-between">
  <Logo />

  <Drawer.Root direction={isMobile.current ? "top" : "right"}>
    <Drawer.Trigger>
      <Button variant="ghost" class="cursor-pointer">
        <BellIcon />
      </Button>
    </Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title class="flex items-center gap-2 text-xl">Notifications</Drawer.Title>
      </Drawer.Header>

      <div class="flex flex-col gap-2 p-4">
        {#each await getNotifications() as { description, postId, createdAt }, index (index)}
          <Item.Root>
            {#snippet child({ props })}
              <a href={resolve(`/post/${postId}`)} {...props}>
                <Item.Media>
                  {#if description.includes("commented")}
                    <MessageCircleIcon />
                  {:else}
                    <HeartIcon />
                  {/if}
                </Item.Media>
                <Item.Content>
                  <Item.Title class="font-bold">{description}</Item.Title>
                  <Item.Description class="text-xs">
                    {new Date(createdAt).toLocaleString()}
                  </Item.Description>
                </Item.Content>
              </a>
            {/snippet}
          </Item.Root>
        {:else}
          <Empty.Root>
            <Empty.Header>
              <Empty.Media variant="icon">
                <BellOffIcon />
              </Empty.Media>
              <Empty.Title>Empty inbox</Empty.Title>
              <Empty.Description>Nothing new to see here.</Empty.Description>
            </Empty.Header>
          </Empty.Root>
        {/each}
      </div>
    </Drawer.Content>
  </Drawer.Root>
</div>

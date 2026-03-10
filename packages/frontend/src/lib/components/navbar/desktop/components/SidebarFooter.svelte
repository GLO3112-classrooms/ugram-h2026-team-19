<script module lang="ts">
  import { resolve } from "$app/paths";
  import * as Avatar from "$lib/shadcn/avatar";
  import * as DropdownMenu from "$lib/shadcn/dropdown-menu/index.js";
  import * as Sidebar from "$lib/shadcn/sidebar/index.js";
  import { ChevronRightIcon, LogOutIcon, MoonIcon } from "@lucide/svelte";
  import type { NavigationBar } from "../../Navbar.svelte";
  import { Skeleton } from "$lib/shadcn/skeleton";
  import { getMe } from "$lib/remotes/user.remote";
  import { signOut } from "$lib/remotes/auth.remote";

  type Props = NavigationBar["footer"];
</script>

<script lang="ts">
  let { label, icon, url }: Props = $props();
</script>

<Sidebar.Footer>
  <Sidebar.Menu>
    <Sidebar.MenuItem>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            {@const Icon = icon}
            <Sidebar.MenuButton {...props} size="lg" class="cursor-pointer">
              <Avatar.Root class="rounded-lg">
                {#await getMe() then { profilePicture, username }}
                  <Avatar.Image src={profilePicture} alt={username} />
                {/await}
                <Avatar.Fallback class="rounded-lg">
                  <Icon />
                </Avatar.Fallback>
              </Avatar.Root>

              <div class="grid flex-1 gap-1 text-start text-sm leading-tight">
                {#await getMe()}
                  <Skeleton class="h-3.5 w-11/12" />
                  <Skeleton class="h-3 w-1/2" />
                {:then { username, email }}
                  <span class="truncate font-bold">{username}</span>
                  <span class="truncate text-xs">{email}</span>
                {/await}
              </div>

              <ChevronRightIcon />
            </Sidebar.MenuButton>
          {/snippet}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          align="end"
          side="right"
          class="w-(--bits-dropdown-menu-anchor-width)"
        >
          <DropdownMenu.Group>
            <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
            <a href={resolve(url as any)}>
              <DropdownMenu.Item class="cursor-pointer">
                {@const Icon = icon}
                <Icon />
                {label}
              </DropdownMenu.Item>
            </a>
            <DropdownMenu.Item disabled>
              <MoonIcon />
              Dark theme
            </DropdownMenu.Item>
          </DropdownMenu.Group>

          <DropdownMenu.Separator />

          <form {...signOut}>
            <button class="w-full">
              <DropdownMenu.Item class="cursor-pointer" variant="destructive">
                <LogOutIcon />
                Log out
              </DropdownMenu.Item>
            </button>
          </form>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Sidebar.MenuItem>
  </Sidebar.Menu>
</Sidebar.Footer>

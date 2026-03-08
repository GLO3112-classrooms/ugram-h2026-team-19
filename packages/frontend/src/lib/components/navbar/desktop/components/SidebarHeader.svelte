<script module lang="ts">
  import { resolve } from "$app/paths";
  import * as Avatar from "$lib/shadcn/avatar";
  import * as Sidebar from "$lib/shadcn/sidebar/index.js";
  import type { NavigationBar } from "../../Navbar.svelte";

  type Props = NavigationBar["header"];
</script>

<script lang="ts">
  let { label, icon: Icon, url }: Props = $props();
</script>

<Sidebar.Header class="shrink-0">
  <Sidebar.Menu class="w-auto">
    <Sidebar.MenuItem>
      <Sidebar.MenuButton size="lg">
        {#snippet child({ props })}
          <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
          <a href={resolve(url as any)} {...props}>
            <!-- Don't ask questions about that avatar component -->
            <Avatar.Root class="rounded-md">
              <Avatar.Fallback class="rounded-md bg-primary text-primary-foreground">
                <Icon class="size-4" />
              </Avatar.Fallback>
            </Avatar.Root>
            <span>{label}</span>
          </a>
        {/snippet}
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
  </Sidebar.Menu>
</Sidebar.Header>

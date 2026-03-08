<script module lang="ts">
  import { resolve } from "$app/paths";
  import * as Sidebar from "$lib/shadcn/sidebar/index.js";
  import type { NavigationBar } from "../../Navbar.svelte";

  interface Props {
    open: boolean;
    items: NavigationBar["content"];
  }
</script>

<script lang="ts">
  let { open, items }: Props = $props();
</script>

<Sidebar.Content class="justify-center">
  <Sidebar.Group>
    <Sidebar.Menu>
      {#each items as { label, url, icon } (label)}
        {@const Icon = icon}
        <Sidebar.MenuItem>
          <Sidebar.MenuButton size={open ? "lg" : "default"}>
            {#snippet child({ props })}
              <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
              <a href={resolve(url as any)} {...props}>
                <Icon />
                <span>{label}</span>
              </a>
            {/snippet}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      {/each}
    </Sidebar.Menu>
  </Sidebar.Group>
</Sidebar.Content>

<script module lang="ts">
  import * as Sidebar from "$lib/shadcn/sidebar";
  import type { Snippet } from "svelte";
  import type { NavigationBar } from "../Navbar.svelte";
  import SidebarHeader from "./components/SidebarHeader.svelte";
  import SidebarContent from "./components/SidebarContent.svelte";
  import SidebarFooter from "./components/SidebarFooter.svelte";

  interface Props extends NavigationBar {
    children: Snippet;
  }
</script>

<script lang="ts">
  let { children, header, content, footer }: Props = $props();
  let open = $state(false);
</script>

<Sidebar.Provider {open}>
  <Sidebar.Root
    onmouseover={() => (open = true)}
    onmouseout={() => (open = false)}
    collapsible="icon"
    variant="inset"
  >
    <SidebarHeader {...header} />

    <SidebarContent {open} items={content} />

    <SidebarFooter {...footer} />
  </Sidebar.Root>

  <Sidebar.Inset>
    <div class="mx-auto flex w-full max-w-xl flex-col p-2">
      {@render children?.()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>

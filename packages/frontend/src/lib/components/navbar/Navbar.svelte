<script module lang="ts">
  import type { Pathname, RouteId } from "$app/types";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";
  import type { Icon } from "@lucide/svelte";
  import type { Snippet } from "svelte";
  import DesktopNavbar from "./desktop/DesktopNavbar.svelte";
  import MobileNavbar from "./mobile/MobileNavbar.svelte";

  type NavigationItem = {
    label: string;
    icon: typeof Icon;
    url: Pathname | RouteId;
  };

  export type NavigationBar = {
    header: NavigationItem;
    content: NavigationItem[];
    footer: NavigationItem;
  };

  interface Props extends NavigationBar {
    children: Snippet;
  }
</script>

<script lang="ts">
  let { children, header, content, footer }: Props = $props();

  const isMobile = new IsMobile();
</script>

{#if isMobile.current}
  <MobileNavbar {content} {footer}>
    {@render children?.()}
  </MobileNavbar>
{:else}
  <DesktopNavbar {header} {content} {footer}>
    {@render children?.()}
  </DesktopNavbar>
{/if}

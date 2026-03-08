<script module lang="ts">
  import Navbar, { type NavigationBar } from "$lib/components/navbar/Navbar.svelte";
  import {
    GalleryVerticalEndIcon,
    HouseIcon,
    PlusIcon,
    SearchIcon,
    UserIcon
  } from "@lucide/svelte";
</script>

<script lang="ts">
  let { children } = $props();

  const navbar: NavigationBar = {
    header: {
      label: "Ugram.",
      icon: GalleryVerticalEndIcon,
      url: "/"
    },
    content: [
      {
        label: "Home",
        icon: HouseIcon,
        url: "/"
      },
      {
        label: "Search",
        icon: SearchIcon,
        url: "/search"
      },
      {
        label: "Create",
        icon: PlusIcon,
        url: "/create"
      }
    ],
    footer: {
      label: "Account",
      icon: UserIcon,
      url: "/account"
    }
  };
</script>

<Navbar {...navbar}>
  {@render children?.()}
</Navbar>

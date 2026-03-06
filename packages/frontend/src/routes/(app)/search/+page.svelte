<script lang="ts">
  import { SearchIcon } from "@lucide/svelte";
  import type { UserData } from "backend/schemas";
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import * as InputGroup from "$lib/shadcn/input-group";
  import { getUsers } from "$lib/remotes/user.remote";
  import User from "$lib/components/User.svelte";

  let users = $state<UserData[]>([]);
  let loading = $state(false);
  let hasMore = $state(true);
  let error = $state(false);
  let total = 0;

  let search = $state("");
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  async function loadMoreUsers() {
    if (error || loading || !hasMore) return;

    loading = true;
    try {
      const result = await getUsers({ search, skip: users.length });
      users = [...users, ...result.users];
      total = result.total;
      hasMore = users.length < total;

      if (hasMore && !isPageScrollable()) {
        loading = false;
        await loadMoreUsers();
      }
    } catch {
      error = true;
    } finally {
      loading = false;
    }
  }

  function isPageScrollable() {
    return document.documentElement.scrollHeight > window.innerHeight;
  }

  function handleSearch() {
    if (searchTimer) clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
      users = [];
      hasMore = true;
      error = false;
      loadMoreUsers();
    }, 300);
  }

  function handleScroll() {
    if (error || loading || !hasMore) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight * 0.8) {
      loadMoreUsers();
    }
  }

  onMount(() => {
    loadMoreUsers();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<div class="mx-auto max-w-5xl">
  <div class="sticky top-0 z-10 bg-background px-7 pt-7">
    <InputGroup.Root>
      <InputGroup.Input
        type="text"
        placeholder="Search users by username"
        bind:value={search}
        oninput={handleSearch}
      />
      <InputGroup.Addon>
        <SearchIcon />
      </InputGroup.Addon>
    </InputGroup.Root>
  </div>

  <div class="space-y-5 p-3 md:p-7">
    {#each users as user (user.id)}
      <div>
        <a href={resolve(`/user/${user.id}`)}>
          <User {...user} />
        </a>
      </div>
    {/each}

    {#if error}
      <p class="py-8 text-center text-red-500">
        Oops! Something went wrong while loading users. Please try again later.
      </p>
    {:else if loading}
      <div class="flex justify-center py-8">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    {:else if !hasMore && users.length}
      <p class="py-8 text-center text-gray-500">
        You've reached the end of the users matching your search!
      </p>
    {:else if !users.length}
      <p class="py-8 text-center text-gray-500">
        No users found matching your search. Try adjusting your search criteria or check back later
        for new users!
      </p>
    {/if}
  </div>
</div>

<script module lang="ts">
  import InfiniteScroll from "$lib/components/InfiniteScroll.svelte";
  import { getPosts } from "$lib/remotes/post.remote";
  import { getUsers } from "$lib/remotes/user.remote";
  import * as InputGroup from "$lib/shadcn/input-group";
  import * as Tabs from "$lib/shadcn/tabs/index.js";
  import { HashIcon, SearchIcon, TextAlignStartIcon, UserIcon } from "@lucide/svelte";
  import UserLink from "./components/UserLink.svelte";
  import Post from "$lib/components/Post.svelte";

  const tabs = [
    {
      label: "user",
      icon: UserIcon,
      component: UserLink
    },
    {
      label: "description",
      icon: TextAlignStartIcon,
      component: undefined
    },
    {
      label: "keyword",
      icon: HashIcon,
      component: undefined
    }
  ] as const;
</script>

<script lang="ts">
  let value: string = $state("");
  let tab: (typeof tabs)[number]["label"] = $state(tabs[0].label);
</script>

<div class=" flex flex-col gap-2">
  <InputGroup.Root>
    <InputGroup.Input placeholder="Search..." bind:value />
    <InputGroup.Addon>
      <SearchIcon />
    </InputGroup.Addon>
  </InputGroup.Root>

  <Tabs.Root bind:value={tab}>
    <Tabs.List class="h-10 w-full">
      {#each tabs as { label, icon } (label)}
        {@const Icon = icon}
        <Tabs.Trigger class="capitalize" value={label}>
          <Icon />
          {label}
        </Tabs.Trigger>
      {/each}
    </Tabs.List>

    {#if tab === "user"}
      <Tabs.Content value="user">
        {#key value}
          <InfiniteScroll callback={(skip, limit) => getUsers({ search: value, skip, limit })}>
            {#snippet children({ users })}
              {#each users as user (user.username)}
                <UserLink {...user} />
              {/each}
            {/snippet}
          </InfiniteScroll>
        {/key}
      </Tabs.Content>
    {/if}

    {#if tab === "description"}
      <Tabs.Content value="description">
        {#key value}
          <InfiniteScroll callback={(skip, limit) => getPosts({ description: value, skip, limit })}>
            {#snippet children({ posts })}
              {#each posts as post (post.id)}
                <Post {...post} own={false} />
              {/each}
            {/snippet}
          </InfiniteScroll>
        {/key}
      </Tabs.Content>
    {/if}

    {#if tab === "keyword"}
      <Tabs.Content value="keyword">
        {#key value}
          <InfiniteScroll callback={(skip, limit) => getPosts({ keywords: value, skip, limit })}>
            {#snippet children({ posts })}
              {#each posts as post (post.id)}
                <Post {...post} own={false} />
              {/each}
            {/snippet}
          </InfiniteScroll>
        {/key}
      </Tabs.Content>
    {/if}
  </Tabs.Root>
</div>

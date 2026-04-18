<script module lang="ts">
  import Code from "$lib/components/Code.svelte";
  import InfiniteScroll from "$lib/components/InfiniteScroll.svelte";
  import Post from "$lib/components/Post.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { getKeywords, getPosts } from "$lib/remotes/post.remote";
  import { getMe, getUsers } from "$lib/remotes/user.remote";
  import Button from "$lib/shadcn/button/button.svelte";
  import * as InputGroup from "$lib/shadcn/input-group";
  import { ScrollArea } from "$lib/shadcn/scroll-area/index.js";
  import Separator from "$lib/shadcn/separator/separator.svelte";
  import * as Tabs from "$lib/shadcn/tabs/index.js";
  import { HashIcon, SearchIcon, TextAlignStartIcon, UserIcon } from "@lucide/svelte";

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
  const me = await getMe();

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
                <Post {post} own={false} currentUser={me} />
              {/each}
            {/snippet}
          </InfiniteScroll>
        {/key}
      </Tabs.Content>
    {/if}

    {#if tab === "keyword"}
      <Tabs.Content value="keyword">
        <div class="flex flex-col gap-2">
          <p class="mb-1 text-xs text-muted-foreground">
            All non-alphanumeric characters will be ignored, except for the dash (<Code>-</Code>)
            and the underscore (<Code>_</Code>). Spaces are ignored too, so <Code>key word</Code> will
            search for <Code>keyword</Code> for example.
          </p>

          <ScrollArea orientation="horizontal">
            <div class="flex items-center gap-2">
              <p class="text-xs">Trending<br />keywords</p>
              {#each await getKeywords() as { value: keyword } (keyword)}
                <Button
                  variant="secondary"
                  size="sm"
                  onclick={() => (value = keyword)}
                  class="cursor-pointer rounded-2xl">{keyword}</Button
                >
              {/each}
            </div>
          </ScrollArea>

          <Separator />
        </div>

        {#key value}
          <InfiniteScroll callback={(skip, limit) => getPosts({ keywords: value, skip, limit })}>
            {#snippet children({ posts })}
              {#each posts as post (post.id)}
                <Post {post} own={false} currentUser={me} />
              {/each}
            {/snippet}
          </InfiniteScroll>
        {/key}
      </Tabs.Content>
    {/if}
  </Tabs.Root>
</div>

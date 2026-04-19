<script lang="ts">
  import { getMessages, sendMessage } from "$lib/remotes/message.remote";
  import { getMe } from "$lib/remotes/user.remote";
  import Button from "$lib/shadcn/button/button.svelte";
  import * as Empty from "$lib/shadcn/empty";
  import Input from "$lib/shadcn/input/input.svelte";
  import { MessageCircleOffIcon, SendIcon } from "@lucide/svelte";
  import { onMount } from "svelte";

  let { params } = $props();

  const me = await getMe();

  let messages = $state(await getMessages({ id: params.user_id }));
  onMount(() => {
    const interval = setInterval(async () => {
      messages.unshift(
        ...(await getMessages({
          id: params.user_id,
          since: messages[0].createdAt
        }).run())
      );
    }, 1500);

    return () => clearInterval(interval);
  });
</script>

<div class="flex flex-col-reverse gap-2 overflow-y-auto" id="messages">
  {#each messages as { content, createdAt, from } (createdAt)}
    <div
      class={`${from !== me.id ? "self-start *:self-start" : "self-end *:self-end"} flex flex-col gap-1`}
    >
      <p class="w-fit rounded-full bg-accent p-1 px-3 font-bold">{content}</p>
      <p class="px-2 text-[0.65rem]">{new Date(createdAt).toLocaleTimeString().slice(0, -3)}</p>
    </div>
  {:else}
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon">
          <MessageCircleOffIcon />
        </Empty.Media>
        <Empty.Title>No messages</Empty.Title>
      </Empty.Header>
    </Empty.Root>
  {/each}
</div>

<form {...sendMessage} class="pt-2">
  <input {...sendMessage.fields.to.as("hidden", params.user_id)} />

  <div class="flex w-full items-center gap-2">
    <Input {...sendMessage.fields.content.as("text")} placeholder="Enter your message.." required />
    <Button variant="secondary" size="icon" class="cursor-pointer" type="submit">
      <SendIcon />
    </Button>
  </div>
</form>

<style>
  #messages {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  #messages::-webkit-scrollbar {
    display: none;
  }
</style>

<script lang="ts">
  import { resolve } from "$app/paths";
  import * as Avatar from "$lib/shadcn/avatar";
  import { Button } from "$lib/shadcn/button";
  import { UserIcon } from "@lucide/svelte";
  import type { UserPartialData } from "backend/schemas";

  let { username, profilePicture, firstname, lastname, id }: UserPartialData = $props();
</script>

<Button
  variant="ghost"
  class="h-16 cursor-pointer justify-start gap-3"
  href={resolve(`/user/${id}`)}
>
  <Avatar.Root class="aspect-square h-full w-fit">
    <Avatar.Image class="object-cover" src={profilePicture} alt={username} />
    <Avatar.Fallback class="uppercase">
      <UserIcon />
    </Avatar.Fallback>
  </Avatar.Root>

  <div class="flex flex-col items-start">
    <p class="text-xs">{firstname} {lastname}</p>
    <p class="font-bold">{username}</p>
  </div>
</Button>

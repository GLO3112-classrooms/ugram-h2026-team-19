<script lang="ts">
  import { UserIcon } from "@lucide/svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";

  interface Props {
    src: string;
    username: string;
  }

  let { src, username }: Props = $props();
</script>

<Avatar.Root class="aspect-square h-full w-fit">
  <Avatar.Image class="object-cover" {src} alt={username} />
  <Avatar.Fallback><UserIcon /></Avatar.Fallback>
</Avatar.Root>

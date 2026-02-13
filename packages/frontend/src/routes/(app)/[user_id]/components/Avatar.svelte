<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import initials from "$lib/utils/initials.ts";

  interface Props {
    src: stirng;
    username: string;
    firstname: string;
    lastname: string;
  }

  let { src, username, firstname, lastname }: Props = $props();
</script>

<Avatar.Root class="size-20">
  <Avatar.Image class="object-cover" {src} alt={username} />
  <Avatar.Fallback>{initials(firstname, lastname)}</Avatar.Fallback>
</Avatar.Root>

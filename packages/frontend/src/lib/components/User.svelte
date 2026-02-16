<script lang="ts">
  import Avatar from "./Avatar.svelte";

  interface Props {
    profilePicture: string;
    username: string;
    firstname: string;
    lastname: string;
  }

  let { profilePicture, username, firstname, lastname }: Props = $props();
</script>

<div class="flex h-20 items-center gap-2 pl-2">
  <Avatar src={profilePicture} {username} />
  <div>
    <p class="text-xs">@{username}</p>
    <p>{firstname} {lastname}</p>
  </div>
</div>

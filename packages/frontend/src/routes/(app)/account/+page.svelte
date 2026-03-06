<script lang="ts">
  import { Button } from "$lib/shadcn/button/index.js";

  import EditableAvatar from "./components/EditableAvatar.svelte";
  import Email from "./components/Email.svelte";
  import Names from "./components/Names.svelte";
  import PhoneNumber from "./components/PhoneNumber.svelte";

  import { getMe, patchMe } from "$lib/remotes/user.remote";
</script>

<svelte:boundary>
  {#await getMe() then user}
    <form {...patchMe} class="flex max-w-lg flex-col items-center gap-8 pt-8 *:w-full">
      <div class="flex justify-center gap-6">
        <EditableAvatar avatarUrl={user.profilePicture} />
        <div class="flex flex-col py-2">
          <h2 class="text-2xl">@{user.username}</h2>
          <p class="text-sm text-muted-foreground">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <Names firstname={user.firstname} lastname={user.lastname} />
        <PhoneNumber value={user.phoneNumber} />
        <Email value={user.email} />
      </div>

      <Button type="submit" class="cursor-pointer">Submit</Button>
    </form>
  {/await}

  {#snippet pending()}{/snippet}
</svelte:boundary>

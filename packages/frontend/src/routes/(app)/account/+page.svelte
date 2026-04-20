<script lang="ts">
  import { signOut } from "$lib/remotes/auth.remote";
  import { getMe, patchMe } from "$lib/remotes/user.remote";
  import { Button } from "$lib/shadcn/button/index.js";
  import { LogOutIcon } from "@lucide/svelte";

  import EditableAvatar from "./components/EditableAvatar.svelte";
  import Email from "./components/Email.svelte";
  import Names from "./components/Names.svelte";
  import PhoneNumber from "./components/PhoneNumber.svelte";
  import Delete from "./components/Delete.svelte";
</script>

<svelte:boundary>
  {#await getMe() then { profilePicture, username, createdAt, lastname, firstname, phoneNumber, email }}
    <div class="mx-auto flex flex-col gap-12 pt-8">
      <form {...patchMe} class="flex flex-col items-center gap-8">
        <div class="flex justify-center gap-6">
          <EditableAvatar avatarUrl={profilePicture} />
          <div class="flex flex-col py-2">
            <h2 class="text-2xl">@{username}</h2>
            <p class="text-sm text-muted-foreground">
              Member since {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                new Date(createdAt)
              )}
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <Names {firstname} {lastname} />
          <PhoneNumber value={phoneNumber} />
          <Email value={email} />
        </div>

        <Button type="submit" class="w-full cursor-pointer">Submit</Button>
      </form>

      <div class="flex gap-4 **:w-full">
        <form {...signOut.for("account")}>
          <Button type="submit" class="w-full cursor-pointer" variant="destructive">
            <LogOutIcon />
            Sign Out
          </Button>
        </form>

        <Delete />
      </div>
    </div>
  {/await}

  {#snippet pending()}{/snippet}
</svelte:boundary>

<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Field from "$lib/components/ui/field/index.js";

  import Email from "./components/Email.svelte";
  import Names from "./components/Names.svelte";
  import Password from "./components/Password.svelte";
  import Phone from "./components/Phone.svelte";
  import Submit from "./components/Submit.svelte";
  import Username from "./components/Username.svelte";

  import { signUp } from "$lib/remotes/auth.remote";
  import Header from "$lib/components/Header.svelte";
  import Logo from "$lib/components/Logo.svelte";
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
  <div class="flex w-full max-w-sm flex-col gap-6">
    <Logo />
    <div class="flex flex-col gap-6">
      <Card.Root>
        <Header
          title="Create your account"
          description="Fill in the form below to create your account"
        />
        <Card.Content>
          <form {...signUp}>
            <Field.Group>
              <Username />
              <Names />
              <Email />
              <Phone />
              <Password />
              <Submit />
              <!-- TODO Please remove the `profilePicture` field -->
              <input
                hidden
                {...signUp.fields.profilePicture.as("text")}
                value="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fs.yimg.com%2Fos%2Fcreatr-uploaded-images%2F2021-02%2F572c4830-721d-11eb-bb63-96959c3b62f2&f=1&nofb=1&ipt=cdb11597554e70e0cd0367283f54eb8bb0403613c1435d79c2552b27fb0a4abf"
              />
            </Field.Group>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>

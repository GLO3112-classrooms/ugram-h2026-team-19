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
            </Field.Group>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>

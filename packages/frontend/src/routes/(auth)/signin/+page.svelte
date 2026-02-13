<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Field from "$lib/components/ui/field/index.js";

  import Header from "../components/Header.svelte";
  import Logo from "../components/Logo.svelte";
  import Password from "./components/Password.svelte";
  import Submit from "./components/Submit.svelte";
  import Email from "./components/Email.svelte";

  import { signIn } from "$lib/remotes/auth.remote";
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
  <div class="flex w-full max-w-sm flex-col gap-6">
    <Logo />
    <div class="flex flex-col gap-6">
      <Card.Root>
        <Header title="Welcome back" description="Login with your account" />
        <Card.Content>
          <form {...signIn}>
            <Field.Group>
              <Email />
              <Password />
              <Submit />
            </Field.Group>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>

<script lang="ts">
  import { resolve } from "$app/paths";
  import { signIn } from "$lib/remotes/auth.remote";

  import * as Card from "$lib/shadcn/card/index.js";
  import * as Field from "$lib/shadcn/field/index.js";

  import CardHeader from "$lib/components/CardHeader.svelte";
  import FieldButton from "$lib/components/fields/FieldButton.svelte";
  import LabeledInput from "$lib/components/fields/FieldInput.svelte";
</script>

<div class="flex flex-col gap-6">
  <Card.Root>
    <CardHeader title="Welcome back" description="Login with your account" />

    <Card.Content>
      <form {...signIn}>
        <Field.Group>
          <LabeledInput
            required
            label="email"
            placeholder="jdoe@example.com"
            {...signIn.fields.email.as("email")}
            issues={signIn.fields.email.issues()}
          />

          <LabeledInput
            required
            label="password"
            placeholder="Enter your password"
            {...signIn.fields.password.as("password")}
            issues={signIn.fields.password.issues()}
          />

          <FieldButton type="submit">
            Login
            {#snippet footer()}
              Don't have an account? <a href={resolve("/signup")}>Sign up</a>
            {/snippet}
          </FieldButton>
        </Field.Group>
      </form>
    </Card.Content>
  </Card.Root>
</div>

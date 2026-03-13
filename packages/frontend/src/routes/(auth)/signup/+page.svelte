<script module lang="ts">
  import { resolve } from "$app/paths";
  import CardHeader from "$lib/components/CardHeader.svelte";
  import FieldButton from "$lib/components/fields/FieldButton.svelte";
  import FieldInput from "$lib/components/fields/FieldInput.svelte";
  import { signUp } from "$lib/remotes/auth.remote";
  import * as Card from "$lib/shadcn/card/index.js";
  import * as Field from "$lib/shadcn/field/index.js";
</script>

<script lang="ts">
  let value: string | undefined = $state();
</script>

<div class="flex flex-col gap-6">
  <Card.Root>
    <CardHeader
      title="Create your account"
      description="Fill in the form below to create your account"
    />

    <Card.Content>
      <form {...signUp}>
        <Field.Group>
          <FieldInput
            required
            label="username"
            placeholder="jdoe"
            {...signUp.fields.username.as("text")}
            issues={signUp.fields.username.issues()}
          />

          <Field.Field class="grid grid-cols-2 gap-2">
            <FieldInput
              required
              label="first name"
              placeholder="John"
              {...signUp.fields.firstname.as("text")}
              issues={signUp.fields.firstname.issues()}
            />

            <FieldInput
              required
              label="last name"
              placeholder="Doe"
              {...signUp.fields.lastname.as("text")}
              issues={signUp.fields.lastname.issues()}
            />
          </Field.Field>

          <FieldInput
            required
            label="email"
            placeholder="jdoe@example.com"
            {...signUp.fields.email.as("email")}
            issues={signUp.fields.email.issues()}
          />

          <FieldInput
            required
            label="phone"
            placeholder="(123) 456-7890"
            {...signUp.fields.phoneNumber.as("tel")}
            issues={signUp.fields.phoneNumber.issues()}
          />

          <Field.Field>
            <Field.Field class="grid grid-cols-2 gap-2">
              <FieldInput
                required
                label="password"
                {...signUp.fields.password.as("password")}
                issues={signUp.fields.password.issues()}
              />

              <FieldInput
                required
                label="confirm password"
                type="password"
                aria-invalid={signUp.fields.password.value() !== value}
              />
            </Field.Field>
            <Field.Description>Must be at least 8 characters long.</Field.Description>
          </Field.Field>

          <FieldButton type="submit">
            Create Account
            {#snippet footer()}
              Already have an account? <a href={resolve("/signin")}>Sign in</a>
            {/snippet}
          </FieldButton>
        </Field.Group>
      </form>
    </Card.Content>
  </Card.Root>
</div>

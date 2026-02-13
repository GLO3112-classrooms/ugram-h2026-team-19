<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { signUp } from "$lib/remotes/auth.remote";

  let value: string | undefined = $state(undefined);
  let invalid = $derived(signUp.fields.password.value() !== value);
</script>

<Field.Field>
  <Field.Field class="grid grid-cols-2 gap-4">
    <Field.Field>
      <Field.Label for="password">Password</Field.Label>
      <Input {...signUp.fields.password.as("password")} id="password" required />
    </Field.Field>
    <Field.Field>
      <Field.Label for="confirm-password">Confirm Password</Field.Label>
      <Input bind:value id="confirm-password" type="password" required aria-invalid={invalid} />
    </Field.Field>
  </Field.Field>
  <Field.Description>Must be at least 8 characters long.</Field.Description>
</Field.Field>

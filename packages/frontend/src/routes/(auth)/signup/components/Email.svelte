<script lang="ts">
  import * as Field from "$lib/shadcn/field/index.js";
  import { Input } from "$lib/shadcn/input/index.js";
  import { signUp } from "$lib/remotes/auth.remote";
</script>

<Field.Field>
  <Field.Label for="email">Email</Field.Label>
  <Input {...signUp.fields.email.as("email")} id="email" placeholder="m@example.com" required />
  {#each signUp.fields.email.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</Field.Field>

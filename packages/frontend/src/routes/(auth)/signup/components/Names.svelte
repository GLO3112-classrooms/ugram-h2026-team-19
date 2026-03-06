<script lang="ts">
  import * as Field from "$lib/shadcn/field/index.js";
  import { Input } from "$lib/shadcn/input/index.js";
  import { signUp } from "$lib/remotes/auth.remote";
</script>

<Field.Field>
  <Field.Field class="grid grid-cols-2 gap-4">
    <Field.Field>
      <Field.Label for="first-name">First Name</Field.Label>
      <Input {...signUp.fields.firstname.as("text")} id="first-name" placeholder="John" required />
      {#each signUp.fields.firstname.issues() as issue, index (index)}
        <Field.Error>{issue.message}</Field.Error>
      {/each}
    </Field.Field>
    <Field.Field>
      <Field.Label for="last-name">Last Name</Field.Label>
      <Input {...signUp.fields.lastname.as("text")} id="last-name" placeholder="Doe" required />
      {#each signUp.fields.lastname.issues() as issue, index (index)}
        <Field.Error>{issue.message}</Field.Error>
      {/each}
    </Field.Field>
  </Field.Field>
</Field.Field>

<script lang="ts">
  import * as Field from "$lib/shadcn/field/index.js";
  import { Input } from "$lib/shadcn/input/index.js";
  import { signUp } from "$lib/remotes/auth.remote";
</script>

<Field.Field>
  <Field.Label for="phone">Phone</Field.Label>
  <Input
    {...signUp.fields.phoneNumber.as("tel")}
    id="phone"
    placeholder="(123) 456-7890"
    required
  />
  {#each signUp.fields.phoneNumber.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</Field.Field>

<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { signUp } from "$lib/remotes/auth.remote";
</script>

<Field.Field>
  <Field.Label for="username">Username</Field.Label>
  <Input {...signUp.fields.username.as("text")} id="username" placeholder="jdoe" required />
  {#each signUp.fields.username.issues() as issue, index (index)}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</Field.Field>

<script lang="ts">
  import { resolve } from "$app/paths";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
</script>

<Field.Field>
  <Button type="submit">Login</Button>
  <Field.Description class="text-center">
    Don't have an account? <a href={resolve("/signup")}>Sign up</a>
  </Field.Description>
</Field.Field>

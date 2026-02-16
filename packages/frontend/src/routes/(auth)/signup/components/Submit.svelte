<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import {resolve} from "$app/paths";
</script>

<Field.Field>
  <Button type="submit">Create Account</Button>
  <Field.Description class="text-center">
    Already have an account? <a href={resolve("/signin")}>Sign in</a>
  </Field.Description>
</Field.Field>

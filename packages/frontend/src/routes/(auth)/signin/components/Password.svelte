<script lang="ts">
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { signIn } from "$lib/remotes/auth.remote";
</script>

<Field.Field>
	<Field.Label for="password">Password</Field.Label>
	<Input {...signIn.fields.password.as("password")} id="password" required />
</Field.Field>

<script lang="ts">
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { signUp } from "$lib/remotes/auth.remote";
</script>

<Field.Field>
	<Field.Label for="email">Email</Field.Label>
	<Input {...signUp.fields.email.as("email")} id="email" placeholder="m@example.com" required />
</Field.Field>

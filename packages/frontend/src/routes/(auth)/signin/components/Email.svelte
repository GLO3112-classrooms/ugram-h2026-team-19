<script lang="ts">
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { signIn } from "$lib/remotes/auth.remote";
</script>

<Field.Field>
	<Field.Label for="email">Email</Field.Label>
	<Input {...signIn.fields.email.as("email")} id="email" placeholder="m@example.com" required />
	{#each signIn.fields.email.issues() as issue, index (index)}
		<Field.Error>{issue.message}</Field.Error>
	{/each}
</Field.Field>

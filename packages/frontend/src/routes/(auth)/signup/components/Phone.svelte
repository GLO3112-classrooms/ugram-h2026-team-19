<script lang="ts">
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { signUp } from "$lib/remotes/auth.remote";
</script>

<Field.Field>
	<Field.Label for="phone">Phone</Field.Label>
	<Input {...signUp.fields.phoneNumber.as("tel")} id="phone" placeholder="(123) 456-7890" required />
</Field.Field>

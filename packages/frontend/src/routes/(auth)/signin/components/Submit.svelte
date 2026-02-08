<script lang="ts">
	import { resolve } from "$app/paths";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
</script>

<Field.Field>
	<Button type="submit">Log In</Button>
	<Field.Description class="text-center">
		Not already registered? <a href={resolve("/signup")}>Sign up</a>
	</Field.Description>
</Field.Field>

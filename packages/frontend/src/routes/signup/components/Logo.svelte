<script lang="ts">
	import { resolve } from "$app/paths";
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
</script>

<a href={resolve("/")} class="flex items-center gap-2 self-center font-medium">
	<div
		class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
	>
		<GalleryVerticalEndIcon class="size-4" />
	</div>
	Ugram.
</a>

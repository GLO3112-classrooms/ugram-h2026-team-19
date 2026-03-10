<script lang="ts">
  import { GalleryVerticalEndIcon } from "@lucide/svelte";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
  <div class="flex w-full max-w-sm flex-col gap-6">
    <div class="flex items-center gap-2 self-center font-medium">
      <div
        class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
      >
        <GalleryVerticalEndIcon class="size-4" />
      </div>
      Ugram.
    </div>

    {@render children()}
  </div>
</div>

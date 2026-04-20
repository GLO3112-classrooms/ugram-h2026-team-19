<script lang="ts">
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<div class="flex flex-col justify-between" id="layout">
  {@render children()}
</div>

<style>
  #layout {
    height: calc(100vh - calc(var(--spacing) * 22));
  }
</style>

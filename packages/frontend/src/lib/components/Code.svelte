<script lang="ts">
  let { children } = $props();
</script>

<code class="rounded bg-muted px-1 py-0.5 font-mono text-sm">{@render children?.()}</code>

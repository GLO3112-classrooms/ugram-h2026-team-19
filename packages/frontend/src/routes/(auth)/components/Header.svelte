<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";

  interface Props {
    title: string;
    description: string;
  }

  let { title, description }: Props = $props();
</script>

<Card.Header class="text-center">
  <Card.Title class="text-xl">{title}</Card.Title>
  <Card.Description>{description}</Card.Description>
</Card.Header>

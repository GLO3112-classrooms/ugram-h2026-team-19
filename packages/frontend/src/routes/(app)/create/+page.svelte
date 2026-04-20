<script module lang="ts">
  import * as Card from "$lib/shadcn/card/index.js";
  import * as Field from "$lib/shadcn/field/index.js";

  import { createPost } from "$lib/remotes/post.remote";
  import { createPostSchema } from "$lib/schemas/createPost.schema";
  import Logo from "$lib/components/Logo.svelte";
  import CardHeader from "$lib/components/CardHeader.svelte";
  import Image from "./components/Image.svelte";
  import Description from "./components/Description.svelte";
  import Keywords from "./components/Keywords.svelte";
  import Mention from "./components/Mention.svelte";
  import Submit from "./components/Submit.svelte";
</script>

<div class="flex w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
  <div class="flex w-full max-w-sm flex-col gap-6">
    <Logo />
    <div class="flex flex-col gap-6">
      <Card.Root>
        <CardHeader title="Create a post" description="Fill in the form below to create a post" />
        <Card.Content>
          <form {...createPost.preflight(createPostSchema)} enctype="multipart/form-data">
            <Field.Group>
              <Image />
              <Description />
              <Keywords />
              <Mention />
              <Submit />
            </Field.Group>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>

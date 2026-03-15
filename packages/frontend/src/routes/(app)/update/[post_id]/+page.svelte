<script lang="ts">
  import * as Card from "$lib/shadcn/card/index.js";
  import * as Field from "$lib/shadcn/field/index.js";

  import { updatePost } from "$lib/remotes/post.remote";
  import Logo from "$lib/components/Logo.svelte";
  import CardHeader from "$lib/components/CardHeader.svelte";
  import Description from "./components/Description.svelte";
  import Keywords from "./components/Keywords.svelte";
  import Mention from "./components/Mention.svelte";
  import Submit from "./components/Submit.svelte";
  import Delete from "./components/Delete.svelte";

  import { getPost } from "$lib/remotes/post.remote";

  let { params } = $props();

  const post = $derived(await getPost(params.post_id));
</script>

<div class="flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
  <div class="flex w-full flex-col gap-6">
    <Logo />
    <div class="flex flex-col gap-6">
      <Card.Root>
        <CardHeader
          title="Update a post"
          description="Fill in the form below to update your post"
        />
        <Card.Content>
          <form {...updatePost}>
            <Field.Group>
              <img class="max-h-64 w-full rounded-sm object-cover" src={post.image} alt="" />
              <input {...updatePost.fields.id.as("hidden", post.id)} />
              <Description value={post.description} />
              <Keywords value={post.keywords.join(" ")} />
              <Mention value={post.mentions[0]?.username ?? ""} />
              <Submit />
              <Delete id={post.id} />
            </Field.Group>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>

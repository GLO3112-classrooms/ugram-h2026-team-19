<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Field from "$lib/components/ui/field/index.js";

  import { updatePost } from "$lib/remotes/post.remote";
  import Logo from "../../components/Logo.svelte";
  import Header from "../../components/Header.svelte";
  import Description from "./components/Description.svelte";
  import Keywords from "./components/Keywords.svelte";
  import Mention from "./components/Mention.svelte";
  import Submit from "./components/Submit.svelte";
  import Delete from "./components/Delete.svelte";

  import { getPost } from "$lib/remotes/post.remote";

  let { params } = $props();

  const post = $derived(await getPost(params.post_id));
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
  <div class="flex w-full max-w-sm flex-col gap-6">
    <Logo />
    <div class="flex flex-col gap-6">
      <Card.Root>
        <Header title="Update a post" description="Fill in the form below to update your post" />
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

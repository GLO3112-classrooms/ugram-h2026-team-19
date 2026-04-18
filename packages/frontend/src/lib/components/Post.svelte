<script lang="ts">
  import { HeartIcon, MessageCircleIcon, PencilIcon } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { Button } from "$lib/shadcn/button";
  import { likePost } from "$lib/remotes/post.remote";
  import Avatar from "./Avatar.svelte";
  import type { PostComment, PostData, PostUser } from "backend/schemas";
  import DialogLikers from "$lib/components/dialogs/DialogLikers.svelte";
  import DialogComments from "$lib/components/dialogs/DialogComments.svelte";

  interface Props {
    post: PostData;
    own: boolean;
    currentUser: PostUser;
  }

  let { post, own, currentUser }: Props = $props();
  let likedByMe = $state(post.likedByMe);
  let reactionsCount = $state(post.reactions.length);
  let likers = $state<PostUser[]>([...post.reactions]);
  let comments = $state<PostComment[]>([...post.comments]);
  let isLiking = $state(false);

  async function handleLike() {
    if (isLiking) return;

    isLiking = true;
    const wasLiked = likedByMe;
    const result = await likePost(post.id);

    try {
      if (!result.success) {
        if (result.redirect) await goto(resolve(result.redirect));
        return;
      }

      likedByMe = !likedByMe;
      reactionsCount += wasLiked ? -1 : 1;

      const me = {
        id: currentUser.id,
        username: currentUser.username,
        profilePicture: currentUser.profilePicture
      };

      likers = wasLiked
        ? likers.filter((liker) => liker.id !== me.id)
        : [...likers.filter((liker) => liker.id !== me.id), me];
    } finally {
      isLiking = false;
    }
  }

  function handleCommentCreated(comment: PostComment) {
    comments = [comment, ...comments];
  }
</script>

<div class="my-2.5 space-y-1">
  <div class="flex items-center justify-between">
    <a class="flex h-10 items-center gap-2" href={resolve(`/user/${post.user.id}`)}>
      <Avatar src={post.user.profilePicture} username={post.user.username} />
      <p>@{post.user.username}</p>
    </a>
    <div class="flex items-center gap-2">
      <p class="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
      {#if own}
        <a href={resolve(`/update/${post.id}`)}>
          <Button variant="ghost" size="icon" aria-label="Submit">
            <PencilIcon />
          </Button>
        </a>
      {/if}
    </div>
  </div>
  <!-- `alt` is empty because both non-present or non-empty trigger a warning -->
  <img class="w-full rounded-sm" src={post.image} alt="" />
  <div class="flex justify-between">
    <!-- TODO: replace placeholder data with actual one -->
    <div class="flex items-center gap-1">
      <button type="button" class="cursor-pointer {likedByMe ? '' : 'hover:text-red-500'}" aria-label={likedByMe ? "Dislike" : "Like"} onclick={handleLike} disabled={isLiking}>
        {#if likedByMe}
          <HeartIcon color="red" fill="red" />
        {:else}
          <HeartIcon />
        {/if}
      </button>
      {#if reactionsCount}
        <DialogLikers likers={likers}>{reactionsCount}</DialogLikers>
      {/if}
    </div>
    <DialogComments postId={post.id} {comments} onCommentCreated={handleCommentCreated}>
      {comments.length}
      <MessageCircleIcon />
    </DialogComments>
  </div>
  <p>{post.description}</p>
  <p class="flex flex-wrap space-x-1">
    {#each post.keywords as keyword (keyword)}
      <span class="text-sm text-cyan-600">#{keyword}</span>
    {/each}
  </p>
  {#each post.mentions as mention (mention)}
    <a class="text-cyan-600" href={resolve(`/user/${mention.id}`)}>@{mention.username}</a>
  {/each}
</div>

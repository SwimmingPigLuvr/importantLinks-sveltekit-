<script lang="ts">
  import { page } from "$app/stores";
  import AnimatedRoute from "$lib/components/AnimatedRoute.svelte";
</script>

<nav class="flex justify-center my-6">
  <ul class="steps">
    <a href="/login" class="step step-primary">Sign In</a>
    <a 
      href="/login/username"
      class="step"
      class:step-primary={$page.route.id?.match(/username|photo|theme/g)}>
      Choose Username
    </a>
    <a 
      href="/login/photo"
      class="step"
      class:step-primary={$page.route.id?.match(/photo|theme/g)}>
      Upload Photo
    </a>
    <a 
      href="/login/theme"
      class="step"
      class:step-primary={$page.route.id?.match(/theme/g)}>
      Choose Theme
    </a>
  </ul>
</nav>

<AnimatedRoute>
  <main class="card w-3/4 max-w-[27rem] bg-primary text-accent-content mx-auto">
    <div class="card-body items-center text-center">
      <slot />
    </div>
  </main>
</AnimatedRoute>




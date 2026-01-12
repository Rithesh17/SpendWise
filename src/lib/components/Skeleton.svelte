<script>
  /** 
   * @type {{
   *   width?: string,
   *   height?: string,
   *   variant?: 'text' | 'circular' | 'rectangular',
   *   lines?: number,
   *   gap?: string
   * }} 
   */
  let { 
    width = '100%',
    height = '1rem',
    variant = 'text',
    lines = 1,
    gap = '0.5rem'
  } = $props();
</script>

{#if lines > 1}
  <div class="skeleton-group" style="gap: {gap};">
    {#each Array(lines) as _, i}
      <div 
        class="skeleton skeleton-{variant}"
        style="width: {i === lines - 1 ? '70%' : width}; height: {height};"
      ></div>
    {/each}
  </div>
{:else}
  <div 
    class="skeleton skeleton-{variant}"
    style="width: {width}; height: {height};"
  ></div>
{/if}

<style>
  .skeleton-group {
    display: flex;
    flex-direction: column;
  }

  .skeleton {
    background: linear-gradient(
      90deg,
      var(--em-bg-tertiary) 0%,
      var(--em-bg-hover) 50%,
      var(--em-bg-tertiary) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-text {
    border-radius: var(--em-radius-sm);
  }

  .skeleton-circular {
    border-radius: 50%;
  }

  .skeleton-rectangular {
    border-radius: var(--em-radius-md);
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
</style>

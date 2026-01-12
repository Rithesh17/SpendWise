<script>
  /** 
   * @type {{
   *   padding?: 'none' | 'sm' | 'md' | 'lg',
   *   hoverable?: boolean,
   *   clickable?: boolean,
   *   href?: string,
   *   children?: any
   * }} 
   */
  let { 
    padding = 'md',
    hoverable = false,
    clickable = false,
    href = '',
    children
  } = $props();
</script>

{#if href}
  <a 
    {href}
    class="card padding-{padding}"
    class:hoverable
    class:clickable={true}
  >
    {@render children?.()}
  </a>
{:else}
  <div 
    class="card padding-{padding}"
    class:hoverable
    class:clickable
  >
    {@render children?.()}
  </div>
{/if}

<style>
  .card {
    background-color: var(--em-surface);
    border: 1px solid var(--em-border);
    border-radius: var(--em-radius-lg);
    box-shadow: var(--em-shadow-sm);
    transition: all var(--em-transition-normal);
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .padding-none {
    padding: 0;
  }

  .padding-sm {
    padding: 0.75rem;
  }

  .padding-md {
    padding: 1.25rem;
  }

  .padding-lg {
    padding: 1.75rem;
  }

  .hoverable:hover,
  .clickable:hover {
    background-color: var(--em-surface-hover);
    box-shadow: var(--em-shadow-md);
  }

  .clickable {
    cursor: pointer;
  }
</style>

<script>
  /** 
   * @type {{
   *   variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success',
   *   size?: 'sm' | 'md' | 'lg',
   *   disabled?: boolean,
   *   loading?: boolean,
   *   fullWidth?: boolean,
   *   type?: 'button' | 'submit' | 'reset',
   *   href?: string,
   *   onclick?: (e: Event) => void,
   *   children?: any
   * }} 
   */
  let { 
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    type = 'button',
    href = '',
    onclick,
    children
  } = $props();
</script>

{#if href}
  <a 
    {href}
    class="btn btn-{variant} btn-{size}"
    class:full-width={fullWidth}
    class:disabled={disabled}
  >
    {#if loading}
      <span class="spinner"></span>
    {/if}
    {@render children?.()}
  </a>
{:else}
  <button 
    {type}
    class="btn btn-{variant} btn-{size}"
    class:full-width={fullWidth}
    disabled={disabled || loading}
    {onclick}
  >
    {#if loading}
      <span class="spinner"></span>
    {/if}
    {@render children?.()}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
    border-radius: var(--em-radius-md);
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: all var(--em-transition-fast);
  }

  .btn:disabled,
  .btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Sizes */
  .btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn-md {
    padding: 0.625rem 1.25rem;
    font-size: 1rem;
  }

  .btn-lg {
    padding: 0.875rem 1.75rem;
    font-size: 1.125rem;
  }

  /* Variants */
  .btn-primary {
    background-color: var(--em-primary);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--em-primary-hover);
  }

  .btn-secondary {
    background-color: var(--em-surface);
    border: 1px solid var(--em-border);
    color: var(--em-text-primary);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: var(--em-surface-hover);
  }

  .btn-danger {
    background-color: var(--em-expense);
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background-color: var(--em-expense-light);
  }

  .btn-success {
    background-color: var(--em-income);
    color: white;
  }

  .btn-success:hover:not(:disabled) {
    background-color: var(--em-income-light);
  }

  .btn-ghost {
    background-color: transparent;
    color: var(--em-text-secondary);
  }

  .btn-ghost:hover:not(:disabled) {
    background-color: var(--em-bg-hover);
    color: var(--em-text-primary);
  }

  .full-width {
    width: 100%;
  }

  /* Spinner */
  .spinner {
    width: 1em;
    height: 1em;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>

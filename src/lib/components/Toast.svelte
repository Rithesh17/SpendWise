<script>
  /** 
   * @type {{
   *   message: string,
   *   type?: 'success' | 'error' | 'warning' | 'info',
   *   visible?: boolean,
   *   duration?: number,
   *   onclose?: () => void
   * }} 
   */
  let { 
    message,
    type = 'info',
    visible = false,
    duration = 3000,
    onclose
  } = $props();

  $effect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        if (onclose) onclose();
      }, duration);
      return () => clearTimeout(timer);
    }
  });

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
</script>

{#if visible}
  <div class="toast toast-{type}" role="alert">
    <span class="toast-icon">{icons[type]}</span>
    <span class="toast-message">{message}</span>
    <button class="toast-close" onclick={onclose} aria-label="Close">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: 6rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-radius: var(--em-radius-lg);
    box-shadow: var(--em-shadow-lg);
    z-index: 300;
    animation: slideUp 0.3s ease;
    max-width: calc(100vw - 2rem);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .toast-success {
    background-color: var(--em-income);
    color: white;
  }

  .toast-error {
    background-color: var(--em-expense);
    color: white;
  }

  .toast-warning {
    background-color: var(--em-warning);
    color: var(--em-text-inverse);
  }

  .toast-info {
    background-color: var(--em-primary);
    color: white;
  }

  .toast-icon {
    font-size: 1.125rem;
    font-weight: bold;
  }

  .toast-message {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .toast-close {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: inherit;
    opacity: 0.7;
    cursor: pointer;
    padding: 0.25rem;
    margin-left: 0.5rem;
  }

  .toast-close:hover {
    opacity: 1;
  }

  @media (min-width: 769px) {
    .toast {
      bottom: 2rem;
    }
  }
</style>

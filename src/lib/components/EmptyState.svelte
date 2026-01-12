<script>
  /** 
   * @type {{
   *   title: string,
   *   message?: string,
   *   icon?: string,
   *   actionLabel?: string,
   *   actionHref?: string
   * }} 
   */
  let { 
    title, 
    message = '', 
    icon = '📋',
    actionLabel = '',
    actionHref = ''
  } = $props();
</script>

<div class="empty-state">
  <div class="empty-icon">{icon}</div>
  <h3 class="empty-title">{title}</h3>
  {#if message}
    <p class="empty-message">{message}</p>
  {/if}
  {#if actionLabel && actionHref}
    <a href={actionHref} class="empty-action em-btn em-btn-primary">
      {actionLabel}
    </a>
  {/if}
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
  }
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }
  
  .empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--em-text-primary);
    margin: 0 0 0.5rem;
  }
  
  .empty-message {
    font-size: 0.875rem;
    color: var(--em-text-secondary);
    margin: 0 0 1.5rem;
    max-width: 300px;
  }
  
  .empty-action {
    text-decoration: none;
  }
</style>

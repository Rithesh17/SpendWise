<script>
  /** 
   * @type {{
   *   title: string,
   *   value: string | number,
   *   subtitle?: string,
   *   trend?: 'up' | 'down' | 'neutral',
   *   trendValue?: string,
   *   icon?: string,
   *   color?: 'default' | 'income' | 'expense' | 'warning'
   * }} 
   */
  let { 
    title, 
    value, 
    subtitle = '', 
    trend = 'neutral', 
    trendValue = '',
    icon = '',
    color = 'default'
  } = $props();
</script>

<div class="stat-card em-card" class:income={color === 'income'} class:expense={color === 'expense'} class:warning={color === 'warning'}>
  <div class="stat-header">
    <span class="stat-title">{title}</span>
    {#if icon}
      <span class="stat-icon">{icon}</span>
    {/if}
  </div>
  
  <div class="stat-value" class:amount-positive={color === 'income'} class:amount-negative={color === 'expense'}>
    {value}
  </div>
  
  {#if subtitle || trendValue}
    <div class="stat-footer">
      {#if trendValue}
        <span class="trend" class:trend-up={trend === 'up'} class:trend-down={trend === 'down'}>
          {#if trend === 'up'}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          {:else if trend === 'down'}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
              <polyline points="17 18 23 18 23 12"></polyline>
            </svg>
          {/if}
          {trendValue}
        </span>
      {/if}
      {#if subtitle}
        <span class="stat-subtitle">{subtitle}</span>
      {/if}
    </div>
  {/if}
</div>

<style>
  .stat-card {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .stat-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--em-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--em-text-primary);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  
  .stat-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }
  
  .trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--em-text-muted);
  }
  
  .trend-up {
    color: var(--em-income);
  }
  
  .trend-down {
    color: var(--em-expense);
  }
  
  .stat-subtitle {
    font-size: 0.75rem;
    color: var(--em-text-muted);
  }
  
  /* Color variants */
  .stat-card.income {
    border-left: 3px solid var(--em-income);
  }
  
  .stat-card.expense {
    border-left: 3px solid var(--em-expense);
  }
  
  .stat-card.warning {
    border-left: 3px solid var(--em-warning);
  }
  
  @media (max-width: 768px) {
    .stat-value {
      font-size: 1.5rem;
    }
  }
</style>

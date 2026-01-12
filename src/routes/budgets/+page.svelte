<script>
	import { PageHeader, StatCard, EmptyState } from '$lib/components';

	// Demo data - will be replaced with store data later
	const budgets = [
		{ id: 1, name: 'Monthly Overall', category: null, amount: 2000, spent: 1247.35, period: 'monthly', icon: '💰' },
		{ id: 2, name: 'Food & Dining', category: 'food', amount: 500, spent: 450.25, period: 'monthly', icon: '🍔' },
		{ id: 3, name: 'Transport', category: 'transport', amount: 300, spent: 285.50, period: 'monthly', icon: '🚗' },
		{ id: 4, name: 'Entertainment', category: 'entertainment', amount: 200, spent: 198.00, period: 'monthly', icon: '🎬' },
		{ id: 5, name: 'Shopping', category: 'shopping', amount: 250, spent: 133.60, period: 'monthly', icon: '🛍️' },
	];

	const overallBudget = budgets.find(b => b.category === null);
	const categoryBudgets = budgets.filter(b => b.category !== null);

	function getPercentage(spent, budget) {
		return Math.min((spent / budget) * 100, 100);
	}

	function getStatus(spent, budget) {
		const percentage = spent / budget;
		if (percentage >= 1) return 'danger';
		if (percentage >= 0.8) return 'warning';
		return 'safe';
	}

	function getRemaining(spent, budget) {
		return Math.max(budget - spent, 0);
	}
</script>

<svelte:head>
	<title>Budgets | Expense Manager</title>
	<meta name="description" content="Set and track your spending budgets." />
</svelte:head>

<div class="budgets-page">
	<div class="container mx-auto px-4">
		<PageHeader 
			title="Budgets" 
			subtitle="Set limits and track your spending"
		/>

		<!-- Overall Budget Card -->
		{#if overallBudget}
			<section class="overall-budget em-card">
				<div class="overall-header">
					<div class="overall-info">
						<span class="overall-icon">{overallBudget.icon}</span>
						<div>
							<h2 class="overall-title">{overallBudget.name}</h2>
							<p class="overall-period">This Month</p>
						</div>
					</div>
					<button class="em-btn em-btn-ghost">Edit</button>
				</div>

				<div class="overall-stats">
					<div class="stat-box">
						<span class="stat-label">Budget</span>
						<span class="stat-amount">${overallBudget.amount.toFixed(2)}</span>
					</div>
					<div class="stat-box">
						<span class="stat-label">Spent</span>
						<span class="stat-amount amount-negative">${overallBudget.spent.toFixed(2)}</span>
					</div>
					<div class="stat-box">
						<span class="stat-label">Remaining</span>
						<span class="stat-amount amount-positive">${getRemaining(overallBudget.spent, overallBudget.amount).toFixed(2)}</span>
					</div>
				</div>

				<div class="overall-progress">
					<div class="progress-bar-large">
						<div 
							class="progress-fill {getStatus(overallBudget.spent, overallBudget.amount)}"
							style="width: {getPercentage(overallBudget.spent, overallBudget.amount)}%;"
						></div>
					</div>
					<div class="progress-labels">
						<span class="{getStatus(overallBudget.spent, overallBudget.amount)}">{Math.round(getPercentage(overallBudget.spent, overallBudget.amount))}% used</span>
						<span>{Math.round(100 - getPercentage(overallBudget.spent, overallBudget.amount))}% left</span>
					</div>
				</div>
			</section>
		{/if}

		<!-- Category Budgets -->
		<section class="category-budgets">
			<div class="section-header">
				<h2 class="section-title">Category Budgets</h2>
				<button class="em-btn em-btn-primary">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="12" y1="5" x2="12" y2="19"></line>
						<line x1="5" y1="12" x2="19" y2="12"></line>
					</svg>
					Add Budget
				</button>
			</div>

			<div class="budgets-grid">
				{#each categoryBudgets as budget}
					<div class="budget-card em-card">
						<div class="budget-header">
							<span class="budget-icon">{budget.icon}</span>
							<div class="budget-info">
								<h3 class="budget-name">{budget.name}</h3>
								<span class="budget-period">{budget.period}</span>
							</div>
							<div class="budget-status {getStatus(budget.spent, budget.amount)}">
								{#if getStatus(budget.spent, budget.amount) === 'danger'}
									Over budget!
								{:else if getStatus(budget.spent, budget.amount) === 'warning'}
									Almost there
								{:else}
									On track
								{/if}
							</div>
						</div>

						<div class="budget-amounts">
							<div class="amount-spent">
								<span class="amount-label">Spent</span>
								<span class="amount-value">${budget.spent.toFixed(2)}</span>
							</div>
							<div class="amount-divider">/</div>
							<div class="amount-total">
								<span class="amount-label">Budget</span>
								<span class="amount-value">${budget.amount.toFixed(2)}</span>
							</div>
						</div>

						<div class="budget-progress">
							<div class="progress-bar">
								<div 
									class="progress-fill {getStatus(budget.spent, budget.amount)}"
									style="width: {getPercentage(budget.spent, budget.amount)}%;"
								></div>
							</div>
							<span class="remaining-text">
								${getRemaining(budget.spent, budget.amount).toFixed(2)} remaining
							</span>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	.budgets-page {
		padding-bottom: 2rem;
	}

	/* Overall Budget */
	.overall-budget {
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.overall-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.overall-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.overall-icon {
		font-size: 2.5rem;
	}

	.overall-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}

	.overall-period {
		font-size: 0.875rem;
		color: var(--em-text-muted);
		margin: 0;
	}

	.overall-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		padding: 1.5rem 0;
		border-top: 1px solid var(--em-border);
		border-bottom: 1px solid var(--em-border);
		margin-bottom: 1.5rem;
	}

	.stat-box {
		text-align: center;
	}

	.stat-label {
		display: block;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--em-text-muted);
		margin-bottom: 0.5rem;
	}

	.stat-amount {
		font-size: 1.5rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.overall-progress {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.progress-bar-large {
		width: 100%;
		height: 12px;
		background-color: var(--em-bg-tertiary);
		border-radius: var(--em-radius-full);
		overflow: hidden;
	}

	.progress-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
		color: var(--em-text-muted);
	}

	/* Category Budgets */
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}

	.budgets-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.budget-card {
		padding: 1.25rem;
	}

	.budget-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.budget-icon {
		font-size: 1.5rem;
	}

	.budget-info {
		flex: 1;
	}

	.budget-name {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
	}

	.budget-period {
		font-size: 0.75rem;
		color: var(--em-text-muted);
		text-transform: capitalize;
	}

	.budget-status {
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.25rem 0.75rem;
		border-radius: var(--em-radius-full);
	}

	.budget-status.safe {
		background-color: var(--em-income-bg);
		color: var(--em-income);
	}

	.budget-status.warning {
		background-color: var(--em-warning-bg);
		color: var(--em-warning);
	}

	.budget-status.danger {
		background-color: var(--em-expense-bg);
		color: var(--em-expense);
	}

	.budget-amounts {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.amount-spent, .amount-total {
		flex: 1;
	}

	.amount-label {
		display: block;
		font-size: 0.75rem;
		color: var(--em-text-muted);
		margin-bottom: 0.25rem;
	}

	.amount-value {
		font-size: 1.25rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.amount-divider {
		font-size: 1.5rem;
		color: var(--em-text-muted);
	}

	.budget-progress {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background-color: var(--em-bg-tertiary);
		border-radius: var(--em-radius-full);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: var(--em-radius-full);
		transition: width 0.5s ease-out;
	}

	.progress-fill.safe {
		background-color: var(--em-income);
	}

	.progress-fill.warning {
		background-color: var(--em-warning);
	}

	.progress-fill.danger {
		background-color: var(--em-expense);
	}

	.remaining-text {
		font-size: 0.875rem;
		color: var(--em-text-secondary);
	}

	.safe { color: var(--em-income); }
	.warning { color: var(--em-warning); }
	.danger { color: var(--em-expense); }

	@media (max-width: 600px) {
		.overall-stats {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.stat-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			text-align: left;
		}

		.stat-label {
			margin-bottom: 0;
		}
	}
</style>

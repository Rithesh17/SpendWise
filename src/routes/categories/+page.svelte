<script>
	import { PageHeader, EmptyState } from '$lib/components';

	// Demo data - will be replaced with store data later
	const categories = [
		{ id: 'food', name: 'Food & Dining', icon: '🍔', color: '#F97316', expenseCount: 24, totalSpent: 450.25, budget: 500 },
		{ id: 'transport', name: 'Transport', icon: '🚗', color: '#3B82F6', expenseCount: 18, totalSpent: 285.50, budget: 300 },
		{ id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8B5CF6', expenseCount: 12, totalSpent: 198.00, budget: 200 },
		{ id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#EC4899', expenseCount: 8, totalSpent: 133.60, budget: 250 },
		{ id: 'utilities', name: 'Utilities', icon: '💡', color: '#14B8A6', expenseCount: 5, totalSpent: 180.00, budget: 200 },
		{ id: 'health', name: 'Health', icon: '💊', color: '#10B981', expenseCount: 3, totalSpent: 89.99, budget: 150 },
		{ id: 'education', name: 'Education', icon: '📚', color: '#F59E0B', expenseCount: 2, totalSpent: 49.99, budget: 100 },
		{ id: 'travel', name: 'Travel', icon: '✈️', color: '#06B6D4', expenseCount: 0, totalSpent: 0, budget: 500 },
	];

	let showAddModal = $state(false);

	function getBudgetPercentage(spent, budget) {
		return Math.min((spent / budget) * 100, 100);
	}

	function getBudgetStatus(spent, budget) {
		const percentage = spent / budget;
		if (percentage >= 1) return 'danger';
		if (percentage >= 0.8) return 'warning';
		return 'safe';
	}
</script>

<svelte:head>
	<title>Categories | Expense Manager</title>
	<meta name="description" content="Manage your expense categories." />
</svelte:head>

<div class="categories-page">
	<div class="container mx-auto px-4">
		<PageHeader 
			title="Categories" 
			subtitle="Organize your expenses by category"
		/>

		<!-- Actions Bar -->
		<div class="actions-bar">
			<button class="em-btn em-btn-primary" onclick={() => showAddModal = true}>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
				Add Category
			</button>
		</div>

		<!-- Categories Grid -->
		<div class="categories-grid">
			{#each categories as category}
				<div class="category-card em-card">
					<div class="card-header">
						<div class="category-icon" style="background-color: {category.color}20;">
							<span>{category.icon}</span>
						</div>
						<div class="card-actions">
							<button class="action-btn" aria-label="Edit category">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
									<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
								</svg>
							</button>
						</div>
					</div>

					<div class="card-body">
						<h3 class="category-name">{category.name}</h3>
						<p class="expense-count">{category.expenseCount} expenses</p>
					</div>

					<div class="card-stats">
						<div class="stat-row">
							<span class="stat-label">Spent</span>
							<span class="stat-value">${category.totalSpent.toFixed(2)}</span>
						</div>
						<div class="stat-row">
							<span class="stat-label">Budget</span>
							<span class="stat-value">${category.budget.toFixed(2)}</span>
						</div>
					</div>

					<div class="budget-progress">
						<div class="progress-bar">
							<div 
								class="progress-fill {getBudgetStatus(category.totalSpent, category.budget)}"
								style="width: {getBudgetPercentage(category.totalSpent, category.budget)}%;"
							></div>
						</div>
						<span class="progress-text {getBudgetStatus(category.totalSpent, category.budget)}">
							{Math.round(getBudgetPercentage(category.totalSpent, category.budget))}% used
						</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Add Category Placeholder (Will be modal later) -->
		{#if showAddModal}
			<div class="modal-overlay" onclick={() => showAddModal = false}>
				<div class="modal-content em-card" onclick={(e) => e.stopPropagation()}>
					<h2 class="modal-title">Add Category</h2>
					<p class="modal-message">Category creation will be available in Phase 4.</p>
					<button class="em-btn em-btn-primary" onclick={() => showAddModal = false}>
						Close
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.categories-page {
		padding-bottom: 2rem;
	}

	.actions-bar {
		margin-bottom: 1.5rem;
	}

	.categories-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.category-card {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.category-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--em-radius-md);
		font-size: 1.5rem;
	}

	.card-actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background-color: var(--em-bg-tertiary);
		border: none;
		border-radius: var(--em-radius-sm);
		color: var(--em-text-muted);
		cursor: pointer;
		transition: all var(--em-transition-fast);
	}

	.action-btn:hover {
		background-color: var(--em-bg-hover);
		color: var(--em-text-primary);
	}

	.card-body {
		flex: 1;
	}

	.category-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--em-text-primary);
		margin: 0 0 0.25rem;
	}

	.expense-count {
		font-size: 0.875rem;
		color: var(--em-text-muted);
		margin: 0;
	}

	.card-stats {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem 0;
		border-top: 1px solid var(--em-border);
		border-bottom: 1px solid var(--em-border);
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--em-text-muted);
	}

	.stat-value {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--em-text-primary);
		font-variant-numeric: tabular-nums;
	}

	.budget-progress {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.progress-bar {
		width: 100%;
		height: 6px;
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

	.progress-text {
		font-size: 0.75rem;
		font-weight: 500;
	}

	.progress-text.safe {
		color: var(--em-income);
	}

	.progress-text.warning {
		color: var(--em-warning);
	}

	.progress-text.danger {
		color: var(--em-expense);
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
		padding: 1rem;
	}

	.modal-content {
		max-width: 400px;
		width: 100%;
		padding: 2rem;
		text-align: center;
	}

	.modal-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
	}

	.modal-message {
		color: var(--em-text-secondary);
		margin: 0 0 1.5rem;
	}
</style>

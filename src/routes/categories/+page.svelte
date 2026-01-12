<script lang="ts">
	import { PageHeader, EmptyState, Modal } from '$lib/components';
	import { categories, expenses, monthExpenses } from '$lib/stores';
	import { preferences } from '$lib/stores/preferences';
	import { formatCurrency, calculateTotal } from '$lib/utils';

	let showAddModal = $state(false);
	let showEditModal = $state(false);
	let editingCategory = $state<string | null>(null);

	// Calculate stats for each category
	function getCategoryStats(categoryId: string) {
		const categoryExpenses = $monthExpenses.filter(e => e.categoryId === categoryId);
		return {
			expenseCount: categoryExpenses.length,
			totalSpent: calculateTotal(categoryExpenses)
		};
	}

	function getBudgetPercentage(spent: number, budget: number | undefined) {
		if (!budget || budget === 0) return 0;
		return Math.min((spent / budget) * 100, 100);
	}

	function getBudgetStatus(spent: number, budget: number | undefined) {
		if (!budget) return 'none';
		const percentage = spent / budget;
		if (percentage >= 1) return 'danger';
		if (percentage >= 0.8) return 'warning';
		return 'safe';
	}

	function handleEdit(categoryId: string) {
		editingCategory = categoryId;
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
		editingCategory = null;
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
		{#if $categories.length === 0}
			<EmptyState
				title="No categories"
				message="Create your first category to organize expenses"
				icon="🏷️"
				actionLabel="Add Category"
				actionHref="#"
			/>
		{:else}
			<div class="categories-grid">
				{#each $categories as category}
					{@const stats = getCategoryStats(category.id)}
					{@const budgetStatus = getBudgetStatus(stats.totalSpent, category.budget)}
					<div class="category-card em-card">
						<div class="card-header">
							<div class="category-icon" style="background-color: {category.color}20;">
								<span>{category.icon}</span>
							</div>
							<div class="card-actions">
								<button class="action-btn" aria-label="Edit category" onclick={() => handleEdit(category.id)}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
										<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
									</svg>
								</button>
							</div>
						</div>

						<div class="card-body">
							<h3 class="category-name">{category.name}</h3>
							<p class="expense-count">{stats.expenseCount} expense{stats.expenseCount !== 1 ? 's' : ''} this month</p>
						</div>

						<div class="card-stats">
							<div class="stat-row">
								<span class="stat-label">Spent</span>
								<span class="stat-value">{formatCurrency(stats.totalSpent, $preferences.currency)}</span>
							</div>
							{#if category.budget}
								<div class="stat-row">
									<span class="stat-label">Budget</span>
									<span class="stat-value">{formatCurrency(category.budget, $preferences.currency)}</span>
								</div>
							{/if}
						</div>

						{#if category.budget}
							<div class="budget-progress">
								<div class="progress-bar">
									<div 
										class="progress-fill {budgetStatus}"
										style="width: {getBudgetPercentage(stats.totalSpent, category.budget)}%;"
									></div>
								</div>
								<span class="progress-text {budgetStatus}">
									{Math.round(getBudgetPercentage(stats.totalSpent, category.budget))}% used
								</span>
							</div>
						{:else}
							<div class="no-budget">
								<span class="no-budget-text">No budget set</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Add Category Modal -->
		<Modal 
			open={showAddModal} 
			title="Add Category" 
			onclose={() => showAddModal = false}
		>
			<div class="modal-message">
				<p>Category creation will be available in Phase 4.</p>
				<p class="hint">For now, you can use the 12 default categories provided.</p>
			</div>
			{#snippet footer()}
				<button class="em-btn em-btn-primary" onclick={() => showAddModal = false}>
					Got it
				</button>
			{/snippet}
		</Modal>

		<!-- Edit Category Modal -->
		<Modal 
			open={showEditModal} 
			title="Edit Category" 
			onclose={closeEditModal}
		>
			<div class="modal-message">
				<p>Category editing will be available in Phase 4.</p>
				<p class="hint">This will allow you to customize category names, icons, colors, and budgets.</p>
			</div>
			{#snippet footer()}
				<button class="em-btn em-btn-primary" onclick={closeEditModal}>
					Got it
				</button>
			{/snippet}
		</Modal>
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

	.no-budget {
		padding-top: 0.5rem;
	}

	.no-budget-text {
		font-size: 0.75rem;
		color: var(--em-text-muted);
		font-style: italic;
	}

	/* Modal content */
	.modal-message {
		text-align: center;
		padding: 1rem 0;
	}

	.modal-message p {
		margin: 0 0 0.5rem;
		color: var(--em-text-primary);
	}

	.modal-message .hint {
		font-size: 0.875rem;
		color: var(--em-text-muted);
	}
</style>

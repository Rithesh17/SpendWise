<script lang="ts">
	import { PageHeader, EmptyState } from '$lib/components';
	import { 
		filteredExpenses, 
		expenseFilters, 
		expenseSort,
		expenseActions,
		categories 
	} from '$lib/stores';
	import { preferences } from '$lib/stores/preferences';
	import { formatCurrency, formatDate } from '$lib/utils';

	let searchQuery = $state('');
	let selectedCategory = $state('all');
	let sortBy = $state('date-desc');

	// Sync local state with store
	$effect(() => {
		expenseActions.setFilters({ 
			search: searchQuery, 
			categoryId: selectedCategory 
		});
	});

	$effect(() => {
		const [field, direction] = sortBy.split('-') as ['date' | 'amount' | 'description', 'asc' | 'desc'];
		expenseActions.setSort(field, direction);
	});

	function getCategoryInfo(categoryId: string) {
		const cat = $categories.find(c => c.id === categoryId);
		return cat || { name: 'Unknown', icon: '📋', color: '#64748B' };
	}

	function handleDelete(id: string) {
		if (confirm('Are you sure you want to delete this expense?')) {
			expenseActions.delete(id);
		}
	}
</script>

<svelte:head>
	<title>Expenses | Expense Manager</title>
	<meta name="description" content="View and manage all your expenses." />
</svelte:head>

<div class="expenses-page">
	<div class="container mx-auto px-4">
		<PageHeader 
			title="Expenses" 
			subtitle="View and manage all your expenses"
		/>

		<!-- Filters & Search -->
		<div class="filters-bar em-card">
			<div class="search-box">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
				<input 
					type="text" 
					placeholder="Search expenses..." 
					class="search-input"
					bind:value={searchQuery}
				/>
			</div>
			
			<div class="filter-controls">
				<select class="filter-select em-input" bind:value={selectedCategory}>
					<option value="all">All Categories</option>
					{#each $categories as cat}
						<option value={cat.id}>{cat.icon} {cat.name}</option>
					{/each}
				</select>
				
				<select class="filter-select em-input" bind:value={sortBy}>
					<option value="date-desc">Newest First</option>
					<option value="date-asc">Oldest First</option>
					<option value="amount-desc">Highest Amount</option>
					<option value="amount-asc">Lowest Amount</option>
				</select>
			</div>
		</div>

		<!-- Expense List -->
		<div class="expense-list em-card">
			{#if $filteredExpenses.length === 0}
				<EmptyState 
					title="No expenses found"
					message="Try adjusting your filters or add a new expense"
					icon="🔍"
					actionLabel="Add Expense"
					actionHref="/add"
				/>
			{:else}
				<div class="list-header">
					<span class="header-item description">Description</span>
					<span class="header-item category">Category</span>
					<span class="header-item date">Date</span>
					<span class="header-item amount">Amount</span>
					<span class="header-item actions">Actions</span>
				</div>
				
				{#each $filteredExpenses as expense}
					{@const category = getCategoryInfo(expense.categoryId)}
					<div class="list-row">
						<div class="cell description">
							<span class="expense-icon">{category.icon}</span>
							<span class="expense-name">{expense.description}</span>
						</div>
						<div class="cell category">
							<span class="category-badge" style="background-color: {category.color}20; color: {category.color};">
								{category.name}
							</span>
						</div>
						<div class="cell date">{formatDate(expense.date, $preferences.dateFormat)}</div>
						<div class="cell amount amount-negative">-{formatCurrency(expense.amount, $preferences.currency)}</div>
						<div class="cell actions">
							<a href="/expenses/{expense.id}" class="action-btn" aria-label="View expense">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
									<circle cx="12" cy="12" r="3"></circle>
								</svg>
							</a>
							<button class="action-btn delete" aria-label="Delete expense" onclick={() => handleDelete(expense.id)}>
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<polyline points="3 6 5 6 21 6"></polyline>
									<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
								</svg>
							</button>
						</div>
					</div>
				{/each}
				
				<div class="list-footer">
					<span class="count">{$filteredExpenses.length} expense{$filteredExpenses.length !== 1 ? 's' : ''}</span>
				</div>
			{/if}
		</div>

		<!-- Add Button -->
		<a href="/add" class="add-expense-btn em-btn em-btn-primary">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="12" y1="5" x2="12" y2="19"></line>
				<line x1="5" y1="12" x2="19" y2="12"></line>
			</svg>
			Add Expense
		</a>
	</div>
</div>

<style>
	.expenses-page {
		padding-bottom: 2rem;
	}

	.filters-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.search-box {
		flex: 1;
		min-width: 200px;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background-color: var(--em-bg-tertiary);
		border: 1px solid var(--em-border);
		border-radius: var(--em-radius-md);
		padding: 0 1rem;
	}

	.search-box svg {
		color: var(--em-text-muted);
	}

	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		padding: 0.75rem 0;
		color: var(--em-text-primary);
		font-size: 1rem;
	}

	.search-input:focus {
		outline: none;
	}

	.filter-controls {
		display: flex;
		gap: 0.75rem;
	}

	.filter-select {
		min-width: 150px;
		padding: 0.625rem 1rem;
	}

	/* List Styles */
	.expense-list {
		overflow: hidden;
	}

	.list-header {
		display: none;
		padding: 1rem 1.25rem;
		background-color: var(--em-bg-tertiary);
		border-bottom: 1px solid var(--em-border);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--em-text-muted);
	}

	@media (min-width: 768px) {
		.list-header {
			display: grid;
			grid-template-columns: 2fr 1fr 1fr 1fr 100px;
			gap: 1rem;
		}
	}

	.list-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--em-border);
		transition: background-color var(--em-transition-fast);
	}

	.list-row:hover {
		background-color: var(--em-bg-hover);
	}

	.list-row:last-child {
		border-bottom: none;
	}

	@media (min-width: 768px) {
		.list-row {
			display: grid;
			grid-template-columns: 2fr 1fr 1fr 1fr 100px;
			gap: 1rem;
			align-items: center;
		}
	}

	.cell {
		display: flex;
		align-items: center;
	}

	.cell.description {
		flex: 1;
		gap: 0.75rem;
		min-width: 200px;
	}

	.expense-icon {
		font-size: 1.25rem;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--em-bg-tertiary);
		border-radius: var(--em-radius-md);
	}

	.expense-name {
		font-weight: 500;
		color: var(--em-text-primary);
	}

	.cell.category {
		width: 100%;
	}

	@media (min-width: 768px) {
		.cell.category {
			width: auto;
		}
	}

	.category-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: var(--em-radius-full);
		font-size: 0.75rem;
		font-weight: 500;
	}

	.cell.date {
		font-size: 0.875rem;
		color: var(--em-text-secondary);
	}

	.cell.amount {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.cell.actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background-color: var(--em-bg-tertiary);
		border: none;
		border-radius: var(--em-radius-md);
		color: var(--em-text-secondary);
		cursor: pointer;
		transition: all var(--em-transition-fast);
		text-decoration: none;
	}

	.action-btn:hover {
		background-color: var(--em-bg-hover);
		color: var(--em-text-primary);
	}

	.action-btn.delete:hover {
		background-color: var(--em-expense-bg);
		color: var(--em-expense);
	}

	.list-footer {
		padding: 1rem 1.25rem;
		border-top: 1px solid var(--em-border);
		text-align: center;
	}

	.count {
		font-size: 0.875rem;
		color: var(--em-text-muted);
	}

	.add-expense-btn {
		display: none;
		margin-top: 1.5rem;
		text-decoration: none;
	}

	@media (min-width: 769px) {
		.add-expense-btn {
			display: inline-flex;
		}
	}

	@media (max-width: 767px) {
		.filters-bar {
			flex-direction: column;
		}
		
		.filter-controls {
			width: 100%;
		}
		
		.filter-select {
			flex: 1;
		}
	}
</style>

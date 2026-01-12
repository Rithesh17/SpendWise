<script lang="ts">
	import { PageHeader, EmptyState } from '$lib/components';
	import { 
		expenses,
		expenseActions,
		categories 
	} from '$lib/stores';
	import { preferences } from '$lib/stores/preferences';
	import { formatCurrency, formatDate, searchExpenses, sortExpenses, filterByDateRange } from '$lib/utils';

	// Filter state
	let searchQuery = $state('');
	let selectedCategories = $state<string[]>([]);
	let sortBy = $state('date-desc');
	let showFilters = $state(false);
	
	// Compute filtered expenses
	let filteredExpenses = $derived(() => {
		let result = [...$expenses];
		
		// Apply search
		if (searchQuery.trim()) {
			result = searchExpenses(result, searchQuery);
		}
		
		// Apply category filter (multi-select)
		if (selectedCategories.length > 0) {
			result = result.filter(exp => selectedCategories.includes(exp.categoryId));
		}
		
		// Apply sort
		const [field, direction] = sortBy.split('-') as ['date' | 'amount' | 'description', 'asc' | 'desc'];
		result = sortExpenses(result, field, direction);
		
		return result;
	});

	// Check if any filters are active
	let hasActiveFilters = $derived(
		searchQuery.trim() !== '' || selectedCategories.length > 0 || sortBy !== 'date-desc'
	);

	function getCategoryInfo(categoryId: string) {
		const cat = $categories.find(c => c.id === categoryId);
		return cat || { name: 'Unknown', icon: '📋', color: '#64748B' };
	}

	function handleDelete(id: string) {
		if (confirm('Are you sure you want to delete this expense?')) {
			expenseActions.delete(id);
		}
	}

	function toggleCategory(catId: string) {
		if (selectedCategories.includes(catId)) {
			selectedCategories = selectedCategories.filter(id => id !== catId);
		} else {
			selectedCategories = [...selectedCategories, catId];
		}
	}

	function clearFilters() {
		searchQuery = '';
		selectedCategories = [];
		sortBy = 'date-desc';
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

		<!-- Search and Filter Bar -->
		<div class="toolbar">
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
				{#if searchQuery}
					<button class="clear-search" onclick={() => searchQuery = ''} aria-label="Clear search">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				{/if}
			</div>
			
			<button 
				class="filter-toggle" 
				class:active={showFilters || hasActiveFilters}
				onclick={() => showFilters = !showFilters}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
				</svg>
				Filters
				{#if hasActiveFilters}
					<span class="filter-badge"></span>
				{/if}
			</button>

			<a href="/add" class="add-btn em-btn em-btn-primary">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
				<span class="add-btn-text">Add</span>
			</a>
		</div>

		<!-- Filter Panel -->
		{#if showFilters}
			<div class="filter-panel em-card">
				<div class="filter-header">
					<h3 class="filter-title">Filters & Sort</h3>
					{#if hasActiveFilters}
						<button class="clear-filters-btn" onclick={clearFilters}>
							Clear All
						</button>
					{/if}
				</div>

				<div class="filter-content">
					<!-- Sort -->
					<div class="filter-group">
						<label class="filter-label">Sort By</label>
						<select class="em-input filter-select" bind:value={sortBy}>
							<option value="date-desc">Newest First</option>
							<option value="date-asc">Oldest First</option>
							<option value="amount-desc">Highest Amount</option>
							<option value="amount-asc">Lowest Amount</option>
						</select>
					</div>

					<!-- Categories (Multi-select) -->
					<div class="filter-group">
						<label class="filter-label">Categories</label>
						<div class="category-chips">
							{#each $categories as cat}
								<button 
									class="category-chip"
									class:selected={selectedCategories.includes(cat.id)}
									onclick={() => toggleCategory(cat.id)}
									style="--chip-color: {cat.color}"
								>
									<span class="chip-icon">{cat.icon}</span>
									<span class="chip-name">{cat.name}</span>
									{#if selectedCategories.includes(cat.id)}
										<svg class="chip-check" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
											<polyline points="20 6 9 17 4 12"></polyline>
										</svg>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Expense List -->
		<div class="expense-list em-card">
			{#if filteredExpenses().length === 0}
				<EmptyState 
					title="No expenses found"
					message={hasActiveFilters ? "Try adjusting your filters" : "Add your first expense to get started"}
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
				
				{#each filteredExpenses() as expense}
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
					<span class="count">{filteredExpenses().length} expense{filteredExpenses().length !== 1 ? 's' : ''}</span>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.expenses-page {
		padding-bottom: 2rem;
	}

	/* Toolbar */
	.toolbar {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1rem;
		align-items: center;
	}

	.search-box {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background-color: var(--em-surface);
		border: 1px solid var(--em-border);
		border-radius: var(--em-radius-md);
		padding: 0 1rem;
	}

	.search-box svg {
		color: var(--em-text-muted);
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		padding: 0.75rem 0;
		color: var(--em-text-primary);
		font-size: 1rem;
		min-width: 0;
	}

	.search-input:focus {
		outline: none;
	}

	.clear-search {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		color: var(--em-text-muted);
		cursor: pointer;
		padding: 0.25rem;
	}

	.clear-search:hover {
		color: var(--em-text-primary);
	}

	.filter-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background-color: var(--em-surface);
		border: 1px solid var(--em-border);
		border-radius: var(--em-radius-md);
		color: var(--em-text-secondary);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--em-transition-fast);
		position: relative;
	}

	.filter-toggle:hover,
	.filter-toggle.active {
		background-color: var(--em-surface-hover);
		color: var(--em-text-primary);
		border-color: var(--em-primary);
	}

	.filter-badge {
		position: absolute;
		top: -4px;
		right: -4px;
		width: 10px;
		height: 10px;
		background-color: var(--em-primary);
		border-radius: 50%;
	}

	.add-btn {
		text-decoration: none;
		white-space: nowrap;
	}

	.add-btn-text {
		display: none;
	}

	@media (min-width: 640px) {
		.add-btn-text {
			display: inline;
		}
	}

	/* Filter Panel */
	.filter-panel {
		margin-bottom: 1rem;
		padding: 1rem;
	}

	.filter-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.filter-title {
		font-size: 0.875rem;
		font-weight: 600;
		margin: 0;
		color: var(--em-text-primary);
	}

	.clear-filters-btn {
		background: transparent;
		border: none;
		color: var(--em-primary);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
	}

	.clear-filters-btn:hover {
		text-decoration: underline;
	}

	.filter-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.filter-label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--em-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.filter-select {
		max-width: 200px;
	}

	/* Category Chips */
	.category-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.category-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		background-color: var(--em-bg-tertiary);
		border: 1px solid var(--em-border);
		border-radius: var(--em-radius-full);
		font-size: 0.8125rem;
		cursor: pointer;
		transition: all var(--em-transition-fast);
	}

	.category-chip:hover {
		background-color: var(--em-bg-hover);
	}

	.category-chip.selected {
		background-color: var(--chip-color, var(--em-primary));
		border-color: var(--chip-color, var(--em-primary));
		color: white;
	}

	.chip-icon {
		font-size: 0.875rem;
	}

	.chip-name {
		font-weight: 500;
	}

	.chip-check {
		margin-left: 0.125rem;
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
			grid-template-columns: 2fr 1fr 1fr 1fr 80px;
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
			grid-template-columns: 2fr 1fr 1fr 1fr 80px;
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

	@media (max-width: 639px) {
		.toolbar {
			flex-wrap: wrap;
		}

		.search-box {
			width: 100%;
			order: 1;
		}

		.filter-toggle {
			order: 2;
			flex: 1;
		}

		.add-btn {
			order: 3;
		}
	}
</style>

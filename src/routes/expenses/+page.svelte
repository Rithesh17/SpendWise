<script>
	import { PageHeader, EmptyState } from '$lib/components';

	// Demo data - will be replaced with store data later
	const expenses = [
		{ id: 1, description: 'Coffee & Snacks', amount: 12.50, category: 'Food', icon: '🍔', date: '2026-01-12', paymentMethod: 'Card' },
		{ id: 2, description: 'Uber Ride', amount: 18.75, category: 'Transport', icon: '🚗', date: '2026-01-12', paymentMethod: 'Digital' },
		{ id: 3, description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', icon: '🎬', date: '2026-01-11', paymentMethod: 'Card' },
		{ id: 4, description: 'Grocery Shopping', amount: 67.30, category: 'Food', icon: '🍔', date: '2026-01-11', paymentMethod: 'Card' },
		{ id: 5, description: 'Electric Bill', amount: 124.00, category: 'Utilities', icon: '💡', date: '2026-01-10', paymentMethod: 'Bank' },
		{ id: 6, description: 'Gym Membership', amount: 49.99, category: 'Health', icon: '💪', date: '2026-01-10', paymentMethod: 'Card' },
		{ id: 7, description: 'Book Purchase', amount: 24.99, category: 'Education', icon: '📚', date: '2026-01-09', paymentMethod: 'Digital' },
		{ id: 8, description: 'Restaurant Dinner', amount: 85.50, category: 'Food', icon: '🍔', date: '2026-01-08', paymentMethod: 'Card' },
	];

	let searchQuery = $state('');
	let selectedCategory = $state('all');
	let sortBy = $state('date-desc');

	const categories = ['all', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Education'];

	let filteredExpenses = $derived(() => {
		let result = [...expenses];
		
		// Filter by search
		if (searchQuery) {
			result = result.filter(e => 
				e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				e.category.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		
		// Filter by category
		if (selectedCategory !== 'all') {
			result = result.filter(e => e.category === selectedCategory);
		}
		
		// Sort
		if (sortBy === 'date-desc') {
			result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		} else if (sortBy === 'date-asc') {
			result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
		} else if (sortBy === 'amount-desc') {
			result.sort((a, b) => b.amount - a.amount);
		} else if (sortBy === 'amount-asc') {
			result.sort((a, b) => a.amount - b.amount);
		}
		
		return result;
	});

	function formatDate(dateStr) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
					{#each categories as cat}
						<option value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
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
			{#if filteredExpenses().length === 0}
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
				
				{#each filteredExpenses() as expense}
					<div class="list-row">
						<div class="cell description">
							<span class="expense-icon">{expense.icon}</span>
							<span class="expense-name">{expense.description}</span>
						</div>
						<div class="cell category">
							<span class="category-badge">{expense.category}</span>
						</div>
						<div class="cell date">{formatDate(expense.date)}</div>
						<div class="cell amount amount-negative">-${expense.amount.toFixed(2)}</div>
						<div class="cell actions">
							<button class="action-btn" aria-label="Edit expense">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
									<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
								</svg>
							</button>
							<button class="action-btn delete" aria-label="Delete expense">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<polyline points="3 6 5 6 21 6"></polyline>
									<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
								</svg>
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Add Button (Mobile visible in bottom nav) -->
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
		background-color: var(--em-bg-tertiary);
		border-radius: var(--em-radius-full);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--em-text-secondary);
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

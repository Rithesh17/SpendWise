<script>
	import { PageHeader, StatCard, EmptyState } from '$lib/components';

	// Demo data - will be replaced with store data later
	const stats = {
		todayTotal: '$45.50',
		weekTotal: '$234.80',
		monthTotal: '$1,247.35',
		budgetRemaining: '$752.65'
	};

	const recentExpenses = [
		{ id: 1, description: 'Coffee & Snacks', amount: 12.50, category: 'Food', icon: '🍔', date: 'Today' },
		{ id: 2, description: 'Uber Ride', amount: 18.75, category: 'Transport', icon: '🚗', date: 'Today' },
		{ id: 3, description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', icon: '🎬', date: 'Yesterday' },
		{ id: 4, description: 'Grocery Shopping', amount: 67.30, category: 'Food', icon: '🍔', date: 'Yesterday' },
		{ id: 5, description: 'Electric Bill', amount: 124.00, category: 'Utilities', icon: '💡', date: '2 days ago' }
	];

	const topCategories = [
		{ name: 'Food & Dining', amount: 450.25, percentage: 36, color: 'var(--em-cat-food)' },
		{ name: 'Transport', amount: 285.50, percentage: 23, color: 'var(--em-cat-transport)' },
		{ name: 'Entertainment', amount: 198.00, percentage: 16, color: 'var(--em-cat-entertainment)' },
		{ name: 'Utilities', amount: 180.00, percentage: 14, color: 'var(--em-cat-utilities)' },
		{ name: 'Shopping', amount: 133.60, percentage: 11, color: 'var(--em-cat-shopping)' }
	];
</script>

<svelte:head>
	<title>Dashboard | Expense Manager</title>
	<meta name="description" content="Track your expenses and manage your budget with Expense Manager." />
</svelte:head>

<div class="dashboard">
	<div class="container mx-auto px-4">
		<PageHeader 
			title="Dashboard" 
			subtitle="Track your spending at a glance"
		/>

		<!-- Stats Grid -->
		<section class="stats-grid">
			<StatCard 
				title="Today" 
				value={stats.todayTotal}
				subtitle="3 expenses"
				color="expense"
			/>
			<StatCard 
				title="This Week" 
				value={stats.weekTotal}
				trend="up"
				trendValue="+12%"
				subtitle="vs last week"
			/>
			<StatCard 
				title="This Month" 
				value={stats.monthTotal}
				trend="down"
				trendValue="-5%"
				subtitle="vs last month"
				color="expense"
			/>
			<StatCard 
				title="Budget Left" 
				value={stats.budgetRemaining}
				subtitle="38% remaining"
				color="income"
			/>
		</section>

		<!-- Main Content Grid -->
		<div class="content-grid">
			<!-- Recent Expenses -->
			<section class="recent-expenses em-card">
				<div class="section-header">
					<h2 class="section-title">Recent Expenses</h2>
					<a href="/expenses" class="view-all">View All →</a>
				</div>
				
				<div class="expense-list">
					{#each recentExpenses as expense}
						<div class="expense-item">
							<div class="expense-icon">{expense.icon}</div>
							<div class="expense-details">
								<span class="expense-description">{expense.description}</span>
								<span class="expense-meta">{expense.category} • {expense.date}</span>
							</div>
							<div class="expense-amount amount-negative">
								-${expense.amount.toFixed(2)}
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- Top Categories -->
			<section class="top-categories em-card">
				<div class="section-header">
					<h2 class="section-title">Top Categories</h2>
					<a href="/categories" class="view-all">Manage →</a>
				</div>

				<div class="category-list">
					{#each topCategories as category}
						<div class="category-item">
							<div class="category-info">
								<span class="category-name">{category.name}</span>
								<span class="category-amount">${category.amount.toFixed(2)}</span>
							</div>
							<div class="category-bar">
								<div 
									class="category-progress" 
									style="width: {category.percentage}%; background-color: {category.color};"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		</div>

		<!-- Quick Add Button (Desktop) -->
		<a href="/add" class="quick-add-fab" aria-label="Add new expense">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<line x1="12" y1="5" x2="12" y2="19"></line>
				<line x1="5" y1="12" x2="19" y2="12"></line>
			</svg>
		</a>
	</div>
</div>

<style>
	.dashboard {
		padding-bottom: 2rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	@media (max-width: 900px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--em-border);
	}

	.section-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--em-text-primary);
		margin: 0;
	}

	.view-all {
		font-size: 0.875rem;
		color: var(--em-primary);
		text-decoration: none;
		font-weight: 500;
	}

	.view-all:hover {
		color: var(--em-primary-light);
	}

	/* Expense List Styles */
	.expense-list {
		padding: 0.5rem 0;
	}

	.expense-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1.25rem;
		transition: background-color var(--em-transition-fast);
	}

	.expense-item:hover {
		background-color: var(--em-bg-hover);
	}

	.expense-icon {
		font-size: 1.5rem;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--em-bg-tertiary);
		border-radius: var(--em-radius-md);
	}

	.expense-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.expense-description {
		font-weight: 500;
		color: var(--em-text-primary);
	}

	.expense-meta {
		font-size: 0.75rem;
		color: var(--em-text-muted);
	}

	.expense-amount {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	/* Category List Styles */
	.category-list {
		padding: 1rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.category-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.category-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.category-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--em-text-primary);
	}

	.category-amount {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--em-text-secondary);
		font-variant-numeric: tabular-nums;
	}

	.category-bar {
		width: 100%;
		height: 6px;
		background-color: var(--em-bg-tertiary);
		border-radius: var(--em-radius-full);
		overflow: hidden;
	}

	.category-progress {
		height: 100%;
		border-radius: var(--em-radius-full);
		transition: width 0.5s ease-out;
	}

	/* Quick Add FAB */
	.quick-add-fab {
		display: none;
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 56px;
		height: 56px;
		background-color: var(--em-primary);
		color: white;
		border-radius: 50%;
		align-items: center;
		justify-content: center;
		box-shadow: var(--em-shadow-lg);
		text-decoration: none;
		transition: all var(--em-transition-fast);
		z-index: 50;
	}

	.quick-add-fab:hover {
		background-color: var(--em-primary-hover);
		transform: scale(1.05);
	}

	@media (min-width: 769px) {
		.quick-add-fab {
			display: flex;
		}
	}
</style>

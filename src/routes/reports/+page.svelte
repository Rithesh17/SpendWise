<script>
	import { PageHeader, StatCard } from '$lib/components';

	// Demo data - will be replaced with store data later
	/** @type {'month' | 'week' | 'year'} */
	let selectedPeriod = $state('month');

	const periodStats = {
		month: { total: 1247.35, average: 41.58, count: 30, highest: 124.00 },
		week: { total: 234.80, average: 33.54, count: 7, highest: 67.30 },
		year: { total: 14968.20, average: 1247.35, count: 365, highest: 450.00 }
	};

	const categoryBreakdown = [
		{ name: 'Food & Dining', amount: 450.25, percentage: 36, color: '#F97316' },
		{ name: 'Transport', amount: 285.50, percentage: 23, color: '#3B82F6' },
		{ name: 'Entertainment', amount: 198.00, percentage: 16, color: '#8B5CF6' },
		{ name: 'Utilities', amount: 180.00, percentage: 14, color: '#14B8A6' },
		{ name: 'Other', amount: 133.60, percentage: 11, color: '#64748B' },
	];

	const monthlyTrend = [
		{ month: 'Aug', amount: 1450 },
		{ month: 'Sep', amount: 1280 },
		{ month: 'Oct', amount: 1520 },
		{ month: 'Nov', amount: 1180 },
		{ month: 'Dec', amount: 1650 },
		{ month: 'Jan', amount: 1247 },
	];

	let stats = $derived(periodStats[selectedPeriod]);
	let maxTrend = $derived(Math.max(...monthlyTrend.map(m => m.amount)));
</script>

<svelte:head>
	<title>Reports | Expense Manager</title>
	<meta name="description" content="View detailed reports and analytics of your spending." />
</svelte:head>

<div class="reports-page">
	<div class="container mx-auto px-4">
		<PageHeader 
			title="Reports" 
			subtitle="Analyze your spending patterns"
		/>

		<!-- Period Selector -->
		<div class="period-selector">
			<button 
				class="period-btn" 
				class:active={selectedPeriod === 'week'}
				onclick={() => selectedPeriod = 'week'}
			>This Week</button>
			<button 
				class="period-btn" 
				class:active={selectedPeriod === 'month'}
				onclick={() => selectedPeriod = 'month'}
			>This Month</button>
			<button 
				class="period-btn" 
				class:active={selectedPeriod === 'year'}
				onclick={() => selectedPeriod = 'year'}
			>This Year</button>
		</div>

		<!-- Summary Stats -->
		<section class="stats-grid">
			<StatCard 
				title="Total Spent" 
				value="${stats.total.toFixed(2)}"
				color="expense"
			/>
			<StatCard 
				title="Daily Average" 
				value="${stats.average.toFixed(2)}"
			/>
			<StatCard 
				title="Transactions" 
				value={stats.count.toString()}
			/>
			<StatCard 
				title="Largest Expense" 
				value="${stats.highest.toFixed(2)}"
				color="warning"
			/>
		</section>

		<!-- Charts Section -->
		<div class="charts-grid">
			<!-- Category Breakdown -->
			<section class="chart-card em-card">
				<h2 class="chart-title">Spending by Category</h2>
				
				<!-- Simple donut chart placeholder -->
				<div class="donut-chart">
					<div class="donut-visual">
						<svg viewBox="0 0 36 36" class="donut-svg">
							{#each categoryBreakdown as cat, i}
								{@const offset = categoryBreakdown.slice(0, i).reduce((sum, c) => sum + c.percentage, 0)}
								<circle
									class="donut-segment"
									stroke={cat.color}
									stroke-dasharray="{cat.percentage} {100 - cat.percentage}"
									stroke-dashoffset={-offset}
									cx="18" cy="18" r="15.915"
								></circle>
							{/each}
						</svg>
						<div class="donut-center">
							<span class="donut-total">${periodStats[selectedPeriod].total.toFixed(0)}</span>
							<span class="donut-label">Total</span>
						</div>
					</div>
				</div>

				<div class="category-legend">
					{#each categoryBreakdown as cat}
						<div class="legend-item">
							<span class="legend-color" style="background-color: {cat.color};"></span>
							<span class="legend-name">{cat.name}</span>
							<span class="legend-value">${cat.amount.toFixed(2)}</span>
							<span class="legend-percentage">{cat.percentage}%</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- Monthly Trend -->
			<section class="chart-card em-card">
				<h2 class="chart-title">Monthly Trend</h2>
				
				<div class="bar-chart">
					{#each monthlyTrend as month}
						<div class="bar-item">
							<div class="bar-container">
								<div 
									class="bar-fill"
									style="height: {(month.amount / maxTrend) * 100}%;"
								></div>
							</div>
							<span class="bar-label">{month.month}</span>
							<span class="bar-value">${month.amount}</span>
						</div>
					{/each}
				</div>
			</section>
		</div>

		<!-- Export Section -->
		<section class="export-section em-card">
			<div class="export-info">
				<h3 class="export-title">Export Report</h3>
				<p class="export-description">Download your expense data for the selected period.</p>
			</div>
			<div class="export-actions">
				<button class="em-btn em-btn-ghost">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
						<polyline points="14 2 14 8 20 8"></polyline>
						<line x1="16" y1="13" x2="8" y2="13"></line>
						<line x1="16" y1="17" x2="8" y2="17"></line>
						<polyline points="10 9 9 9 8 9"></polyline>
					</svg>
					Export CSV
				</button>
				<button class="em-btn em-btn-primary">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
						<polyline points="14 2 14 8 20 8"></polyline>
						<line x1="16" y1="13" x2="8" y2="13"></line>
						<line x1="16" y1="17" x2="8" y2="17"></line>
						<polyline points="10 9 9 9 8 9"></polyline>
					</svg>
					Export PDF
				</button>
			</div>
		</section>
	</div>
</div>

<style>
	.reports-page {
		padding-bottom: 2rem;
	}

	.period-selector {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
		background-color: var(--em-surface);
		padding: 0.25rem;
		border-radius: var(--em-radius-lg);
		width: fit-content;
	}

	.period-btn {
		padding: 0.75rem 1.5rem;
		background: transparent;
		border: none;
		border-radius: var(--em-radius-md);
		color: var(--em-text-secondary);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--em-transition-fast);
	}

	.period-btn:hover {
		color: var(--em-text-primary);
	}

	.period-btn.active {
		background-color: var(--em-primary);
		color: white;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.chart-card {
		padding: 1.5rem;
	}

	.chart-title {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 1.5rem;
	}

	/* Donut Chart */
	.donut-chart {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.donut-visual {
		position: relative;
		width: 180px;
		height: 180px;
	}

	.donut-svg {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}

	.donut-segment {
		fill: none;
		stroke-width: 4;
		transition: stroke-dasharray 0.5s ease;
	}

	.donut-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}

	.donut-total {
		display: block;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--em-text-primary);
	}

	.donut-label {
		font-size: 0.75rem;
		color: var(--em-text-muted);
	}

	.category-legend {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.legend-color {
		width: 12px;
		height: 12px;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.legend-name {
		flex: 1;
		font-size: 0.875rem;
		color: var(--em-text-primary);
	}

	.legend-value {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--em-text-secondary);
		font-variant-numeric: tabular-nums;
	}

	.legend-percentage {
		font-size: 0.75rem;
		color: var(--em-text-muted);
		width: 40px;
		text-align: right;
	}

	/* Bar Chart */
	.bar-chart {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		height: 200px;
		gap: 0.75rem;
		padding-top: 1rem;
	}

	.bar-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.bar-container {
		width: 100%;
		height: 150px;
		background-color: var(--em-bg-tertiary);
		border-radius: var(--em-radius-sm) var(--em-radius-sm) 0 0;
		display: flex;
		align-items: flex-end;
		overflow: hidden;
	}

	.bar-fill {
		width: 100%;
		background: linear-gradient(to top, var(--em-primary), var(--em-primary-light));
		border-radius: var(--em-radius-sm) var(--em-radius-sm) 0 0;
		transition: height 0.5s ease;
	}

	.bar-label {
		font-size: 0.75rem;
		color: var(--em-text-muted);
		font-weight: 500;
	}

	.bar-value {
		font-size: 0.75rem;
		color: var(--em-text-secondary);
		font-weight: 500;
	}

	/* Export Section */
	.export-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.export-title {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
	}

	.export-description {
		font-size: 0.875rem;
		color: var(--em-text-secondary);
		margin: 0;
	}

	.export-actions {
		display: flex;
		gap: 0.75rem;
	}

	@media (max-width: 600px) {
		.charts-grid {
			grid-template-columns: 1fr;
		}

		.export-section {
			flex-direction: column;
			align-items: stretch;
			text-align: center;
		}

		.export-actions {
			justify-content: center;
		}
	}
</style>

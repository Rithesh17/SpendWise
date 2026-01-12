<script lang="ts">
	import { PageHeader, StatCard } from '$lib/components';
	import { 
		expenses,
		todayExpenses,
		weekExpenses, 
		monthExpenses,
		todayStats,
		weekStats,
		monthStats,
		categories
	} from '$lib/stores';
	import { preferences } from '$lib/stores/preferences';
	import { formatCurrency, calculateCategoryStats, calculateStats, startOfYear, filterByDateRange } from '$lib/utils';
	import { downloadAsCSV } from '$lib/utils/storage';

	type Period = 'week' | 'month' | 'year';
	let selectedPeriod = $state<Period>('month');

	// Calculate year stats
	let yearExpenses = $derived(filterByDateRange($expenses, startOfYear(), new Date()));
	let yearStats = $derived(calculateStats(yearExpenses));

	// Get stats based on selected period
	let currentStats = $derived(() => {
		switch (selectedPeriod) {
			case 'week': return $weekStats;
			case 'year': return yearStats;
			default: return $monthStats;
		}
	});

	let currentExpenses = $derived(() => {
		switch (selectedPeriod) {
			case 'week': return $weekExpenses;
			case 'year': return yearExpenses;
			default: return $monthExpenses;
		}
	});

	// Category breakdown for selected period
	let categoryStats = $derived(calculateCategoryStats(currentExpenses(), $categories));

	// Monthly trend (last 6 months)
	let monthlyTrend = $derived(() => {
		const months: { month: string; amount: number }[] = [];
		const now = new Date();
		
		for (let i = 5; i >= 0; i--) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
			const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			
			const monthExpenses = filterByDateRange($expenses, monthStart, monthEnd);
			const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
			
			months.push({
				month: date.toLocaleString('default', { month: 'short' }),
				amount: total
			});
		}
		
		return months;
	});

	let maxTrend = $derived(Math.max(...monthlyTrend().map(m => m.amount), 1));

	function handleExportCSV() {
		const date = new Date().toISOString().split('T')[0];
		downloadAsCSV(`expenses-${date}.csv`);
	}

	function handleExportPDF() {
		alert('PDF export will be available in a future update.');
	}
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
				value={formatCurrency(currentStats().total, $preferences.currency)}
				color="expense"
			/>
			<StatCard 
				title="Average" 
				value={formatCurrency(currentStats().average, $preferences.currency)}
			/>
			<StatCard 
				title="Transactions" 
				value={currentStats().count.toString()}
			/>
			<StatCard 
				title="Largest" 
				value={formatCurrency(currentStats().highest, $preferences.currency)}
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
							{#each categoryStats as cat, i}
								{@const offset = categoryStats.slice(0, i).reduce((sum, c) => sum + c.percentage, 0)}
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
							<span class="donut-total">{formatCurrency(currentStats().total, $preferences.currency)}</span>
							<span class="donut-label">Total</span>
						</div>
					</div>
				</div>

				<div class="category-legend">
					{#each categoryStats as cat}
						<div class="legend-item">
							<span class="legend-color" style="background-color: {cat.color};"></span>
							<span class="legend-name">{cat.categoryName}</span>
							<span class="legend-value">{formatCurrency(cat.total, $preferences.currency)}</span>
							<span class="legend-percentage">{Math.round(cat.percentage)}%</span>
						</div>
					{/each}
					{#if categoryStats.length === 0}
						<p class="no-data">No expenses in this period</p>
					{/if}
				</div>
			</section>

			<!-- Monthly Trend -->
			<section class="chart-card em-card">
				<h2 class="chart-title">Monthly Trend</h2>
				
				<div class="bar-chart">
					{#each monthlyTrend() as month}
						<div class="bar-item">
							<div class="bar-container">
								<div 
									class="bar-fill"
									style="height: {(month.amount / maxTrend) * 100}%;"
								></div>
							</div>
							<span class="bar-label">{month.month}</span>
							<span class="bar-value">{formatCurrency(month.amount, $preferences.currency)}</span>
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
				<button class="export-btn export-csv" onclick={handleExportCSV}>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
						<polyline points="14 2 14 8 20 8"></polyline>
						<line x1="16" y1="13" x2="8" y2="13"></line>
						<line x1="16" y1="17" x2="8" y2="17"></line>
						<polyline points="10 9 9 9 8 9"></polyline>
					</svg>
					Export CSV
				</button>
				<button class="export-btn export-pdf" onclick={handleExportPDF}>
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
		font-size: 1.25rem;
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

	.no-data {
		text-align: center;
		color: var(--em-text-muted);
		font-size: 0.875rem;
		padding: 1rem;
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
		min-height: 2px;
	}

	.bar-label {
		font-size: 0.75rem;
		color: var(--em-text-muted);
		font-weight: 500;
	}

	.bar-value {
		font-size: 0.625rem;
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

	.export-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border-radius: var(--em-radius-md);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--em-transition-fast);
	}

	.export-csv {
		background-color: var(--em-surface-hover);
		border: 1px solid var(--em-border);
		color: var(--em-text-primary);
	}

	.export-csv:hover {
		background-color: var(--em-bg-hover);
		border-color: var(--em-primary);
	}

	.export-pdf {
		background-color: var(--em-primary);
		border: 1px solid var(--em-primary);
		color: white;
	}

	.export-pdf:hover {
		background-color: var(--em-primary-hover);
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

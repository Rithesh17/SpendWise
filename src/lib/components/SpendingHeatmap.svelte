<script lang="ts">
	/**
	 * Spending Heatmap - Calendar view of daily spending
	 * @type {{
	 *   data: Map<string, number>,
	 *   month?: Date,
	 *   maxValue?: number,
	 *   onDayClick?: (date: string, amount: number) => void
	 * }}
	 */
	let {
		data = new Map(),
		month = new Date(),
		maxValue = 0,
		onDayClick
	} = $props();

	// Calculate max if not provided
	let calculatedMax = $derived(() => {
		if (maxValue > 0) return maxValue;
		let max = 0;
		data.forEach(v => { if (v > max) max = v; });
		return max || 1;
	});

	// Get calendar data for the month
	let calendarData = $derived(() => {
		const year = month.getFullYear();
		const monthNum = month.getMonth();
		
		// First day of month
		const firstDay = new Date(year, monthNum, 1);
		// Last day of month
		const lastDay = new Date(year, monthNum + 1, 0);
		
		// Start from Sunday before or on first day
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - startDate.getDay());
		
		// End on Saturday after or on last day
		const endDate = new Date(lastDay);
		endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
		
		const weeks: Array<Array<{date: Date, dateStr: string, amount: number, isCurrentMonth: boolean}>> = [];
		let currentWeek: Array<{date: Date, dateStr: string, amount: number, isCurrentMonth: boolean}> = [];
		
		const current = new Date(startDate);
		while (current <= endDate) {
			const dateStr = current.toISOString().split('T')[0];
			const amount = data.get(dateStr) || 0;
			
			currentWeek.push({
				date: new Date(current),
				dateStr,
				amount,
				isCurrentMonth: current.getMonth() === monthNum
			});
			
			if (currentWeek.length === 7) {
				weeks.push(currentWeek);
				currentWeek = [];
			}
			
			current.setDate(current.getDate() + 1);
		}
		
		return weeks;
	});

	// Get intensity level (0-4)
	function getIntensity(amount: number): number {
		if (amount === 0) return 0;
		const max = calculatedMax();
		const ratio = amount / max;
		if (ratio <= 0.25) return 1;
		if (ratio <= 0.5) return 2;
		if (ratio <= 0.75) return 3;
		return 4;
	}

	// Day names
	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	
	// Month/Year label
	let monthLabel = $derived(
		month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
	);
</script>

<div class="heatmap">
	<div class="heatmap-header">
		<h3 class="heatmap-title">{monthLabel}</h3>
	</div>

	<div class="heatmap-grid">
		<!-- Day labels -->
		<div class="day-labels">
			{#each dayNames as day}
				<span class="day-label">{day}</span>
			{/each}
		</div>

		<!-- Calendar grid -->
		<div class="calendar">
			{#each calendarData() as week}
				<div class="week">
					{#each week as day}
						<button 
							class="day intensity-{getIntensity(day.amount)}"
							class:other-month={!day.isCurrentMonth}
							class:today={day.dateStr === new Date().toISOString().split('T')[0]}
							onclick={() => onDayClick?.(day.dateStr, day.amount)}
							title="{day.date.getDate()} - ${day.amount.toFixed(2)}"
						>
							<span class="day-number">{day.date.getDate()}</span>
						</button>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- Legend -->
	<div class="legend">
		<span class="legend-label">Less</span>
		<div class="legend-scale">
			<span class="legend-box intensity-0"></span>
			<span class="legend-box intensity-1"></span>
			<span class="legend-box intensity-2"></span>
			<span class="legend-box intensity-3"></span>
			<span class="legend-box intensity-4"></span>
		</div>
		<span class="legend-label">More</span>
	</div>
</div>

<style>
	.heatmap {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.heatmap-header {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.heatmap-title {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
		color: var(--em-text-primary);
	}

	.heatmap-grid {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.day-labels {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.25rem;
		margin-bottom: 0.25rem;
	}

	.day-label {
		text-align: center;
		font-size: 0.625rem;
		font-weight: 500;
		color: var(--em-text-muted);
		text-transform: uppercase;
	}

	.calendar {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.week {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.25rem;
	}

	.day {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: all var(--em-transition-fast);
		position: relative;
		padding: 0;
	}

	.day-number {
		font-size: 0.6875rem;
		font-weight: 500;
	}

	.day.other-month {
		opacity: 0.3;
	}

	.day.today {
		outline: 2px solid var(--em-primary);
		outline-offset: -2px;
	}

	.day:hover {
		transform: scale(1.1);
		z-index: 1;
	}

	/* Intensity levels */
	.day.intensity-0 {
		background-color: var(--em-bg-tertiary);
		color: var(--em-text-muted);
	}

	.day.intensity-1 {
		background-color: hsl(142, 60%, 85%);
		color: hsl(142, 60%, 25%);
	}

	.day.intensity-2 {
		background-color: hsl(45, 80%, 75%);
		color: hsl(45, 80%, 25%);
	}

	.day.intensity-3 {
		background-color: hsl(25, 80%, 70%);
		color: hsl(25, 80%, 20%);
	}

	.day.intensity-4 {
		background-color: hsl(0, 70%, 60%);
		color: white;
	}

	/* Legend */
	.legend {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.legend-label {
		font-size: 0.625rem;
		color: var(--em-text-muted);
	}

	.legend-scale {
		display: flex;
		gap: 0.125rem;
	}

	.legend-box {
		width: 12px;
		height: 12px;
		border-radius: 2px;
	}

	.legend-box.intensity-0 {
		background-color: var(--em-bg-tertiary);
	}

	.legend-box.intensity-1 {
		background-color: hsl(142, 60%, 85%);
	}

	.legend-box.intensity-2 {
		background-color: hsl(45, 80%, 75%);
	}

	.legend-box.intensity-3 {
		background-color: hsl(25, 80%, 70%);
	}

	.legend-box.intensity-4 {
		background-color: hsl(0, 70%, 60%);
	}
</style>

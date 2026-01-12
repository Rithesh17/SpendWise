<script>
	import { PageHeader } from '$lib/components';

	// Demo state - will be replaced with store data later
	let currency = $state('USD');
	let dateFormat = $state('MM/DD/YYYY');
	let theme = $state('dark');
	let displayName = $state('John Doe');
	let email = $state('john@example.com');

	const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR'];
	const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];

	function handleSave() {
		alert('Settings saved! (Demo mode - will save to store in Phase 2)');
	}

	function handleExport() {
		alert('Export functionality will be available in Phase 2.');
	}
</script>

<svelte:head>
	<title>Settings | Expense Manager</title>
	<meta name="description" content="Manage your account and preferences." />
</svelte:head>

<div class="settings-page">
	<div class="container mx-auto px-4">
		<PageHeader 
			title="Settings" 
			subtitle="Manage your account and preferences"
		/>

		<div class="settings-grid">
			<!-- Account Section -->
			<section class="settings-section em-card">
				<h2 class="section-title">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
						<circle cx="12" cy="7" r="4"></circle>
					</svg>
					Account
				</h2>

				<div class="settings-form">
					<div class="form-group">
						<label class="em-label" for="displayName">Display Name</label>
						<input 
							type="text" 
							id="displayName"
							class="em-input"
							bind:value={displayName}
						/>
					</div>

					<div class="form-group">
						<label class="em-label" for="email">Email</label>
						<input 
							type="email" 
							id="email"
							class="em-input"
							bind:value={email}
							disabled
						/>
						<p class="input-hint">Email cannot be changed. Login with Firebase required.</p>
					</div>

					<div class="form-group">
						<label class="em-label">Password</label>
						<button class="em-btn em-btn-ghost" disabled>
							Change Password
						</button>
						<p class="input-hint">Password management requires Firebase authentication.</p>
					</div>
				</div>
			</section>

			<!-- Preferences Section -->
			<section class="settings-section em-card">
				<h2 class="section-title">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="3"></circle>
						<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
					</svg>
					Preferences
				</h2>

				<div class="settings-form">
					<div class="form-group">
						<label class="em-label" for="currency">Currency</label>
						<select id="currency" class="em-input" bind:value={currency}>
							{#each currencies as curr}
								<option value={curr}>{curr}</option>
							{/each}
						</select>
					</div>

					<div class="form-group">
						<label class="em-label" for="dateFormat">Date Format</label>
						<select id="dateFormat" class="em-input" bind:value={dateFormat}>
							{#each dateFormats as format}
								<option value={format}>{format}</option>
							{/each}
						</select>
					</div>

					<div class="form-group">
						<label class="em-label">Theme</label>
						<div class="theme-options">
							<button 
								class="theme-btn" 
								class:active={theme === 'dark'}
								onclick={() => theme = 'dark'}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
								</svg>
								Dark
							</button>
							<button 
								class="theme-btn" 
								class:active={theme === 'light'}
								onclick={() => theme = 'light'}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<circle cx="12" cy="12" r="5"></circle>
									<line x1="12" y1="1" x2="12" y2="3"></line>
									<line x1="12" y1="21" x2="12" y2="23"></line>
									<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
									<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
									<line x1="1" y1="12" x2="3" y2="12"></line>
									<line x1="21" y1="12" x2="23" y2="12"></line>
									<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
									<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
								</svg>
								Light
							</button>
						</div>
					</div>
				</div>
			</section>

			<!-- Data Management Section -->
			<section class="settings-section em-card">
				<h2 class="section-title">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					Data Management
				</h2>

				<div class="data-actions">
					<div class="data-action">
						<div class="action-info">
							<h3 class="action-title">Export Data</h3>
							<p class="action-description">Download all your expenses as JSON or CSV</p>
						</div>
						<button class="em-btn em-btn-ghost" onclick={handleExport}>
							Export
						</button>
					</div>

					<div class="data-action">
						<div class="action-info">
							<h3 class="action-title">Import Data</h3>
							<p class="action-description">Import expenses from a JSON or CSV file</p>
						</div>
						<button class="em-btn em-btn-ghost" onclick={handleExport}>
							Import
						</button>
					</div>

					<div class="data-action danger">
						<div class="action-info">
							<h3 class="action-title">Delete All Data</h3>
							<p class="action-description">Permanently delete all your expenses and settings</p>
						</div>
						<button class="em-btn em-btn-danger">
							Delete All
						</button>
					</div>
				</div>
			</section>

			<!-- About Section -->
			<section class="settings-section em-card">
				<h2 class="section-title">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"></circle>
						<line x1="12" y1="16" x2="12" y2="12"></line>
						<line x1="12" y1="8" x2="12.01" y2="8"></line>
					</svg>
					About
				</h2>

				<div class="about-info">
					<div class="about-row">
						<span class="about-label">Version</span>
						<span class="about-value">1.0.0</span>
					</div>
					<div class="about-row">
						<span class="about-label">Build</span>
						<span class="about-value">Phase 1 - Core UI</span>
					</div>
					<div class="about-row">
						<span class="about-label">License</span>
						<span class="about-value">MIT</span>
					</div>
				</div>

				<div class="about-links">
					<a href="https://github.com/expense-manager" class="about-link" target="_blank">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
						</svg>
						GitHub
					</a>
					<a href="/privacy" class="about-link">Privacy Policy</a>
					<a href="/terms" class="about-link">Terms of Service</a>
				</div>
			</section>
		</div>

		<!-- Save Button -->
		<div class="save-bar">
			<button class="em-btn em-btn-primary" onclick={handleSave}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="20 6 9 17 4 12"></polyline>
				</svg>
				Save Changes
			</button>
		</div>
	</div>
</div>

<style>
	.settings-page {
		padding-bottom: 2rem;
	}

	.settings-grid {
		display: grid;
		gap: 1.5rem;
		max-width: 800px;
	}

	.settings-section {
		padding: 1.5rem;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--em-border);
	}

	.section-title svg {
		color: var(--em-primary);
	}

	.settings-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.input-hint {
		font-size: 0.75rem;
		color: var(--em-text-muted);
		margin: 0;
	}

	.em-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Theme Options */
	.theme-options {
		display: flex;
		gap: 0.75rem;
	}

	.theme-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background-color: var(--em-bg-tertiary);
		border: 2px solid transparent;
		border-radius: var(--em-radius-md);
		color: var(--em-text-secondary);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--em-transition-fast);
	}

	.theme-btn:hover {
		background-color: var(--em-bg-hover);
	}

	.theme-btn.active {
		border-color: var(--em-primary);
		background-color: var(--em-info-bg);
		color: var(--em-text-primary);
	}

	/* Data Actions */
	.data-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.data-action {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: var(--em-bg-tertiary);
		border-radius: var(--em-radius-md);
		gap: 1rem;
	}

	.data-action.danger {
		background-color: var(--em-expense-bg);
	}

	.action-title {
		font-size: 0.875rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
	}

	.action-description {
		font-size: 0.75rem;
		color: var(--em-text-muted);
		margin: 0;
	}

	/* About Section */
	.about-info {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.about-row {
		display: flex;
		justify-content: space-between;
	}

	.about-label {
		color: var(--em-text-muted);
	}

	.about-value {
		font-weight: 500;
	}

	.about-links {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--em-border);
	}

	.about-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--em-primary);
		text-decoration: none;
		font-size: 0.875rem;
	}

	.about-link:hover {
		text-decoration: underline;
	}

	/* Save Bar */
	.save-bar {
		display: flex;
		justify-content: flex-end;
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--em-border);
		max-width: 800px;
	}

	@media (max-width: 600px) {
		.data-action {
			flex-direction: column;
			align-items: stretch;
			text-align: center;
		}
	}
</style>

<script lang="ts">
	import { page } from '$app/stores';
	import '@picocss/pico/css/pico.css';
	import '$lib/theme.scss';
	import '$lib/pico-extras.scss';
	import KebabIcon from '$lib/icons/kebab.svelte';
	import Toast from './toast.svelte';

	const user = $page?.data?.user;
</script>

<div class="root">
	<!-- <nav class="sidebar" /> -->
	<nav class="container">
		<ul>
			<li><a href="/code/items"><strong>Pantry</strong></a></li>
			<!-- {#if user}<li><a href="/generate">Generate Codes</a></li>{/if} -->
		</ul>
		<ul />

		<dialog>
			<article>
				<h3>Invite</h3>
				<p />
				<footer>
					<button>Cancel</button>
					<button>Invite</button>
				</footer>
			</article>
		</dialog>

		<ul>
			{#if $$slots['header-right']}
				<slot name="header-right" />
			{/if}
			<li>
				<details role="list" dir="rtl">
					<summary aria-haspopup="listbox" class="overflow-menu" role="link"><KebabIcon /></summary>
					<ul role="listbox">
						<li><a href="/households">Households</a></li>
						<li>
							<a class="generate" href="/generate"> Print Codes </a>
						</li>
						<li>
							<a href="/code/clear"> Clean up </a>
						</li>
						<hr />
						<li><a href="/user" role="link">{user?.name ?? 'Login'}</a></li>
					</ul>
				</details>
			</li>
		</ul>
	</nav>
	<main class="container page">
		<slot />
		<Toast />
	</main>

	{#if $$slots.sidebar}
		<div class="sidebar">
			<slot name="sidebar" />
		</div>
	{/if}

	{#if $$slots.actions}
		<div class="actions">
			<slot name="actions" />
		</div>
	{/if}
</div>

<style lang="scss">
	.root {
		height: 100dvh;
		display: flex;
		display: grid;
		gap: 1rem;
		grid-template-areas:
			'sidebar header'
			'sidebar body'
			'sidebar actions';
		grid-template-rows: auto 1fr auto;
		grid-template-columns: auto 1fr;
	}

	:global(.sidebar) {
		grid-area: sidebar;
		justify-content: flex-start;
		gap: 1rem;
	}

	.sidebar {
		grid-area: sidebar;
	}

	.actions {
		grid-area: actions;
	}

	nav.container {
		grid-area: header;
	}

	nav ol:last-of-type,
	nav ul:last-of-type {
		margin-right: 0;
	}

	nav .overflow-menu::after {
		display: none;
	}

	.actions {
		grid-area: actions;
		padding: var(--block-spacing-vertical) 0;
	}

	:global(.sidebar) {
		padding: var(--nav-element-spacing-vertical) var(--nav-element-spacing-horizontal);
	}

	:global(.page) {
		grid-area: body;
	}

	@media screen and (max-width: 480px) {
		.root {
			grid-template-areas:
				'header'
				'body'
				'actions';
			grid-template-rows: auto 1fr auto;
			grid-template-columns: 1fr;
		}
		:global(.sidebar) {
			display: none !important;
		}
	}

	@media screen and (min-width: 481px) {
		:global(.actions) {
			display: none !important;
		}
	}

	@media print {
		.root > nav.container {
			// display: none;
		}
		.sidebar {
			display: none;
		}
		.actions {
			display: none;
		}
	}
	.container.page {
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}
</style>

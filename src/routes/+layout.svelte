<script lang="ts">
	import { page } from '$app/stores';
	import '@picocss/pico/css/pico.css';
	import '$lib/theme.scss';
	import '$lib/pico-extras.scss';

	const user = $page?.data?.user;
</script>

<div class="root">
	<!-- <nav class="sidebar" /> -->
	<nav class='container'>
		<ul>
			<li><a href="/code/items"><strong>Pantry</strong></a></li>
			<!-- {#if user}<li><a href="/generate">Generate Codes</a></li>{/if} -->
		</ul>
		<ul>
			<li><a href="/user" role="link">{user?.record?.name ?? 'Login'}</a></li>
		</ul>
	</nav>
	<!-- <div class="page"> -->
	<slot />
	<!-- </div> -->
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

	nav.container {
		grid-area: header;
	}

	nav ol:last-of-type, nav ul:last-of-type {
		margin-right: 0;
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
			display: none;
		}
		.sidebar {
			display: none;
		}
		.actions {
			display: none;
		}
	}
</style>

<script lang="ts">
	import { page } from '$app/stores';
	import '@picocss/pico/css/pico.css';
	import '$lib/theme.scss';

	const user = $page?.data?.user;
</script>

<div class="root">
	<nav class="container">
		<ul>
			<li><a href="/code/items"><strong>Pantry</strong></a></li>
			<!-- {#if user}<li><a href="/generate">Generate Codes</a></li>{/if} -->
		</ul>
		<ul>
			<li><a href="/user" role="link">{user?.record?.name ?? 'Login'}</a></li>
		</ul>
	</nav>
	<slot />
</div>

<style lang="scss">
	.root {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	@media print {
		.root > nav.container {
			display: none;
		}
	}
</style>

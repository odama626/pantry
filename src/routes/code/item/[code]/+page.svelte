<script lang="ts">
	import type { PageData } from './$types';
	import * as formatters from '$lib/formatters';
	import Image from '$lib/image.svelte'

	export let data: PageData;
	const icon = data?.expand?.tags?.[0]?.icon;
</script>

<main class="container">
	<section>
		{#if data?.description}
			<div class="description">
				<Image url={icon} />
				<div class="detail">
					<h2>{data.description}</h2>
					<h2>{formatters.date(data.stored)}</h2>
					<a href="{data.code}/edit">edit</a>
				</div>
			</div>
		{:else}
			<h2>Code not found</h2>
			<a href="{data?.code}/edit">Add</a>
		{/if}
	</section>
</main>

<style lang="scss">
	.description {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: 1rem;
		align-items: center;
	}
</style>

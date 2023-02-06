<script lang="ts">
	export let url: string;
	export let size: string | undefined = undefined;

	// async function getSvgContent(url, size) {
	// 	const content = await fetch(url).then((r) => r.text());
	// 	const result = content.replace(/fill=['"].+?['"]/g, 'fill="currentColor"');
	// 	return result;
	// }
</script>

<div class="image-container" style="--size:{size};">
	<!-- {#if `${url ?? ''}`.endsWith('.svg')}
		{#await getSvgContent(url, size) then iconContent}
			{@html iconContent}
		{/await}
	{:else} -->
	<img class="image" src={url} />
	<!-- {/if} -->
</div>

<style lang="scss">
	.image-container {
		.image {
			max-width: var(--size, unset);
			max-height: var(--size, unset);
		}
		display: flex;
		justify-content: center;
		align-items: center;
	}

	@media only screen and (prefers-color-scheme: dark) {
		.image {
			filter: invert(100%);
		}
	}
	:global([data-theme='dark']) {
		.image {
			filter: invert(100%);
		}
	}
</style>

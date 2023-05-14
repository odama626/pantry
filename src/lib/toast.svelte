<script lang="ts">
	import { toastStore, Toast } from './toast';

	toastStore.subscribe(console.log);
</script>

<div class="container">
	{#each $toastStore as toast}
		<div class="item" on:click={() => Toast.dismiss(toast.id)}>
			{toast.text}
		</div>
	{/each}
</div>

<style lang="scss">
	.container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column-reverse;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-bottom: var(--form-element-spacing-vertical);
	}

	.item {
		background-color: var(--card-background-color);
		padding: var(--form-element-spacing-vertical) var(--form-element-spacing-horizontal);
		border-radius: 4rem; //calc(2 * var(--border-radius))
	}
</style>

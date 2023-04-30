<script lang="ts">
	import type { PageData } from './$types';
	import * as formatters from '$lib/formatters';
	import Image from '$lib/image.svelte';
	import Tag from '$lib/tag.svelte';
	import { getIcon } from '$lib/getIcon';

	export let data;
	const icon = getIcon(data);
</script>

<main class="container page">
	<section>
		{#if data?.name}
			<div class="description">
				<div class="image">
					<Image url={icon} />
				</div>
				<div class="detail">
					<h1>{data.name}</h1>
					<h2>Stored on: {formatters.date(data.stored)}</h2>
					{#if data.description}<p>Description: {data.description}</p>{/if}
					{#if data.expand.tags}
						<div class="tags">
							{#each data.expand.tags as tag}
								<Tag name={tag.name} />
							{/each}
						</div>
					{/if}
				</div>
				<div class="form-actions">
					<a role="button" href="{data.code}/edit">Edit</a>
				</div>
			</div>
		{:else}
			<h2>Code not found</h2>
			<a role="button" href="{data?.code}/edit">Add</a>
		{/if}
	</section>

	<a href="/code/scan">
		<svg width="62px" version="1.1" viewBox="0 0 700 700" xmlns="http://www.w3.org/2000/svg">
			<path
				d="m157.5 35c-28.98 0-52.5 23.52-52.5 52.5v70c0 9.6602 7.8398 17.5 17.5 17.5s17.5-7.8398 17.5-17.5v-70c0-9.6602 7.8398-17.5 17.5-17.5h70c9.6602 0 17.5-7.8398 17.5-17.5s-7.8398-17.5-17.5-17.5zm315 0c-9.6602 0-17.5 7.8398-17.5 17.5s7.8398 17.5 17.5 17.5h70c9.6602 0 17.5 7.8398 17.5 17.5v70c0 9.6602 7.8398 17.5 17.5 17.5s17.5-7.8398 17.5-17.5v-70c0-28.98-23.52-52.5-52.5-52.5zm-253.75 70c-24.148 0-43.75 19.602-43.75 43.75v52.5c0 24.148 19.602 43.75 43.75 43.75h52.5c24.148 0 43.75-19.602 43.75-43.75v-52.5c0-24.148-19.602-43.75-43.75-43.75zm131.25 0c-9.6602 0-17.5 7.8398-17.5 17.5v140h-140c-9.6602 0-17.5 7.8398-17.5 17.5s7.8398 17.5 17.5 17.5h140v140c0 9.6602 7.8398 17.5 17.5 17.5s17.5-7.8398 17.5-17.5v-140h140c9.6602 0 17.5-7.8398 17.5-17.5s-7.8398-17.5-17.5-17.5h-140v-140c0-9.6602-7.8398-17.5-17.5-17.5zm78.75 0c-24.148 0-43.75 19.602-43.75 43.75v52.5c0 24.148 19.602 43.75 43.75 43.75h52.5c24.148 0 43.75-19.602 43.75-43.75v-52.5c0-24.148-19.602-43.75-43.75-43.75zm-210 35h52.5c4.8281 0 8.75 3.9219 8.75 8.75v52.5c0 4.8281-3.9219 8.75-8.75 8.75h-52.5c-4.8281 0-8.75-3.9219-8.75-8.75v-52.5c0-4.8281 3.9219-8.75 8.75-8.75zm210 0h52.5c4.8281 0 8.75 3.9219 8.75 8.75v52.5c0 4.8281-3.9219 8.75-8.75 8.75h-52.5c-4.8281 0-8.75-3.9219-8.75-8.75v-52.5c0-4.8281 3.9219-8.75 8.75-8.75zm-210 175c-24.148 0-43.75 19.602-43.75 43.75v52.5c0 24.148 19.602 43.75 43.75 43.75h52.5c24.148 0 43.75-19.602 43.75-43.75v-52.5c0-24.148-19.602-43.75-43.75-43.75zm210 0c-24.148 0-43.75 19.602-43.75 43.75v52.5c0 24.148 19.602 43.75 43.75 43.75h52.5c24.148 0 43.75-19.602 43.75-43.75v-52.5c0-24.148-19.602-43.75-43.75-43.75zm-210 35h52.5c4.8281 0 8.75 3.9219 8.75 8.75v52.5c0 4.8281-3.9219 8.75-8.75 8.75h-52.5c-4.8281 0-8.75-3.9219-8.75-8.75v-52.5c0-4.8281 3.9219-8.75 8.75-8.75zm210 0h52.5c4.8281 0 8.75 3.9219 8.75 8.75v52.5c0 4.8281-3.9219 8.75-8.75 8.75h-52.5c-4.8281 0-8.75-3.9219-8.75-8.75v-52.5c0-4.8281 3.9219-8.75 8.75-8.75zm-306.25 35c-9.6602 0-17.5 7.8398-17.5 17.5v70c0 28.98 23.52 52.5 52.5 52.5h70c9.6602 0 17.5-7.8398 17.5-17.5s-7.8398-17.5-17.5-17.5h-70c-9.6602 0-17.5-7.8398-17.5-17.5v-70c0-9.6602-7.8398-17.5-17.5-17.5zm455 0c-9.6602 0-17.5 7.8398-17.5 17.5v70c0 9.6602-7.8398 17.5-17.5 17.5h-70c-9.6602 0-17.5 7.8398-17.5 17.5s7.8398 17.5 17.5 17.5h70c28.98 0 52.5-23.52 52.5-52.5v-70c0-9.6602-7.8398-17.5-17.5-17.5z"
				fill-rule="evenodd"
			/>
		</svg> Scan another Code
	</a>
</main>

<style lang="scss">
	.description {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 2rem;
		align-items: center;

		.image {
			background-color: var(--card-background-color);
			border-radius: 50%;
			aspect-ratio: 1;
		}
	}

	.form-actions {
		display: flex;
		grid-column: 2;
	}

	.detail {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
		h1,
		h2,
		p {
			margin-bottom: 0;
		}
	}

	.tags {
		display: flex;
		justify-content: flex-start;
		gap: 1rem;
	}
	@media screen and (max-width: 480px) {
		.description {
			display: flex;
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>

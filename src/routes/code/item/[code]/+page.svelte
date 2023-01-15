<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log({ data });
</script>

<main class="container">
	<section>
		{#if data.fields.description}
			<h2>{data.fields.description}</h2>
			<h2>{data.fields['stored at']}</h2>
			<a href="{data.fields.code}/edit">edit</a>
		{:else}
			<h2>Code not found</h2>
			<a href="{data.fields.code}/edit">Add</a>
		{/if}
	</section>
</main>

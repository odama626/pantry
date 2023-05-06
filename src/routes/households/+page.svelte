<script lang="ts">
	export let data;

	console.log({ data });
</script>

<main class="container page">
	<h1>Households</h1>
	{#each data.items as household}
		<div>
			{household.name}
		</div>
	{/each}
</main>

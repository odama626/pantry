<script lang="ts">
	export let data;

	console.log({ data });
</script>

<main class="container page">
	<h1>Households</h1>
	{#each data.items as household}
		<article>
			<div>
			{household.name}
			<a href="/households/{household.id}">Edit</a>
			</div>
			<div>
			
			</div>
			<div>
			<a>Make Default Pantry</a>
			<a>Create invite link</a>
			</div>
		</article>
	{/each}
</main>

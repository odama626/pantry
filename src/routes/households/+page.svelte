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
			<a>Edit</a>
			</div>
			<div>
			
			</div>
			<div>
			<a>Default Pantry</a>
			<a>Create invite link</a>
			</div>
		</article>
	{/each}
</main>

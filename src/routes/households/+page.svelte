<script lang="ts">
	import SlottedLayout from '$lib/slotted-layout.svelte';

	export let data;

	console.log({ data });
</script>

<SlottedLayout>
	<ul slot="header-right">
		<li><button class='link'>Create new Household</button><li>
	</ul>
	<h1>Households</h1>
	{#each data.items as household}
		<article>
			<div>
				{household.name}
				<a href="/households/{household.id}">Edit</a>
			</div>
			<div />
			<div>
				<a>Make Default Pantry</a>
				<a>Create invite link</a>
			</div>
		</article>
	{/each}
</SlottedLayout>

<script lang="ts">
	import SlottedLayout from '$lib/slotted-layout.svelte';

	export let data;

	const { user } = data;

	console.log({ data });
</script>

<SlottedLayout>
	<ul slot="header-right">
		<li><button class="link">Create new Household</button></li>
		<li />
	</ul>
	<h1>Households</h1>
	{#each data.items as household}
		<article>
			<div class="flex">
				{household.name}
				<a href="/households/{household.id}">Edit</a>
			</div>
			<div />
			<div class="flex">
				{#if user.defaultHousehold === household.id}
					Default Household
				{:else}
					<a>Make Default Pantry</a>
				{/if}
				<a>Create invite link</a>
			</div>
		</article>
	{/each}
</SlottedLayout>

<style lang="scss">
	.flex {
		display: flex;
		justify-content: space-between;
	}
</style>

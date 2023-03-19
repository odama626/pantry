<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const today = new Date().toJSON().split('T')[0];
	let date = data.stored ?? today;

	console.log({ data })
</script>

<main class="container">
	<h2>Edit</h2>
	<form method="post" action="/code/item?/edit">
		<input type="hidden" name="id" value={data.id ?? null} />
		<input type="hidden" name="code" value={data.code} />
		<input name="description" value={data.description ?? ''} />
		<div class="flex">
			<input bind:value={date} name="stored" type="date" />
			<button class="contrast outline" type="button" on:click={() => (date = today)}>Today</button>
		</div>
		<button>Save</button>
	</form>
</main>

<style lang="scss">
	.flex {
		display: flex;
		gap: 1rem;
	}
</style>

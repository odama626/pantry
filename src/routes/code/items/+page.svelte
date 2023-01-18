<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="container">
	<section class="items">
		<table role="grid">
			<thead>
				<tr><th>Description</th><th data-end>Stored on</th></tr>
			</thead>
			<tbody>
				{#each data.items as item}
					<tr>
						<td>{item.description}</td>
						<td data-end>{item.stored}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</main>

<style lang="scss">
	[data-end] {
		text-align: end;
	}
</style>

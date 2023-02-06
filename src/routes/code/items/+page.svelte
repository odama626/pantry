<script lang="ts">
	import * as formatters from '$lib/formatters';
	import { Grid, type GridOptions } from 'ag-grid-community';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	import { cellRendererFactory } from '$lib/AgGridCellRenderer';
	import GridActionBar from '$lib/GridActionBar.svelte';
	import 'ag-grid-community/styles//ag-grid.css';
	import '$lib/ag-grid-theme-alpine.css';
	import Image from '$lib/image.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let gridElement;
	let grid;

	const gridOptions: GridOptions = {
		detailRowAutoHeight: true,
		defaultColDef: {
			sortable: true,
			onCellClicked(event) {
				goto(`/code/item/${event.data.code}`);
			}
		},
		columnDefs: [
			{
				headerName: '',
				field: 'icon',
				width: 64,
				cellRenderer: cellRendererFactory((cell, params) => {
					new Image({
						target: cell.eGui,
						props: { url: params?.data?.expand?.tags?.[0]?.icon, size: `39px` }
					});
				})
			},
			{ headerName: 'Description', field: 'description', flex: 1 },
			{
				headerName: 'Stored On',
				field: 'stored',
				type: 'rightAligned',
				initialSort: 'asc',
				width: 120,
				valueGetter: (params) => formatters.date(params.data.stored)
			},
			// {
			// 	headerName: '',
			// 	width: 64,
			// 	cellRenderer: cellRendererFactory((cell, params) => {
			// 		new GridActionBar({ target: cell.eGui, props: { data: params.data } });
			// 	})
			// }
		],
		rowData: data.items
	};

	onMount(() => {
		grid = new Grid(gridElement, gridOptions);
	});
</script>

<main class="container">
	<div bind:this={gridElement} class="grid ag-theme-alpine" />
</main>

<style lang="scss">
	[data-end] {
		text-align: end;
	}

	.container {
		display: flex;
		flex-direction: column;
		height: 100%;

		.grid {
			height: 100%;
		}
	}
</style>

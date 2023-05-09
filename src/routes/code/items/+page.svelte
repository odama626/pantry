<script lang="ts">
	import * as formatters from '$lib/formatters';
	import { Grid, type GridOptions } from 'ag-grid-community';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	import { goto } from '$app/navigation';
	import { cellRendererFactory } from '$lib/AgGridCellRenderer';
	import Image from '$lib/image.svelte';
	import 'ag-grid-community/styles/ag-grid.css';
	import '$lib/ag-grid-theme-alpine.css';
	import Tag from '$lib/tag.svelte';
	import SlottedLayout from '$lib/slotted-layout.svelte';

	export let data: PageData;

	let gridElement;
	let grid: Grid;
	const initialSearch = $page.url.searchParams.get('s');
	let searchInput = initialSearch;

	const gridOptions: GridOptions = {
		detailRowAutoHeight: true,
		// pagination: true,
		// rowHeight: 75,
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
						props: { url: params?.data?.expand?.tags?.[0]?.icon, size: `32px` }
					});
				})
			},
			{
				headerName: 'Name',
				field: 'name',
				flex: 1,
				valueGetter: (params) => formatters.titleCase(params.data.name)
			},
			{
				headerName: 'Stored On',
				field: 'stored',
				type: 'rightAligned',
				initialSort: 'asc',
				width: 130,
				valueGetter: (params) => formatters.date(params.data.stored)
			},
			{
				headerName: 'tags',
				width: 500,
				initialHide: true,
				getQuickFilterText: (params) => {
					return params.data.expand?.tags?.map((tag) => tag.name).join(', ');
				},
				cellRenderer: cellRendererFactory((cell, params) => {
					params?.data?.expand?.tags?.map((tag) => {
						new Tag({
							target: cell.eGui,
							props: { name: tag.name }
						});
					});
				})
			}
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
		if (initialSearch) search();
	});

	function search() {
		gridOptions.api?.setQuickFilter(searchInput);
	}
</script>

<SlottedLayout>
	<label>
		<div>Search</div>
		<div class="flex">
			<form class="search" on:submit|preventDefault={() => {}}>
				<input bind:value={searchInput} />
				<button on:click={search}>
					<svg
						width="25"
						height="25"
						viewBox="0 0 25 25"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19.9574 21.6909L13.6574 15.3909C13.1574 15.7909 12.5824 16.1076 11.9324 16.3409C11.2824 16.5743 10.5908 16.6909 9.85742 16.6909C8.04076 16.6909 6.50342 16.0619 5.24542 14.8039C3.98676 13.5453 3.35742 12.0076 3.35742 10.1909C3.35742 8.37425 3.98676 6.83658 5.24542 5.57792C6.50342 4.31992 8.04076 3.69092 9.85742 3.69092C11.6741 3.69092 13.2118 4.31992 14.4704 5.57792C15.7284 6.83658 16.3574 8.37425 16.3574 10.1909C16.3574 10.9243 16.2408 11.6159 16.0074 12.2659C15.7741 12.9159 15.4574 13.4909 15.0574 13.9909L21.3574 20.2909L19.9574 21.6909ZM9.85742 14.6909C11.1074 14.6909 12.1701 14.2536 13.0454 13.3789C13.9201 12.5036 14.3574 11.4409 14.3574 10.1909C14.3574 8.94092 13.9201 7.87825 13.0454 7.00292C12.1701 6.12825 11.1074 5.69092 9.85742 5.69092C8.60742 5.69092 7.54475 6.12825 6.66942 7.00292C5.79475 7.87825 5.35742 8.94092 5.35742 10.1909C5.35742 11.4409 5.79475 12.5036 6.66942 13.3789C7.54475 14.2536 8.60742 14.6909 9.85742 14.6909Z"
							fill="var(--icon-color)"
						/>
					</svg>
				</button>
			</form>

			<a href="/code/scan">
				<svg
					width="62px"
					height="100%"
					version="1.1"
					viewBox="0 0 700 700"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="m157.5 35c-28.98 0-52.5 23.52-52.5 52.5v70c0 9.6602 7.8398 17.5 17.5 17.5s17.5-7.8398 17.5-17.5v-70c0-9.6602 7.8398-17.5 17.5-17.5h70c9.6602 0 17.5-7.8398 17.5-17.5s-7.8398-17.5-17.5-17.5zm315 0c-9.6602 0-17.5 7.8398-17.5 17.5s7.8398 17.5 17.5 17.5h70c9.6602 0 17.5 7.8398 17.5 17.5v70c0 9.6602 7.8398 17.5 17.5 17.5s17.5-7.8398 17.5-17.5v-70c0-28.98-23.52-52.5-52.5-52.5zm-253.75 70c-24.148 0-43.75 19.602-43.75 43.75v52.5c0 24.148 19.602 43.75 43.75 43.75h52.5c24.148 0 43.75-19.602 43.75-43.75v-52.5c0-24.148-19.602-43.75-43.75-43.75zm131.25 0c-9.6602 0-17.5 7.8398-17.5 17.5v140h-140c-9.6602 0-17.5 7.8398-17.5 17.5s7.8398 17.5 17.5 17.5h140v140c0 9.6602 7.8398 17.5 17.5 17.5s17.5-7.8398 17.5-17.5v-140h140c9.6602 0 17.5-7.8398 17.5-17.5s-7.8398-17.5-17.5-17.5h-140v-140c0-9.6602-7.8398-17.5-17.5-17.5zm78.75 0c-24.148 0-43.75 19.602-43.75 43.75v52.5c0 24.148 19.602 43.75 43.75 43.75h52.5c24.148 0 43.75-19.602 43.75-43.75v-52.5c0-24.148-19.602-43.75-43.75-43.75zm-210 35h52.5c4.8281 0 8.75 3.9219 8.75 8.75v52.5c0 4.8281-3.9219 8.75-8.75 8.75h-52.5c-4.8281 0-8.75-3.9219-8.75-8.75v-52.5c0-4.8281 3.9219-8.75 8.75-8.75zm210 0h52.5c4.8281 0 8.75 3.9219 8.75 8.75v52.5c0 4.8281-3.9219 8.75-8.75 8.75h-52.5c-4.8281 0-8.75-3.9219-8.75-8.75v-52.5c0-4.8281 3.9219-8.75 8.75-8.75zm-210 175c-24.148 0-43.75 19.602-43.75 43.75v52.5c0 24.148 19.602 43.75 43.75 43.75h52.5c24.148 0 43.75-19.602 43.75-43.75v-52.5c0-24.148-19.602-43.75-43.75-43.75zm210 0c-24.148 0-43.75 19.602-43.75 43.75v52.5c0 24.148 19.602 43.75 43.75 43.75h52.5c24.148 0 43.75-19.602 43.75-43.75v-52.5c0-24.148-19.602-43.75-43.75-43.75zm-210 35h52.5c4.8281 0 8.75 3.9219 8.75 8.75v52.5c0 4.8281-3.9219 8.75-8.75 8.75h-52.5c-4.8281 0-8.75-3.9219-8.75-8.75v-52.5c0-4.8281 3.9219-8.75 8.75-8.75zm210 0h52.5c4.8281 0 8.75 3.9219 8.75 8.75v52.5c0 4.8281-3.9219 8.75-8.75 8.75h-52.5c-4.8281 0-8.75-3.9219-8.75-8.75v-52.5c0-4.8281 3.9219-8.75 8.75-8.75zm-306.25 35c-9.6602 0-17.5 7.8398-17.5 17.5v70c0 28.98 23.52 52.5 52.5 52.5h70c9.6602 0 17.5-7.8398 17.5-17.5s-7.8398-17.5-17.5-17.5h-70c-9.6602 0-17.5-7.8398-17.5-17.5v-70c0-9.6602-7.8398-17.5-17.5-17.5zm455 0c-9.6602 0-17.5 7.8398-17.5 17.5v70c0 9.6602-7.8398 17.5-17.5 17.5h-70c-9.6602 0-17.5 7.8398-17.5 17.5s7.8398 17.5 17.5 17.5h70c28.98 0 52.5-23.52 52.5-52.5v-70c0-9.6602-7.8398-17.5-17.5-17.5z"
						fill-rule="evenodd"
					/>
				</svg>
			</a>
		</div>
	</label>
	<div bind:this={gridElement} class="grid ag-theme-alpine" />
	<div slot="sidebar">
		<div />
		<div />
		<a href="/households">
			<svg
				width="62px"
				height="100%"
				version="1.1"
				viewBox="0 0 700 700"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g>
					<path
						d="m507.5 35h-315c-13.926 0-27.277 5.5312-37.125 15.375-9.8438 9.8477-15.375 23.199-15.375 37.125v87.5h420v-87.5c0-13.926-5.5312-27.277-15.375-37.125-9.8477-9.8438-23.199-15.375-37.125-15.375zm-210 105h-70c-6.2539 0-12.031-3.3359-15.156-8.75s-3.125-12.086 0-17.5 8.9023-8.75 15.156-8.75h70c6.2539 0 12.031 3.3359 15.156 8.75s3.125 12.086 0 17.5-8.9023 8.75-15.156 8.75zm175 0h-35c-6.2539 0-12.031-3.3359-15.156-8.75s-3.125-12.086 0-17.5 8.9023-8.75 15.156-8.75h35c6.2539 0 12.031 3.3359 15.156 8.75s3.125 12.086 0 17.5-8.9023 8.75-15.156 8.75z"
					/>
					<path
						d="m140 210v262.5c0 13.926 5.5312 27.277 15.375 37.125 9.8477 9.8438 23.199 15.375 37.125 15.375h315c13.926 0 27.277-5.5312 37.125-15.375 9.8438-9.8477 15.375-23.199 15.375-37.125v-262.5zm332.5 70h-245c-6.2539 0-12.031-3.3359-15.156-8.75s-3.125-12.086 0-17.5 8.9023-8.75 15.156-8.75h245c6.2539 0 12.031 3.3359 15.156 8.75s3.125 12.086 0 17.5-8.9023 8.75-15.156 8.75z"
					/>
				</g>
			</svg>
			Households
		</a>
	</div></SlottedLayout
>


<style lang="scss">
	.flex {
		display: flex;
		gap: 1rem;
	}

	label > div {
		margin-bottom: 0.45rem;
	}

	.generate {
		text-align: center;
	}

	.search {
		all: unset;
		position: relative;
		flex-basis: 100%;
		align-items: center;
		--icon-color: var(--form-element-border-color);

		button {
			all: unset;
			padding: var(--form-element-spacing-vertical) var(--form-element-spacing-horizontal);
			position: absolute;
			right: 0;
			top: 0;
			/* width: 64px; */
			margin: 1px;
			cursor: pointer;

			&:hover {
				--icon-color: var(--form-element-active-border-color);
			}
		}

		&:focus-within {
			--icon-color: var(--form-element-active-border-color);
		}

		input {
			padding-right: 45px;
		}
	}

	.grid {
		height: 100%;
	}
</style>

<script lang="ts">
	import { getIcon } from '$lib/getIcon.js';
	import hashColor from '$lib/hashColor.js';
	import Image from '$lib/image.svelte';
	import type { TagsRecord, TagsResponse } from '$lib/server/db.types.js';
	import { debounce } from 'lodash-es';
	import type { ListResult } from 'pocketbase';
	import Typeahead from 'svelte-typeahead';

	export let data;

	const today = new Date().toJSON().split('T')[0];
	let date = data.stored ?? today;

	const icon = getIcon(data);
	let tags: TagsRecord[] = data.expand?.tags?.filter((tag) => tag.custom) ?? [];
	let tagOptions: TagsResponse[] = [];

	const updateSearchResults = debounce((search) => {
		fetch(`/api/tags/q?search=${encodeURIComponent(search.detail)}`)
			.then((r) => r.json())
			.then((result: ListResult<TagsResponse>) => {
				tagOptions = result.items;
			});
	});

	function handleTagSelection(event) {
		const { detail } = event;
		const newTag = detail?.original ?? { name: detail.searched };
		if (!newTag.name) return;
		if (!tags.find((tag) => tag.name === newTag.name)) tags.push(newTag);
		tags = tags;
	}
</script>

<main class="container page">
	<section>
		<form method="post" action="/code/item?/edit">
			<div class="description">
				<div class="image">
					<Image url={icon} />
				</div>
				<div class="detail">
					<h1>Editing item</h1>
					<input type="hidden" name="id" value={data.id ?? null} />
					<input type="hidden" name="code" value={data.code} />
					<label>
						Item name
						<input name="name" value={data.name ?? ''} />
					</label>
					<div class="flex">
						<label>
							Stored on
							<input bind:value={date} name="stored" type="date" />
						</label>
						<label>
							&nbsp;
							<button class="contrast outline today" type="button" on:click={() => (date = today)}>
								Today
							</button>
						</label>
					</div>
					<label>
						Description
						<textarea name="description" value={data?.description ?? ''} />
					</label>
					<Typeahead
						data={tagOptions}
						focusAfterSelect
						inputAfterSelect="clear"
						label="Add Tag"
						on:type={updateSearchResults}
						on:select={handleTagSelection}
						on:keydown={(event) => {
							if (event.key !== 'Enter') return;
							// handleTagSelection({ detail: { search: event.target.value } });
						}}
						autoselect={false}
						extract={(item) => item.name}
					/>
					<input type="hidden" name="tags" value={JSON.stringify(tags)} />
					<div class="tags">
						{#if tags}
							{#each tags as tag, i}
								<button
									name="tags"
									value={JSON.stringify(tag)}
									type="button"
									on:click={() => {
										tags.splice(i, 1);
										tags = tags;
									}}
									style="--tag-color: {hashColor(tag.name)};"
									class="tag"
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M2.1717 15.5637L0.693359 14.0854L6.60674 8.172L0.693359 2.25862L2.1717 0.780273L8.08508 6.69365L13.9985 0.780273L15.4768 2.25862L9.56343 8.172L15.4768 14.0854L13.9985 15.5637L8.08508 9.65034L2.1717 15.5637Z"
											fill="white"
										/>
									</svg>

									<span>{tag.name}</span>
								</button>
							{/each}
						{/if}
					</div>
				</div>

				<div class="flex" />
				<div class="form-actions">
					<a role="button" class="link" href="/code/item/{data.code}">Cancel</a>
					<button>Save</button>
				</div>
			</div>
		</form>
	</section>
</main>

<style lang="scss">
	.description {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 2rem;
		align-items: center;

		.image {
			background-color: var(--card-background-color);
			border-radius: 50%;
			aspect-ratio: 1;

			background-image: url("data:image/svg+xml,<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><circle r='50%' fill='none' cx='50%' cy='50%' stroke='%23FFFBF4' stroke-width='5' stroke-dasharray='10,20,10,20' stroke-dashoffset='0' stroke-linecap='butt'/></svg>");
		}
	}

	@media screen and (max-width: 480px) {
		.description {
			display: flex;
			flex-direction: column;
			align-items: stretch;

			.image {
				display: none;
			}
		}
	}

	button.today {
		margin-top: calc(var(--spacing) * 0.25);
	}
	.form-actions {
		display: flex;
		justify-content: flex-end;
		grid-column: 2;
		gap: 1rem;
		> * {
			width: auto;
			margin-bottom: 0;
		}
	}

	.tags {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		gap: 1rem;
		> .tag {
			margin: 0;
		}
	}

	:global([data-svelte-typeahead]) {
		background-color: transparent !important;
		cursor: inherit !important;

		:global(label) {
			font-size: var(--font-size) !important;
		}
		:global(input) {
			--background-color: var(--form-element-background-color);
			--border-color: var(--form-element-border-color);
			--color: var(--form-element-color);
			--box-shadow: none;
			border: var(--border-width) solid var(--border-color) !important;
			border-radius: var(--border-radius) !important;
			outline: none !important;
			background-color: var(--background-color) !important;
			box-shadow: var(--box-shadow) !important;
			color: var(--color) !important;
			font-weight: var(--font-weight) !important;
			transition: background-color var(--transition), border-color var(--transition),
				color var(--transition), box-shadow var(--transition) !important;
			cursor: text !important;
			margin-bottom: 0;
		}

		:global(ul.svelte-typeahead-list) {
			--background-color: var(--form-element-background-color);
			--border-color: var(--dropdown-border-color);
			--color: var(--form-element-color);
			--box-shadow: var(--button-box-shadow, 0 0 0 rgba(0, 0, 0, 0));
			border-radius: var(--border-radius) !important;
			border: var(--border-width) solid !important;
			border-color: var(--border-color) !important;
			border-top-right-radius: 0 !important;
			border-top-left-radius: 0 !important;
			background-color: var(--background-color) !important;
			box-shadow: var(--card-box-shadow) !important;
			color: var(--color) !important;

			:global(li) {
				background-color: var(--background-color) !important;
				font-weight: var(--font-weight) !important;
				padding: var(--form-element-spacing-vertical) !important;
				--box-shadow: var(--button-box-shadow, 0 0 0 rgba(0, 0, 0, 0));

				margin: 0;
				padding: calc(var(--form-element-spacing-vertical) * 0.5)
					var(--form-element-spacing-horizontal);
				list-style: none;
				border-bottom: 0 !important;
				color: var(--color) !important;
				box-shadow: var(--box-shadow) !important;

				&:first-of-type {
					margin-top: calc(var(--form-element-spacing-vertical) * 0.5);
				}

				&:last-of-type {
					margin-bottom: calc(var(--form-element-spacing-vertical) * 0.5);
				}

				&:hover {
					--background-color: var(--form-element-active-background-color);
					--color: var(--form-element-focus-color);
					--background-color: var(--primary-hover);
					--border-color: var(--primary-hover);
					--color: var(--primary-inverse);
				}
			}

			:global(li[aria-selected='true']) {
				--background-color: var(--form-element-active-background-color);
				--color: var(--form-element-focus-color);
				--background-color: var(--primary-hover);
				--border-color: var(--primary-hover);
				--color: var(--primary-inverse);
			}
		}

		:global(mark) {
			padding: 0;
			&:first-of-type {
				padding-left: 0.25rem;
			}
			&:last-of-type {
				padding-right: 0.25rem;
			}
		}
	}

	:global([data-svelte-typeahead] ul:empty) {
		--border-color: transparent;
	}

	:global([data-svelte-typeahead] input[aria-activedescendant]) {
		border-bottom-left-radius: 0 !important;
		border-bottom-right-radius: 0 !important;
	}

	button,
	[role='button'] {
		&.tag {
			background-color: var(--tag-color);
			border-color: var(--tag-color);
			width: auto;
			border-radius: 24px;
			padding: 0.25rem 1rem;

			svg {
				margin-right: 0.25rem;
			}

			&:hover {
				filter: brightness(110%);
			}

			&:active {
				filter: brightness(100%);
			}
		}
	}

	.flex {
		display: flex;
		gap: 1rem;
		> * {
			flex: 1 1 1px;
		}
	}
</style>

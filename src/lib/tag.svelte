<script lang="ts">
	import hashColor from './hashColor';

	export let name: string;
</script>

<a
	role="button"
	href="/code/items?s={encodeURIComponent(name)}"
	style="--tag-color: {hashColor(name)};"
	class="tag">{name}</a
>

<style lang="scss">
	button,
	[role='button'] {
		&.tag {
			background-color: var(--tag-color);
			border-color: var(--tag-color);
			width: auto;
			border-radius: 24px;
			padding: 0.25rem 1rem;
      /* font-size: 0.75rem; */

			&:hover {
				filter: brightness(110%);
			}

			&:active {
				filter: brightness(100%);
			}
		}
	}
</style>

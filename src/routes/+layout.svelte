<script lang="ts">
	import { page } from '$app/stores';
	import '@picocss/pico/css/pico.css';
	import '$lib/theme.scss';
	import '$lib/pico-extras.scss';
	import KebabIcon from '$lib/icons/kebab.svelte';

	const user = $page?.data?.user;
</script>

<slot />
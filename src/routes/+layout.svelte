<script lang="ts">
	import { page } from '$app/stores';
	import '@picocss/pico/css/pico.css';
	import '$lib/theme.scss';
	import '$lib/pico-extras.scss';
	import { pb } from '$lib/api';

	const user = $page?.data?.user;
	const token = $page?.data?.token;

	page.subscribe(data => {
		pb.authStore.save(token, user);
	})

</script>

<slot />
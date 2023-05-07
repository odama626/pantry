<script lang="ts">
	export let data;

	const { household } = data;

	console.log(data);
</script>

<main class="container page">
	<h1>{household.name}</h1>
</main>

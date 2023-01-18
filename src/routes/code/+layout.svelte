<script lang="ts">
	import { page } from '$app/stores';
	import '@picocss/pico/css/pico.css';
</script>

<nav class="container">
	<ul>
		<li><a href="/"><strong>Pantry</strong></a></li>
	</ul>
	<ul>
		<li><a href="/user" role="link">{$page?.data?.user?.name ?? 'Login'}</a></li>
	</ul>
</nav>
<slot />

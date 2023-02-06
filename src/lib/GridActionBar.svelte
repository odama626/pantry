<script lang="ts">
	import type { Product } from './types';

	export let data: Product;
</script>

<div>
	<a href="/code/item/{data.code}">edit</a>
</div>
<script lang="ts">
	import type { ZodIssue } from 'zod';

	export let label: string;

	export let error: ZodIssue | undefined;
	export let description: string | undefined = undefined;

	let dirty: boolean = false;
</script>

<label>
	{#if label}<div>{label}</div>{/if}
	<input
		aria-invalid={(!!error && !dirty) || undefined}
		on:keydown={() => (dirty = true)}
		{...$$restProps}
	/>
	{#if error}<small>{error.message}</small>{/if}
	{#if description}<small>{description}</small>{/if}
</label>

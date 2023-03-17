<script lang="ts">
	import { EventEmitter } from '$lib/eventEmitter';
	import QrScanner from 'qr-scanner';
	import { onMount } from 'svelte';

	let videoElement;
	let overlayElement;
	const emitter = new EventEmitter();
	const events = []

	onMount(() => {
		const qrScanner = new QrScanner(videoElement, console.log, { returnDetailedScanResult: true });

		qrScanner.start();
		console.log('scanning')

		emitter.subscribe(events.unshift);
		return () => {
			qrScanner.stop();
		};
	});
</script>

<div bind:this={overlayElement} />
<video bind:this={videoElement} />
<div class='container'>
	{#each events as event}
		<article>{JSON.stringify(event)}</article>
	{/each}
</div>
<style lang="scss">
</style>

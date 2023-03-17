<script lang="ts">
	import { EventEmitter } from '$lib/eventEmitter';
	import QrScanner from 'qr-scanner';
	import { onMount } from 'svelte';

	let videoElement;
	let overlayElement;
	const emitter = new EventEmitter();

	onMount(() => {
		const qrScanner = new QrScanner(videoElement, console.log, { returnDetailedScanResult: true });

		qrScanner.start();
		console.log('scanning')

		emitter.subscribe(console.log);
		return () => {
			qrScanner.stop();
		};
	});
</script>

<div bind:this={overlayElement} />
<video bind:this={videoElement} />

<style lang="scss">
</style>

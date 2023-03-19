<script lang="ts">
	import { goto } from '$app/navigation';
	import { EventEmitter } from '$lib/eventEmitter';
	import QrScanner from 'qr-scanner';
	import { onMount } from 'svelte';

	let videoElement;
	let overlayElement;
	const emitter = new EventEmitter();

	emitter.subscribe(async (event) => {
		const code = event.split('/code/item/')?.[1];

		goto(`/code/item/${code}`);
	});

	onMount(() => {
		const qrScanner = new QrScanner(videoElement, (event) => emitter.emit(event.data), {
			returnDetailedScanResult: true,
			highlightCodeOutline: true
		});

		qrScanner.start();

		return () => {
			qrScanner.stop();
		};
	});
</script>

<div bind:this={overlayElement} />
<div class="container">
	<h1>Pantry Code Lookup</h1>
</div>
<video bind:this={videoElement} />

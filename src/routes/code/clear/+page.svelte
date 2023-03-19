<script lang="ts">
	import { EventEmitter } from '$lib/eventEmitter';
	import QrScanner from 'qr-scanner';
	import { onMount } from 'svelte';

	let videoElement;
	let overlayElement;
	const emitter = new EventEmitter();
	let events = ['asdf','adf']

	onMount(() => {
		const qrScanner = new QrScanner(videoElement, event => emitter.emit(event.data), { returnDetailedScanResult: true });

		qrScanner.start();
		console.log('scanning')

		emitter.subscribe(event => {
			events.unshift(event);
			events = events;
			console.log({ events })
	});
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

	.bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>

<script lang="ts">
	import { EventEmitter } from '$lib/eventEmitter';
	import SlottedLayout from '$lib/slotted-layout.svelte';
	import QrScanner from 'qr-scanner';
	import { onMount } from 'svelte';

	let videoElement;
	let overlayElement;
	const emitter = new EventEmitter();
	let events = [];
	const notificationTimeout = 5000;

	emitter.subscribe(async (event) => {
		const code = event.split('/code/item/')?.[1];

		const result = await fetch(`/api/item/${code}`, { method: 'delete' }).then(async (r) => {
			return {
				...(await r.json()),
				ok: r.ok
			};
		});

		let message;

		if (!result.ok) {
			if (result.status === 404) {
				message = `Code not found`;
			} else {
				message = `Failed to delete item with code ${code}`;
			}
		} else {
			message = `Deleted Item ${result.item.name}`;
		}
		events.unshift({ code, message });
		events = events;

		setTimeout(() => {
			events = events.filter((c) => c.code !== code);
		}, notificationTimeout);
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

<SlottedLayout>
	<div bind:this={overlayElement} />
	<div class="container">
		<h1>Cleaning up</h1>
		<p>
			Emptying the fridge?<br />Spring cleaning?<br /> all codes you scan will be removed from your pantry.
		</p>
	</div>
	<video bind:this={videoElement} />
	<div class="container">
		<div class="bottom">
			{#each events as event}
				<article>{event.message}</article>
			{/each}
		</div>
	</div>
</SlottedLayout>

<style lang="scss">
	.bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	article {
		margin: 0.25rem 0;
		padding: var(--spacing);
	}

	video {
		width: 100%;
	}
</style>

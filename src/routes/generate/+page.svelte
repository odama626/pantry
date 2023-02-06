<script lang="ts">
	import { nanoid } from 'nanoid';

	import QRCode from 'qrcode';

	function createItemCode(id: string) {
		return QRCode.toDataURL(`pantry.thesparks.dev/code/item/${id}`);
	}

	const codesPromise = Promise.all(
		Array(200)
			.fill(0)
			.map(() => createItemCode(nanoid()))
	);
</script>

<div>
	<section>
		{#await codesPromise then codes}
			{#each codes as code}
				<img class='code' src={code} />
			{/each}
		{/await}
	</section>
</div>

<style lang="scss">
  .code {
    width: 90pt;
  }
</style>
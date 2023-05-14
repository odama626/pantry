<script lang="ts">
	import hashColor from '$lib/hashColor.js';
	import Image from '$lib/image.svelte';
	import SlottedLayout from '$lib/slotted-layout.svelte';
	import { Toast } from '$lib/toast';
	import { nanoid } from 'nanoid';
	import PocketBase from 'pocketbase';

	const pb = new PocketBase(import.meta.env.VITE_PB_DOMAIN);

	export let data;
	pb.authStore.save(data?.token, data?.user);
	console.log(pb.authStore.isValid);
	const { household, members } = data;

	async function createInvite() {
		const toastId = Toast.push({ text: `Creating Share link` });
		const code = nanoid(10);

		const inviteData = {
			household: household.id,
			code,
			invited_by: data.user.id
		};

		console.log({ inviteData });

		const invite = await pb.collection('invites').create(inviteData);

		Toast.dismiss(toastId);
		const url = new URL(`/invite`, window.location.href);
		url.searchParams.set('code', invite.code);
		url.searchParams.set('id', invite.id);
		navigator.clipboard.writeText(url.toString())
		Toast.push('Invite Copied to clipboard');

		console.log({ invite });
	}

	function getUserInitials(username: string) {
		return username
			.split(' ')
			.map((name) => name[0])
			.join('')
			.toUpperCase();
	}

	console.log(data);
</script>

<SlottedLayout>
	<section>
		<div class="description">
			<div class="image">
				<Image url={household.image} />
			</div>
			<div class="detail">
				<h1>{household.name}</h1>
				<div class="members">
					<h2>Household Members</h2>
					{#each members as member}
						<div class="user" style="--tag-color: {hashColor(member.name)}">
							<div class="image">{getUserInitials(member.name)}</div>
							<div>{member.name}</div>
						</div>
					{/each}
					<div class="footer">
						<button class="link" on:click={createInvite}>Create Invite Link</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</SlottedLayout>

<style lang="scss">
	.description {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 2rem;
		align-items: center;

		.image {
			background-color: var(--card-background-color);
			border-radius: 50%;
			aspect-ratio: 1;
		}
	}

	.members {
		display: flex;
		flex-direction: column;
		gap: var(--spacing);
		.footer {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
		}
	}

	.user {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--spacing);

		.image {
			border-radius: 50%;
			--size: 64px;
			width: var(--size);
			height: var(--size);
			background-color: var(--tag-color);
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.detail {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: var(--spacing);
		h1,
		h2,
		p {
			margin-bottom: 0;
		}
	}
	@media screen and (max-width: 480px) {
		.description {
			display: flex;
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>

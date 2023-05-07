<script lang="ts">
	import Input from '$lib/input.svelte';
	import '@picocss/pico/css/pico.css';
	import { capitalize } from 'lodash-es';
	import type { ActionData, PageData } from './$types';
	import Account from './account.svelte';

	export let data: PageData;
	export let form: ActionData;

	let type = form?.fields?.type ?? 'login';

	function getError(name: string) {
		return form?.error.errors.find((n) => n.path[0] === name);
	}
</script>

<main class="container page">
	<section>
		{#if !data.authenticated}
			<form method="post" action="?/{type}">
				<h2>{capitalize(type)}</h2>
				{#if type === 'register'}
					<blockquote>
						If members of your household already use pantry you should have them send you an invite
						instead!
						<strong>Registering</strong> will create a <strong>new household!</strong>
					</blockquote>
					<Input
						label="Name"
						name="name"
						error={getError('name')}
						value={form?.fields?.name ?? ''}
					/>
				{/if}
				<Input
					label="Email"
					name="email"
					error={getError('email')}
					value={form?.fields?.email ?? ''}
				/>
				<Input label="Password" error={getError('password')} name="password" type="password" />
				{#if type === 'register'}
					<Input
						label="House Nickname"
						description="Home, Lake House, etc"
						error={getError('household')}
						name="household"
						value={form?.fields?.household ?? ''}
					/>
					<div>
						Already have an account? <a on:click={() => (type = 'login')}>Login</a>
					</div>
				{:else}
					<div>
						Don't have an account? <a on:click={() => (type = 'register')}>Register</a>
					</div>
				{/if}
				<br />
				<button>
					{#if type === 'register'}Register{:else}Login{/if}
				</button>
				{form?.error?.message ?? ''}
			</form>
		{:else}
			<Account user={data?.user} />
		{/if}
	</section>
</main>

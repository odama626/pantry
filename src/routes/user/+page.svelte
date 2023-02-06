<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { capitalize } from 'lodash-es';
	import '@picocss/pico/css/pico.css';

	export let data: PageData;
	export let form: ActionData;

	let type = form?.fields?.type ?? 'login';
</script>

<main class="container">
	<section>
		{#if !data.authenticated}
			<dialog open>
				<form method="post" action="?/{type}">
					<h2>{capitalize(type)}</h2>
					<label>
						<div>Email</div>
						<input
							aria-invalid={form?.error?.field === 'email' || undefined}
							name="email"
							value={form?.fields?.email ?? ''}
						/>
					</label>
					<label>
						<div>Password</div>
						<input
							aria-invalid={form?.error?.field === 'password' || undefined}
							name="password"
							type="password"
						/>
					</label>
					{#if type === 'register'}
						<label>
							<div>Name</div>
							<input
								aria-invalid={form?.error?.field === 'name' || undefined}
								name="name"
								value={form?.fields?.name ?? ''}
							/>
						</label>
						<label>
							<div>Household</div>
							<input
								aria-invalid={form?.error?.field === 'household' || undefined}
								name="household"
								value={form?.fields?.household ?? ''}
							/>
						</label>
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
			</dialog>
		{:else}
			<h2>Logged in as {data?.user?.record?.name}</h2>
			<form method="post" action="?/logout">
				<button>Logout</button>
			</form>
		{/if}
	</section>
</main>

<script lang="ts">
	const steps = [
		{
			description: 'Print QR code label',
			image: `/landing/step_1.png`
		},
		{
			description: `Attach the label to your container`,
			image: `/landing/step_2.png`
		},
		{
			description: `Scan QR Code`,
			image: `/landing/step_3.png`
		},
		{
			description: `Digitally document your pantry item`,
			image: `/landing/step_4.png`
		}
	];
</script>

<main class="container page">
	<div class="hero">
		<img src="/landing/hero.png" />
		<div class="content">
			<h1>Smart Pantry management with what you already own</h1>
			<a href="/code/items">Get Started</a>
		</div>
	</div>
	<div class="howto-section">
		<h2>How it works</h2>
		<div class="steps">
			{#each steps as step, i}
				<div>
					<img src={step.image} />
					<h2>Step {i + 1}</h2>
					<p>
						{step.description}
					</p>
				</div>
			{/each}
		</div>
		<a href="/user">
			Create an Account
			<svg
				width="20"
				height="21"
				viewBox="0 0 20 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0.480469 20.1519L7.58496 10.2056L0.480469 0.259277H3.96167L11.0662 10.2056L3.96167 20.1519H0.480469ZM8.93481 20.1519L16.0393 10.2056L8.93481 0.259277H12.416L19.5205 10.2056L12.416 20.1519H8.93481Z"
					fill="#71C7FF"
				/>
			</svg>
		</a>
	</div>
</main>

<style lang="scss">
	.hero {
		display: flex;
		align-items: center;
		gap: 1rem;

		img {
			object-fit: contain;
			width: 100%;
		}

		.content {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: var(--typography-spacing-vertical);
		}
	}
	.howto-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;

		a {
			margin: var(--block-spacing-vertical) 0;
		}
	}

	.steps {
		display: flex;
		justify-content: space-between;
		justify-items: center;
		gap: 1rem;
		h1,
		h2 {
			margin-bottom: 0;
		}
		> * {
			flex: 1 1 1px;
		}
	}

	@media screen and (max-width: 480px) {
		.hero {
			flex-direction: column;
		}
		.steps {
			flex-direction: column;
			gap: var(--block-spacing-vertical);
		}
	}
</style>

<script>
	// https://codesandbox.io/s/svelte-accordion-collapse-vhc3m?file=/Accordion.svelte
	export let infos;
	import { slide } from "svelte/transition";

	let show = true;
	const showCollapse = (i) => {
		show = !show;
	};

  function scrollIntoView(e) {
	location.hash = "#" + e.currentTarget.value;
	history.replaceState(null, null, ' ');
  }
</script>

<div class="bandeau-container" style="opacity: var(--container-opacity)">
	<div class="bandeau">
		<button
			class="collapse__header"
			aria-expanded={show}
			on:click={showCollapse}
		>
			{infos.titre}
			<svg
				width="20"
				height="20"
				fill="none"
				color="#006699"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
				stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg
			>
		</button>
		{#if show}
			<div class="collapse__body" transition:slide>
				{#if infos.description}<p class="description">{infos.description}</p>{/if}
				<div class="lieu-info-bloc">
					{#if infos.trajets.split("/").includes("aller")}
						<button class="lieu-info-item" value="aller" on:click|preventDefault={scrollIntoView}>
							<div class="lieu-info-titre">
								Trajet Aller <input type="datetime-local" value="{infos.date_depart}"> 
							</div>
							<p class="b">{infos.lieu_depart || ''}</p>
							<p>{infos.lieu_depart_info || ''}</p>
						</button>
					{/if}
					{#if infos.trajets.split("/").includes("retour")}
						<button class="lieu-info-item" on:click|preventDefault={scrollIntoView} value="retour">
							<div class="lieu-info-titre">
								Trajet Retour <input type="datetime-local" value="{infos.date_retour }">
							</div>
							<p class="b">{infos.lieu_destination || ''}</p>
							<p>{infos.lieu_destination_info || ''}</p>
						</button>
					{/if}
				</div>
		<button
			class="fleche-expansion"
			aria-expanded={show}
			on:click={showCollapse}
		>
			<svg
				width="20"
				height="20"
				fill="none"
				color="#006699"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
				stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg
			>
			Fermer
		</button>
			</div>

		{/if}
	</div>
</div>

<style lang="scss">
	svg {
		transition: transform 0.2s ease-in;
	}

	[aria-expanded="true"] svg {
		transform: rotate(-90deg);
	}

	.fleche-expansion {
		text-align: center;
		width: 100%;
		border: none;
		border-radius: 10em 10em 0 0;
		padding: 0;
		margin-top: 1em;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: grey;
		font-size: smaller;
		font-style: italic;
		&:hover {
			background-color: rgb(0 0 0 / 7%);
		}
	}

	.description {
		text-wrap: wrap;
		word-break: break-all;
	}

	.b {
		font-weight: 700;
	}

	.lieu-info-item {
		border: 1px solid gainsboro;
		border-radius: 12px;
		text-align: left;

		font: inherit;
		--color: hsl(200, 100%, 30%);
		border: 1px solid var(--color);
		background-color: white;
		min-width: 13em;
	}

	.lieu-info-bloc {
		display: flex;
		flex-wrap: wrap;
		position: relative;
		padding-top: 1em;
		justify-content: space-between;
		gap: 1em;
	}
	.lieu-info-titre {
		color: hsl(200, 100%, 30%);
		font-weight: bold;
		display: flex;
		flex-direction: column;
	}

	.collapse__header {
		padding: 1rem;
		border: 1px solid grey;
		transition: background 200ms ease-in-out;
		display: flex;
		justify-content: space-between;
		cursor: pointer;
		width: 100%;
		background-color: transparent;
	}

	.collapse__body {
		padding: 1rem 1rem 0;
		background: #f0f0f0;
		border: 1px solid;
		border-top: none;
		border-color: hsl(200, 100%, 30%);
		border-bottom-right-radius: 12px;
		border-bottom-left-radius: 12px;
	}

	.bandeau-container {
		display: flex;
		justify-content: center;
	}

	.bandeau {
		width: var(--container-width);
	}
</style>

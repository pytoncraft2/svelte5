<script>
	import {activeZoneId, selectedItems} from "$lib/selectionStore";
	let zoneId = `zone-${Math.floor(Math.random() * 1000000)}`;
	let { passagers } = $props();
	function handleMaybeSelect(id, e) {
        console.log("HANDLE");
		if ($activeZoneId !== zoneId) {
			$selectedItems = {};
			$activeZoneId = zoneId;
		}
		if (Object.keys($selectedItems).includes(`${id}`)) {
			delete($selectedItems[`${id}`]);
		} else {
			$selectedItems[`${id}`] = passagers.find(item => item.id == id);
		}
		$selectedItems = {...$selectedItems};
	}
</script>

<article>
	<section  class="places">
		{#each passagers as item(item.id)}
            <div class:selected={Object.keys($selectedItems).includes(`${item.id}`)} on:click={(e) => handleMaybeSelect(item.id, e)} on:keydown on:keyup role="button" tabindex="{item.id}">
				<div class="objet-draggable">
					<div class="places-occupees"></div><span>{item.nom || item.name}</span>
				</div>
			</div>
		{/each}
	</section>
</article>


<style lang="scss">
	.selected {
		background: hsl(200, 100%, 30%);
		opacity: 0.9;
		color: white;
	}

	.places-occupees {
		display: inline-block;
		width: 15px;
		height: 15px;
		border: 1px solid #ccc;
		margin: 0 2px;
		background-color: #4caf50;
	}

	.objet-draggable {
		display: flex;
		justify-content: start;
		align-items: center;
	}

	:global(.zone-participant-sans-voiture .places-occupees) {
		background: #d20000;
	}
	:global(.zone-participant-sans-voiture .liste) {
		column-count: 2;

        @media screen and (max-width: 1600px) {
			column-count: 1;
		}
	}
</style>
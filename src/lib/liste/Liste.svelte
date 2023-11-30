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
			<!-- <div class:selected={Object.keys($selectedItems).includes(`${item.id}`)} on:click={(e) => handleMaybeSelect(item.id, e)} on:keydown on:keyup role="button" tabindex="{item.id}"> -->
            <div class:selected={Object.keys($selectedItems).includes(`${item.id}`)} on:click={(e) => handleMaybeSelect(item.id, e)} on:keydown on:keyup role="button" tabindex="{item.id}">
				<div class="objet-draggable">
                    <!-- {@render liste_participants(item[`passagers_aller`])} -->
					<span>{item.nom || item.name}</span>

					<!-- <span>{item.nom || item.name}</span> -->
				</div>
			</div>
		{/each}
	</section>
</article>


<style>
	.selected {
		background: hsl(200, 100%, 30%);
		opacity: 0.9;
		color: white;
	}
</style>
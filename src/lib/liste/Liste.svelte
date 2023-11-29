<script>
	import {dndzone, TRIGGERS, SOURCES, DRAGGED_ELEMENT_ID} from 'svelte-dnd-action';
	import {flip} from 'svelte/animate';
	import {tick} from "svelte";
	import {activeZoneId, selectedItems} from "$lib/selectionStore";

    // import Modal, {getModal} from "$lib/modal/Modal.svelte";
    import { PUT } from '$lib/utils';
    import AjoutVoiture from '../../routes/edition/form/AjoutVoiture.svelte';

	const flipDurationMs = 120;
	
	export let materiels = [];
	export let items;
	export let infos;
	export let personne;
	export let voiture = null;
	export let titre = '';
	export let nb_places = null;
	export let dragDisabled = false;
	export let titreClass = "titre-conducteur";
	export let index = null;
	export let typeTrajet;

	export let toggleModal = null;
	let zoneId = `zone-${Math.floor(Math.random() * 1000000)}`;
	
	function transformDraggedElement(el) {
		if (!el.getAttribute("data-selected-items-count") && Object.keys($selectedItems).length) {
			el.setAttribute("data-selected-items-count", Object.keys($selectedItems).length + 1);
		}
  }
	function handleConsider(e) {
		const {items: newItems, info: {trigger, source, id}} = e.detail;
		if (source !== SOURCES.KEYBOARD) {
			if (Object.keys($selectedItems).length && trigger === TRIGGERS.DRAG_STARTED) {
				if (Object.keys($selectedItems).includes(id)) {
					delete($selectedItems[id]);
					$selectedItems = {...$selectedItems};
					tick().then(() => {
						items = newItems.filter(item => !Object.keys($selectedItems).includes(item.id));
					});
				} else {
					$selectedItems = {};
				}
			}
		}
		if (trigger === TRIGGERS.DRAG_STOPPED) $selectedItems = {};
		items = newItems;
	}
	function handleFinalize(e) {
		console.log("OK?");
		console.log("EDETIL", e.detail);
		let {items: newItems, info: {trigger, source, id}} = e.detail;	
		if (Object.keys($selectedItems).length) {
			if (trigger === TRIGGERS.DROPPED_INTO_ANOTHER) {
				items = newItems.filter(item => !Object.keys($selectedItems).includes(item.id));
			} else if (trigger === TRIGGERS.DROPPED_INTO_ZONE || trigger === TRIGGERS.DROPPED_OUTSIDE_OF_ANY) {
				tick().then(() => {
					console.log("NEW ITEMs before",newItems);
					const idx = newItems.findIndex(item => item.id === id);
					// to support arrow up when keyboard dragging
					const sidx = Math.max(Object.values($selectedItems).findIndex(item => item.id === id), 0);
					// console.log("SIDX:", sidx);
					newItems = newItems.filter(item => !Object.keys($selectedItems).includes(item.id)) 
					console.log("NEW ITEMs AFTER:",newItems);
					newItems.splice(idx - sidx, 0, ...Object.values($selectedItems));
					items = newItems;
					$activeZoneId = zoneId;
					if (source !== SOURCES.KEYBOARD) $selectedItems = {}; 
				});
			}
		} else {
			items = newItems;	
		}
	}
	function handleMaybeSelect(id, e) {
		if ($activeZoneId !== zoneId) {
			$selectedItems = {};
			$activeZoneId = zoneId;
		}
		if (Object.keys($selectedItems).includes(`${id}`)) {
			delete($selectedItems[`${id}`]);
		} else {
			$selectedItems[`${id}`] = items.find(item => item.id == id);
		}
		$selectedItems = {...$selectedItems};
	}

  let cssVarStyles;
  $: {
	let fraction = items.length / nb_places;
	cssVarStyles = `--pourcentage-rempli:${fraction != Infinity ? fraction : 0};`;
  };
  










	// let { items, personne } = $props();
	// function handleMaybeSelect(id, e) {
    //     console.log("HANDLE");
	// 	if ($activeZoneId !== zoneId) {
	// 		$selectedItems = {};
	// 		$activeZoneId = zoneId;
	// 	}
	// 	if (Object.keys($selectedItems).includes(`${id}`)) {
	// 		delete($selectedItems[`${id}`]);
	// 	} else {
	// 		$selectedItems[`${id}`] = items.find(item => item.id == id);
	// 	}
	// 	$selectedItems = {...$selectedItems};
	// }



</script>

<article>
	<section  class="places" use:dndzone={{items, flipDurationMs, transformDraggedElement, dragDisabled}} on:consider={handleConsider} on:finalize={handleFinalize}>
		{#each items as item(item.id)}
			<!-- <div class:selected={Object.keys($selectedItems).includes(`${item.id}`)} on:click={(e) => handleMaybeSelect(item.id, e)} on:keydown on:keyup role="button" tabindex="{item.id}"> -->
            <button class:selected={Object.keys($selectedItems).includes(`${item.id}`)} on:click={(e) => handleMaybeSelect(item.id, e)} on:keydown on:keyup role="button" tabindex="{item.id}">
				<div class="objet-draggable">
                    <!-- {@render liste_participants(item[`passagers_aller`])} -->
					<span>{@render personne(item.nom || item.name)}</span>

					<!-- <span>{item.nom || item.name}</span> -->
				</div>
			</button>
		{/each}
	</section>
</article>

<style lang="scss">
article {
	min-width: 12em;
}
	.places {
		border: none;
		display: flex;
		display: flex;
		flex-wrap: wrap;
		overflow: auto;
		max-height: 90vh;
	}

	.places-restantes {
		font-size: smaller;
		display: flex;
		justify-content: center;
		padding: 1%;
		&.complet {
			color: #7cc724;
			font-weight: bold;
		}
	}

	.semi-rempli {
		border: 3px solid orange;
	}
	.rempli {
		border: 3px solid rgb(124, 199, 36);
	}

	.liste-participants {
		background-color: #bf0000; text-align: center; color: white;
		z-index: 1;
		cursor: pointer;
	}

	.materiels {
		background: #dcdcdc;
		color: white;
	}

        .bar-text {
            display: flex;
            align-items: center;
            border: 1px solid #000;
            padding: 10px;
        }

        .bar-text span {
            flex-grow: 1;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
        }

        .bar-text::before,
        .bar-text::after {
            content: "";
            flex-grow: 1;
            border-top: 1px solid #000;
            margin: 0 10px;
        }

	.vide {
		color: #8080808c;
	}
	.bloc-liste {
		border: none;
		min-width: 1em;
		max-height: 90vh;
		// overflow: auto;
        @media only screen and (max-width: 768px) {
			max-height: 65vh;
			flex:1;
        }
	}

	.objet-draggable {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: none;
		// min-height: 34.7px;
		width: max-content;

        @media only screen and (max-width: 768px) {
			min-height: fit-content;
        }


	}

	.objet-draggable-materiel {
		border: none;
	}

	div {
		text-align: center;
		border: 0.5px solid #00000045;
		padding: 0.2em;
		flex: 1;
	}
	section {
		min-height: 31px;
		overflow-y: auto;
		position: relative;
	}

	.titre-conducteur {
		cursor: pointer;
		position: relative;
		// background-color: #6a6a6a87;
		color: white;
		padding: 0.3em 0.5em;
		width: auto;
		border-radius: 0 61px 61px 0;
		&:active {
			opacity: 0.9;
		}

	}

	.titre-conducteur::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		height: 1em;
		background: lightslategray;
		bottom: 0;
		width: 100%;
		transform: scaleX(1);
		transition: transform 0.4s;
		transform-origin: left;
		height: 100%;
		z-index: -1;
		border-radius: 0 61px 61px 0;
	}

	.titre-conducteur::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		height: 1em;
		background: linear-gradient(270deg, #00334d, hsl(200, 100%, 30%));
		bottom: 0;
		width: 100%;
		transform: scaleX(var(--pourcentage-rempli));
		transition: transform 0.4s;
		transform-origin: left;
		height: 100%;
		z-index: -1;
		border-radius: 0 61px 61px 0;
	}



	.selected {
		background: hsl(200, 100%, 30%);
		opacity: 0.9;
		color: white;
	}
	:global([data-selected-items-count]::after) {
		position: absolute;
		left: -0.8em;
		top: 0;
		padding: 0.1em;
		content: attr(data-selected-items-count);
		color: white;
		background: rgba(0, 0, 0, 0.6);
	}

    .active {
        background-color: #7CC724;
        color: white;
    }
</style>
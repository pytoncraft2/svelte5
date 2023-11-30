<script>
    import { page } from "$app/stores";
    import { browser } from "$app/environment";
    import { GET, PUT } from "$lib/utils";
    import Modal from "$lib/modal/Modal.svelte";
    import AjoutPassager from "./form/AjoutPassager.svelte";
    import AjoutVoiture from "./form/AjoutVoiture.svelte";
    import BandeauInfo from "$lib/BandeauInfo.svelte";
    import TelechargementEtCheckbox from "$lib/disposition/TelechargementEtCheckbox/TelechargementEtCheckbox.svelte";
    import Liste from "../../lib/liste/Liste.svelte";
    import ZoneListes from "../../lib/disposition/ZoneListes.svelte"
    import {selectedItems} from "$lib/selectionStore";
    import previsualisationInfo from "./previsualisationInfo";

    let id = $state();
    let infos = $state(previsualisationInfo);
    let showModal = $state(false);
    let modalContent = $state()
    let modalData = $state();

    const searchParams = browser && $page.url.searchParams;

	$effect(() => {
        id = searchParams.get("url");
        if (id) {
            GET(`/api/evenement/${id}`)
                .then((v) => (infos = v, console.log(v)))
                .catch((e) => console.log(e));
        } else {
            window.location.href = "/";
        }
	})

    function toggleModal(component, data) {
        modalContent = component;
        showModal = !showModal;
        modalData = data;
    }

    function deplacement(i, headerText, typeTrajet, voiture) {
		// console.log("DEPLACEMENT", i, headerText, typeTrajet);
			// console.log($selectedItems);
		if (Object.keys($selectedItems).length === 0) {
			toggleModal(AjoutVoiture, { typeTrajet, voiture, titreModal: `Modifier voiture <br><span style='color: #006699'>${voiture.nom}</span>`})
		} else {
		const voiture_type_trajet = `voiture_${typeTrajet}_id`;
		// console.log("TYPE TR",voiture_type_trajet, infos.voitures);
		Object.values($selectedItems).map((p) => {
			const voitureIdOuNull = infos.voitures && infos.voitures[i] ? infos.voitures[i].id : null;
            console.log("SELECTION", $selectedItems);
            console.log(voitureIdOuNull, infos.voitures);

			// PUT(`/api/evenement/${p.evenement_id}/participant/${p.id}`,
			// {[voiture_type_trajet]: voitureIdOuNull || null})
			// .then(e => {
			// 	if (voitureIdOuNull) {
			// 		console.log("DEPLACEMENT DS VOITURE");					
			// 	} else {
			// 		infos = infos;
			// 	}
			// }).catch(e => console.log(e))
		});
		}
    }

</script>
<BandeauInfo {infos} --container-opacity={infos.loading ? 0.4 : 1} />
<TelechargementEtCheckbox />
<!-- <ZoneListes trajets={infos.trajets.split("/")}>

</ZoneListes> -->
<!-- <ZoneTrajets> -->
    <!-- {#each infos.trajets.split("/") as typeTrajet} -->
        <!-- <ZoneListes {typeTrajet}> -->
            <!-- <Liste
                items={infos.participants
                    .filter((v) => v[`voiture_${typeTrajet}_id`] === null)
                    .sort((a, b) => a.nom.localeCompare(b.nom))}
                materiels={infos.materiels
                    .filter((v) => v[`voiture_${typeTrajet}_id`] === null)
                    .sort((a, b) => a.nom.localeCompare(b.nom))}
                titre="Participants sans voiture ({infos.participants.filter(
                    (v) => v[`voiture_${typeTrajet}_id`] === null,
                ).length})"
                titreClass="liste-participants"
                {typeTrajet}
                bind:infos
            />
                <button
                    onclick={() =>
                        toggleModal(AjoutVoiture, {
                            typeTrajet,
                            titreModal: `Ajouter voiture <span style='color: #7CC724'>${typeTrajet}</span>`,
                        })}
                >Ajouter une voiture {typeTrajet}</button> -->

            <!-- <ListeVoitures> -->
                <!-- {#each infos.voitures.filter((v) => v.trajets === typeTrajet) as voiture, index (voiture.id)} -->
                    <!-- <Liste
                        items={infos.voitures[index][`passagers_${typeTrajet}`]}
                        materiels={infos.voitures[index][`materiels_${typeTrajet}`]}
                        titre={voiture.nom}
                        nb_places={voiture.nb_places}
                        {index}
                        {typeTrajet}
                        {voiture}
                        {toggleModal}
                        bind:infos
                    >
                        <button
                            onclick={() =>
                                toggleModal(AjoutPassager, {
                                    titreModal: `Ajouter passager dans<br><span style='color: #006699'>${voiture.nom}</span>`,
                                })}
                        >Ajouter passager</button>
                    </Liste> -->
                <!-- {/each} -->
            <!-- </ListeVoitures> -->
        <!-- </ZoneListes> -->
    <!-- {/each} -->
<!-- </ZoneTrajets> -->


<div class="zoneListes">
{#each infos.trajets.split("/") as typeTrajet}

    <h2 id="{typeTrajet}" class="bar-text" style="opacity: var(--container-opacity)"><span>Trajet {typeTrajet}</span></h2>
    <div class="groupe-liste" style="opacity: var(--container-opacity)">
        <div class="zone-participant-sans-voiture">
            <div class="liste">

                <div>

                <b>Participants sans voiture ({infos.participants.filter(
                        (v) => v[`voiture_${typeTrajet}_id`] === null,
                    ).length})</b>
                    <Liste
                        passagers={infos.participants
                            .filter((v) => v[`voiture_${typeTrajet}_id`] === null)
                            .sort((a, b) => a.nom.localeCompare(b.nom))}
                        materiels={infos.materiels
                            .filter((v) => v[`voiture_${typeTrajet}_id`] === null)
                            .sort((a, b) => a.nom.localeCompare(b.nom))}
                        {typeTrajet}
                        bind:infos
                    />
                </div>

            </div>
        </div>

            <div class="zone-bouton-voitures">
                <div class="groupe-boutons ajouts">
                        <!-- bouton ajout voiture -->
                    <button
                        onclick={() =>
                            toggleModal(AjoutVoiture, {
                                typeTrajet,
                                titreModal: `Ajouter voiture <span style='color: #7CC724'>${typeTrajet}</span>`,
                            })}
                    >Ajouter une voiture {typeTrajet}</button>
                </div>


                <div class="zone-voiture">
                {#each infos.voitures.filter((v) => v.trajets === typeTrajet) as voiture, index (voiture.id)}
                <div>

                <b>{voiture.nom}</b>
                <small>{voiture.nb_places} places</small>
                <div class="carre-dispo">
                {#each {length: voiture.nb_places} as _, i}
                    <div class="voiture"></div>
                {/each}
                </div>
                    <Liste
                        passagers={infos.voitures[index][`passagers_${typeTrajet}`]}
                        materiels={infos.voitures[index][`materiels_${typeTrajet}`]}
                        {typeTrajet}
                        {voiture}
                        {toggleModal}
                        bind:infos
                    />
                </div>
                        <!-- <button
                            onclick={() =>
                                toggleModal(AjoutPassager, {
                                    titreModal: `Ajouter passager dans<br><span style='color: #006699'>${voiture.nom}</span>`,
                                })}
                        >Ajouter passager</button> -->

    {/each}
                </div>
            </div>
            <!-- <div id="invisible-flex"></div> -->
        </div>
    {/each}
</div>

<style lang="scss">

    .carre-dispo {
        display: flex;
    }
        .voiture {
            width: 20px;
            height: 35px;
            // border: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            position: relative;
        }

        .places-disponibles::before {
            content: "";
            display: inline-block;
            width: 20px; /* Ajustez la taille des petits carrés selon vos préférences */
            height: 20px;
            margin: 0 2px; /* Espace entre les carrés */
            background-color: #4CAF50; /* Couleur pour les places disponibles */
        }

        .places-occupees::before {
            content: "";
            display: inline-block;
            width: 20px;
            height: 20px;
            margin: 0 2px;
            background-color: #FFC107; /* Couleur pour les places occupées */
        }

        /* Ajustez le nombre de petits carrés générés en fonction du pourcentage d'occupation */
        .voiture[data-places="4/6"] .places-disponibles::before:nth-child(n+5),
        .voiture[data-places="4/6"] .places-occupees::before:nth-child(-n+4) {
            background-color: #FFC107; /* Couleur pour les places occupées dans le cas spécifique de 4 places disponibles sur 6 */
        }
        

        /* Pour indiquer visuellement la différence entre les places disponibles et occupées, vous pouvez utiliser une bordure autour de chaque carré */
        .places-disponibles::before,
        .places-occupees::before {
            border: 1px solid #ccc;
        }

        /* Pour créer un contour autour de chaque petit carré */
        .dispo {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin: 0 2px;
            border: 1px solid #ccc;
            position: absolute;
            // top: 50%;
            transform: translateY(-50%);
            z-index: -1;
        }

        .carre {
            width: 100px;
            height: 50px;
            border: 1px solid #ccc;
            margin: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            position: relative;
        }
        .voiture::before {
            content: "";
            display: inline-block;
            width: 15px;
            height: 15px;
            margin: 0 2px;
            border: 1px solid #ccc;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: -1;
        }









    h2 {
        text-align: center;
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

    .groupe-liste {
        display: flex;
        position: relative;
        padding-top: 1%;
        gap: 1em;
        @media screen and (max-width: 480px) {
            gap: 0em;
        }
            // gap: 0.2em;
    }

    .groupe-boutons.ajouts {
        display: flex;
        justify-content: center;
        margin-bottom: 1em;
    }

    .zone-participant-sans-voiture {
        // display: flex;
        justify-content: center;
        // align-items: center;
        padding-bottom: 1em;
        flex:1;
    }

    .liste {
        background-color: white;
        flex: 1;
        position: -webkit-sticky;
        position: -moz-sticky;
        position: -o-sticky;
        position: -ms-sticky;
        position: sticky;
        position: sticky;
        top: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        @media screen and (max-width: 480px) {
            width: 100%;
        }
    }

    .zone-bouton-voitures {
        display: flex;
        flex-direction: column;
        flex: 3;
        top: 0;
        @media only screen and (max-width: 1490px) {
            position: static;
        }

        @media only screen and (max-width: 768px) {
            flex: 1;
        }
    }

    .zone-voiture {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1em;
        @media only screen and (max-width: 768px) {
            // margin-bottom: 50vh;
            gap: 1em 0;
            display: flex;
            flex-direction: column;
        }

    }

        :global(.zone-voiture section.places) {
            flex-wrap: nowrap;
            flex-direction: column;
        }

    #invisible-flex {
        flex: 1;
        @media only screen and (max-width: 1440px) {
            display: none;
        }        
    }

    // .zoneListes {
    //     max-width: 540px;
    // }

</style>
<Modal bind:showModal {modalContent} {modalData} {infos} />

<!-- <style lang="scss">
    #t {
        display: flex;
        gap: 1em;
        justify-content: center;
        flex-direction: var(--horizontale);
        // @media screen and (max-width: 888px) {
            // flex-direction: column;
        // }
    }

    // :global(#invisible-flex) {
    //     display: var(--invisible);
    // }

    // :global(.liste) {
        // display: var(--liste) !important;
        // width: auto !important;
    // }

    :global(.zoneListes) {
        flex: 1 !important;
        // max-width: none !important;
    }

    :global(.groupe-liste) {
        flex-direction: var(--p-haut);
    }

    :global(.zone-participant-sans-voiture) {
        max-width: var(--z-participant-sv);
        display: var(--z-participant-display);
    }

</style> -->
<!-- <ZoneTrajets>
    {#each infos.trajets.split("/") as typeTrajet}
        <ZoneListes {typeTrajet}>
            <ListeParticipants
                slot="participants-sans-voiture"
                items={infos.participants
                    .filter((v) => v[`voiture_${typeTrajet}_id`] === null)
                    .sort((a, b) => a.nom.localeCompare(b.nom))}
                materiels={infos.materiels
                    .filter((v) => v[`voiture_${typeTrajet}_id`] === null)
                    .sort((a, b) => a.nom.localeCompare(b.nom))}
                titre="Participants sans voiture ({infos.participants.filter(
                    (v) => v[`voiture_${typeTrajet}_id`] === null,
                ).length})"
                titreClass="liste-participants"
                {typeTrajet}
                {dragDisabled}
                bind:infos
            />
                <Bouton
                    texte="Ajouter une voiture {typeTrajet} 🚘"
                    slot="bouton-ajout-voiture"
                    --bouton-largeur="auto"
                    {visible}
                    on:click={() =>
                        toggleModal(AjoutVoiture, {
                            typeTrajet,
                            titreModal: `Ajouter voiture <span style='color: #7CC724'>${typeTrajet}</span>`,
                        })}
                />

            <ListeVoitures slot="participants-avec-voiture">
                {#each infos.voitures.filter((v) => v.trajets === typeTrajet) as voiture, index (voiture.id)}
                    <ListeParticipants
                        items={infos.voitures[index][`passagers_${typeTrajet}`]}
                        materiels={infos.voitures[index][`materiels_${typeTrajet}`]}
                        titre={voiture.nom}
                        nb_places={voiture.nb_places}
                        {index}
                        {typeTrajet}
                        {voiture}
                        {toggleModal}
                        {dragDisabled}
                        bind:infos
                    >
                        <Bouton
                            slot="bouton-ajout-passager"
                            texte="Ajouter passager"
                            --bouton-largeur="100%"
                            {visible}
                            on:click={() =>
                                toggleModal(AjoutPassager, {
                                    titreModal: `Ajouter passager dans<br><span style='color: #006699'>${voiture.nom}</span>`,
                                })}
                        />
                    </ListeParticipants>
                {/each}
            </ListeVoitures>
        </ZoneListes>
    {/each}
</ZoneTrajets> -->
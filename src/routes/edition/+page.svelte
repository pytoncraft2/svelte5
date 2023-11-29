<script>
    import { page } from "$app/stores";
    import { browser } from "$app/environment";
    import { GET } from "$lib/utils";
    import Modal from "$lib/modal/Modal.svelte";
    import AjoutPassager from "./form/AjoutPassager.svelte";
    import AjoutVoiture from "./form/AjoutVoiture.svelte";
    import BandeauInfo from "$lib/BandeauInfo.svelte";
    import TelechargementEtCheckbox from "$lib/disposition/TelechargementEtCheckbox/TelechargementEtCheckbox.svelte";
    import Liste from "../../lib/liste/Liste.svelte";
    import ZoneListes from "../../lib/disposition/ZoneListes.svelte"

    let id = $state();
    let infos = $state({
    "titre": "Chargement...",
    "loading": true,
    "voitures": [],
    "participants": [],
    "materiels": [],
    "description": "...",
    "lieu_depart": "...",
    "lieu_depart_info": "...",
    "lieu_destination": "...",
    "lieu_destination_info": "...",
    "trajets": "aller/retour",
    "date_depart": "...",
    "date_retour": "..."
});
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
    let config = {
        "Afficher participant sans voiture": true,
        "Trajets côte à côte": false,
        "Participant sans voiture en haut": false,
    };

    function telechargement(e) {
        setTimeout(() => { window.print() }, 100);
    }
</script>

<BandeauInfo {infos} --container-opacity={infos.loading ? 0.4 : 1} />
<TelechargementEtCheckbox bind:config {telechargement} />
{#if infos}
    {#each infos.trajets.split("/") as typeTrajet}
    <ZoneListes {typeTrajet}>
        {#snippet participants_sans_voiture(trajet)}
        <Liste items={infos.participants
                        .filter((v) => v[`voiture_${trajet}_id`] === null)
                        .sort((a, b) => a.nom.localeCompare(b.nom))} />
        {/snippet}
        {#snippet bouton_ajout_voiture(trajet)}
        <button onclick={() => toggleModal(AjoutVoiture, {
                            trajet,
                            titreModal: `Ajouter voiture <span style='color: #7CC724'>${trajet}</span>`,
                        })}>Ajouter voiture {trajet}</button>
        {/snippet}
        {#snippet participants_avec_voiture(trajet)}
            {#each infos.voitures.filter((v) => v.trajets === trajet) as voiture, index}
                <h5>{voiture.nom}</h5>
                <Liste items={voiture[`passagers_${trajet}`]} />
                <button onclick={() =>
                    toggleModal(AjoutPassager, {
                        titreModal: `Ajouter passager dans<br><span style='color: #006699'>${voiture.nom}</span>`,
                    })}>Ajouter passager</button>
                <Liste items={infos.voitures[index][`materiels_${trajet}`]} />
                <button>Ajouter Materiel</button>
            {/each}
        {/snippet}
    </ZoneListes>
    {/each}
{/if}

<Modal bind:showModal {modalContent} {modalData} {infos} />

<style lang="scss">
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
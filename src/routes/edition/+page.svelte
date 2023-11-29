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



</script>

<BandeauInfo {infos} --container-opacity={infos.loading ? 0.4 : 1} />
<TelechargementEtCheckbox />
<div id="t">
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
        <div>
            <h5>{voiture.nom}</h5>
            <Liste items={voiture[`passagers_${trajet}`]} />
            <button onclick={() =>
                toggleModal(AjoutPassager, {
                    titreModal: `Ajouter passager dans<br><span style='color: #006699'>${voiture.nom}</span>`,
                })}>Ajouter passager</button>
            <Liste items={infos.voitures[index][`materiels_${trajet}`]} />
            <button>Ajouter Materiel</button>
        </div>
        {/each}
    {/snippet}
</ZoneListes>
{/each}
</div>

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
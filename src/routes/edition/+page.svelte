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
        <h1>Sans voitures {typeTrajet}</h1>
        <Liste items={infos.participants
                        .filter((v) => v[`voiture_${typeTrajet}_id`] === null)
                        .sort((a, b) => a.nom.localeCompare(b.nom))} />
        <h3>Voitures {typeTrajet}</h3>
        <button onclick={() => toggleModal(AjoutVoiture, {
                            typeTrajet,
                            titreModal: `Ajouter voiture <span style='color: #7CC724'>${typeTrajet}</span>`,
                        })}>Ajouter voiture {typeTrajet}</button>
        {#each infos.voitures.filter((v) => v.trajets === typeTrajet) as voiture, index}
            <h5>{voiture.nom}</h5>
            <Liste items={voiture[`passagers_${typeTrajet}`]} />
            <button onclick={() =>
                toggleModal(AjoutPassager, {
                    titreModal: `Ajouter passager dans<br><span style='color: #006699'>${voiture.nom}</span>`,
                })}>Ajouter passager</button>
            <Liste items={infos.voitures[index][`materiels_${typeTrajet}`]} />
            <button>Ajouter Materiel</button>
        {/each}
    {/each}
{/if}

<Modal bind:showModal {modalContent} {modalData} {infos} />

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
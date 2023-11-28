<script>
    import { page } from "$app/stores";
    import { browser } from "$app/environment";
    import { GET } from "$lib/utils";
    import Modal from "$lib/modal/Modal.svelte";
    import AjoutPassager from "./form/AjoutPassager.svelte";
    import AjoutVoiture from "./form/AjoutVoiture.svelte";

    let id = $state();
    let infos = $state();
    let showModal = $state(false);
    let modalContent = $state()
    let modalData = $state();
    const searchParams = browser && $page.url.searchParams;

	$effect(() => {
        id = searchParams.get("url");
        if (id) {
            GET(`/api/evenement/${id}`)
                .then((v) => infos = v)
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

{#if infos}
    {#each infos.trajets.split("/") as typeTrajet}
        <h1>Sans voitures {typeTrajet}</h1>
        {@render liste_participants(infos.participants
                        .filter((v) => v[`voiture_${typeTrajet}_id`] === null)
                        .sort((a, b) => a.nom.localeCompare(b.nom)))}

        <h3>Voitures {typeTrajet}</h3>
        <button onclick={() => toggleModal(AjoutVoiture, {
                            typeTrajet,
                            titreModal: `Ajouter voiture <span style='color: #7CC724'>${typeTrajet}</span>`,
                        })}>Ajouter voiture {typeTrajet}</button>
        {#each infos.voitures.filter((v) => v.trajets === typeTrajet) as v}
            <h5>{v.nom}</h5>
            {@render liste_participants(v[`passagers_${typeTrajet}`])}
        {/each}        
    {/each}
{/if}

<Modal bind:showModal {modalContent} {modalData} {infos} />

{#snippet liste_participants(items)}
    {#each items as item(item.id)}
        <div role="button" tabindex="{item.id}">
            <div class="objet-draggable">
                <span>{item.nom || item.name}</span>
            </div>
        </div>
    {/each}
{/snippet}










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
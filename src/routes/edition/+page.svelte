<script>
    import { page } from "$app/stores";
    import { browser } from "$app/environment";
    import { GET, PUT } from "$lib/utils";
    import Modal from "$lib/Modal.svelte";
    import AjoutPassager from "./form/AjoutPassager.svelte";
    import AjoutVoiture from "./form/AjoutVoiture.svelte";
    import BandeauInfo from "$lib/BandeauInfo.svelte";
    import Liste from "$lib/Liste.svelte";
    import ZoneListes from "$lib/disposition/ZoneListes.svelte"
    import {selectedItems} from "$lib/selectionStore";
    import previsualisationInfo from "./previsualisationInfo";
    import TitreVoiture from "$lib/disposition/TitreVoiture.svelte";

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
<ZoneListes trajets={infos.trajets.split("/")}>
    {#snippet participants_sans_voiture(typeTrajet)}
        <div>
            <TitreVoiture titre={`Participants sans voiture (${infos.participants.filter(
                (v) => v[`voiture_${typeTrajet}_id`] === null,
            ).length})`} {infos}/>
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
    {/snippet}
    {#snippet bouton_ajout_voiture(typeTrajet)}
        <button onclick={() =>
                toggleModal(AjoutVoiture, {
                    typeTrajet,
                    titreModal: `Ajouter voiture <span style='color: #7CC724'>${typeTrajet}</span>`,
                })}
        >Ajouter une voiture {typeTrajet}</button>
    {/snippet}
    {#snippet participants_avec_voiture(typeTrajet)}
        {#each infos.voitures.filter((v) => v.trajets === typeTrajet) as voiture, index (voiture.id)}
            <div>
                <TitreVoiture titre={voiture.nom} {voiture} {infos} {typeTrajet} {index}/>
                    <Liste
                        passagers={infos.voitures[index][`passagers_${typeTrajet}`]}
                        materiels={infos.voitures[index][`materiels_${typeTrajet}`]}
                        {typeTrajet}
                        {voiture}
                        {toggleModal}
                        bind:infos
                    />
                    <!-- <button onclick={() =>
                        toggleModal(AjoutPassager, {
                            titreModal: `Ajouter passager dans<br><span style='color: #006699'>${voiture.nom}</span>`,
                        })}>Ajouter passager</button> -->
            </div>
        {/each}
    {/snippet}
</ZoneListes>

<Modal bind:showModal {modalContent} {modalData} {infos} />
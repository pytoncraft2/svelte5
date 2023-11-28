<script lang="ts">
    import { page } from "$app/stores";
    import { browser } from "$app/environment";
    import { GET } from "$lib/utils";

    let id = $state();
    let infos = $state();
    const searchParams = browser && $page.url.searchParams;

	$effect(() => {
        id = searchParams.get("url");
        if (id) {
            GET(`/api/evenement/${id}`)
                .then((v) => {
                    infos = v;
                })
                .catch((e) => console.log(e));
        } else {
            window.location.href = "/";
        }
        console.log(id);
        
	})

  let startDate = $state("2022-03-01");
  let endDate = $state("2022-03-03");
  
  const locale = {
    fr: {
      days: "Di|Lu|Ma|Me|Je|Ve|Sa".split("|"),
      months: "Jan|Fev|Mar|Avr|Mai|Juin|Juil|Aout|Sep|Oct|Nov|Dec".split('|'),
      start: 0,
    },
    en: {
      days: "Su|Mo|Tu|We|Th|Fr|Sa".split("|"),
      months: "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec".split('|'),
      start: 0,
    }
  }
  
  let culture = $state("fr");
</script>

{#snippet liste_participants(items)}
    {#each items as item(item.id)}
        <div role="button" tabindex="{item.id}">
            <div class="objet-draggable">
                <span>{item.nom || item.name}</span>
            </div>
        </div>
    {/each}
{/snippet}

<label>
  Culture:
  <select bind:value={culture}>
    {#each Object.keys(locale) as lang}
    <option value={lang}>{lang}</option>
    {/each}
  </select>
</label>

{#if infos}
{console.log(infos)}
    <!-- <h5>Sans voitures aller</h5>
    {@render liste_participants(infos.participants
                    .filter((v) => v[`voiture_aller_id`] === null)
                    .sort((a, b) => a.nom.localeCompare(b.nom)))}

    <h5>Voitures aller</h5>
    <button>Ajouter voiture aller</button>
    {#each infos.voitures as v}
        <h5>{v.nom}</h5>
        {@render liste_participants(v[`passagers_aller`])}
    {/each}

    <hr>
    <h5>Sans voitures retour</h5>
    {@render liste_participants(infos.participants
                    .filter((v) => v[`voiture_retour_id`] === null)
                    .sort((a, b) => a.nom.localeCompare(b.nom)))}

    <h5>Voitures retour</h5>
    <button>Ajouter voiture retour</button>
    {#each infos.voitures as v}
        <h5>{v.nom}</h5>
        {@render liste_participants(v[`passagers_retour`])}
    {/each}

 -->
 
    {#each infos.trajets.split("/") as typeTrajet}
        <h5>Sans voitures {typeTrajet}</h5>
        {@render liste_participants(infos.participants
                        .filter((v) => v[`voiture_${typeTrajet}_id`] === null)
                        .sort((a, b) => a.nom.localeCompare(b.nom)))}

        <h3>Voitures {typeTrajet}</h3>
            <button>Ajouter voiture {typeTrajet}</button>
            {#each infos.voitures as v}
                <h5>{v.nom}</h5>
                {@render liste_participants(v[`passagers_${typeTrajet}`])}
            {/each}        
    {/each}
{/if}












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
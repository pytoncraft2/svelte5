<script lang="ts">
    import { page } from "$app/stores";
    import { browser } from "$app/environment";
    import { GET } from "$lib/utils";
    let id = $state();
    let infos;
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
</script>

{#snippet liste_participants()}
<ul style="border: 1px solid;">
    <li>run</li>
    <li>run</li>
    <li>run</li>
</ul>
{/snippet}

<div class="grid-container">
  <div class="item2">
    <h5>Sans voitures</h5>
    {@render liste_participants()}
  </div>

  <div class="item3">
    <h5>Voitures</h5>
    <button>Ajouter voiture</button>
    <div id="liste-voitures">
        {#each {length: 3} as _, i}
        <div class="voiture">
            <p>Voiture {i}</p>
            {#each {length: 5} as _, x}
                {@render liste_participants()}
            {/each}
        </div>
        {/each}
    </div>
  </div>  
</div>

<style>
.item2 { grid-area: menu; }
.item3 { grid-area: main; }

.grid-container {
  display: grid;
  grid-template-areas:
    'menu main main main main main'
    'menu main main main main main';
  gap: 10px;
  background-color: #2196F3;
  padding: 10px;
}

.grid-container > div {
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding: 20px 0;
  font-size: 30px;
}

#liste-voitures {
    display: flex;
    flex-wrap: wrap;
}

.voiture {
    flex:1;
}
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
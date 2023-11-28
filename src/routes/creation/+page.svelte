<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { fade, fly } from "svelte/transition";
    import { POST, GET, PUT, DELETE } from "$lib/utils";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import Container from "$lib/disposition/container/Container.svelte";

    let matosInputRef;
    let personneInputRef;

    let titreRef;
    let descriptionInputRef;
    let dateHeureDepart;
    let dateHeureRetour;
    let listePersonnes = [];
    let listeMatos = [];
    let matosValeur = "";
    let personneValeur = "";

    let titre = "";
    let textareaPlaceholder =
    "(Un participant sur chaque ligne)\n\nExemple: \n\nRobert Baden-Powell\nMadeleine Martel\nNoé Lavoie\nElaine Beaulieu\nCésar Firmin";
    let multiSaisie = true;
    let id;
    let donnesPrecharge;

	$effect(() => {
        const searchParams = browser && $page.url.searchParams;

        if (searchParams && searchParams.get("titre")) {
            titre = $page.url.searchParams.get("titre");
            descriptionInputRef.focus({ preventScroll: true });
        } else {
            titreRef.focus({ preventScroll: true });
        }
        if (searchParams && searchParams.get("url")) {
            id = searchParams.get("url");
            if (id) {
                GET(`/api/evenement/${id}`)
                    .then((v) => donnesPrecharge = v);
            }
        }
    });

    function ajouterPersonne(nom) {
        if (nom === "") return;

        listePersonnes = [{ nom }, ...listePersonnes].sort();
        listePersonnes = listePersonnes;

        personneValeur = "";
        personneInputRef?.focus();
    }

    function enleverPersonne(index) {
        listePersonnes.splice(index, 1);
        listePersonnes = listePersonnes;
    }

    function ajouterMatos(nom) {
        if (nom == "") return;
        listeMatos = [{ nom }, ...listeMatos].sort();
        listeMatos = listeMatos;
        matosValeur = "";
        matosInputRef.focus();
    }

    function enleverMatos(index) {
        listeMatos.splice(index, 1);
        listeMatos = listeMatos;
    }

    function supprimerEvenement() {
        let text = "⚠️ Attention la suppression de l'événement est irréversible ! ⚠️\nConfirmer avec (OK) ou Annuler.";
        if (confirm(text) == true) {
            DELETE(`/api/evenement/${id}`)
            .then(v => window.location.href = "/")
        }
    }

    function captureEntrer(e, cb) {
        if (e.key === "Enter") {
            e.preventDefault();
            cb();
        }
    }

    function lireLignes() {
        const contenu = personneValeur;

        const lignes = contenu.split("\n");

        for (var i = 0; i < lignes.length; i++) {
            var ligne = lignes[i].trim();
            if (ligne !== "") {
                ajouterPersonne(ligne);
            }
        }
    }


    let chargementFini = false;
    let messageRetour = '';
    function validationFormulaire(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (donnesPrecharge) {
            PUT(`/api/evenement/${id}`, data)
                .then(e => console.log("changement effectué", e))
                .catch(e => console.log(e))
                .finally(() => {
                    messageRetour = "Changements effectués ✅";
                    chargementFini = true;
                    setTimeout(() => {
                        chargementFini = false;
                    }, 1000)
                })
        } else {
            data["materiels"] = listeMatos;
            data["participants"] = listePersonnes;

            POST("/api/evenements/", data)
            .then(e => console.log(e))
            .finally(() => {
                messageRetour = "Événement créé ✅, vérifier vos mails pour accéder au lien public et privé 📧";
                chargementFini = true;
            });
        }
    }
</script>
<Container>
    <div in:fly={{ y: 100, duration: 200, delay: 100 }} out:fly={{ x: -100, duration: 100 }}>

        {#if donnesPrecharge}
            <button class="bouton-style incorrect" onclick={supprimerEvenement}>Supprimer l'événement</button>
        {/if}
        <h1>{donnesPrecharge ? 'Modifier' : 'Création'} événement</h1>
        
        <form on:submit|preventDefault={validationFormulaire} id="creation">
            <div class="titre-description-evenement">
                <input
                    placeholder="Titre de l'évenement"
                    name="titre"
                    value={titre || donnesPrecharge?.titre || ''}
                    required
                    bind:this={titreRef}
                />
                <textarea
                    name="description"
                    cols="10"
                    rows="5"
                    value={donnesPrecharge?.description || ''}
                    placeholder="Description de l'évenement (facultatif)"
                    bind:this={descriptionInputRef}
                />
            </div>

            <div class="dates">
                <div>
                    Date et heure de départ<br />
                    <input type="datetime-local" name="date_depart">
                    <!-- <SveltyPicker
                        mode="datetime"
                        i18n={fr}
                        format="dd/mm/yyyy hh:ii"
                        value={donnesPrecharge?.date_depart || ''}
                        bind:dateHeureDepart
                        name="date_depart"
                    /> -->
                </div>
                <div>
                    Date et heure de retour<br />
                    <input type="datetime-local" name="date_retour">
                    <!-- <SveltyPicker
                        mode="datetime"
                        i18n={fr}
                        format="dd/mm/yyyy hh:ii"
                        value={donnesPrecharge?.date_retour || ''}
                        bind:dateHeureRetour
                        name="date_retour"
                    /> -->
                </div>
            </div>

            <h4>🏁 Lieu de l'évenement</h4>
            <div class="groupe-input">
                <input
                    placeholder="Entrez une commune, un code postal ou une adresse précise"
                    name="lieu_depart"
                    value={donnesPrecharge?.lieu_depart || ''}
                />
                <input
                    placeholder="Éventuelles informations supplémentaires sur le lieu de départ"
                    name="lieu_depart_info"
                    value={donnesPrecharge?.lieu_depart_info || ''}
                />
            </div>

            <h4>
                🚀 Lieu de départ / retour (laissez vide si vous avez plusieurs villes de
                départ/retour)
            </h4>
            <div class="groupe-input">
                <input
                    placeholder="Entrez une commune, un code postal ou une adresse précise"
                    name="lieu_destination"
                    value={donnesPrecharge?.lieu_destination || ''}
                />
                <input
                    placeholder="Éventuelles informations supplémentaires sur le lieu de retour"
                    name="lieu_destination_info"
                    value={donnesPrecharge?.lieu_destination_info || ''}
                />
            </div>

            <h4>🛣️ Gestion des trajets</h4>
            <select name="trajets">
                <option value="aller/retour" selected={donnesPrecharge?.trajets == 'aller/retour' ? 'selected' : ''}>Aller et Retour</option>
                <option value="aller" selected={donnesPrecharge?.trajets == 'aller' ? 'selected' : ''}>Aller uniquement</option>
                <option value="retour" selected={donnesPrecharge?.trajets == 'retour' ? 'selected' : ''}>Retour uniquement</option>
            </select>

            <h4>👑 Organisateur</h4>

            <div class="groupe-input">
                <input
                    placeholder="Votre Nom, Prénom"
                    name="nom_organisateur"
                    value={donnesPrecharge?.nom_organisateur || ''}
                />
                <input type="email" placeholder="Votre E-mail" name="email_organisateur" value={donnesPrecharge?.email_organisateur || ''} />
            </div>

            {#if !donnesPrecharge}
                <h4>👥 Personnes présentes ({listePersonnes.length})</h4>
                    <div class="option-saisie">
                        <em>Option de saisie: </em>
                        <input type="button" class:multiSaisie onclick={() => multiSaisie = true} value="Individuellement" />
                        <input type="button" class:multiSaisie={!multiSaisie} onclick={() => multiSaisie = false}  value="Liste" />
                    </div>

                    {#if multiSaisie}
                        <div class="input-bouton">
                            <input
                                type="text"
                                placeholder="Exemple : Mr Tout-le-monde"
                                bind:this={personneInputRef}
                                bind:value={personneValeur}
                                on:keydown={(e) => captureEntrer(e, () => ajouterPersonne(personneValeur))}
                            />

                            <button
                                type="button"
                                class="filled"
                                onclick={() => ajouterPersonne(personneValeur)}>Ajouter</button
                            >
                        </div>
                    {:else}
                        <textarea
                            name="liste_personnes"
                            cols="30"
                            rows="10"
                            placeholder={textareaPlaceholder}
                            bind:value={personneValeur}
                        />

                        <button on:click|preventDefault={lireLignes} class="filled mb-1"
                            >Valider la liste</button
                        >               
                    {/if}

                    <div class="groupe-input-bouton" id="liste-personnes">
                        {#each listePersonnes as personne, i}
                            <div class="input-bouton">
                                <input type="text" value={personne.nom} />
                                <button
                                    type="button"
                                    class="bouton-suppression"
                                    onclick={() => enleverPersonne(i)}>Enlever</button
                                >
                            </div>
                        {/each}
                    </div>


                <h4>🛍️ Matériel à transporter ({listeMatos.length})</h4>

                <div class="groupe-input-bouton">
                    <div class="input-bouton">
                        <input
                            type="text"
                            placeholder="Exemple : Tente 6 places"
                            bind:this={matosInputRef}
                            bind:value={matosValeur}
                            onkeydown={(e) => captureEntrer(e, () => ajouterMatos(matosValeur))}
                        />

                        <button
                            type="button"
                            class="filled"
                            onclick={() => ajouterMatos(matosValeur)}>Ajouter</button
                        >
                    </div>
                    <div id="liste-matos">
                        {#each listeMatos as matos, ind}
                            <div class="input-bouton">
                                <input type="text" value={matos.nom} />
                                <button
                                    type="button"
                                    class="bouton-suppression"
                                    onclick={() => enleverMatos(ind)}>Enlever</button
                                >
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <button type="submit" class="filled enregistrer">Enregistrer</button>
            <div class="zoneRetour">
                {#if chargementFini}
                    <div in:fly={{ x: 100, duration: 200 }} out:fade class="chargementFini">
                        {messageRetour}
                    </div>
                {/if}
            </div>
        </form>
    </div>

    {#if donnesPrecharge}
        <div><button onclick={() => goto(`/edition/?url=${id}`)} class="bouton-page-evenement">Retour à la page d'événement</button></div>
    {/if}
</Container>

<style lang="scss">
    @use "../../lib/scss/color" as clr;

    .option-saisie {
        padding-bottom: 1em;
        input {
            cursor: pointer;
            &:hover {
                color: clr.$primaire-500;
            }
        }
    } 

    @mixin column-count($c) {
        -webkit-column-count: $c;
        -moz-column-count: $c;
        column-count: $c;
    }

    #liste-personnes, #liste-matos {
        @include column-count(3);
        @media only screen and (max-width: 920px) {
            @include column-count(2);
        }
        @media only screen and (max-width: 615px) {
            @include column-count(1);
        }
    }
    .multiSaisie {
        color: clr.$primaire-500;
        cursor: pointer;
    }
    .titre-description-evenement {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }
    form {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .dates {
        display: flex;
        justify-content: space-between;
        padding-top: 1em;
        flex-wrap: wrap;
        align-items: center;
    }


    .input-bouton {
        display: inline-block;
        padding: 2px 0;
    }

    .groupe-input {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }
    input {
        height: 2em;
    }

    select {
        font-size: medium;
    }

    .bouton-suppression {
        background-color: hsl(5, 80%, 70%);
        color: white;
        border: none;
    }

    .enregistrer {
        margin-top: 2em;
    }

    .mb-1 {
        margin-bottom: 1em;
    }

    .bouton-page-evenement {
        border: none;
        border-bottom: 1px solid;
        margin-top: 5%;
        width: 100%;
    }

    .chargementFini {
        text-align: center;
        padding-top: 1%;
    }

    .zoneRetour {
        min-height: 32px;
    }
</style>
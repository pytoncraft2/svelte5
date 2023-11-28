<script>
    import { POST } from "$lib/utils";
    export let modalData;
    export let infos;
    $: ({ typeTrajet, voiture, titreModal } = modalData)

    function sauvegarderModifierVoiture(e, typeTrajet) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        POST(`/api/evenement/${infos.id_publique}/voitures/`, data)
            .then((v) => v.json()).then(v => console.log(v))
            .catch((e) => console.log(e));
    }

</script>
<h2>{@html titreModal}</h2>
<hr>
<form on:submit|preventDefault={(e) => sauvegarderModifierVoiture(e, typeTrajet)}>
    <label for="nom" class="required">Nom, Prenom</label>
    <input type="text" placeholder="Voiture de Michael Schumacher" name="nom" id="nom" value="{voiture?.nom || ''}" required />
    <label for="nb_places" class="required">Nombre de place</label>

    <input
        type="number"
        placeholder="Nombre de place"
        name="nb_places"
        id="nb_places"
        value="{voiture?.nb_places || 4}"
        required
    />
    <label for="details">Precisions</label>
    <textarea name="details" id="details" cols="30" rows="5" placeholder="details supplémentaires... (facultatif)">{voiture?.details || ''}</textarea>
    <input type="hidden" name="trajets" id="trajets" value="{typeTrajet}" required>
    <input type="submit" value="Sauvegarder" class="bouton filled"/>
</form>
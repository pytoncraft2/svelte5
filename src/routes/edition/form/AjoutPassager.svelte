<script>
    import { selectedItems } from "$lib/selectionStore";
    import { PUT } from "$lib/utils";
    export let modalData;
    export let infos;
    $: ({ titreModal } = modalData)
    function ajoutOuSauvegardePassager(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        PUT(`/api/evenement/${infos.id_publique}/participant/${Object.values($selectedItems)[0].id}`, {nom: data['nom']})
        .then(v => console.log(v))
    }
</script>
<h2>{@html titreModal}</h2>
<hr>
<form on:submit|preventDefault={ajoutOuSauvegardePassager}>
    <label for="nomPrenom" class="required">Nom, Prenom</label>
    <input type="text" placeholder="Nom, Prenom" name="nom" value="{Object.values($selectedItems)[0]?.nom || ''}"/>
    <input type="hidden" name="participant_id" value="{modalData}" />
    <input type="submit" value="Sauvegarder" class="bouton filled"/>
</form>
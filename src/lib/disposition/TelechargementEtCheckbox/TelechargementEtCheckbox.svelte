<script>
    export let config;
    export let visible;
    export let telechargement
</script>
{#if visible}
    <div class="liste-checkbox">
        <div class="checkboxs">
            {#each Object.keys(config) as key}
                <label>
                    <input type="checkbox" bind:checked={config[key]} />
                    {key}
                </label>
            {/each}
            <button onclick={telechargement} class="bouton" style="border:none; display: inline-flex"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAS0lEQVR4nGNgGEngPxoetQAD/B8NIkLg/2gQoYNyLMGCC9cz0NCSenINJ8aSekoNx2cJ1QzHZgnVDYeBBigeBbQB/6mM6W8Bw5AEAO/6b2XgFcy5AAAAAElFTkSuQmCC" alt="telecharger">Télécharger</button>
        </div>
    </div>
{/if}

<style lang="scss">
.liste-checkbox {
    text-align: left;
    padding-top: 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.checkboxs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: var(--container-width);
    @media screen and (min-width: 888px) {
        flex-direction: row;
        justify-content: space-between;

    }
}
</style>
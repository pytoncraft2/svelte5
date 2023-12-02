<script>
    let { titre, voiture, infos, index, typeTrajet } = $props();
</script>

<b>{titre}</b>

{#if voiture}
    <small
        >{infos.voitures[index][`passagers_${typeTrajet}`]
            .length}/{voiture.nb_places} places</small
    >
    <div class="carre-dispo">
        {#each { length: voiture.nb_places - infos.voitures[index][`passagers_${typeTrajet}`]
            .length } as _, i}
            <!-- {#if i >= infos.voitures[index][`passagers_${typeTrajet}`].length} -->
                <div class="places-disponibles"></div>
            <!-- {:else} -->
                <!-- <div class="voiture places-disponibles"></div> -->
            <!-- {/if} -->
        {/each}
    </div>
{/if}

<style>

	.places-disponibles {
		display: inline-block;
		width: auto;
		height: 15px;
		border: 1px solid #ccc;
		margin: 2px;
		/* background-color: #ffc107; */
		background-color: #ffc1071c;
		background-color: #ffc10721;
	}
    .carre-dispo {
        display: flex;
        flex-direction: column;
        /* gap: 2px; */
    }
    /* .voiture {
        width: 20px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        position: relative;
    }

    .places-disponibles::before {
        content: "";
        display: inline-block;
        width: 20px;
        height: 20px;
        margin: 0 2px;
        background-color: #4caf50;
    }

    .places-occupees::before {
        content: "";
        display: inline-block;
        width: 20px;
        height: 20px;
        background-color: #ffc107;
    }

    .voiture::before {
        content: "";
        display: inline-block;
        width: 15px;
        height: 15px;
        margin: 0 2px;
        border: 1px solid #ccc;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: -1;
    } */
</style>
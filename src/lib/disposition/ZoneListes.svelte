<script>
    import TelechargementEtCheckbox from "./TelechargementEtCheckbox.svelte";
    import { estMobile}from "$lib/utils.js"

    let { participants_sans_voiture, participants_avec_voiture, bouton_ajout_voiture, trajets, opacity } = $props();
    let afficheSansVoiture = $state(true);
    let afficheTrajetCoteACote = $state(false);
    let afficheParticipantEnHaut = $state(false);
    let mobile = $state(false);
    $effect(() => {
        mobile = estMobile()
    })
</script>
<TelechargementEtCheckbox bind:afficheSansVoiture bind:afficheTrajetCoteACote bind:afficheParticipantEnHaut {opacity}/>
<div class="zoneListes" style:--trajet-cote-a-cote={afficheTrajetCoteACote ? 'row' : 'column'} style:opacity>
    {#each trajets as typeTrajet}
    <div class="zoneListe" >
    <h2 id="{typeTrajet}" class="bar-text"><span>Trajet {typeTrajet}</span></h2>
    <div class="groupe-liste" 
        style:--participant-en-haut={
            afficheSansVoiture && afficheTrajetCoteACote && mobile ? "column"
                : afficheParticipantEnHaut ? "column" : "row"}
    >
        <div class="zone-participant-sans-voiture"
            style:--sans-voiture={afficheSansVoiture ? 'auto' : '540px'}
            style:--sans-voiture-display={afficheSansVoiture ? 'block' : 'none'}>
                <div class="liste" style:--columncount={
                    (afficheSansVoiture && afficheTrajetCoteACote && !afficheParticipantEnHaut) && !mobile ? 1
                    : (afficheSansVoiture && afficheTrajetCoteACote && afficheParticipantEnHaut) && !mobile ? 4
                    : afficheParticipantEnHaut && !mobile ? 8 
                    : 2}
            >
                <!-- liste sans voitures -->
                {@render participants_sans_voiture(typeTrajet)}
            </div>
        </div>

            <div class="zone-bouton-voitures">
                <div class="groupe-boutons ajouts">
                    <!-- bouton ajout voiture -->
                    {@render bouton_ajout_voiture(typeTrajet)}
                </div>


                <div class="zone-voiture">
                    <!-- liste des voitures -->
                    {@render participants_avec_voiture(typeTrajet)}
                </div>
            </div>
            <!-- <div class="invisible-flex" style:--sans-voiture-display={afficheSansVoiture ? 'block' : 'none'}></div> -->
        </div>
    </div>
{/each}
</div>

<style lang="scss">
    .zoneListes {
        display: flex;
        gap: 1em;
        justify-content: center;
        flex-direction: var(--trajet-cote-a-cote);
        // @media screen and (max-width: 888px) {
            // flex-direction: column;
        // }
    }

    .zoneListe {
        flex: 1;
    }

    .invisible-flex {
        display: var(--sans-voiture-display);
    }

    // :global(.liste) {
        // display: var(--liste) !important;
        // width: auto !important;
    // }

    .zoneListes {
        flex: 1 !important;
        // max-width: none !important;
    }

    .groupe-liste {
        flex-direction: var(--participant-en-haut);
    }

    .zone-participant-sans-voiture {
        max-width: var(--sans-voiture);
        display: var(--sans-voiture-display);
    }

    h2 {
        text-align: center;
    }

        .bar-text {
            display: flex;
            align-items: center;
            border: 1px solid #000;
            padding: 10px;
        }

        .bar-text span {
            flex-grow: 1;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
        }

        .bar-text::before,
        .bar-text::after {
            content: "";
            flex-grow: 1;
            border-top: 1px solid #000;
            margin: 0 10px;
        }

    .groupe-liste {
        display: flex;
        position: relative;
        padding-top: 1%;
        gap: 1em;
        @media screen and (max-width: 480px) {
            gap: 0em;
        }
            // gap: 0.2em;
    }

    .groupe-boutons.ajouts {
        display: flex;
        justify-content: center;
        margin-bottom: 1em;
    }

    .zone-participant-sans-voiture {
        // display: flex;
        justify-content: center;
        // align-items: center;
        padding-bottom: 1em;
        flex:1;
    }

    .liste {
        background-color: white;
        flex: 1;
        position: -webkit-sticky;
        position: -moz-sticky;
        position: -o-sticky;
        position: -ms-sticky;
        position: sticky;
        top: 0;
        width: 100%;
        @media screen and (max-width: 480px) {
            width: 100%;
        }
    }

	:global(.zone-participant-sans-voiture .liste) {
		column-count: var(--columncount);

        @media screen and (max-width: 1600px) {
			column-count: 1;
			.places {
				overflow: auto;
				max-height: 90vh;
			}
		}
	}

    .zone-bouton-voitures {
        display: flex;
        flex-direction: column;
        flex: 3;
        top: 0;
        @media only screen and (max-width: 1490px) {
            position: static;
        }

        @media only screen and (max-width: 768px) {
            flex: 1;
        }
    }

    .zone-voiture {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 1em;
        @media only screen and (max-width: 768px) {
            // margin-bottom: 50vh;
            gap: 1em 0;
            display: flex;
            flex-direction: column;
        }

    }

        .zone-voiture section.places {
            flex-wrap: nowrap;
            flex-direction: column;
        }

    .invisible-flex {
        flex: 1;
        @media only screen and (max-width: 1440px) {
            display: none;
        }        
    }

</style>

<script>
    let { participants_sans_voiture, participants_avec_voiture, bouton_ajout_voiture, typeTrajet } = $props();
</script>

<div class="zoneListes">
<h2 id="{typeTrajet}" class="bar-text" style="opacity: var(--container-opacity)"><span>Trajet {typeTrajet}</span></h2>
<div class="groupe-liste" style="opacity: var(--container-opacity)">
    <div class="zone-participant-sans-voiture">
        <div class="liste">
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
        <!-- <div id="invisible-flex"></div> -->
    </div>
</div>

<style lang="scss">
    h2 {
        text-align: center;
    }

        .bar-text {
            display: flex;
            align-items: center;
            border: 1px solid #000;
            padding: 10px;
            margin-left: 25%;
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
        position: sticky;
        top: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        @media screen and (max-width: 480px) {
            width: 100%;
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
        justify-content: center;
        flex-wrap: wrap;
        gap: 1em;
        @media only screen and (max-width: 768px) {
            // margin-bottom: 50vh;
            gap: 1em 0;
            display: flex;
            flex-direction: column;
        }

    }

        :global(.zone-voiture section.places) {
            flex-wrap: nowrap;
            flex-direction: column;
        }

    #invisible-flex {
        flex: 1;
        @media only screen and (max-width: 1440px) {
            display: none;
        }        
    }

    // .zoneListes {
    //     max-width: 540px;
    // }

</style>

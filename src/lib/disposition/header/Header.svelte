<script>
    import { page } from "$app/stores";
    import { base } from "$app/paths";

    import "./header.scss";
</script>

<header class="header">
    <div class="container">
        <a class="header__lts-home header__link" href="https://latoilescoute.net"
            ><img
                class="header__lts-logo"
                src="/lts-logo-couleur.svg"
                alt="le logo de LaToileScoute représentant une tente canadienne sur une bulle de communication"
            /><span class="header__lts-name">LaToileScoute</span></a
        >
        <h1 class="header__app-title">
            <!-- <img
                class="header__app-logo"
                src="/decodeur-light.svg"
                alt="le logo du décodeur avec deux bulles de communication"
            /> todo: ajouter un icône -->
            Vroum
        </h1>
        <a
            class="header__contact header__link"
            href="https://latoilescoute.net/nous-contacter"
            ><svg class="header__contact-icon" viewBox="0 0 24 24">
                <title>email</title>
                <path
                    d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"
                /></svg
            >Contact</a
        >
    </div>
</header>

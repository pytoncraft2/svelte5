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
                    // console.log(v);
                    // dragDisabled = Device.isMobile || Device.isTablet;
                })
                .catch((e) => console.log(e));
        } else {
            window.location.href = "/";
        }
        console.log(id);
        
	})
</script>

{#if id}
<h1>IIIIIIIIID</h1> 
{:else}
<h2>NO ID</h2>
{/if}

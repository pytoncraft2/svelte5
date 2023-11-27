<style>
    button {
        border: 1px solid hsl(200deg 100% 30% / 51%);
        width: 100%;
    }
    div {
        text-align: center;
    }
</style>

{#if $$props.visible}
    <div>
        <button on:click>
        {$$props.texte}
        </button>
    </div>
{/if}
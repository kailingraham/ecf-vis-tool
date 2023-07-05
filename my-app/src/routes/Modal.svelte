<script>
    import { closeModal } from "svelte-modals";

    // provided by <Modals />
    export let isOpen;

    export let title;
    export let message;
    export let message1;
    export let message2;
    export let step;
    export let customProp;
</script>

{#if isOpen}
    {#if step === -1}:
        <div role="dialog" class="modal1">
            <div class="contents">
                <h2>{title}</h2>
                <p>{message}</p>
                <div class="actions">
                    <button on:click={closeModal}>Close</button>
                </div>
            </div>
        </div>
    {:else if step === 0}:
        <div role="dialog" class="modal1">
            <div class="contents">
                <h2>{title}</h2>
                <p>{message}</p>
                <p>{message1}</p>
                <p>{message2}</p>
                <div class="actions">
                    <button on:click={closeModal}>OK</button>
                </div>
            </div>
        </div>
    {:else if step === 1}:
        <div role="dialog" class="modal1">
            <div class="contents">
                <h2>{title}</h2>
                <p>{message}</p>
                <div class="actions">
                    <button on:click={closeModal}>OK</button>
                </div>
            </div>
        </div>
    {:else if step === 2}:
        <div role="dialog" class="modal1">
            <div class="contents">
                <h2>{title}</h2>
                <p>{message}</p>
                <div class="actions">
                    <button on:click={closeModal}>OK</button>
                </div>
            </div>
        </div>
    {:else if step === 3}:
        <div role="dialog" class="modal1">
            <div class="contents">
                <h2>{title}</h2>
                <p>{message}</p>
                <div class="actions">
                    <button on:click={closeModal}>OK</button>
                </div>
            </div>
        </div>
    {:else if step === 4}:
        <div role="dialog" class="modal2">
            <div class="contents">
                <h2>{title}</h2>
                <p>{message}</p>
                <div class="actions">
                    <button on:click={closeModal}>OK</button>
                </div>
            </div>
        </div>
    {/if}
{/if}

<style>
    .modal1 {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal2 {
        position: absolute;
        top: 50px;
        left: 300px;
        width: 300px;
        display: flex;
        justify-content: center;
        align-items: center;

        /* allow click-through to backdrop */
        pointer-events: none;
        font-family: "Cardo", serif;
    }

    .contents {
        min-width: 240px;
        border-radius: 6px;
        padding: 16px;
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        pointer-events: auto;
        font-family: "Cardo", serif;
    }

    h2 {
        text-align: center;
        font-size: 24px;
        font-family: "Cardo", serif;
    }

    p {
        text-align: justify;
        margin-top: 16px;
        font-family: "Cardo", serif;
    }

    .actions {
        margin-top: 32px;
        display: flex;
        justify-content: flex-end;
    }
</style>

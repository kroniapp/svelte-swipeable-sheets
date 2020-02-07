<div bind:this={backdrop} class="backdrop" smooth={!start} {open} on:click={() => open = false}/>

<div bind:this={dialog} class="root shadow" {fullscreen} smooth={!start}
    on:touchstart={touchStart}
    on:touchmove={touchMove}
    on:touchend={touchEnd}
>
    <slot/>
</div>

<script>
    let dialog;
    let backdrop;
    let start;

    export let fullscreen = false;
    export let open = false;
    export let threshold = 0.3;
    export let backdropOpacity = 0.5;
    export let speed = 0.2;

    const touch = e => e.changedTouches ? e.changedTouches[0] : e;

    const delta = e => start - touch(e).clientY;

    const touchStart = e => start = touch(e).clientY;

    const touchMove = e => {
        if(delta(e) < 0) {
            dialog.style.setProperty('--b', delta(e) + 'px');
            backdrop.style.setProperty('--o', (1 + delta(e) / dialog.clientHeight) * backdropOpacity);
        }
    }

    const touchEnd = e => {
        open = -delta(e) / dialog.clientHeight < threshold;
        start = null;
    };

    $: if(dialog && backdrop) {
        dialog.style.setProperty('--s', speed + 's');
        backdrop.style.setProperty('--s', speed + 's');
    }

    $: if(dialog && backdrop && !start) {
        dialog.style.setProperty('--b', open ? "0px" : -dialog.clientHeight + "px");
        backdrop.style.setProperty('--o', open ? backdropOpacity : 0);
    }
</script>

<style>
    .root {
        position: fixed;
        background-color: #ffffff;
        width: 100vw;
        left: 0px;
        bottom: var(--b, -100%);
        z-index: 7;
    }

    .root[fullscreen=true] {
        height: 100%;
    }

    .root[smooth=true] {
        transition: bottom calc(var(--f, 1) * var(--s, 0s)) ease-in-out;
    }

    .backdrop {
        pointer-events: none;
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100vw;
        height: 100%;
        background-color: #212121;
        opacity: var(--o, 0);
        z-index: 6;
    }

    .backdrop[smooth=true] {
        transition: opacity calc(var(--f, 1) * var(--s, 0s)) ease-in-out;
    }

    .backdrop[open=true] {
        pointer-events: all;
    }

    .shadow {
        box-shadow: 0px -2px 8px #21212144, 0px 0px 2px #21212144;
    }
</style>
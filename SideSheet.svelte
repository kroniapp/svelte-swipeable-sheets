<div bind:this={backdrop} class={"backdrop " + $$props.class} smooth={!start} {open} on:click={() => open = false}/>

<div bind:this={dialog} class="root shadow" smooth={!start}
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

    export let open = false;
    export let threshold = 0.3;
    export let backdropOpacity = 0.5;
    export let speed = 0.2;

    const touch = e => e.changedTouches ? e.changedTouches[0] : e;

    const delta = e => start - touch(e).clientX;

    const touchStart = e => start = touch(e).clientX;

    const touchMove = e => {
        if(delta(e) < 0) {
            dialog.style.setProperty('--b', delta(e) + 'px');
            backdrop.style.setProperty('--o', (1 + delta(e) / dialog.clientWidth) * backdropOpacity);
        }
    }

    const touchEnd = e => {
        open = -delta(e) / dialog.clientWidth < threshold;
        start = null;
    };

    $: if(dialog && backdrop) {
        dialog.style.setProperty('--s', speed + 's');
        backdrop.style.setProperty('--s', speed + 's');
    }

    $: if(dialog && backdrop && !start) {
        dialog.style.setProperty('--b', open ? "0px" : -dialog.clientWidth + "px");
        backdrop.style.setProperty('--o', open ? backdropOpacity : 0);
    }
</script>

<style>
    .root {
        position: fixed;
        background-color: #ffffff;
        width: calc(100vw - 56px);
        height: 100vh;
        top: 0px;
        right: var(--b, -100%);
        z-index: 7;
    }

    .root[smooth=true] {
        transition: right calc(var(--f, 1) * var(--s, 0s)) ease-in-out;
    }

    .backdrop {
        pointer-events: none;
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100vw;
        height: 100vh;
        background-color: #000000;
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
        box-shadow: -2px 0px 8px #21212144, 0px 0px 2px #21212144;
    }
</style>
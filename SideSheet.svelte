<div bind:this={backdrop} class={"backdrop " + $$props.class} class:smooth={!startX} class:open on:click={() => open = false}/>

<div bind:this={dialog} class="root shadow" class:smooth={!startX}
    on:touchstart={touchStart}
    on:touchmove={touchMove}
    on:touchend={touchEnd}
>
    <slot/>
</div>

<script>
    import {touch, deltaX, deltaY} from "./utils";

    let dialog;
    let backdrop;
    
    let startX;
    let startY;
    let direction;

    export let open = false;
    export let threshold = 0.3;
    export let backdropOpacity = 0.5;
    export let speed = 0.2;

    const touchStart = e => {
        startX = touch(e).clientX;
        startY = touch(e).clientY;
    }

    const touchMove = e => {
        if(!direction) {
            direction = Math.abs(deltaY(e, startY)) > Math.abs(deltaX(e, startX)) ? "vertical" : "horizontal";
        }

        if(deltaX(e, startX) < 0 && direction === "horizontal") {
            dialog.style.setProperty('--b', deltaX(e, startX) + 'px');
            backdrop.style.setProperty('--o', (1 + deltaX(e, startX) / dialog.clientWidth) * backdropOpacity);
        }
    }

    const touchEnd = e => {
        if(direction === "horizontal") {
            open = -deltaX(e, startX) / dialog.clientWidth < threshold;
        }
        startX = null;
        direction = null;
    };

    $: if(dialog && backdrop) {
        dialog.style.setProperty('--s', speed + 's');
        backdrop.style.setProperty('--s', speed + 's');
    }

    $: if(dialog && backdrop && !direction) {
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
        overflow-y: auto;
        top: 0px;
        right: var(--b, -100%);
        z-index: 7;
    }

    .root.smooth {
        transition: right calc(var(--f, 1) * var(--s, 0s)) ease-in-out;
    }

    .backdrop {
        pointer-events: none;
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100vw;
        height: 100vh;
        background-color: #212121;
        opacity: var(--o, 0);
        z-index: 6;
    }

    .backdrop.smooth {
        transition: opacity calc(var(--f, 1) * var(--s, 0s)) ease-in-out;
    }

    .backdrop.open {
        pointer-events: all;
    }

    .shadow {
        box-shadow: -2px 0px 8px #21212144, 0px 0px 2px #21212144;
    }
</style>
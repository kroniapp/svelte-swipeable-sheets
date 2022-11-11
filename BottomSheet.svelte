<div bind:this={backdrop} class="backdrop" class:smooth={!startY} class:open on:click={() => open = false}/>

<div bind:this={dialog} class="root shadow" class:fullscreen class:smooth={!startY}
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

    export let fullscreen = false;
    export let open = false;
    export let threshold = 0.3;
    export let backdropOpacity = 0.5;
    export let speed = 0.2;

    const touchStart = e => {
        console.log(e);
        startX = touch(e).clientX;
        startY = touch(e).clientY;
    };

    const touchMove = e => {
        if(!direction) {
            direction = Math.abs(deltaY(e, startY)) > Math.abs(deltaX(e, startX)) ? "vertical" : "horizontal";
        }

        if(deltaY(e, startY) < 0 && direction === "vertical" && dialog.scrollTop == 0) {
            dialog.style.setProperty('--b', deltaY(e, startY) + 'px');
            backdrop.style.setProperty('--o', (1 + deltaY(e, startY) / dialog.clientHeight) * backdropOpacity);
        }
    };

    const touchEnd = e => {
        if(direction === "vertical") {
            open = -deltaY(e, startY) / dialog.clientHeight < threshold;
        }
        startY = null;
        direction = null;
    };

    $: if(dialog) {
        dialog.onscroll = e => dialog.scrollTop == 0 && console.log(window.event);
    }

    $: if(dialog && backdrop) {
        dialog.style.setProperty('--s', speed + 's');
        backdrop.style.setProperty('--s', speed + 's');
    }

    $: if(dialog && backdrop && !direction) {
        dialog.style.setProperty('--b', open
            ? "0px"
            : -dialog.clientHeight + "px"
        );
        backdrop.style.setProperty('--o', open
            ? backdropOpacity
            : 0
        );
    }
</script>

<style>
    .root {
        position: fixed;
        background-color: #ffffff;
        width: 100vw;
        overflow: auto;
        left: 0px;
        bottom: var(--b, -100%);
        z-index: 7;
    }

    .root.fullscreen {
        height: 100%;
    }

    .root.smooth {
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

    .backdrop.smooth {
        transition: opacity calc(var(--f, 1) * var(--s, 0s)) ease-in-out;
    }

    .backdrop.open {
        pointer-events: all;
    }

    .shadow {
        box-shadow: 0px -2px 8px #21212144, 0px 0px 2px #21212144;
    }
</style>
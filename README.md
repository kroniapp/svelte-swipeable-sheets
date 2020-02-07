# Installation

```
npm i -D svelte-swipeable-sheets
```

# Example

## Bottom sheet
```html
<button on:click={() => open = true}>
  Bottom sheet {open ? 'opened' : 'closed'}
</button>

<BottomSheet bind:open>
  Content
</BottomSheet>

<script>
  import BottomSheet from "svelte-swipeable-sheets/BottomSheet";

  let open = false;
</script>
```

## Side sheet
```html
<button on:click={() => open = true}>
  Side sheet {open ? 'opened' : 'closed'}
</button>

<SideSheet bind:open>
  Content
</SideSheet>

<script>
  import SideSheet from "svelte-swipeable-sheets/SideSheet";

  let open = false;
</script>
```
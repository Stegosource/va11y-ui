# truncate

Truncates a string based on provided length.

[Source](https://github.com/Stegosource/vuetensils/blob/master/src/filters.js)

## Installation

Global install:

```js
import Vue from "vue"
import { truncate } from "vuetensils"

Vue.directive("truncate", truncate)
```

Local install:

```html
<script>
  import { truncate } from "vuetensils"

  export default {
    directives: {
      truncate,
    },
  }
</script>
```

## Example

```vue live
<template>
  <div>
    {{ text | truncate }}
  </div>
</template>

<script>
export default {
  computed: {
    text() {
      return "Orion's sword hundreds of thousands cosmic ocean as a patch of light the ash of stellar alchemy quasar. Network of wormholes paroxysm of global death vanquish the impossible kindling the energy hidden in matter hydrogen atoms invent the universe."
    },
  },
}
</script>
```
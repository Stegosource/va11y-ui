# Tabs

Show and hide content based on which tabs are selected.

- [Source](https://github.com/Stegosource/vuetensils/blob/master/src/components/VTabs/VTabs.vue)

Features:

- Manages ARIA roles for `tablist`, `tab`, and `tabpanel`.
- Manages ARIA attributes for `aria-label`, `aria-selected`, `aria-controls`, `aria-labelledby`.
- Provides keyboard navigation to focus on tabs and navigate between with arrow keys.

Keyboard navigation to the tabs only targets active tab. `right` key activates next tab (horizontal orientation) or loops around to start. `left` key activates previous tab (horizontal orientation) or loops around to end. `down` key activates next tab (vertical orientation) or loops around to start. `down` key activates previous tab (vertical orientation) or loops around to end. (in horizontal orientation), `home` key activates first tab. `end` key activates last tab.

## Installation

Globally:

```js
// main.js
import Vue from 'vue';
import { VTabs } from 'vuetensils/src/components';

Vue.component('VTabs', VTabs);
```

Locally:

```vue
<script>
// SomeComponent.vue
import { VTabs } from 'vuetensils/src/components';

export default {
  components: {
    VTabs,
  },
  // ...
};
</script>
```

## Styled Example

```vue live
<template>
  <VTabs class="styled">
    <template slot="Tab 1">
      Here's the content for tab 1.
    </template>

    <template slot="Tab 2">
      Here's the content for tab 2.
    </template>

    <template slot="Tab 3">
      Here's the content for tab 3.
    </template>
  </VTabs>
</template>
```

```css
.vts-tabs {
  overflow: hidden;
  border: 1px solid #CCC;
  border-radius: 0.25rem;
}

.vts-tabs [role="tablist"] {
  display: flex;
}

.vts-tabs [role="tab"] {
  flex-grow: 1;
  border: 0;
  padding: 0.5rem;
}

.vts-tabs [role="tab"][aria-selected="true"] {
  border-bottom-color: #FFF;
  background: #FFF;
}

.vts-tabs [role="tabpanel"] {
  padding: 1rem;
}
```

## Basic Usage

```vue live
<template>
  <VTabs>
    <template slot="Tab 1 label">
      This is my content for tab 1
    </template>

    <template slot="Second tab">
      Here's the content for tab 2.
      <p>It supports markup, and any any other components.</p>
    </template>
  </VTabs>
</template>
```

## Custom Classes

This component can accept a `classes` prop to customize the output HTML classes:

```
:classes="{ root: 'root-class', tablist: 'tablist-class', tab: 'tab-class' }"
```

## Events

The component emits a `tabChange` event when the tab changes from a click or keydown.

Event arguments are passed in an object with the following properties:

- `event`: The original event object
- `tab`: The slot name for the active tab (ie 'Tab Label 1')
- `index`: The active index of the tab

```vue
<template>
  <VTabs @tabChange="tabChanged">
    <template slot="Tab Label 1">
      This is my content for tab 1
    </template>

    <template slot="Tab Label 2">
      Here's the content for tab 2.
      <p>It supports markup, and any any other components.</p>
    </template>
  </VTabs>
</template>

<script>
// SomeComponent.vue
import { VTabs } from 'vuetensils/src/components';

export default {
  components: {
    VTabs,
  },
  methods: {
    tabChanged({ event, tab, index }) {
      if (tab === "Tab Label 1") {
        // Do something
      }
    }
  }
};
</script>
```
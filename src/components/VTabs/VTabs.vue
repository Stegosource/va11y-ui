<template>
  <div v-if="tablist.length" :class="['vts-tabs', classes.root]">
    <div
      role="tablist"
      :aria-label="label"
      :aria-orientation="orientation"
      :class="['vts-tabs__tablist', classes.tablist]"
    >
      <button
        v-for="(tab, index) in tablist"
        :id="`${id}-tab-${index}`"
        :key="tab"
        ref="tab"
        :aria-selected="index === activeIndex"
        :tabindex="index === activeIndex ? false : -1"
        :aria-controls="`${id}-panel-${index}`"
        :class="[`vts-tabs__tab vts-tabs__tab--${index}`, classes.tab]"
        role="tab"
        @keydown="onKeydown($event, tab, index)"
        @click="onClick($event, tab, index)"
      >
        {{ tab }}
      </button>
    </div>

    <div
      v-for="(tab, index) in tablist"
      :id="`${id}-panel-${index}`"
      :key="tab"
      :aria-labelledby="`${id}-tab-${index}`"
      :hidden="index !== activeIndex"
      :class="[`vts-tabs__panel vts-tabs__panel--${index}`, classes.panel]"
      tabindex="0"
      role="tabpanel"
    >
      <slot :name="tab" />
    </div>
  </div>
</template>

<script>
import { randomString } from '../../utils';
import keycodes from '../../data/keycodes';

// const NAME = "vts-tabs"

/**
 * Show and hide content based on which tabs are selected.
 *
 * Implements best practices for accessible tab components based on W3C. Includes HTML5 role attributes (tablist, tab, tabpanel), aria attributes (aria-label, aria-selected, aria-controls, aria-labelledby), and ideal keyboard navigation.
 *
 * Keyboard navigation to the tabs only targets active tab. `right` key activates next tab (horizontal orientation) or loops around to start. `left` key activates previous tab (horizontal orientation) or loops around to end. `down` key activates next tab (vertical orientation) or loops around to start. `down` key activates previous tab (vertical orientation) or loops around to end. (in horizontal orientation), `home` key activates first tab. `end` key activates last tab.
 */
export default {
  name: 'VTabs',

  props: {
    /**
     * Support for aria-label attribute
     */
    label: {
      type: String,
      default: undefined,
    },
    /**
     * Support for aria-orientation attribute
     */
    orientation: {
      type: String,
      default: 'horizontal',
    },

    classes: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    activeIndex: 0,
  }),

  computed: {
    tablist() {
      return Object.keys(this.$slots);
    },
  },

  created() {
    const { id } = this.$attrs;
    this.id = id ? id : `vts-${randomString(4)}`;
  },

  methods: {
    onClick(event, tab, index) {
      if (this.activeIndex !== index) {
        this.$nextTick(() => this.$emit('tabChange', { event, tab, index }));
      }
      this.activeIndex = index;
    },
    onKeydown(event, tab, index) {
      const { keyCode } = event;
      const oldIndex = this.activeIndex;
      switch (keyCode) {
        case keycodes.END:
          event.preventDefault();
          this.activeIndex = this.tablist.length - 1;
          this.setFocus();
          break;
        case keycodes.HOME:
          event.preventDefault();
          this.activeIndex = 0;
          this.setFocus();
          break;
        // Up and down are in keydown because we need to prevent page scroll >:)
        case keycodes.LEFT:
        case keycodes.RIGHT:
        case keycodes.UP:
        case keycodes.DOWN:
          this.determineOrientation(event);
          break;
      }

      if (oldIndex !== this.activeIndex) {
        this.$nextTick(() => this.$emit('tabChange', { 
          event, 
          tab: this.tablist[this.activeIndex], 
          index: this.activeIndex 
        }));
      }
    },

    // When a tablist's aria-orientation is set to vertical, only up and down arrow should function. In all other cases only left and right arrow function.
    determineOrientation(event) {
      const keyCode = event.keyCode;
      let proceed = false;
      if (this.orientation === 'vertical') {
        if (keyCode === keycodes.UP || keyCode === keycodes.DOWN) {
          event.preventDefault();
          proceed = true;
        }
      } else {
        if (keyCode === keycodes.LEFT || keyCode === keycodes.RIGHT) {
          proceed = true;
        }
      }
      if (proceed) {
        this.switchTabOnArrowPress(event);
        this.setFocus();
      }
    },

    // Either focus the next, previous, first, or last tab depening on key pressed
    switchTabOnArrowPress(event) {
      const keyCode = event.keyCode;
      const directions = {
        [keycodes.LEFT]: -1,
        [keycodes.UP]: -1,
        [keycodes.RIGHT]: 1,
        [keycodes.DOWN]: 1,
      };

      /* istanbul ignore next */
      if (!directions[keyCode]) return;

      const activeIndex = this.activeIndex;
      const tabLength = this.$refs.tab.length;
      const nextIndex = activeIndex + directions[keyCode];

      if (nextIndex < 0) {
        this.activeIndex = tabLength - 1;
      } else if (nextIndex >= tabLength) {
        this.activeIndex = 0;
      } else {
        this.activeIndex = nextIndex;
      }
    },

    setFocus() {
      this.$refs.tab[this.activeIndex].focus();
    },
  },
};
</script>

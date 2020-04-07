<template>
  <div :class="['vts-img', classes.root]">
    <div
      ref="placeholder"
      v-if="placeholder || dataUrl"
      :class="['vts-img__placeholder', classes.placeholder]"
      :style="{ background }"
    >
      <img
        :src="placeholder || dataUrl"
        v-bind="$attrs"
        :class="classes.img"
        alt=""
      />
    </div>
    <img
      ref="img"
      :src="dataUrl"
      :class="['vts-img__img', classes.img]"
      :alt="$attrs.alt || ''"
      :style="{
        transitionDuration: `${transitionDuration}ms`
      }"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
const NAME = 'vts-img'

/**
 * Drop in replacement for the HTML `<img>` tag which supports lazy-loading. Improves load times by waiting for the image to scroll into view before actually downloading it.
 *
 Note: This component uses [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) which is not supported by Internet Explorer.
 */
export default {
  inheritAttrs: false,
  // functional: true, // TODO

  props: {
    /**
     * Same as the HTML attribute
     */
    src: {
      type: String,
      required: true
    },
    /**
     * Same as the HTML attribute
     */
    srcset: {
      type: String,
      default: ''
    },
    /**
     * URL of the blurred placeholder image to use if you need one (ideally a very small image).
     */
    placeholder: {
      type: String,
      default: ''
    },
    /**
     * CSS background styles for the placeholder in case you just want colors.
     */
    background: {
      type: String,
      default: ''
    },

    transitionDuration: {
      type: [Number, String],
      default: 3000
    },

    classes: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    dataUrl() {
      if (typeof document !== 'undefined') {
        return false
      }
      const { width, height } = this.$attrs
      if (!width || !height) return ''

      const w = 100
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = (height / width) * w

      return canvas.toDataURL()
    }
  },

  watch: {
    src: {
      handler: 'init'
    },
    srcset: {
      handler: 'init'
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.observer = new IntersectionObserver(this.handler)
      this.observer.observe(this.$el)

      this.$once('hook:beforeDestroy', () => {
        this.observer.disconnect()
      })
    },

    handler([entry]) {
      const { $el } = this

      if (entry.isIntersecting) {
        // Element is in viewport
        $el.classList.add(`${NAME}--loading`)
        this.loadImg()
        this.observer.disconnect()
      }
    },

    loadImg() {
      const { src, srcset } = this
      const { img } = this.$refs

      img.addEventListener('load', this.onLoad)

      if (srcset) {
        img.srcset = srcset
      }
      img.src = src
    },

    onLoad() {
      const { $el } = this
      const { img, placeholder } = this.$refs

      $el.classList.remove(`${NAME}--loading`)
      $el.classList.add(`${NAME}--loaded`)

      if (placeholder) {
        img.addEventListener('transitionend', function onTransitionEnd() {
          placeholder.remove()
          img.removeEventListener('transitionend', onTransitionEnd)
        })
      }

      img.removeEventListener('load', this.onLoad)
    }
  }
}
</script>

<style>
.vts-img {
  display: inline-block;
  position: relative;
}

.vts-img img {
  vertical-align: top;
}

.vts-img__placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.vts-img__placeholder img {
  transform: scale(1.05);
  filter: blur(10px);
}

.vts-img__img {
  opacity: 0;
  transition-property: opacity;
  transition-timing-function: ease;
}

.vts-img--loaded .vts-img__img {
  opacity: 1;
}
</style>

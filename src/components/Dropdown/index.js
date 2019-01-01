import "./styles.css";

const NAME = "vts-dropdown";

export default {
  name: NAME,

  data: () => ({
    isHovered: false,
    isFocused: false,
  }),

  methods: {
    onClickout (e) {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false;
      }
    }
  },

  mounted () {
    document.addEventListener("click", this.onClickout);
  },

  destroyed () {
    document.removeEventListener("click", this.onClickout);
  },

  render (create) {
    const button = create("button",
      {
        attrs: {
          'aria-haspopup': true,
          'aria-expanded': (this.isHovered || this.isFocused) ? 'true' : 'false'
        },
        on: {
          click: () => {
            this.isFocused = !this.isFocused
          }
        }
      },
      'button'
    );

    let content = create(false)
    if (this.isHovered || this.isFocused) {
      content = create("div",
        {
          class: `${NAME}__content`,
          attrs: {
            // 'aria-label': "submenu"
          }
        },
        [this.$slots.default]
      );
    }

    return create("div",
      {
        class: NAME,
        on: {
          mouseover: () => {
            this.isHovered = true
          },
          mouseleave: () => {
            this.isHovered = false
          },
          focusout: event => {
            if (!this.$el.contains(event.relatedTarget)) {
              this.isFocused = false
            }
          }
        }
      },
      [button, content]
    );
  }
};
<!-- Allow KaTeX to Format Math -->

<template>
  <span class="math">
    <slot></slot>
  </span>
</template>

<script>
export default {
  mounted: function () {
    katex.render(this.$el.textContent, this.$el);
  },
};
</script>

<template>
  <svg class="icon f18" aria-hidden="true" :title="title">
    <use :xlink:href="xlinkHref" :class="className"></use>
  </svg>
</template>

<script>
export default {
  props: {
    className: {
      type: [String, Object],
      default: ''
    },
    href: String,
    title: String
  },
  computed: {
    xlinkHref () {
      return `#${this.href}`
    }
  }
}
</script>

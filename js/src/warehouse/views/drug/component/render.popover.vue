<template>
  <el-popover
    :placement="placement"
    :title="title"
    :width="width"
    v-model="value"
    :trigger="trigger">
    <template v-if="newContent">
      <div v-html="newContent"></div>
    </template>
    <template v-if="content">
      <div v-html="content"></div>
    </template>
    <template v-if="innerHTML" slot="reference">
      <div v-html="innerHTML"></div>
    </template>
    <svg v-else class="icon f18 cur" aria-hidden="true" slot="reference" @click="click">
      <use :xlink:href="xlinkHref"></use>
    </svg>
  </el-popover>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 200
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    placement: {
      type: String,
      default: 'right'
    },
    title: String,
    content: String,
    innerHTML: String,
    href: String
  },
  computed: {
    xlinkHref () {
      return `#${this.href}`
    }
  },
  data () {
    return {
      newContent: '',
      value: false // popover弹窗 关闭or打开
    }
  },
  methods: {
    click () {
      this.$emit('click', this)
    }
  },
}
</script>

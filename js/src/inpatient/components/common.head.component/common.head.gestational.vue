<template>
  <span>
    <span class="common-head-def-label">{{itemConfig.paramValue}}：</span>
    <span class="common-head-def-value">
      孕{{parsedValue['周'] || '--'}}
          <sup v-if="parsedValue['天']">+{{parsedValue['天'] || '0'}}</sup>周
    </span>
  </span>
</template>
<script>
  export default {
    props: {
      itemConfig: {
        type: Object,
      },
      itemData: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    data () {
      return {}
    },
    methods: {
    },
    computed: {
      parsedValue () {
        return this.itemConfig.value ? JSON.parse(this.itemConfig.value) : {}
      }
    }
  }
</script>
<style></style>

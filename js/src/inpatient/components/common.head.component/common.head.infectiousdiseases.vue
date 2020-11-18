<template>
  <span>
    <el-tooltip effect="dark" :content="parsedValue || '--'" placement="top">
      <i class="icon iconfont icon-chuanranbing2 common-head-icon-infectious"></i>
    </el-tooltip>
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
    methods: {},
    computed: {
      parsedValue () {
        let res = ''
        if (this.itemConfig.value) {
          res = JSON.parse(this.itemConfig.value)
          if (res[0]) {
            return res.map(item => item.diseaseName || '').filter(item => item).join('；')
          }
        }
        return res
      }
    },
  }
</script>
<style></style>

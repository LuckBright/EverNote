<template>
  <span>
  <el-button
    :size="size"
    :type="btnType || 'primary'"
    @click="tackMeToDownload()"
  >{{btnTxt || '导出'}}</el-button>
  <a v-for="(item,index) in list" :key="index" :href="item.url" v-show="false" :ref="'aDownload' + index" :download="item.downFile"></a>
  </span>
</template>

<script>

export default {
  props: ['value', 'size', 'btnTxt', 'exportType', 'btnType', 'list'],
  data () {
    return {
      loading: false,
      downFile: ''
    }
  },
  methods: {
    tackMeToDownload () {
      this.$emit('downFile', this.exportType || 1)
    },
    downfile (list) {
      list.forEach((item, index) => {
        setTimeout(() => {
          this.$refs['aDownload' + index][0].click()
          this.$emit('exportStatus')
        }, 1000 + index * 1000)
      })
    }
  }
}
</script>

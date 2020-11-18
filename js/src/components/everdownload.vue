<template>
  <el-button
    :size="size"
    :type="btnType || 'primary'"
    @click="tackMeToDownload()"
  >{{btnTxt || '导出'}}</el-button>
</template>

<script>
export default {
  props: ['value', 'size', 'btnTxt', 'exportType', 'btnType', 'fileId'],
  data () {
    return {
      loading: false,
      downUrl: '',
      downFile: ''
    }
  },
  computed: {
    url () {
      return this.$ever.fileUrl2 + this.fileId
    }
  },
  methods: {
    tackMeToDownload () {
      this.$emit('downFile', this.exportType || 1)
    },
    downfile (fileUrl) {
      this.downFile = fileUrl
      this.downUrl = this.$ever.fileUrl + fileUrl
      const tmpId = new Date().getTime()
      const a = document.createElement('a')
      a.setAttribute('id', tmpId)
      a.setAttribute('download', '')
      a.setAttribute('target', '_self')
      a.setAttribute('href', this.downUrl)
      document.body.appendChild(a)
      a.click()
      window.setTimeout(_ => {
        a.parentNode.removeChild(a)
      }, 1000)
      this.$emit('exportStatus')
    }
  }
}
</script>

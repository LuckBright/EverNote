<template>
  <div class="layout_inner">
    下载文件
    <doc-download @downFile="downFile" :exportType="3" ref="childMethods" btnTxt="导出盘点报告"></doc-download>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    downFile () {
      // 想尽一切办法拿到下载的url
      let fileurl = this.$ever.fileUrl2 + '6hxeBYja4aIdWCbSrRA'
      this.$refs.childMethods.downfile(fileurl)
    },
  },
}
</script>

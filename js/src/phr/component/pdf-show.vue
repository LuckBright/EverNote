<template>
  <div class="pdf">
    <div v-for="i in numPages" :key="i">
      <pdf
        :key="i"
        :src="pdfUrl"
        :page="i">
      </pdf>
    </div>
  </div>
</template>
<script>
import pdf from 'vue-pdf'

export default {
  components: {
    pdf
  },
  data () {
    return {
      numPages: 0, // pdf文件总页数
      fileType: 'pdf', // 文件类型
      pdfUrl: '',
    }
  },
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  created () {
    if (this.url !== '') {
      this.pdfUrl = this.url
    }
    // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
    setTimeout(() => {
      this.pdfTask(this.pdfUrl)
    }, 100)
  },
  watch: {
    url (val) {
      if (val !== '') {
        this.pdfUrl = val
        setTimeout(() => {
          this.pdfTask(this.pdfUrl)
        }, 100)
      }
    }
  },
  methods: {
    pdfTask (pdfUrl) {
      let loadingTask = pdf.createLoadingTask(pdfUrl)
      loadingTask.promise.then(pdf => {
        // this.pdfUrl = loadingTask
        this.numPages = pdf.numPages
      }).catch(() => {
        console.error('pdf加载失败')
      })
    },
  }
}
</script>
<style lang="less">
  .pdf{
    width: 100%;
    span{
      width: 100%;
    }
  }
</style>

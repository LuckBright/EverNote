<template>
  <el-dialog
    title=""
    width="440px"
    :visible.sync="dialogVisible"
    class="ui_dialog_02"
    :close-on-click-modal="true"
    center
  >
    <div style="height:400px;">
      <el-col align="center">
        <img :src="$ever.fileUrl2 + fileId" alt="" class="imgStyle">
      </el-col>
      <el-col class="mt20">
        <el-button type="primary" @click="donwload()">下载</el-button>
      </el-col>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    fileId: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
    }
  },
  created () {
  },
  methods: {
    open () {
      this.dialogVisible = true
    },
    downloadIamge (imgsrc, name) { // 下载图片地址和图片名
      var image = new Image()
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据

        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
    },
    donwload () {
      this.downloadIamge(this.$ever.fileUrl2 + this.fileId, this.fileName)
    }
  }
}
</script>
<style lang="scss" scoped>
  .imgStyle{width: 340px; height: 340px;}
</style>

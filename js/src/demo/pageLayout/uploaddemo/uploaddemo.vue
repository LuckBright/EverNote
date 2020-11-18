<template>
  <div class="layout_inner">
    <el-row>
      <el-col :span="24">
        <h3>基础图片上传组件</h3>
        <pre>组件：<code>&lt;base-upload-img-demo&gt;</code></pre>
        <p>上传文件或者图片</p>
        <base-upload-img-demo></base-upload-img-demo>
      </el-col>
      <el-col :span="24">
        <h3>基础上传组件</h3>
        <pre>组件：<code>&lt;base-upload-demo&gt;</code></pre>
        <p>上传文件或者图片</p>
        <base-upload-demo></base-upload-demo>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import baseUploadDemo from './demo/baseuploaddemo'
import baseUploadImgDemo from './demo/baseuploadimgdemo'

export default {
  components: {
    baseUploadDemo,
    baseUploadImgDemo
  },
  data () {
    return {
    }
  }
}
</script>

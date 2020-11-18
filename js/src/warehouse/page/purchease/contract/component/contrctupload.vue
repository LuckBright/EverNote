<template>
  <div>
    <el-upload
      class="upload-demo"
      :action="action"
      :headers="headers"
      :limit="10"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
import upconfig from '@/components/everuploadconfig'

export default {
  mixins: [upconfig],
  data () {
    return {
      fileList: [],
    }
  },
}
</script>

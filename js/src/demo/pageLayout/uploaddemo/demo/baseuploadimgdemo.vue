<template>
  <div>
    <div class="layout_inner">
      <div class="panel-body">
        <el-row>
          <el-col>
            单图：img:{{img}}
            <ever-upload1 v-model="img" :limit="1" @success="handleSuccess" :tipsFlag="true"></ever-upload1>
          </el-col>
        </el-row>
        <hr>
        <el-row>
          <el-col>
            多图：imgs:{{imgs}}
            <ever-upload1 v-model="imgs" :limit="5" @success="handleSuccess"></ever-upload1>
          </el-col>
        </el-row>
        <hr>
        <el-row>
          <el-col>
            文件doc:{{doc}}
            <ever-upload1 v-model="doc" type="doc" @success="handleSuccess"></ever-upload1>
          </el-col>
        </el-row>
        <hr>
        <el-row>
          <el-col>
            文件doc1: 不显示上传文件列表{{doc1}}
            <ever-upload1 v-model="doc1" type="doc" :tipsFlag="true" @success="handleSuccess" :showFileList="false">
              <div slot="tip" class="tttt">
                fsduifasiofausofidasuf
              </div>
            </ever-upload1>
          </el-col>
        </el-row>
        <hr>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      testurl: this.$ever.fileUrl + this.$ever.filePath + 'I3z7Mx5diRsmhJMgsIA',
      // img: '',
      img: 'DMLxYwAu08Gg61RhRdf',
      // imgs: '',
      imgs: 'I3z7Mx5diRsmhJMgsIA,zqvrV59yMBiGxbz2afD,pzGP9xuuOQ844izAqSN',
      // doc: '',
      doc: 'qR5NjM41UArHKrhuh76',
      doc1: ''
    }
  },
  created () {
  },
  methods: {
    handleSuccess (data) {
      console.log(data)
    }
  },
}
</script>

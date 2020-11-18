<template>
  <div class="station_layout_wrap buildinfo_wrap">
    <div class="layout_inner">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <b>打印插件</b>
            </div>
            <div class="text item">
              <p>当前版本：{{printVer}} <el-button type="primary" @click="getAbout()">查看详细信息</el-button></p>
              <p>下载地址：<el-button type="primary" @click="downJcp()">下载</el-button></p>
            </div>
          </el-card>
        </el-col>
        <!-- <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <b>身份证读卡器</b>
            </div>
            <div class="text item">
              <p>当前版本：{{ver}}</p>
              <p>下载地址：<el-button type="primary">下载</el-button></p>
            </div>
          </el-card>
        </el-col> -->
      </el-row>
    </div>
  </div>
</template>

<script>
import jcp from 'jcpjs'

export default {
  data () {
    return {
      printVer: '',
      ver: ''
    }
  },
  created () {
    var _this = this
    jcp.getJCP().getVersion(function (version) {
      window.setTimeout(_ => {
        _this.printVer = version
      }, 1000)
    })
  },
  methods: {
    getAbout () {
      jcp.getJCP().about()
    },
    downJcp () {
      window.location.href = this.$ever.fileUrl2 + 'liliMj6V26vYwX7R826'
    },
  }
}
</script>

<template>
  <div class="layout_inner">
    <div class="main-head">
      <div class="main-option">
        当前打印插件版本号为：{{printVer}}
        <el-button type="primary" @click="getAbout()">查看当前打印插件详细信息</el-button>
        <el-button
          type="primary"
          @click="$router.push({ name: 'printerset', params: { id: -1 }})"
        >新建</el-button>
      </div>
      <el-table v-loading.body="loading" :data="tableData" :border="false" :stripe="false">
        <el-table-column label="报表名称" align="center" prop="name"></el-table-column>
        <el-table-column label="备注" align="center" prop="msg"></el-table-column>
        <el-table-column prop label="操作" width="150" align="center">
          <template slot-scope="scope">
            <ever-confirm
              :msg="'确定删除 “'+scope.row.name+'” 的打印配置吗？'"
              action="删除"
              @confirm="removePrinterset(scope.row.name)"
            ></ever-confirm>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import api from '@/warehouse/store/printersetapi'
import jcp from 'jcpjs'

export default {
  mixins: [list],
  data () {
    return {
      api,
      options: [],
      printer: '',
      printVer: ''
    }
  },
  created () {
    this.list()
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
    list (queryObj) {
      jcp.getJCP().getSettingsIds(settings => {
        var _arr = []
        settings.forEach((item, index) => {
          _arr.push({
            name: item,
            msg: '注册表内容，请在注册表内查看，运行内输入 regedit查看'
          })
        })
        this.tableData = _arr
      })
    },
    removePrinterset (code) {
      jcp.getJCP().clearSettings(code, result => {
        if (result) {
          this.$messageTips(this, 'success', '删除成功', '提示')
          this.list()
        }
      })
    }
  }
}
</script>

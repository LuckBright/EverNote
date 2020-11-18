<template>
  <div class="treat_log">
    <el-dialog
      title="操作记录"
      :visible.sync="dialogVisible"
      :patient='patient'
      width="700">
        <el-table :data="logs" max-height='310px' class="treat_log_table">
        <el-table-column property="operatorName" label="操作人"></el-table-column>
        <el-table-column property="operationItem" label="操作类型"></el-table-column>
        <!-- <el-table-column property="operationDetails" label="操作内容">
            <template slot-scope="scope">
            <a v-if='scope.row.operationDetails && scope.row.operationDetails.url' :href='$ever.fileUrl2 +  scope.row.operationDetails.fileId' target='_blank'>
                {{scope.row.operationDetails.relName}}
            </a>
            <span v-else v-html='scope.row.operationDetails' class="loghtml"></span>
            </template>
        </el-table-column> -->
        <el-table-column property="createTime" label="操作时间">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDateByExp("YYYY-MM-DD HH:mm")}}
          </template>
        </el-table-column>
        </el-table>
        <div slot="reference" @click='getAllLog(item)'><i class="icon iconfont icon-caozuorizhi"></i>操作记录</div>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/infusion/store/infusion.js'
// import {isJsonString} from '@/util/common'
export default {
  props: ['item', 'li', 'IsEncounterByTriageId'],
  data () {
    return {
      api,
      logs: [],
      dialogVisible: false,
      patient: null
    }
  },
  methods: {
    async getAllLog (item) {
      this.logs = []
      let res = await this.api.getTechOpLog({
        executeId: this.ids.join(''),
        offset: 0,
        pagesize: 1000
      })
      this.logs = res.data || []
      this.logs.forEach(item => {
        // if (isJsonString(item.operationDetails)) {
        //   item.operationDetails = JSON.parse(item.operationDetails)
        // } else {
        //   item.operationDetails = item.operationDetails || ''
        // }
      })
    },
    open (patient, ids) {
      this.patient = patient
      this.ids = ids
      this.dialogVisible = true
      this.getAllLog()
    }
  }
}
</script>
<style lang="scss" scoped>
.treat_log_table{
    &::before{
      height: 0;
    }
    /deep/ .el-table__empty-block {
      border-bottom: 1px solid #ccc;
  }
}
.loghtml{
  /deep/ i{
    font-style: normal;
  }
}
.treat_log {
    float: right;
    padding-right: 5px;
    cursor: pointer;
    color: #666;
    font-size: 14px;
    i{
        vertical-align: middle;
        font-size: 13px;
        color:#666;
        padding-right: 3px;
    }
}
</style>


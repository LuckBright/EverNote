<template>
  <div class="vouch">
    <div class="layout_inner">
      <div class="panel-body">
        <h4>机构信息</h4>
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="searchlist"></ever-query-form>
        <h4 class="panel-hr">单据类型</h4>
        <el-table
          :data="parTableData"
          style="width: 100%"
          highlight-current-row
          @current-change="handleRadioChange"
        >
          <el-table-column prop label="单选" align="center">
            <template slot-scope="scope">
              <el-radio-group v-model="selectRadio">
                <el-radio class="radio" :label="scope.row.id">选择</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column prop="module" label="模块" align="center">
            <template slot-scope="scope">{{returnName(scope.row.module, module)}}</template>
          </el-table-column>
          <el-table-column prop="bills" label="单据" align="center">
            <template slot-scope="scope">
              <sys-value type="THC_RCM_RULES_BILL" :code="scope.row.bills"></sys-value>
            </template>
          </el-table-column>
          <el-table-column prop="tradeTypeName" label="类型" align="center"></el-table-column>
          <el-table-column prop label="确认事件" align="center"></el-table-column>
          <el-table-column prop="relaWithOther" label="和新建账单关系" align="center">
            <template
              slot-scope="scope"
            >{{relaWithOther[scope.row.relaWithOther] && relaWithOther[scope.row.relaWithOther].name}}</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column prop="reverse" label="冲销方式" align="center"></el-table-column>
        </el-table>
        <h4 class="panel-hr">模版分录</h4>
        <voucher-entries
          :tradeType="tradeType"
          :id="id"
          :tableData="tableData"
          v-loading="temLoading"
        ></voucher-entries>
      </div>
      <!-- <div class="panel-footer">
        <el-button type="primary" @click.native.prevent="createRules()">保存</el-button>
        <upload-file v-if="queryObj.id && queryObj.module" @success="uploadSuccess" previewInline="true" uploadApiType="ucloud" maxNum="1" btnTxt="上传"></upload-file>
        <doc-download @downFile="downFile" v-if="queryObj.id && queryObj.module" ref="downloadfile"></doc-download>
      </div>-->
    </div>
  </div>
</template>
<script>
import {
  getClinicInfo,
  getList,
  initRule,
  getListByClinicId,
  getModuleTypeEnum,
  get
} from '../store/voucherEntries'
import voucherEntries from './voucherEntries'
var schema = [
  {
    name: 'clinicid',
    label: '医疗机构名称',
    type: 'text',
    disabled: true
  },
  {
    name: 'id',
    label: '账套名称',
    type: 'text',
    disabled: true
  },
  {
    name: 'module',
    label: '模块',
    type: 'select',
    options: []
  }
]
export default {
  components: {
    voucherEntries
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      module: [],
      temLoading: false,
      tableData: [],
      parTableData: [],
      itemTableData: [],
      createObj: {},
      selectRadio: '',
      tradeType: '',
      id: '',
      relaWithOther: [{ id: 0, name: '合并' }, { id: 1, name: '不合并' }]
    }
  },
  methods: {
    // 获取当前机构
    async getCurrentClinc () {
      try {
        let data = await getClinicInfo()
        this.queryObj.clinicid = data.data.name
      } catch (err) { }
    },
    // 获取账套
    async getByClincId () {
      try {
        let data = await getListByClinicId({})
        data.data.forEach((item, index) => {
          item.name = item.setOfBooksName
          if (item.hostSetOfBook) {
            this.queryObj.setOfBooksId = item.id
            this.queryObj.id = item.setOfBooksName
          }
        })
      } catch (err) { }
    },
    // 获取模块
    async tradeTypeEnum () {
      try {
        let result = await getModuleTypeEnum()
        let option = []
        result.data.forEach(v => {
          for (let key in v) {
            option.push({
              id: key,
              name: v[key]
            })
          }
        })
        this.module = option
        this.$ever.getFieldFromSchema(
          this.querySchema,
          'module'
        ).options = option
      } catch (err) { }
    },
    async searchlist () {
      try {
        let params = {
          setOfBooksId: this.queryObj.setOfBooksId
        }
        let searchParams = {
          setOfBooksId: this.queryObj.setOfBooksId,
          module: this.queryObj.module
        }
        await initRule(params)
        let data = await getList(searchParams)
        this.parTableData = data.data
        this.selectRadio = ''
      } catch (err) { }
    },
    returnName (id, arr) {
      let name = ''
      arr.forEach(function (item) {
        if (parseFloat(id) === parseFloat(item.id)) {
          name = item.name
        }
      })
      return name
    },
    async createRules () {
      this.parTableData.forEach((v, index) => {
        v.index = index
      })
    },
    async handleRadioChange (row) {
      this.tableData = []
      if (row && row.tradeType) {
        this.tradeType = row.tradeType
        this.id = row.id
        try {
          let params = {
            id: row.id
          }
          this.temLoading = true
          let data = await get(params)
          if (data.data.details.length > 0) {
            let getTableData = data.data.details
            getTableData.forEach(v => {
              v.statistics = []
              if (JSON.parse(v.statisticsDimension)) {
                for (let key in JSON.parse(v.statisticsDimension)) {
                  v.statistics.push({
                    name: '',
                    key: '',
                    value: key,
                    calcuName: JSON.parse(v.statisticsDimension)[key]
                  })
                }
              }

              this.tableData.push({
                id: v.id,
                project: v.project,
                lendingDirection: v.lendingDirection === false ? 0 : 1,
                symbol: v.symbol === false ? 0 : 1,
                subject: {
                  id: v.valueId,
                  accountName: v.inputProject,
                  accountCode: v.value,
                  statisticsDimension: v.statisticsDimension
                },
                statistics: v.statistics
              })
            })
          } else {
            this.tableData = [
              {
                // 单据项目
                project: '',
                // 借贷方
                lendingDirection: '',
                // 正负号
                symbol: '',
                // 对应科目
                value: '',
                valueId: '',
                inputProject: '',
                // 辅助核算
                statisticsDimension: [],
                // 科目对象
                subject: '',
                // 辅助核算对象
                statistics: []
              }
            ]
          }
          this.temLoading = false
        } catch (err) {
          this.temLoading = false
        }
      }
    }
  },
  created () {
    this.getCurrentClinc()
    this.getByClincId()
    this.tradeTypeEnum()
  }
}
</script>
<style scoped>
.vouch /deep/ .el-table__body-wrapper {
  max-height: 300px;
  overflow-x: hidden;
}
.vouch /deep/.el-dialog__header .el-dialog__title {
  font-size: 18px;
  color: #000;
  border-left: 0;
  padding-left: 0;
  margin: 0;
}
.panel-body{
  padding-top:5px;
}
.panel-body h4{
  margin-block-start: 0;
}
</style>


<template>
  <div :class="{ layout_inner: true }">
    <ever-form2 v-model="form" ref="form" :schema="schema" :inline="true">
      <template slot="default">
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" @click="createSys" :loading="loading"
            >新建</el-button
          >
          <el-button type="primary" @click="resetData" :disabled="disabled"
            >重置数据</el-button
          >
        </el-form-item>
      </template>
    </ever-form2>
    <ever-table
      :fixedHeight="80"
      :is-auto-height="true"
      ref="table"
      :columns="columns"
      :url="url"
      :params.sync="form"
      :maxBtnCount="5"
      @del="del"
      @edit="edit"
      @log-list="logList"
      @manu-execute="manuExecute"
      @select="select"
      @select-all="select"
      @view="viewContent"
      show-checkbox
    >
      <template slot="errMsg">
        <el-table-column label="错误信息" prop="errMsg">
          <template slot-scope="scope">
            <el-tooltip placement="bottom" v-if="scope.row.errMsg != '-1'">
              <div class="error_content" slot="content">
                错误信息
                <br />
                <div v-html="scope.row.errMsg"></div>
              </div>
              <div class="over-text" v-html="textFormatter(scope.row.errMsg)">
                {{ textFormatter(scope.row.errMsg) }}
              </div>
            </el-tooltip>
            <div class="over-text" v-else>
              {{ textFormatter(scope.row.errMsg) }}
            </div>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <el-dialog
      v-if="editDialog"
      :visible.sync="editDialog"
      :close-on-click-modal="false"
      append-to-body
      title="数据交互配置"
    >
      <ever-form2
        v-model="editForm"
        ref="editForm"
        label-width="130px"
        :schema="editSchema"
        :nosubmit="true"
        :rules="editRules"
      >
        <template slot="channelDatasourceTypeCode">
          <el-select
            v-model="editForm.channelDatasourceTypeCode"
            placeholder="数据源类型"
            :clearable="false"
            :disabled="!typeList.length"
          >
            <el-option
              v-for="item in typeList"
              :key="item.channelDatasourceTypeCode"
              :label="item.channelDatasourceTypeCode"
              :value="item.channelDatasourceTypeCode"
            >
            </el-option>
          </el-select>
        </template>
      </ever-form2>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="save" type="primary">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="logShow"
      :close-on-click-modal="false"
      append-to-body
      title="日志列表"
      width="80vw"
    >
      <ever-table
        :columns="logColumns"
        :params.sync="logForm"
        :url="`/thc-data/dataSwitchingLog/pageList`"
      >
        <template slot="logDesc">
          <el-table-column label="日志详情" prop="logDesc" width="600">
            <template slot-scope="scope">
              <el-tooltip placement="bottom">
                <div class="error_content" slot="content">
                  详情
                  <br />
                  <div v-html="scope.row.logDesc"></div>
                </div>
                <div class="over-text">
                  {{ textFormatter(scope.row.logDesc) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>
      </ever-table>
    </el-dialog>
    <el-dialog
      :visible.sync="manuShow"
      :close-on-click-modal="false"
      append-to-body
      title="手动执行"
    >
      <el-form label-position="left" inline ref="ruleForm">
        <el-form-item label="运行类型">
          <el-select v-model="manuType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          required
          v-show="manuType === '1'"
          label="创建时间执行周期(分钟)"
        >
          <el-input
            type="number"
            v-model="createTime"
            :clearable="false"
          ></el-input>
        </el-form-item>
        <el-form-item required v-show="manuType === '2'" label="运行时间">
          <el-date-picker
            v-model="runTime"
            type="datetime"
            placeholder="选择日期时间"
            :clearable="false"
            :value-format="`yyyy-MM-dd HH:mm:ss`"
            default-time="23:59:59"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manuShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm" :disabled="exeDisabled"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="viewShow"
      :close-on-click-modal="false"
      append-to-body
      title="视图"
    >
      <ever-form2
        v-model="viewForm"
        ref="view"
        :schema="viewSchema"
        :nosubmit="true"
        :rules="viewRules"
      ></ever-form2>
      <div class="ml57" v-show="viewRes">执行结果: {{ viewRes }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmView">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/util/req'
import urls from '@/systemset/urls'
const dataswitch = urls.dataswitch
const schema = [
  {
    name: 'jobName',
    label: '任务名字',
  },
  {
    name: 'tableName',
    label: '目标数据表',
  },
  {
    name: 'viewName',
    label: '来源视图',
  },
  {
    name: 'runStatus', // 0:可以执行，1:执行中，2:不再执行
    label: '运行状态',
    comp: 'select',
    props: {
      options: [
        {
          id: '0',
          name: '可以执行'
        },
        {
          id: '1',
          name: '执行中'
        }
      ],
    }
  },
  {
    name: 'jobStatus',
    label: '任务状态',
    comp: 'select',
    props: {
      options: [
        {
          id: '0',
          name: '暂停'
        },
        {
          id: '1',
          name: '开始'
        }
      ],
    }
  },
  {
    name: 'typeCode',
    label: '通道code',
    comp: 'select',
    props: {
      options: [
        {
          id: 'thc_phr',
          name: 'thc_phr'
        },
        {
          id: 'thc_report',
          name: 'thc_report'
        }
      ],
    }
  },
]
const editSchema = [
  {
    name: 'jobName',
    label: '任务名字',
  },
  {
    name: 'typeCode',
    label: '通道code',
    comp: 'select',
    props: {
      options: [
        {
          id: 'thc_phr',
          name: 'thc_phr'
        },
        {
          id: 'thc_report',
          name: 'thc_report'
        }
      ],
    }
  },
  {
    name: 'channelDatasourceTypeCode',
    label: '数据源类型',
    comp: 'custom'
  },
  {
    name: 'viewName',
    label: '来源视图',
  },
  {
    name: 'tempTableName',
    label: '数据中间表名字',
  },
  {
    name: 'tableName',
    label: '目标数据表',
  },
  {
    name: 'keyColumnNames',
    label: '数据行记录主键列集合',
  },
  {
    name: 'md5ColumnNames',
    label: '数据行md5',
  },
  {
    name: 'createTimeCycle',
    label: '执行周期(分钟)',
  },
  {
    name: 'runTimeCycle',
    label: '任务执行周期(分钟)',
    props: {
      placeholder: '数值必须 >= 20',
      type: 'number'
    }
  },
  {
    name: 'runStatus', // 0:可以执行，1:执行中，2:不再执行
    label: '运行状态',
    comp: 'select',
    props: {
      options: [
        {
          id: '0',
          name: '可以执行'
        },
        {
          id: '1',
          name: '执行中'
        }
      ],
      clearable: false
    },
    clearable: false
  },
  {
    name: 'jobStatus',
    label: '任务状态',
    comp: 'select',
    props: {
      options: [
        {
          id: '0',
          name: '暂停'
        },
        {
          id: '1',
          name: '开始'
        }
      ],
      clearable: false
    }
  },
]
const viewSchema = [
  {
    name: 'executeType',
    label: '运行类型',
    comp: 'select',
    props: {
      options: [
        {
          id: '0',
          name: '当前租户'
        },
        {
          id: '1',
          name: '所有租户'
        }
      ],
      clearable: false
    },
  },
  {
    name: 'viewContent',
    label: '视图内容',
    comp: 'textarea',
    props: {
      autosize: { minRows: 12 }
    }
  },
]
function validateTime (rule, value, callback) {
  const num = parseInt(value)
  if (!isNaN(num)) {
    if (num >= 20) {
      return callback()
    } else {
      return callback(new Error('数值必须大于或等于20'))
    }
  } else {
    return callback(new Error('数值必须大于或等于20'))
  }
}
export default {
  name: 'dataSwitch',
  created () {
    this.getDataType()
  },
  mounted () {
  },
  watch: {
    'editForm.typeCode' (val, pre) {
      if (pre === '##') return // 编辑赋值时 不清空
      this.editForm.channelDatasourceTypeCode = ''
    }
  },
  computed: {
    disabled () {
      return !this.selectedArr.length
    },
    typeList () {
      if (this.editForm.typeCode === 'thc_phr') {
        return this.phrTypeList
      } else if (this.editForm.typeCode === 'thc_report') {
        return this.reportTypeList
      } else {
        return []
      }
    }
  },
  data () {
    const form = this.$ever.createObjFromSchema(schema)
    let editForm = this.$ever.createObjFromSchema(editSchema)
    let viewForm = this.$ever.createObjFromSchema(viewSchema)
    let today = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    return {
      loading: false,
      typeCode: '',
      logForm: {},
      executeType: '0',
      form,
      schema,
      viewForm,
      viewSchema,
      viewRes: '', // 执行后返回的结果
      viewRules: {
        executeType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        viewContent: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
      },
      logColumns: [
        {
          prop: 'viewName',
          label: '视图名字',
        },
        {
          prop: 'logTime',
          label: '日志时间',
          showOverflowTooltip: true,
          formatter: this.formatterDate
        },
        {
          prop: 'logDesc',
          slotName: 'logDesc',
          width: 600
        },
      ],
      logData: [],
      manuShow: false,
      manuType: '0',
      viewShow: false,
      createTime: 5,
      runTime: today,
      viewOptions: [
        {
          id: '0',
          label: '当前租户'
        },
        {
          id: '1',
          label: '所有租户'
        }
      ],
      options: [
        {
          label: '全部批量',
          value: '0'
        },
        {
          label: '按照创建时间',
          value: '1'
        },
        {
          label: '按照修改时间',
          value: '2'
        }
      ],
      textarea: '',
      columns: [
        {
          prop: 'jobName',
          label: '任务名字',
        },
        {
          prop: 'typeCode',
          label: '通道code',
        },
        {
          prop: 'channelDatasourceTypeCode',
          label: '数据源类型',
        },
        {
          prop: 'viewName',
          label: '来源视图',
        },
        {
          prop: 'tableName',
          label: '目标数据表',
        },
        {
          prop: 'viewCount',
          label: ' 视图数据量 ',
          showOverflowTooltip: true
        },
        {
          prop: 'tableCount',
          label: '目标表数据量',
          showOverflowTooltip: true
        },
        {
          prop: 'runTimeCycle',
          label: '任务执行周期(分钟)',
          showOverflowTooltip: true
        },
        {
          prop: 'lastRunTime',
          label: '最近运行时间',
        },
        {
          prop: 'runStatus',
          label: '运行状态',
          showOverflowTooltip: true,
          formatter ({ value }) {
            const obj = { 0: '可以执行', 1: '执行中' }
            return obj[Number(value)]
          }
        },
        {
          prop: 'jobStatus',
          label: '任务状态',
          showOverflowTooltip: true,
          formatter ({ value }) {
            const obj = { 0: '暂停', 1: '开始' }
            return obj[Number(value)]
          }
        },
        {
          prop: 'errMsg',
          label: '错误信息',
          slotName: 'errMsg',
          formatter ({ value }) {
            if (Number(value) === -1) {
              return '无'
            } else if (value === null) {
              return '无'
            } else {
              return value
            }
          }
        },
        {
          prop: 'op',
          label: '操作',
          type: 'btns',
          width: 300,
          btns ({ row }) {
            if (row.channelDatasourceTypeCode === 'default') {
              return ['edit', 'del',
                {
                  prop: 'log-list',
                  label: '日志列表'
                },
                {
                  prop: 'manu-execute',
                  label: '手动执行'
                },
                {
                  prop: 'view',
                  label: '视图'
                }]
            } else {
              return ['edit', 'del',
                {
                  prop: 'log-list',
                  label: '日志列表'
                },
                {
                  prop: 'manu-execute',
                  label: '手动执行'
                }
              ]
            }
          }
        }
      ],
      url: '/thc-data/dataSwitchingJob/pageList',
      editForm,
      editSchema,
      editRules: {
        jobName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        typeCode: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        channelDatasourceTypeCode: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        tempTableName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        tableName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        viewName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        keyColumnNames: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        md5ColumnNames: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        createTimeCycle: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        runStatus: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        jobStatus: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        runTimeCycle: [
          { validator: validateTime, trigger: 'blur' }
        ],
      },
      editDialog: false,
      orderDiag: false,
      orderTemp: {},
      editKey: 0,
      logShow: false,
      selectedArr: [],
      exeDisabled: false
    }
  },
  methods: {
    async getDataType (channelCode) {
      this.loading = true
      const thcPhr = await request('thc-data/dataSwitchingChannel/getChannelDatasourceTypeCode', { channelCode: 'thc_phr' })
      const thcReport = await request('thc-data/dataSwitchingChannel/getChannelDatasourceTypeCode', { channelCode: 'thc_report' })
      if (thcPhr && thcPhr.data && Array.isArray(thcPhr.data)) {
        this.phrTypeList = thcPhr.data
      }
      if (thcReport && thcReport.data && Array.isArray(thcReport.data)) {
        this.reportTypeList = thcReport.data
      }
      this.loading = false
    },
    viewContent ({ row }) {
      this.viewForm.executeType = '0'
      this.viewForm.viewName = row.viewName
      this.viewForm.viewContent = ''
      this.viewRes = ''
      this.viewShow = true
    },
    formatterDate ({ value }) {
      return this.$moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    confirmView () {
      const validate = this.$refs.view.$refs.form.validate
      validate(async valid => {
        if (valid) {
          const res = await request('/thc-data/platform/phrView/execute', this.viewForm)
          this.viewRes = res.data.result
        }
      })
    },
    async confirm () {
      const obj = { runType: this.manuType, id: this.manuId }
      if (this.manuType === '1') {
        if (!this.createTime) return
        obj.createTimeCycle = this.createTime
      }
      if (this.manuType === '2') {
        if (!this.runTime) return
        obj.lastRunTime = this.$moment(this.runTime).format('YYYY-MM-DD HH:mm:ss')
      }
      this.exeDisabled = true
      obj.channelDatasourceTypeCode = this.channelDatasourceTypeCode
      const res = await request(dataswitch.excute, obj)
      if (res && res.head && res.head.errCode === 0) {
        this.$message({
          message: '成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '失败',
          type: 'success'
        })
      }
      this.manuShow = false
      this.manuId = ''
      this.manuType = '0'
      this.exeDisabled = false
      this.createTime = 5
      this.runTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')

      this.search()
    },
    async resetData () {
      const arr = []
      this.selectedArr.map(item => {
        const obj = { id: item.id, runType: '0' }
        arr.push(obj)
      })
      const res = await request('/thc-data/dataSwitchingJob/executeBatch', { dataSwitchingJobListDTO: arr })
      if (res && res.head && res.head.errCode === 0) {
        this.$message({
          message: '成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '失败',
          type: 'success'
        })
      }
      this.search()
    },
    select (data) {
      this.selectedArr = data
    },
    textFormatter (value) {
      if (Number(value) === -1) {
        return '无'
      } else if (value === null) {
        return '无'
      } else {
        return value
      }
    },
    async logList ({ row }) {
      const { viewName, channelDatasourceTypeCode } = row
      this.logShow = true
      this.logForm = { viewName, channelDatasourceTypeCode }
    },
    manuExecute ({ row }) {
      this.channelDatasourceTypeCode = row.channelDatasourceTypeCode
      this.manuId = row.id
      this.manuShow = true
    },
    cancel () {
      this.editDialog = false
    },
    search () {
      this.$refs.table.list()
    },
    async del ({ row }) {
      const { id } = row
      const res = await request('/thc-data/dataSwitchingJob/delete', { id })
      if (res && res.head && res.head.errCode === 0) {
        this.$message({ type: 'success', message: '删除成功' })
      }
      this.search()
    },
    edit ({ row }) {
      this.editForm.typeCode = '##'
      this.$nextTick(() => {
        this.editForm = JSON.parse(JSON.stringify(row))
        this.editDialog = true
      })
    },
    save () {
      const validate = this.$refs.editForm.$refs.form.validate
      validate(async valid => {
        if (valid) {
          if (!this.editForm.id) {
            await request('/thc-data/dataSwitchingJob/insert', this.editForm)
            this.$message({ type: 'success', message: '创建成功' })
          } else {
            await request('/thc-data/dataSwitchingJob/update', this.editForm)
            this.$message({ type: 'success', message: '更新成功' })
          }
          this.search()
          this.editDialog = false
        }
      })
    },
    createSys () {
      this.editKey++
      this.editForm = this.$ever.createObjFromSchema(editSchema)
      this.editForm.runStatus = '0'
      this.editForm.jobStatus = '0'
      this.editDialog = true
    },
  },
  components: {
  }
}
</script>

<style scoped>
.bg {
  background-color: #ffffff;
  padding: 2px 10px 0px 2px;
  overflow: auto;
  height: 100%;
}
.over-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.error_content {
  width: 80vw;
}
.ml57 {
  margin-left: 57px;
}
</style>

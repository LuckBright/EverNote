<template>
  <div class="autoprintset layout_inner">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane v-if="isYihu" label="处置单" name="CHU_ZHI_DAN"></el-tab-pane>
      <el-tab-pane v-if="!isYihu" label="分类执行单" name="FEN_LEI_ZHI_XING_DAN"></el-tab-pane>
      <el-tab-pane v-if="!isYihu" label="瓶贴" name="PING_TIE"></el-tab-pane>
      <el-tab-pane v-if="!isYihu" label="输液卡" name="SHU_YE_KA"></el-tab-pane>
      <el-tab-pane v-if="!isYihu" label="医嘱单" name="YI_ZHU_DAN"></el-tab-pane>
    </el-tabs>
    <div class="create" v-if="source == 1 || activeName == 'FEN_LEI_ZHI_XING_DAN'">
      <el-button v-if="isShowCreate" @click="edit(false)" type="primary">新建</el-button>
    </div>
    <div class="list">
      <ever-table
        table-class="flex_layout_scroll"
        :columns="getColumns"
        :data="tableData"
        @eventChange="handleEvent"
      ></ever-table>
      <ever-pagination
        v-if="activeName==='FEN_LEI_ZHI_XING_DAN'"
        :page-size="pageSize"
        layout="prev, pager, next"
        @current-change="changePage"
        :totalCount="total"
      ></ever-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="isshowdialog" :close-on-click-modal="false" width="600px">
      <ever-form2 v-model="queryobj" ref="form" :schema="schema" :rules="rules">
        <template slot="includeAdviceTypeList">
          <el-select
            v-model="queryobj.includeAdviceTypeList"
            :clearable="true"
            multiple
            filterable
            placeholder="请选择医嘱类型"
            style="width:100%"
          >
            <el-option
              v-for="item in selectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
        <template slot="includeUsageList">
          <el-select
            v-model="queryobj.includeUsageList"
            :clearable="true"
            multiple
            filterable
            placeholder="请选择用法"
            style="width:100%"
          >
            <el-option
              v-for="item in includeUsageOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
        <template slot="configCode">
          <el-select
            v-model="queryobj.configCode"
            :clearable="true"
            placeholder="请选择单据类型"
            style="width:100%"
            :disabled="title == '编辑'"
          >
            <el-option v-for='li in YZD_options' :label="li.label" :value="li.value" :key='li.value'></el-option>
          </el-select>
        </template>
        <template slot="default">
          <span></span>
        </template>
      </ever-form2>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isshowdialog=false">取消</el-button>
        <el-button
          @click="addConfig"
          type="primary"
          :disabled="disabled"
        >保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/sob/store/autoprintsetapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
let schema = [
  {
    name: 'configName',
    label: '单据名称',
    clearable: true,
    labelWidth: '80px',
    span: 18
  },
  {
    name: 'includeAdviceTypeList',
    label: '医嘱类型',
    comp: 'custom',
    labelWidth: '80px',
    span: 18
  },
  {
    name: 'includeUsageList',
    label: '用法',
    labelWidth: '80px',
    comp: 'custom',
    span: 18,
    // needObjFlag: true
  },
  {
    name: 'sortNumber',
    label: '排序号',
    clearable: true,
    labelWidth: '80px',
    span: 18
  },
]
let otherschema = [
  {
    name: 'includeAdviceTypeList',
    label: '医嘱类型',
    comp: 'custom',
    labelWidth: '80px',
    span: 18
  },
  {
    name: 'includeUsageList',
    label: '用法',
    labelWidth: '80px',
    comp: 'custom',
    span: 18,
    // needObjFlag: true
  }
]

let yzdschema = [
  {
    name: 'configCode',
    label: '单据类型',
    comp: 'custom',
    labelWidth: '80px',
    span: 18
  },
  {
    name: 'includeAdviceTypeList',
    label: '医嘱类型',
    comp: 'custom',
    labelWidth: '80px',
    span: 18
  }
]
export default {
  data () {
    return {
      api,
      activeName: 'FEN_LEI_ZHI_XING_DAN',
      tableData: [],
      queryobj: {
        configName: '',
        configCode: '',
        includeAdviceTypeList: [],
        includeUsage: [],
        sortNumber: '',
      },
      schema: [],
      isshowdialog: false,
      selectOptions: [],
      includeUsageOptions: [],
      pageSize: 20,
      title: '新建',
      includeAdviceTypeList: '',
      id: '',
      disabled: false,
      isYihu: false,
      isShowCreate: true,
      currentPage: 1,
      total: 0,
      page: 1,
      columns: [
        {
          prop: 'includeAdviceTypeName',
          label: '医嘱类型'
        },
        {
          prop: 'includeUsageName',
          label: '用法',
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '操作',
          width: '150',
          btns: this.$route.path.indexOf('group') === -1 ? ['edit', 'del'] : ['edit']
        }
      ],
      YZD_columns: [
        {
          prop: 'configName',
          label: '单据类型',
          props: {
            // options
          }
        },
        {
          prop: 'includeAdviceTypeName',
          label: '医嘱类型'
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '操作',
          width: '150',
          btns: this.$route.path.indexOf('group') === -1 ? ['edit', 'del'] : ['edit']
        }
      ],
      columnss: [
        {
          prop: 'configName',
          label: '执行单名称',
          width: '300'
        },
        {
          prop: 'includeAdviceTypeName',
          label: '医嘱类型'
        },
        {
          prop: 'includeUsageName',
          label: '用法',
        },
        {
          prop: 'sortNumber',
          label: '排序号',
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '操作',
          width: '150',
          btns: [
            'edit',
            'del',
          ],
        }
      ],
      rules: {},
      YZD_options_bak: [
        {
          label: '临时医嘱单',
          value: 'YI_ZHU_DAN_LIN_SHI'
        },
        {
          label: '长期医嘱单',
          value: 'YI_ZHU_DAN_CHANG_QI'
        }
      ],
      YZD_options: [],
      source: this.$route.path.indexOf('group') === -1 ? 1 : 2,
    }
  },
  created () {
    this.routeJude(this.$route.path)
    // this.getoptions()
    this.getConfigList()
  },
  computed: {
    getColumns () {
      switch (this.activeName) {
        case 'FEN_LEI_ZHI_XING_DAN':
          return this.columnss
        case 'YI_ZHU_DAN':
          return this.YZD_columns
        default:
          return this.columns
      }
    }
  },
  methods: {
    getValue () {
      sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(options => {
        options.forEach(item => {
          if (this.isYihu || this.activeName === 'PING_TIE' || this.activeName === 'SHU_YE_KA') {
            if (item.code === '301' || item.code === '302') this.selectOptions.push(item)
          } else {
            if (item.code !== '303' && item.code !== '304') {
              this.selectOptions.push(item)
            }
          }
        })
      })
      sysvalue.listOnce('CV06.00.102').then(options => {
        this.includeUsageOptions = options
      })
    },
    changePage (val) {
      this.page = val
      this.getConfigList()
    },
    handleClick (vl) {
      this.getConfigList()
    },
    handleEvent ({ prop, row }) {
      this[prop](row)
    },
    getConfigList () {
      let parms = {
        source: this.source,
        executeTypeCode: this.activeName,
        offset: 20 * (this.page - 1), // number
        pagesize: 20, // number
      }
      api.getConfigList(parms).then(res => {
        this.tableData = res.data.resultList
        this.total = res.data.totalCount || 0
        // this.disabled = false
        this.isShowCreate = true
        if ((this.activeName === 'PING_TIE' || this.activeName === 'SHU_YE_KA' || this.activeName === 'CHU_ZHI_DAN') && res.data.resultList.length > 0) {
          this.isShowCreate = false
          // this.columns.pop()
        }
        if (this.activeName === 'YI_ZHU_DAN') {
          this.YZD_options = this.YZD_options_bak
          let obj = {
            YI_ZHU_DAN_LIN_SHI: '临时医嘱单',
            YI_ZHU_DAN_CHANG_QI: '长期医嘱单',
          }
          this.tableData.forEach(ele => {
            ele.configName = obj[ele.configCode]
          })
          if (res.data.resultList.length === 2) this.isShowCreate = false
          if (res.data.resultList.length === 1) {
            this.YZD_options = this.YZD_options_bak.filter(ele => {
              return ele.label !== this.tableData[0].configName
            })
          }
        }
      })
    },
    async addConfig () {
      if (this.disabled) return
      this.disabled = true
      let includeAdviceTypeList = []
      if (this.queryobj.includeAdviceTypeList && this.queryobj.includeAdviceTypeList.length > 0) {
        this.queryobj.includeAdviceTypeList.map(v => {
          let r = this.selectOptions.find(item => {
            return item.id === v
          })
          includeAdviceTypeList.push({ name: r.name, code: r.code })
        })
      }
      let includeUsageList = []
      if (this.queryobj.includeUsageList && this.queryobj.includeUsageList.length > 0) {
        this.queryobj.includeUsageList.map(v => {
          let r = this.includeUsageOptions.find(item => {
            return item.id === v
          })
          includeUsageList.push({ name: r.name, code: r.code })
        })
      }
      this.$refs.form.$refs.form.validate(async valid => {
        if (valid) {
          let res
          if (this.title === '新建') {
            let parms = {
              source: this.source,
              executeTypeCode: this.activeName,
              configName: this.queryobj.configName,
              includeAdviceTypeList: includeAdviceTypeList,
              includeUsageList: includeUsageList,
              configCode: this.queryobj.configCode,
              sortNumber: this.queryobj.sortNumber
            }
            res = await api.addConfig(parms).catch(_ => {
              this.disabled = false
            })
          } else {
            let parms = {
              id: this.id,
              configName: this.queryobj.configName,
              configCode: this.queryobj.configCode,
              includeAdviceTypeList: includeAdviceTypeList,
              includeUsageList: includeUsageList,
              sortNumber: this.queryobj.sortNumber
            }
            res = await api.updateConfig(parms).catch(_ => {
              this.disabled = false
            })
          }
          if (res.head && res.head.errCode === 0) this.cb()
        } else {
          this.disabled = false
        }
      })
    },
    cb () {
      setTimeout(_ => {
        this.disabled = false
      }, 500)
      this.$messageTips(this, 'success', `${this.title}成功`, '提示')
      this.isshowdialog = false
      this.getConfigList()
    },
    async edit (item) {
      this.isshowdialog = true
      this.disabled = false
      this.getoptions()
      await this.$nextTick(_ => this.$refs.form.$refs.form.resetFields())
      if (item) {
        this.id = item.id
        this.title = '编辑'
        this.queryobj.configName = item.configName
        this.queryobj.configCode = item.configCode
        this.queryobj.sortNumber = item.sortNumber
        this.queryobj.includeAdviceTypeList = item.includeAdviceType ? item.includeAdviceType.split(',') : []
        if (this.activeName === 'YI_ZHU_DAN') {
          this.YZD_options = this.YZD_options_bak
        }
        this.queryobj.includeUsageList = item.includeUsage ? item.includeUsage.split(',') : []
      } else {
        this.title = '新建'
      }
      this.$nextTick(_ => this.$refs.form.$refs.form.clearValidate())
    },
    async del ({ id }) {
      if (this.disabled) return
      this.disabled = true
      let parms = {
        id: id
      }
      let res = await api.deleteConfig(parms).catch(_ => {
        this.disabled = false
      })
      if (res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '删除成功', '提示')
        this.getConfigList()
      }
      setTimeout(_ => {
        this.disabled = false
      }, 500)
    },
    checkValidPoint (rule, value, callback) {
      var reg = /^([1-9]\d*|0)?$/
      if (value && value !== '') {
        value = value.toString()
        if (!value.match(reg)) {
          callback(new Error('请输入整数'))
        } else if (value.length > 4) {
          callback(new Error('请输入小于五位整数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    getoptions () {
      // 更新schema 和 rules
      if (this.activeName === 'FEN_LEI_ZHI_XING_DAN') {
        this.schema = schema
        this.rules = {
          configName: [
            {
              required: true,
              message: '请输入单据名称',
              trigger: 'change'
            },
            { max: 20, message: '不能超过20字！', trigger: 'change' }
          ],
          includeAdviceTypeList: [
            {
              required: true,
              message: '请选择医嘱类型',
              trigger: 'change'
            }
          ],
          sortNumber: [
            {
              validator: this.checkValidPoint,
              message: '请输入小于五位整数',
              trigger: 'change'
            }
          ],
        }
      } else if (this.activeName === 'YI_ZHU_DAN') {
        this.schema = yzdschema
        this.rules = {
          configCode: [
            {
              required: true,
              message: '请选择单据类型',
              trigger: 'change'
            },
          ],
          includeAdviceTypeList: [
            {
              required: true,
              message: '请选择医嘱类型',
              trigger: 'change'
            }
          ]
        }
      } else {
        this.schema = otherschema
        this.rules = {
          includeAdviceTypeList: [
            {
              required: true,
              message: '请选择医嘱类型',
              trigger: 'change'
            }
          ],
          includeUsageList: [
            {
              required: true,
              message: '请选择用法',
              trigger: 'change'
            }
          ],
        }
      }
      this.queryobj = this.$ever.createObjFromSchema(this.schema)
      this.selectOptions = []
      this.getValue()
    },
    routeJude (val) {
      if (val === '/warehouse/yihuautoprintset' || val === '/manages/groupyihuautoprintset') {
        this.isYihu = true
        this.activeName = 'CHU_ZHI_DAN'
      }
      if (val === '/warehouse/nurseautoprintset' || val === '/manages/groupnurseautoprintset') {
        this.isYihu = false
        this.activeName = 'FEN_LEI_ZHI_XING_DAN'
      }
    }
  },
  watch: {
    '$route.path': {
      handler (val) {
        this.routeJude(val)
        this.getConfigList()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.autoprintset {
  .list {
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
  }
  /deep/ .el-tabs__nav {
    div {
      width: 98px;
      text-align: center;
    }
  }
  .create {
    text-align: right;
  }
}
</style>


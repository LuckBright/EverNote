<template>
  <div class="bingli container">
    <ever-form2
      v-model="queryObj"
      :schema="schema"
      :inline="true"
      class="ml mgb10">
      <template slot="default">
        <el-button
          size="small"
          type="primary"
          @click="list">
          查询
        </el-button>
        <div class="fr">
          <el-button
            size="small"
            type="primary"
            @click="openAdd">
            添加
          </el-button>
          <el-popover
            v-model="visible"
            placement="left"
            width="160">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                @click="visible = false">
                取消
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="delMore">
                确定
              </el-button>
            </div>
            <el-button
              slot="reference"
              size="small"
              :disabled="delDisabled">
              删除
            </el-button>
          </el-popover>

          <el-popover
            v-if="type === 'jituan'"
            v-model="initVisible"
            placement="left"
            width="160">
            <p>确定初始化吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                @click="initVisible = false">
                取消
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="init">
                确定
              </el-button>
            </div>
            <el-button
              slot="reference"
              size="small">
              初始化
            </el-button>
          </el-popover>

        </div>
      </template>
    </ever-form2>

    <div class="table">
      <ever-table
        ref="table"
        :columns="columns"
        :data="tableData"
        :el-table-attr="props"
        default-expand-all
        is-auto-height
        :fixed-height="60"
        row-key="id"
        show-checkbox
        @eventChange="eventChange"
        @select="selectItem"
        @select-all="selectItem"></ever-table>
      <div class="page"></div>
    </div>

    <add-bingli
      ref="add"
      :visible.sync="addVisible"
      :api='api'
      :type='type'
      :selectOptions='selectOptions'
      @close="close('addVisible')"
      :one-level-name="oneLevelName" 
      :two-level-name="twoLevelName"></add-bingli>
    <edit-bingli
      ref="edit"
      :api='api'
      :type='type'
      :visible.sync="editVisible"
      :form="editForm"
      @close="close('editVisible')"
      :one-level-name="oneLevelName" 
      :two-level-name="twoLevelName"></edit-bingli>
  </div>
</template>

<script>
  import {commandLog} from '@/phr/mixin/operationLog.js'
  import api from '@/form/store/anamnesistypeapi'
  import techapi from '@/form/store/techtypeapi'
  import addBingli from './addbingli'
  import editBingli from './editbingli'
  import moment from 'moment'

  const ZHUYUAN = '1'
  const MENZHEN = '2'
  const HULI = '3'
  const CITIAO = '5'
  const schema = [
    {
      name: 'type',
      label: '类型',
      comp: 'el-select',
      props: {
        options: [
          {
            id: ZHUYUAN,
            name: '住院'
          },
          {
            id: MENZHEN,
            name: '门诊'
          },
          {
            id: HULI,
            name: '护理'
          },
          {
            id: CITIAO,
            name: '词条'
          }
        ],
        clearable: false
      }
    },
    {
      name: 'name',
      label: '病历类型',
      comp: 'input',
      props: {
        clearable: true
      }
    }
  ]
  export default {
    props: {
      type: {
        type: String,
        default: 'jituan'
      },
      selectOptions: {
        type: Array,
        default: undefined
      },
      oneLevelName: {
        type: String
      },
      twoLevelName: {
        type: String
      }
    },
    components: {
      addBingli,
      editBingli
    },
    data () {
      let queryObj = this.$ever.createObjFromSchema(schema)
      queryObj.type = '1'
      return {
        pageName: '病历类型',
        schema,
        queryObj,
        api,
        tableData: [],
        columns: [
          {
            prop: 'ever-op',
            label: '操作',
            type: 'btns',
            btns: ({ row }) => {
              let baseBtns = ['edit', 'del']
              return baseBtns
            }
          },
          {
            prop: 'code',
            label: '编号',
            showOverflowTooltip: true
          },
          {
            prop: 'type',
            label: '类型',
            width: 80,
            formatter ({ value }) {
              const map = { 1: '住院', 2: '门诊', 3: '护理', 5: '词条' }
              return map[value] ? map[value] : ''
            }
          },
          {
            prop: 'name',
            label: '病历类型',
            showOverflowTooltip: true
          },
          {
            prop: 'updaterName',
            label: '操作人',
            width: 100
          },
          {
            prop: 'updateTime',
            label: '时间',
            width: 100,
            formatter ({ value }) {
              return value ? moment(value).format('YYYY-MM-DD') : ''
            }
          },
          {
            prop: 'status',
            label: '状态',
            width: 80,
            formatter ({ value }) {
              const map = { 1: '启用', 0: '停用' }
              return map[value] ? map[value] : ''
            }
          },
          {
            prop: 'comment',
            label: '备注',
            showOverflowTooltip: true
          }
        ],

        // 删除弹窗
        visible: false,
        addVisible: false,
        editVisible: false,
        initVisible: false,
        checkedItems: [],
        // 表格配置
        props: {
          'tree-props': { children: 'nodes' }
        },
        editForm: {},
      }
    },
    computed: {
      delDisabled () {
        return this.checkedItems.length === 0
      }
    },
    created () {
      if (this.type !== 'jituan') {
        this.api = techapi
      // 支持传入动态类型选择下拉框
        this.$ever.getFieldFromSchema(this.schema, 'type').props.options = this.selectOptions || []
        schema[1].label = '模板类型'
        this.columns[3].label = '模板类型'
        this.columns[2].formatter = ({ value }) => {
          const map = { 1: '检验', 2: '检查', 5: '词条' }
          return map[value] ? map[value] : ''
        }
      }
      this.list()
    },
    methods: {
      async init () {
        await this.api.init()
        this.list()
        this.initVisible = false
      },
      selectItem (sel) {
        this.checkedItems = sel
      },
      eventChange ({ prop, row }) {
        if (prop === 'del') {
          this.delSingle(row)
        } else if (prop === 'edit') {
          this.openEdit(row)
        }
      },
      async delSingle (row) {
        await this.api.delBingli({ id: row.id })
        this.list()
        this.delTip(row)
      },
      async delMore () {
        this.visible = false
        const ids = []
        this.checkedItems.map(item => {
          ids.push(item.id)
        })
        await this.api.delMoreBingli({ ids })
        this.list()
        this.delTip()
      },
      delTip (row) {
        // 操作上报
        commandLog({
          content: `删除${this.pageName}的${row ? row.name : '多个类型'}`,
          opModuleOne: `${this.oneLevelName}-${this.twoLevelName}-${this.pageName}`,
          opType: 'DELETE'
        })
        this.$messageTips(this, 'success', '删除成功', '提示')
      },
      reset (form) {
        this.$refs[form].reset()
      },
      close (type) {
        this[type] = false
        this.list()
      },
      openAdd () {
        this.addVisible = true
        this.reset('add')
        // 操作上报
        commandLog({
          content: `新建${this.pageName}`,
          opModuleOne: `${this.oneLevelName}-${this.twoLevelName}-${this.pageName}`,
          opType: 'CLICK_CREATE'
        })
      },
      openEdit (row) {
        this.editForm = {
          id: row.id,
          parentId: row.parentId ? row.parentId : '',
          type: row.type + '',
          name: row.name,
          level: row.level + '',
          status: row.status + '',
          comment: row.comment,
          icon: row.icon,
          source: row.source,
          writeCount: row.writeCount
        }
        this.$nextTick(() => {
          this.editVisible = true
          this.reset('edit')
        })
        commandLog({
          content: `编辑${this.pageName}的${row.name}`,
          opModuleOne: `${this.oneLevelName}-${this.twoLevelName}-${this.pageName}`,
          opType: 'CLICK_EDIT'
        })
      },
      async list () {
        const data = await this.api.bingli(this.queryObj)
        this.tableData = Array.isArray(data) ? data : []
        this.checkedItems = []
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    flex-flow: column;
    height: 100%;
    .form {
      height: 43px;
    }
    .table {
      margin-top: -10px;
      flex: 1;
      overflow: auto;
      clear: both
    }
    .page {
      height: 50px;
    }
  }
  .mgb10 {
    margin-bottom: 10px
  }
</style>

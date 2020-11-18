<template>
  <div class="container">
    <ever-form2
      v-model="queryObj"
      :schema="schema"
      :inline="true"
      class="form">
      <template slot="default">
        <el-button
          size="small"
          type="primary"
          @click="handleCurrentChange(1)">
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
            v-model="delVisible"
            placement="left"
            width="160">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                @click="delVisible = false">
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
        show-checkbox
        :columns="columns"
        :data="tableData"
        is-auto-height
        :fixed-height="60"
        @eventChange="eventChange"
        @select="selectItem"
        @select-all="selectItem"></ever-table>
      <el-pagination
        class="fr page"
        :current-page="currentPage"
        :page-sizes="[25, 50, 100]"
        :page-size="queryObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"></el-pagination>
    </div>

    <add
      ref="add"
      :title="addTitle"
      :add-api="addApi"
      opType="1000"
      :opModuleOne="addTitle.slice(2)"
      :visible.sync="addVisible"
      @close="close('addVisible')"
      :one-level-name="oneLevelName" 
      :two-level-name="twoLevelName"></add>
    <edit
      ref="edit"
      :visible.sync="editVisible"
      :form="editForm"
      opType="1000"
      :opModuleOne="editTitle.slice(2)"
      :title="editTitle"
      :edit-api="editApi"
      @close="close('editVisible')"
      :one-level-name="oneLevelName" 
      :two-level-name="twoLevelName"></edit>
  </div>
</template>

<script>
  import api from '@/form/store/api'
  import add from './add'
  import edit from './edit'
  import moment from 'moment'
  import {commandLog} from '@/phr/mixin/operationLog.js'

  export default {
    components: {
      add,
      edit
    },
    props: {
      listApi: String,
      addApi: String,
      editApi: String,
      editTitle: String,
      addTitle: String,
      typeCode: String,
      pageName: {
        type: String
      },
      oneLevelName: {
        type: String
      },
      twoLevelName: {
        type: String
      }
    },
    data () {
      const schema = [
        {
          name: 'name',
          label: '名称',
          comp: 'input',
          props: {
            clearable: true
          }
        }
      ]
      let queryObj = this.$ever.createObjFromSchema(schema)
      queryObj.pagesize = 25
      queryObj.offset = 0

      return {
        schema,
        queryObj,
        tableData: [],
        columns: [
          {
            prop: 'ever-op',
            label: '操作',
            width: 130,
            type: 'btns',
            btns: () => {
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
            prop: 'typeName',
            label: '类型',
            width: 120,
            showOverflowTooltip: true
          },
          {
            prop: 'name',
            label: '名称',
            showOverflowTooltip: true
          },
          {
            prop: 'required',
            label: '必填',
            formatter: this.formatterName
          },
          {
            prop: 'updated',
            label: '修改',
            formatter: this.formatterName
          },
          {
            prop: 'statistic',
            label: '统计',
            formatter: this.formatterName
          },
          {
            prop: 'echo',
            label: '回显',
            formatter: this.formatterName
          },
          {
            prop: 'sync',
            label: '同步',
            formatter: this.formatterName
          },
          {
            prop: 'status',
            label: '状态',
            formatter: this.formatterStatus
          },
          {
            prop: 'updaterName',
            label: '操作人',
            width: 130
          },
          {
            prop: 'updateTime',
            label: '日期',
            formatter ({ value }) {
              return value ? moment(value).format('YYYY-MM-DD') : ''
            }
          }
        ],

        addVisible: false,
        editVisible: false,
        delVisible: false,
        initVisible: false,
        checkedItems: [],
        editForm: {},
        pagesize: 25,
        totalCount: 0,
        currentPage: 1,
      }
    },
    computed: {
      delDisabled () {
        return this.checkedItems.length === 0
      }
    },
    created () {
      this.list()
      // 操作上报
    },
    methods: {
      handleSizeChange (val) {
        this.pagesize = val
        this.handleCurrentChange(1)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.list()
      },
      async list () {
        this.queryObj.pagesize = this.pagesize
        this.queryObj.offset = (this.currentPage - 1) * this.pagesize
        const data = await api[this.listApi](this.queryObj)
        this.tableData = Array.isArray(data.resultList) ? data.resultList : []
        this.totalCount = data.totalCount
        this.checkedItems = []
      },
      formatterName ({ value }) {
        return value ? '是' : '否'
      },
      formatterStatus ({ value }) {
        return value ? '启用' : '停用'
      },
      eventChange ({ prop, row }) {
        if (prop === 'del') {
          this.delSingle(row)
        } else if (prop === 'edit') {
          this.openEdit(row)
        }
      },
      openEdit (row) {
        console.log(row)
        this.editForm = Object.assign({}, this.editForm, row)
        this.$nextTick(() => {
          this.editVisible = true
          this.reset('edit')
          // 操作上报
          commandLog({
            content: `编辑${this.pageName}的${row.name}`,
            opModuleOne: `${this.oneLevelName}-${this.twoLevelName}-${this.pageName}`,
            opType: 'CLICK_EDIT'
          })
        })
      },
      close (type) {
        this[type] = false
        this.list()
      },
      reset (form) {
        if (!this.$refs[form]) return
        this.$refs[form].reset()
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
      selectItem (rows) {
        this.checkedItems = rows
      },
      async delSingle (row) {
        await api.deleteOne({ id: row.id })
        this.list()
        this.delTip(row)
      },
      async delMore () {
        const ids = []
        const rowsInfo = []
        this.checkedItems.map(item => {
          ids.push(item.id)
          rowsInfo.push(item.name)
        })
        await api.deleteMore({ ids })
        this.list()
        this.delTip(rowsInfo)
        this.delVisible = false
      },
      delTip (row) {
        // 操作上报
        let name = (row instanceof Array) ? row.join('/') : row.name
        commandLog({
          content: `删除${this.pageName}的${name}`,
          opModuleOne: `${this.oneLevelName}-${this.twoLevelName}-${this.pageName}`,
          opType: 'DELETE'
        })
        this.$messageTips(this, 'success', '删除成功', '提示')
      },
      // 初始化
      async init () {
        await api.initConfig({typeCode: this.typeCode})
        this.initVisible = false
        this.list()
        this.$messageTips(this, 'success', '初始化成功', '提示')
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
      height: 33px;
      padding-bottom: 10px;
    }
    .table {
      flex: 1;
      overflow: auto;
      clear: both;
      /deep/ .el-table {
        margin-top: 0;
      }
    }
    .page {
      height: 50px;
    }
  }
</style>

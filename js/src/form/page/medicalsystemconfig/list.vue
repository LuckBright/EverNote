<template>
  <div class="container">
    <ever-form2
      v-model="queryObj"
      :schema="schema"
      :inline="true"
      class="form">
      <template slot="default">
        <el-button
          v-if="!org"
          size="small"
          type="primary"
          @click="query()">
          查询
        </el-button>
        <div class="fr">
          <el-button
            v-if="showAdd"
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
        </div>
      </template>
    </ever-form2>

    <div class="table">
      <ever-table
        ref="table"
        :columns="columns"
        :url="url"
        :params.sync="queryObj"
        show-checkbox
        is-auto-height
        :fixed-height="60"
        :is-auto-check-row="false"
        :is-record-url-params="false"
        @eventChange="eventChange"
        @row-click="rowClick"
        @select="selectItem"
        @select-all="selectItem">
      </ever-table>
    </div>
  </div>
</template>

<script>
  import { request } from '@/util/req'
  import storage from '@/util/storage.js'
  import {commandLog} from '@/phr/mixin/operationLog.js'
  export default {
    name: 'List',
    props: {
      org: {
        type: Boolean,
        default: false
      },
      url: {
        type: Object,
        default: ''
      },
      deleteUrl: {
        type: Object,
        default: ''
      },
      allColumns: {
        type: Array,
        default: []
      },
      // 集团类型值
      tenantScope: {
        type: Number,
        default: 0
      },
      // 机构类型值
      orgScope: {
        type: Number,
        default: 1
      },
      // 页面类型
      pageName: {
        type: String,
        default: ''
      },
      // 显示添加按钮
      showAdd: {
        type: Boolean,
        default: true
      }
    },
    data () {
      let columns = [...this.allColumns]

      const schema = [{
        name: 'orgName',
        label: '机构名称',
        comp: 'input',
        props: {
          clearable: true
        }
      }]
      let queryObj = this.$ever.createObjFromSchema(schema)
      return {
        columns,
        schema,
        queryObj,
        delVisible: false,
        checkedItems: [],
        levelOneName: '病历管理',
        levelTwoName: '病历系统配置',
      }
    },
    computed: {
      delDisabled () {
        return this.checkedItems.length === 0
      }
    },
    watch: {
      org: {
        handler (val) {
          if (val) {
            this.schema = []
            this.columns.splice(1, 2)
            this.$set(this.queryObj, 'scope', this.orgScope)
            this.$set(this.queryObj, 'orgId', storage.getLocalStorage('CLINICID'))
          }
        },
        immediate: true
      },
      pageType: {
        handler (val) {
          if (val === 'time' && !this.org) {
            this.$set(this.queryObj, 'scope', this.tenantScope)
          }
        },
        immediate: true
      }
    },
    methods: {
      query () {
        this.checkedItems = []
        this.$refs.table.list()
      },
      eventChange ({ prop, row }) {
        if (prop === 'del') {
          this.delete({ids: [row.id]}, row)
        } else if (prop === 'edit') {
          this.openEdit(row)
        }
      },
      openAdd () {
        this.$emit('openAdd')
      },
      openEdit (row) {
        this.$emit('openEdit', row)
      },
      async delete (rows, row) { // rows收集的只是id，row是具体的信息
        let name = (row instanceof Array) ? row.join('/') : (row.orgName || row.tenantName)
        let res = await request(this.deleteUrl, rows)
        if (res.head.errCode === 0) {
          commandLog({
            content: `删除了${name}的${this.pageName}`,
            opModuleOne: `${this.levelOneName}-${this.levelTwoName}-${this.pageName}`,
            opType: 'DELETE'
          })
          this.query()
          this.$messageTips(this, 'success', '删除成功', '提示')
        }
      },
      async delMore () {
        const ids = []
        const rowsInfo = []
        let isOrg = false
        for (let item of this.checkedItems) {
          if (item.scope === this.tenantScope) {
            isOrg = true
            break
          } else {
            ids.push(item.id)
            rowsInfo.push(item.orgName)
          }
        }
        // 包含集团时 提示错误
        if (isOrg) {
          this.$messageTips(this, 'error', '集团类型不可删除', '提示')
          this.delVisible = false
          return
        }
        await this.delete({ ids }, rowsInfo)
        this.delVisible = false
      },
      selectItem (rows) {
        this.checkedItems = rows
      },
      rowClick ({row}) {
        let index = this.checkedItems.findIndex(item => item.id === row.id)
        if (index === -1) {
          this.checkedItems.push(row)
        } else {
          this.checkedItems.splice(index, 1)
        }
      },
      close (type) {
        this[type] = false
        this.$refs.list.query()
      },
      reset (form) {
        if (!this.$refs[form]) return
        this.$refs[form].reset()
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
</style>

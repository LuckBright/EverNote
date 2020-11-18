<template>
  <div id="service-select">
    <el-dialog title="医嘱项目" :visible.sync="dialog" class="ui_dialog_02">
      <ever-query-form :schema="querySchema" v-model="queryObj" @query="query" :loading="loading"></ever-query-form>
      <el-table
        :data="toRelatedData"
        ref="multipleTable"
        height="320"
        @selection-change="handleSelectionChange"
        row-key="id"
        border>
        <el-table-column
          type="selection"
          align="center"
          :selectable="checkSelectable"
          reserve-selection
          width="50">
        </el-table-column>
        <el-table-column
          width="140"
          prop="code"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          label="分类">
          <template slot-scope="scope">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount">
      </ever-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogClose">取消</el-button>
        <el-button type="primary" @click="saveSelectVal">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import relapi from '../store/departmentserviceapi'
  import sysvalue from '@/warehouse/store/sysvalueapi'

  let schema = [
    {
      name: 'serviceClassification',
      label: '项目分类',
      type: 'select',
      options: []
    },
    {
      name: 'name',
      label: '项目名称',
      placeholder: '输入项目名称'
    }
  ]
  export default {
    props: ['itemIds'],
    data () {
      let queryObj = this.$ever.createObjFromSchema(schema)
      return {
        schema,
        querySchema: schema,
        queryObj: queryObj,
        toRelatedData: [],
        selectedVal: [],
        dialog: false,
        loading: false,
        flag: '',
        offset: 0,
        pagesize: 20,
        totalCount: 0,
        // pageSizes: [10, 20, 50, 100],
        pageLayout: 'total, sizes, prev, pager, next, jumper'
      }
    },
    created () {
      relapi.listByQuery().then(results => {
        if (results.data && results.totalCount) {
          results.data.totalCount = results.totalCount
          this.toRelatedData = results.data
        }
      })
      sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
        this.typeoptions = []
        res.forEach(item => {
          if (item.parentId === '297' || item.parentId === '294' || item.parentId === '296' || item.parentId === '798') {
            this.typeoptions.push(item)
          }
        })
        this.$ever.getFieldFromSchema(schema, 'serviceClassification').options = this.typeoptions
        // this.checkItemArr = this.typeoptions
      })
    },
    methods: {
      handleSizeChange (val) {
        this.pagesize = val
        this.query()
      },
      handleCurrentChange (val) {
        this.offset = (val - 1) * this.pagesize
        this.query()
        // return this.pageAfter && this.pageAfter(this.pagesize)
      },
      onDialogClose () {
        this.dialog = false
      },
      onDialogOpen (flag, initSelect) {
        // console.log(initSelect, '原有的项目')
        this.dialog = true
        this.flag = flag
        setTimeout(() => {
          if (!this.$refs.multipleTable) {
            return false
          }
          this.$refs.multipleTable.clearSelection()
          if (initSelect && initSelect.length > 0) {
            initSelect.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row, true)
            })
          }
        }, 0)
      },
      handleSelectionChange (selects) {
        this.selectedVal = []
        // this.itemIds.forEach(item => {
        //   this.selectedVal.push(Object.assign({}, item))
        // })
        selects.forEach(item => {
          this.selectedVal.push(item)
        })
      },
      saveSelectVal () {
        this.$emit('selectChange', this.selectedVal)
        this.onDialogClose()
      },
      checkSelectable (row) {
        return !row.checked
      },
      query (refresh) {
        this.loading = true
        if (refresh) {
          this.offset = 0
        }
        var params = Object.assign({}, this.queryObj, this.listParams)
        params.offset = this.offset
        params.pagesize = this.pagesize
        this.toRelatedData = []
        this.loading = true
        if (this.queryObj) {
          this.queryObj.serviceClassification = this.queryObj.serviceClassification ? this.queryObj.serviceClassification : ''
        }
        relapi.listByQuery(params).then(results => {
          if (results) {
            this.toRelatedData = results.data
            this.totalCount = results.totalCount
            this.loading = false
            this.toRelatedData.forEach((item, index) => {
              this.itemIds.forEach(item1 => {
                if (item.id === item1.id) {
                  this.toRelatedData.splice(index, 1, item1)
                }
              })
            })
          }
        })
      }
    },
    watch: {
      dialog (newVal) {
        if (newVal) {
          this.queryObj.serviceClassification = ''
          this.queryObj.name = ''
          this.query()
        }
      }
    }
  }
</script>
<style scoped>
#service-select .el-dialog__body{padding-top:0; background: #fff;}
#service-select .el-form .el-form-item{margin-right: 10px;}
</style>

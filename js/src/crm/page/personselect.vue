<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" class="ui_dialog_02">
    <div id="personselect">
      <div>
        <el-row class="mb20">
          <el-col :span="24">
            <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
          </el-col>
        </el-row>
        <el-table
          :data="tableData"
          ref="table"
          @selection-change="setSelectData"
          @current-change="setCurrentData"
          row-key="id"
          height="300"
          max-height="300"
          border>
          <el-table-column type="selection" reserve-selection width="150" v-if="!isradio"></el-table-column>
          <el-table-column
            v-if="isradio"
            width="150"
            align="center">
            <template slot-scope="scope">
              <el-radio :label="scope.row" v-model="radioed">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="departmentObject.name"
            label="部门"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            min-width="200">
          </el-table-column>
        </el-table>
        <ever-pagination
          class="mb20"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount" :current="current">
        </ever-pagination>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="saveSelectVal">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import api from '../../warehouse/store/staffapi'
  import depart from '../../warehouse/store/departmentapi'
  import utillist from '../../util/list'
  let querySchema = [
    {
      name: 'departmentId',
      type: 'select',
      options: [],
      label: '',
      placeholder: '适用部门'
    },
    {
      name: 'name',
      placeholder: '姓名',
      class: 'searchtext',
      label: ''
    }
  ]
  export default {
    props: ['initdata', 'isradio', 'feedbackdata', 'feed', 'title', 'visible'],
    mixins: [utillist],
    data () {
      let queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        querySchema: querySchema,
        api: api,
        queryObj: queryObj,
        depart: depart,
        selected: [],
        radioed: '',
        dialogVisible: false
      }
    },
    watch: {
      radioed (val) {
        this.selected = [val]
      },
      visible (val) {
        this.dialogVisible = val
        this.getDptList(querySchema, 'departmentId')
      },
      dialogVisible (val) {
        this.$emit('update', val)
      }
    },
    created () {
      this.getDptList(querySchema, 'departmentId')
      this.api.list().then(rs => {
        if (rs.length > 0) {
          this.$nextTick(_ => {
            rs.filter((item, index) => {
              this.initdata && this.initdata.forEach(rs => {
                if (rs) {
                  if (item.id === rs.doctorId) {
                    this.$refs.table.toggleRowSelection(this.tableData[index])
                  } else if (item.id === rs) {
                    this.$refs.table.setCurrentRow(this.tableData[index])
                  }
                }
              })
            })
          })
          this.tableData = rs
        }
      })
    },
    methods: {
      closeEvent () {
        this.$emit('close', false)
      },
      saveSelectVal () {
        if (this.feed && this.selected.length > 1) {
          this.$message.warning({message: '最多只能选择 1 项', duration: 1000})
          return false
        }
        this.$emit('select', this.selected)
      },
      setSelectData (val) {
        this.selected = val
      },
      setCurrentData (val) {
        this.radioed = val
        this.selected = [val]
      },
      getDptList (schema, name) {
        let dpt = this.$ever.getFieldFromSchema(schema, name)
        this.depart.list().then(rs => {
          dpt.options = rs
        })
      }
    }
  }
</script>
<style scoped>
  #personselect .el-form {margin-left: -15px;}
  #personselect .el-form .el-form-item{margin-right: 0;margin-left: 15px;display:inline-block;}
  .dialog-footer{float:right;}
  .mt20{margin-top:-35px;}
</style>

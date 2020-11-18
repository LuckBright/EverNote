<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" class="ui_dialog_02">
    <div id="userselect">
      <el-row>
        <el-col>
          <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        @selection-change="setSelectData"
        @current-change="setCurrentData"
        ref="selectUserTable"
        row-key="id"
        max-height="350"
        height="350"
        class="mb20"
        border>
        <el-table-column type="selection" reserve-selection width="50" v-if="!isradio"></el-table-column>
        <el-table-column
          v-if="isradio"
          width="55"
          align="center">
          <template slot-scope="scope">
            <el-radio :label="scope.row" v-model="radioed">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="patientNumber" label="患者档案号" width="120"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center" min-width="120"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center" width="100">
          <template slot-scope="scope">
            <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" align="center" width="100"></el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center" max-width="180"></el-table-column>
        <el-table-column prop="certificateType" label="证件类型" align="center" width="120">
          <template slot-scope="scope">
            <sys-value v-if="scope.row.iden" type="CV02.01.101" :code="scope.row.iden.type"></sys-value>
            <span v-if="!scope.row.iden">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="iden" label="证件号码" max-width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.iden">{{scope.row.iden.idNo}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        class="mb20"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount" :current="current">
      </ever-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="saveSelectVal">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import api from '../store/userapi'
  import utillist from '../../util/list'
  let querySchema = [
    {
      name: 'name',
      type: 'text',
      label: '姓名'
    },
    {
      name: 'mobile',
      type: 'text',
      label: '手机号'
    }
  ]
  export default {
    props: ['initdata', 'isradio', 'title', 'visible', 'patientId'],
    mixins: [utillist],
    data () {
      let queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        querySchema,
        api: api,
        queryObj: queryObj,
        selected: [],
        radioed: '',
        tableData: [],
        dialogVisible: false
      }
    },
    watch: {
      radioed (val) {
        this.selected = [val]
      },
      visible (val) {
        this.dialogVisible = val
        return val && this.patientId && this.api.getById({
          id: this.patientId
        }).then(rs => {
          this.$nextTick(_ => {
            this.tableData.filter((item, index) => {
              if (item.id === rs.data.id) {
                this.$refs.selectUserTable.setCurrentRow(this.tableData[index])
              }
            })
          })
        })
      },
      dialogVisible (val) {
        this.$emit('update', val)
      }
    },
    created () {
      if (this.isradio) {
        this.radioed = this.initdata
      } else {
        this.selected = this.initdata || []
      }
    },
    methods: {
      closeEvent () {
        this.$emit('close', false)
      },
      saveSelectVal () {
        this.$emit('select', this.selected)
      },
      setSelectData (val) {
        this.selected = val
      },
      setCurrentData (val) {
        this.radioed = val
        this.selected = [val]
      },
      pageAfter () {
        return this.selected && this.selected.forEach(row => {
          if (row) {
            this.$refs.selectUserTable.toggleRowSelection(row, true)
          }
        })
      }
    }
  }
</script>
<style scoped>
  #userselect .el-form {margin-left: -15px;}
  #userselect .el-form .el-form-item{margin-right: 0;margin-left: 15px;}
  #userselect .el-table td,#userselect .el-table th{line-height: initial;}
</style>

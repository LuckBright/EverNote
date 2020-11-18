<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" class="ui_dialog_02">
    <div id="questionselect">
      <el-row>
        <el-col :span="24">
          <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        </el-col>
      </el-row>
      <el-table :data="tableData" border>
        <el-table-column width="55" align="center">
          <template slot-scope="scope">
            <el-radio :label="scope.row" v-model="selected">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="sn" label="问卷ID" width="130" align="center"></el-table-column>
        <el-table-column prop="name" label="问卷名称" min-width="200" align="center"></el-table-column>
        <el-table-column label="适用科室" prop="dptName" align="center" width="120"></el-table-column>
        <el-table-column prop="creatorName" label="创建人" align="center" width="160"></el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type @click="closeEvent">
        <i class="iconfont icon-quxiao"></i>取消
      </el-button>
      <el-button type="primary" @click="saveSelectVal">
        <i class="icon iconfont icon-tijiao"></i>确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '../store/questionapi'
import depart from '../../warehouse/store/departmentapi'
import utillist from '../../util/list'
let querySchema = [
  {
    name: 'dptId',
    type: 'select',
    label: '',
    placeholder: '适用科室',
    options: [{ name: '全部科室', id: -1 }]
  },
  {
    name: 'name',
    placeholder: '问卷名称/医生',
    class: 'searchtext',
    label: ''
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      api: api,
      depart: depart,
      queryObj: queryObj,
      selected: '',
      tableData: [],
      dialogVisible: false
    }
  },
  props: ['title', 'visible'],
  created () {
    this.depart.list().then(rs => {
      this.$ever.getFieldFromSchema(querySchema, 'dptId').options = rs.list
    })
  },
  methods: {
    closeEvent () {
      this.$emit('update', false)
    },
    saveSelectVal () {
      this.$emit('select', this.selected)
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('update', val)
    }
  }
}
</script>
<style scoped>
#questionselect .el-form {
  margin-left: -15px;
}
#questionselect .el-form .el-form-item {
  margin-right: 0;
  margin-left: 15px;
}
</style>

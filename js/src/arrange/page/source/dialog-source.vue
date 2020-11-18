<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    class="source ui_dialog_02"
    width="1000px"
    :before-close="close"
  >
    <div>
      <ever-query-form :schema="schema" v-model="queryObj" @query="query"></ever-query-form>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="resourceName" label="名称"></el-table-column>
        <el-table-column prop="resourceTypeName" label="类型"></el-table-column>
        <el-table-column prop="relateId" label="ID"></el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
        ></ever-pagination>
      </el-row>
    </div>
    <div slot="footer">
      <span class="count">
        已选中
        <span>{{count}}</span>个资源
      </span>
      <el-button type="primary" @click="getData">导入</el-button>
    </div>
  </el-dialog>
</template>
<script>
let schema = [
  {
    name: 'resourceType',
    type: 'select',
    placeholder: '请输入',
    label: '资源类型',
    options: [],
    clearable: true,
    useValue: true
  }]
import api from '@/arrange/store/dialogsourceapi'
import sourceapi from '@/arrange/store/sourceapi'
import list from '@/util/list'

export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      sourceapi,
      visible: false,
      title: '导入资源',
      tableData: [],
      schema,
      queryObj,
      count: 0,
      postData: []
    }
  },
  methods: {
    getSubResourceType () {
      this.sourceapi.getSubResourceType().then(rs => {
        if (rs && rs.data && rs.data.length > 0) {
          rs.data.map(v => {
            v.value = v.code
          })
          this.$ever.getFieldFromSchema(schema, 'resourceType').options = rs.data
          this.queryObj.resourceType = rs.data[0].code
        }
      })
    },
    handleSelectionChange (val) {
      if (val && val.length > 0) {
        this.postData = val
        this.count = val.length
      } else {
        this.count = 0
      }
      this.multipleSelection = val
    },
    onDialogOpen (flag) {
      this.visible = true
      if (this.visible) {
        this.getSubResourceType()
        this.list()
      }
    },
    close () {
      this.visible = false
      this.$emit('update:visible', false)
    },
    getData () {
      if (this.count === 0) {
        this.$notify({
          title: '警告',
          message: '请先选择需要导入的资源',
          type: 'warning'
        })
      } else {
        let obj = {}
        let postArr = []
        this.postData.map(v => {
          obj.resourceName = v.resourceName
          obj.resourceType = v.resourceType
          obj.relateId = v.relateId
          obj.sourceCode = v.sourceCode
          postArr.push(obj)
          obj = {}
        })
        this.api.getAvailableTimeTrunk(postArr).then(rs => {
          if (rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '导入成功', '成功')
            this.list()
            this.visible = false
            this.$emit('list')
          } else {
            this.$messageTips(this, 'warning', '导入失败', '失败')
          }
        })
      }
    }
  },
  components: {

  }
}
</script>
<style scoped>
.count {
  position: absolute;
  left: 30px;
  font-size: 14px;
  color: #999999;
  line-height: 35px;
}
.count span {
  color: red;
}
</style>

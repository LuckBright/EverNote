<template>
  <div class="min-height bg">
    <div class="bg pdb20 pdt20">
      <el-row>
        <el-col :span="24" align="right">
          <el-button type="primary" @click="addRow">新建分类</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="bg pdb20">
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" border>
            <el-table-column prop="name" label="分类名称" :span="2" align="center"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" :span="2"></el-table-column>
            <el-table-column label="创建人" align="center" prop="creatorName" :span="2"></el-table-column>
            <el-table-column label="操作" align="center" :span="2">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="edit(scope.row.id)">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteRow(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <dialog-classify :id="id" :visible="dialogVisible" @close="close" @update="update"></dialog-classify>
  </div>
</template>
<script>
import api from '@/crm/store/healthy/followapi'
import dialogClassify from './dialog.classify'
let querySchema = [
  {
    name: 'name',
    label: '分类名称',
    comp: 'el-input',
    props: {
      placeholder: '请输入客户姓名'
    }
  }
]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api: api,
      queryObj,
      querySchema,
      id: '',
      dialogVisible: false,
      tableData: []
    }
  },
  created () {
    this.getAllImageText()
  },
  methods: {
    getAllImageText () {
      api.getAllImageText().then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data
        }
      })
    },
    edit (val) {
      this.id = val
      this.dialogVisible = true
    },
    addRow () {
      // todo addrow
      this.id = null
      this.dialogVisible = true
    },
    deleteRow (val) {
      this.$confirm('你确定要删除该表单分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteClassify({ 'id': val }).then(rs => {
          if (rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功!')
            this.getAllImageText()
          }
        })
      }).catch(() => {
        return false
      })
    },
    close () {
      this.dialogVisible = false
    },
    update () {
      this.dialogVisible = false
      this.getAllImageText()
    }
  },
  components: {
    dialogClassify
  }
}
</script>
<style scoped>
.min-height {
  min-height: 100%;
}
</style>

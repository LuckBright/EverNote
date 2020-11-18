<template>
  <div>
    <div class="bg pd20 pbb">
      <el-row>
        <el-col :span="20">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            ref="form"
            :inline="true"
            :is-query="true"
            @query="getByCategory(queryObj.name)"
          ></ever-form2>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" @click="addRow">添加图文</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="bg pdb20">
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" border>
            <el-table-column prop="name" label="图文名称" :span="2" align="center"></el-table-column>
            <el-table-column label="分类" prop="categoryName" :span="2"></el-table-column>
            <el-table-column label="添加时间" align="center" prop="createTime" :span="2"></el-table-column>
            <el-table-column label="添加人" align="center" prop="creatorName" :span="2"></el-table-column>
            <el-table-column label="操作" align="center" :span="2">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="linkurlDetail(scope.row)">预览</el-button>
                <el-button type="primary" size="small" @click="showDialog(scope.row.id)">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteRow(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <dialog-addimgtext
      :title="`图文`"
      :id="imgId"
      :visible="dialogVisible"
      @close="close"
      @update="update"
    ></dialog-addimgtext>
  </div>
</template>
<script>
import api from '@/crm/store/healthy/followapi'
import dialogAddimgtext from '@/crm/page/healthy/dialog.addimgtext'
let querySchema = [
  {
    name: 'name',
    label: '分类名称',
    comp: 'ever-select',
    props: {
      options: [],
      placeholder: '分类名称'
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
      imgId: '',
      dialogVisible: false,
      tableData: []
    }
  },
  watch: {
    'queryObj.name': {
      handler: function (val) {
        val && this.getByCategory(val)
      },
      deep: true
    }
  },
  created () {
    this.getAllImageText()
  },
  methods: {
    getAllImageText () {
      api.getAllImageText().then(rs => {
        if (rs.head.errCode === 0) {
          this.$ever.getFieldFromSchema(
            this.querySchema,
            'name'
          ).props.options = rs.data
          this.queryObj.name = rs.data[0].id
        }
      })
    },
    getByCategory (id) {
      api.getByCategory({ category: id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data
          this.queryObj.name = id
        }
      })
    },
    linkurlDetail (val) {
      window.open(val.url)
    },
    addRow () {
      this.imgId = null
      this.dialogVisible = true
    },
    showDialog (id) {
      this.imgId = id
      this.dialogVisible = true
    },
    deleteRow (val) {
      this.$confirm('您确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.deleteImg({ id: val }).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '删除成功!')
              this.getByCategory(this.queryObj.name)
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    close () {
      this.dialogVisible = false
    },
    update (id) {
      this.dialogVisible = false
      this.getByCategory(id)
    }
  },
  components: {
    dialogAddimgtext
  }
}
</script>
<style scoped>
.pbb {
  padding-bottom: 0px;
}
</style>

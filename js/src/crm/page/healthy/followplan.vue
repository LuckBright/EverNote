<template>
  <div class="bg min-height">
    <div class="bg pd20 pbb">
      <el-row>
        <el-col>
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            ref="form"
            :inline="true"
            :is-query="true"
            v-ever-bind-enter
            @query="list(true)"
          >
            <template slot="name">
              <el-select
                filterable
                remote
                reserve-keyword
                clearable
                style="width:100%"
                v-model="queryObj.name"
                :maxlength="50"
                :remote-method="querySearch"
                placeholder="请输入随访计划名称"
              >
                <el-option
                  v-for="item in options"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </template>
            <template slot="default">
              <el-form-item>
                <el-button @click="list(true)">查询</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
              <el-form-item class="fr">
                <el-button type="primary" @click="linkDetail">新建随访计划</el-button>
              </el-form-item>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
    </div>
    <div class="bg pdb20">
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" border>
            <el-table-column prop="name" label="随访计划名称" :span="2" align="center"></el-table-column>
            <el-table-column label="适用科室" prop="dptNames" :span="2"></el-table-column>
            <el-table-column label="适用场景" align="center" prop="sceneNames" :span="2"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="随访计划说明"
              align="center"
              prop="comment"
              :span="2"
            ></el-table-column>
            <el-table-column label="创建人" prop="creatorName" align="center" :span="2"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" :span="2"></el-table-column>
            <el-table-column label="操作" align="center" :span="2">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="linkEdit(scope.row.id)">编辑</el-button>
                <el-button type="primary" size="small" @click="linkTask(scope.row.id)">添加</el-button>
                <el-button type="danger" size="small" @click="deleteRow(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
          ></ever-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '@/crm/store/healthy/followapi'
import utillist from '@/util/list'
let querySchema = [
  {
    name: 'name',
    label: '随访计划',
    comp: 'custom'
  }
  // {
  //   name: 'scene',
  //   label: '适用场景',
  //   comp: 'sys-type',
  //   props: {
  //     code: 'THC_APPLICABLE_SCENE',
  //     useValue: true
  //   },
  //   span: 20
  // }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api: api,
      querySchema: querySchema,
      queryObj: queryObj,
      tableData: [],
      options: []
    }
  },
  created () {
    this.list()
  },
  methods: {
    linkEdit (id) {
      this.$router.push({ path: 'createfollow/' + id })
    },
    linkDetail () {
      this.$router.push({ path: 'createfollow' })
    },
    linkTask (id) {
      this.$router.push({ path: 'followtask/' + id })
    },
    deleteRow (val) {
      this.$confirm('您确定要删除这些随访吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.api.deleteModel({ id: val }).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '删除成功!')
              this.list(this.queryObj)
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    reset () {
      this.queryObj = this.$ever.createObjFromSchema(querySchema)
      this.list(true)
    },
    querySearch (val, callback) {
      this.api.list({ name: val.trim() }).then(rs => {
        if (rs.data.resultList) {
          this.options = rs.data.resultList
        } else {
          this.options = []
        }
      })
    }
  }
}
</script>
<style scoped>
.bg {
  background-color: #fff;
}
.mgt20 {
  margin-top: 20px;
}
.border-b {
  border-bottom: 1px #eeeeee solid;
}
.boldspan {
  font-weight: bold;
}
.class-a {
  color: #1c7bef;
}
.min-height {
  min-height: 100%;
}
.pbb {
  padding-bottom: 0px;
}
</style>

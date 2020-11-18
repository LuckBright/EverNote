  <template>
  <div>
    <div class="flex_column_full_hidden layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          @query="list"
          :is-query="true"
          :inline="true"
        >
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <router-link :to="`${rootPath}formschemas/-1`">
                <el-button type="primary">创建表单</el-button>
              </router-link>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <div class="flex_col_1_hidden main-wrap">
        <el-table height="100%" border :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="400"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="businessCode" label="编码"></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <router-link :to="`${rootPath}forms/${scope.row.id}`">
                <el-button type="text" size="small">管理数据</el-button>
              </router-link>
              <router-link :to="`${rootPath}formschemas/${scope.row.id}`">
                <el-button type="text" size="small">编辑表单</el-button>
              </router-link>
              <ever-confirm
                :msg="'确定删除 '+scope.row.name+' ？'"
                action="删除"
                @confirm="del(scope.row.id, scope.row)"
              ></ever-confirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>

<script>
import formapi from '../store/api'
import list from '@/util/list'
export default {
  mixins: [list],
  data () {
    let querySchema = [
      {
        name: 'name',
        label: '名称'
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.designerId = '1'
    return {
      tableData: [],
      querySchema,
      queryObj,
      listApiName: 'getTpls',
      api: formapi
    }
  },
  computed: {
    rootPath () {
      return `${this.$route.matched[0].path}/`
    }
  },
  methods: {
    del (id) {
      formapi.delTpl(id).then(_ => {
        this.list(true)
      })
    }
  }
}
</script>

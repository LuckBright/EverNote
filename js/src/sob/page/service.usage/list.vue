<template>
  <div class="layout_inner" :class="className">
    <el-row lass="main-head">
      <el-col :span="22">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          :inline="true"
          :is-query="true"
          @query="list()"
        ></ever-form2>
      </el-col>
      <el-col :span="2" class="main-option" align="right">
        <el-button type="primary" @click="importUsage">导入</el-button>
      </el-col>
    </el-row>
    <el-table class="ever-table-wrap" v-loading.body="loading" :data="tableData" style="width: 100%" :border="false">
      <el-table-column width="200" prop="usage" label="用法">
        <template slot-scope="scope">
          <sys-value type="CV06.00.102" :code="scope.row.usage"></sys-value>
        </template>
      </el-table-column>
      <el-table-column prop="itemDto" label="收费项目">
        <template slot-scope="scope">
          <template v-if="scope.row.itemDto && scope.row.itemDto.length">
            <span v-for="(item, index) in scope.row.itemDto" :key="index">
              {{item.serviceName}}*{{item.count}}{{item.unitName}}
              <template
                v-if="scope.row.itemDto.length > 1 && index !== (scope.row.itemDto.length - 1)"
              >，</template>
            </span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="$router.push($route.path + `/${scope.row.id}`)"
          >编辑</el-button>
          <ever-confirm :msg="'确定删除该项？'" action="删除" @confirm="del(scope.row.id, scope.row)"></ever-confirm>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </el-row>
    <import-usage-dialog ref="importUsageDialog" title="导入用法" @update="list()"></import-usage-dialog>
  </div>
</template>

<script>
import api from '../../store/service.usage'
import list from '@/util/list'
import importUsageDialog from './import.usage.dialog'
export default {
  props: {
    className: String
  },
  mixins: [list],
  data () {
    let schema = [
      {
        name: 'usage',
        label: '用法',
        comp: 'sys-type',
        props: {
          code: 'CV06.00.102',
          clearable: true
        }
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      tableData: [],
      querySchema: schema,
      queryObj: obj
    }
  },
  components: {
    importUsageDialog
  },
  methods: {
    importUsage () {
      this.$refs.importUsageDialog.open()
    },
    afterList (result) {
      // 兼容当前页数据全部删除后不更新列表的问题
      if (result && result.data && result.totalCount > 0 && result.data.length < 1) {
        this.current -= 1
        this.offset -= this.pagesize
        this.list()
      }
    }
  }
}
</script>

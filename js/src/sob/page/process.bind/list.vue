<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        :is-query="true"
        @query="list()"
        >
        <template slot="serviceItems">
          <service-select
            class="service_select"
            v-model="queryObj.serviceItems"
            value-key="id"
            :type="queryObj.serviceClassification"
            :scene="queryObj.usageScene ? Number(queryObj.usageScene) : ''"
            belongType="1"
          ></service-select>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list()">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <router-link :to="$route.meta.childNavPath">
              <el-button type="primary">新建</el-button>
            </router-link>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <el-table class="ever-table-wrap" v-loading.body="loading" :data="tableData" :border="false">
      <el-table-column prop="processName" label="流程名称"></el-table-column>
      <el-table-column prop="serviceClassification" label="物资分类">
        <template slot-scope="scope">
          <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
        </template>
      </el-table-column>
      <el-table-column prop="serviceName" label="物资名称"></el-table-column>
      <el-table-column prop="orgName" label="机构名称"></el-table-column>
      <el-table-column prop="isValid" label="状态">
        <template slot-scope="scope">
          <sys-value type="THC_SOB_AVAILABLE_STATE" :code="scope.row.isValid"></sys-value>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="150">
        <template slot-scope="scope">
          <router-link :to="$route.meta.childNavPath + scope.row.id">
            <el-button type="primary" size="small">编辑</el-button>
          </router-link>
          <ever-confirm :msg="'确定删除？'" @confirm="del(scope.row.id, scope.row)"></ever-confirm>
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
  </div>
</template>

<script>
import api from '@/sob/store/process.bind.api'
import list from '@/util/list'
export default {
  data () {
    let schema = [
      {
        name: 'serviceClassification',
        label: '物资分类',
        comp: 'sys-type',
        props: {
          code: 'THC_WH_OBJECT_SUB_TYPE'
        }
      },
      {
        name: 'usageScene',
        label: '使用场景',
        comp: 'sys-type',
        props: {
          useValue: true,
          code: 'THC_SYS_SCENE'
        }
      },
      {
        name: 'serviceItems',
        label: '医嘱项目',
        comp: 'custom'
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
  mixins: [list],
  methods: {
    async del (id) {
      const res = await api.del(id)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '删除成功！', '提示')
        this.list()
      }
    }
  },
  watch: {
    'queryObj.serviceItems': {
      handler (val) {
        this.queryObj.serviceId = (val && val.id) ? val.id : ''
      },
      deep: true
    },
    'queryObj.serviceClassification' () {
      this.queryObj.serviceItems = ''
    }
  }
}
</script>

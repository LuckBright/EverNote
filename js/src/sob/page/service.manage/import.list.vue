<template>
  <div>
    <div class="main-head">
      <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
    </div>
    <el-table
      v-loading.body="loading"
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="医嘱项目名称"></el-table-column>
      <el-table-column prop="serviceClassification" label="物资分类">
        <template slot-scope="scope">
          <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
        </template>
      </el-table-column>
      <el-table-column prop="isValid" label="状态">
        <template slot-scope="scope">
          <sys-value type="THC_SOB_AVAILABLE_STATE" :code="scope.row.orgServiceRelation.isValid"></sys-value>
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
import api from '@/sob/store/service.import/service'
import editapi from '../../store/serviceeditapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import list from '@/util/list'

export default {
  mixins: [list],
  data () {
    let schema = [
      {
        name: 'serviceClassificationList',
        type: 'cascader',
        label: '物资分类',
        options: [],
        clearable: true,
        filterable: true
      },
      {
        name: 'isValids',
        type: 'systype',
        code: 'THC_SOB_AVAILABLE_STATE',
        useValue: true,
        label: '状态',
        clearable: true
      },
      {
        name: 'name',
        type: 'text',
        label: '医嘱项目名称',
        clearable: true
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.serviceClassificationList = []
    // obj.serviceBelongType = 1
    return {
      api,
      tableData: [],
      querySchema: schema,
      queryObj: obj,
      serviceImportFlag: false,
      belong: this.$route.params.belong,
      serviceIds: [],
      noStoreQuery: true,
      pagesize: 20
    }
  },
  props: ['updateList'],
  created () {
    this.query()
    this.getClassOptions()
  },
  methods: {
    getClassOptions () {
      sysvalue.cascade(
        'THC_WH_OBJECT_TYPE', ['798']).then(options => {
          if (options[0] && options[0].children) {
            this.$ever.getFieldFromSchema(this.querySchema, 'serviceClassificationList').options = options[0].children
          }
        })
    },
    query () {
      if (this.queryObj.serviceClassificationList && this.queryObj.serviceClassificationList.length) {
        this.queryObj.serviceClassification = this.queryObj.serviceClassificationList[0]
        if (this.queryObj.serviceClassificationList.length > 1) {
          this.queryObj.threeServiceClassify = this.queryObj.serviceClassificationList[1]
        } else {
          this.queryObj.threeServiceClassify = ''
        }
      } else {
        this.queryObj.serviceClassification = ''
        this.queryObj.threeServiceClassify = ''
      }
      if (this.queryObj.isValids) {
        this.queryObj.isValid = Number(this.queryObj.isValids)
      } else {
        delete this.queryObj.isValid
      }
      this.queryObj.filterMaterial = true
      this.queryObj.managerPermission = 1
      // this.queryObj.managerPermission = 0
      this.list()
    },
    handleSelectionChange (val) {
      this.serviceIds = []
      if (val && val.length) {
        val.forEach(item => {
          this.serviceIds.push(item.id)
        })
      }
    },
    openServiceImportDialog () {
      this.serviceImportFlag = true
    },
    selectImport () {
      this.$refs.importSelect.open()
    },
    async importTenantService () {
      const res = await editapi.importTenantService()
      console.log(res)
    }
  },
  watch: {
    'tableData' (val) {
      if (val.length) {
        val.forEach(e => {
          e.serviceType = String(e.serviceType)
        })
      }
    },
    '$route.params.belong' (val) {
      this.belong = val
    },
    'updateList' (val) {
      if (val) {
        this.query()
      }
    },
    'queryObj.serviceClassificationList' (val) {
      this.query()
    }
  }
}
</script>

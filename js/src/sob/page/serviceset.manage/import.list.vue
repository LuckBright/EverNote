<template>
  <div>
    <div class="main-head">
      <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
    </div>
    <el-table
      v-loading.body="loading"
      :data="tableData"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column align="center" label="物资分类">
        <template slot-scope="scope">
          <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceSetClassification"></sys-value>
        </template>
      </el-table-column>
      <el-table-column prop="isValid" align="center" label="状态" width="55">
        <template slot-scope="scope">
          <sys-value type="THC_SOB_AVAILABLE_STATE" :code="scope.row.isValid"></sys-value>
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

import api from '@/sob/store/service.import/serviceset'
import sysvalue from '@/warehouse/store/sysvalueapi'
import list from '@/util/list'
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
    label: '项目名称',
    clearable: true
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.serviceClassificationList = []
    // obj.belongType = 1
    return {
      api,
      tableData: [],
      querySchema: schema,
      queryObj: obj,
      servSetIds: [],
      noStoreQuery: true
    }
  },
  props: ['updateList'],
  created () {
    this.query()
    this.getClassOptions()
  },
  methods: {
    getClassOptions () {
      let zhenliaoThird = []
      sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(result => {
        result.forEach(item => {
          let flag = false
          zhenliaoThird.forEach(val => {
            if (item.parentId === val.id) {
              flag = true
              val.children.push({
                value: item.value || item.id,
                label: item.name,
                id: item.id,
                erpCode: item.erpCode
              })
            }
          })
          if (!flag) {
            zhenliaoThird.push({
              value: item.value || item.id,
              label: item.name,
              id: item.id,
              erpCode: item.erpCode,
              children: []
            })
          }
        })
      })
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
      // this.queryObj.usePermission = 1
      // this.queryObj.managerPermission = 0
      this.list()
    },
    handleSelectionChange (val) {
      this.servSetIds = []
      if (val && val.length) {
        val.forEach(item => {
          this.servSetIds.push(item.id)
        })
      }
    }
  },
  watch: {
    'updateList' (val) {
      if (val) this.query()
    },
    'queryObj.serviceClassificationList' (val) {
      this.query()
    }
  }
}
</script>

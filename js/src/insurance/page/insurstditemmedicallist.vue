<template>
  <div>
    <ever-bread-crumb></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
        </ever-query-form>
        <div class="main-option">
          <router-link :to="{name: 'insurStdItemMedicaladd', params: {medicalId: $route.params.id}}">
            <el-button type="primary">新建</el-button>
          </router-link>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        border>
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center">
        </el-table-column>
        <el-table-column
          prop="stdSrvItemCode"
          width="120"
          label="服务项目编码"
          align="center">
        </el-table-column>
        <el-table-column
          prop="stdSrvItemName"
          width="220"
          label="服务项目名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="medicalCode"
          width="320"
          label="药品编码"
          align="center">
        </el-table-column>
        <el-table-column
          prop="medicalName"
          width="220"
          label="药品名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="payRatio"
          label="保险支付比例"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="stdFeeClass"
          label="收费类别"
          width="120"
          align="center">
          <template slot-scope="scope">
            <sys-value type="THC_RCM_CLASS_MED_CLASS" :code="String(scope.row.stdFeeClass)"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          prop="chargeLevel"
          width="120"
          label="收费等级"
          align="center">
          <template slot-scope="scope">
            {{api.levelObj[scope.row.chargeLevel]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="drugForm"
          width="120"
          label="药品剂型"
          align="center">
          <template slot-scope="scope">
            <sys-value type="THC_WH_DRUG_FORM" :code="scope.row.drugForm"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          prop="specification"
          width="120"
          label="规格"
          align="center">
        </el-table-column>
        <el-table-column
          prop="isClinic"
          label="门诊使用标识"
          width="120"
          align="center"
          :formatter="formatBoolean">
        </el-table-column>
        <el-table-column
          prop="isHospitalize"
          label="住院使用标识"
          width="120"
          align="center"
          :formatter="formatBoolean">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          width="150"
          fixed="right"
          align="center">
          <template slot-scope="scope">
            <el-button-group>
              <router-link :to="{name: 'insurStdItemMedicalEdit', params: {id: scope.row.id, medicalId: $route.params.id}}">
                <el-button size="small" type="primary">编辑</el-button>
              </router-link>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount" :current="current">
        </ever-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '../store/insurstditemmedicalapi'
import insuranceapi from '@/insurance/store/insuranceorgapi'
import list from '../../util/list'

let schema = [
  {
    name: 'code',
    label: '保险公司编号',
    disabled: true
  },
  {
    name: 'insuranceOrgCnName',
    label: '保险公司简称',
    disabled: true
  },
  {
    name: 'stdFeeClass',
    label: '收费类别',
    type: 'systype',
    code: 'THC_RCM_CLASS_MED_CLASS'
  },
  {
    name: 'serviceName',
    label: '项目名称'
  }
]
export default {
  mixins: [list],
  created () {
    if (this.$route.params.id) {
      insuranceapi.getById(this.$route.params.id)
        .then(result => {
          Object.assign(this.queryObj, result)
          // this.getSystypeinfo(this.systype.code)
        })
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      listParams: {insuranceOrgID: this.$route.params.id}
    }
  },
  methods: {
  },
  beforeCreate () {
    this.api = api
  }
}
</script>

<template>
  <div>
    <ever-bread-crumb name="诊疗项目维护"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <router-link :to="'/manages/insurstditemtreatadd/' + $route.params.id">
            <el-button type="primary">新建</el-button>
          </router-link>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
        <el-table-column prop="stdSrvItemCode" label="服务项目编码" width="120" align="center"></el-table-column>
        <el-table-column prop="stdSrvItemName" label="服务项目名称" width="220" align="center"></el-table-column>
        <el-table-column prop="itemCode" label="医嘱项目编码" width="320" align="center"></el-table-column>
        <el-table-column prop="itemName" label="医嘱项目名称" width="220" align="center"></el-table-column>
        <el-table-column prop="clinicBillCode" label="门诊账单码" width="120" align="center"></el-table-column>
        <el-table-column prop="clinicFeeClass" label="门诊收费类别" width="120" align="center">
          <template slot-scope="scope">
            <sys-value type="CV07.10.001" :code="String(scope.row.clinicFeeClass)"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="clinicBillName" label="门诊账单名称" width="120" align="center"></el-table-column>
        <el-table-column prop="hospitalBillCode" label="住院账单码" width="120" align="center"></el-table-column>
        <el-table-column prop="hospitalFeeClass" label="住院收费类别" width="120" align="center">
          <template slot-scope="scope">
            <sys-value type="CV07.10.002" :code="String(scope.row.hospitalFeeClass)"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="hospitalBillName" label="住院账单名称" width="120" align="center"></el-table-column>
        <el-table-column prop="price" label="收费价格" width="100" align="center"></el-table-column>
        <el-table-column prop="unit" label="收费单位" width="100" align="center"></el-table-column>
        <el-table-column prop="chargeLevel" label="收费等级" width="100" align="center">
          <template slot-scope="scope">{{api.levelObj[scope.row.chargeLevel]}}</template>
        </el-table-column>
        <el-table-column
          prop="effectiveDate"
          label="生效日期"
          width="100"
          align="center"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column
          prop="deleteFlag"
          label="删除标志"
          width="100"
          align="center"
          :formatter="formatBoolean"
        ></el-table-column>
        <el-table-column prop="annotation" label="注释" width="100" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" width="100" align="center"></el-table-column>
        <el-table-column prop="feeAccording" label="收费依据" width="100" align="center"></el-table-column>
        <el-table-column prop="chinaMedicalClass" label="中医分类" width="100" align="center">
          <template slot-scope="scope">
            <sys-value type="THC_RCM_CLASS_CHN_CLASS" :code="String(scope.row.chinaMedicalClass)"></sys-value>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="isHospitalize"
          label="住院使用标识"
          width="120"
          align="center"
          :formatter="formatBoolean">
        </el-table-column>-->
        <el-table-column prop label="操作" width="150" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/manages/insurstditemtreat/' + scope.row.id + '/' + $route.params.id)"
            >编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
  </div>
</template>
<script>
import api from '../store/insurstditemtreatapi'
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
    name: 'clinicFeeClass',
    label: '门诊收费类别',
    type: 'systype',
    code: 'CV07.10.001'
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
      listParams: { insuranceOrgID: this.$route.params.id }
    }
  },
  methods: {
  },
  beforeCreate () {
    this.api = api
  }
}
</script>

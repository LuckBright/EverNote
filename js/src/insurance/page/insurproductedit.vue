<template>
  <div>
    <ever-bread-crumb name="保险产品管理"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基础信息</h4>
        <ever-form-model :schema="schema" v-model="obj" :api="api" label-position="right"></ever-form-model>
        <h4 class="panel-hr">
          地区规则
          <el-button
            type="primary"
            class="optButton fr"
            size="small"
            @click="$router.push('/manages/insurproduct-areaadd/' + objId)"
          >新建</el-button>
        </h4>
        <el-table :data="areatableData" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="areaRuleCode" label="地区规则编号"></el-table-column>
          <el-table-column prop="areaRuleName" label="地区规则名称"></el-table-column>
          <el-table-column prop="description" label="地区规则描述"></el-table-column>
          <el-table-column prop="createTime" label="创建日期"></el-table-column>
          <el-table-column prop label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="$router.push('/manages/insurproduct-area/' + objId + '/' + scope.row.id)"
              >编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(insurProductAreaApi,scope.$index, scope.row, areatableData)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <h4 class="panel-hr">
          机构规则
          <el-button
            type="primary"
            class="optButton fr"
            size="small"
            @click="$router.push('/manages/insurproduct-clinicadd/' + objId)"
          >新建</el-button>
        </h4>
        <el-table :data="clinictableData" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="clinicRuleCode" label="适用医疗机构规则编号"></el-table-column>
          <el-table-column prop="clinicRuleName" label="适用医疗机构规则名称"></el-table-column>
          <el-table-column prop="description" label="适用医疗机构规则描述"></el-table-column>
          <el-table-column prop="createTime" label="创建日期"></el-table-column>
          <el-table-column prop label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="$router.push('/manages/insurproduct-clinic/' + objId + '/' + scope.row.id)"
              >编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(insurProductClinicApi,scope.$index, scope.row, clinictableData)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <h4 class="panel-hr">
          类别规则
          <el-button
            type="primary"
            class="optButton fr"
            size="small"
            @click="$router.push('/manages/insurproduct-classadd/' + objId)"
          >新建</el-button>
        </h4>
        <el-table :data="classtableData" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="classRuleCode" label="保险诊疗项目类别规则编号"></el-table-column>
          <el-table-column prop="classRuleName" label="保险诊疗项目类别规则名称"></el-table-column>
          <el-table-column prop="description" label="保险诊疗项目类别规则描述"></el-table-column>
          <el-table-column prop="createTime" label="创建日期"></el-table-column>
          <el-table-column prop label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="$router.push('/manages/insurproduct-class/' + objId + '/' + scope.row.id)"
              >编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(insurProductClassApi,scope.$index, scope.row, classtableData)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <h4 class="panel-hr">
          明细规则
          <el-button
            type="primary"
            class="optButton fr"
            size="small"
            @click="$router.push('/manages/insurproduct-itemadd/' + objId + '/' + insId)"
          >新建</el-button>
        </h4>
        <el-table :data="itemtableData" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="itemRuleCode" label="保险诊疗明细项目规则编号"></el-table-column>
          <el-table-column prop="itemRuleName" label="保险诊疗明细项目规则名称"></el-table-column>
          <el-table-column prop="description" label="保险诊疗明细项目规则描述"></el-table-column>
          <el-table-column prop="createTime" label="创建日期"></el-table-column>
          <el-table-column prop label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="$router.push('/manages/insurproduct-item/' + objId + '/' + scope.row.id + '/' + insId)"
              >编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(insurProductItemApi,scope.$index, scope.row, itemtableData)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <h4 class="panel-hr">
          支付规则
          <el-button
            type="primary"
            class="optButton fr"
            size="small"
            @click="$router.push('/manages/insurproduct-payadd/' + objId + '/' + insId)"
          >新建</el-button>
        </h4>
        <el-table :data="paytableData" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="payRuleCode" label="保险支付规则编号"></el-table-column>
          <el-table-column prop="payRuleName" label="保险支付规则名称"></el-table-column>
          <el-table-column prop="description" label="保险支付规则描述"></el-table-column>
          <el-table-column prop="createTime" label="创建日期"></el-table-column>
          <el-table-column prop label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="$router.push('/manages/insurproduct-pay/' + objId + '/' + scope.row.id + '/' + insId)"
              >编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(insurProductPayApi,scope.$index, scope.row, paytableData)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../store/insuranceproductapi'
import form from '../../util/form'

// import list from '../../util/list'
import insurProductAreaApi from '../store/insurproductareaapi'
import insurProductClinicApi from '../store/insurproductclinicapi'
import insurProductClassApi from '../store/insurproductclassapi'
import insurProductItemApi from '../store/insurproductitemapi'
import insurProductPayApi from '../store/insurproductpayapi'

let schema = [
  {
    name: 'productName',
    label: '保险产品',
    disabled: true
  },
  {
    name: 'enterpriseName',
    label: '保险团体名称',
    disabled: true
  },
  {
    name: 'insurGroupCode',
    label: '保险团体号',
    disabled: true
  },
  {
    name: 'insuranceOrgName',
    label: '保险公司名称',
    disabled: true
  }
]

export default {
  mixins: [form],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      schema: schema,
      obj: obj,
      api: api,
      insurProductAreaApi: insurProductAreaApi,
      insurProductClinicApi: insurProductClinicApi,
      insurProductClassApi: insurProductClassApi,
      insurProductItemApi: insurProductItemApi,
      insurProductPayApi: insurProductPayApi,
      objId: this.$route.params.id,
      insId: this.$route.params.insid,
      areatableData: [],
      clinictableData: [],
      classtableData: [],
      itemtableData: [],
      paytableData: []
    }
  },
  beforeCreate () {
    this.api = api
  },
  methods: {
    handleDelete (api, index, row, tableData) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return api.del(row.id)
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        tableData.splice(index, 1)
        // api.list(this.objId)
      })
    }
  },
  created: function () {
    insurProductAreaApi.list({
      insuranceProductID: this.objId
    }).then(result => {
      this.areatableData = result
    })

    insurProductClinicApi.list({
      insuranceProductID: this.objId
    }).then(result => {
      this.clinictableData = result.data
    })

    insurProductClassApi.list({
      insuranceProductID: this.objId
    }).then(result => {
      this.classtableData = result.data
    })

    insurProductItemApi.list({
      insuranceProductID: this.objId
    }).then(result => {
      this.itemtableData = result.data
    })

    insurProductPayApi.list({
      insuranceProductID: this.objId
    }).then(result => {
      this.paytableData = result.data
    })
  }
}
</script>

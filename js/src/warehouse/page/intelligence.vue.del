<template>
  <div>
    <ever-bread-crumb name="资质管理" path="/warehouse/intelligences"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          @objsaved="afterSave"
          label-position="right"
        ></ever-form-model>
      </div>
      <div class="panel-footer">
        <div>
          <el-button
            style="margin-left: 120px !important;"
            type="primary"
            @click="submitForm('form')"
          >保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

 <script>
import api from '../store/intelligenceapi'
import supplier from '../store/supplierapi'
import supplierprice from '../store/supplierprice'
import manufacturer from '../store/manufacturerapi'
import form from '@/util/form'
import { DRUGTYPE, MATERIALTYPE, EQUIPMENTTYPE } from '@/util/common'

var schema = [
  {
    name: 'code',
    label: '资质编码',
    disabled: true
  },
  {
    name: 'intelligenceType',
    label: '资质类型',
    code: 'THC_WH_QUALIFICATION_TYPE',
    type: 'systype'
  },
  {
    name: 'businessNature',
    label: '商家性质',
    type: 'systype',
    code: 'THC_WH_FIRM_TYPE'
  },
  {
    name: 'businessId',
    label: '商家名称',
    type: 'select',
    options: []
  },
  {
    name: 'materialType',
    label: '物资类型',
    type: 'systype',
    code: 'THC_WH_OBJECT_TYPE'
  },
  {
    name: 'intelligenceRange',
    label: '资质范围',
    type: 'systype',
    code: 'THC_WH_QUALIFICATION_SCOPE'
  },
  {
    name: 'intelligenceState',
    label: '资质状态',
    type: 'systype',
    code: 'THC_WH_QUALIFICATION_STATUS'
  },
  {
    name: 'enableDate',
    type: 'date',
    label: '生效日期',
    outformat: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    name: 'disableDate',
    type: 'date',
    label: '失效日期',
    outformat: 'yyyy-MM-dd HH:mm:ss'
  }
]
export default {
  mixins: [form],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      objId: this.$route.params.id,
      api,
      isSupplierId: false,
      options: [],
      rules: {
        // intelligenceType: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        // enableDate: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        // disableDate: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        // businessNature: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        // businessId: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        // materialType: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        // intelligenceRange: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        // intelligenceState: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    afterSave () {
      this.$router.push('/warehouse/intelligences')
    },
    manufacturerArr () {
      manufacturer.list({ intelligenceStatus: 2 }).then(result => {
        this.$ever.getFieldFromSchema(this.schema, 'businessId').options = result.list ? result.list : result
        this.$forceUpdate()
      })
    },
    drugArr (id) {
      let params = {
        materialType: id
      }
      if (this.isSupplierId) {
        params.supplierId = this.obj.businessId
      } else {
        params.manufacturerId = this.obj.businessId
      }
      supplierprice.naturelist(params).then(result => {
        result.list = result.list || []
        for (var insur of result.list) {
          if (id === DRUGTYPE) {
            insur.name = insur.drugObject.name
          } else if (id === MATERIALTYPE) {
            insur.name = insur.consumptiveMaterialObject.name
          } else if (id === EQUIPMENTTYPE) {
            insur.name = insur.equipmentObject.name
          }
        }
        this.$forceUpdate()
      })
    },
    supplierArr () {
      supplier.list({ intelligenceStatus: 2 }).then(result => {
        this.$ever.getFieldFromSchema(this.schema, 'businessId').options = result.list ? result.list : result
        this.$forceUpdate()
      })
    }
  },
  created () {
    this.api = api
  },
  watch: {
    'obj.businessNature': {
      handler: function (val) {
        if (val === '548') {
          this.supplierArr()
          this.isSupplierId = true
        }
        if (val === '547') {
          this.manufacturerArr()
          this.isSupplierId = false
        }
        this.$ever.getFieldFromSchema(schema, 'businessId').options = []
        this.$ever.getFieldFromSchema(schema, 'materialType').options = []
      }
    },
    'obj.materialType': {
      handler: function (val) {
        if (!this.obj.businessId) {
          this.$messageTips(this, 'warning', '请先选择商家性质和商家名称')
          this.obj.materialType = ''
          return false
        }
        this.drugArr(val)
      }
    }
  }
}
</script>

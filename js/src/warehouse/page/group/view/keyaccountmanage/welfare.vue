<template>
  <div>
    <ever-bread-crumb
      :name="objId ? '大客户详情' : '新建'"
      path="/manages/keyAccountManage/welfare"
      :haveReturn="true"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <el-row>
        <el-col :span="12">
          <ever-form2
            :schema="schema"
            v-model="queryObj"
            :rules="rules"
            @objsaved="afterSave"
            :api="api"
          >
            <template slot="serviceIds">
              <range :serviceIds="queryObj.serviceIds"></range>
            </template>
            <template slot="reimburseRate">
              <el-input placeholder="请输入报销比例" v-model="queryObj.reimburseRate" type="number">
                <template slot="append">%</template>
              </el-input>
            </template>
            <template slot="benefitRate">
              <el-input placeholder="请输入优惠比例" v-model="queryObj.benefitRate" type="number">
                <template slot="append">%</template>
              </el-input>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { welfareApi } from '@/warehouse/page/group/store/keyaccountmanage'
import range from './range'
const validRate = function (rule, val, callback) {
  if (val === undefined) {
    return callback(new Error('比例不能为空'))
  }
  if (val >= 1 && val <= 100) {
    return callback()
  } else {
    return callback(new Error('比例值需在1-100之间'))
  }
}
let schema = [
  {
    label: '方案编号',
    name: 'productCode'
  },
  {
    label: '方案名称',
    name: 'productName'
  },
  {
    label: '所属客户',
    name: 'customer',
    comp: 'ever-select',
    props: {
      options: [],
      placeholder: '请选择所属客户'
    }
  },
  {
    label: '报销比例',
    name: 'reimburseRate',
    comp: 'custom'
  },
  {
    label: '优惠比例',
    name: 'benefitRate',
    comp: 'custom'
  },
  {
    label: '门诊报销上限',
    name: 'outpatientUpperLimit'
  },
  {
    label: '使用范围',
    name: 'serviceIds',
    comp: 'custom'
  },
  {
    label: '备注',
    name: 'remark'
  }
]
let rules = {
  productCode: [
    {
      required: true,
      tigger: 'blur',
      message: '请输入方案编号'
    }
  ],
  productName: [
    {
      required: true,
      tigger: 'blur',
      message: '请输入方案名称'
    }
  ],
  customer: [
    {
      required: true,
      tigger: 'change',
      message: '请选择所属客户'
    }
  ],
  reimburseRate: [
    { required: true, message: '请输入报销比例', trigger: 'blur' },
    { validator: validRate, trigger: 'change' }
  ],
  benefitRate: [
    { required: true, message: '请输入优惠比例', trigger: 'blur' },
    { validator: validRate, trigger: 'change' }
  ]
}

export default {
  components: {
    range
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.serviceIds = {
      categoryIds: [],
      itemIds: [],
      status: 'first'
    }
    return {
      objId: this.$route && this.$route.params && this.$route.params.id,
      schema: schema,
      queryObj: obj,
      rules: rules,
      api: welfareApi
    }
  },
  created () {
    this.api.getCostom().then(res => {
      this.$ever.getFieldFromSchema(this.schema, 'customer').props.options = res.data
    })
  },
  methods: {
    afterSave () {
      this.$router.push('/manages/keyAccountManage/welfare')
    }
  }
}
</script>


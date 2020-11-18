<template>
  <div>
    <ever-bread-crumb
      :name="objId ? '大客户详情' : '新建'"
      path="/manages/keyAccountManage/profiles"
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
          ></ever-form2>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { profileApi } from '@/warehouse/page/group/store/keyaccountmanage'
import { validateTelePhone } from '@/util/validate'
let schema = [{
  label: '客户编号',
  name: 'number'
},
{
  label: '税务登记号',
  name: 'taxNum'
},
{
  label: '客户全称',
  name: 'name'
},
{
  label: '客户简称',
  name: 'shortName'
},
{
  label: '英文名称',
  name: 'englishName'
},
{
  label: '客户电话',
  name: 'telephone'
},
{
  label: '联系人姓名',
  name: 'contactName'
},
{
  label: '联系人电话',
  name: 'contactTelephone'
},
{
  label: '失效日期',
  name: 'expirationDate',
  comp: 'datePicker',
  props: {
    outformat: 'yyyy-MM-dd',
    showformat: 'yyyy-MM-dd'
  }
}]
let rules = {
  number: [{
    required: true,
    message: '请输入客户编号',
    tigger: 'change'
  }],
  taxNum: [{
    required: true,
    message: '请输入税务登记号',
    tigger: 'change'
  }],
  name: [{
    required: true,
    message: '请输入客户全称',
    tigger: 'change'
  }],
  telephone: [{
    required: false, validator: validateTelePhone, trigger: 'blur'
  }],
  contactTelephone: [
    { required: false, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
    { pattern: /^1[345678]\d{9}$/, message: '请输入正确的手机号码' }
  ],
  expirationDate: [{
    required: true,
    message: '请选择失效日期',
    tigger: 'change'
  }]
}
export default {
  data () {
    return {
      objId: this.$route && this.$route.params && this.$route.params.id,
      schema: schema,
      queryObj: this.$ever.createObjFromSchema(schema),
      rules: rules,
      api: profileApi
    }
  },
  created () {
    if (!this.objId) {
      this.api.getCostomNo({ type: 'IO' }).then(res => {
        this.queryObj.number = res.data
      })
    }
  },
  methods: {
    afterSave () {
      this.$router.push('/manages/keyAccountManage/profiles')
    }
  }
}
</script>


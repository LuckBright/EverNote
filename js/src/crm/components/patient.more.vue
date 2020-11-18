<template>
  <div>
    <div style="padding: 20px;" v-show="show">
      <el-row>
        <el-col><strong class="title">更多信息</strong></el-col>
      </el-row>
      <ever-form2
        :schema="schema"
        v-model="obj"
        :span="24"
        :rules="rules"
        refs="moreform"
        @objsaved="afterSave()">
        <div slot="default"></div>
        <template slot="telephone">
          <sys-text v-model="obj.telephone" placeholder="座机号"></sys-text>
        </template>
        <template slot="idens">
          <other-papers v-model="obj.idens"></other-papers>
        </template>
        <template slot="contactMobile">
          <contacts v-model="obj.contactList" :border="showBorder"></contacts>
        </template>
        <template slot="remark">
          <el-input v-model="obj.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请输入备注"></el-input>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
import contacts from '@/crm/components/contacts'
import otherPapers from '@/crm/components/otherpapers'
import { validateTelePhone } from '@/util/validate'

let schema = [
  {
    name: 'telephone',
    comp: 'custom',
    span: 12,
    placeholder: '请输入座机号',
    label: '座机号'
  },
  {
    name: 'nativePlace',
    label: '籍贯',
    span: 12,
    comp: 'everAddress',
    props: {
      showDetialAddr: false
    }
  },
  {
    name: 'race',
    label: '人种',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'THC_CRM_RACE'
    }
  },
  {
    name: 'relation',
    label: '客户关系',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'THC_CRM_RELATION'
    }
  },
  {
    name: 'education',
    label: '学历',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'GBT.4657'
    }
  },
  {
    name: 'career',
    span: 12,
    label: '行政职称',
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.4'
    }
  },
  {
    name: 'healthStatus',
    label: '健康状态',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'THC_CRM_HEALTH'
    }
  },
  // {
  //   name: 'rating',
  //   label: '客户评级',
  //   span: 12,
  //   comp: 'sys-type',
  //   props: {
  //     code: 'THC_CRM_GRADE'
  //   }
  // },
  {
    name: 'idens',
    span: 24,
    comp: 'custom',
    label: '其他证件'
  },
  {
    name: 'householdAddress',
    comp: 'everAddress',
    label: '户籍地址',
    span: 24
  },
  {
    name: 'contactMobile',
    comp: 'custom',
    span: 24,
    label: '联系人'
  },
  {
    name: 'remark',
    label: '备注',
    type: 'custom',
    span: 24
  }
]
export default {
  props: ['show', 'patientmore'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.race = '2d9ede11-29d1-4858-8b72-0cf52c731968'
    obj.contactList = []
    obj.nativePlace = ''
    return {
      obj,
      copyObj: JSON.parse(JSON.stringify(obj)),
      schema,
      rules: {
        telephone: [
          { required: false, validator: validateTelePhone, trigger: 'blur' }
        ]
      },
      showBorder: false,
      hnFlag: this.$ever.getClinicConfig().memberModel
    }
  },
  watch: {
    'obj': {
      handler: function (val) {
        if (val) {
          this.$bus.$emit('editmores', val)
        }
      },
      deep: true
    },
    'patientmore': {
      handler: function (val) {
        this.obj = Object.assign({}, this.obj, val)
      },
      deep: true,
      immediate: true
    },
    'show': {
      handler: function (val) {
        if (this.hnFlag === '2' && this.patientmore.agebirthday && this.patientmore.agebirthday.age < 14) {
          this.showBorder = true
        }
      },
      immediate: true
    }
  },
  created () {
    this.$bus.$on('_clearAll:patientmore', () => {
      this.clearAll()
    })
    this.$bus.$on('show-border', val => {
      if (this.hnFlag === '2' && val) {
        this.showBorder = true
      }
    })
  },
  methods: {
    clearAll () {
      this.obj = JSON.parse(JSON.stringify(this.copyObj))
    }
  },
  components: {
    contacts,
    otherPapers
  }
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 14px;
  border-left: 3px solid #1c7bef;
  padding-left: 10px;
  color: #000;
}
</style>


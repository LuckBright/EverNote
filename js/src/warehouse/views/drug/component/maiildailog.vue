<template>
  <div>
    <el-dialog
      :title="pageType === 4 ? '邮寄信息' : '邮寄发药'"
      width="50%"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="visible">
      <p class="tips">请在下面录入邮寄的信息：</p>
      <ever-form2
        class="form"
        :nosubmit="true"
        :schema="schema"
        :rules="rules"
        ref="ruleForm"
        v-model="obj">
        <el-form-item
          v-for="(item, index) in fastMail"
          :key="index"
          prop="fastMailCode"
          style="margin-top: 0px;"
          :rules="{ required: true, validator: validateNumbers, trigger: 'blur' }"
          slot="fastMailCode">
          <el-input
            onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"
            placeholder='请输入物流单号'
            maxlength="26"
            :class="!index ? '' : 'mt10'"
            v-model="item.expressNumber">
            </el-input>
          <el-button type="text" @click="addCourier(index)" class="btnRight" :class="!index ? '' : 'top10'" v-if="index === fastMail.length - 1">更多单号</el-button>
          <el-button type="text" @click.prevent="removeCourier(item)" class="removeRight" :class="!index ? '' : 'top10'" v-if="index !== fastMail.length - 1">删除</el-button>
        </el-form-item>
      </ever-form2>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" size="small">确定</el-button>
        <el-button @click="visible = false" size="small">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/warehouse/views/drug/api/dispenseapi.js'
// import commonApi from '@/warehouse/page/storages/dispensings/store/dispensingcommonapi.js'
import Bus from '@/util/eventbus.js'
import { request } from '@/util/req'
import { basePrefix as prefix } from '@/util/urls.base'
import { validatePhone } from '@/util/validate'
const schema = [
  {
    name: 'expressCompany',
    label: '物流公司:',
    span: 17,
    comp: 'sys-select',
    props: {
      filterable: true,
      placeholder: '请选择快递公司',
      options: [],
      clearable: true
    }
  },
  {
    name: 'fastMailCode',
    label: '物流单号:',
    comp: 'custom',
    props: {
      placeholder: '物流单号'
    },
    span: 17
  },
  {
    name: 'deliveryBy',
    label: '配送人姓名:',
    props: {
      placeholder: '配送人姓名'
    },
    span: 17
  },
  {
    name: 'deliveryPhone',
    label: '配送人联系方式:',
    props: {
      placeholder: '配送人联系方式'
    },
    span: 17
  },
  {
    name: 'remarks',
    label: '备注:',
    comp: 'textarea',
    props: {
      placeholder: ' ',
      type: 'textarea'
    },
    span: 17
  }
]
export default {
  props: {
    ids: { // 选中的数据的id集合
      type: Array,
      default: () => [ ]
    },
    visitSn: { // 患者一次就诊编号
      type: String,
      default: ''
    },
    multi: {
      type: Boolean,
      default: false
    },
    pageType: { // 4 发药
      type: Number,
      default: 1
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    var validateNumbers = (rule, value, callback) => {
      let ever = this.fastMail.every(item => {
        return item.expressNumber !== ''
      })
      if (!ever) return callback(new Error('请输入物流单号'))
      // 诡异的去重方法 但是可以达到判断有重复的快递单号的作用
      let obj = {}
      let person
      person = this.fastMail.reduce((cur, next) => {
        obj[next.expressNumber] ? '' : obj[next.expressNumber] = true && cur.push(next)
        return cur
      }, [])
      if (person.length < this.fastMail.length) {
        return callback(new Error('请勿输入重复物流单号'))
      }
      // 数字和英文的正则
      let MAIL_CE = /^[0-9a-zA-Z]+$/
      this.fastMail.forEach((item, i) => {
        if (!MAIL_CE.test(item.expressNumber)) {
          return callback(new Error('请输入正确的物流单号'))
        } else {
          callback()
        }
      })
    }
    return {
      schema,
      obj,
      defaultObj: '', // 收货地址对象
      fastMail: [], // 物流单号
      expressOptions: [], // 物流公司
      visible: false,
      validateNumbers,
      rules: {
        expressCompany: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        // fastMailCode: [
        //   { required: true, validator: validateNumbers, trigger: 'change' }
        // ],
        deliveryPhone: [
          { validator: validatePhone, trigger: 'blur', message: '请输入正确的手机号码' }
        ]
      }
    }
  },
  mounted () {
    Bus.$on('defaultObj', (e) => {
      this.defaultObj = e
    })
  },
  methods: {
    async getMailAddress () {
      api.getMailAddress({ visitSn: this.visitSn }).then(res => {
        if (res) {
          this.defaultObj = res
          if (!this.defaultObj.id) return this.$messageTips(this, 'warning', '请先选择邮寄地址')
          this.visible = true
        }
      })
    },
    async open () {
      // if (!this.defaultObj.id) {
      this.getMailAddress()
      // } else {
      //   this.visible = true
      // }
    },
    initData () { // 重置参数
      this.fastMail = [{
        expressCompanyId: '',
        expressCompanyName: '',
        expressNumber: '',
        harvestAddressId: this.defaultObj.id // 地址id
      }]
      this.obj.expressCompany = ''
      Object.keys(this.obj).forEach(key => {
        if (this.obj[key]) this.obj[key] = ''
      })
      // 获取快递公司
      if (this.expressOptions.length) return
      request({ url: `${prefix.extend}msg/express/queryCom`, isStatic: false }).then(res => {
        res = res.data.resultList || []
        res = res.map(item => {
          return {
            id: item.id,
            name: item.com,
            code: item.comCode,
          }
        })
        this.expressOptions = res
        this.$ever.getFieldFromSchema(this.schema, 'expressCompany').props.options = res
      })
    },
    submitForm () { // 确定邮寄发药
      this.$refs.ruleForm.$refs.form.validate(valid => {
        if (valid) {
          let expressObj = {} // 选中的物流公司
          let expressInformationList = [] // 提交的物流信息list
          expressObj = this.expressOptions.find(express => { return express.id === this.obj.expressCompany })
          this.fastMail.map(item => {
            expressInformationList.push({
              deliveryBy: this.obj.deliveryBy,
              deliveryPhone: this.obj.deliveryPhone,
              expressCode: expressObj.code,
              expressCompanyId: expressObj.code, // 物流公司id
              expressCompanyName: expressObj.name, // 物流公司名称
              expressNumber: item.expressNumber, // 物流单号
              harvestAddressId: item.harvestAddressId, // 地址id
              description: this.obj.remarks // 备注信息
            })
          })
          let params = {
            expressInformationList: expressInformationList,
            ids: this.ids,
            expressFlag: this.pageType === 4 ? 2 : 1
          }
          api.address(params).then(res => {
            if (res && res.finally) {
              Bus.$emit('defaultObjEdit', 1)
              this.$emit('mail-func', this.ids, 1, 'post')
              this.visible = false
              if (this.pageType === 4) {
                this.$bus.$emit('ids', this.ids)
                return this.everSuccess('修改邮寄信息成功')
              }
            }
          })
        }
      })
    },
    addCourier (index) { // 添加快递单号
      this.fastMail.push({
        expressCompanyId: '',
        expressCompanyName: '',
        expressNumber: '',
        harvestAddressId: this.defaultObj.id
      })
      this.$nextTick(_ => {
        this.$refs.ruleForm.$el.querySelectorAll('input')[index + 2].focus()
      })
    },
    removeCourier (item) { // 删除快递单号
      if (this.fastMail.length === 1) return
      let index = this.fastMail.indexOf(item)
      if (index > -1) {
        if (this.fastMail[index].id) {
          this.fastMail[index].status = 2
        }
        this.fastMail.splice(index, 1)
      }
    }
  },
  watch: {
    visible (v) {
      if (v) {
        this.initData()
      } else {
        this.$refs.ruleForm.$refs.form.clearValidate()
      }
    },
  },
}

</script>
<style lang="less" scoped>
.btnRight {
  position: absolute;
  top: 0px;
  right: -60px;
}
.removeRight {
  position: absolute;
  top: 0px;
  right: -40px;
}
.top10{
  top: 10px!important;
}
.form /deep/ .el-form-item .el-form-item__content .el-form-item__error {
  display: block;
}
.form /deep/ .el-form-item {
  margin-top: 10px;
}
</style>

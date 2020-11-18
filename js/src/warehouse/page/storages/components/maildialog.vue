<template>
  <div>
    <el-dialog
      width="50%"
      :modal-append-to-body="false"
      :visible.sync="dialogVisibleMail">
      <h2 class="header">{{mailData.status == 5 ? '填写邮寄信息' : '邮寄信息'}}</h2>
      <div v-if="mailData && mailData.mailAddressObject">
        <div class="bg-purple bodert1">
          <svg class="icon f20" aria-hidden="true">
            <use xlink:href="#icon-shou"></use>
          </svg>
          <span>收件信息</span>
        </div>
          <ul>
            <li class="bg-li" v-if="mailData.mailAddressObject.name">
              <span class="fl receipt">收件人姓名：</span><span>{{mailData.mailAddressObject.name}}</span>
            </li>
            <li class="bg-li" v-if="mailData.mailAddressObject.mobile">
              <span class="fl receipt">收件人电话：</span><span>{{mailData.mailAddressObject.mobile}}</span>
            </li>
            <li class="bg-li" v-if="mailData.mailAddressObject.address">
              <span class="fl receipt">收件人地址：</span><span>{{mailData.mailAddressObject._address}}</span>
            </li>
          </ul>
      </div>
      <div v-if="mailData.status && (mailData.status == 5 || mailData.status == 6) && isClick">
        <div class="bg-purple bodert1">
          <svg class="icon f20" aria-hidden="true">
            <use xlink:href="#icon-fa"></use>
          </svg>
          <span>发件信息</span>
        </div>
        <ever-form2
          style="marginTop: 10px;"
          :schema="schema"
          v-model="queryObj"
          :labelWidth="'240px'"
          ref="ruleForm"
          :rules="rules"
          :nosubmit="true">
          <el-form-item
            v-for="(item, index) in fastMail"
            :key="index"
            prop="name"
            slot="fastMailCode">
            <el-input
              onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"
              placeholder='请输入快递单号'
              :disabled="istrue"
              maxlength="26"
              v-model="item.expressNumber">
              </el-input>
            <el-button type="text" @click="addCourier(index)" v-if="mailData.status && !(index - fastMail.length + 1) && holdBtn" class="btnRight">添加快递单号</el-button>
            <el-button type="text" @click.prevent="removeCourier(item)" class="removeRight" v-if="holdBtn">删除</el-button>
          </el-form-item>
        </ever-form2>
      </div>
      <div class="footer">
        <el-row :gutter="20">
          <el-col class="grid-content">
            <el-button type="primary" class="fr edit" v-if="mailData.status && mailData.status == 6 && editBtn" @click="handelEdit">编辑</el-button>
            <el-button class="fr edit" type="primary" v-if="holdBtn " @click="submitForm">确定</el-button>
            <el-button class="fr edit" @click="dialogVisibleMail = false" v-if="holdBtn">取消</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonApi from '@/warehouse/page/storages/dispensings/store/dispensingcommonapi.js'
import citys from '@/util/citys'
let schema = [
  {
    name: 'expressCompany',
    label: '快递公司:',
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
    label: '快递单号:',
    comp: 'custom',
    span: 17
  },
  {
    name: 'remarks',
    label: '备注:',
    comp: 'el-input',
    props: {
      placeholder: ' '
    },
    span: 17
  }
]
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isClick: { // 是否点击
      type: Boolean
    },
    visitSn: {
      type: String
    },
    ids: { // 一人操作处方单ID的数组
      type: Array,
      default: () => {
        return []
      }
    },
    itemData: { // 发药任务
      type: Object,
      default: () => {
        return {}
      }
    },
    popData: { // 当前备药单
      type: Object,
      default: () => {
        return {}
      }
    },
    listData: { // 一人操作里面当前选取的所有的处方单
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    let validateAge = (rule, value, callback) => {
      let ever = this.fastMail.every(item => {
        return item.expressNumber !== ''
      })
      // 诡异的去重方法 但是可以达到判断有重复的快递单号的作用
      let obj = {}
      let person
      person = this.fastMail.reduce((cur, next) => {
        obj[next.expressNumber] ? '' : obj[next.expressNumber] = true && cur.push(next)
        return cur
      }, [])
      if (person.length < this.fastMail.length) {
        return callback(new Error('请勿输入重复快递单号'))
      }
      // 数字和英文的正则
      let MAIL_CE = /[0-9a-z]/i
      this.fastMail.map((item, i) => {
        if (!ever || !MAIL_CE.test(item.expressNumber)) {
          return callback(new Error('请输入快递单号'))
        } else {
          callback()
        }
      })
    }
    queryObj.expressCompany = ''
    return {
      schema,
      commonApi,
      loading: false,
      fastMail: [],
      citys,
      mailData: {}, // 单个处方单
      removeArr: [],
      queryObj,
      istrue: false,
      expressOptions: [],
      holdBtn: true,
      editBtn: true,
      rules: {
        expressCompany: [
          { required: true, message: '必填项', trigger: ['blur'] }
        ],
        fastMailCode: [
          { required: true, validator: validateAge, trigger: ['blur'] }
        ]
      }
    }
  },
  methods: {
    removeCourier (item) {
      if (this.fastMail.length === 1) return
      let index = this.fastMail.indexOf(item)
      if (index > -1) {
        if (this.fastMail[index].id) {
          this.fastMail[index].status = 2
          this.removeArr.push(this.fastMail[index])
        }
        this.fastMail.splice(index, 1)
      }
    },
    addCourier (index) {
      this.fastMail.push({
        expressCompanyId: '',
        expressCompanyName: '',
        expressNumber: '',
        status: 1,
        visitSn: this.visitSn,
        orderId: this.mailData.status === 5 ? '' : this.mailData.id
      })
      this.$nextTick(_ => {
        this.$refs.ruleForm.$el.querySelectorAll('input')[index + 2].focus()
      })
    },
    initData () {
      this.fastMail = [{
        expressCompanyId: '',
        expressCompanyName: '',
        expressNumber: '',
        status: 1,
        visitSn: this.visitSn,
        orderId: ''
      }]
      this.queryObj.expressCompany = ''
      if (this.queryObj.remarks) this.queryObj.remarks = ''
    },
    handelEdit () {
      this.istrue = false
      this.schema[0].props.disabled = false
      this.schema[2].props.disabled = false
      this.editBtn = false
      this.holdBtn = true
    },
    submitForm () {
      this.$refs.ruleForm.$refs.form.validate(valid => {
        if (valid) {
          this.fastMail.forEach(item => { item.description = this.queryObj.remarks })
          if (this.mailData.status === 6) {
            this.loading = true
            let params = {
              expressInformationList: [...this.fastMail, ...this.removeArr],
              id: this.mailData.id
            }
            this.commonApi.updateExpressInformation(params).then(res => {
              if (res.flag) {
                this.loading = false
                this.dialogVisibleMail = false
                this.removeArr = [] // 请求成功后重置已删除的数据数组
                this.$messageTips(this, 'success', '保存邮寄信息成功')
              }
            })
          } else {
            this.fastMail.forEach(item => {
              if (this.listData && this.listData.length) {
                item.orderIds = this.listData
              }
              delete item.orderId
            })
            this.$emit('sendMedicine', this.fastMail, this.popData.id, this.mailData.status, this.isClick, this.mailData.id)
          }
        }
      })
    }
  },
  computed: {
    dialogVisibleMail: {
      set (newVal) {
        this.$emit('update:visible', newVal)
      },
      get () {
        return this.visible
      }
    }
  },
  watch: {
    'itemData': { // 当前处方单
      handler (v) {
        let obj = {}
        let arr = []
        arr = v.outpatientDispenseList || v.normal || v
        if (!Array.isArray(arr)) {
          this.mailData = v
          return
        }
        let index = arr.findIndex(item => item.mailAddressObject && item.mailFlag)
        obj = arr[index]
        this.mailData = obj
      },
      deep: true,
      immediate: true
    },
    'popData': { // 备药单
      handler (v) {
        if (v.normal || v.outpatientDispenseList) {
          this.mailData = v.normal ? v.normal[0] : '' || v.outpatientDispenseList ? v.outpatientDispenseList[0] : ''
        }
      },
      deep: true
    },
    'queryObj.expressCompany' (v) {
      if (!v) return
      let index = this.expressOptions.findIndex(item => {
        return v === item.id
      })
      if (index > -1) {
        this.fastMail.map(expressItem => {
          expressItem.expressCompanyId = v
          expressItem.expressCompanyName = this.expressOptions[index].name
        })
      }
    },
    'fastMail': {
      handler (v) {
        v.forEach(item => {
          v[v.length - 1].expressCompanyId = item.expressCompanyId
          v[v.length - 1].expressCompanyName = item.expressCompanyName
        })
      }
    },
    'dialogVisibleMail' (v) {
      if (v) {
        // 获取快递公司接口
        this.commonApi.getExpressCompanyList({ name: '' }).then(res => {
          if (res && res.length) {
            this.expressOptions = res
            this.$ever.getFieldFromSchema(this.schema, 'expressCompany').props.options = this.expressOptions
          }
        })
        if (this.mailData.status === 5) {
          this.schema[0].props.disabled = false
          this.schema[2].props.disabled = false
          this.initData()
        }
        if (this.mailData.status === 6) {
          this.istrue = true
          this.editBtn = true
          this.holdBtn = false
          let params = {
            visitSn: this.mailData.visitSn,
            orderIds: [this.mailData.id]
          }
          this.schema[0].props.disabled = true
          this.schema[2].props.disabled = true
          this.commonApi.getExpressInformationList(params).then(res => {
            if (res && res.length) {
              this.fastMail = res
              this.queryObj.expressCompany = this.fastMail[0].expressCompanyId
              this.queryObj.remarks = this.fastMail[0].description
            } else {
              this.initData()
            }
          })
        }
      } else {
        // 关闭弹窗清空校验结果
        this.$refs.ruleForm.$refs.form.clearValidate()
        if (this.mailData.status === 6) {
          this.schema[0].props.disabled = true
          this.schema[2].props.disabled = true
          this.editBtn = true
          this.holdBtn = false
        }
      }
    }
  },
  components: {
    commonApi
  }
}

</script>
<style lang="less" scoped>
.f20 {
  font-size: 20px;
}
.header {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #333333;
  line-height: 18px;
  margin-top: -20px;
  padding-bottom: 30px;
}
.bg-purple {
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #333333;
  height: 44px;
  line-height: 44px
}
.bodert1{
  border-bottom: 1px solid #999999;
}
.edit {
  margin-top: 11px;
  width: 76px;
  height: 36px;
  margin-left: 10px;
}
.bg-top {
  margin-top: 11px;
  height: 44px;
  line-height: 44px;
}
.mailRight {
  width: 200px;
  text-align: right;
}
.bg-li {
  height: 44px;
  line-height: 44px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #000000;
  line-height: 44px;

  .receipt {
  display: inline-block;
  width: 200px;
  text-align: right;
  }
}
.btnRight {
  position: absolute;
  top: 0;
  right: -135px;
}
.removeRight {
  position: absolute;
  top: 0;
  right: -40px;
}
</style>

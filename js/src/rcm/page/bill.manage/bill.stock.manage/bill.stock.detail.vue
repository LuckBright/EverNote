<template>
  <div class="layout_inner">
    <ever-bread-crumb
      :name="'票据信息'"
      path="/financial/billstocklist"
      isQuery="true"
      show-edit-fnt="false"
      :have-return="true"
    ></ever-bread-crumb>
    <el-row style="padding-left: 20px;">
      <el-col :span="16">
        <ever-form2
          :schema="schema"
          v-model="queryObj"
          :rules="rules"
          labelWidth="100px"
          ref="form"
          label-position="right"
          :allDisabled="AllDisabled"
          class="stock-form"
        >
          <template slot="name">
            <el-input :disabled="!!id" v-model="queryObj.name" placeholder="票据名称"></el-input>
          </template>
          <template slot="billType">
            <el-select :disabled="!!id" v-model="queryObj.billType" placeholder="票据类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot="no">
            <el-row>
              <el-col :span="6">
                <el-radio :disabled="!!id" v-model="billNumber.type" label="1">输入</el-radio>
                <el-radio :disabled="!!id" v-model="billNumber.type" label="2">自动生成</el-radio>
              </el-col>
              <el-col :span="18" style="display:flex;">
                <div style="margin-left:20px;">
                  <el-checkbox v-model="billNumber.head" :disabled="diableBillNumber">头部：</el-checkbox>
                  <el-input
                    v-model="billNumber.headVal"
                    :disabled="diableBillNumber || !!id"
                    class="billNumberInput"
                  ></el-input>
                </div>
                <div style="margin-left:20px;">
                  <el-checkbox v-model="billNumber.central" :disabled="true">中部：</el-checkbox>
                </div>
                <div style="margin-left:20px;">
                  <el-checkbox v-model="billNumber.tail" :disabled="diableBillNumber">尾部：</el-checkbox>
                  <el-input
                    v-model="billNumber.tailVal"
                    :disabled="diableBillNumber || !!id"
                    class="billNumberInput"
                  ></el-input>
                </div>
              </el-col>
            </el-row>
          </template>
          <template slot="default">
            <div></div>
          </template>
        </ever-form2>
      </el-col>
    </el-row>
    <el-row style="padding-left: 20px;" v-if="!!id">
      <el-col :span="20">
        <div class="title">票据业务打印模板关联关系</div>
        <div class="businessRow">
          <div v-for="(item, index) of printTemplate" :key="index">
            <el-row :key="item.businessId">
              <el-col :span="6">
                <label>业务名称：</label>
                <span>{{item.businessName}}</span>
                <el-button
                  type="primary"
                  size="small"
                  :disabled="AllDisabled"
                  @click="chooseBusiness(item,'business', index)"
                >选择</el-button>
              </el-col>
              <el-col :span="8">
                <label>打印模板名称：</label>
                <span>{{item.templateName}}</span>
                <el-button
                  type="primary"
                  size="small"
                  :disabled="AllDisabled"
                  @click="chooseBusiness(item,'printTemplate', index)"
                >选择</el-button>
              </el-col>
              <el-col :span="6">
                <label>票号位数：</label>
                <el-input v-model="item.billCodeLength" :disabled="AllDisabled"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" size="small" :disabled="AllDisabled" @click="addNewRow">
                  <i class="iconfont icon-tianjia"></i>
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :disabled="AllDisabled"
                  v-if="checkIfShow(item,index)"
                  @click="deleteRow(index)"
                >
                  <i class="iconfont icon-delete"></i>
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <div style="text-align:right; margin-top:20px;" v-show="!AllDisabled">
          <el-button type="primary" @click="create">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
    <business-dialog
      :visible.sync="businessDialogShow"
      :selectItem="selectItem"
      :index="index"
    ></business-dialog>
    <business-template-dialog
      :visible.sync="printTemplateDialogShow"
      :selectItem="selectItem"
      :index="index"
    ></business-template-dialog>
  </div>
</template>
<script>
import api from '@/rcm/store/bill.manage/bill.stock.api'
import businessDialog from '@/rcm/page/bill.manage/bill.stock.manage/businessdialog'
import businessTemplateDialog from '@/rcm/page/bill.manage/bill.stock.manage/printtemplatedialog'
let options = [
  { id: '是', value: '1' },
  { id: '否', value: '2' }
]
let schema = [
  {
    name: 'billType',
    label: '票据类型',
    comp: 'custom'
  },
  {
    name: 'name',
    label: '票据名称',
    comp: 'custom'
  },
  {
    name: 'no',
    label: '票据编号',
    comp: 'custom'
  },
  {
    name: 'isInvoice',
    label: '发票',
    comp: 'el-radio-group',
    props: {
      options: options
    }
  },
  {
    name: 'isAllowPrintAgain',
    label: '是否支持重打',
    comp: 'el-radio-group',
    props: {
      options: options
    }
  },
  {
    name: 'isAllowPrintNew',
    label: '是否支持补打',
    comp: 'el-radio-group',
    props: {
      options: options
    }
  },
  {
    name: 'isAllowExpress',
    label: '允许寄送',
    comp: 'el-radio-group',
    props: {
      options: options
    }
  },
  {
    name: 'isAllowMultiTemplate',
    label: '是否支持多种打印模板',
    comp: 'el-radio-group',
    props: {
      options: options
    }
  },
  {
    name: 'remark',
    label: '备注',
    comp: 'textarea'
  }
]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.isInvoice = '1'
    queryObj.isAllowPrintAgain = '1'
    queryObj.isAllowPrintNew = '1'
    queryObj.isAllowExpress = '1'
    queryObj.isAllowMultiTemplate = '1'
    let tagCheck = (rule, value, callback) => {
      if (this.billNumber.type === '2') {
        if ((this.billNumber.headVal && !this.reg.test(this.billNumber.headVal)) || (this.billNumber.tailVal && !this.reg.test(this.billNumber.tailVal))) {
          callback(!this.reg.test(this.billNumber.headVal) ? '前缀格式不正确' : '后缀格式不正确')
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    let rules = {
      billType: [
        { required: true, message: '必填项', trigger: ['blur', 'change'] }
      ],
      name: [
        { required: true, message: '必填项', trigger: ['blur', 'change'] }
      ],
      no: [
        { validator: tagCheck, trigger: 'blur' }
      ],
      isInvoice: [
        { required: true, message: '必填项', trigger: ['blur', 'change'] }
      ],
      isAllowExpress: [
        { required: true, message: '必填项', trigger: ['blur', 'change'] }
      ],
      isAllowPrintAgain: [
        { required: true, message: '必填项', trigger: ['blur', 'change'] }
      ],
      isAllowPrintNew: [
        { required: true, message: '必填项', trigger: ['blur', 'change'] }
      ],
      isAllowMultiTemplate: [
        { required: true, message: '必填项', trigger: ['blur', 'change'] }
      ]
    }
    return {
      api,
      queryObj,
      schema,
      rules,
      billNumber: {
        type: '1',
        head: true,
        headVal: '',
        central: true,
        tail: true,
        tailVal: ''
      },
      id: this.$route.query.id,
      AllDisabled: this.$route.query.op === 'view',
      // 模板的businessId记得清空
      businessTemplate: { businessId: '', businessName: '', templateId: '', templateCode: '', templateName: '', billCodeLength: 6, templateLang: '', templateVer: '', templateOrgId: 6 },
      printTemplate: [],
      businessDialogShow: false,
      printTemplateDialogShow: false,
      selectItem: [],
      index: 0,
      typeOptions: [
        {label: '挂号发票', value: 1},
        {label: '门诊发票', value: 2},
        {label: '住院发票', value: 3}
      ],
      reg: /^([0-9a-zA-Z]){1,5}$/
    }
  },
  methods: {
    cancel () {
      this.$router.go(-1)
    },
    create () {
      let params = Object.assign({}, this.queryObj)
      params.isInvoice = params.isInvoice === '1'
      params.isAllowExpress = params.isAllowExpress === '1'
      params.isAllowPrintAgain = params.isAllowPrintAgain === '1'
      params.isAllowPrintNew = params.isAllowPrintNew === '1'
      params.isAllowMultiTemplate = params.isAllowMultiTemplate === '1'
      if (this.billNumber.type === '1') {
        params.isAutoGenerate = false
      } else {
        params.isAutoGenerate = true
        params.isShowPrefix = this.billNumber.head
        params.isShowSuffix = this.billNumber.tail
        params.prefix = this.billNumber.headVal
        params.suffix = this.billNumber.tailVal
      }
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let url = 'createStock'
          if (this.id) {
            params.id = this.id
            url = 'updateStock'
            this.insertBatchSelective(url, params)
            return
          }
          api[url](params).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功')
              this.$router.push({ path: '/financial/billstockdetail', query: { id: rs.data } })
            }
          })
        }
      })
    },
    insertBatchSelective (url, data) {
      let params = []
      let len = 0
      this.printTemplate.forEach(item => {
        if (item.businessId && !item.templateCode || !item.businessId && item.templateCode) {
          this.$messageTips(this, 'error', '请完善打印模版关联关系')
          params = []
          len++
          return
        }
        if (!/^1[0-6]$|^\d$/.test(item.billCodeLength)) {
          this.$messageTips(this, 'error', '票号位数应为0-16之间的正整数')
          params = []
          len++
          return
        }
        if (item.businessId && item.templateCode) {
          let info = JSON.parse(JSON.stringify(item))
          info['defineId'] = this.id
          params.push(info)
        }
      })
      if (len > 0) {
        return
      }
      data.billTemplateList = params
      api[url](data).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
        }
      })
    },
    chooseBusiness (item, dialog, index) {
      this.index = index
      this.selectItem = this.printTemplate
      this[`${dialog}DialogShow`] = true
    },
    addNewRow () {
      this.printTemplate.push(JSON.parse(JSON.stringify(this.businessTemplate)))
    },
    deleteRow (index) {
      if (this.printTemplate.length > 1) {
        this.printTemplate.splice(index, 1)
      } else {
        // 要求点击最后一行的减号时，清空当前行数据，减号消失，加号留着
        this.printTemplate.length = 0
        this.addNewRow()
      }
    },
    checkIfShow (row, index) {
      return index > 0 || row.businessName !== '' || row.templateName !== ''
    },
    getInfo () {
      let params = {id: this.id}
      api.detailStock(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.initInfo(rs.data)
        }
      })
      api.selectList({defineId: this.id}).then(rs => {
        if (rs.head.errCode === 0) {
          if (rs.data.length > 0) {
            this.printTemplate = rs.data
          }
        }
      })
    },
    initInfo (data) {
      this.queryObj = data
      this.queryObj.isInvoice = this.queryObj.isInvoice ? '1' : '2'
      this.queryObj.isAllowExpress = this.queryObj.isAllowExpress ? '1' : '2'
      this.queryObj.isAllowPrintAgain = this.queryObj.isAllowPrintAgain ? '1' : '2'
      this.queryObj.isAllowPrintNew = this.queryObj.isAllowPrintNew ? '1' : '2'
      this.queryObj.isAllowMultiTemplate = this.queryObj.isAllowMultiTemplate ? '1' : '2'
      this.billNumber.type = this.queryObj.isAutoGenerate ? '2' : '1'
      if (this.queryObj.isAutoGenerate) {
        this.billNumber.head = this.queryObj.isShowPrefix
        this.billNumber.headVal = this.queryObj.prefix
        this.billNumber.tail = this.queryObj.isShowSuffix
        this.billNumber.tailVal = this.queryObj.suffix
      }
    }
  },
  created () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getInfo()
    }
    this.addNewRow()
  },
  computed: {
    diableBillNumber () {
      console.log('this.billNumber', this, this.billNumber)
      return this.billNumber && (this.billNumber.type === '1')
    }
  },
  watch: {
    '$route.query': {
      handler: function (val) {
        this.id = val.id
      },
      immediate: true
    },
    'billNumber.type': {
      handler: function (val) {
        if (val === '1') {
          this.billNumber.headVal = ''
          this.billNumber.tailVal = ''
        }
      },
      immediate: true
    }
  },
  components: {
    businessDialog,
    businessTemplateDialog
  }
}
</script>
<style lang="less" scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  line-height: 33px;
}
.billNumberInput {
  display: inline-block;
  width: 200px;
}
.businessRow {
  height: 40px;
  line-height: 40px;
}
.businessRow .el-input {
  width: auto;
}
.stock-form /deep/ .el-row .el-col:first-child .el-select {
  width: 100%;
}
</style>

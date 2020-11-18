<template>
  <div>
    <ever-bread-crumb name="优惠券管理" path="/card/giftbatchs"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基础信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          @objsaved="afterSave"
          label-position="right"
        >
          <template slot="dptIdsList">
            <ever-subject-select ref="ess" v-model="obj.dptIdsList" :isOrg="false" :params="{ type1CodeList: [CATEGORYIDS_TYPE[0].id] }" type="tree" multiple></ever-subject-select>
          </template>
          <el-form-item label prop="itemIds" v-show="obj.useRange == 2">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>请选择项目</span>
                <el-button
                  class="fr"
                  type="primary"
                  v-if="code || taskId || !objId"
                  @click="addService"
                >添加</el-button>
              </div>
              <el-table :data="selectData" style="width: 100%" border>
                <el-table-column prop="name" label="项目名称"></el-table-column>
                <el-table-column prop="serviceType" label="医嘱项目类型">
                  <template slot-scope="scope">
                    <sys-value
                      type="THC_WH_OBJECT_SUB_TYPE"
                      :code="scope.row.serviceClassification"
                    ></sys-value>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="价格">
                  <template slot-scope="scope">{{scope.row.price ? scope.row.price + '元':''}}</template>
                </el-table-column>
                <el-table-column prop v-if="!objId || (objId && taskId) || code" label="操作">
                  <template slot-scope="scope">
                    <el-button size="small" @click="deleteRow(scope.$index, selectData)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-form-item>
          <el-form-item label="展示终端" prop="terminalList">
            <terminal-tab v-model="obj.terminalList"></terminal-tab>
          </el-form-item>
        </ever-form-model>
      </div>
      <div class="panel-footer">
        <div class="alg_label">
          <el-button
            type="primary"
            :disabled="submitDisabled"
            @click="submitFormApply('form')"
            v-if="!objId"
          >创建</el-button>
          <el-button
            type="primary"
            :disabled="submitDisabled"
            @click="modifyFormApply('form')"
            v-if="(objId && taskId) || code"
          >提交</el-button>
        </div>
      </div>
    </div>
    <service-dialog ref="service" :itemIds="selectData" @selectChange="selectChange"></service-dialog>
  </div>
</template>

<script>
import api from '../store/giftbatchapi'
import sobapi from '../store/selftariffsdetailapi.js'
import form from '../../util/form'
import serviceDialog from '../../sob/page/servicedialog'
import sysvalue from '@/warehouse/store/sysvalueapi'
import TerminalTab from '@/card/components/terminaltab'
import { CATEGORYIDS_TYPE } from '@/card/util/cardcommon'
import { request } from '@/util/req'
import urlMap from '@/systemset/urls'

export default {
  mixins: [form],
  data () {
    let schema = [
      {
        name: 'type',
        type: 'systyperadio',
        code: 'THC_CARD_GIFTBATCH_TYPE',
        useValue: true,
        disabled: false,
        span: 24,
        label: '优惠券类型'
      },
      {
        name: 'name',
        label: '名称'
      },
      {
        name: 'money',
        type: 'number',
        append: '元',
        label: '减免金额'
      },
      {
        name: 'totalCount',
        type: 'number',
        append: '张',
        label: '发行数量'
      },
      {
        name: 'threshold',
        type: 'number',
        prepend: '订单满',
        append: '元可用',
        placeholder: ' ',
        label: '订单范围'
      },
      {
        name: 'useTimes',
        label: '有效期',
        type: 'daterange',
        editable: false,
        span: 12
      },
      // {
      //   name: 'overlay',
      //   label: '是否叠加',
      //   type: 'radio',
      //   options: ever.yesno,
      //   span: 12
      // },
      {
        name: 'sellChannel',
        label: '售卖渠道',
        type: 'radio',
        disabled: false,
        options: [
          { id: 1, name: '线下' },
          { id: 2, name: '商城' }
        ]
      },
      {
        name: 'comment',
        label: '渠道备注'
      },
      // {
      //   name: 'overlayMemberCard',
      //   label: '会员卡同时使用',
      //   type: 'radio',
      //   options: ever.yesno,
      //   span: 12
      // },
      {
        name: 'dptIdsList',
        label: '使用科室',
        type: 'custom',
        span: 24
      },
      {
        name: 'useRange',
        label: '使用范围',
        type: 'radio',
        options: [{ id: 1, name: '指定分类' }, { id: 2, name: '指定项目' }],
        span: 24
      },
      {
        name: 'categoryRange',
        label: '',
        type: 'radio',
        options: [{ id: 1, name: '全部分类' }, { id: 2, name: '自定义分类' }],
        span: 24
      },
      {
        name: 'categoryIds',
        label: '',
        hidden: false,
        type: 'checkbox',
        options: [],
        span: 24
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.useTimes = ''
    obj.useRange = 1
    obj.itemIds = []
    obj.categoryIds = []
    obj.dptIdsList = []
    obj.sellChannel = 1
    obj.categoryRange = 2
    obj.terminalList = ['0']
    return {
      schema,
      obj,
      taskId: this.$route.query.taskId,
      objId: this.$route.params.id || this.$route.query.id,
      code: this.$route.params.code === 'true',
      api,
      tableData: [],
      selectData: [],
      dataSelected: [],
      categoryArr: [],
      rules: {
        type: [
          { required: true, message: '请选择优惠券类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        dptIdsList: [
          { required: true, message: '请选择使用科室', trigger: 'blur' }
        ],
        totalCount: [
          { required: true, validator: this.checkTotal, trigger: 'blur', type: 'number' }
        ],
        money: [
          { required: true, validator: this.checkMoney, trigger: 'blur', type: 'number' }
        ],
        threshold: [
          { validator: this.checkThreshold, trigger: 'blur', type: 'number' }
        ],
        useTimes: [
          { required: true, message: '选择使用有效期', trigger: 'blur', type: 'array' }
        ],
        useRange: [
          { required: true, message: '选择使用范围', trigger: 'blur', type: 'number' }
        ],
        sellChannel: [
          { required: true, message: '请选择售卖渠道', trigger: 'blur', type: 'number' }
        ],
        categoryIds: [
          { validator: this.checkCategory, message: '请选择指定分类' }
        ]
      },
      submitDisabled: false,
      CATEGORYIDS_TYPE
    }
  },
  methods: {
    modifyFormApply () {
      this.$confirm('确定修改' + this.obj.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.modifyInfo()
          }
        })
      })
    },
    modifyInfo () {
      this.submitDisabled = true
      let params = {}
      Object.assign(params, this.obj)
      if (this.code) {
        api.modifyCheck(params).then((result) => {
          this.submitDisabled = false
          if (result.head.errCode === 0) {
            this.$messageTips(this, 'success', '提交成功')
            this.$router.push('/card/giftbatchs')
          }
        })
      } else {
        api.modifyObj(params).then((result) => {
          this.submitDisabled = false
          if (result.head.errCode === 0) {
            if (this.$route.query.taskId) {
              let paramsFinish = {
                processData: {
                  taskId: this.taskId
                },
                bussinessData: {
                  flag: 1,
                  remark: '提交申请'
                }
              }
              request(urlMap.process.completeTask, paramsFinish).then(res => {
                if (res.head.errCode === 0) {
                  this.$messageTips(this, 'success', '提交成功')
                  this.$router.push('/card/giftbatchs')
                }
              })
            }
          }
        })
      }
    },
    submitFormApply () {
      this.$confirm('确定创建' + this.obj.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.obj.type === 1) {
          if (this.obj.threshold < this.obj.money) {
            this.$messageTips(this, 'warning', '订单范围必须大于减免金额')
            return false
          }
        }
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.submitDisabled = true
            let params = Object.assign({}, this.obj)
            if (this.obj.useRange === 1) {
              params.items = []
            } else {
              params.categoryIds = []
            }
            api.apply(params).then((result) => {
              this.submitDisabled = false
              if (result.head.errCode === 0) {
                this.afterSave()
              }
            })
          }
        })
      })
    },
    checkTotal (rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入预发行量'))
      }
      if (value > 1000000 || parseInt(value) !== Number(value)) {
        callback(new Error('请输入小于1000000的整数'))
      } else {
        callback()
      }
    },
    checkThreshold (rule, value, callback) {
      if (this.obj.type === '1' && !value) {
        callback(new Error('请填写订单范围'))
      } else if (value < 0) {
        callback(new Error('订单范围不能小于0'))
      } else {
        callback()
      }
    },
    checkMoney (rule, value, callback) {
      if (!value) {
        callback(new Error('必填项'))
      } else if (value < 0) {
        callback(new Error('不能小于0'))
      } else {
        callback()
      }
    },
    checkCategory (rule, value, callback) {
      if (this.obj.useRange === 1 && this.obj.categoryRange === 2 && (!value || value.length === 0)) {
        callback(new Error('请选择指定分类'))
      } else {
        callback()
      }
    },
    checkItems (rule, value, callback) {
      if ((!value || value.length === 0) && this.obj.useRange === 2) {
        callback(new Error('请选择指定项目'))
      } else {
        callback()
      }
    },
    selectChange (selects) {
      this.selectData = selects
      this.obj.itemIds = selects.map(v => {
        return v.id
      })
      this.tableData = selects
    },
    afterSave () {
      this.$messageTips(this, 'success', '新建成功')
      this.$router.push('/card/giftbatchs')
    },
    addService () {
      this.$refs.service.onDialogOpen()
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    }
  },
  watch: {
    'obj.useTimes': function () {
      this.obj.useStartTime = this.$moment(this.obj.useTimes[0]).format('YYYY-MM-DD HH:mm:ss')
      this.obj.useEndTime = this.$moment(this.obj.useTimes[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    'tableData': function () {
      this.obj.itemIds = this.tableData.map(v => {
        return v.id
      })
    },
    'obj.type': function () {
      var _selVal = arguments[0]
      if (_selVal === '3') {
        this.$ever.getFieldFromSchema(this.schema, 'money').placeholder = '请输入体验价'
        this.$ever.getFieldFromSchema(this.schema, 'money').label = '体验价'
        this.$ever.getFieldFromSchema(this.schema, 'overlay').label = '允许使用多张'
        this.obj.overlayMemberCard = 1
      } else {
        this.$ever.getFieldFromSchema(this.schema, 'money').placeholder = '请输入面额'
        this.$ever.getFieldFromSchema(this.schema, 'money').label = '减免金额'
        this.$ever.getFieldFromSchema(this.schema, 'overlay').label = '是否叠加'
        this.obj.overlayMemberCard = ''
      }
      // 审核查看详情的状态 都disabled 不要切换radio状态
      if (this.objId !== '-1') {
        if (_selVal === '1') {
          this.$ever.getFieldFromSchema(this.schema, 'overlay').disabled = false
          this.$ever.getFieldFromSchema(this.schema, 'threshold').disabled = false
          this.$ever.getFieldFromSchema(this.schema, 'overlayMemberCard').disabled = true
        } else if (_selVal === '2') {
          this.$ever.getFieldFromSchema(this.schema, 'threshold').disabled = true
          this.$ever.getFieldFromSchema(this.schema, 'overlay').disabled = true
          this.$ever.getFieldFromSchema(this.schema, 'overlayMemberCard').disabled = true
        } else {
          this.$ever.getFieldFromSchema(this.schema, 'threshold').disabled = true
          this.$ever.getFieldFromSchema(this.schema, 'overlay').disabled = false
          this.$ever.getFieldFromSchema(this.schema, 'overlayMemberCard').disabled = false
        }
      }
    },
    'obj.useRange' (val) {
      let item = this.$ever.getFieldFromSchema(this.schema, 'categoryIds')
      let item1 = this.$ever.getFieldFromSchema(this.schema, 'categoryRange')
      item.hidden = val === 2
      item1.hidden = val === 2
    },
    'obj.categoryRange' (val) {
      let item = this.$ever.getFieldFromSchema(this.schema, 'categoryIds')
      if (val === 1) {
        item.disabled = true
        this.obj.categoryIds = [0]
      } else {
        item.disabled = false
        this.obj.categoryIds = []
      }
    }
  },
  created () {
    if (this.code || (this.taskId && this.objId)) {
      this.$ever.getFieldFromSchema(this.schema, 'type').disabled = true
      this.$ever.getFieldFromSchema(this.schema, 'sellChannel').disabled = true
    } else {
      this.$ever.getFieldFromSchema(this.schema, 'type').disabled = false
      this.$ever.getFieldFromSchema(this.schema, 'sellChannel').disabled = false
    }
    if (this.objId) {
      this.api.getById(this.objId).then(result => {
        result.data.useTimes = []
        result.data.useTimes.push(result.data.useStartTime)
        result.data.useTimes.push(result.data.useEndTime)
        result.data.type = result.data.type + ''
        let categoryIds = JSON.parse(result.data.serviceIds).categoryIds ? JSON.parse(result.data.serviceIds).categoryIds : []
        if (categoryIds && categoryIds.length === 1 && categoryIds[0] === '0') {
          this.obj.categoryRange = 1
        }
        this.obj = Object.assign(this.obj, result.data)
        let itemIds
        if (result.data.serviceIds) {
          this.obj.categoryIds = JSON.parse(result.data.serviceIds).categoryIds ? JSON.parse(result.data.serviceIds).categoryIds : []
          this.obj.useRange = (this.obj.categoryIds.length > 0 ? 1 : 2)
          if (this.obj.categoryIds.length === 1 && this.obj.categoryIds[0] === '0') return
          itemIds = JSON.parse(result.data.serviceIds).itemIds ? JSON.parse(result.data.serviceIds).itemIds : []
          sobapi.queryServiceVariable({ serviceIds: itemIds }).then(res => {
            if (res.data) {
              this.selectData = res.data
            }
          })
        }
      })
    }
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
      this.typeoptions = []
      let Arr = []
      res.forEach(item => {
        if (item.parentId === '297' || item.parentId === '294' || item.parentId === '296' || item.parentId === '798') {
          this.typeoptions.push(item)
          Arr.push(item.id)
        }
      })
      this.categoryArr = Arr
      this.$ever.getFieldFromSchema(this.schema, 'categoryIds').options = this.typeoptions
    })
  },
  beforeCreate () {
    this.api = api
  },
  components: {
    serviceDialog,
    TerminalTab
  }
}
</script>

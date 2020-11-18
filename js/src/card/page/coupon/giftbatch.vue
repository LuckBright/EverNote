<template>
  <div>
    <ever-form2
      :schema="schema"
      v-model="obj"
      :api="api"
      :span="12"
      :rules="rules"
      ref="form"
      label-position="right"
    >
      <!-- <template slot="overlay">
        <el-radio-group v-model="obj.overlay" :disabled="overlayDisabled">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </template>
      <template slot="overlayMemberCard">
        <el-radio-group v-model="obj.overlayMemberCard" :disabled="overlayMemberCardDisabled">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </template> -->
      <template slot="dptIdsList">
        <ever-subject-select
          ref="ess"
          v-model="obj.dptIdsList"
          :params="{ type1CodeList: [CATEGORYIDS_TYPE[0].id] }"
          multiple
          :props="{ 'check-strictly': true }"
          :checkStrictly="true"
          type="tree"
          fields="orgSubjectCode"
          >
        </ever-subject-select>
      </template>
      <template slot="itemIds" v-if="obj.useRange == 2">
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
      </template>
      <template slot="useStartTime">
        <ever-range-picker :start.sync="obj.useStartTime" :end.sync="obj.useEndTime" outformat="YYYY-MM-DD HH:mm:ss"></ever-range-picker>
      </template>
      <template slot="terminalList">
        <terminal-tab v-model="obj.terminalList"></terminal-tab>
      </template>
      <template slot="default">
        <el-col>
          <el-form-item>
            <el-button
              type="primary"
              :disabled="submitDisabled"
              @click="submitFormApply('form')"
              v-if="!objId"
              >
              创建
            </el-button>
            <el-button
              type="primary"
              :disabled="submitDisabled"
              @click="modifyFormApply('form')"
              v-if="(objId && taskId) || code"
            >
            提交
            </el-button>
          </el-form-item>
        </el-col>
      </template>
    </ever-form2>
    <service-dialog ref="service" :itemIds="selectData" @selectChange="selectChange"></service-dialog>
  </div>
</template>

<script>
import api from '@/card/store/giftbatchapi'
import sobapi from '@/card/store/selftariffsdetailapi'
import serviceDialog from '@/sob/page/servicedialog'
import sysvalue from '@/warehouse/store/sysvalueapi'
import TerminalTab from '@/card/components/terminaltab'
import { CATEGORYIDS_TYPE } from '@/card/util/cardcommon'
import { request } from '@/util/req'
import urlMap from '@/systemset/urls'
export default {
  props: ['dataDetails'],
  data () {
    let schema = [
      {
        name: 'type',
        label: '优惠券类型',
        comp: 'sys-type',
        props: {
          code: 'THC_CARD_GIFTBATCH_TYPE'
        },
        span: 24
      },
      {
        name: 'name',
        label: '名称'
      },
      {
        name: 'money',
        label: '减免金额',
        comp: 'ever-number',
        props: {
          numberType: 'number',
          toFixedLen: 2,
          placeholder: '减免金额',
          append: '元'
        }
      },
      {
        name: 'totalCount',
        label: '发行数量',
        comp: 'ever-price',
        props: {
          placeholder: '发行数量',
          append: '张'
        }
      },
      {
        name: 'threshold',
        label: '订单范围',
        comp: 'ever-number',
        props: {
          numberType: 'number',
          toFixedLen: 2,
          prepend: '订单满',
          placeholder: '订单范围',
          append: '元',
          disabled: false
        }
      },
      {
        name: 'useStartTime',
        label: '有效期',
        comp: 'custom'
      },
      // {
      //   name: 'overlay',
      //   label: '是否叠加',
      //   comp: 'custom'
      // },
      {
        name: 'sellChannel',
        label: '售卖渠道',
        comp: 'ever-select',
        props: {
          disabled: false,
          options: [
            { id: 1, name: '线下' },
            { id: 2, name: '商城' }
          ]
        }
      },
      {
        name: 'comment',
        label: '渠道备注'
      },
      // {
      //   name: 'overlayMemberCard',
      //   label: '会员卡同时使用',
      //   comp: 'custom'
      // },
      {
        name: 'dptIdsList',
        label: '使用科室',
        comp: 'custom',
        span: 24
      },
      {
        name: 'useRange',
        label: '使用范围',
        comp: 'sys-select',
        props: {
          disabled: false,
          type: 'radio',
          options: [{ id: '1', name: '指定分类' }, { id: '2', name: '指定项目' }]
        },
        span: 24
      },
      {
        name: 'itemIds',
        label: '',
        comp: 'custom'
      },
      {
        name: 'categoryRange',
        label: '',
        comp: 'sys-select',
        props: {
          disabled: false,
          type: 'radio',
          options: [{ id: '1', name: '全部分类' }, { id: '2', name: '自定义分类' }]
        },
        span: 24
      },
      {
        name: 'categoryIds',
        label: '',
        comp: 'sys-select',
        props: {
          disabled: false,
          type: 'checkbox',
          options: []
        },
        span: 24
      },
      {
        name: 'terminalList',
        label: '展示终端',
        comp: 'custom'
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.useRange = '1'
    obj.itemIds = []
    obj.categoryIds = []
    obj.dptIdsList = []
    obj.sellChannel = 1
    obj.categoryRange = '2'
    obj.terminalList = ['0']
    return {
      schema,
      obj,
      taskId: this.$route.query.taskId,
      objId: this.$route.query.id,
      code: this.$route.params.code === 'true',
      api,
      tableData: [],
      selectData: [],
      dataSelected: [],
      categoryArr: [],
      rules: {
        type: [
          { required: true, message: '请选择优惠券类型', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        dptIdsList: [
          { required: true, message: '请选择使用科室', trigger: ['blur', 'change'] }
        ],
        totalCount: [
          { required: true, validator: this.checkTotal, trigger: 'blur', type: 'number' }
        ],
        money: [
          { required: true, validator: this.checkMoney, trigger: 'blur', type: 'number' }
        ],
        threshold: [
          { required: false, validator: this.checkThreshold, trigger: 'blur', type: 'number' }
        ],
        useStartTime: [
          { required: true, message: '选择使用有效期', trigger: 'blur' }
        ],
        useRange: [
          { required: true, message: '选择使用范围', trigger: 'blur' }
        ],
        sellChannel: [
          { required: true, message: '请选择售卖渠道', trigger: 'blur' }
        ],
        categoryIds: [
          { validator: this.checkCategory, message: '请选择指定分类' }
        ]
      },
      submitDisabled: false,
      // overlayMemberCardDisabled: false,
      overlayDisabled: false,
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
                businessData: {
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
            if (this.obj.useRange === '1') {
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
      if (value > 100000 || parseInt(value) !== Number(value)) {
        callback(new Error('请输入小于100000的整数'))
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
      if (this.obj.useRange === '1' && this.obj.categoryRange === '2' && (!value || value.length === 0)) {
        callback(new Error('请选择指定分类'))
      } else {
        callback()
      }
    },
    checkItems (rule, value, callback) {
      if ((!value || value.length === 0) && this.obj.useRange === '2') {
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
    },
    initInfo (resData) {
      if (resData && resData.id) {
        resData.type = resData.type + ''
        let categoryIds = JSON.parse(resData.serviceIds).categoryIds ? JSON.parse(resData.serviceIds).categoryIds : []
        if (categoryIds && categoryIds.length === 1 && categoryIds[0] === '0') {
          this.obj.categoryRange = '1'
        }
        this.obj = Object.assign(this.obj, resData)
        let itemIds
        if (resData.serviceIds) {
          this.obj.categoryIds = JSON.parse(resData.serviceIds).categoryIds ? JSON.parse(resData.serviceIds).categoryIds : []
          this.obj.useRange = (this.obj.categoryIds.length > 0 ? '1' : '2')
          if (this.obj.categoryIds.length === 1 && this.obj.categoryIds[0] === '0') return
          itemIds = JSON.parse(resData.serviceIds).itemIds ? JSON.parse(resData.serviceIds).itemIds : []
          sobapi.queryServiceVariable({ serviceIds: itemIds }).then(res => {
            if (res.data) {
              this.selectData = res.data
            }
          })
        }
      }
    }
  },
  watch: {
    'tableData': function () {
      this.obj.itemIds = this.tableData.map(v => {
        return v.id
      })
    },
    'obj.type': {
      handler (_selVal) {
        if (_selVal === '3') {
          this.$ever.getFieldFromSchema(this.schema, 'money').props.placeholder = '请输入体验价'
          this.$ever.getFieldFromSchema(this.schema, 'money').label = '体验价'
          // this.$ever.getFieldFromSchema(this.schema, 'overlay').label = '允许使用多张'
          this.rules.threshold[0].required = false
          // this.obj.overlayMemberCard = 1
        } else {
          this.$ever.getFieldFromSchema(this.schema, 'money').props.placeholder = '请输入面额'
          this.$ever.getFieldFromSchema(this.schema, 'money').label = '减免金额'
          // this.$ever.getFieldFromSchema(this.schema, 'overlay').label = '是否叠加'
          // this.obj.overlayMemberCard = ''
          if (_selVal === '1') this.rules.threshold[0].required = true
        }
        // 审核查看详情的状态 都disabled 不要切换radio状态
        if (this.objId !== '-1') {
          if (_selVal === '1') {
            this.overlayDisabled = false
            this.$ever.getFieldFromSchema(this.schema, 'threshold').props.disabled = false
            // this.overlayMemberCardDisabled = true
          } else if (_selVal === '2') {
            this.overlayDisabled = true
            this.$ever.getFieldFromSchema(this.schema, 'threshold').props.disabled = true
            // this.overlayMemberCardDisabled = true
          } else {
            this.overlayDisabled = true
            this.$ever.getFieldFromSchema(this.schema, 'threshold').props.disabled = true
            // this.overlayMemberCardDisabled = false
          }
        } else {
          this.obj.threshold = ''
        }
      },
      deep: true
    },
    'obj.useRange' (val) {
      let item = this.$ever.getFieldFromSchema(this.schema, 'categoryIds')
      let item1 = this.$ever.getFieldFromSchema(this.schema, 'categoryRange')
      item.comp = val === '1' ? 'sys-select' : 'custom'
      item1.comp = val === '1' ? 'sys-select' : 'custom'
    },
    'obj.categoryRange' (val) {
      let item = this.$ever.getFieldFromSchema(this.schema, 'categoryIds')
      if (val === '1') {
        item.props.disabled = true
        this.obj.categoryIds = [0]
      } else {
        item.props.disabled = false
        this.obj.categoryIds = []
      }
    },
    'dataDetails': {
      handler: function (val) {
        if (val) this.initInfo(val)
      },
      immediate: true
    },
  },
  created () {
    if (this.code || (this.taskId && this.objId)) {
      this.$ever.getFieldFromSchema(this.schema, 'type').props.disabled = true
      this.$ever.getFieldFromSchema(this.schema, 'sellChannel').props.disabled = true
    } else {
      this.$ever.getFieldFromSchema(this.schema, 'type').props.disabled = false
      this.$ever.getFieldFromSchema(this.schema, 'sellChannel').props.disabled = false
    }
    this.objId = this.$route.query.id
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
      this.$ever.getFieldFromSchema(this.schema, 'categoryIds').props.options = this.typeoptions
    })
  },
  components: {
    serviceDialog,
    TerminalTab
  }
}
</script>

<template>
  <div>
    <ever-form-model
      :schema="schema"
      v-model="obj"
      :api="api"
      :rules="rules"
      @objsaved="afterSave"
      label-position="right"
      ref="form">
      <template slot="validPeriod">
        <ever-price v-model="obj.validPeriod" placeholder="只能填写整数，如1年半，请填写18" append="月" :max="9999"></ever-price>
      </template>
      <template slot="givedMoney">
        <ever-number v-model="obj.givedMoney" placeholder="赠送金额" number-type="number" :to-fixed-len="2"></ever-number>
      </template>
      <template slot="totalCount">
        <ever-number v-model="obj.totalCount" placeholder="预发行量" number-type="number"></ever-number>
      </template>
      <template slot="moneyThreshold">
        <ever-price v-model="obj.moneyThreshold" placeholder="储值账户门槛" number-type="number" append="元" :max="999999" :to-fixed-len="2"></ever-price>
      </template>
      <el-form-item label="" prop="itemIds" v-show="obj.useRange == 2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>请选择项目</span>
            <el-button class="fr" type="primary" @click="addService(rechargecardProjectData)" v-if="!objId || (objId && taskId)">添加</el-button>
          </div>
          <el-table
            :data="rechargecardProjectData"
            style="width: 100%"
            border>
            <el-table-column
              prop="name"
              label="项目名称">
            </el-table-column>
            <el-table-column
              prop="serviceType"
              label="医嘱项目类型">
              <template slot-scope="scope">
                <sys-value type="THC_SOB_SERVICE_TYPE" :code="scope.row.serviceType"></sys-value>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="价格">
            </el-table-column>
            <el-table-column
              prop=""
              v-if="!objId || (objId && taskId)"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  @click="deleteRow(scope.$index, rechargecardProjectData)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-form-item>
      <el-form-item label="设置卡面" prop="img">
        <ever-upload1 v-model="obj.img" :limit="1" :tipsFlag="true"></ever-upload1>
      </el-form-item>
      <el-form-item label="展示终端" prop="terminalList">
        <terminal-tab :value="obj.terminalList" :disabled="true"></terminal-tab>
      </el-form-item>
    </ever-form-model>
    <div class="alg_label">
      <el-button type="primary" :disabled="submitDisabled" @click="submitFormApply('form')" v-if="!objId">创建</el-button>
      <el-button type="primary" :disabled="submitDisabled" @click="modifyFormApply('form')" v-if="objId && taskId">修改</el-button>
    </div>
  </div>
</template>

<script>
import api from '../store/cardbatchapi'
import sobapi from '../../sob/store/serviceapi'
import form from '../../util/form'
import { diction } from '@/store/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import TerminalTab from '@/card/components/terminaltab'
import { request } from '@/util/req'
import urlMap from '@/systemset/urls'

let schema = [
  {
    name: 'name',
    label: '会员卡名称',
    span: 12
  },
  {
    name: 'moneyThreshold',
    label: '储值账户门槛',
    type: 'custom',
    span: 12
  },
  {
    type: 'custom',
    name: 'validPeriod',
    label: '有效期（月）',
    // placeholder: '有效期（月）',
    placeholder: '只能填写整数，如1年半请填写18',
    span: 12
  },
  {
    type: 'custom',
    name: 'givedMoney',
    label: '赠送金额',
    span: 12
  },
  {
    name: 'shareCount',
    radioval: 'isShare',
    label: '是否可共享',
    type: 'radiotext',
    isShare: 1,
    placeholder: '输入共享人数',
    options: diction.yesno,
    span: 12
  },
  {
    name: 'shareGivedMoney',
    label: '赠金是否共享',
    type: 'radio',
    options: diction.yesno,
    span: 12
  },
  {
    // name: [{name: 'maxDelayCount'}, {name: 'delayMonth'}]
    name: 'maxDelayCount',
    radioval: 'canDelay',
    label: '是否可延期',
    type: 'radiotext2',
    isDelay: 1,
    placeholder1: [
      { name: 'maxDelayCount', label: '可延期次数', placeholder: '可延期次数(数字>0)' },
      { name: 'delayMonth', label: '单次延期时间', placeholder: '单次延长时间(数字>0)', append: '月', max: 9999 }
    ],
    options: diction.yesno,
    span: 24
  },
  {
    type: 'custom',
    name: 'totalCount',
    label: '预发行量',
    span: 12
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

export default {
  mixins: [form],
  props: ['selectData'],
  data () {
    let obj = this.createObjFromSchema(schema)
    obj.isShare = 0
    obj.shareGivedMoney = 0
    obj.delayMonth = ''
    obj.canDelay = 0
    obj.itemIds = []
    obj.shareDiscount = 0
    obj.useRange = 1
    obj.categoryIds = []
    obj.categoryRange = 2
    obj.terminalList = ['2']
    return {
      schema,
      obj,
      taskId: this.$route.query.taskId,
      objId: this.$route.query.id,
      categoryArr: [],
      rules: {
        name: [
          { required: true, message: '请输入会员卡名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        validPeriod: [
          { required: true, message: '请输入有效期', validator: this.checkValidPeriod, trigger: 'blur' }
        ],
        isShare: [
          { required: true, message: '请选择赠金是否可共享', trigger: 'blur', type: 'number' }
        ],
        moneyThreshold: [
          { required: true, message: '请输入储值账户门槛', trigger: 'blur' }
        ],
        givedMoney: [
          { required: true, message: '请输入赠送金额', trigger: 'blur' }
        ],
        totalCount: [
          { required: true, validator: this.checkTotal, trigger: 'blur', type: 'number' }
        ],
        useRange: [
          { required: true, message: '选择使用范围', trigger: 'blur', type: 'number' }
        ],
        categoryIds: [
          { validator: this.checkCategory, message: '请选择指定分类', type: 'number' }
        ],
        itemIds: [
          { validator: this.checkItems, message: '请选择指定项目', type: 'number' }
        ]
      },
      submitDisabled: false,
      rechargecardProjectData: this.selectData
    }
  },
  methods: {
    modifyFormApply () {
      this.$confirm('确定创建' + this.obj.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.submitDisabled = true
            api.modifyObj(this.obj).then(result => {
              this.submitDisabled = false
              if (result.head.errCode === 0) {
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
                    this.afterSave()
                  }
                })
              }
              this.afterSave()
            })
          }
        })
      })
    },
    submitFormApply () {
      this.$confirm('确定创建' + this.obj.name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.submitDisabled = true
            api.draft(this.obj).then((result) => {
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
    checkDiscount (rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入0～100之间的整数'))
      }
      if (value < 0 || value > 100 || parseInt(value) !== Number(value)) {
        callback(new Error('请输入0～100之间的整数'))
      } else {
        callback()
      }
    },
    checkValidPeriod (rule, value, callback) {
      if (parseInt(value) !== Number(value)) {
        callback(new Error('请输入整数'))
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
    afterSave () {
      this.$router.push('/card/cardbatchlist')
    },
    addService (data) {
      if (data) {
        data.forEach(item => {
          item.checked = 1
        })
      }
      this.$emit('addservice')
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    disabledOrNot (bool) {
      var array = ['name', 'moneyThreshold', 'validPeriod', 'givedMoney', 'shareCount', 'shareGivedMoney', 'maxDelayCount', 'categoryIds', 'useRange', 'categoryRange', 'categoryIds']
      for (var value of array) {
        schema.filter(function (v, i) {
          return v.name === value
        })[0].disabled = bool
      }
    }
  },
  watch: {
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
    },
    'obj.isShare' (val) {
      if (val === 0) {
        this.obj.shareCount = ''
      }
    },
    'selectData' () {
      this.obj.itemIds = this.selectData.map(v => {
        return v.id
      })
    }
  },
  created () {
    this.disabledOrNot(false)
    this.obj.shareCount = null
    this.obj.isShare = 0
    this.obj.type = 1
    this.obj.overlay = 1
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
  mounted () {
    this.$nextTick(() => {
      this.objId = this.$route.query.id
      if (this.objId) {
        if (!this.taskId) this.disabledOrNot(true)
        api.getById(this.objId).then(res => {
          if (res.data) {
            // res.data.serviceIds = JSON.parse(res.data.serviceIds)
            Object.assign(this.obj, res.data)
            let categoryIds = JSON.parse(res.data.serviceIds).categoryIds ? JSON.parse(res.data.serviceIds).categoryIds : []
            if (categoryIds && categoryIds.length === 1 && categoryIds[0] === '0') {
              this.obj.categoryRange = 1
            }
            if (res.data.type === 1) {
              let itemIds = JSON.parse(res.data.serviceIds).itemIds ? JSON.parse(res.data.serviceIds).itemIds : []
              if (res.data.serviceIds && itemIds.length) {
                sobapi.list({ ids: itemIds }).then(result => {
                  if (result.data.length > 0) {
                    this.rechargecardProjectData = result.data
                  }
                })
              }
            }
          }
        })
      }
    })
  },
  beforeCreate () {
    this.api = api
  },
  components: {
    TerminalTab
  }
}
</script>

<template>
  <div class="layout_inner">
    <div class="panel-body">
      <ever-form2
        :schema="schema"
        v-model="obj"
        :span="13"
        labelWidth="180px"
        :rules="rules"
        ref="form"
        label-position="right"
        :nosubmit="isGroupControl ? true : false"
      >
        <!-- <template slot="overlayGiftcard">
          <el-radio-group v-model="obj.overlayGiftcard">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </template>
        <template slot="overlayMemberCard">
          <el-radio-group v-model="obj.overlayMemberCard">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </template> -->
        <template slot="discountSelect">
          <el-radio-group v-model="obj.discountSelect" :disabled="objId ? true : false">
            <el-radio label="1" style="width:300px;">
              <span class="labelFix">单一折扣</span>
              <el-input
                v-show="obj.discountSelect == 1"
                v-model="obj.discount"
                style="width:200px;"
                placeholder="请输入0-100之间的整数，如50表示5折"
              >
              <template slot="append">%</template>
              </el-input>
            </el-radio>
            <el-radio label="2" style="width:200px;">
              <span class="labelFix">折扣规则</span>
              <el-select
                v-show="obj.discountSelect == 2"
                v-model="obj.discountRule"
                placeholder="请选择"
                :disabled="objId ? true : false"
              >
                <el-option
                  v-for="item in discountRules"
                  :key="item.id"
                  :label="item.masterName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-radio>
          </el-radio-group>
        </template>
        <template slot="useRange">
          <el-radio-group v-model="obj.useRange">
            <el-radio :label="1">指定分类</el-radio>
            <el-radio :label="2">指定项目</el-radio>
          </el-radio-group>
        </template>
        <template slot="categoryRange">
          <el-radio-group v-model="obj.categoryRange" v-show="obj.useRange == 1">
            <el-radio :label="1">全部分类</el-radio>
            <el-radio :label="2">自定义分类</el-radio>
          </el-radio-group>
        </template>
        <template slot="categoryIds">
          <el-checkbox-group v-model="obj.categoryIds" v-show="obj.useRange == 1">
            <el-checkbox
              v-for="(item, i) in typeoptions"
              :label="item.id"
              :disabled="obj.categoryRange == 1"
              :key="i"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </template>
        <template slot="itemIds">
          <el-form-item label prop="itemIds" v-show="obj.useRange == 2">
            <el-card class="box-card clearfix">
              <el-button class="fr mb5" type="primary" @click="addService(selectData)">添加</el-button>
              <el-table :data="selectData" style="width: 100%" :border="false">
                <el-table-column prop="name" label="项目名称"></el-table-column>
                <el-table-column prop="serviceType" label="医嘱项目类型">
                  <template slot-scope="scope">
                    <sys-value
                      type="THC_WH_OBJECT_SUB_TYPE"
                      :code="scope.row.serviceClassification"
                    ></sys-value>
                  </template>
                </el-table-column>
                <el-table-column
                  prop
                  width="80"
                  v-if="!objId || (objId && taskId) || code"
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button type="danger" size="small" @click="deleteRow(scope.$index, selectData)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-form-item>
        </template>
        <template slot="whetherPoints">
          <el-radio-group v-model="obj.whetherPoints">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </template>
        <template slot="pointConversion">
          <el-input
            v-model="obj.pointConversion"
            type="number"
            step="0.01"
            style="width:100px;"
            :disabled="pointConversionDisabled"
            placeholder="请输入"
          ></el-input>
          <label>&nbsp;&nbsp;元，可增加1积分</label>
        </template>
        <template slot="default" v-if="!isGroupControl">
          <el-col>
            <el-form-item>
              <el-button
                type="primary"
                :disabled="submitDisabled"
                v-if="!objId"
                @click="submitFormApply('form')"
              >创建</el-button>
              <el-button
                type="primary"
                :disabled="submitDisabled"
                v-if="((objId && taskId) || code) && obj && !obj.isClinic"
                @click="modifyFormApply('form')"
              >提交</el-button>
            </el-form-item>
          </el-col>
        </template>
      </ever-form2>
    </div>
    <service-dialog ref="service" :itemIds="selectData" @selectChange="selectChange"></service-dialog>
  </div>
</template>

<script>
import api from '@/card/store/idcardapi'
import sobapi from '@/card/store/selftariffsdetailapi'
import serviceDialog from '@/sob/page/servicedialog'
import selftariffsapi from '@/rcm/store/tariffs/selftariffsapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import storage from '@/util/storage'
import TerminalTab from '@/card/components/terminaltab'
import { debounce1 as debounce } from '@/util/common'
import { request } from '@/util/req'
import urlMap from '@/systemset/urls'

let schema = [
  {
    name: 'name',
    label: '身份卡名称',
    props: {
      placeholder: '请输入身份卡名称'
    }
  },
  {
    name: 'validPeriod',
    label: '有效期',
    comp: 'ever-price',
    props: {
      placeholder: '只能填写整数，如1年半请填写18',
      append: '月',
      max: 9999
    }
  },
  {
    name: 'price',
    label: '价格',
    comp: 'ever-price',
    props: {
      numberType: 'number',
      toFixedLen: 2,
      placeholder: '请输入价格',
      append: '元'
    }
  },
  // {
  //   name: 'overlayGiftcard',
  //   label: '是否优惠券同时使用',
  //   comp: 'custom',
  //   props: {}
  // },
  // {
  //   name: 'overlayMemberCard',
  //   label: '是否储值卡同时使用',
  //   comp: 'custom',
  //   props: {}
  // },
  {
    name: 'discountSelect',
    label: '优惠类型',
    span: 24,
    comp: 'custom',
    props: {}
  },
  {
    name: 'totalCount',
    label: '预发行量',
    comp: 'ever-price',
    props: {
      placeholder: '预发行量',
      append: '张'
    }
  },
  {
    name: 'useRange',
    label: '使用范围',
    comp: 'custom',
    props: {}
  },
  {
    name: 'categoryRange',
    label: '',
    comp: 'custom',
    props: {}
  },
  {
    name: 'categoryIds',
    label: '',
    comp: 'custom',
    props: {}
  },
  {
    name: 'itemIds',
    label: '',
    comp: 'custom',
    props: {}
  },
  {
    name: 'terminalList',
    label: '展示终端',
    comp: TerminalTab
  },
  {
    name: 'whetherPoints',
    label: '消费积分',
    comp: 'custom',
    props: {}
  },
  {
    name: 'pointConversion',
    label: '每消费',
    comp: 'custom',
    props: {
      disabled: false
    }
  }
]

let pointConversionDisabled
export default {
  props: ['dataDetails', 'isGroupControl'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.useRange = 1
    obj.itemIds = []
    obj.categoryIds = []
    obj.overlayGiftcard = 0
    obj.overlayMemberCard = 0
    obj.categoryRange = 1
    obj.discount = ''
    obj.discountRule = ''
    obj.whetherPoints = 1
    obj.discountSelect = '1'
    obj.terminalList = ['0']
    return {
      schema,
      obj,
      currTabs: '1',
      taskId: this.$route.query.taskId,
      objId: this.$route.query.id,
      dataSelected: [],
      selectData: [],
      categoryArr: [],
      typeoptions: [],
      pointConversionDisabled,
      discountRules: [],
      rules: {
        name: [
          { required: true, message: '请输入会员卡名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        discount: [
          { validator: this.checkDiscount, trigger: 'blur', required: true }
        ],
        discountSelect: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        validPeriod: [
          { required: true, validator: this.checkValidPeriod, trigger: 'blur', type: 'number' }
        ],
        price: [
          { required: true, validator: this.validateNum, trigger: 'blur', type: 'number' }
        ],
        totalCount: [
          { required: true, validator: this.checkTotal, trigger: 'blur', type: 'number' }
        ],
        useRange: [
          { required: true, message: '选择使用范围', trigger: 'blur', type: 'number' }
        ],
        categoryIds: [
          { validator: this.checkCategory, message: '请选择指定分类' }
        ],
        itemIds: [
          { validator: this.checkItems, message: '请选择指定项目' }
        ],
        pointConversion: [
          { message: '请输入整数或小数点后不超过两位的小数', required: true, trigger: 'blur' }
        ]
      },
      submitDisabled: false,
      code: this.$route.params.code === 'true',
      isGroup: this.$route.matched[0].meta.crm ? 1 : 0,
    }
  },
  methods: {
    modifyFormApply () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.modifyInfo()
        }
      })
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    modifyInfo () {
      this.submitDisabled = true
      let params = Object.assign(this.obj, {isGroup: this.isGroup})
      params.categoryIds = this._categoryIdsFilter(params.categoryIds)
      if (params.categoryRange === 1 && !params.categoryIds.length) params.categoryIds = [0]
      if (this.code) {
        // let params = JSON.parse(JSON.stringify(this.obj))
        if (params.useRange === 1) {
          params.itemIds = []
        } else {
          params.categoryIds = []
        }
        api.modifyCheck(params).then((response) => {
          this.submitDisabled = false
          if (response && response.data) {
            this.objId = response.data.id
            if (response.head.errCode === 0) {
              this.$messageTips(this, 'success', '提交成功')
            }
            this.afterSave(response.data)
          }
        })
      } else {
        api.modifyObj(params).then((response) => {
          this.submitDisabled = false
          if (response && response.data) {
            if (response.head.errCode === 0) {
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
                  this.afterSave(response.data)
                }
              })
            }
            this.afterSave(response.data)
          }
        })
      }
    },
    submitFormApply: debounce(function () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (this.obj.discountSelect === '1') {
            if (!this.obj.discount) {
              this.$messageTips(this, 'warning', '单一折扣请输入0～100之间的整数')
              return false
            }
            if (this.obj.discount < 0 || this.obj.discount > 100 || parseInt(this.obj.discount) !== Number(this.obj.discount)) {
              this.$messageTips(this, 'warning', '单一折扣请输入0～100之间的整数')
              return false
            }
          }
          if (this.obj.whetherPoints === 1) {
            if (this.obj.pointConversion === '') {
              this.$messageTips(this, 'warning', '请输入消费多少积分可增加1积分')
              return false
            } else {
              var reg = /^([1-9]\d*|0)(\.\d{1,2})?$/
              if (!this.obj.pointConversion.match(reg)) {
                this.$messageTips(this, 'warning', '请输入整数或小数点后不超过两位的小数')
                return false
              }
              // this.checkFixed()
            }
          }
          this.submitDisabled = true
          let params = JSON.parse(JSON.stringify(this.obj))
          params.categoryIds = this._categoryIdsFilter(params.categoryIds)
          if (params.categoryRange === 1 && !params.categoryIds.length) params.categoryIds = [0]
          Object.assign(params, {isGroup: this.isGroup})
          if (params.useRange === 1) {
            params.itemIds = []
          } else {
            params.categoryIds = []
          }
          api.createApply(params).then((response) => {
            this.submitDisabled = false
            if (response && response.data) {
              this.objId = response.data.id
              if (response.head.errCode === 0) {
                this.afterSave(response.data)
              } else {
                this.submitDisabled = false
              }
            }
          })
        }
      })
    }, 500),
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
    checkDiscount (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入0～100之间的整数'))
      } else if (value < 0 || value > 100 || parseInt(value) !== Number(value)) {
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
    checkTotal (rule, value, callback) {
      if (!value || value < 0) {
        callback(new Error('请输入预发行量(正整数)'))
      } else if (value > 1000000 || parseInt(value) !== Number(value)) {
        callback(new Error('请输入小于1000000的整数'))
      } else {
        callback()
      }
    },
    validateNum (rule, value, callback) {
      if (value === undefined || value === null || value === '') {
        callback(new Error('价格不能为空'))
      } else if (value < 0) {
        callback(new Error('价格不能为负数'))
      } else {
        callback()
      }
    },
    selectChange (selects) {
      this.selectData = []
      selects.forEach(item => {
        this.selectData.push(item)
      })
      return this.selectData
    },
    afterSave (data) {
      if (data.isGroup) {
        this.$emit('tabChange', {name: 'idCardMechanism', id: data.id})
      } else {
        this.$router.push({name: 'idcards'})
      }
    },
    addService () {
      this.selectData && this.selectData.length ? this.$refs.service.onDialogOpen(this.currTabs, this.selectData) : this.$refs.service.onDialogOpen()
    },
    disabledOrNot (bool) {
      var array = ['name', 'validPeriod', 'price', 'useRange', 'totalCount', 'categoryRange', 'categoryIds']
      for (var value of array) {
        schema.filter(function (v, i) {
          return v.name === value
        })[0].props.disabled = bool
      }
    },
    initInfo (resData) {
      if (resData && resData.id) {
        this.objId = resData.id
        // this.code = Number(resData.status) === 0
        this._getSelfTariff(resData.origId)
        if (!this.taskId) this.disabledOrNot(true)
        resData.discount || resData.discount === 0 ? this.obj.discountSelect = '1' : this.obj.discountSelect = '2'
        resData.categoryRange = 1
        if (resData.categoryIds && resData.categoryIds.length) {
          resData.itemIds = []
          this.selectData = []
          this.obj.useRange = 1
          resData.categoryIds[0] === '0' ? resData.categoryRange = 1 : resData.categoryRange = 2
        } else {
          resData.categoryIds = []
          this.obj.useRange = 2
        }
        let itemIds = []
        if (resData && resData.itemIdList) itemIds = resData.itemIdList
        if (itemIds && itemIds.length) {
          let serviceArrs = []
          itemIds.forEach(item => { serviceArrs.push(item) })
          sobapi.queryServiceVariable({serviceIds: serviceArrs}).then(result => {
            if (result && result.data) this.selectData = result.data
          })
        }
        Object.assign(this.obj, resData)
      }
    },
    _categoryIdsFilter (arr) {
      let arrFilter = arr || []
      arrFilter.forEach((item, index) => {
        if (item === '0') arrFilter.splice(index, 1)
      })
      return arrFilter
    },
    _getSelfTariff (clinicId) {
      let selfTariffParams = {}
      clinicId ? Object.assign(selfTariffParams, {origId: clinicId}) : Object.assign(selfTariffParams, {origId: storage.getLocalStorage('CLINICID')})
      selftariffsapi.list(selfTariffParams).then(result => {
        this.discountRules = result.data
      })
    }
  },
  created () {
    this.objId = this.$route.query.id
    this.disabledOrNot(false)
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
    this._getSelfTariff()
  },
  watch: {
    'dataDetails': {
      handler: function (val) {
        if (val) {
          this.initInfo(val)
        }
      },
      immediate: true
    },
    'selectData' () {
      this.obj.itemIds = this.selectData.map(v => {
        return {id: v.id, code: v.code}
      })
    },
    'obj.discountSelect' (val) {
      if (val === '1') {
        this.obj.discountRule = ''
      } else {
        this.obj.discount = ''
      }
    },
    'obj.whetherPoints' (val) {
      if (val === 2) {
        this.pointConversionDisabled = true
        this.rules.pointConversion[0].required = false
      } else {
        this.pointConversionDisabled = false
        this.rules.pointConversion[0].required = true
      }
    },
    'obj.categoryRange' (val) {
      if (val === 1) {
        this.obj.categoryIds = []
      } else {
        this.obj.categoryIds = this._categoryIdsFilter(this.obj.categoryIds)
      }
    }
  },
  components: {
    serviceDialog
  }
}
</script>
<style scoped>
#layout_box {
  margin-top: 40px;
}
.layout_inner {
  padding-top: 10px;
}
.panel-body {
  padding: 0;
  height: calc(100vh - 220px);
  overflow-y: scroll;
}
h4 {
  margin-top: 0;
}
.clearfix {
  *zoom: 1;
}
.clearfix:after {
  display: block;
  overflow: hidden;
  clear: both;
  height: 0;
  visibility: hidden;
  content: ".";
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.main-head form {
  margin-top: 0;
}
.panel-body /deep/ .box-card .el-card__body  { padding: 10px !important; }
.labelFix{display:inline-block;line-height:32px}
</style>

<template>
  <div class="storageconfigbox">
    <h4>系统配置</h4>
    <switch-list
      :schema-list="schema"
      v-model="obj">
      <template slot="pricingModel">
        <!-- 定价模式 -->
        <el-radio-group v-model="obj.pricingModel" @change="switchLinkChange($event, 'pricingModel')">
          <el-radio :label='0'>统一定价</el-radio>
          <el-radio :label="1" :disabled="clickPricingModel">批次定价</el-radio>
        </el-radio-group>
      </template>
      <template slot="allowMultipleBatch">
        <!-- 开方是否允许多批次 -->
        <el-switch
          :active-text="'允许'"
          :active-value="0"
          :disabled="obj.pricingModel === 0"
          v-model="obj.allowMultipleBatch"
          :inactive-value="1"
          @change="switchCheckChange($event, 'allowMultipleBatch')"
          :inactive-text="'不允许'">
        </el-switch>
      </template>
      <template slot="supplyRelationSetting">
        <!-- 预占库存 -->
        <el-switch
          :active-text="'限制'"
          :active-value="0"
          :inactive-value="1"
          :inactive-text="'不限'"
          @change="switchCheckChange($event, 'supplyRelationSetting')"
          v-model="obj.supplyRelationSetting">
        </el-switch>
      </template>
      <template slot="storageroom">
        <el-row class="storageroom one">
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="6">预占库存</el-col>
          <el-col :span="6">库存不足下单</el-col>
          <el-col :span="6">处方审核</el-col>
        </el-row>
        <el-row class="storageroom mb10">
          <el-col :span="6">
            <el-col>线下业务</el-col>
            <el-col>线上业务(互联网医院)</el-col>
          </el-col>
          <el-col :span="6" class="bts">
            <!-- 预占库存 -->
            <el-switch
              :active-text="'预占'"
              :active-value="0"
              :disabled="obj.pricingModel === 1"
              :inactive-value="1"
              :inactive-text="'不限'"
              @change="switchCheckChange($event, 'possess')"
              v-model="obj.possess">
            </el-switch>
          </el-col>
          <el-col :span="6">
            <el-col>
              <!-- 线下业务 库存不足下单 -->
              <el-switch
                :active-text="'允许'"
                :active-value="0"
                :inactive-value="1"
                :inactive-text="'不允许'"
                :disabled="switchDisabled || obj.pricingModel === 1"
                @change="switchCheckChange($event, 'lineLimit')"
                v-model="obj.lineLimit">
              </el-switch>
            </el-col>
            <el-col>
              <!-- 线上业务 库存不足下单 -->
              <el-switch
                :active-text="'允许'"
                :active-value="0"
                :inactive-value="1"
                :inactive-text="'不允许'"
                :disabled="switchDisabled || obj.pricingModel === 1"
                @change="switchCheckChange($event, 'onLineLimit')"
                v-model="obj.onLineLimit">
              </el-switch>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col>
              <!-- 线下业务 处方审核 -->
              <el-switch
                :active-text="'审核'"
                :active-value="0"
                :inactive-value="1"
                :inactive-text="'不审'"
                @change="switchCheckChange($event, 'toExamine', 1)"
                v-model="obj.toExamine">
              </el-switch>
            </el-col>
            <el-col>
              <!-- 线上业务 处方审核 -->
              <!--
                obj.examinStatus == 0
                全局配置：1 先支付再审核。 0 先审核再支付
                全局配置为先审核后支付模式下（0），库房线上业务不允许更改
                全局配置项，后推送账单时（先审核再支付（0）），线上业务 处方审核不允许设置为不审核状态（但是当全局配置为1时，现在线上业务 处方审核为不审，此时修改全局配置为0，会造成线上业务 处方审核无法修改为审核状态）
               -->
              <el-switch
                :active-text="'审核'"
                :active-value="0"
                :inactive-value="1"
                :inactive-text="'不审'"
                :disabled="obj.examinStatus == 0"
                @change="switchCheckChange($event, 'onLineToExamine', 2)"
                v-model="obj.onLineToExamine">
              </el-switch>
            </el-col>
          </el-col>
        </el-row>
      </template>
      <template slot="dispenseSetting">
        <ever-select
          style="width:300px"
          class="mb10"
          size="small"
          v-model="obj.dispenseSetting"
          @change="switchCheckChange($event, 'dispenseSetting')"
          :options="DISPENSE_SETTING_OPTIONS">
        </ever-select>
        <ever-select
          v-if="obj.dispenseSetting === DISPENSE_SETTING_OPTIONS[0].id"
          style="width:300px"
          class="mb10"
          size="small"
          v-model="obj.dispenseSettingValue"
          @change="dispenseSettingValueChange($event, 'dispenseSettingValue')"
          :options="DISPENSE_SETTING_VALUE_OPTIONS">
        </ever-select>
      </template>
      <template slot="processConfigDtoList" v-if="obj.processConfigDtoList && obj.dispenseSettingValue &&  obj.dispenseSetting == DISPENSE_SETTING_OPTIONS[0].id">
        <template v-for="(item, index) in obj.processConfigDtoList">
          <div
            :key="index"
            class="setproess pt10"
            v-if="(['100007', '100005'].includes(item.processId) && ['1', '3'].includes(obj.dispenseSettingValue)) || (item.processId == '100006' && ['2', '3'].includes(obj.dispenseSettingValue))">
            <span class="mr10 f_bold">{{['100007', '100005'].includes(item.processId) ? '门诊发药' : '住院发药'}}</span>
            <ever-select
              style="width:200px"
              size="small"
              v-model="item.processId"
              @change="processIdSelect($event, 'processId')"
              :options="['100007', '100005'].includes(item.processId) ? OUTPAITENT_PROCESS_OPTIONS : HOSPITAL_PROCESS_OPTIONS">
            </ever-select>
            <el-button class="ml10" @click="thisProcessObject(item.processItemObject, item.processId)" type="text">流程设置</el-button>
          </div>
        </template>
        <div class="setproess pt10 wid">
          <el-row class="storageroom one">
            <el-col :span="12">&nbsp;</el-col>
            <el-col :span="12">退药审核</el-col>
          </el-row>
          <el-row class="storageroom mb10">
            <el-col :span="12">
              <el-col>线下业务</el-col>
              <el-col>线上业务(互联网医院)</el-col>
            </el-col>
            <el-col :span="12">
              <el-col>
                <!-- 线下业务 退药审核 -->
                <el-switch
                  :active-text="'审核'"
                  :active-value="0"
                  :inactive-value="1"
                  :inactive-text="'不审'"
                  @change="switchCheckChange($event, 'orgBackStockToExamine')"
                  v-model="obj.orgBackStockToExamine">
                </el-switch>
              </el-col>
              <el-col>
                <!-- 线上业务 退药审核 -->
                <el-switch
                  :active-text="'审核'"
                  :active-value="0"
                  :inactive-value="1"
                  :inactive-text="'不审'"
                  @change="switchCheckChange($event, 'onLineOrgBackStockToExamine')"
                  v-model="obj.onLineOrgBackStockToExamine">
                </el-switch>
              </el-col>
            </el-col>
          </el-row>
          <div class="backstock">注：当启用“多库房统一摆药”流程时，退药审核也启用统一设置。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当启用“分库房发药”流程时，退药审核可以按照不同库房分别设置。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开启审核，则退药申请需要先经过单独的审核，才能操作是否入库。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不审，则直接进行入库操作。</div>
        </div>
      </template>
      <template slot="entryOutSwitch">
        <el-table
        border
        style="width: 800px!important"
        :span-method="arraySpanMethod"
        :data="obj.settingItemLimits">
        <el-table-column label="" align="center">
          <template slot-scope="scope">
            {{scope.$index > 6 ? '出库业务' : '入库业务'}}
          </template>
        </el-table-column>
        <el-table-column label="单据" align="center">
          <template slot-scope="scope">
            {{scope.row.orderType | formateValueToFnt({
              list: BUSINESS_TYPE_COLLECT,
              valueKey: 'examine'
            })}}
          </template>
        </el-table-column>
        <el-table-column label="审核" align="center">
          <template slot-scope="scope">
            <el-switch
            :active-text="'审核'"
            :active-value="0"
            :inactive-value="1"
            :inactive-text="'不审'"
            @change="switchChange(scope.row)"
            v-model="scope.row.status">
          </el-switch>
          </template>
        </el-table-column>
      </el-table>
      </template>
      <!-- 出入库打印样式配置 -->
      <template slot="stockPrint">
        <el-row :gutter="20">
          <el-col :span="4">
            <ever-select
              v-model="obj.stockPrint"
              :options="BATCH_STYLE_OPTIONS"
              @input="switchLinkChange($event, 'stockPrint')"
              :disabled='obj.pricingModel === 0'
              class="mr20"
              :clearable="false"
              size="small">
            </ever-select>
          </el-col>
        </el-row>
      </template>
      <!-- 是否开启序号配置 -->
      <template slot="printCodeSetting">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-switch
              :active-text="'开启'"
              :active-value="1"
              :inactive-value="2"
              :inactive-text="'关闭'"
              @change="switchCheckChange($event, 'printCodeSetting')"
              v-model="obj.printCodeSetting">
            </el-switch>
          </el-col>
        </el-row>
      </template>
    </switch-list>
    <hr>
    <div class="formbtn">
      <el-button @click="submitForm()" :loading="btnLoading" type="primary">保存</el-button>
      <el-button @click="resetForm()" :loading="btnLoading">重置</el-button>
    </div>
    <!-- 门诊流程设置 -->
    <dialog-slot title="门诊统一摆药流程设置" :dialogSlot.sync="dialogSlot">
      <process-config
        v-if="dialogSlot"
        :processId="processProcessId"
        :processObject="processObject"
        :pricingModel="obj.pricingModel"
        @processPop="processPop"></process-config>
    </dialog-slot>
    <!-- 住院打印流程 -->
    <dialog-slot title="住院集中摆药流程设置" :dialogSlot.sync="dialogUddSlot">
      <hospital-process-config
        v-if="dialogUddSlot"
        :processId="processProcessId"
        :processObject="processObject"
        @processPop="processPop"></hospital-process-config>
    </dialog-slot>
  </div>
</template>

<script>
import switchList from '@/warehouse/page/components/switch.list'
import dialogSlot from '@/warehouse/page/components/dialog.slot'
import processConfig from '@/warehouse/page/components/process.config'
import HospitalProcessConfig from '@/warehouse/page/components/hospital.process.config'
import storageroomapi from '../store/storageroomapi'
import storage from '@/util/storage'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import ManageConfigMixin from '@/manages/mixin/manageconfigmixin'
import { STENCIL_TYPE } from '@/util/common'
import {
  DISPENSE_SETTING_OPTIONS,
  DISPENSE_SETTING_VALUE_OPTIONS,
  OUTPAITENT_PROCESS_OPTIONS,
  HOSPITAL_PROCESS_OPTIONS,
  OUTPAITENT_PRINT_CONFIG,
  HOSPITAL_PRINT_CONFIG,
  BUSINESS_TYPE_COLLECT,
  BATCH_STYLE_OPTIONS
} from '@/warehouse/views/util/constant.js'

const schema = [
  {
    name: 'pricingModel',
    label: '定价模式',
    comp: 'custom',
    slotName: 'pricingModel',
    note: `注：1、院内业务实物类定价模式：统一定价则一个机构内一个物资同一时间按一个销售价销售；<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;批次定价则根据物资每批采购入库和加成率计算出每批的销售价。可以修改。<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、批次定价模式下，不支持库存不足下单，不支持不预占库存，不支持不指定库房发药，不支持库房发药时修改发药库房。`
  },
  {
    name: 'allowMultipleBatch',
    label: '开方是否允许多批次',
    comp: 'custom',
    slotName: 'allowMultipleBatch',
    note: '注：批次定价模式下，一次提交一张订单中，一个物资是否允许存在多个批次。'
  },
  {
    name: 'supplyRelationSetting',
    label: '库房间供应关系',
    comp: 'custom',
    slotName: 'supplyRelationSetting',
    note: `注：选择“不限”，则库房间可以按照相同物资类型进行调拨、申领、退库操作。<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择“限制”，则库房间需要设置院内供应关系，按照供应关系对相同物资类型进行调拨、申领、退库操作。`
  },
  {
    name: 'storageroom',
    label: '院内业务',
    comp: 'custom',
    slotName: 'storageroom',
    note: `注：1、预占库存：开启预占，则给该库房下发出库任务时，会预先锁定要出库的库存，库存不足时会标记为缺货。不限，则出库任务不会预先锁定库存，在实际操作出库时，才会扣减库存。<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、库存不足下单：开启允许，则库存为0或者不足本次下单数量时，也允许提交订单。不允许，则库存为0或者不足本次下单数量时，不允许提交订单。<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、门诊处方审核：开启审核，则所有的处方必须通过审核后，才能进入发药流程。不审，则处方不用审核直接进入发药流程。`
  },
  {
    name: 'dispenseSetting',
    label: '发药设置',
    comp: 'custom',
    slotName: 'dispenseSetting',
  },
  {
    name: 'processConfigDtoList',
    comp: 'custom',
    slotName: 'processConfigDtoList'
  },
  {
    name: 'entryOutSwitch',
    comp: 'custom',
    label: '出入库审核',
    slotName: 'entryOutSwitch',
    note: `注：开启审核，则录入出入库单据后，需要经过审核才能完成出入库操作。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不审，则提交出入库单据后，直接完成。`
  },
  {
    name: 'stockPrint',
    comp: 'custom',
    label: '出入库打印',
    slotName: 'stockPrint',
    note: '注：普通样式单据打印时，物资不带系统批号等信息'
  },
  {
    name: 'printCodeSetting',
    comp: 'custom',
    label: '是否启用序号',
    slotName: 'printCodeSetting',
    note: '注：开启后出入库单将生产序号，并在报表中体现。序号按照不同库房不同业务类型单据升序。'
  }
]
const outpaitentProcessId = {
  processId: OUTPAITENT_PROCESS_OPTIONS[0].id,
  processItemObject: { ...OUTPAITENT_PRINT_CONFIG },
  name: OUTPAITENT_PROCESS_OPTIONS[0].name,
  storageRoomId: OUTPAITENT_PROCESS_OPTIONS[0].id
}
const hospitalProcessId = {
  processId: HOSPITAL_PROCESS_OPTIONS[0].id,
  processItemObject: { ...HOSPITAL_PRINT_CONFIG },
  name: HOSPITAL_PROCESS_OPTIONS[0].name,
  storageRoomId: HOSPITAL_PROCESS_OPTIONS[0].id
}
export default {
  mixins: [storage, getStorage, ManageConfigMixin],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.value = ''
    return {
      obj,
      schema,
      DISPENSE_SETTING_OPTIONS,
      DISPENSE_SETTING_VALUE_OPTIONS,
      OUTPAITENT_PROCESS_OPTIONS,
      HOSPITAL_PROCESS_OPTIONS,
      BUSINESS_TYPE_COLLECT,
      BATCH_STYLE_OPTIONS,
      storageroomapi,
      systemTypeObject: STENCIL_TYPE[0],
      oldobj: null,
      dialogSlot: false,
      dialogUddSlot: false,
      btnLoading: false,
      processObject: {},
      processIndex: 0,
      objId: true,
      switchDisabled: true,
      processConfigDtoList: null,
      checkOldData: null,
      settingItemLimits: [],
      submitObject: {},
    }
  },
  created () {
    this.getConfigInfo()
  },
  computed: {
    clickPricingModel () {
      return Boolean(!this.haveManage)
    }
  },
  watch: {
    'obj.dispenseSetting' (v) {
      if (v === DISPENSE_SETTING_OPTIONS[0].id) {
        this.$ever.getFieldFromSchema(this.schema, 'dispenseSetting').note = '注：1、统一摆药只对门诊和住院起作用，互联网商城和超市收银可单独在库房管理里设置自己的流程。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、多库房统一摆药，则发药不再区分库房操作，在发药界面中允许操作全部药房的发药任务。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、启用多库房统一发药后，请在处方设置为开单并指定库房，否则会导致开单不成功。'
        if (!this.obj.processConfigDtoList) this.dispenseSettingValueChange(this.obj.dispenseSettingValue)
      } else {
        this.$ever.getFieldFromSchema(this.schema, 'dispenseSetting').note = '注：1、发药区分库房操作，需要在每个库房中配置发药流程，并且每个库房只能操作本库房的任务<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、启用分库房发药，门诊处方开单时允许不指定库房，但住院医嘱必须指定库房'
      }
    },
    'obj.possess' (v) {
      this.switchDisabled = !!v
    },
    'obj.pricingModel' (v) {
      if (v && this.obj.processConfigDtoList) {
        this.obj.processConfigDtoList = this.obj.processConfigDtoList.map(item => {
          if (item.processId === '100005') {
            item.processItemObject.spanOrg = 1
          }
          return item
        })
      }
    }
  },
  methods: {
    // 有联动操作的 switch
    async switchLinkChange (val, key) {
      let setSubmitObj = {}
      if (key === 'pricingModel') {
        // 当选择统一定价时，开方是否允许多批次置灰
        await this.storageroomapi.checkOrder().then(res => {
          if (res.flag) {
            this.obj[key] = this.oldobj[key]
            return this.everWarning('有未完成任务，不能修改')
          } else {
            if (val === 1) {
              setSubmitObj = {
                'lineLimit': 1,
                'onLineLimit': 1,
                'possess': 0,
                'allowMultipleBatch': 0
              }
            } else {
              setSubmitObj = {
                'allowMultipleBatch': 1,
                'stockPrint': 1,
              }
            }
            this.submitObject[key] = val
            if (this.oldobj[key] !== val) {
              this.linkSetSubmitObj(setSubmitObj, 'add')
            } else {
              this.linkSetSubmitObj(setSubmitObj, 'del')
            }
          }
        })
      } else if (key === 'stockPrint') {
        this.submitObject[key] = val
        this.linkSetSubmitObj(setSubmitObj, 'add')
      }
    },
    // 批量设置提交参数
    linkSetSubmitObj (obj, type) {
      if (!Object.keys(obj).length) return
      for (let key in obj) {
        const val = obj[key]
        this.obj[key] = val
        // 联动的选项是否跟以前的一样，一样就删除
        if (this.oldobj[key] !== val) {
          this.submitObject[key] = val
        } else {
          delete this.submitObject[key]
        }
      }
    },
    // 验证switch是否改动
    switchCheckChange (val, key, type) {
      if (this.oldobj[key] !== val) {
        if (key === 'possess') {
          this.storageroomapi.outStockCheck({ orgId: this.oldobj.orgId }).then(res => {
            if (!res) {
              this.submitObject[key] = val
              if (val) {
                this.obj.lineLimit = 0
                this.obj.onLineLimit = 0
              }
            } else {
              this.obj[key] = this.oldobj[key]
              return this.everWarning('有未完成任务，不能修改')
            }
          })
        } else if (key === 'toExamine' || key === 'onLineToExamine') {
          this.storageroomapi.getTaskListResult({ orgId: this.obj.orgId, scene: type }).then(res => {
            if (!res) {
              this.submitObject[key] = val
            } else {
              this.obj[key] = this.oldobj[key]
              return this.everWarning('处方审核有未完成任务，不能修改')
            }
          })
        } else if (key === 'pricingModel') {
          // 当选择统一定价时，开方是否允许多批次置灰
          this.storageroomapi.checkOrder().then(res => {
            if (res.flag) {
              this.obj[key] = this.oldobj[key]
              return this.everWarning('有未完成任务，不能修改')
            } else {
              this.submitObject[key] = val
            }
          })
        } else {
          this.submitObject[key] = val
        }
      } else {
        delete this.submitObject[key]
      }
    },
    // 出入库审核 是否改动变化
    switchChange (data) {
      const findData = this.oldobj.settingItemLimits.find(item => item.orderType === data.orderType)
      if (findData && findData.status !== data.status) {
        if (!this.settingItemLimits.some(item => data.orderType === item.orderType)) {
          this.storageroomapi.checkInOutStatus({ orderType: data.orderType }).then(res => {
            if (res && res.flag) {
              this.settingItemLimits.push(data)
            } else {
              data.status = findData.status
              return this.everWarning(`${this.$filters.formateValueToFnt(data.orderType, { list: this.BUSINESS_TYPE_COLLECT, valueKey: 'examine' })}有未完成的单据，不能修改`)
            }
          })
        }
      } else {
        const index = this.settingItemLimits.findIndex(item => item.orderType === data.orderType)
        if (~index) this.settingItemLimits.splice(index, 1)
      }
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0 || rowIndex === 7) {
          return {
            rowspan: rowIndex === 7 ? 6 : 7,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    processIdSelect (val, key) {
      if (!this.submitObject[key] || this.submitObject[key] !== val) {
        this.submitObject[key] = val
      } else {
        delete this.submitObject[key]
      }
      const oldIndex = this.oldobj.processConfigDtoList.findIndex(item => item.processId === val)
      if (~oldIndex) {
        const index = this.obj.processConfigDtoList.findIndex(item => item.processId === this.oldobj.processConfigDtoList[oldIndex].processId)
        if (~index) this.obj.processConfigDtoList[index] = JSON.parse(JSON.stringify(this.oldobj.processConfigDtoList[oldIndex]))
        this.obj = JSON.parse(JSON.stringify(this.obj))
      }
    },
    dispenseSettingValueChange (v, key) {
      if (this.oldobj[key] !== v) {
        this.submitObject[key] = v
      } else {
        delete this.submitObject[key]
      }
      if (!v || (this.obj.processConfigDtoList && this.obj.processConfigDtoList.length > 1)) return
      if (!this.obj.processConfigDtoList) {
        let outpaitentProcessIdold = { ...outpaitentProcessId }
        outpaitentProcessIdold.processId = '100007'
        this.obj.processConfigDtoList = [{ ...outpaitentProcessId }, { ...hospitalProcessId }]
      } else {
        this.obj.processConfigDtoList.push(this.obj.processConfigDtoList[0].processId === '100006' ? { ...outpaitentProcessId } : { ...hospitalProcessId })
      }
    },
    showUddDialog () { // 控制流程设置展示udd弹框还是门诊医嘱弹框
      if (this.processProcessId === HOSPITAL_PROCESS_OPTIONS[0].id) {
        this.dialogUddSlot = !this.dialogUddSlot
      } else {
        this.dialogSlot = !this.dialogSlot
      }
    },
    thisProcessObject (data, processId) {
      this.processProcessId = processId
      this.processObject = data
      this.showUddDialog()
    },
    processPop (data) {
      const index = this.obj.processConfigDtoList.findIndex(item => item.processId === this.processProcessId)
      this.obj.processConfigDtoList[index].processItemObject = data
      this.showUddDialog()
    },
    initProcessData (obj) {
      if (obj.processConfigDtoList) {
        if (!obj.processConfigDtoList.some(item => item.processId === '100007')) {
          let outpaitent = { ...outpaitentProcessId }
          outpaitent.processId = '100007'
          obj.processConfigDtoList.push(outpaitent)
        }
        if (!obj.processConfigDtoList.some(item => item.processId === '100005')) {
          let outpaitent = { ...outpaitentProcessId }
          outpaitent.processId = '100005'
          obj.processConfigDtoList.push(outpaitent)
        }
        if (!obj.processConfigDtoList.some(item => item.processId === '100006')) {
          obj.processConfigDtoList.push({ ...hospitalProcessId })
        }
      } else {
        let outpaitentProcessIdold = { ...outpaitentProcessId }
        outpaitentProcessIdold.processId = '100007'
        obj.processConfigDtoList = [{ ...outpaitentProcessId }, { ...outpaitentProcessIdold }, { ...hospitalProcessId }]
      }
    },
    getConfigInfo (check) {
      this.storageroomapi.selectSystemSettingByClinicId().then(res => {
        if (res) {
          if (!res.settingItemLimits || !res.settingItemLimits.length) {
            res.settingItemLimits = BUSINESS_TYPE_COLLECT.filter(item => item.examine).map(item => {
              return { orderType: item.examine, status: 1 }
            })
          }
          storage.setLocalStorage('IS_BATCHPRICE', res.pricingModel)
          this.oldobj = JSON.parse(JSON.stringify(res))
          this.processConfigDtoList = JSON.parse(JSON.stringify(res.processConfigDtoList || []))
          this.initProcessData(this.oldobj)
          this.obj = res
          if (this.obj.processConfigDtoList) this.obj.processConfigDtoList = this.obj.processConfigDtoList.filter(item => item.configSwitch === 0)
          if (check) this.$store.commit('setStorageroomSystemConfig', Object.assign({}, res || {}))
          this.checkOldData = JSON.parse(JSON.stringify(this.obj))
          if (this.checkOldData.value) this.checkOldData.value = parseInt(this.checkOldData.value)
        }
      })
    },
    changesParamsObject (data) {
      let newObject = {}
      newObject.id = data.id
      newObject.orgId = data.orgId
      newObject.settingItemLimits = this.settingItemLimits
      newObject = Object.assign(newObject, this.submitObject)
      const codes = !data.processConfigDtoList ? [] : data.processConfigDtoList.map(item => { return item.processId })
      if (
        (newObject.dispenseSetting && newObject.dispenseSetting === DISPENSE_SETTING_OPTIONS[0].id) ||
        newObject.dispenseSettingValue ||
        newObject.processId ||
        (data.processConfigDtoList && JSON.stringify(data.processConfigDtoList) !== JSON.stringify(this.oldobj.processConfigDtoList.filter(item => codes.includes(item.processId))))) {
        newObject.processConfigDtoList = data.processConfigDtoList ? data.processConfigDtoList.filter(item => {
          item.storageRoomId = this.obj.id
          if (item.processItemObject.focusHandle) item.processItemObject.focusHandle = 0
          if (item.processId === '100007') item.processItemObject.spanOrg = 1
          if (item.processId === OUTPAITENT_PROCESS_OPTIONS[1].id) item.name = OUTPAITENT_PROCESS_OPTIONS[1].name
          return data.dispenseSettingValue === '3' || (data.dispenseSettingValue === '2' && item.processId === '100006') || (data.dispenseSettingValue === '1' && ['100007', '100005'].includes(item.processId))
        }) : []
        newObject.dispenseSetting = data.dispenseSetting
        newObject.dispenseSettingValue = data.dispenseSettingValue
      }
      if (newObject.dispenseSetting && newObject.dispenseSetting !== DISPENSE_SETTING_OPTIONS[0].id) newObject.processConfigDtoList = null
      if (newObject.processId) delete newObject.processId
      if (newObject.undefined) delete newObject.undefined
      if (!newObject.settingItemLimits.length) delete newObject.settingItemLimits
      if (newObject.possess) {
        newObject.lineLimit = 0
        newObject.onLineLimit = 0
      }
      return newObject
    },
    submitForm () {
      if (JSON.stringify(this.obj) === JSON.stringify(this.checkOldData)) {
        return this.everWarning('没有做任何修改')
      }
      let params = { ...this.obj }
      if (this.obj.dispenseSetting === DISPENSE_SETTING_OPTIONS[0].id) {
        if (!this.obj.dispenseSettingValue || !this.obj.processConfigDtoList) {
          return this.$messageTips(this, 'warning', '信息设置不完整')
        }
      }
      if (this.obj.dispenseSetting !== DISPENSE_SETTING_OPTIONS[0].id) delete params.orgBackStockToExamine
      params = this.changesParamsObject(params)
      if (Object.keys(params).length === 2) return this.everWarning('没有做任何修改')
      this.btnLoading = true
      const loading = this.$loading({
        lock: true,
        text: '系统配置生效中，请稍候',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.95)'
      })
      this.storageroomapi.updateSystemSettingById(params).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '更新系统配置成功')
          if (this.storageItem.length) {
            if (this.obj.dispenseSetting === DISPENSE_SETTING_OPTIONS[0].id) {
              this.storageItem.forEach(item => {
                item.toExamine = params.orgBackStockToExamine
                item.onLineToExamine = params.onLineOrgBackStockToExamine
              })
            } else {
              this.storageItem.forEach(item => {
                item.toExamine = 1
                item.onLineToExamine = 1
              })
            }
            storage.setLocalStorage('STORAGE_ITEM', JSON.stringify(this.storageItem))
          }
          this.getConfigInfo(true)
        } else {
          let oldObject = JSON.parse(JSON.stringify(this.oldobj))
          oldObject.processConfigDtoList = JSON.parse(JSON.stringify(this.processConfigDtoList)).filter(item => !item.configSwitch)
          this.obj = oldObject
        }
        loading.close()
        this.btnLoading = false
        this.settingItemLimits = []
        this.submitObject = {}
      })
    },
    resetForm () {
      let oldObject = JSON.parse(JSON.stringify(this.oldobj))
      oldObject.processConfigDtoList = JSON.parse(JSON.stringify(this.processConfigDtoList)).filter(item => !item.configSwitch)
      this.obj = oldObject
      this.settingItemLimits = []
    }
  },
  components: {
    switchList,
    dialogSlot,
    processConfig,
    HospitalProcessConfig
  }
}
</script>

<style scoped lang="scss">
.storageconfigbox{
  background: #fff;
  h4{
    line-height: 60px;
    font-size: 18px;
    padding-left: 30px;
    margin: 0
  }
  .formbtn{
    text-align: center;
    padding-bottom: 20px;
    /deep/ .el-button {
      padding: 10px 30px;
    }
  }
  /deep/ .el-form-item{
    border-bottom: 1px dashed #ccc;
    padding-bottom: 10px;
    &:first-child {
      border:0px;
      padding-bottom: 0px;
      margin-bottom: 10px;
    }
    &:nth-child(5) {
      border:0px;
      padding-bottom: 0px;
      margin-bottom: 10px;
    }
    &:nth-child(6) {
      padding-bottom: 25px;
    }
    &:last-child{
      border:0px;
    }
  }
  .setproess{
    width: 700px;
    padding-left: 100px;
    background: #f2f2f2;
    &:last-child{
      padding-bottom: 10px;
    }
  }
  .wid {
    .storageroom {
      width: 340px;
      text-align: center;
      background: #fff;
    }
    .one{
      border-left: 1px solid #ccc;
      line-height: 34px;
      font-weight: bold;
    }
  }
}
.days{
  width: 60px;
  margin: 0 5px;
  /deep/ .el-input__inner{
    text-align: center!important;
  }
}
.backstock{
  display: block;
  color: #666;
  line-height: 26px;
  // padding-left: 78px;
  // padding-top: 10px;
}
.storageroom{
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
  width: 800px;
  .el-col-6 {
    text-align: center;
    line-height: 34px;
  }
  .bts{
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    line-height: 69px;
  }
  .el-col-24 {
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
}
.one {
  .el-col-6 {
    border-left: 1px solid #ccc;
    background: #ddd;
    font-weight: bold;
    line-height: 40px;
  }
}
.flex {
  display: flex;
  align-items: flex-start
}
</style>

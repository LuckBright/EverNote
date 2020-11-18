<template>
  <section>
    <div class="table_title clearfix">
      <div class="fl">
        <span v-if="isPrint && outOfStock !== 23" class="fl mr10">
          <el-checkbox @change="printChange" v-model="print"></el-checkbox>
        </span>
        <!-- 根据状态生成对应图标 -->
        <span v-if="status && status !== undefined" class="fl mr10">
          <svg class="icon" style="font-size:58px; height: 30px" aria-hidden="true">
            <use :xlink:href="'#' + iconName"></use>
          </svg>
        </span>
        <span class="fl mr10">
          <span class="cGray6">处方单号：</span>
          <strong>{{code || itemData.recipeCode}}</strong>
        </span>
        <!-- 执行单号 -->
        <span class="fl" style="display: block;width: 30px;height: 18px;">
          <el-popover
            v-if="excCode || itemData.adviceExecuteId"
            placement="bottom"
            title
            width="400"
            trigger="hover"
            content>
            <span>
              <span class="cGray6">执行单号：</span>
              {{excCode || itemData.adviceExecuteId}}
            </span>
            <span slot="reference">
              <svg class="icon" style="font-size:30px; height: 18px" aria-hidden="true">
                <use xlink:href="#icon-zhixingren"></use>
              </svg>
            </span>
          </el-popover>
        </span>
        <span class="ml15">
          <span class="cGray6">申请时间：</span>
          {{itemData.createTime || date}}
        </span>
        <span class="ml15 cGray6">医生：</span>
        <strong>{{doctorData.doctorName}}</strong>
        （{{doctorData.providerName}}）
        <span
          class="ml15"
          v-if="status === 6 && itemData.dispenseFinishTime">
          <span class="cGray6">发药时间：</span>
          {{itemData.dispenseFinishTime}}
        </span>
        <!-- 非当日  超三日图标 -->
        <el-tooltip
          v-if="(itemData.outpatientDispenseList && itemData.outpatientDispenseList[0] && itemData.outpatientDispenseList[0].isInvalid == 1) || itemData.isInvalid == 1"
          effect="dark"
          content="超时，待与医生沟通"
          placement="top">
          <svg class="icon ml10" aria-hidden="true" style="font-size:40px; height: 24px">
            <use xlink:href="#icon-feidangri"></use>
          </svg>
        </el-tooltip>
        <!-- <el-tooltip 梅老板说先不显示超三日图标
          v-if="(itemData.outpatientDispenseList && itemData.outpatientDispenseList[0] && itemData.outpatientDispenseList[0].isInvalid == 2) || itemData.isInvalid == 2"
          effect="dark"
          content="超过3日，不能发药"
          placement="top">
          <svg class="icon ml10" aria-hidden="true" style="font-size:40px; height: 24px">
            <use xlink:href="#icon-chaosanri"></use>
          </svg>
        </el-tooltip> -->
      </div>
      <div class="fr">
        <check-information
          :propData="doctorData"
          :testResult="testResult"
          :outTest="outTest"
          :patientData="patientData"
        ></check-information>
        <span class="mr10 inline-block" v-if="status === 6 && mailState">
          <el-button
          type="text"
          @click="handleMailing">
          <svg class="icon" aria-hidden="true" style="font-size:16px; height: 16px">
            <use xlink:href="#icon-youji"></use>
          </svg>
          <span class="cBlack f_nor">邮寄信息</span>
        </el-button>
        </span>
        <span class="mr10 inline-block"
          v-if="!identification && status < 6 && outOfStock !== 23 && !readOnly">
          <el-button
          type="text"
          @click="handleException('sign')">
          <svg class="icon" aria-hidden="true" style="font-size:18px; height: 18px">
            <use xlink:href="#icon-biaoji"></use>
          </svg>
          <span class="cBlack f_nor">标记异常</span>
          </el-button>
        </span>
        <span class="mr10 inline-block"
          v-if="identification && status < 6 && outOfStock !== 23 && !readOnly">
          <el-button
          type="text"
          @click="handleException('cancel')">
          <svg class="icon" aria-hidden="true" style="font-size:18px; height: 18px">
            <use xlink:href="#icon-quxiaoyichang"></use>
          </svg>
          <span class="cBlack f_nor">取消异常</span>
        </el-button>
        </span>
        <span class="mr10 inline-block"
          v-if="outOfStock === 23 && !readOnly && status < 6">
          <el-button
          type="text"
          @click="handleException('shortage')">
          <svg class="icon" aria-hidden="true" style="font-size:18px; height: 18px">
            <use :xlink:href="'#' + (remind.dispenseRemind === 1 ? 'icon-wufadaohuo1' : 'icon-zaicitixing')"></use>
          </svg>
          <span class="cBlack f_nor">{{remind.dispenseRemind | formateValueToFnt({list: DISPENSING_REMIND})}}</span>
        </el-button>
        </span>
      </div>
    </div>
    <el-table
      :class="{
        'tableiconhover': true,
        'no-border': true,
        'design_table': true,
        'select': isSelect,
        'design_error_table': itemData.identification
      }"
      :data.sync="patientData"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      ref="wasttable"
      :cell-class-name="tableCellClassName">
      <el-table-column
        v-for="item in !CONSUMABLES_TYPE.includes(adviceType) ? T_HEAD : CONSUMABLES_HEAD"
        v-bind="item.options"
        :key="item.name">
        <template slot="header" slot-scope="scope">
          <el-tooltip v-if="item.name === 'name'" class="item" :content="`${needIcon(adviceType).name}`" effect="dark" placement="top">
            <svg class="icon mr5" style="fontSize: 18px; height: 18px;" aria-hidden="true">
              <use :xlink:href="'#' + needIcon(adviceType).icon"></use>
            </svg>
          </el-tooltip>
          <span v-if="item.options">{{item.options.label}}</span>
        </template>
        <template slot-scope="scope">
          <slot :name="item.name" v-bind="scope">
            <template v-if="item.name === 'name'">
              <div>
                <div v-if="scope.row.isMine" style="display: inline-block;">
                  <i class="f12 iconfont icon-guanlian2" v-if="scope.row.isMine == 1"></i>
                  <i
                    class="f12 iconfont icon-guanlian1"
                    v-if="scope.row.oMineObj && scope.$index == scope.row.oMineObj[scope.row.adviceId].sub && scope.row.isMine == 2"
                  ></i>
                  <i class="f12 iconfont icon-guanlian" v-else-if="scope.row.isMine == 2"></i>
                </div>
                <span
                  v-if="scope.row.localSettingObject && parserJSON({data: scope.row.localSettingObject.materialSkuObject.ext, property: IDENTIFICATION_CODE})"
                >{{parserJSON({data: scope.row.localSettingObject.materialSkuObject.ext, property: IDENTIFICATION_CODE})}} -</span>
                <wh-code-to-name
                  v-if="scope.row.localSettingObject"
                  :isExt="true"
                  :patchObj="{
                    code: MATERILA_CODE,
                    list: scope.row.localSettingObject.materialSkuObject.ext,
                    isInfo: false
                  }"
                ></wh-code-to-name>
                <i v-if="WEST_MEDICINE_TYPE.includes(adviceType)" class="iconfont icon-shuoming" @click="drugOpen(scope.row)"></i>
                <div
                  v-if="isSkinTestMaterial(scope.row) && !outTest"
                  class="red f12"
                >该药品需要皮试才能使用，医生暂未开具皮试医嘱</div>
              </div>
              <div
                class="cOrange"
                v-if="(scope.row.cdssResult && !scope.row.isMine) || (scope.row.cdssResult && scope.row.isMine && scope.$index == patientData.length - 1)"
              >
                <div class="f_bold">合理用药提醒：</div>
                <span v-html="formatHTML(scope.row.cdssResult)"></span>
              </div>
              <div class="red" v-if="scope.row.identification">
                <span class="f_bold">异常原因：</span>
                <span v-html="filterClassifyList(scope.row.classifyList)"></span>
              </div>
            </template>
            <template v-else-if="item.name === 'spec'">
              <span v-if="scope.row.localSettingObject && CONSUMABLES_TYPE.includes(adviceType)">
                <wh-code-to-name
                  :showIcon="false"
                  :isExt="true"
                  :patchObj="{
                    code: [SPEC, PACKAGE_CODE],
                    list: scope.row.localSettingObject.materialSkuObject.ext,
                    isInfo: false,
                    mark: '/'
                  }">
                </wh-code-to-name>
              </span>
              <span v-else>
                <wh-code-to-name
                  :showIcon="false"
                  :isExt="true"
                  :patchObj="{
                    code: [SPU_SPEC_CODE],
                    list: scope.row.localSettingObject.materialSkuObject.ext,
                    isInfo: false
                  }"
                ></wh-code-to-name>
              </span>
            </template>
            <template v-else-if="item.name === 'type'">
              <span v-if="scope.row.localSettingObject">
                <wh-code-to-name
                  :showIcon="false"
                  :isExt="true"
                  :patchObj="{
                    code: [DOSAGE],
                    list: scope.row.localSettingObject.materialSkuObject.ext,
                    isInfo: false
                  }"
                ></wh-code-to-name>
              </span>
            </template>
            <template
              v-else-if="item.name === 'dosage'"
            >{{scope.row.measure}}{{scope.row.measureUnitName}}</template>
            <template v-else-if="item.name === 'rate'">
              <span>{{scope.row.useFreqTxt}}</span>
            </template>
            <template v-else-if="item.name === 'days'">
              <span>{{`${scope.row.totalUseDay}天`}}</span>
            </template>
            <template v-else-if="item.name === 'channel'">
              <span>
                {{scope.row.employtxt}}
                <sys-value
                  type="THC_CPOE_DropRate"
                  v-if="scope.row.dropSpeed"
                  :code="scope.row.dropSpeed"
                ></sys-value>
                <el-popover
                  :key="scope.$index + 'channel'"
                  placement="bottom"
                  width="200"
                  v-if="scope.row.employ == '1460'"
                  trigger="hover"
                >
                  <template>皮试结果：{{itemData.taskRemarkLogObject ? itemData.taskRemarkLogObject.remark : '-'}}</template>
                  <el-button size="mini" type="text" slot="reference">
                    <svg class="icon" style="fontSize: 14px; height: 14px;" aria-hidden="true">
                      <use xlink:href="#icon-pishuo"></use>
                    </svg>
                  </el-button>
                </el-popover>
              </span>
            </template>
            <template v-else-if="item.name === 'length'">
              <span>{{scope.row.num}}</span>
              <span
                v-if="scope.row.localSettingObject"
              >
              <wh-single-code-to-name
                :isExt="true"
                :patchObj="{
                  list: scope.row.localSettingObject.materialSkuObject.ext,
                  code: PACKAGE_CODE
                }">
              </wh-single-code-to-name>
              </span>
            </template>
            <template v-else-if="item.name === 'position'">
              <!-- <span v-if="scope.row && scope.row.containerId">{{JSON.parse(scope.row.containerId)[0]}}</span> -->
              <span>{{scope.row.freightObject && scope.row.freightObject.code}}</span>
            </template>
            <template
              v-else-if="item.name === 'other' && status > 3 && status < 7 && (itemData.isPrint === 2 || !isPrint) && !itemData.identification"
            >
              <div>
                <el-button
                  :id="scope.row.adviceId"
                  class="printshow"
                  size="mini"
                  v-if="scope.row.isMine == 1 && objGet(dispenseSettingObject, 'outPatientDispenseSettingObject.dispensePatient', '') == 1 && !CONSUMABLES_TYPE.includes(adviceType)"
                  @click="handelMakeUpdebounce(scope.row.oMineObj[scope.row.adviceId].child)"
                  type="text"
                >补打标签</el-button>
                <el-button
                  class="printshow"
                  :class="scope.row.adviceId"
                  size="mini"
                  v-else-if="(objGet(dispenseSettingObject, 'outPatientDispenseSettingObject.dispensePatient', '') == 2 && objGet(dispenseSettingObject, 'outPatientDispenseSettingObject.dispensePaste', '') == 1) && !CONSUMABLES_TYPE.includes(adviceType)
                || (!scope.row.isMine && objGet(dispenseSettingObject, 'outPatientDispenseSettingObject.dispensePatient', '') == 1 && objGet(dispenseSettingObject, 'outPatientDispenseSettingObject.dispensePaste', '') == 1) && !CONSUMABLES_TYPE.includes(adviceType)"
                  @click="handelMakeUpdebounce(scope.row)"
                  type="text"
                >补打标签</el-button>
              </div>
            </template>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- 邮寄组件 -->
    <mail-dialog
      v-if="mailState"
      :itemData="itemData"
      :visible.sync="dialogVisibleMail"
      :isClick="isClick"
      @sendMedicine="sendMedicine"
      :visitSn="visitSn"
    ></mail-dialog>
    <!-- 查看药品说明 -->
    <drug-instructions v-if="thisObjData.localSettingObject" ref="drugTips" :objData="thisObjData"></drug-instructions>
    <!-- 异常标记 -->
    <exception-dialog
      v-if="operate === 'cancel'"
      :appendBody="appendBody"
      :exceptionData="exceptionData"
      :visible.sync="dialogVisible"
      :operate="operate"
      @confirm="handleSave"
    ></exception-dialog>
    <!-- 新版标记异常 -->
    <anomaly-dialog
      v-if="operate === 'sign'"
      :visible.sync="dialogVisible"
      :exceptionData="exceptionData"
      :operate="operate"
      @confirm="handleSave"
    ></anomaly-dialog>
  </section>
</template>

<script>
import commonApi from '../store/dispensingcommonapi.js'
import { patch, MATERILA_CODE, SPU_SPEC_CODE, DOSAGE, parserJSON, parserComplex, DISPENSING_STATUS, IDENTIFICATION_CODE, SCENE, debounce, objGet, DISPENSING_REMIND, whComFn, CONSUMABLES_TYPE, WEST_MEDICINE_TYPE, SPEC, PACKAGE_CODE } from '@/util/common'
import { T_HEAD, CONSUMABLES_HEAD } from './table.head'
import drugInstructions from './drug.instructions'
import exceptionDialog from '@/warehouse/page/storages/components/exceptiondialog'
import checkInformation from '@/warehouse/page/storages/dispensings/components/check.information'
import anomalyDialog from '@/warehouse/page/storages/components/anomalydialog'
import dispenseSettingMixin from '@/warehouse/util/dispense.setting.mixin'
import needIcon from '@/warehouse/page/storages/dispensings/mixins/needicon.mixins.js'
import mailDialog from '@/warehouse/page/storages/components/maildialog'
import citys from '@/util/citys'
import { setUpClassifyName } from '@/util/formcustom'

export default {
  mixins: [dispenseSettingMixin, needIcon],
  props: {
    patientObject: {
      type: Object,
      default () {
        return {}
      }
    },
    storageRoomObject: {
      type: Object,
      default () {
        return {}
      }
    },
    doctorData: {
      type: Object,
      default () {
        return {}
      }
    },
    checked: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default () {
        return {}
      }
    },
    appendBody: {
      type: Boolean,
      default: false
    },
    isSelect: {
      type: Boolean,
      default: false
    },
    identification: {
      type: Number,
      default: 0
    },
    itemId: {
      type: String
    },
    code: {
      type: String
    },
    excCode: {
      type: String
    },
    status: {
      type: Number,
      default: undefined
    },
    outOfStock: { // 缺货处方标记 当为23时表明这个处方单为缺货处方单
      type: Number,
      default: 0
    },
    date: {
      default () {
        return new Date()
      }
    },
    isPrint: {
      type: Boolean,
      default: false
    },
    publicPrintStatus: {
      type: Boolean,
      default: false
    },
    error: {
      type: Number
    },
    patientData: {
      type: Array,
      default () {
        return []
      }
    },
    opdData: {
      type: Object,
      default () {
        return {}
      }
    },
    visitSn: {
      type: String
    },
    mailState: {
      tyepe: Number,
      default () {
        return 0
      }
    },
    outTest: {
      type: Boolean,
      default: false
    },
    testResult: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      MATERILA_CODE,
      SPU_SPEC_CODE,
      DISPENSING_REMIND,
      WEST_MEDICINE_TYPE,
      SPEC,
      remind: {}, // 无法到货状态
      IDENTIFICATION_CODE,
      setUpClassifyName,
      DOSAGE,
      CONSUMABLES_TYPE,
      citys,
      SCENE,
      DISPENSING_STATUS,
      mineIndex: '',
      mineArr: [],
      T_HEAD,
      CONSUMABLES_HEAD,
      PACKAGE_CODE,
      parserJSON,
      parserComplex,
      exceptionData: [],
      print: false,
      operate: 'sign',
      objGet,
      isClick: false, // 判断审核并发药是否被点击
      thisObjData: {},
      dialogVisible: false, // 异常标记弹窗
      dialogVisibleMail: false, // 邮寄信息弹窗
      adviceType: '' // 物资类型
    }
  },
  watch: {
    'itemData': {
      async handler (v) {
        this.adviceType = v.outpatientDispenseList ? v.outpatientDispenseList[0].adviceType : v.adviceType
        this.remind = v
        if (v.mailAddressObject && v.mailFlag) {
          v.mailAddressObject._address = await this.citys.getCityName1(v.mailAddressObject.address)
        }
        if (this.remind && !this.remind.dispenseRemind) this.remind.dispenseRemind = 1
      },
      deep: true,
      immediate: true
    },
    publicPrintStatus () {
      this.print = this.publicPrintStatus
    },
    'itemData.checked' (v) {
      this.print = v
    },
    'checked' (v) {
      this.print = v
    },
    patientData: {
      handler: function (v) {
        const oMineObj = whComFn.adviceResetData(v)
        v.forEach((item, i) => {
          if (item.adviceId) {
            item.oMineObj = oMineObj
            if (item.oMineObj[item.adviceId]) item.oMineObj[item.adviceId].sub = i
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    if (this.itemData && (this.itemData.checked || this.checked)) this.print = this.itemData.checked || this.checked
  },
  computed: {
    iconName () {
      const name = this.$filters.formateValueToFnt(this.status, {
        list: DISPENSING_STATUS,
        showKey: 'iconName'
      })
      return name
    }
  },
  methods: {
    cellMouseEnter (row, column, cell, event) {
      this.printHover(row, 'block')
    },
    cellMouseLeave (row, column, cell, event) {
      this.printHover(row, 'none')
    },
    printHover (row, status) {
      this.$nextTick(() => {
        if (row.isMine && document.getElementById(`${row.adviceId}`)) {
          document.getElementById(`${row.adviceId}`).style.display = status
        }
      })
    },
    sendMedicine (v, id, status) {
      let params = {
        dispenseId: id,
        expressInformationList: v,
        status: status + 1
      }
      commonApi.updateDispenseStatus(params).then(res => {
        if (res && res.flag) {
          this.$messageTips(this, 'success', '保存邮寄信息成功')
          this.$emit('updateDispenseStatus')
        }
      })
    },
    // 邮寄信息
    handleMailing () {
      this.isClick = true
      this.dialogVisibleMail = true
    },
    drugOpen (data) {
      this.thisObjData = data
      this.$nextTick(_ => {
        this.$refs.drugTips.open()
      })
    },
    formatHTML (val) {
      if (!val) return ''
      if (val.indexOf('|') === -1) return val
      let arr = val.split('|')
      let str = ''
      arr.forEach((htm, index) => {
        str += `<span class="mr20">${index + 1}.${htm}<br></span>`
      })
      return str
    },
    handelMakeUpdebounce: debounce(function (data) {
      let patientObject = Object.assign(this.patientObject ? this.patientObject : {}, { visitSn: this.itemData.visitSn || this.visitSn })
      this.$emit('sendPrint', data, this.itemData.code, this.adviceType, patientObject, this.storageRoomObject, this.doctorData)
    }),
    printChange () {
      this.$emit('print', {
        status: this.print,
        id: this.itemId,
        visitSn: this.visitSn,
        print: this.print
      })
    },
    // 无法到货通知
    submitCancel () {
      let params = {
        id: this.itemData.id,
        storageRoomId: this.itemData.storageRoomId,
        code: this.itemData.code,
        patientName: this.itemData.patientName,
        recipeCode: this.itemData.recipeCode,
        doctorId: this.itemData.doctorId
      }
      commonApi.UnableToArrive(params).then(res => {
        if (res.flag) {
          this.remind = res.object
          return this.$messageTips(this, 'success', '提醒开嘱医生成功')
        }
      })
    },
    // 发药异常标记 - 添加class
    tableCellClassName ({ row }) {
      return row.identification ? 'danger-row' : ''
    },
    // 标记异常 - 弹窗
    handleException (operate) {
      if (operate === 'shortage') {
        this.$confirm('是否确认该处方暂时无法到货，提醒对应开嘱医生进行后续处理?', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitCancel()
        }).catch()
        return
      }
      let outpatientDispenseIds = [this.itemId]
      commonApi.getDispenseInfo({ outpatientDispenseIds }).then(res => {
        if (res) {
          this.exceptionData = res
          this.operate = operate
          this.dialogVisible = true
        }
      })
    },
    // 标记异常 - 请求
    async handleSave (val) {
      // 处理标记异常数据
      let tempObj = {}
      tempObj.classifyList = val.selectList
      tempObj.content = val.inputVal
      tempObj.itemIds = []
      tempObj.recipeType = SCENE[0].id
      tempObj.recipeId = this.itemId
      val.checkedItems.forEach(item => {
        tempObj.itemIds.push(item.outpatientDispenseItem.id)
      })
      // 俊俊说的先调两个接口，到时候在统一 4-09
      let result
      if (this.operate === 'sign') {
        result = await commonApi.updateComment(tempObj).then(res => res)
      } else {
        result = await commonApi.materialRecipeCommentCancel(tempObj).then(res => res)
      }
      if (result.flag) {
        this.$messageTips(this, 'success', this.operate === 'sign' ? '标记异常成功' : '取消异常成功')
        this.dialogVisible = false
        this.$emit('updateDispenseStatus', { type: 'sign', data: tempObj })
      }
    },
    // 取消异常
    cancleException () {
      let params = []
      this.patientData.forEach(value => {
        if (value.identification) {
          let tempObj = {}
          tempObj.exceptionCause = ''
          tempObj.id = value.id
          tempObj.identification = 0
          tempObj.relationId = value.relationId
          tempObj.localMaterialId = value.localMaterialId
          params.push(tempObj)
        }
      })
      commonApi.updateDispenseIdentification(params).then(res => {
        if (res.success === 0) {
          this.$messageTips(this, 'success', '取消异常成功')
          this.$emit('updateDispenseStatus', { type: 'cancle', data: params })
        }
      })
    },
    filterClassifyList (list) {
      if (list && list.length) {
        let arr = []
        list.map((item, index) => {
          arr.push(`<div><span>${index + 1}、</span>${setUpClassifyName(item, true, 'childClassifyItem', 'contentText')}</div>`)
        })
        return arr.join('')
      }
    },
    ...patch
  },
  components: {
    exceptionDialog,
    drugInstructions,
    mailDialog,
    checkInformation,
    anomalyDialog
  }
}
</script>
<style lang="less" scoped>
.table_title {
  margin-top: 10px;
  font-size: 14px;
  line-height: 36px;
  height: 36px;
}
.select {
  /deep/ tr th,
  /deep/ tr td {
    background: #e0efff !important;
  }
}
.lack_goods {
  float: right;
  width: 20%;
  padding: 4px 0 0 0;
}
</style>

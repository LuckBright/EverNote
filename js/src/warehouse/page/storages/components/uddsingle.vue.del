<template>
  <div>
    <h4 v-if="obj.status" class="title">患者详情</h4>
    <!-- 住院退药 -->
    <el-row v-if="modelType === 'backdrug'" :gutter="20" type="flex" align="top">
      <el-col :span="18">
        <div class="title_info" v-if="obj.status">
          <label class="light-gray">UDD药包:</label>
          <span>{{obj.uddDispenseObject.code}}</span>
          <span
            v-if="obj.uddDispenseObject.spaceRecordObject"
          >{{findBasesourceCode({arr: obj.uddDispenseObject.spaceRecordObject.spaceRecordProperties, code: SPACE_CODE[0]})}}</span>
          <label class="light-gray" v-if="obj.uddDispenseObject.bedNum">床号:</label>
          <span v-if="obj.uddDispenseObject.bedNum">{{obj.uddDispenseObject.bedNum}}</span>
          <label class="light-gray" v-if="obj.uddDispenseObject.implementTime">预执行时间:</label>
          <span v-if="obj.uddDispenseObject.implementTime">
            <template
              v-if="obj.uddDispenseObject.implementTime"
            >{{obj.uddDispenseObject.implementTime | formatDateByExp('YYYY-MM-DD')}}</template>
            <strong class="f16">
              <span
                v-if="obj.uddDispenseObject.termType"
              >{{obj.uddDispenseObject.implementTime | formatDateByExp('HH:mm')}}</span>
              <span v-else>立即</span>
            </strong>
          </span>
          <!-- <el-button v-if="modelType !== 'backdrug'" type="text" @click="showLogs(obj)">操作记录</el-button> -->
          <!-- <el-button type="text"><a :href="$ever.api" target="_blank" class="record">诊断记录</a></el-button> -->
        </div>
        <div class="title_info" v-if="obj.status">
          <span
            v-if="obj.uddDispenseObject.patientObject"
          >{{obj.uddDispenseObject.patientObject.name}} ({{obj.uddDispenseObject.patientObject.sex | formatSex}}) {{obj.uddDispenseObject.patientObject.age}}岁</span>
          <span class="f_bold">{{obj.uddDispenseObject.employTxt}}</span>
          <label class="light-gray" v-if="obj.uddDispenseObject.hospitalizedNumber">住院号:</label>
          <span
            v-if="obj.uddDispenseObject.hospitalizedNumber"
          >{{obj.uddDispenseObject.hospitalizedNumber}}</span>
          <el-button type="text" v-if="$hasPermission('Auth_menu_treasury_hospitalization_seedoctorsadvice')" @click="handleLookAdvice(obj.uddDispenseObject)">查看医嘱</el-button>
          <label class="light-gray" v-if="obj.uddDispenseObject.allergenList">过敏史:</label>
          <span
            v-if="obj.uddDispenseObject.allergenList"
          >{{allergenList(obj.uddDispenseObject.allergenList)}}</span>
        </div>
      </el-col>
      <el-col :span="6" align="right">
        <div v-if="obj.status">
          <span class="status">{{setName(DISPENSING_STATUS, obj.status, true)}}</span>
        </div>
      </el-col>
    </el-row>
    <!-- 药包查询 -->
    <el-row v-else :gutter="20" type="flex" align="top">
      <el-col :span="18">
        <div class="title_info" v-if="obj.status">
          <label class="light-gray">UDD药包:</label>
          <span>{{obj.code}}</span>
          <span
            v-if="obj.spaceRecordObject"
          >{{findBasesourceCode({arr: obj.spaceRecordObject.spaceRecordProperties, code: SPACE_CODE[0]})}}</span>
          <label class="light-gray" v-if="obj.bedNum">床号:</label>
          <span v-if="obj.bedNum">{{obj.bedNum}}</span>
          <label class="light-gray" v-if="obj.implementTime">预执行时间:</label>
          <span v-if="obj.implementTime">
            <template v-if="obj.implementTime">{{obj.implementTime | formatDateByExp('YYYY-MM-DD')}}</template>
            <strong class="f16">
              <span v-if="obj.termType">{{obj.implementTime | formatDateByExp('HH:mm')}}</span>
              <span v-else>立即</span>
            </strong>
          </span>
          <el-button type="text" @click="showLogs(obj)">操作记录</el-button>
          <!-- <el-button type="text"><a :href="$ever.api" target="_blank" class="record">诊断记录</a></el-button> -->
        </div>
        <div class="title_info" v-if="obj.status">
          <span
            v-if="obj.patientObject"
          >{{obj.patientObject.name}} ({{obj.patientObject.sex | formatSex}}) {{obj.patientObject.age}}岁</span>
          <span class="f_bold">{{obj.employTxt}}</span>
          <label class="light-gray" v-if="obj.hospitalizedNumber">住院号:</label>
          <span v-if="obj.hospitalizedNumber">{{obj.hospitalizedNumber}}</span>
          <el-button v-if="$hasPermission('Auth_menu_treasury_hospitalization_seedoctorsadvice')" type="text" @click="handleLookAdvice(obj)">查看医嘱</el-button>
          <label class="light-gray" v-if="obj.allergenList">过敏史:</label>
          <span v-if="obj.allergenList">{{allergenList(obj.allergenList)}}</span>
        </div>
      </el-col>
      <el-col :span="6" align="right">
        <div v-if="obj.status">
          <span class="status">{{setName(DISPENSING_STATUS, obj.status, true)}}</span>
        </div>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-if="modelType === 'backdrug' ? obj.backStocksItemDtoList : obj.uddDispenseItemList"
      :data.sync="modelType === 'backdrug' ? obj.backStocksItemDtoList : obj.uddDispenseItemList"
      v-loading="loading"
      style="width: 100%"
      class="tableiconhover"
      :row-class-name="tableRowClassName"
      :stripe="false"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
      <el-table-column width="300" label="物资名称">
        <template slot="header" slot-scope="scope">
          <el-tooltip v-if="!CHINESE_MEDICINE_TYPE.includes(obj.uddDispenseObject.adviceType)" class="item" :content="`${needIcon(obj.uddDispenseObject.adviceType).name}`" effect="dark" placement="top">
            <svg class="icon mr5" style="fontSize: 18px; height: 18px;" aria-hidden="true">
              <use :xlink:href="'#' + needIcon(obj.uddDispenseObject.adviceType).icon"></use>
            </svg>
          </el-tooltip>
          <span>物资名称</span>
        </template>
        <template slot-scope="scope">
          <div v-if="scope.row.localSettingObject">
            <span
              v-if="scope.row.localSettingObject && parserJSON({data: scope.row.localSettingObject.materialSkuObject.ext, property: IDENTIFICATION_CODE})"
            >
              <wh-code-to-name
                :isExt="true"
                :patchObj="{
                  code: IDENTIFICATION_CODE,
                  list: scope.row.localSettingObject.materialSkuObject.ext,
                  isInfo: false
                }"
              ></wh-code-to-name>-
            </span>
            <wh-code-to-name
              :isExt="true"
              :patchObj="{
                code: MATERILA_CODE,
                list: scope.row.localSettingObject.materialSkuObject.ext,
                isInfo: false
              }"
            ></wh-code-to-name>
            <div
              v-if="scope.row.status == 7"
              style="color: #ff9802"
            >拒收原因：{{scope.row.rejectionReason}}</div>
          </div>
          <div class="font red" v-if="scope.row.cdssResult">
            <i class="iconfont icon-wodebaojing red mr10 f12"></i>
            {{scope.row.cdssResult}}
          </div>
          <div class="font red" v-if="scope.row.identification">异常原因：{{scope.row.identificationTxt}}</div>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="规格">
        <template slot-scope="scope">
          <span v-if="scope.row.localSettingObject">
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
      </el-table-column>
      <el-table-column align="center" label="剂型">
        <template slot-scope="scope">
          <wh-single-code-to-name
            v-if="scope.row.localSettingObject"
            :isExt="true"
            :patchObj="{
              list: scope.row.localSettingObject.materialSkuObject.ext,
              code: DOSAGE
            }"
          ></wh-single-code-to-name>
        </template>
      </el-table-column>
      <el-table-column v-if="modelType === 'backdrug'" align="center" label="每次用量">
        <template
          slot-scope="scope"
        >{{scope.row.uddDispenseItemObject.measure}}{{scope.row.uddDispenseItemObject.measureUnitName}}</template>
      </el-table-column>
      <el-table-column v-else align="center" label="每次用量">
        <template slot-scope="scope">{{scope.row.measure}}{{scope.row.measureUnitName}}</template>
      </el-table-column>
      <!-- <el-table-column
        prop="useFreqTxt"
        align="center"
        label="频次">
      </el-table-column>-->
      <el-table-column align="right" label="数量">
        <template
          slot-scope="scope"
        >{{scope.row.num}}{{scope.row.countUnit || scope.row.uddDispenseItemObject.countUnit}}</template>
      </el-table-column>
      <!-- <el-table-column
        v-if="modelType === 'backdrug'"
        align="center"
        label="单位">
        <template slot-scope="scope">
          {{scope.row.uddDispenseItemObject.countUnit}}
        </template>
      </el-table-column>
      <el-table-column
        v-else
        prop="countUnit"
        align="center"
        label="单位">
      </el-table-column>-->
      <el-table-column label="开嘱医生">
        <template slot-scope="scope">
          <span v-if="scope.row.doctorObject">{{scope.row.doctorObject.name}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="containerId"
        align="center"
        label="货位号">
      </el-table-column>-->
      <!-- <el-table-column
        width="80"
        v-if="obj.status > 3 && obj.status < 7">
        <template slot-scope="scope">
          <el-button v-if="printModel == 2" @click="handelMakeUpdebounce({data: scope.row, types: 'hospitalization', isSingle: true, curAdviceType: scope.row.adviceType})" type="text">补打标签</el-button>
        </template>
      </el-table-column>-->
      <el-table-column width="120" label>
        <template slot-scope="scope">
          <span v-if="scope.row.status == 10">已入库</span>
          <span v-if="scope.row.status == 7" style="color: red">拒收</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 无数据 -->
    <everNoData v-else class="no-data"></everNoData>
    <dialog-slot width="90%" title="医嘱信息" :dialogSlot.sync="dialogSlot">
      <advice-list
        v-if="dialogSlot"
        :base-info="baseInfo"
        :no-operate="true"
        :show-add="false"
        :show-all="true"
      ></advice-list>
    </dialog-slot>
    <!-- 查看药品说明 -->
    <drug-instructions v-if="thisObjData.localSettingObject" ref="drugTips" :objData="thisObjData"></drug-instructions>
  </div>
</template>
<script>
import setName from '@/util/setstatusname'
import { DISPENSING_STATUS, SEARCH_CODE, SPU_SPEC_CODE, DOSAGE, SPACE_CODE, patch, IDENTIFICATION_CODE, MATERILA_CODE, WEST_MEDICINE_TYPE, CHINESE_MEDICINE_TYPE, parserJSON } from '@/util/common'
import dialogSlot from '@/warehouse/page/components/dialog.slot'
import adviceList from '@/inpatient/components/advice.list.vue'
import needIcon from '@/warehouse/page/storages/dispensings/mixins/needicon.mixins.js'
import drugInstructions from '@/warehouse/page/storages/dispensings/components/drug.instructions'
export default {
  mixins: [setName, needIcon],
  props: ['obj', 'loading', 'modelType'],
  data () {
    return {
      DISPENSING_STATUS,
      SPU_SPEC_CODE,
      parserJSON,
      IDENTIFICATION_CODE,
      WEST_MEDICINE_TYPE,
      CHINESE_MEDICINE_TYPE,
      MATERILA_CODE,
      DOSAGE,
      baseInfo: [], // 患者基本信息，主要用到：doctorType，hospitalizedNumber，patientId （查看医嘱组件）
      dialogSlot: false,
      printModel: this.$ever.getClinicConfig().printModel, // 打印机构类型
      SEARCH_CODE,
      SPACE_CODE,
      thisObjData: {}
    }
  },
  components: {
    dialogSlot,
    adviceList,
    drugInstructions
  },
  methods: {
    drugOpen (data) {
      this.thisObjData = data
      this.$nextTick(_ => {
        this.$refs.drugTips.open()
      })
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row && row.cdssResult) {
        return 'mark-cdss-row'
      }
      return ''
    },
    handelMakeUpdebounce (obj) {
      this.$emit('handelMakeUpdebounce', obj)
    },
    // 操作记录
    showLogs (obj) {
      this.$emit('showLogs', obj)
    },
    // 查看医嘱
    handleLookAdvice (data) {
      this.baseInfo = data
      this.dialogSlot = true
    },
    // 过敏史
    allergenList (data) {
      let arr = []
      data.forEach(item => {
        item && arr.push(item.name)
      })
      return arr.join(', ') || '无'
    },
    handleSelectionChange (val) {
      this.$emit('selectpbBack', val)
    },
    selectable (row, index) {
      if (row.status === 7 || row.status === 10) {
        return false
      } else {
        return true
      }
    },
    ...patch
  }
}
</script>
<style lang="scss" scoped>
h4.title {
  padding: 0;
  margin: 0;
}
</style>

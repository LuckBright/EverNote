<template>
  <div>
    <el-dialog
      :visible="visible"
      width="500px"
      class="addDialog"
      :close-on-click-modal="false"
      @update:visible="close">
      <div
        slot="title"
        class="title">
        添加体温单配置
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="value"
          size="small"
          label-width="auto">
          <el-form-item
            v-if="!org"
            label="集团名称:">
            {{ tenantData.name }}
          </el-form-item>
          <el-form-item
            v-if="!org"
            label="机构名称:"
            prop="orgId">
            <ever-org-select
              :is-org="false"
              v-model="value.orgId"></ever-org-select>
          </el-form-item>
          <el-form-item
            label="体温单类型:"
            prop="tempType">
            <el-radio
              v-model="value.tempType"
              label="1">
              体温单
            </el-radio>
            <el-radio
              v-model="value.tempType"
              label="2">
              体温疼痛单
            </el-radio>
          </el-form-item>
          <el-form-item
            label="患者基本信息:">
            <el-checkbox
              v-for="item in infoArr"
              v-model="item.checked"
              :label="item.name"
              :key="item.name"
            >{{item.name}}</el-checkbox>
          </el-form-item>
          <el-form-item
            label="住院日数文案:"
            prop="inHospitalTxt">
            <el-input
              v-model="value.inHospitalTxt"
              placeholder="请输入住院日数文案"></el-input>
          </el-form-item>
          <el-form-item
            label="手术日数文案:"
            prop="operationTxt">
            <el-input
              v-model="value.operationTxt"
              placeholder="请输入手术日数文案"></el-input>
          </el-form-item>
          <el-form-item 
            label="时间模式:"
            prop="timeMode">
            <el-select v-model="value.timeMode" placeholder="请选择">
              <el-option
                v-for="item in timeSystem"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item 
            label="体温单时间段配置:"
            prop="timePeriodConfig">
            <time-range 
              v-model="value.timePeriodConfig"
              :options="selectTimeRange[value.timeMode]"></time-range>
          </el-form-item>
          <el-form-item 
            label="体温脉搏区间配置:"
            prop="tempPulseSection">
            <axis-range 
              v-model="value.tempPulseSection"
              :options="axisYRange"></axis-range>
          </el-form-item>
          <el-form-item
            label="备注信息:"
            prop="remarks">
            <el-input
              v-model="value.remarks"
              placeholder="请输入备注信息"></el-input>
          </el-form-item>

          <el-form-item class="btns">
            <el-button @click="close">
              关闭
            </el-button>
            <el-button
              type="primary"
              @click="validate({name:'体温单配置'})">
              确定
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import urlMap from '@/form/urls'
  import option from './mixins/option.mixin'
  import timeRange from '@/form/components/timerange'
  import axisRange from '@/form/components/axis.y.range'
  import {uniq} from 'lodash'
  // import {commandLog} from '@/phr/mixin/operationLog.js'
  import {
    timeSystem,
    selectTimeRange,
    patientInfo,
    TYPE,
    BASE_INFO,
    IN_HOSPITAL_TXT,
    OPERATION_TXT,
    TIME_MODE,
    TIME_PERIOD_CONFIG,
    TEMP_PULSE_SECTION,
    axisYRange
  } from '@/emr/config/temperaturedata.js'
  export default {
    name: 'temperature_add',
    components: {
      timeRange,
      axisRange
    },
    mixins: [option],
    props: {
      visible: Boolean,
      org: Boolean,
      pageName: String
    },
    data () {
      return {
        range: [33.6, 42, 12, 180], // 临时变量
        axisYRange,
        timeSystem,
        selectTimeRange,
        pageType: 'add',
        value: {
          // 体温单类型
          tempType: '2',
          // 基本信息
          baseInfo: [],
          // 住院日数
          inHospitalTxt: '',
          // 手术日数
          operationTxt: '',
          tenantId: '',
          orgId: '',
          remarks: '',
          timeMode: 24,
          timePeriodConfig: [2, 6, 10, 14, 18, 22],
          tempPulseSection: [33.6, 42, 12, 180]
        },
        config: urlMap.temperatureConfig,
        infoArr: patientInfo,
      }
    },
    methods: {
      resetData () {
        this.value = {
          tempType: '2',
          baseInfo: [],
          inHospitalTxt: '',
          operationTxt: '',
          tenantId: '',
          orgId: '',
          remarks: '',
          timeMode: 24,
          timePeriodConfig: [2, 6, 10, 14, 18, 22],
          tempPulseSection: [33.6, 42, 12, 180]
        }
        this.infoArr.forEach(item => {
          item.checked = false
        })
      },
      makeListObj (code, value) {
        return {code: code, value: value}
      },
      makeSaveData () {
        let data = this.makeCommonData()
        data.tenantName = this.tenantData.name
        data.list = []
        data.list.push(this.makeListObj(TYPE, data.tempType))
        delete data.tempType

        // 基本信息
        this.infoArr.forEach(item => {
          if (item.checked) {
            data.baseInfo.push(item.key)
          }
        })
        data.list.push(this.makeListObj(BASE_INFO, uniq(data.baseInfo).join()))
        delete data.baseInfo
        // 住院日数
        data.list.push(this.makeListObj(IN_HOSPITAL_TXT, data.inHospitalTxt))
        delete data.inHospitalTxt
        // 手术日数
        data.list.push(this.makeListObj(OPERATION_TXT, data.operationTxt))
        delete data.operationTxt

        // 时间模式
        data.list.push(this.makeListObj(TIME_MODE, data.timeMode.toString()))
        delete data.timeMode
        // 时间端配置
        data.list.push(this.makeListObj(TIME_PERIOD_CONFIG, JSON.stringify(data.timePeriodConfig)))
        delete data.timePeriodConfig
        // 体温脉搏区间配置
        data.list.push(this.makeListObj(TEMP_PULSE_SECTION, JSON.stringify(data.tempPulseSection)))
        delete data.tempPulseSection
        console.log(data, 'data')
        return data
      }
    }
  
  }
</script>

<style scoped lang="scss">
  .title {
    font-weight: 700;
  }
  .addDialog {
    /deep/ .el-dialog {
      .el-dialog__body {
        padding: 10px 20px;
        /deep/ .el-form {
          .btns {
            text-align: right;
            margin-top: 10px;
          }
          .timerange {
            .select_value {
              width: auto;
            }
          }
        }
      }
    }
  }
</style>


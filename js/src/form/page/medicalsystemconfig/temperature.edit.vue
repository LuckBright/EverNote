<template>
  <div>
    <el-dialog
      :visible="visible"
      width="500px"
      class="editDialog"
      :close-on-click-modal="false"
      @update:visible="close">
      <div
        slot="title"
        class="title">
        编辑体温单配置
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
            {{ value.tenantName }}
          </el-form-item>
          <el-form-item
            v-if="showOrg"
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
            <el-select 
              :disabled="getDisabaleByCode(TIME_MODE)"
              v-model="value.timeMode" 
              placeholder="请选择">
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
              :disabled="getDisabaleByCode(TIME_PERIOD_CONFIG)"
              v-model="value.timePeriodConfig"
              :options="selectTimeRange[value.timeMode]"></time-range>
          </el-form-item>
          <el-form-item 
            label="体温脉搏区间配置:"
            prop="tempPulseSection">
            <axis-range
              :disabled="getDisabaleByCode(TEMP_PULSE_SECTION)"
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
  import uuidv4 from 'uuid/v4'
  import timeRange from '@/form/components/timerange'
  import axisRange from '@/form/components/axis.y.range'
  import uniq from 'lodash'
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
    name: 'temperature_edit',
    components: {
      timeRange,
      axisRange
    },
    mixins: [option],
    props: {
      visible: Boolean,
      form: Object,
      org: Boolean,
      pageName: String
    },
    data () {
      return {
        axisYRange,
        TIME_MODE,
        TIME_PERIOD_CONFIG,
        TEMP_PULSE_SECTION,
        timeConfigDisabled: false,
        timeSystem,
        selectTimeRange,
        uuid: uuidv4(),
        pageType: 'edit',
        value: {},
        // list中code:index
        listCodeIndex: {},
        config: urlMap.temperatureConfig,
        infoArr: patientInfo,
      }
    },
    methods: {
      resetData () {
        this.uuid = uuidv4()
        this.infoArr.forEach(item => {
          item.checked = false
        })
        this.makeCodeIndexObj(this.value.list)

        this.value.inHospitalTxt = this.getValueByCode(IN_HOSPITAL_TXT)
        let baseInfo = this.getValueByCode(BASE_INFO)
        if (baseInfo) {
          let arr = baseInfo.split(',')
          this.infoArr.forEach(item => {
            if (arr.findIndex(cur => cur === item.key) !== -1) {
              item.checked = true
            }
          })
        }
  
        this.value.tempType = this.getValueByCode(TYPE)
        this.value.operationTxt = this.getValueByCode(OPERATION_TXT)
        this.value.timeMode = this.getValueByCode(TIME_MODE)
        this.value.timePeriodConfig = JSON.parse(this.getValueByCode(TIME_PERIOD_CONFIG))
        this.value.tempPulseSection = JSON.parse(this.getValueByCode(TEMP_PULSE_SECTION))
        this.value = Object.assign({}, this.value)
      },
      // 根据list中的code获取value
      getValueByCode (code) {
        return this.value.list[this.listCodeIndex[code]].value
      },
      getDisabaleByCode (code) {
        if (!this.value.list || !this.listCodeIndex[code]) return
        return this.value.list[this.listCodeIndex[code]].disabled
      },
      makeCodeIndexObj (list) {
        this.listCodeIndex = {}
        for (let index in list) {
          let cur = list[index]
          this.listCodeIndex[cur.code] = index
        }
      },
      makeSaveData () {
        let data = this.makeCommonData()
        // 体温单类型
        data.list[this.listCodeIndex[TYPE]].value = data.tempType
        delete data.tempType
        // 基本信息
        let baseInfo = []
        this.infoArr.forEach(item => {
          if (item.checked) {
            baseInfo.push(item.key)
          }
        })
        data.list[this.listCodeIndex[BASE_INFO]].value = uniq(baseInfo).join()
        // 住院日数
        data.list[this.listCodeIndex[IN_HOSPITAL_TXT]].value = data.inHospitalTxt
        delete data.inHospitalTxt
        // 手术日数
        data.list[this.listCodeIndex[OPERATION_TXT]].value = data.operationTxt
        delete data.operationTxt
  
        // 时间模式
        data.list[this.listCodeIndex[TIME_MODE]].value = data.timeMode.toString()
        delete data.timeMode
        // 时间端配置
        data.list[this.listCodeIndex[TIME_PERIOD_CONFIG]].value = JSON.stringify(data.timePeriodConfig)
        delete data.timePeriodConfig
        // 体温脉搏区间配置
        data.list[this.listCodeIndex[TEMP_PULSE_SECTION]].value = JSON.stringify(data.tempPulseSection)
        delete data.tempPulseSection

        return data
      }
    }
  }
</script>

<style scoped lang="scss">
  .title {
    font-weight: 700;
  }
  .editDialog {
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

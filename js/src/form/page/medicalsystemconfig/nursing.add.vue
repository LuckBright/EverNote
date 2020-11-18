<template>
  <div>
    <el-dialog :visible="visible" width="500px" class="addDialog" :close-on-click-modal="false" @update:visible="close">
      <div slot="title" class="title">
        添加护理记录单配置
      </div>
      <div class="form">
        <el-form ref="form" :model="value" size="small" label-width="auto">
          <el-form-item v-if="!org" label="集团名称:">
            {{ tenantData.name }}
          </el-form-item>
          <el-form-item v-if="!org" label="机构名称:" prop="orgId">
            <ever-org-select :is-org="false" v-model="value.orgId"></ever-org-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="value.summarySetting" label="汇总设置" true-label="1" false-label="0" @change="checkboxChange"></el-checkbox>
          </el-form-item>
          <el-form-item label="白天汇总设置:">
            <span>起始</span>
            <el-time-select :disabled="timeDisabled" style="width:120px" placeholder="起始时间" v-model="value.daySummarySettingStart" :picker-options="{
                      start: '07:00',
                      step: '00:30',
                      end: '17:00'
                    }"></el-time-select>
            <span>终止</span>
            <el-time-select :disabled="timeDisabled" style="width:120px" placeholder="终止时间"
               v-model="value.daySummarySettingEnd" :picker-options="{
                      start: '07:00',
                      step: '00:30',
                      end: '17:00'
                    }"></el-time-select>
          </el-form-item>
          <el-form-item label="全天汇总设置:">
            <span>起始</span>
            <el-time-select :disabled="timeDisabled" style="width:120px" placeholder="起始时间" v-model="value.allDaySummarySettingStart" :picker-options="{
                      start: '07:00',
                      step: '00:30',
                      end: '24:00'
                    }"></el-time-select>
            <span>终止</span>
            <el-time-select :disabled="timeDisabled" style="width:120px" placeholder="终止时间" v-model="value.allDaySummarySettingEnd" :picker-options="{
                      start: '07:00',
                      step: '00:30',
                      end: '24:00'
                    }"></el-time-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="value.autoSynchroOfInputAndOutput" label="入出量自动同步至体温单" :disabled="timeDisabled" true-label="1" false-label="0"></el-checkbox>
          </el-form-item>
          <el-form-item label="备注信息:" prop="remarks">
            <el-input v-model="value.remarks" placeholder="请输入备注信息"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button @click="close">
              关闭
            </el-button>
            <el-button type="primary" @click="validate({name:'护理记录单配置'})">
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
// import { uniq } from 'lodash'
import {
  timeSystem,
  selectTimeRange,
  axisYRange
} from '@/emr/config/temperaturedata.js'
export default {
  name: 'nursing_add',
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
        // 汇总设置
        summarySetting: '0',
        // 入出量自动同步到体温单
        autoSynchroOfInputAndOutput: '0',
        tenantId: '',
        orgId: '',
        remarks: '',
        daySummarySettingStart: '',
        daySummarySettingEnd: '',
        allDaySummarySettingStart: '',
        allDaySummarySettingEnd: '',
      },
      config: urlMap.nursingConfig,
      checked: '',
      obj: {
        time: ''
      },
      timeDisabled: true
    }
  },
  watch: {
    'value.summarySetting' (val) {
      this.timeDisabled = val === '0'
    },
    'timeDisabled' (val) {
      if (val) {
        this.value.autoSynchroOfInputAndOutput = '0'
      }
    }
  },
  methods: {
    resetData () {
      this.value = {
        summarySetting: '0',
        autoSynchroOfInputAndOutput: '0',
        tenantId: '',
        orgId: '',
        remarks: '',
        daySummarySettingStart: '',
        timePeriodConfig: ''
      }
    },
    makeListObj (code, value) {
      return { code: code, value: value }
    },
    makeSaveData () {
      let data = this.makeCommonData()
      data.tenantName = this.tenantData.name
      data.list = []

      // 汇总设置
      data.list.push(this.makeListObj('SUMMARY_SETTING', data.summarySetting))
      delete data.summarySetting
      // 入出量自动同步到体温单
      data.list.push(this.makeListObj('AUTO_SYNCHRO_OF_INPUT_AND_OUTPUT', data.autoSynchroOfInputAndOutput))
      delete data.autoSynchroOfInputAndOutput

      // 白天汇总设置-起始
      data.list.push(this.makeListObj('DAY_SUMMARY_SETTING_START', data.daySummarySettingStart))
      delete data.daySummarySettingStart
      // 白天汇总设置-终止
      data.list.push(this.makeListObj('DAY_SUMMARY_SETTING_END', data.daySummarySettingEnd))
      delete data.daySummarySettingEnd

      // 全天汇总设置-起始
      data.list.push(this.makeListObj('ALL_DAY_SUMMARY_SETTING_START', data.allDaySummarySettingStart))
      delete data.allDaySummarySettingStart
      // 天全汇总设置-终止
      data.list.push(this.makeListObj('ALL_DAY_SUMMARY_SETTING_END', data.allDaySummarySettingEnd))
      delete data.allDaySummarySettingEnd
      // 护理单类型
      data.list.push(this.makeListObj('RECORDS_TYPE', 1))

      return data
    },
    checkboxChange (value) {
      // this.timeDisabled = !value
      if (!value) {
        this.value.daySummarySettingStart = ''
        this.value.daySummarySettingEnd = ''
        this.value.allDaySummarySettingStart = ''
        this.value.allDaySummarySettingEnd = ''
      }
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
      }
    }
  }
}
</style>

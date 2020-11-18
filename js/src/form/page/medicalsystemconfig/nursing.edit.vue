<template>
  <div>
    <el-dialog :visible="visible" width="500px" class="editDialog" :close-on-click-modal="false" @update:visible="close">
      <div slot="title" class="title">
        编辑护理记录单配置
      </div>
      <div class="form">
        <el-form ref="form" :model="value" size="small" label-width="auto">
          <el-form-item v-if="!org" label="集团名称:">
            {{ value.tenantName }}
          </el-form-item>
          <el-form-item v-if="showOrg" label="机构名称:" prop="orgId">
            <ever-org-select :is-org="false" v-model="value.orgId"></ever-org-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="value.SUMMARY_SETTING" label="汇总设置" true-label="1" false-label="0" @change="checkboxChange"></el-checkbox>
          </el-form-item>
          <el-form-item label="白天汇总设置:">
            <span>起始</span>
            <el-time-select :disabled="timeDisabled" style="width:120px" placeholder="起始时间" v-model="value.DAY_SUMMARY_SETTING_START" :picker-options="{
                      start: '07:00',
                      step: '00:15',
                      end: '17:00'
                    }"></el-time-select>
            <span>终止</span>
            <el-time-select :disabled="timeDisabled" style="width:120px" placeholder="终止时间" v-model="value.DAY_SUMMARY_SETTING_END" :picker-options="{
                      start: '07:00',
                      step: '00:15',
                      end: '17:00'
                    }"></el-time-select>
          </el-form-item>
          <el-form-item label="全天汇总设置:">
            <span>起始</span>
            <el-time-select :disabled="timeDisabled" style="width:120px" placeholder="起始时间" v-model="value.ALL_DAY_SUMMARY_SETTING_START" :picker-options="{
                      start: '07:00',
                      step: '00:15',
                      end: '17:00'
                    }"></el-time-select>
            <span>终止</span>
            <el-time-select :disabled="timeDisabled" style="width:120px" placeholder="终止时间" v-model="value.ALL_DAY_SUMMARY_SETTING_END" :picker-options="{
                      start: '07:00',
                      step: '00:15',
                      end: '12:00'
                    }"></el-time-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="value.AUTO_SYNCHRO_OF_INPUT_AND_OUTPUT"  :disabled="timeDisabled" label="入出量自动同步至体温单" true-label="1" false-label="0"></el-checkbox>
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
  name: 'nursing_edit',
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
      range: [33.6, 42, 12, 180], // 临时变量
      axisYRange,
      timeSystem,
      selectTimeRange,
      pageType: 'edit',
      value: {
        // 汇总设置
        SUMMARY_SETTING: '0',
        // 入出量自动同步到体温单
        AUTO_SYNCHRO_OF_INPUT_AND_OUTPUT: '0',
        tenantId: '',
        orgId: '',
        remarks: '',
        DAY_SUMMARY_SETTING_START: '',
        DAY_SUMMARY_SETTING_END: '',
        ALL_DAY_SUMMARY_SETTING_START: '',
        ALL_DAY_SUMMARY_SETTING_END: '',
      },
      config: urlMap.nursingConfig,
      checked: '',
      obj: {
        time: ''
      },
      timeDisabled: true,
      listCodeIndex: {}
    }
  },
  watch: {
    'value.SUMMARY_SETTING' (val) {
      this.timeDisabled = val === '0'
    },
    'timeDisabled' (val) {
      if (val) {
        this.value.AUTO_SYNCHRO_OF_INPUT_AND_OUTPUT = '0'
      }
    }
  },
  methods: {
    resetData () {
      this.value.list.forEach(item => {
        this.$set(this.value, item.code, item.value)
      })
      this.makeCodeIndexObj(this.value.list)
    },
    makeListObj (code, value) {
      return { code: code, value: value }
    },
    makeSaveData () {
      let data = this.makeCommonData()
      data.tenantName = this.tenantData.name

      // 汇总设置
      data.list[this.listCodeIndex['SUMMARY_SETTING']].value = Number(data.SUMMARY_SETTING)
      delete data.SUMMARY_SETTING

      // 入出量自动同步到体温单
      data.list[this.listCodeIndex['AUTO_SYNCHRO_OF_INPUT_AND_OUTPUT']].value = data.AUTO_SYNCHRO_OF_INPUT_AND_OUTPUT
      delete data.AUTO_SYNCHRO_OF_INPUT_AND_OUTPUT

      // 白天汇总设置-起始
      data.list[this.listCodeIndex['DAY_SUMMARY_SETTING_START']].value = data.DAY_SUMMARY_SETTING_START
      delete data.DAY_SUMMARY_SETTING_START

      // 白天汇总设置-终止
      data.list[this.listCodeIndex['DAY_SUMMARY_SETTING_END']].value = data.DAY_SUMMARY_SETTING_END
      delete data.DAY_SUMMARY_SETTING_END

      // 全天汇总设置-起始
      data.list[this.listCodeIndex['ALL_DAY_SUMMARY_SETTING_START']].value = data.ALL_DAY_SUMMARY_SETTING_START
      delete data.ALL_DAY_SUMMARY_SETTING_START

      // 全天汇总设置-终止
      data.list[this.listCodeIndex['ALL_DAY_SUMMARY_SETTING_END']].value = data.ALL_DAY_SUMMARY_SETTING_END
      delete data.ALL_DAY_SUMMARY_SETTING_END

      return data
    },
    makeCodeIndexObj (list) {
      this.listCodeIndex = {}
      for (let index in list) {
        let cur = list[index]
        this.listCodeIndex[cur.code] = index
      }
    },
    checkboxChange (value) {
      // this.timeDisabled = value === '0'
      if (!value) {
        this.value.DAY_SUMMARY_SETTING_START = ''
        this.value.DAY_SUMMARY_SETTING_END = ''
        this.value.ALL_DAY_SUMMARY_SETTING_START = ''
        this.value.ALL_DAY_SUMMARY_SETTING_END = ''
      }
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
      }
    }
  }
}
</style>


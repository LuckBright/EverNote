/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-11-21 11:52:26
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2019-12-25 17:33:30
 */
<!-- 住院发药 任务打印 -->
<template>
  <!-- 此空container必须存在， 设置flex用 -->
  <el-container>
    <ever-form2
      onsubmit="return false;"
      v-model="queryObj"
      ref="form"
      :schema="querySchema"
      :inline="true"
      :is-query="true"
      :input-query="true">
      <template slot="createTime">
        <ever-range-picker
          width="260px"
          dateType="daterange"
          :autoWidth="false"
          :noclear="true"
          :start.sync="queryObj.recordStartDate"
          :end.sync="queryObj.recordEndDate"
          :outformat="`YYYY-MM-DD HH:mm:ss`"
          :default-time="['00:00:00', '23:59:59']"
        ></ever-range-picker>
      </template>
      <template slot="default">
        <el-form-item>
          <el-button size="small" type="primary" @keyup.enter.native="listHandler" @click="listHandler">查询</el-button>
        </el-form-item>
      </template>
    </ever-form2>
    <el-container class="page_layout_full_hidden mt10">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <!-- 住院患者列表 -->
        <hospital-patient-list
          class="flex_scroll"
          name="getPatientTaskList"
          :key="pageType"
          :page-type="pageType"
          :columns="leftColumns.filter(column => column.prop !== 'customColumn')">
        </hospital-patient-list>
      </el-aside>
      <el-main class="page_layout_full_hidden main ml10">
        <el-container class="flex_column_full_hidden station_layout_wrap" v-loading="loading">
          <el-main class="flex_scroll main bWhite">
            <template v-if="recordUddDataSize">
              <!-- 患者头组件 -->
              <hospital-patient-header
                :patient-id="patientId"
                :visit-number="visitNumber"
                :term-type="termType"
                :implement-time="implementTime"
                :base-info="taskParams"
                :report-data="currentPatientObj">
              </hospital-patient-header>
              <!-- udd药包列表 -->
              <div v-if="refreshThePage">
                <hospital-udd-list
                  v-for="(value, key) in recordUddData"
                  :key="key"
                  @update-all-column="updateAllColumn"
                  :show-checkbox="false"
                  :is-udd-package="true"
                  :page-type="pageType"
                  :columns="HospitalColumns"
                  :table-data="value">
                </hospital-udd-list>
              </div>
            </template>
            <template v-else>
              <ever-no-data :tip-txt="noDataTip"></ever-no-data>
            </template>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HospitalMethodsMixin from '@/warehouse/views/drug/mixin/hospital.methods.mixin.js'
import { TERM_TYPE, delObjIsNull, dateFormat } from '@/util/common'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import { warehouse as axios } from '@/warehouse/store/api'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { omit } from 'lodash'
const querySchema = [
  {
    label: 'UDD药包号',
    name: 'uddCode',
    props: {
      placeholder: 'UDD药包号',
      clearable: true
    },
  },
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { materialType: '' }
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    label: '患者姓名',
    name: 'patientId',
    comp: 'ever-patient-select',
    props: {
      placeholder: '患者',
      clearable: true
    },
  },
  {
    label: '医嘱类型',
    name: 'termType',
    comp: 'select',
    props: {
      options: TERM_TYPE,
      clearable: true
    }
  },
  {
    label: '发药时间',
    name: 'createTime',
    comp: 'custom'
  },
  {
    label: '执行科室',
    name: 'executeProviderId',
    comp: 'ever-select',
    props: {
      options: []
    }
  },
]

export default {
  mixins: [HospitalMethodsMixin, getstorage],
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.recordStartDate = dateFormat(Date.now(), null, 'startDay')
    queryObj.recordEndDate = dateFormat(Date.now(), null, 'endDay')
    return {
      queryObj,
      timer: null,
      querySchema,
      pageType: 4,
      apiName: 'getUddRecordInfo', // 接口名称
      customParams: {}, // 自定义接口查询字段
    }
  },
  created () {
    this.initExecuteProviderOptions()
  },
  methods: {
    listHandler () {
      this.emitNotifyPatientTaskList(this.queryObj)
    },
    emitNotifyPatientTaskList (obj) {
      this.$nextTick(_ => {
        this.$bus.$emit('hospital:get-patient-task-list', delObjIsNull({ ...obj, processConfigurationId: this.processConfigurationId, storageRoomId: this.currentStorageRoomId }))
      })
    },
    // 获取执行科室
    async initExecuteProviderOptions () {
      let params = {
        containOtherStorageroom: 0,
        storageRoomId: this.storageId,
        processId: this.processId,
        processConfigurationId: this.processConfigurationId,
        type: this.$route.path.indexOf('/outpaitent') > -1 ? 1 : 3,
        orderType: this.$route.path.indexOf('back') > -1 ? 2 : 1
      }
      await axios.cancelPost('order/searchProviderList', params).then(res => {
        if (res && res.length) {
          this.$ever.getFieldFromSchema(this.querySchema, 'executeProviderId').props.options = res.map(item => {
            return {
              id: item.executeProviderId,
              name: item.executeProviderName
            }
          })
        }
      })
    },
  },
  computed: {
    // 当前库房流程配置数据
    currentProcessConfig () {
      return this.$store.state.processConfig.thisStorageroomProcessConfig
    },
    // 流程id
    processConfigurationId () {
      return this.currentProcessConfig.id
    },
    // 当前流程配置code  100001 100002 100003 等
    processId () {
      return this.currentProcessConfig.processId
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  watch: {
    queryObj: {
      handler (obj) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.emitNotifyPatientTaskList(omit(obj, 'createTime'))
        }, 500)
      },
      immediate: true,
      deep: true
    }
  }
}
</script>


<template>
  <div>
    <!-- 简洁(只有一个查询框) -->
    <div v-if="simpleSearch">
      <search @query="searchQuery" :schema="isDispensing ? ['patientId', 'executeProviderId'] : []"></search>
    </div>
    <template v-else>
      <el-row>
        <el-col :span="14">
          <search @query="searchQuery" :schema="isDispensing ? ['patientId', 'executeProviderId'] : []"></search>
        </el-col>
        <el-col :span="10" class="alg_r">
          <ever-form2
            ref="form"
            :inline="true"
            :schema="querySchema"
            :is-query="true"
            v-model="queryObj">
            <template slot="default">
              <el-button
                size="small"
                v-for="option in dateOpts"
                v-bind="{'type': curBtnValue == option.id ? 'primary' : ''}"
                :key="option.id"
                @click="shortcutKeyHandler(option)">{{option.name}}</el-button>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
      <transition name="fade" mode="out-in">
        <div class="inner bWhite mt10 bor_rad bor_1 ptb5" style="min-height: 30px">
          <el-form ref="form" label-width="120px" class="query-style noflex" size="small" v-model="queryField">
            <transition-group name="fade" mode="out-in">
              <el-form-item label="病区:" key="aaaa" v-if="showAreaList.length">
                <el-checkbox-group v-model="queryField.areaIdList" @change="handleCheckedAreaChange">
                  <el-checkbox v-for="area in showAreaList" :label="area.id" :key="area.id">{{area.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="给药途径:" key="bbbb" v-if="showEmployList.length">
                <el-checkbox-group v-model="queryField.employList" @change="handleCheckedEmployChange">
                  <el-checkbox v-for="employ in showEmployList" :label="employ.code" :key="employ.code">{{employ.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="执行时间:" key="cccc" v-if="showImplementList.length">
                <el-checkbox-group v-model="queryField.implementTimeList" @change="checkedImplementChangeHandler">
                  <el-checkbox v-for="implement in showImplementList" :label="implement" :key="implement">{{implement == TERM_TYPE ? '临时医嘱' : implement.substring(0, 5)}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </transition-group>
          </el-form>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
import Search from '@/warehouse/views/drug/component/search'
import { dateFormat, delObjIsNull } from '@/util/common'
import { isEqual, omit } from 'lodash'
import Parameters from '@/warehouse/views/drug/mixin/hospital.parameters.js'
import sysValueApi from '@/warehouse/store/sysvalueapi'
import { now, oneDay, EMPLOY_NOT } from '@/warehouse/views/util/constant.js'
const toDay = oneDay + now
const threeDay = 2 * oneDay + now
const sevenDay = 6 * oneDay + now
const dateOpts = [
  { id: 1, name: '今天', date: [now, toDay] },
  { id: 2, name: '三天内', date: [now, threeDay] },
  { id: 3, name: '七天内', date: [now, sevenDay] }
]
const querySchema = [
  { name: 'date', comp: 'ever-range-picker', props: { noclear: true } }
]
const TERM_TYPE = '88:88:88' // 临时医嘱 都断自定义值
const INIT_FIELDS = {
  areaIdList: [], // 选择病区值
  employList: [], // 选择病区值
  implementTimeList: [], // 选择病区值
}
export default {
  mixins: [Parameters],
  props: {
    pageType: Number,
    simpleSearch: { // 简单模式查询(只有一个查询输入框)
      type: Boolean,
      default: false
    },
    inputWidth: {
      type: Number,
      default: 500
    },
    isDispensing: {
      type: Boolean,
      default: false
    },
  },
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.date = dateOpts[0].date
    queryObj.startDate = ''
    queryObj.endDate = ''
    return {
      dateOpts,
      querySchema,
      queryObj,
      TERM_TYPE,
      curBtnValue: '', // 时间快捷键操作值
      queryField: Object.assign({}, INIT_FIELDS),
      showAreaList: [], // 病区列表
      showEmployList: [], // 给药途径列表
      showImplementList: [], // 执行时间列表
      employSysValueList: [], // 给药途径值级列表数据
      isPrintList: '',
      cacheQueryValue: null,
      timer: null
    }
  },
  async created () {
    await sysValueApi.listOnce('CV06.00.102').then(res => { // 值级获取给药途径数据
      if (res) this.employSysValueList = res.concat(EMPLOY_NOT)
    })
    this.commonParams.storageRoomId = this.currentStorageRoomId
    if (this.simpleSearch) this.emitGetPatientTask()
  },
  mounted () {
    this.onUpdateSearchParams() // 接收指令更新查询参数
  },
  methods: {
    initField () {
      // 初始化选择条件
      this.queryField = Object.assign({}, INIT_FIELDS)
    },
    reset () {
      this.showEmployList = []
      this.showImplementList = []
      this.emitGetPatientTask()
    },
    getArea () {
      // 查询病区参数(commonParams)
      if (this.listMode) {
        if (this.pageType === 1) this.isPrintList = [0]
        if (this.pageType === 2) this.isPrintList = [1, 2]
      }
      this.uddApi.getAreaList(delObjIsNull(Object.assign(
        {
          processConfigurationId: this.processConfigurationId,
          isPrintList: this.isPrintList
        },
        this.commonParams,
        omit(this.queryObj, ['date'])
      ))).then(res => {
        const { patientId, uddCode } = this.commonParams
        if (res && !res.length && (patientId || uddCode)) {
          if (this.cacheQueryValue === (patientId || uddCode)) return
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.cacheQueryValue = null
          }, 1000 * 30)
          this.cacheQueryValue = patientId || uddCode
          if (patientId || uddCode) this.$messageTips(this, 'warning', '没有找到匹配的结果，请重新核对后重新搜索。')
          return
        }
        this.showAreaList = res.map(item => ({ id: item.areaId, name: item.areaName }))

        if (this.showAreaList.length) {
          this.getEmploy()
        } else {
          this.reset()
        }
      })
    },
    getEmploy () {
      // 查询给药途径参数(组合commonParams)
      this.uddApi.getEmployList(delObjIsNull(Object.assign(
        {
          processConfigurationId: this.processConfigurationId,
          isPrintList: this.isPrintList
        },
        this.commonParams,
        { areaIdList: this.queryField.areaIdList },
        omit(this.queryObj, ['date'])
      ))).then(res => {
        if (!Array.isArray(res)) return
        this.showEmployList = res.map(item => item && this.employSysValueList.find(employ => employ.code === item))
        this.getImplement()
      })
    },
    getImplement () {
      // 查询执行时间参数(组合commonParams)
      this.uddApi.getImplementList(delObjIsNull(Object.assign(
        {
          processConfigurationId: this.processConfigurationId,
          isPrintList: this.isPrintList
        },
        this.commonParams,
        omit(this.queryObj, ['date']),
        {
          areaIdList: this.queryField.areaIdList,
          employList: this.queryField.employList
        }
      ))).then(res => {
        this.showImplementList = res
        this.emitGetPatientTask()
      })
    },
    searchQuery (...rest) {
      const { patientId = '', searchCode = '' } = rest[0]
      this.commonParams = Object.assign(this.commonParams, rest[0], { patientId, uddCode: searchCode, searchCode: '' })
      if (this.simpleSearch) {
        this.$emit('query', rest)
        this.emitGetPatientTask()
      } else {
        this.getArea()
      }
      // this.$emit('query', rest)
    },
    shortcutKeyHandler (data) { // 快捷键操作日期
      this.curBtnValue = data.id
      this.queryObj.date = data.date
    },
    handleCheckedAreaChange (val) { // 病区选择
      this.getEmploy()
    },
    handleCheckedEmployChange (val) { // 给药途径选择
      this.getImplement()
    },
    emitGetPatientTask () { // 派发事件给 hospital.patient.list组件，获取患者任务数据
      this.$nextTick(_ => {
        this.$bus.$emit('hospital:get-patient-task-list', delObjIsNull(Object.assign(
          {
            processConfigurationId: this.processConfigurationId,
            isPrintList: this.isPrintList
          },
          this.commonParams,
          omit(this.queryObj, ['date']),
          this.queryField,
          {
            implementTimeList: this.queryField.implementTimeList.filter(item => item !== -1)
          })
        ))
      })
    },
    checkedImplementChangeHandler (val) { // 执行时间选择
      this.emitGetPatientTask()
    },
    dateFormatArr (arr) {
      return [dateFormat(arr[0], 'YYYY-MM-DD'), dateFormat(arr[1], 'YYYY-MM-DD')]
    },
    onUpdateSearchParams () { // 接收指令更新查询参数
      /**
       * row:患者数据
       * isPush：增加(true)或者删除(false)标记
      */
      this.$bus.$on('notify-update-search-params', (row, isPush) => {
        if (!isPush) {
          // 清空所有条件
          this.showAreaList = [] // 病区列表
          this.showEmployList = [] // 给药途径列表
          this.showImplementList = [] // 执行时间列表
          return
        }
        const { areaId, areaName, employ, implementTime, termType } = row
        // this.showAreaList // 病区列表
        // this.showEmployList // 给药途径列表
        // this.showImplementList // 执行时间列表
        this.updateList({
          list: this.showAreaList,
          value: areaId,
          name: areaName,
        })
        this.updateList({
          list: this.showEmployList,
          value: employ,
          name: this.employSysValueList.find(row => row.code === employ).name,
        })
        this.updateList({
          list: this.showImplementList,
          value: implementTime.substring(11),
          isPush,
          termType
        })
      })
    },
    updateList ({ list, key = 'id', value, name, termType }) {
      const index = list.findIndex(row => {
        return ((termType === 0 && !row[key] && row === this.TERM_TYPE) || (row[key] ? String(row[key]) : String(row)) === String(value))
      })
      if (index === -1) {
        list.push(name ? { id: value, name } : termType === 0 ? this.TERM_TYPE : value)
      }
    }
  },
  computed: {
    showQueryArea () {
      return this.showAreaList.length | this.showAreaList.length | this.showImplementList.length
    }
  },
  watch: {
    'queryObj.date': {
      handler (newDate) {
        if (this.simpleSearch) return
        this.commonParams.storageRoomId = this.currentStorageRoomId
        this.initField()
        const currentDate = this.dateOpts.find(item => isEqual(this.dateFormatArr(item.date), this.dateFormatArr(newDate)))
        this.curBtnValue = currentDate ? currentDate.id : ''
        this.queryObj.startDate = dateFormat(newDate[0], null, 'startDay')
        this.queryObj.endDate = dateFormat(newDate[1], null, 'endDay')
        this.getArea()
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    Search
  }
}
</script>


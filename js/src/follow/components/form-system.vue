<template>
  <div class="follow-sys">
    <!-- 系统阶段0 -->
     <ever-form2
      class="gray-label-form follow-sys-form"
      ref="sysForm"
      v-model="sysForm"
      :schema="sysSchema"
      :rules="sysRules"
      :nosubmit="true"
      label-width="120px"
      append-to-body>
        <template slot="sysnodeObj">
          <el-row>
            <el-col :span="6">
              <el-select popper-class="follow-select-down"
              v-model="sysForm.sysnodeType"
              clearable filterable placeholder="请选择"
              @change="changeSysnodeType"
              value-key="id">
                <el-option
                v-for="item in sysnodeTypeList"
                :key="item.id"
                :label="item.name"
                :value="item"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-select 
              class="ml10"
              popper-class="follow-select-down"
              v-model="sysForm.sysnodeObj"
              value-key="id"
              @change="changeSysnodeObj"
              clearable filterable placeholder="请选择">
                <el-option
                v-for="item in sysnodeList"
                :key="item.id"
                :label="item.name"
                :value="item">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </template>
        <template slot="name">
          <el-row>
            <el-col :span="24">
              <el-input v-model="sysForm.name" placeholder="请输入阶段名称" size="small" style="width:292px"></el-input>
            </el-col>
          </el-row>
        </template>
        <template slot="followUpTimeRightNow">
          <el-radio-group
            v-model="sysForm.followUpTimeType"
            @change="changeFollowUpTime('followUpTimeRightNow', $event)">
            <el-radio :label="1">立即</el-radio>
          </el-radio-group>
        </template>
        <template slot="followUpTimeAfter">
            <el-row>
              <el-col :span="4">
                <el-radio-group
                  v-model="sysForm.followUpTimeType"
                  @change="changeFollowUpTime('followUpTimeAfter', $event)"
                >
                  <el-radio :label="2">之后</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="20" v-show="sysForm.followUpTimeType === 2">
                <age-picker
                  v-model="sysForm.followUpTimeObj"
                  border
                  :key="agePickerKey"
                  :year-text="'年'"
                  :show-day="true"
                  :show-hour="true"
                ></age-picker>
              </el-col>
            </el-row>
          </template>
        <template slot="followUpTimeBefore" v-if="sysForm.sysnodeType && sysForm.sysnodeType.name === '到诊'">
          <el-row>
            <el-col :span="4">
              <el-radio-group
                v-model="sysForm.followUpTimeType"
                @change="changeFollowUpTime('followUpTimeBefore', $event)">
                <el-radio :label="3" :disabled="!(sysForm.sysnodeObj && sysForm.sysnodeObj.mark && (sysForm.sysnodeObj.mark === 'APPOINT_ARRIVAL' || sysForm.sysnodeObj.mark === 'OPERATION_ARRIVAL' ))">之前</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="20" v-show="sysForm.followUpTimeType === 3">
              <age-picker
                v-model="sysForm.followUpTimeObj"
                border
                :key="agePickerKey"
                :year-text="'年'"
                :show-day="true"
                :show-hour="true"
              ></age-picker>
            </el-col>
          </el-row>
        </template>
     </ever-form2>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button
        size="small"
        type="primary"
        v-ever-click-once="disabled"
        :disabled="disabled"
        @click="submit">确定</el-button>
      </span>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { toDayByMillisecond, toMillisecond, toMillisecondByTimeObj, toTimeObj } from '@/follow/util/fn'
import agePicker from '@/components/agepicker'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { listDestValue, debounce1 as debounce } from '@/util/common'
import { evenTypeList, pattern } from '@/follow/util/model'

const sysSchema = [
  {
    label: '阶段名称',
    name: 'sysnodeObj', // 取事件节点的id
    comp: 'custom'
  },
  {
    label: '',
    name: 'name', // 取事件节点的id
    comp: 'custom'
  },
  {
    name: 'followUpTimeRightNow', // 随访时间;事件节点完成多久以后，时间间隔，存储毫秒数;为0时，表示立即执行，不为0表示延迟执行毫秒值
    comp: 'custom'
  },
  {
    name: 'followUpTimeAfter',
    comp: 'custom'
  },
  {
    name: 'followUpTimeBefore',
    comp: 'custom'
  }
]
const remindMax = 30
export default {
  props: ['nodeData', 'patternType'],
  components: { agePicker },
  data () {
    let sysForm = this.$ever.createObjFromSchema(sysSchema)
    sysForm._id = ''
    sysForm.followUpTimeType = 1
    sysForm.followUpTimeObj = {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
    }
    sysForm.sysnodeObj = {
      id: '',
      name: ''
    }
    sysForm.sysnodeType = {
      id: '',
      name: ''
    }
    return {
      disabled: false,
      evenTypeList,
      agePickerKey: U(),
      sysForm,
      sysSchema,
      sysRules: {
        name: [{ required: true, message: '必填项', trigger: 'change' }],
      },
      remindMax: 0,
      sysnodeList: [],
      sysnodeTypeList: []
    }
  },
  async created () {
    this.findByTypeId()
    // this.getSysnodeList()
  },
  watch: {
    'sysForm.followUpTimeObj': {
      handler (o) {
        const form = this.sysForm
        if (form.followUpTimeType === 2 || form.followUpTimeType === 3) {
          const followTime = toMillisecondByTimeObj(o)
          // 改变提醒的最大限制
          this.remindMax = toDayByMillisecond(Math.min(followTime, toMillisecond(remindMax, 'day')))
          // 改变提醒的当前值
          if (form.remindCustomTime > this.remindMax) {
            form.remindCustomTime = this.remindMax
          }
        }
      },
      deep: true,
    },
    'sysForm.sysnodeType': { // 事件分类变动后，更新事件列表
      handler (o) {
        if (o) {
          this.getSysnodeList(o.id)
        } else {
          // this.getSysnodeList()
          this.sysnodeList = []
        }
        this.setSysFormName()
      },
      deep: true
    },
    'sysForm.sysnodeObj': { // 事件分类变动后，更新事件列表
      handler (o) {
        this.setSysFormName()
      },
      deep: true
    },
    'nodeData': {
      handler (val) {
        if (val) {
          if (this.patternType === pattern.EDIT) {
            this.getEditData(val)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    setSysFormName () {
      let nameStr = []
      if (this.sysForm.sysnodeType && this.sysForm.sysnodeType.name) {
        nameStr.push(this.sysForm.sysnodeType.name)
      }
      if (this.sysForm.sysnodeObj && this.sysForm.sysnodeObj.name) {
        nameStr.push(this.sysForm.sysnodeObj.name)
      }
      this.sysForm.name = nameStr.join('-')
    },
    changeSysnodeType (val) {
      if (val) {
        this.sysForm.followUpTimeObj = {
          year: 0,
          month: 0,
          day: 0,
          hour: 0,
        }
        this.sysForm.followUpTimeType = 1
      }
    },
    changeSysnodeObj (val) {
      if (val) {
        this.sysForm.followUpTimeObj = {
          year: 0,
          month: 0,
          day: 0,
          hour: 0,
        }
        this.sysForm.followUpTimeType = 1
      }
    },
    submit: debounce(function () {
      this.$refs.sysForm.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.sysForm.sysnodeTypeId = this.sysForm.sysnodeType && this.sysForm.sysnodeType.id ? this.sysForm.sysnodeType.id : ''
        if (this.sysForm.followUpTimeType === 1) {
          this.sysForm.remindTime = 0
          this.sysForm.followUpTime = 0
        } else if (this.sysForm.followUpTimeType === 2) {
          this.sysForm.remindTime = toMillisecond(this.sysForm.remindCustomTime, 'day')
          this.sysForm.followUpTime = toMillisecondByTimeObj(this.sysForm.followUpTimeObj)
        } else {
          this.sysForm.remindTime = toMillisecond(this.sysForm.remindCustomTime, 'day')
          this.sysForm.followUpTime = -toMillisecondByTimeObj(this.sysForm.followUpTimeObj)
        }
        let obj = {
          name: this.sysForm.name,
          followUpTime: this.sysForm.followUpTime || 0,
          remindTime: this.sysForm.remindTime,
          sysnodeId: this.sysForm.sysnodeObj ? this.sysForm.sysnodeObj.id : '',
          sysnodeTypeId: this.sysForm.sysnodeTypeId
        }
        if (this.sysForm.id) {
          obj.id = this.sysForm.id
        }
        this.$emit('updateNode', obj)
      })
    }),
    reset () {
      this.sysForm.id = ''
      this.sysForm.sysnodeObj = null
      this.sysForm.sysnodeType = null
      this.sysForm.name = ''
      this.sysForm._id = ''
      this.sysForm.followUpTimeType = 1
      this.sysForm.remindCustomTime = 0
      this.sysForm.remindTime = 0
      this.sysForm.followUpTime = ''
      this.sysForm.followUpTimeObj = {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
      }
    },
    getEditData (val) {
      // console.log(val, 'getEditData')
      this.$nextTick(_ => {
        this.sysForm.type = val.type
        let mark = ''
        // 判断 立即和之后
        if (val.followUpTime === 0) {
          this.sysForm.followUpTimeType = 1
        } else {
          if (val.followUpTime > 0) {
            this.sysForm.followUpTimeType = 2
          } else {
            this.sysForm.followUpTimeType = 3
            mark = 'APPOINT_ARRIVAL'
          }
        }
        this.sysForm.sysnodeObj = {
          id: val.sysnodeId,
          name: val.name,
          mark: mark
        }
        this.sysForm.sysnodeType = {
          id: val.sysnodeTypeId,
          name: listDestValue(this.sysnodeTypeList, val.sysnodeTypeId)
        }
        this.sysForm.id = val.id
        this.sysForm.name = val.name
        this.sysForm.sysnodeId = val.sysnodeId
        this.sysForm.sysnodeTime = this.$moment(Math.abs(val.followUpTime)).format('YYYY-MM-DD HH:mm:ss')
        this.sysForm.followUpTimeRightNow = val.followUpTime === 0 ? 1 : 2
        this.sysForm.followUpTimeAfter = val.followUpTime === 0 ? 1 : 2
        this.sysForm.followUpTimeObj = toTimeObj(Math.abs(val.followUpTime))
        this.sysForm.remindCustomTime = toDayByMillisecond(val.remindTime)
      })
      this.sysForm._id = val._id
    },
    changeFollowUpTime (field, value) {
      // console.log(value, 'timeType')
      if (value === 1) {
        // 立即
        this.sysForm.remindCustomTime = 0
        this.remindMax = 0
      } else if (value === 2) {
        // 之后
        // 随访时间
        this.sysForm.followUpTimeObj = { year: 0, month: 0, day: 0, hour: 0 }
        const followTime = toMillisecondByTimeObj(this.sysForm.followUpTimeObj)
        // 改变提醒的最大限制
        this.remindMax = toDayByMillisecond(Math.min(followTime, toMillisecond(remindMax, 'day')))
      } else {
        // 之前
        // 随访时间
        this.sysForm.followUpTimeObj = { year: 0, month: 0, day: 0, hour: 0 }
        const followTime = toMillisecondByTimeObj(this.sysForm.followUpTimeObj)
        // 改变提醒的最大限制
        this.remindMax = toDayByMillisecond(Math.min(followTime, toMillisecond(remindMax, 'day')))
      }
    },
    // 事件类型
    async findByTypeId () {
      const res = await request(urlMap.follow.syscode.findByTypeId, { typeId: 6 })
      res.data.filter((item, index) => {
        ['住院', '手术'].includes(item.name) && res.data.splice(index, 1)
      })
      this.sysnodeTypeList = res.data
    },
    // 事件节点
    async getSysnodeList (params) {
      const res = await request(urlMap.follow.sysnodeFit.selectByCategoryId, { categoryId: params, sysnodeType: 0 })
      this.sysnodeList = res.data
      this.sysForm.sysnodeObj = params ? res.data[0] : ''
    },
    close () {
      this.$parent.$parent.close()
    }
  }
}
</script>
<style scoped>
.follow-sys .dialog-footer{display: block;text-align:right;border-top: 1px solid #bbb;padding:8px 10px;}
.follow-sys-form{padding:8px 10px;}
</style>


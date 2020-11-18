<template>
  <div class="follow-trends">
    <!-- 动态触发2 -->
     <ever-form2
      class="gray-label-form follow-trends-form"
      ref="trendsForm"
      v-model="trendsForm"
      :schema="trendsSchema"
      :rules="trendsRules"
      :nosubmit="true"
      label-width="120px"
      append-to-body>
      <template slot="sysnodeObj">
        <el-select popper-class="follow-select-down"
        v-model="trendsForm.sysnodeObj"
        value-key="id"
        clearable filterable placeholder="请选择">
          <el-option
          v-for="item in sysnodeList"
          :key="item.id"
          :label="item.name"
          :value="item"
          :disabled="item.disabled"
          ></el-option>
        </el-select>
      </template>
      <template slot="followUpTimeRightNow">
        <el-radio-group
          v-model="trendsForm.followUpTimeType"
          @change="changeFollowUpTime('followUpTimeRightNow', $event)">
          <el-radio :label="1">立即</el-radio>
          <el-radio class="dn" :label="2">之后</el-radio>
        </el-radio-group>
      </template>
       <template slot="followUpTimeAfter">
          <el-row>
            <el-col :span="4">
              <el-radio-group
                v-model="trendsForm.followUpTimeType"
                @change="changeFollowUpTime('followUpTimeAfter', $event)"
              >
                <el-radio class="dn" :label="1">立即</el-radio>
                <el-radio :label="2">之后</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="20" v-show="trendsForm.followUpTimeType === 2">
              <age-picker
                v-model="trendsForm.followUpTimeObj"
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
const remindMax = 30
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { toDayByMillisecond, toMillisecond, toMillisecondByTimeObj, toTimeObj } from '@/follow/util/fn'
import agePicker from '@/components/agepicker'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { debounce1 as debounce } from '@/util/common'
import { pattern } from '@/follow/util/model'
const trendsSchema = [
  {
    label: '阶段名称',
    name: 'sysnodeObj', // 取事件节点的id
    comp: 'custom',
  },
  {
    name: 'followUpTimeRightNow', // 随访时间;事件节点完成多久以后，时间间隔，存储毫秒数;为0时，表示立即执行，不为0表示延迟执行毫秒值
    comp: 'custom',
  },
  {
    name: 'followUpTimeAfter',
    comp: 'custom',
  }
]
export default {
  props: ['nodeLength', 'nodeData', 'previousId', 'patternType'],
  components: { agePicker },
  data () {
    let trendsForm = this.$ever.createObjFromSchema(trendsSchema)
    trendsForm.sysnodeName = ''
    trendsForm._id = ''
    trendsForm.followUpTimeType = 1
    trendsForm.followUpTimeObj = {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
    }
    return {
      disabled: false,
      agePickerKey: U(),
      trendsForm,
      trendsSchema,
      trendsRules: {
        sysnodeObj: [{ required: true, message: '必填项', trigger: 'change' }],
      },
      remindMax: 0,
      sysnodeList: []
    }
  },
  async created () {
    this.getSysnodeList()
  },
  watch: {
    'nodeLength': {
      handler (o) {
        this.getSysnodeList()
      }
    },
    'patternType': {
      handler (o) {
        this.getSysnodeList()
      }
    },
    'trendsForm.followUpTimeObj': {
      handler (o) {
        const form = this.trendsForm
        if (form.followUpTimeType === 2) {
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
    'nodeData': {
      handler (val) {
        if (val) {
          if (this.patternType === pattern.EDIT) {
            this.getEditData(val)
            this.getSysnodeList()
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    submit: debounce(function () {
      this.$refs.trendsForm.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.trendsForm.name = this.trendsForm.sysnodeObj.name
        if (this.trendsForm.followUpTimeType === 1) {
          this.trendsForm.remindTime = 0
          this.trendsForm.followUpTime = 0
        } else if (this.trendsForm.followUpTimeType === 2) {
          this.trendsForm.remindTime = toMillisecond(this.trendsForm.remindCustomTime, 'day')
          this.trendsForm.followUpTime = toMillisecondByTimeObj(this.trendsForm.followUpTimeObj)
        }
        let obj = {
          name: this.trendsForm.sysnodeObj ? this.trendsForm.sysnodeObj.name : '',
          followUpTime: this.trendsForm.followUpTime || 0,
          remindTime: this.trendsForm.remindTime,
          sysnodeId: this.trendsForm.sysnodeObj ? this.trendsForm.sysnodeObj.id : ''
        }
        if (this.trendsForm.id) {
          obj.id = this.trendsForm.id
        }
        this.$emit('updateNode', obj)
      })
    }),
    reset () {
      this.trendsForm.id = ''
      this.trendsForm.name = ''
      this.trendsForm._id = ''
      this.trendsForm.followUpTimeType = 1
      this.trendsForm.followUpTime = 0
      this.trendsForm.remindCustomTime = 0
      this.trendsForm.remindTime = 0
      this.trendsForm.sysnodeObj = null
      this.trendsForm.followUpTimeObj = {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
      }
    },
    changeFollowUpTime (field, value) {
      if (field === 'followUpTimeRightNow') {
        if (value === 1) {
          // 立即
          this.trendsForm.followUpTimeAfter = 1
          this.trendsForm.remindCustomTime = 0
          this.remindMax = 0
        }
      } else if (field === 'followUpTimeAfter') {
        if (value === 2) {
          // 之后
          this.trendsForm.followUpTimeType = 2
          // 随访时间
          const followTime = toMillisecondByTimeObj(this.trendsForm.followUpTimeObj)
          // 改变提醒的最大限制
          this.remindMax = toDayByMillisecond(Math.min(followTime, toMillisecond(remindMax, 'day')))
        }
      }
    },
    getEditData (val) {
      this.trendsForm.type = val.type
      this.trendsForm.id = val.id
      this.trendsForm.name = val.name
      this.trendsForm.sysnodeObj = {
        id: val.sysnodeId,
        name: val.name
      }
      // 判断 立即和之后
      if (val.followUpTime === 0) {
        this.trendsForm.followUpTimeType = 1
      } else {
        this.trendsForm.followUpTimeType = 2
      }
      this.trendsForm.sysnodeId = val.sysnodeId
      this.trendsForm.followUpTimeObj = toTimeObj(val.followUpTime)
      this.trendsForm.remindCustomTime = toDayByMillisecond(val.remindTime)
      this.trendsForm._id = val._id
    },
    async getSysnodeList () {
      // 首次添加入组 前面不能有任何阶段
      // 距前一阶段   前面必须有阶段
      let type = this.trendsForm.name === '首次添加随访' ? 0 : 1
      const res = await request(urlMap.follow.sysnodeFit.selectByCategoryId, { sysnodeType: 1 })
      let array = res && res.data ? res.data : []
      // console.log(array)
      if (this.patternType === pattern.CREATE) {
        if (this.nodeLength !== 0) {
          array.splice(0, 1)
        } else if (this.nodeLength === 0) {
          array.splice(1, 1)
        }
      } else if (this.patternType === pattern.EDIT) {
        if (type === 0) {
          array.splice(1, 1)
        } else {
          array.splice(0, 1)
        }
      }
      this.sysnodeList = array
    },
    close () {
      this.$parent.$parent.close()
    }
  }
}
</script>
<style scoped>
.follow-trends .dialog-footer{display: block;text-align:right;border-top: 1px solid #bbb;padding:8px 10px;}
.follow-trends-form{padding:8px 10px;}
</style>


<template>
  <div class="follow-custom">
    <!-- 自定义事件 -->
     <ever-form2
      class="gray-label-form follow-custom-form"
      ref="customForm"
      v-model="customForm"
      :schema="customSchema"
      :rules="customRules"
      :nosubmit="true"
      label-width="120px"
      append-to-body>
      <template slot="isEmptytime">
        <el-switch v-model="customForm.isEmptytime"></el-switch>
      </template>
      <template slot="sysnodeTime">
        <el-date-picker
          popper-class="follow-picker-panel"
          v-if="customForm.isEmptytime===false"
          v-model="customForm.sysnodeTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择随访时间"
        ></el-date-picker>
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
import { debounce1 as debounce } from '@/util/common'
import { toDayByMillisecond, toTimeObj, toMillisecond } from '@/follow/util/fn'
import { pattern } from '@/follow/util/model'

const customSchema = [
  {
    label: '阶段名称',
    name: 'name', // 取事件节点的id
    comp: 'el-input',
    span: 17,
  },
  {
    label: '给患者添加随访时手动填写时间',
    name: 'isEmptytime',
    comp: 'custom',
    span: 18
  },
  {
    label: '阶段时间',
    name: 'sysnodeTime', // 取事件节点的id
    comp: 'custom',
  }
]
export default {
  props: ['nodeData', 'patternType'],
  data () {
    let customForm = this.$ever.createObjFromSchema(customSchema)
    customForm.isEmptytime = false
    customForm.sysnodeTime = ''
    customForm.remindCustomTime = 0
    customForm.remindTime = 0
    customForm.followUpTime = ''
    customSchema.find(item => item.name === 'sysnodeTime').parentClass = ''
    return {
      disabled: false,
      remindMax: 30,
      customSchema,
      customForm,
      customRules: {
        name: [
          { required: true, message: '必填项', trigger: 'change' },
          { min: 2, max: 15, message: '请输入2-15个字符', trigger: 'change' }
        ],
        sysnodeTime: [{ required: true, message: '必填项', trigger: 'change' }],
      }
    }
  },
  created () {
  },
  watch: {
    'customForm.isEmptytime': {
      handler (val) {
        if (!val) { // 并且时间不能为空
          this.customForm.sysnodeTime = ''
          this.customRules.sysnodeTime = [{ required: true, message: '必填项', trigger: 'change' }]
          this.customSchema.find(item => item.name === 'sysnodeTime').parentClass = val ? 'dn' : ''
        } else {
          this.customSchema.find(item => item.name === 'sysnodeTime').parentClass = val ? 'dn' : ''
          this.customForm.remindCustomTime = 0
          this.customRules.sysnodeTime = [{ required: false, message: '必填项', trigger: 'change' }]
        }
      }
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
    submit: debounce(function () {
      const dayMilli = 24 * 60 * 60 * 1000
      this.$refs.customForm.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.customForm.sysnodeId = '0'
        if (this.customForm.isEmptytime) {
          this.customForm.followUpTime = 0
          this.customForm.remindTime = 0
        } else {
          let ftdays = new Date(this.customForm.sysnodeTime).getTime() - new Date().getTime()
          let remindCustom = this.customForm.remindCustomTime * dayMilli
          // 如果
          if (ftdays < 0) {
            this.$message({
              message: '自定义事件下的随访时间不早于当前时间',
              type: 'error'
            })
            return
          }
          if (ftdays < remindCustom) {
            this.$message({
              message: '自定义事件下的提醒时间不早于当前时间，请重新维护自定义事件执行时间',
              type: 'error'
            })
            return
          }
          this.customForm.followUpTime = new Date(this.customForm.sysnodeTime).getTime()
          this.customForm.remindTime = toMillisecond(this.customForm.remindCustomTime, 'day')
        }
        let obj = {
          name: this.customForm.name,
          followUpTime: this.customForm.followUpTime || 0,
          remindTime: this.customForm.remindTime,
          sysnodeId: '0'
        }
        if (this.customForm.id) {
          obj.id = this.customForm.id
        }
        this.$emit('updateNode', obj)
      })
    }),
    reset () {
      this.customForm.id = ''
      this.customForm.name = ''
      this.customForm.isEmptytime = false
      this.customForm.sysnodeTime = ''
      this.customForm.remindCustomTime = 0
      this.customForm.remindTime = 0
      this.customForm.followUpTime = ''
      this.customSchema.find(item => item.name === 'sysnodeTime').parentClass = ''
    },
    getEditData (val) {
      // console.log('getEditData')
      this.customForm.type = val.type
      // 判断自定义事件中，随访时间未填写时的情况
      if (val.type === 1 && val.followUpTime === 0) {
        // 隐藏随访时间
        this.customForm.isEmptytime = true
      } else {
        this.customForm.isEmptytime = false
      }
      this.customForm.id = val.id
      this.customForm.name = val.name
      this.customForm.sysnodeId = val.sysnodeId
      this.customForm.sysnodeTime = this.$moment(val.followUpTime).format('YYYY-MM-DD HH:mm:ss')
      this.customForm.followUpTimeRightNow = val.followUpTime === 0 ? 1 : 2
      this.customForm.followUpTimeAfter = val.followUpTime === 0 ? 1 : 2
      this.customForm.followUpTimeObj = toTimeObj(val.followUpTime)
      this.customForm.remindCustomTime = toDayByMillisecond(val.remindTime)
      this.customForm._id = val._id
    },
    close () {
      this.$parent.$parent.close()
    }
  }
}
</script>
<style scoped>
.follow-custom .dialog-footer{display: block;text-align:right;border-top: 1px solid #bbb;padding:8px 10px;}
.follow-custom-form{padding:8px 10px;}
</style>


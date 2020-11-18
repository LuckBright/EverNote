<template>
  <div>
    <el-row style="width:723px">
      <el-col :span="7">
        <label class="mr10">循环任务</label>
        <el-checkbox v-model="form.isLoop" :disabled="status === false" @change="checkChange">周期内循环执行</el-checkbox>
      </el-col>
      <el-col :span="5">
        <label class="mr10">任务周期</label>
        <label v-if="status === false">{{form.cycleDays ? form.cycleDays + '天' : '--'}}</label>
        <template v-else>
        <el-input-number size="mini" class="mini_input" :controls="false" v-model="form.cycleDays" :min="0" :max="365" :disabled="!form.isLoop"></el-input-number> 天
        </template>
      </el-col>
      <el-col :span="6">
        <label class="mr10">执行时间</label>
        <label v-if="status === false">{{form.cycleExecuteTimeStr || '--'}}</label>
        <el-time-picker
          v-else
          size="mini"
          style="width:92px"
          value-format="HH:mm"
          :picker-options="{format: 'HH:mm'}"
          v-model="form.cycleExecuteTimeStr"
          :disabled="!form.isLoop"
          placeholder="执行时间">
        </el-time-picker>
      </el-col>
      <el-col :span="6">
        <label class="mr10">执行频次</label>
        <label v-if="status === false">{{form.cycleSeparateDays ? '每' + form.cycleSeparateDays + '天 / 次' : '--'}}</label>
        <template v-else >
           每
          <el-input-number size="mini" class="mini_input" :controls="false" v-model="form.cycleSeparateDays" :min="1" :max="99" :disabled="!form.isLoop"></el-input-number> 
          天 / 次
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: ['value', 'status'],
    data () {
      return {
        form: {
          isLoop: false,
          cycleDays: 0,
          cycleExecuteTimeStr: '',
          cycleExecuteTimeHour: '',
          cycleExecuteTimeMin: '',
          cycleSeparateDays: 0
        }
      }
    },
    watch: {
      'value': {
        handler (val) {
          if (val) {
            Object.assign(this.form, val)
          } else {
            this.form = {
              isLoop: false,
              cycleDays: 0,
              cycleExecuteTimeStr: '',
              cycleExecuteTimeHour: '',
              cycleExecuteTimeMin: '',
              cycleSeparateDays: 0
            }
          }
        },
        deep: true
      },
      'form': {
        handler (val) {
          this.$emit('update:value', Object.assign({}, val))
        },
        deep: true
      },
      'form.cycleExecuteTimeStr': {
        handler (val) {
          this.form.cycleExecuteTimeHour = val ? val.split(':')[0] : ''
          this.form.cycleExecuteTimeMin = val ? val.split(':')[1] : ''
        },
        deep: true
      }
    },
    created () {
      this.form = this.value || {
        isLoop: false,
        cycleDays: 0,
        cycleExecuteTimeStr: '',
        cycleExecuteTimeHour: '',
        cycleExecuteTimeMin: '',
        cycleSeparateDays: 0
      }
    },
    methods: {
      reset () {
        this.form = {
          isLoop: false,
          cycleDays: 0,
          cycleExecuteTimeStr: '',
          cycleExecuteTimeHour: '',
          cycleExecuteTimeMin: '',
          cycleSeparateDays: 0
        }
      },
      checkChange (val) {
        this.form.isLoop = val
      }
    }
  }
</script>

<style scoped>
  .mini_input {width: 40px; padding: 0 3px;}
  .mini_input /deep/ .el-input__inner {padding: 0 7px; text-align: center;}
</style>


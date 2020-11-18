<template>
  <el-form :model="obj" ref="form" :size="size || 'small'" class="event_input" :rules="rules">
    <el-row :gutter="2">
      <el-col :span="12">
        <el-form-item prop="event">
          <el-select
            v-model="obj.event"
            :placeholder="placeholder"
            clearable
            :disabled="disabled"
            @change="change">
            <el-option
              v-for="item in eventOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item prop="time">
          <el-time-picker
            :disabled="disabled"
            v-model="obj.time"
            value-format="HH:mm"
            :picker-options="pickerOptions"
            placeholder="时间">
          </el-time-picker>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

</template>
<script>
  import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
  // import storage from '@/util/storage'
  export default {
    name: 'eventInput',
    props: ['value', 'type', 'size', 'disabled', 'placeholder'],
    data () {
      let checkTime = (rule, value, callback) => {
        // console.log('obj', this.obj)
        if (this.obj.event && !value) {
          return callback(new Error('请选择时间时间'))
        } else {
          callback()
        }
      }
      return {
        pickerOptions: {
          // selectableRange: JSON.parse(storage.getLocalStorage('eventTime')),
          format: 'HH:mm'
        },
        uuid: U(),
        selectableRange: '',
        eventOptions: [
          {
            value: '手术',
            label: '手术'
          },
          {
            value: '转出',
            label: '转出'
          },
          {
            value: '转入',
            label: '转入'
          },
          {
            value: '死亡',
            label: '死亡'
          }
        ],
        obj: {
          time: null,
          event: null
        },
        rules: {
          time: [
            { required: false, validator: checkTime, trigger: 'change' }
          ]
        }
      }
    },
    watch: {
      obj: {
        handler (val) {
          if (val.event) {
            this.rules.time[0].required = true
          } else {
            this.rules.time[0].required = false
          }
          // this.$emit('input', val)
          if (!val.event && !val.time) {
            this.$emit('input', {})
          } else {
            this.$emit('input', val)
          }
        },
        deep: true
      },
      value: {
        handler () {
          if (this.value) {
            Object.assign(this.obj, this.value)
          } else {
            Object.assign(this.obj, {time: null, event: null})
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      change (val) {
        // this.$refs.form.resetFields()
        if (val) {
          // this.obj.time = new Date()
        } else {
          this.obj.time = null
        }
      }
    }
  }
</script>
<style  lang="scss" scoped>
  .event_input{
    .el-form-item{
      margin-bottom:0 !important;
    }
    /deep/.el-form-item__content{
      height:33px;
      /deep/.el-date-editor.el-input{
          width: 100%;
      }
    }

  }

</style>

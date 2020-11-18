<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      v-for="(temp, index) in form.ruluesObj"
      :key="index"
      :disabled="disabled"
      label-width="80px">
      <el-select v-model="temp.timetrunkId" placeholder="请选择" style="width: 120px;">
        <el-option
          v-for="item in list"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="temp.serviceId" placeholder="请选择" style="width: 120px;" v-show="['OUTPATIENT_DOCTOR', 'INQUIRY_VIDEO', 'INQUIRY_IMAGE_TEXT', 'CONSULT_ON_LINE'].includes(categoryCode)">
        <el-option
          v-for="item in serviceArr"
          :key="item.serviceId"
          :label="item.serviceName"
          :value="item.serviceId">
        </el-option>
      </el-select>
      <el-select v-model="temp.frequencyType" class="wid74">
        <el-option
          v-for="(item, index) in categoryCode === 'OUTPATIENT_SURGERY' ? [frequency[1]] : frequency"
          :key="index"
          :value="item.value"
          :label="item.label"
          :disabled="item.disabled">
        </el-option>
      </el-select>
      <span v-if="temp.frequencyType === 1">
        <el-input-number class="wid40 mr5" v-model="temp.frequencyAmount" :min="1" :max="1440"></el-input-number><span class="c9">分钟/人</span>
      </span>
      <span v-if="temp.frequencyType === 2">
        <el-input-number class="wid40 mr5" v-model="temp.frequencyVolume" :min="1" :max="1440"></el-input-number><span class="c9">个号</span>
      </span>
      <el-button type="text" v-if="index === 0" @click="addrow(index)"><i class="iconfont icon-tianjia"></i></el-button>
      <el-button type="text" v-if="index > 0" @click="delrow(index)">
        <i class="iconfont icon-delete"></i>
      </el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    'serviceArr': {
      type: Array,
      default: () => {}
    },
    'list': {
      type: Array,
      default: () => {}
    },
    'value': {
      type: Array,
      default: () => []
    },
    'categoryCode': {
      type: String,
      default: ''
    },
    'disabled': {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'form.ruluesObj': {
      handler (newVal) {
        newVal.filter(item => {
          if (item.timetrunkId === 'checkId') {
            item.serviceId = ''
            item.timetrunkId = ''
            if (item.frequencyType === 2) {
              item.frequencyVolume = ''
            } else {
              item.frequencyAmount = ''
            }
            item.frequencyType = ''
          }
          return item
        })
        this.$emit('input', newVal)
      },
      deep: true
    },
    'value': {
      handler (val) {
        if (val) {
          val.filter(item => {
            Object.assign(item, item.service)
          })
          this.form.ruluesObj = val
        }
      },
      deep: true
    }
  },
  data () {
    return {
      obj: {},
      form: {
        ruluesObj: [
          {
            timetrunkId: '',
            serviceId: '',
            frequencyType: this.categoryCode === 'OUTPATIENT_SURGERY' ? 2 : 1
          }
        ]
      },
      frequency: [
        {
          value: 1,
          label: '按频次',
          disabled: false
        },
        {
          value: 2,
          label: '按数量',
          disabled: false
        }
      ]
    }
  },
  methods: {
    addrow (index) {
      let obj = {
        classValue: '',
        serviceValue: '',
        frequencyType: ''
      }
      if (this.form.ruluesObj.length < 3) {
        this.form.ruluesObj.push(obj)
      } else {
        this.$messageTips(this, 'warning', '单日最多可添加3个班次')
      }
    },
    delrow (index) {
      this.form.ruluesObj.splice(index, 1)
    },
  }
}
</script>
<style lang="scss" scoped>
  .wid74{
    width:74px;
    background: #FFFFFF;
    border-radius: 2px;
    height:32px;
  }
  .wid40{
    width:140px;
    background: #FFFFFF;
    border-radius: 2px;
    height:32px;
  }
</style>

<template>
  <el-row class="record_time">
    <el-col :span="8">
      记录日期:
      <el-date-picker
        v-model="recordDate"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        type="date"
        :clearable="false"
        :picker-options="pickerOptions"
        placeholder="选择日期">
      </el-date-picker>
    </el-col>
    <el-col :span="14">
        <el-button  
          v-for="(item,index) in optionsof24[startTime-2].label" 
          :key="index"
          :type="active===index?'primary':'default'"
          @click="getData(index,item)">
          {{item}}
        </el-button>
    </el-col>
    <el-col :span="2">
      <slot name="saveBtn"></slot>
    </el-col>
  </el-row>
</template>
<script>
import storage from '@/util/storage'
import {timeRange, optionsof24} from '@/emr/config/temperaturedata.js'
export default {
  name: 'recordtime',
  props: {
    startTime: {
      type: Number
    },
    isUpdate: { // 判断是否有更新
      type: Boolean,
      default: false
    },
    pickerOptions: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      // pickerOptions: {
      //   disabledDate (time) {
      //     return time.getTime() > Date.now()
      //   }
      // },
      optionsof24,
      active: 0,
      recordDate: this.$moment(new Date()).format('YYYY-MM-DD'),
      recordHour: '02:00',
      recordTime: '',
    }
  },
  watch: {
    'startTime' (val) {
      this.init()
    },
    'recordDate' (val) {
      this.compareObj(this.active, this.recordHour)
    },
    'recordTime' (val) {
      if (!this.isUpdate) { // 当前表单未更新时，才向上传递
        let time = this.$moment(this.recordTime).format('YYYY-MM-DD HH:00:00')
        this.$emit('input', time)
      }
    },
  },
  created () {
    this.init()
  },
  methods: {
    getIndexStart4 () {
      const h = this.$moment().format('H')
      if (h < 6) {
        return 0
      } else if (h >= 6 && h < 10) {
        return 1
      } else if (h >= 10 && h < 14) {
        return 2
      } else if (h >= 14 && h < 18) {
        return 3
      } else if (h >= 18 && h < 22) {
        return 4
      } else {
        return 5
      }
    },
    getIndexStart3 () {
      const h = this.$moment().format('H')
      if (h < 5) {
        return 0
      } else if (h >= 5 && h < 9) {
        return 1
      } else if (h >= 9 && h < 13) {
        return 2
      } else if (h >= 13 && h < 17) {
        return 3
      } else if (h >= 17 && h < 21) {
        return 4
      } else {
        return 5
      }
    },
    getIndexStart2 () {
      // 获取当前系统时间所在的时间范围
      const h = this.$moment().format('H')
      const index = Math.floor(h / 4)
      return index
    },
    getIndex () {
      // 获取当前系统时间所在的时间范围
      if (this.startTime === 2) {
        return this.getIndexStart2()
      }
      if (this.startTime === 4) {
        return this.getIndexStart4()
      }
      if (this.startTime === 3) {
        return this.getIndexStart3()
      }
      /**
       * 4开始0-6   0
       * 6-10 1
       * 10-14 2
       * 14-18 3、
       * 18-22 5
       * 22以上 返回5
       */
    },
    init () {
      const index = this.getIndex()
      this.active = index
      this.recordHour = this.optionsof24[this.startTime - 2].label[index]
      this.recordTime = this.recordDate + ' ' + this.recordHour
      storage.setLocalStorage('eventTime', JSON.stringify(timeRange[this.startTime][index]))
    },
    getData (index, item) {
      this.recordHour = item
      this.compareObj(index, item)
    },
    changeRecordTime (index, recordHour) {
      if (recordHour) { // 改变的是时间点
        this.active = index// button状态需要改变
        this.recordTime = this.recordDate + ' ' + recordHour
      } else { // 改变的是日期
        this.recordTime = this.recordDate + ' ' + this.recordHour
      }
    },
    compareObj (index, recordHour) {
      if (this.isUpdate) {
        this.$confirm('当前修改未保存，请先执行保存操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '不保存',
          type: 'warning',
          showClose: false,
          closeOnClickModal: false
        }).then(() => {
        }).catch(() => {
          this.$emit('update:isUpdate', false)
          this.changeRecordTime(index, recordHour)
          storage.setLocalStorage('eventTime', JSON.stringify(timeRange[this.startTime][index]))
        })
      } else {
        this.changeRecordTime(index, recordHour)
        storage.setLocalStorage('eventTime', JSON.stringify(timeRange[this.startTime][index]))
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.record_time{
  // /deep/.el-button-default:focus{
  //   color:#000;
  //   border-color:#bbb;
  //   background-color: #fff;
  // }
  /deep/.el-button:active,/deep/.el-button:focus{
    color:#000;
    border-color:#bbb;
    background-color: #fff;
  }
  // /deep/.el-button:focus{
  //   color:#000;
  //   border-color:#bbb;
  //   background-color: #fff;
  // }
  /deep/.el-button--primary:active,/deep/.el-button--primary:focus{
    background: #196fd7;
    border-color: #196fd7;
    color: #fff;
}
}
</style>

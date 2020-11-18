<template>
  <div id="timepannel">
    <el-row class="header mb20">
      <el-col align="right">
        <p>{{initParams.resourceName}} {{initParams.date}}</p>
      </el-col>
    </el-row>
    <div class="body">
      <el-row class="items clearfix" v-for="(arr, j) in timeList" :key="j">
        <el-col
          :span="2"
          v-for="(item, i) in arr"
          :class="{on: selectTime && item.startTimeStr === selectTime.startTimeStr, gray: item.sliceStockAmount === 0 || item.expired}"
          @click.native="selectTimeSlice(item)"
          :key="i"
        >    
          <div class="box">{{item.channelName === '全部渠道'?'':item.channelName}}</div>
          <div class="box">{{item.startTimeStr}}</div>
          <div class="box"><span>{{item.aptRelTypes && item.aptRelTypes[0] && item.aptRelTypes.length  < 2 && item.aptRelTypes[0] === 1 ? '已约': item.aptRelTypes && item.aptRelTypes[0] && item.aptRelTypes.length  < 2 && item.aptRelTypes[0] === 2 ? '已挂':''}}</span><i class="iconfont icon-suo" v-if="!item.isValid"></i></div>
        </el-col>
        <el-col
          :span="2"
          :key="j + '-' + k"
          v-for="k of 12 - (arr.length % 12 === 0 ?  12 : arr.length % 12)"
        ></el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import appointapi from '@/arrange/store/appointapi'
export default {
  props: ['serviceId', 'params', 'customerService'],
  data () {
    return {
      appointapi,
      selectTime: '',
      timeList: [],
      timeAreaStr: '请选择看诊时段',
      errMsg: '',
      initParams: ''
    }
  },
  watch: {
    'selectTime' (val, old) {
      if (!val || !old || val.startTimeStr !== old.startTimeStr) {
        this.$emit('select', val)
      }
    },
    'params' (val, old) {
      this.initParams = Object.assign({}, val)
      if (val.date !== old.date || val.resourceId !== old.resourceId || val.deptId !== old.deptId) {
        this.initTimeList()
      }
    },
    'timeList': {
      handler () {
        this.selectTime = this.getInitTimeslice()
      },
      deep: true
    }
  },
  created () {
    this.initParams = Object.assign({}, this.params)
    if (!this.initParams.date) {
      this.initParams.date = this.$moment().format('YYYY-MM-DD')
    }
    this.initParams.serviceId = this.serviceId
    this.initTimeList()
  },
  methods: {
    selectTimeSlice (val) {
      if (val.expired || val.sliceStockAmount === 0) {
        return false
      }
      this.selectTime = val
    },
    initTimeList () {
      if (!this.initParams.resourceId) {
        this.errMsg = '请先选择资源/医生'
        this.timeList = []
        return false
      }
      this.initParams.startTimeStr = ''
      this.initParams.isCanAppoint = false
      this.initParams.channelId = 1
      this.initParams.forRegister = false
      this.initParams.customerService = this.customerService !== false
      this.appointapi.getArrangeTime(this.initParams).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.errMsg = '暂无可预约时间段'
          this.timeList = []
          this.selectTime = ''
          return false
        }
        let timeArr = {}
        let sortArr = []
        rs.data.map(item => {
          if (timeArr[item.startTimeStr.split(':')[0]]) {
            timeArr[item.startTimeStr.split(':')[0]].push(item)
          } else {
            timeArr[item.startTimeStr.split(':')[0]] = [item]
          }
        })
        let keys = Object.keys(timeArr).sort()
        keys.map(key => {
          sortArr.push(timeArr[key])
        })
        this.timeList = sortArr
      })
    },
    getInitTimeslice () {
      let arr = []
      this.timeList.map(item => {
        arr = arr.concat(item)
      })
      return arr.filter(item => {
        return item.startTimeStr === this.params.startTimeStr
      })[0]
    },
    getEffecTimeList () {
      return this.timeList.filter(item => {
        return item.sliceStockAmount > 0 && !item.expired
      })
    }
  }
}
</script>

<style scoped>
.items {
  padding: 0;
  list-style: none;
  /* overflow: auto; */
  border-bottom: 1px solid #ddd;
  border-left: 1px solid #ddd;
  margin-right: -6px;
  margin-top: -1px; 
  border-top: 1px solid #ddd;
}
.items .el-col {
  height: 72px;
  text-align: center;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  cursor: pointer;
  margin-left: -1px;
  position: relative;
}
.box{
  height: 22px;
  text-align: center;
}
.items .el-col p{
  margin: 5px 0px;
  font-size: 13px;
  padding: 0px;
  text-align: center;
}
.items .el-col span{
  position: absolute;
  right: 28px;
}
.items .el-col .icon-suo {
  position: absolute;
  right: 4px;
  color: #1c7bef;
}
.items .on {
  background: #1c7bef;
  color: #fff;
}
.items .gray {
  background: #eeeeee;
}
.body {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  border-top: 1px solid #ddd;
}
</style>

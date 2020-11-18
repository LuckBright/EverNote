<template>
  <div class="layout_inner">
    <el-row>
      <el-col :span="6">
        <p>一：年月日选择</p>
        <div>
          <el-date-picker
            v-model="receiveTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
        </div>
        <el-date-picker
          style="width: 100%"
          v-model="sel2"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <p>二：年月日 时分秒选择</p>
        <p>
          <el-date-picker
            style="width: 100%"
            v-model="sel3"
            type="datetime"
            outformat="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </p>
        <p>三：时间选择</p>
        <p>
          <el-time-select v-model="sel5"></el-time-select>
        </p>
        <p>四：日期区间选择</p>
        <p>
          <el-date-picker
            v-model="sel4"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </p>
      </el-col>
      <el-col :span="18" style="line-height:30px">
        receiveTime：{{receiveTime}}
        <br>
        testdate0:{{testdate0}}
        <br>
        testdate1:{{testdate1}}
        <br>
        testdate2:{{testdate2}}
        <br>
        testdate3:{{testdate3}}
        <br>
        sel1:{{sel1}}
        <br>
        sel2:{{sel2}}
        <br>
        sel3:{{sel3}}
        <br>
        sel4:{{sel4}}
      </el-col>
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  data () {
    return {
      receiveTime: '',
      // testdate0: '2019-03-27 18:27:00', // 1899-12-30T15:54:17.000Z
      testdate0: '', // 1899-12-30T15:54:17.000Z
      testdate1: '2019-03-28', // 2018-01-10
      testdate2: '',
      testdate3: '',
      testdate4: '',
      sel1: '',
      sel2: '',
      sel3: '',
      sel4: '',
      sel5: '',
      val1: 'val1',
      val2: 'val2',
      val3: 'val3',
      val4: 'val4',
      val5: 'val5',
      pickerOptions: {
        disabledDate (time) {
          var arr = [
            '2019-03-10',
            '2019-03-02',
            '2019-03-01',
            '2019-05-01'
          ]
          return arr.includes(moment(new Date(time.getTime())).format('YYYY-MM-DD'))
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    pickerOpt () {

    }
  }
}
</script>

<template>
  <div class="date-pickers">
    <p class="pickers-week">
      <span v-for="(item, index) in week" :key="index">{{ item }}</span>
    </p>
    <p class="pickers-month">
      <span
        v-for="(item, index) in tableData"
        :key="index"
        :class="{
          'month-box': true,
          'err-body-title': !item.isEmpty && !item.isAppt,
          'success-body': item.isAppt
        }"
        @click="openDialog(item, index)"
      >
        <span
          :class="{
            'day-title': true,
            'success-title': item.isAppt,
            'err-title': !item.isEmpty && !item.isAppt
          }"
        >
          {{ item.monthDay }}
        </span>
        <span v-if="item.isEmpty"></span>
        <span v-else-if="item.isAppt" class="day-body">
          <span class="open-time" v-if="item.times.length">
            开放 {{ item.timeLang }} 小时
          </span>
          <span v-if="item.cntLimit"> 全天限{{ item.cntLimit }}人 </span>
          <span v-else>全天不限制人数</span>
        </span>
        <span v-else class="err-body">停止预约</span>
      </span>
    </p>
    <el-dialog class="dialog" :visible.sync="sourceDialog" width="30%">
      <div slot="title" class="title">
        设置人数限制详情
      </div>
      <div>
        <p class="dialog-source-switch">
          <span class="label-tip mr50">全天开始预约</span>
          <el-switch v-model="sourceObj.isAppt"></el-switch>
        </p>
        <p class="time-p" v-if="isLimit">
          <span class="label-tip mr50">全天预约人数</span>
          <el-input
            :disabled="!sourceObj.isAppt"
            v-model.trim="sourceObj.cntLimit"
            style="width: 46px"
            size="small"
            class="mr10"
            maxlength="2"
            oninput="value=value.replace(/[^\d]/, '')"
            @blur="blurChange"
          ></el-input>
          <span class="label-tip">人</span>
        </p>
      </div>
      <p class="mt20 dialog-footer">
        <el-button
          type="primary" size="small" @click="sourceClickBtn"
        >确 定
        </el-button
        >
        <el-button size="small" @click="sourceDialog = false">取 消</el-button>
      </p>
    </el-dialog>
    <el-dialog class="dialog" :visible.sync="sourceTimeDialog" width="30%">
      <div slot="title" class="title">
        设置人数限制详情
      </div>
      <div>
        <p class="dialog-source-switch">
          <span class="label-tip mr50">全天开始预约</span>
          <el-switch v-model="sourceObj.isAppt"></el-switch>
        </p>
        <p
          class="time-p"
          v-for="(item, index) in sourceTimeData"
          :key="index"
        >
          <span class="label-tip">{{ item.time }}</span>
          <el-switch
            class="mr10 dialog-switch"
            :disabled="!sourceObj.isAppt"
            v-model="item.isAppt"
          ></el-switch>
          <el-input
            v-if="isLimit"
            :disabled="!sourceObj.isAppt || !item.isAppt"
            v-model.trim="item.cntLimit"
            style="width: 46px"
            size="small"
            class="mr10"
            maxlength="2"
            oninput="value=value.replace(/[^\d]/, '')"
            @blur="timeBlurChange(item.cntLimit, index)"
          ></el-input>
          <span v-if="isLimit" class="label-tip">人</span>
        </p>
      </div>
      <p class="mt20 dialog-footer">
        <el-button
          type="primary" size="small" @click="sourceTimeClickBtn"
        >确 定
        </el-button
        >
        <el-button
          size="small" @click="sourceTimeDialog = false"
        >取 消
        </el-button
        >
      </p>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'datePickers',
    data () {
      return {
        week: [
          '星期一',
          '星期二',
          '星期三',
          '星期四',
          '星期五',
          '星期六',
          '星期日',
        ],
        monthDay: [
          '31',
          '28',
          '31',
          '30',
          '31',
          '30',
          '31',
          '31',
          '30',
          '31',
          '30',
          '31',
        ],
        tableData: [],
        sourceDialog: false,
        sourceObj: {
          isAppt: true,
          cntLimit: '',
        },
        index: '',
        sourceTimeDialog: false,
        sourceTimeData: [],
        isLimit: null,
      }
    },
    created () {
      let form = JSON.parse(this.$route.query.form)
      this.setCalendar(form)
    },
    methods: {
      setCalendar (form) {
        this.isLimit = form.isLimit
        let start = form.day[0]
        let end = form.day[1]

        // 起止年
        let startYear = new Date(start).getFullYear()
        let endYear = new Date(end).getFullYear()

        // 起止月份
        let startMonth = new Date(start).getMonth()
        let endMonth = new Date(end).getMonth()

        // 起止日期
        let startDay = new Date(start).getDate()
        let endDay = new Date(end).getDate()

        let num = startDay
        let cntLimit = null
        let times = []
        let startmonth = startMonth + 1
        let numLimit = null

        // cntLimitVOS 有值 则是编辑
        if (!form.cntLimitVOS.length) {
          // 判断是否有限制人数
          if (form.isLimit) {
            numLimit = Number(form.numLimit)
          } else {
            numLimit = ''
            cntLimit = ''
          }
          let timeLang = ''
          if (form.tempType === '1' && form.timeType === '1') {
            // 生成营业时间段
            let startTimeArr = form.startTime.split(':')
            let endTimeArr = form.endTime.split(':')
            let startTime = startTimeArr[0]
            let endTime = endTimeArr[0]
            let startM = startTimeArr[1]
            let endM = endTimeArr[1]

            let h = startTime
            h = h[0] === '0' ? h.slice(1) : h

            // 判断结束时间是否超出整点，超出按1小时计算
            if (endM - startM > 0) {
              ++endTime
            }
            timeLang = endTime - startTime

            // 生成时间段数据
            for (let i = 0; i < endTime - startTime; i++) {
              let obj = {
                cntLimit: numLimit,
                isAppt: true,
                time: (h < 10 ? '0' + h : h) + ':' + startM,
              }
              times.push({ ...obj })
              ++h
              cntLimit += numLimit
            }
          }
          // 判断起止日期是否是同一个月
          if (startMonth === endMonth) {
            for (let i = 0, len = endDay - startDay; i <= len; i++) {
              let obj = {
                monthDay: `${ startYear }-${ startmonth }-${ num }`,
                cntLimit: form.timeType === '1' ? cntLimit : numLimit,
                isAppt: true,
                times,
                timeLang,
                isWeek: new Date(`${ startYear }-${ startmonth }-${ num }`).getDay(),
              }
              this.tableData.push({ ...obj })
              ++num
            }
          } else {
            // 判断一下是否是闰年
            let startRYear = this.isLeapYear(startYear)
            let endRYear = this.isLeapYear(endYear)

            // 判断是否同年
            if (endYear - startYear === 0) {
              for (let i = startMonth; i <= endMonth; i++) {
                let monthDays
                // 判断是否是二月份及是否是闰年
                if (i === 1 && startRYear) {
                  monthDays = 29
                } else {
                  monthDays = this.monthDay[i]
                }
                let len, day
                switch (i) {
                  case startMonth:
                    day = startDay
                    len = monthDays
                    break
                  case endMonth:
                    day = 1
                    len = endDay
                    break
                  default:
                    day = 1
                    len = monthDays
                }
                for (day; day <= len; day++) {
                  let obj = {
                    monthDay: `${startYear}-${i + 1}-${day}`,
                    cntLimit: form.timeType === '1' ? cntLimit : numLimit,
                    isAppt: true,
                    times,
                    timeLang,
                    isWeek: new Date(`${startYear}-${i + 1}-${day}`).getDay(),
                  }
                  this.tableData.push({...obj})
                }
              }
            } else {
              // 不同年， 起始年数据
              let leng = 11 - startMonth
              let _startMonth = startMonth
              for (let J = 0; J <= leng; J++) {
                let monthDays
                // 判断是否是二月份及是否是闰年
                if (_startMonth === 1 && startRYear) {
                  monthDays = 29
                } else {
                  monthDays = this.monthDay[_startMonth]
                }
                let len, day
                switch (_startMonth) {
                  case startMonth:
                    day = startDay
                    len = monthDays
                    break
                  default:
                    day = 1
                    len = monthDays
                }
                for (day; day <= len; day++) {
                  let obj = {
                    monthDay: `${startYear}-${_startMonth + 1}-${day}`,
                    cntLimit: form.timeType === '1' ? cntLimit : numLimit,
                    isAppt: true,
                    times,
                    timeLang,
                    isWeek: new Date(`${startYear}-${_startMonth + 1}-${day}`).getDay(),
                  }
                  this.tableData.push({...obj})
                }
                ++_startMonth
              }
              // 结束年数据
              for (let J = 0, _endMonth = 0, len = endMonth; J <= len; J++) {
                let monthDays
                // 判断是否是二月份及是否是闰年
                if (_endMonth === 1 && endRYear) {
                  monthDays = 29
                } else {
                  monthDays = this.monthDay[_endMonth]
                }
                let len, day
                switch (_endMonth) {
                  case endMonth:
                    day = 1
                    len = endDay
                    break
                  default:
                    day = 1
                    len = monthDays
                }
                for (day; day <= len; day++) {
                  let obj = {
                    monthDay: `${endYear}-${_endMonth + 1}-${day}`,
                    cntLimit: form.timeType === '1' ? cntLimit : numLimit,
                    isAppt: true,
                    times,
                    timeLang,
                    isWeek: new Date(`${endYear}-${_endMonth + 1}-${day}`).getDay(),
                  }
                  this.tableData.push({...obj})
                }
                ++_endMonth
              }
            }
          /***************************************/
          //   let isRYear = this.isLeapYear(year)
          //   let monthDays
          //
          //   console.log('1111', startMonth)
          //   // 判断是否是二月份及是否是闰年
          //   if (startMonth === 1 && isRYear) {
          //     monthDays = 29
          //   } else {
          //     monthDays = this.monthDay[startMonth]
          //   }
          //
          //   // 开始月份数据
          //   for (let i = 0, len = monthDays - startDay; i <= len; i++) {
          //     let obj = {
          //       monthDay: `${ year }-${ startmonth }-${ num }`,
          //       cntLimit: form.timeType === '1' ? cntLimit : numLimit,
          //       isAppt: true,
          //       times,
          //       timeLang,
          //       isWeek: new Date(`${ year }-${ startmonth }-${ num }`).getDay(),
          //     }
          //     this.tableData.push({ ...obj })
          //     ++num
          //   }
          //
          //   // 最长可选31天， 二月份特殊，判断如果二月份， 生成一下二月份数据
          //   if (endMonth - startMonth > 1) {
          //     let monthNum = isRYear ? 29 : 28
          //     for (let i = 0, num = 1, len = monthNum - 1; i <= len; i++) {
          //       let obj = {
          //         monthDay: `${ year }-${ 2 }-${ num }`,
          //         cntLimit: form.timeType === '1' ? cntLimit : numLimit,
          //         isAppt: true,
          //         times,
          //         timeLang,
          //         isWeek: new Date(`${ year }-${ 2 }-${ num }`).getDay(),
          //       }
          //       this.tableData.push({ ...obj })
          //       ++num
          //     }
          //   }
          //
          //   // 结束月份数据
          //   let nums = endDay
          //   let endmonth = endMonth + 1
          //   let arr = []
          //   for (let i = 0, len = endDay - 1; i <= len; i++) {
          //     let obj = {
          //       monthDay: `${ endYear }-${ endmonth }-${ nums }`,
          //       cntLimit: form.timeType === '1' ? cntLimit : numLimit,
          //       isAppt: true,
          //       times,
          //       timeLang,
          //       isWeek: new Date(`${ endYear }-${ endmonth }-${ nums }`).getDay(),
          //     }
          //     arr.unshift({ ...obj })
          //     --nums
          //   }
          //   this.tableData.push(...arr)
          }
        } else {
          form.cntLimitVOS.forEach(item => {
            item.isWeek = new Date(item.monthDay).getDay()
            item.isAppt = item.isDayAppt
            if (item.times) {
              let timeLang = 0
              let cntLimit = 0
              item.times.forEach(k => {
                if (k.isAppt) {
                  ++timeLang
                  cntLimit += k.cntLimit
                }
                k.time = k.time.slice(0, 5)
              })
              item.timeLang = timeLang
              item.cntLimit = cntLimit
            } else {
              item.times = []
            }
          })
          this.tableData = form.cntLimitVOS
        }

        // 补充前后空数据
        let startForNum = this.tableData[0].isWeek
        let endForNum = this.tableData[this.tableData.length - 1].isWeek
        startForNum = startForNum ? startForNum : 7
        for (let i = 0, len = startForNum - 1; i < len; i++) {
          let obj = { isEmpty: true }
          this.tableData.unshift(obj)
        }

        if (endForNum) {
          for (let i = 0, len = 7 - endForNum; i < len; i++) {
            let obj = { isEmpty: true }
            this.tableData.push(obj)
          }
        }
      },

      // 模块点击
      openDialog (item, index) {
        if (!item.isEmpty) {
          this.sourceTimeData = []
          // 判断是日期/时间
          this.index = index
          if (item.times.length) {
            this.sourceTimeDialog = true
            this.sourceTimeData = [ ...JSON.parse(JSON.stringify(item.times)) ]
            this.sourceObj.isAppt = item.isAppt
          } else {
            this.sourceObj = { ...this.sourceObj, ...item }
            this.sourceDialog = true
          }
        }
      },

      // 日历日期弹框确定
      sourceClickBtn () {
        this.$set(this.tableData[this.index], 'isAppt', this.sourceObj.isAppt)
        this.$set(
          this.tableData[this.index],
          'cntLimit',
          this.sourceObj.cntLimit,
        )
        this.sourceDialog = false
      },

      // 日历时间弹框确定
      sourceTimeClickBtn () {
        let num = null
        let timeLang = 0
        // 计算全天预约人数
        this.sourceTimeData.forEach(item => {
          if (item.isAppt) {
            num += Number(item.cntLimit)
            ++timeLang
          }
        })
        if (this.sourceObj.isAppt && !timeLang) {
          this.sourceObj.isAppt = false
        }
        this.$set(this.tableData[this.index], 'isAppt', this.sourceObj.isAppt)
        this.$set(this.tableData[this.index], 'times', this.sourceTimeData)
        this.$set(this.tableData[this.index], 'cntLimit', num)
        this.$set(this.tableData[this.index], 'timeLang', timeLang)
        this.sourceTimeDialog = false
      },

      // 不足俩位数前填0
      appendzero (obj) {
        if (obj < 10) {
          return 0 + '' + obj
        } else {
          return obj
        }
      },

      // 判断是否是闰年
      isLeapYear (year) {
        return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0
      },

      // 日期blur
      blurChange () {
        if (
          this.isLimit &&
          (!this.sourceObj.cntLimit ||
            this.sourceObj.cntLimit === '0' ||
            this.sourceObj.cntLimit === '00')
        ) {
          this.sourceObj.cntLimit = 1
        }
      },

      // 时间blur
      timeBlurChange (val, index) {
        if (this.isLimit && (!val || val === '00' || val === '0')) {
          this.$set(this.sourceTimeData[index], 'cntLimit', 1)
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .date-pickers {
    .pickers-week {
      display: flex;

      span {
        display: inline-block;
        width: 140px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.4);
        box-sizing: border-box;
        padding-left: 10px;
      }
    }

    .pickers-month {
      width: 980px;
      display: flex;
      flex-wrap: wrap;

      .month-box {
        display: inline-block;
        width: 140px;
        height: 75px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        cursor: pointer;
        margin-top: 10px;
      }

      .day-title {
        display: inline-block;
        width: 100%;
        height: 26px;
        line-height: 26px;
        font-size: 12px;
        color: #000;
        border-bottom: 1px solid #ddd;
        background-color: #f5f5f5;
        margin-bottom: 5px;
        box-sizing: border-box;
        padding-left: 10px;
      }

      .success-title {
        background-color: #ddeecc;
      }

      .err-title {
        background-color: #f6d3d3;
      }

      .day-body {
        display: block;
        font-size: 12px;
        color: #0c6100;
        box-sizing: border-box;
        padding-left: 10px;

        .open-time {
          display: block;
        }
      }

      .success-body {
        background: #f2ffe5;
      }

      .err-body-title {
        background-color: #ffe6e6;
        display: block;
        font-size: 12px;
        color: #791111;
      }

      .err-body {
        background-color: #ffe6e6;
        display: block;
        font-size: 12px;
        color: #791111;
        box-sizing: border-box;
        padding-left: 10px;
      }
    }
  }

  .dialog {
    & /deep/ .el-dialog__header {
      padding: 0 !important;
    }

    .title {
      height: 54px;
      line-height: 54px;
      font-size: 14px;
      color: #000;
      padding-left: 20px;
    }

    & /deep/ .el-input__inner {
      text-align: center;
    }
  }

  .dialog-switch {
    margin-left: 80px;
    margin-right: 50px;
  }

  .time-p {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 10px 0;
  }

  .label-tip {
    color: #000;
    font-size: 14px;
    margin-right: 20px;
  }

  .mr50 {
    margin-right: 50px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .dialog-footer {
    margin-bottom: 10px;
  }

  .dialog-source-switch {
    padding-bottom: 10px;
  }
</style>

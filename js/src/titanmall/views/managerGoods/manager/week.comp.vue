<template>
  <div class="source-box">
    <div>
      <p class="pickers-month">
        <span
          v-for="(item, index) in tableData"
          :key="index"
          :class="{
            'month-box': true,
            'err-body-title': !item.isAppt,
            'success-body': item.isAppt
          }"
          @click="info(item, index)"
        >
          <span
            :class="{
              'day-title': true,
              'success-title': item.isAppt,
              'err-title': !item.isAppt
            }"
          >
            {{ item.week }}
          </span>
          <span
            class="day-body"
            v-if="item.isAppt && item.times && item.times.length"
          >
            开放 {{ item.timeLang }} 小时
          </span>
          <span v-if="item.isAppt" class="day-body">
            <span v-if="item.cntLimit > 0"> 全天限{{ item.cntLimit }}人 </span>
            <span v-else>全天不限制人数</span>
          </span>
          <span v-else class="err-body">停止预约</span>
        </span>
      </p>
    </div>
    <el-dialog
      class="dialog"
      :visible.sync="sourceDialog"
      width="30%"
    >
      <div slot="title" class="title">
        设置人数限制详情
      </div>
      <div>
        <p class="dialog-source-switch">
          <span class="label-tip mr50">全天开始预约</span>
          <el-switch v-model="sourceObj.isAppt"></el-switch>
        </p>
        <p class="time-p" v-if="isLimit">
          <span class="label-tip">全天预约人数</span>
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
      <p class="dialog-footer">
        <el-button
          type="primary" size="small" @click="sourceClickBtn"
        >确 定
        </el-button
        >
        <el-button size="small" @click="sourceDialog = false">取 消</el-button>
      </p>
    </el-dialog>
    <el-dialog
      class="dialog"
      :visible.sync="sourceTimeDialog"
      width="30%"
    >
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
            class="dialog-switch"
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
      <p class="dialog-footer">
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
  // import api from '../api'

  export default {
    filters: {
      isSource (val) {
        return val.isAppt
          ? val.cntLimit
            ? `全天限${ val.cntLimit }人`
            : '可预约'
          : '停止预约'
      },
    },
    data () {
      return {
        tableData: [],
        sourceDialog: false,
        sourceTimeDialog: false,
        sourceObj: {
          isAppt: null,
          cntLimit: '',
        },
        index: '',
        sourceTimeData: [],
        isLimit: null,
      }
    },
    created () {
      let form = JSON.parse(this.$route.query.form)
      this.isLength(form)
    },
    methods: {
      // 判断数组是否有长度，有编辑，否，新建
      isLength (form) {
        if (form.cntLimitVOS.length) {
          // 数据库没有保存全天开放时间和人数， 重新计算
          form.cntLimitVOS.forEach(item => {
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
            }
          })
          this.tableData = form.cntLimitVOS
        } else {
          this.setInfo(form)
        }
        this.isLimit = form.isLimit
      },
      // 生成配置数据
      setInfo (form) {
        if (form.tempType === '0' && form.timeType === '0') {
          let cntLimit = null
          if (form.isLimit) {
            cntLimit = form.numLimit
          }
          this.tableData.push(
            ...[
              { week: '星期一', cntLimit, isAppt: true },
              { week: '星期二', cntLimit, isAppt: true },
              { week: '星期三', cntLimit, isAppt: true },
              { week: '星期四', cntLimit, isAppt: true },
              { week: '星期五', cntLimit, isAppt: true },
              { week: '星期六', cntLimit, isAppt: true },
              { week: '星期日', cntLimit, isAppt: true },
            ],
          )
        } else if (form.tempType === '0' && form.timeType === '1') {
          // 生成营业时间段
          let times = []

          let start = form.startTime.split(':')[0]
          let end = form.endTime.split(':')[0]
          let startM = form.startTime.split(':')[1]
          let endM = form.endTime.split(':')[1]

          let h = form.startTime.split(':')[0]
          h = h[0] === '0' ? h.slice(1) : h

          // 判断结束时间是否超出整点，超出按1小时计算
          if (endM - startM > 0) {
            ++end
          }
          let timeLang = end - start

          let cntLimit = null
          let numLimit = null
          // 判断是否有限制人数
          if (form.isLimit) {
            numLimit = Number(form.numLimit)
          } else {
            numLimit = ''
            cntLimit = 0
          }
          // 生成时间段数据
          for (let i = 0; i < end - start; i++) {
            let obj = {
              cntLimit: numLimit,
              isAppt: true,
              time: (h < 10 ? '0' + h : h) + ':' + startM,
            }
            times.push(obj)
            ++h
            cntLimit += numLimit
          }
          this.tableData.push(
            ...[
              { week: '星期一', cntLimit, isAppt: true, timeLang, times },
              { week: '星期二', cntLimit, isAppt: true, timeLang, times },
              { week: '星期三', cntLimit, isAppt: true, timeLang, times },
              { week: '星期四', cntLimit, isAppt: true, timeLang, times },
              { week: '星期五', cntLimit, isAppt: true, timeLang, times },
              { week: '星期六', cntLimit, isAppt: true, timeLang, times },
              { week: '星期日', cntLimit, isAppt: true, timeLang, times },
            ],
          )
        }
      },

      // 设置数据
      info (row, index) {
        // 判断周日期/周时间
        this.index = index
        if (row.times) {
          this.sourceTimeDialog = true
          this.sourceTimeData = JSON.parse(JSON.stringify(row.times))
          this.sourceObj.isAppt = row.isAppt
        } else {
          this.sourceObj = { ...this.sourceObj, ...row }
          this.sourceDialog = true
        }
      },

      // 周日期弹框确认
      sourceClickBtn () {
        this.tableData[this.index] = { ...this.sourceObj }
        this.sourceDialog = false
      },

      // 周时间弹框
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

      // blur
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
  .source-box {
    &
    /deep/
    .source-table
    .el-table__body-wrapper.is-scrolling-none
    .el-table__body
    tbody
    .el-table__row
    td {
      padding: 0 !important;

      .cell {
        height: 50px !important;
        padding: 0 !important;

        & > span {
          height: 50px;
          display: block;
          cursor: pointer;
          padding: 0 10px;
          font-size: 12px;
        }
      }
    }

    .success {
      background: #f2ffe5;
      color: #0c6100;
    }

    .err {
      background: #ffe6e6;
      color: #791111;
    }

    .scoped-span {
      display: block;
      height: 20px;
      padding-top: 5px;
    }
  }

  .label-tip {
    color: #000;
    font-size: 14px;
    margin-right: 20px;
  }

  .mr10 {
    margin-right: 10px;
  }

  .dialog-switch {
    margin-left: 80px;
    margin-right: 50px;
  }

  .time-p {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 10px 0;
  }

  .pickers-month {
    width: 1380px;
    display: flex;
    flex-wrap: wrap;

    .month-box {
      display: inline-block;
      width: 140px;
      height: 75px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      cursor: pointer;
    }

    .ml {
      margin-left: 591px;
    }

    .day-title {
      display: inline-block;
      width: 100%;
      height: 26px;
      line-height: 26px;
      font-size: 12px;
      color: #000;
      border-bottom: 1px solid #ddd;
      margin-bottom: 5px;
      box-sizing: border-box;
      padding-left: 10px
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
      padding-left: 10px
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

  .dialog {
    & /deep/ .el-dialog__header {
      padding: 0 !important;
    }

    & /deep/ .el-input__inner {
      text-align: center;
    }

    .title {
      height: 54px;
      line-height: 54px;
      font-size: 14px;
      color: #000;
      padding-left: 20px;
    }
  }

  .mr50 {
    margin-right: 50px;
  }

  .dialog-footer {
    margin: 20px 0 10px;
  }

  .dialog-source-switch {
    padding-bottom: 10px;
  }
</style>

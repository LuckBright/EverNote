<template>
  <div class="right-tree-container">
    <div class="right-tree-box">
      <el-tree
        ref=""
        node-key="id"
        :data="treeData"
        :props="defaultProps"
        :highlight-current="true"
        @node-click="handleNodeClick"
      >
      </el-tree>
    </div>
    <div class="tree-detail" v-if="questionData && questionData.length">
      <div class="tree-detail-inner pb20">
        <div class="message-wrap">
          <div class="message-list">
            <question
              v-for="(item, index) in questionData"
              :key="item.quId"
              :questionData="item.ques"
              :text="answerList[index]"
            ></question>
          </div>
        </div>
      </div>
    </div>
    <el-popover
      v-if="answerId"
      placement="left"
      width="400"
      trigger="hover"
      ref="dialog"
    >
      <div v-if="historyList && historyList.length">
        <div
          class="h-container"
          v-for="item in historyList"
          :key="item.itemCode"
        >
          <span class="lable-txt">{{ item.itemName }}</span>
          <span class="content" v-html="formatContent(item)"></span>
        </div>
      </div>
      <ever-no-data tipTxt="暂无数据" v-else></ever-no-data>
      <el-button
        slot="reference"
        type="primary"
        class="btn"
        icon="el-icon-document"
        >病史</el-button
      >
    </el-popover>
  </div>
</template>

<script>
import { request } from '@/util/req'
import urlMap from '../../api/urls'
import question from '@/phr/page/patientdetail/components/question'
const url = urlMap.pre
export default {
  name: 'preInterrogation',
  data () {
    return {
      treeData: [],
      defaultProps: {
        label: 'dateTime',
      },
      questionData: [],
      answerList: [],
      answerId: '',
      historyList: []
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    async getHisrory () {
      this.historyList = []
      const res = await request(
        url.history,
        {
          answerId: this.answerId,
          surveyId: this.surveyId
        })
      this.historyList = res.data || []
      this.$refs.dialog.popperElm && (this.$refs.dialog.popperElm.style.zIndex = 1000000000) // bug 28542
    },
    async init () {
      const {
        patientId,
        visitSerialNumber
      } = this.$route.query
      const res = await request(url.list, {
        patientId,
        visitSerialNumber
      })
      this.treeData = (res.data || []).map(element => {
        element.dateTime = this.$moment(element.dateTime).format('YYYY-MM-DD HH:mm')
        return element
      })
    },
    handleNodeClick (data) {
      this.answerId = ''
      this.surveyId = ''
      this.searchDetail(data)
    },
    async searchDetail (data) {
      const { surveyId, answerId } = data
      this.answerList = []
      this.questionData = []
      this.surveyId = surveyId
      this.answerId = answerId
      this.getHisrory()
      const res = await request(url.detail, { surveyId, answerId })
      res.data.map(item => {
        this.answerList.push(this.answerToMsgNew(item.answer.items, item.ques))
      })
      if (this.answerId === answerId) {
        this.questionData = res.data || []
      }
    },
    answerToMsgNew (res, questionObj) {
      const quType = questionObj.quType
      questionObj.itemList = questionObj.items
      questionObj.rowList = questionObj.items.filter(item => !!item.quRowFlag)
      questionObj.columnList = questionObj.items.filter(item => !!item.quColFlag)
      let temptext = ''
      if (quType === 'RADIO') {
        const resOption = questionObj.itemList.find(item => item.quItemId === res[0].quItemId)
        temptext = resOption.quItemName
      } else if (quType === 'CHECKBOX') {
        res.forEach((item, index) => {
          const resOption = questionObj.itemList.find(qitem => qitem.quItemId === item.quItemId)
          temptext += (resOption.quItemName + ((index === res.length - 1) ? ' ' : '、'))
        })
      } else if (quType === 'FILLBLANK') {
        temptext = res[0].answerValue == null ? ' ' : res[0].answerValue
      } else if (quType === 'SCORE') {
        res.forEach((item, index) => {
          const resOption = questionObj.itemList.find(qitem => qitem.quItemId === item.quItemId)
          temptext += (resOption.quItemName + ': ' + item.answerValue + '分' + ((index === res.length - 1) ? ' ' : '、'))
        })
      } else if (quType === 'ORDERQU') {
        const tempres = res.sort((a, b) => {
          const val1 = a.answer
          const val2 = b.answer
          return val1 - val2
        })
        tempres.forEach((item, index) => {
          const resOption = questionObj.itemList.find(qitem => qitem.quItemId === item.quItemId)
          temptext += (index + 1 + '.' + resOption.quItemName + ((index === tempres.length - 1) ? ' ' : ' '))
        })
      } else if (quType === 'MULTIFILLBLANK' || quType === 'FORMULA') {
        res.forEach((item, index) => {
          const resOption = questionObj.itemList.find(qitem => qitem.quItemId === item.quItemId)
          item.answerValue = item.answerValue == null ? ' ' : item.answerValue
          temptext += (resOption.quItemName + ': ' + item.answerValue + ((index === res.length - 1) ? ' ' : '，'))
        })
      } else if (quType === 'CHENRADIO') {
        res.forEach((item, index) => {
          const rowOption = questionObj.rowList.find(qitem => qitem.quItemId === item.quRowId)
          const colOption = questionObj.columnList.find(qitem => qitem.quItemId === item.quColId)
          temptext += (rowOption.quItemName + ' ' + colOption.quItemName + ((index === res.length - 1) ? ' ' : '，'))
        })
      } else if (quType === 'CHENCHECKBOX') {
        const tempres = []
        res.forEach((item) => {
          const temprow = tempres.find(tritem => tritem.rowId === item.quRowId)
          if (temprow) {
            temprow.colIds.push(item)
          } else {
            tempres.push({ rowId: item.quRowId, colIds: [item] })
          }
        })

        tempres.forEach((item, index) => {
          const rowOption = questionObj.rowList.find(qitem => qitem.quItemId === item.rowId)
          let subtext = ' '
          item.colIds.forEach((sitem, sindex) => {
            const colOption = questionObj.columnList.find(qitem => qitem.quItemId === sitem.quColId)
            subtext += colOption.quItemName + (sindex === item.colIds.length - 1 ? ' ' : '、')
          })
          temptext += (rowOption.quItemName + ' ' + subtext + ((index === tempres.length - 1) ? ' ' : '，'))
        })
      } else if (quType === 'CHENSCORE') {
        const tempres = []
        res.forEach((item) => {
          const temprow = tempres.find(tritem => tritem.rowId === item.quRowId)
          if (temprow) {
            temprow.colIds.push(item)
          } else {
            tempres.push({ rowId: item.quRowId, colIds: [item] })
          }
        })

        tempres.forEach((item, index) => {
          const rowOption = questionObj.rowList.find(qitem => qitem.quItemId === item.rowId)
          let subtext = ' '
          item.colIds.forEach((sitem, sindex) => {
            const colOption = questionObj.columnList.find(qitem => qitem.quItemId === sitem.quColId)
            subtext += colOption.quItemName + ' ' + sitem.answerValue + '分' + (sindex === item.colIds.length - 1 ? ' ' : '、')
          })
          temptext += (rowOption.quItemName + ':' + subtext + ((index === tempres.length - 1) ? ' ' : '，'))
        })
      } else if (quType === 'CHENFBK') {
        const tempres = []
        res.forEach((item) => {
          const temprow = tempres.find(tritem => tritem.rowId === item.quRowId)
          if (temprow) {
            temprow.colIds.push(item)
          } else {
            tempres.push({ rowId: item.quRowId, colIds: [item] })
          }
        })
        tempres.forEach((item, index) => {
          const rowOption = questionObj.rowList.find(qitem => qitem.quItemId === item.rowId)
          let subtext = ' '
          item.colIds.forEach((sitem, sindex) => {
            const colOption = questionObj.columnList.find(qitem => qitem.quItemId === sitem.quColId)
            subtext += colOption.quItemName + sitem.answerValue + (sindex === item.colIds.length - 1 ? ' ' : '、')
          })
          temptext += (rowOption.quItemName + ':' + subtext + ((index === tempres.length - 1) ? ' ' : '，'))
        })
      }
      if (!temptext) {
        console.log(!temptext, res, questionObj)
      }
      return temptext
    },
    formatContent (item) {
      let content = ''
      for (let i = 0; i < item.hisInfos.length; i++) {
        const data = item.hisInfos[i]
        content += data.preText == null ? '' : data.preText
        content += ' '
        for (let n = 0; n < data.details.length; n++) {
          const detail = data.details[n]
          content += detail.quItemName == null ? '' : detail.quItemName
          content += ' '
          content += detail.quRowName == null ? '' : detail.quRowName
          content += ' '
          content += detail.quColName == null ? '' : detail.quColName
          content += ' '
          content += detail.answerValue == null ? '' : detail.answerValue
          content += ' '
        }
        content += data.suffixText == null ? '' : data.suffixText
        content += '<br/>'
      }
      return content
    }
  },
  components: {
    question,
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-popover {
  z-index: 10000000000;
}
.btn {
  position: absolute;
  right: 50px;
  top: 20px;
}
.h-container {
  display: flex;
  flex-direction: row;
  .lable-txt {
    box-sizing: border-box;
    padding-right: 20px;
    width: 100px;
    text-align: right;
    color: grey;
  }
  .content {
    flex: 1;
  }
}
.tree-detail-inner {
  background-color: #d5d5d5;
  height: 100%;
}
.tree-detail {
  margin: 0 auto;
  font-size: 14px;
  box-sizing: border-box;
  padding: 40px 20px;
  height: 100%;
}
.message-wrap {
  height: 100%;
  padding: 0 10px 20px;
  overflow: auto;
  margin: 0 auto;
  width: 500px;
  /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
  /deep/ &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    background-color: #f5f5f5;
    border-radius: 50px;
  }
  /*定义滚动条的轨道，内阴影及圆角*/
  /deep/ &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgb(239, 239, 239);
    border-radius: 50px;
    background-color: #f5f5f5;
  }
  /*定义滑块，内阴影及圆角*/
  /deep/ &::-webkit-scrollbar-thumb {
    width: 3px;
    height: 200px;
    border-radius: 200px;
    box-shadow: inset 0 0 6px rgb(248, 248, 248);
    background-color: #8f8f8f;
  }
  .message-list {
    background-color: #d5d5d5;
    .msg-item {
      padding: 10px 10px 0 10px;
    }
    padding-bottom: 46px;
  }
  .message-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 46px;
    line-height: 46px;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #fff;
    background-color: #1c7bef;
  }
  .message-btn:active {
    background-color: #629eef;
  }
}
</style>

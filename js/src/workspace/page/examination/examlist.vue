<template>
  <div class="flex_column_full_hidden exam">
    <el-tabs class="flex_column_1" v-model="activeName">
      <el-tab-pane label="分检汇总" name="examsummary" v-if="this.$route.query.examType==1">
        <exam-summary :examlist="examList" @quoteAll="quoteAll" @quote="quote" :disabled="disabled" @cancel="cancelExam" :key="random"></exam-summary>
      </el-tab-pane>
      <el-tab-pane label="检查检验项目" name="examlist">
        <!-- 检查检验项目 -->
        <exam-table @checkReport="checkReport" :tableData="tableData"></exam-table>
        <!-- 检查 -->
        <inspect-result @quote="quote" :info="info[0]" v-if="rowData.adviceType==='800'"></inspect-result>
        <!-- 检验 -->
        <exam-result
          @quote="quote"
          :info="info"
          @quoteAll="quote"
          v-if="rowData.adviceType==='801'"
        ></exam-result>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import examapi from '@/workspace/store/examapi'
import ExamTable from './examtable'
import ExamResult from './examresult'
import InspectResult from './inspectresult'
import ExamSummary from './examsummary'
import storage from '@/util/storage'
export default {
  data () {
    return {
      examapi,
      examList: [],
      tableData: [],
      rowData: {},
      info: [],
      disabled: false,
      activeName: 'examlist',
      orderItemId: this.$route.query.orderItemId,
      visitSn: this.$route.query.visitSn,
      random: Math.random()
    }
  },
  created () {
    this.getResult()
    if (this.$route.query.examType === '1') {
      this.getAllResult()
    }
    this.getStatus()
  },
  methods: {
    cancelExam (item) {
      examapi.cancelExamById({
        id: item.id
      }).then(res => {
        if (res) {
          this.random = Math.random()
          this.getAllResult()
        }
      })
    },
    getStatus () {
      examapi.getExamStatus({
        examineSn: this.$route.query.visitSn
      }).then(res => {
        if (res.data.status === 1) {
          this.disabled = true
        } else if (res.data.status === 0) {
          this.disabled = false
        }
      })
    },
    // 检查检验
    getResult () {
      examapi.getByExecVisitSn({
        visitSn: this.$route.query.visitSn,
        examType: Number(this.$route.query.examType),
        patientId: this.$route.query.patientId,
        dptId: this.$route.query.dptId
      }).then(res => {
        this.tableData = res.data
        // 测试数据
        // this.tableData = examapi.tableData
      })
    },
    getAllResult () {
      examapi.getAllResultByVisitSn({
        visitSn: this.visitSn
      }).then(res => {
        // console.log('结果', res)
        // 测试数据
        // this.examList = examapi.examList.data
        // 分检汇总数据
        this.examList = res.data.filter(d => {
          return d.adviceType === '799'
        })

        storage.setLocalStorage('examlist', JSON.stringify(this.examList))
      })
    },
    checkReport (data) {
      this.rowData = data
      examapi.adviceIdAndAdviceType({
        adviceId: data.adviceId, // '6bjiHVAFQyHyvRYqbTF', // data.advice,
        adviceType: data.adviceType
      }).then(res => {
        this.info = res.data
        // 这是一段测试代码
        // switch (data.adviceType) {
        //   case '800':
        //     this.info = examapi.inspectData
        //     break
        //   case '801':
        //     this.info = examapi.examData.data
        // }
      })
    },
    quote (obj) {
      this.$bus.$emit('ref:append', obj)
    },
    quoteAll (obj) {
      this.$bus.$emit('ref:appendAll', obj)
    }
  },
  components: {
    ExamTable,
    ExamResult,
    InspectResult,
    ExamSummary,
  }
}
</script>
<style lang="scss" scoped>
.exam {
  font-size: 14px;
  background: #fff;
  .flex_column_1{
    /deep/.el-tabs__content{
      flex: 1;
      padding: 10px;
      overflow-y: auto;
    }
    /deep/.el-tabs__nav-wrap{
      padding-left: 10px;
    }
  }
}
</style>


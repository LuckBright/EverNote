<template>
  <div class="layout_box" id="sendarea">
    <!-- 操作日志dialog -->
    <operation-log :data="currentHandleObj" :visible.sync="logVisible"></operation-log>
    <!-- 查看报告dialog -->
    <reportcard ref="reportcard" :isPrint="true" :special="true" :append-body="true"></reportcard>
    <!-- 申请单打印组件 -->
    <applyform-print ref="applyformPrint"></applyform-print>
    <el-dialog
      title="停止医嘱"
      :close-on-click-modal='false'
      :visible.sync="stopDialog"
      width="30%">
      <el-form :model="stopObj" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style='width:320px'>
      <el-form-item label="停止时间" prop="time">
         <el-date-picker
          v-model="stopObj.time"
           :clearable='true'
           format='yyyy-MM-dd HH:mm'
          valueFormat='yyyy-MM-dd HH:mm:ss'
          :picker-options="{
            disabledDate:disabledDate,
          }"
          type="datetime">
        </el-date-picker>
      </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stopDialog = false">取 消</el-button>
        <el-button type="primary" @click="stopAdviceDialog" :disabled="!stopObj.time">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import medicalapi from '@/workspace/store/medicalapi'
import recipeapi from '@/workspace/store/recipeapi'
import storage from '@/util/storage'
import operationLog from '@/inpatient/components/medical.orders/operation.log'
import applyformPrint from '@/inpatient/page/advice.manage/applyform.print.dialog'
import reportcard from '@/infusion/components/report.card.vue'
import { singlePrint } from '@/inpatient/components/sendarea.print.js'
import { objFind } from '@/util/common'

export default {
  props: {
    baseInfo: Object,
    sendData: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      medicalapi,
      recipeapi,
      storage,
      currentHandleObj: {},
      loading: false,
      logVisible: false,
      handleVisible: false,
      contextList: [
        {id: 'a', name: '撤回医嘱', disabled: false, methodName: 'removeAdvice'},
        {id: 'b', name: '作废医嘱', disabled: false, methodName: 'invalidAdvice'},
        {id: 'c', name: '停止医嘱', disabled: false, methodName: 'stopAdvice'},
        {id: 'd', name: '查看报告', disabled: false, methodName: 'viewReport'},
        {id: 'e', name: '操作日志', disabled: false, methodName: 'operationLog'},
        {id: 'f', name: '打印申请', disabled: false, methodName: 'printApply'},
      ],
      stopDialog: false,
      stopObj: {
        time: ''
      },
      rules: {
        time: [
            { required: true, message: '请输入停止时间', trigger: 'blur' },
        ],
      },
      ids: null,
      item: {}
    }
  },
  methods: {
    // 右键操作按钮列表触发事件回调
    getMenuList (index, row) {
      this.curRightClickRow = row
      this.contextList.forEach((v) => {
        v.disabled = !this.getStatusShow(this.fuziData[row.mainGroupId], v.id)
      })
      // 审核驳回，添加继续提交操作
      if (String(row.status) === '2' && !this.disabled) {
        if (!objFind(this.contextList, { id: 'g' })) {
          this.contextList.push({id: 'g', name: '继续提交', disabled: false, methodName: 'continueSubmit'})
        }
      } else {
        if (objFind(this.contextList, { id: 'g' })) {
          this.contextList.splice(this.contextList.findIndex(val => { return val.id === 'g' }), 1)
        }
      }
      return this.contextList
    },
    // 操作按钮显示判断逻辑
    getStatusShow (list, id) {
      if (id === 'a') { // 撤回医嘱
        // 待审核医嘱，审核驳回，可撤回
        let n1 = 0
        list.forEach(m => {
          if (['1', '2'].includes(String(m.status))) {
            n1++
          }
        })
        return list.length === n1 && !this.disabled
      } else if (id === 'b') { // 作废医嘱
        // 长期医嘱， 已完成（已执行，已停止） 临时医嘱 执行中  已完成 , 检验 检查 病理 报告已出 可作废
        let n2 = 0
        list.forEach(m => {
          /**
           * 可作废的情况
           * 1.长期 + 执行中
           * 2.临时 + (已完成|执行中）
           * 3.治疗|检查|检验|病理 + 报告已出
           * */
          if (
            (String(m.termType) !== '0' && ['10'].includes(String(m.status))) ||
            (String(m.termType) === '0' && ['5', '10'].includes(String(m.status))) ||
            (['60'].includes(String(m.status)) && ['800', '801', '802', '10003'].includes(m.serviceType))
          ) {
            n2++
          }
        })
        return list.length === n2 && !this.disabled
      } else if (id === 'c') { // 停止医嘱
        let n3 = 0
        // 长期医嘱，且状态为执行中，可停止
        list.forEach(m => {
          if (String(m.termType) !== '0' && String(m.status) === '10') {
            n3++
          }
        })
        return list.length === n3 && !this.disabled
      } else if (id === 'd') { // 查看报告
        // 检验，检查，病理  60 报告已出 已完成 执行中 待停止,可查看报告
        let n5 = 0
        list.forEach(m => {
          if (['5', '60', '10', '11', '12'].includes(String(m.status)) && ['800', '801', '802', '10003'].includes(m.serviceType)) {
            n5++
          }
        })
        return list.length === n5
      } else if (id === 'e') { // 操作日志
        return true
      } else if (id === 'f') { // 打印申请
        let n6 = 0
        list.forEach(m => {
          if (['800', '801', '10003', '802', '2125', '303', '304', '3002'].includes(m.serviceType)) n6++
        })
        return list.length === n6
      } else if (id === 'g') { // 继续提交
        return true && !this.disabled
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect (item, index) {
      if (!this.curRightClickRow) {
        return
      }
      // 作废医嘱操作需要二次确认
      if (['b'].includes(item.id)) {
        this.$confirm(`您即将${item.name.slice(0, 2)}该医嘱，是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this[item.methodName](this.curRightClickRow)
        })
      } else {
        this[item.methodName](this.curRightClickRow)
      }
    },
    // 撤回
    removeAdvice (item) {
      let params = {
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        patientId: this.baseInfo.patientId,
        doctorAdviceIdList: []
      }
      this.fuziData[item.mainGroupId].forEach(val => {
        params.doctorAdviceIdList.push(val.id)
      })
      if (!params.doctorAdviceIdList.length) return false
      this.recipeapi.withdrawInpatientDoctorAdvice(params).then(rs => {
        if (!rs) {
          return false
        }
        this.$emit('cancel', 0)
        this.$messageTips(this, 'success', '医嘱已成功撤回', '成功')
      })
    },
    // 作废
    invalidAdvice (item, index) {
      let params = {
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        patientId: this.baseInfo.patientId,
        doctorAdviceIdList: []
      }
      this.fuziData[item.mainGroupId].forEach(val => {
        params.doctorAdviceIdList.push(val.id)
      })
      if (!params.doctorAdviceIdList.length) return false
      this.recipeapi.invalidInpatientDoctorAdvice(params).then(rs => {
        if (!rs) {
          return false
        }
        this.$emit('cancel', 1)
        this.$messageTips(this, 'success', '医嘱已成功作废', '成功')
      })
    },
    disabledDate (data) {
      let time
      if (Array.isArray(this.item)) {
        this.item.forEach(ele => {
          let tTime = new Date(ele.startTime).valueOf()
          time = !time ? tTime : tTime > time ? tTime : time
        })
      } else {
        time = new Date(this.item.startTime).valueOf()
      }
      return new Date(data).valueOf() < (time - 3600 * 24000)
    },
    getStartSecondTimeStamp (time) {
      return parseInt(new Date(time).valueOf() / 1000) * 1000
    },
    stopAdviceDialog () {
      if (!this.stopObj.time) return
      let stopTime = this.getStartSecondTimeStamp(this.stopObj.time)
      if (Array.isArray(this.item)) {
        let time
        this.item.forEach(ele => {
          let tTime = this.getStartSecondTimeStamp(ele.startTime)
          time = !time ? tTime : tTime > time ? tTime : time
        })
        if (stopTime - time < 0) {
          this.$messageTips(this, 'warning', '停止时间不能超过医嘱开始时间', '提示')
          return
        }
      } else if (stopTime - this.getStartSecondTimeStamp(this.item.startTime) < 0) {
        this.$messageTips(this, 'warning', '停止时间不能超过医嘱开始时间', '提示')
        return
      }
      let postdata = {
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        patientId: this.baseInfo.patientId,
        doctorAdviceIdList: this.ids || [],
        stopTime: stopTime
      }
      if (!postdata.doctorAdviceIdList.length) {
        this.fuziData[this.item.mainGroupId].forEach(val => {
          postdata.doctorAdviceIdList.push(val.id)
        })
      }
      if (!postdata.doctorAdviceIdList.length) return false
      this.recipeapi.stopInpatientDoctorAdvice(postdata).then(rs => {
        if (!rs) {
          return false
        }
        this.$emit('cancel', 1)
        this.$messageTips(this, 'success', '停止医嘱申请已发送成功', '成功')
        this.stopDialog = false
      })
    },
    // 停止
    stopAdvice (item, index, ids) {
      this.stopDialog = true
      this.ids = ids
      this.item = item
      this.$nextTick(_ => {
        this.$refs.ruleForm.resetFields()
        this.stopObj.time = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      })
    },
    // 查看报告
    async viewReport (item) {
      let res = await this.medicalapi.getExecuteIdsByAdviceId({
        doctorAdviceIdList: [item.id]
      })
      item.executeId = res.data && res.data[0] && res.data[0].id || ''
      this.$refs.reportcard.openDialog(item, true)
    },
    // 操作日志
    operationLog (item) {
      this.currentHandleObj = item
      this.logVisible = true
    },
    // 打印申请
    printApply (item, index) {
      let print = this.$refs.applyformPrint.getPrintData([item])
      if (print && print.length) {
        singlePrint(print[0].code, print[0].params)
      }
    },
    // 继续提交
    continueSubmit (item) {
      this.$emit('continueSubmit', this.fuziData[item.mainGroupId])
    }
  },
  components: {
    operationLog,       // 操作日志dialog组件
    reportcard,         // 查看报告dialog组件
    applyformPrint      // 申请单打印组件
  },
  computed: {
    fuziData () {
      let obj = {}
      this.sendData.forEach(item => {
        if (obj[item.mainGroupId]) {
          obj[item.mainGroupId].push(item)
        } else {
          obj[item.mainGroupId] = [item]
        }
      })
      return obj
    }
  },
  watch: {
  }
}
</script>
<style scoped lang="scss">
#sendarea {
  width: 100%;
}
</style>

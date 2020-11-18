<template>
  <el-dialog
  :title="titleData.dptName + ' ' + titleData.docName" 
  :visible.sync="dialogVisible"
  :show-close="false"
  class="ui_dialog_02  spe dpt">
    <div class="border">
      <div class="week_header">
        <div class="inline" style="width: 90px;padding-left: 15px;">周期</div>
        <div class="inline pl10" style="width: 120px;">班次</div>
        <div class="inline" style="width: 120px;" v-if="['OUTPATIENT_DOCTOR', 'INQUIRY_VIDEO', 'INQUIRY_IMAGE_TEXT', 'CONSULT_ON_LINE'].includes(categoryCode)">号别</div>
        <div class="inline" style="width: 120px;">看诊规则</div>
        <div class="inline" style="width: 64px;">操作</div>
      </div>
      <el-form v-for="(item, index) in arrangeTimes" :key="index" ref="form" label-width="80px">
        <div style="line-height: 42px;border-top:1px solid #D0DBE4;">
          <div class="week_container">
            <div style="display:inline-block;width: 100px;text-align: center;" class="mr10">
              <span>{{item.weekDate}}</span>
            </div>
            <div style="display:inline-block;">
              <template v-for="(zitem, zindex) in item.timetrunks">
                <diagnose-rules 
                  v-model="item.tempObj"
                  :service-arr="serviceArr"
                  :list="timeTrunkArr"
                  :category-code="categoryCode"
                  :index="index"
                  :key="zindex"
                  :disabled="!$moment(item.date).isAfter($moment().format('YYYY-MM-DD'), 'day')">
                </diagnose-rules>
              </template>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <el-row class="mt10">
      <el-col :span="24" align="left">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button type="" @click="cancle">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import api from '@/arrange/store/workapi'
import diagnoseRules from './diagnose.rules.vue'
export default {
  props: {
    'titleData': {
      type: Object,
      default: () => {}
    },
    'weeks': {
      type: Array,
      default: () => []
    },
    'categoryCode': {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      api,
      dialogVisible: false,
      visible: false,
      tableData: [],
      timeTrunkArr: [],
      serviceArr: [],
      arrangeTimes: [],
      form: {
        arrangeTime: '',
        timetrunks: [
          {
            tempObj: []
          }
        ]
      }
    }
  },
  watch: {
    'dialogVisible': {
      handler (val) {
        if (!val) this.arrangeTimes = []
      },
      deep: true
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.arrangeTimes = []
      this.weeks.filter((item, index) => {
        this.arrangeTimes.push(Object.assign(JSON.parse(JSON.stringify(this.form)), {
          weekDate: item.weekDate,
          date: item.date
        }))
      })
      this.getTimetrunk(this.categoryCode)
      this.getService()
    },
    getDetail () {
      let params = {
        'categoryCode': this.categoryCode,
        'orgId': this.titleData.orgId,
        'tenantDeptId': this.titleData.dptId,
        'resourceId': this.titleData.doctorId,
        'startDate': this.weeks[0].date,
        'endDate': this.weeks[this.weeks.length - 1].date
      }
      this.api.searchWeekByDept(params).then(rs => { // 科室排班查询
        if (rs.head.errCode === 0) {
          if (rs.data && rs.data.length > 0) {
            this.arrangeTimes = this.arrangeTimes.filter(item => {
              rs.data.filter(zitem => {
                if (zitem.arrangeTime === item.date) {
                  // todo 回显周排班
                  item.tempObj = zitem.timetrunks
                }
              })
              return item
            })
          }
        }
      })
    },
    getTimetrunk (val) {
      this.api.list({
        categoryCode: val
      }).then(rs => {
        if (rs.head.errCode === 0) {
          const checkObj = [{
            id: 'checkId',
            name: '请选择'
          }]
          this.timeTrunkArr = checkObj.concat(rs.data) || []
        }
      })
    },
    getService () {
      let params = {
        'orgId': this.titleData.orgId,
        'doctorId': this.titleData.doctorId,
        'tenantDeptId': this.titleData.dptId,
        'categoryCode': this.categoryCode
      }
      this.api.getService(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.serviceArr = rs.data
          this.getDetail()
        }
      })
    },
    save () {
      // 表单提交
      let tempArr = []
      tempArr = JSON.parse(JSON.stringify(this.arrangeTimes))
      tempArr = tempArr.filter(item => {
        item.arrangeTime = item.date
        if (item.tempObj) {
          item.tempObj.filter(oitem => {
            if (oitem.timetrunkId) {
              let timeObj = {
                timetrunkId: oitem.timetrunkId,
                service: JSON.parse(JSON.stringify(oitem))
              }
              item.timetrunks.push(timeObj)
            }
          })
        }
        item.timetrunks.splice(0, 1)
        return item
      })
      let params = {
        orgId: this.titleData.orgId,
        tenantDeptId: this.titleData.dptId,
        resourceId: this.titleData.resourceId,
        resourceType: this.titleData.resourceType,
        categoryCode: this.categoryCode,
        arrangeTimes: tempArr
      }
      this.$confirm('', '当前操作可能会影响已预约患者, 如仍然操作, 请联系相关工作人员及时告知患者变更情况！', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.createBatch(params).then(rs => {
          if (rs.head.errCode === 0) {
            this.dialogVisible = false
            this.$messageTips(this, 'success', '操作成功！')
            this.$emit('success')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    cancle () {
      this.$confirm('', '您是否确认要取消本次排班?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogVisible = false
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  components: {
    diagnoseRules
  }
}
</script>
<style lang="scss" scoped>
  .dpt /deep/ .el-dialog,{
    background: #FFFFFF;
    border: 1px solid #999999;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,0.35);
    border-radius: 2px;
  }
  .dpt /deep/ .el-dialog__body {
    background: #FFFFFF;
  }
  .week_container{
    flex: 1 1 auto;
    flex-direction: inherit;
    display: flex;
  }
  .inline{
    display: inline-block;
  }
  .week_header {
    line-height:42px;text-align:left;background: #F0F5FA;
  }
  .border{
    border: 1px solid #D0DBE4;
  }
  .border:after{
    content: '';
    height: 1px;  //控制边框宽度
    width: 100%;  //控制边框长度
    position: absolute;
    left: 0px;
    top: auto;
    right: auto;
    bottom: 0px;
    background-color: #eeeeee;
    border: 0px solid transparent;
    border-radius: 0px;
    -webkit-border-radius: 0px;
    transform: scale(0.5);  //缩放宽度，达到0.5px的效果
    -webkit-transform: scale(0.5);
    -moz-transform: scale(0.5);
    -ms-transform: scale(0.5);
    -o-transform: scale(0.5);
    transform-origin: top left;  //定义缩放基点
    -webkit-transform-origin: top left;
    -moz-transform-origin: top left;
    -ms-transform-origin: top left;
    -o-transform-origin: top left;
  }
</style>


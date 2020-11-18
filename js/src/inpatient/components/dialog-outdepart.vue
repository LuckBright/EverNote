<template>
   <el-dialog title="办理入科室" :visible.sync="flag" class="dialog-oudepart ui_dialog_02" id="indepart">
    <span slot="title">
      <strong>办理出科</strong>
    </span>
    <div class="userinfo">
      <el-row>
        <el-col :span='4' class='patientName'>
          <span>{{data.patientName}}</span>
        </el-col>
        <el-col :span='18'>
           <el-row class='detail'>
             <el-col>
              <sys-value type="GBT.2261.1" :code="data.sex"></sys-value>
              {{data.age || '--'}}岁
              NO.{{data.patientId}}
              <span>入院时间：</span> {{data.hospitalizedTime}}
             </el-col>
           </el-row>
           <el-row>
              <el-col>医保信息：无医保</el-col>
           </el-row>
        </el-col>
      </el-row>
    </div>
    <div class='baseinfo'>
      <el-row>
        <el-col :span='12'><label>诊断：</label><span>{{data.diagnosis}}</span></el-col>
        <el-col :span='12'><label>入院科室：</label><span>{{data.providerName}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span='12'><label>责任护士：</label><span>{{data.primaryNurseName}}</span></el-col>
        <el-col :span='12'><label>责任医师：</label><span>{{data.hospitalizedDoctorName}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span='12'><label>住院时间：</label><span>{{data.hosDays || '--'}}天</span></el-col>
        <el-col :span='12'><label>出院情况：</label><span>{{data.outHosStatus}}</span></el-col>
      </el-row>
    </div>
    <div>
     <div v-if="allAdviceList.length > 0">
        <div class='task_title'>未执行医嘱</div>
        <div class='taskTable'>
          <table cellpadding="0" cellspacing="0" class="table-wrap" v-if="allAdviceList.length > 0">
              <thead>
              <tr>
                <th align="center" width="20">
                  <el-checkbox v-model="allSelectSend"></el-checkbox>
                </th>
                <th align="center" width="50">医嘱号</th>
                <th align="center" width="50">类型</th>
                <th align="left" width="200">医嘱名称</th>
                <th align="left" width="240">处置内容</th>
                <th align="left" width="140">开医嘱时间</th>
                <th align="left" width="140">嘱托</th>
              </tr>
              </thead>
              <tbody>

              <tr v-for="(obj, key, i) in dataList" :key ="i">
                <td colspan="8">
                <el-checkbox-group v-model="selectSend">
                  <table width="100%" cellpadding="0" cellspacing="0" class="table-item">
                      <tbody>
                        <tr v-for="(item, j) in obj" :class="{red: item.status === 2, green: item.status === 5}" :key ="j">
                          <td align="center" width="20"><el-checkbox class="hidetext2" :label="key" v-if="j===0"></el-checkbox></td>
                          <td align="center" width="50" class="line" :class="{noline: j===obj.length-1}">
                            <el-tooltip class="item" effect="dark" :content="item.id? item.id : ''" placement="bottom-start">
                              <span style="display:inline-block;width:50px;white-space: nowrap;text-overflow:ellipsis;overflow: hidden;">{{item.id}}</span>
                             </el-tooltip>
                          </td>
                          <td align="center" width="50" class="line" :class="{noline: j===obj.length-1}"><sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="item.adviceType"></sys-value></td>

                          <td align="left" width="200" class="line" :class="{noline: j===obj.length-1}">
                            <div v-if="obj.length > 1" style='width:200px;'>
                              <span v-if="j===0">┏</span>
                              <span v-if="j===obj.length-1">┗</span>
                              <span v-if="j > 0 && j < obj.length-1">┣</span>
                              <el-tooltip class="item" effect="dark" :content="item.adviceName? item.adviceName : ''" placement="bottom-start">
                                <span>{{item.adviceName}}</span>
                              </el-tooltip>
                            </div>
                            <div v-else style='width:200px;'>
                              <template v-if="item.adviceType === '303' || item.adviceType === '304'">
                                <el-row :gutter="10">
                                  <el-col :span="8" v-for="(drag, k) in JSON.parse(item.adviceContent, true)" :key="k">
                                    <el-tooltip class="item" effect="dark" :content="drag? drag.serviceItem.name : ''" placement="bottom-start">
                                      <label>{{drag.serviceItem.name}}/</label>
                                      <label>{{drag.amount}}</label>
                                      <label>{{drag.serviceItem.unitName}}</label>
                                      <label style="font-size:12px;position:relative;top:-5px;"><sys-value type="THC_SYS_DECOCTINGMETHOD" :code="drag.footnote"></sys-value></label>
                                    </el-tooltip>
                                  </el-col>
                                </el-row>
                              </template>
                              <label v-else  style='width:200px;white-space: nowrap;text-overflow:ellipsis;overflow: hidden;'>
                                <el-tooltip class="item" effect="dark" :content="item.adviceName? item.adviceName : ''" placement="bottom-start">
                                <span>{{item.adviceName}}</span>
                                </el-tooltip>
                              </label>
                            </div>
                          </td>
                          <td align="left" width="240" class="line" :class="{noline: j===obj.length-1}">
                            <el-row v-if="item.adviceType === '800'">
                              <el-col :span="12" v-if="JSON.parse(item.adviceContent).meridian">检查部位：{{JSON.parse(item.adviceContent).meridian}}</el-col>
                              <el-col :span="12" v-if="JSON.parse(item.adviceContent).illHis">病史摘要：{{JSON.parse(item.adviceContent).illHis}}</el-col>
                              <el-col :span="12" v-if="JSON.parse(item.adviceContent).examineTarget">临床检查：{{JSON.parse(item.adviceContent).examineTarget}}</el-col>
                              <el-col :span="12" v-if="JSON.parse(item.adviceContent).assistExamine">辅助检查：{{JSON.parse(item.adviceContent).assistExamine}}</el-col>
                              <el-col :span="12" v-if="JSON.parse(item.adviceContent).otherExamine">检查结果：{{JSON.parse(item.adviceContent).otherExamine}}</el-col>
                            </el-row>
                            <el-row v-if="item.adviceType === '2125'">
                              <el-col :span="24" v-if="JSON.parse(item.adviceContent).doctorItem.length">手术医生：<label :key="d" v-for="doctor, d in JSON.parse(item.adviceContent).doctorItem">{{doctor.doctorName}} </label></el-col>
                              <el-col :span="24" v-if="JSON.parse(item.adviceContent).assistantItem.length">助理医生：<label :key="d" v-for="doctor, d in JSON.parse(item.adviceContent).assistantItem">{{doctor.doctorName}} </label></el-col>
                              <el-col :span="24" v-if="JSON.parse(item.adviceContent).surgeryFreq">手术名称：{{JSON.parse(item.adviceContent).surgeryFreq.name}}</el-col>
                              <el-col :span="24" v-if="JSON.parse(item.adviceContent).position">手术部位：{{JSON.parse(item.adviceContent).position.position}}</el-col>
                              <el-col :span="24" v-if="JSON.parse(item.adviceContent).anaesthesia.name">麻醉方式：{{JSON.parse(item.adviceContent).anaesthesia.name}}</el-col>
                            </el-row>
                            <label v-if="item.adviceType !== '800' && item.adviceType !== '2125'">{{item.disposeContent}}</label>
                          </td>
                          <td align="left" width="140" class="line" :class="{noline: j===obj.length-1}">
                            <div>{{$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') || '--'}}</div>
                          </td>
                          <td align="left" width="140" class="line" :class="{noline: j===obj.length-1}">
                            <el-tooltip class="item" effect="dark" :content="item.entrust? item.entrust : ''" placement="bottom-start">
                            <div class="ellipsis" style="width: 140px">{{item.entrust}}</div>
                            </el-tooltip>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                </el-checkbox-group>
                </td>
              </tr>
              </tbody>
            </table>
        </div>
        <div class='doTask'  v-if="allAdviceList.length > 0">
            <el-button type="primary" @click="doTask()"  v-ever-click-once="isDisabled" :disabled="isDisabled">执行</el-button>
        </div>
      </div>
      <div v-if="!allAdviceList && allAdviceList.length == 0"></div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="afterSelect()"  v-ever-click-once="disabled"  :disabled="disabled">确认出科</el-button>
    </div>
   </el-dialog>
</template>
<script>
  import api from '../store/outdepartapi'
  import storage from '@/util/storage'
  export default {
    props: ['visible', 'userinfo'],
    data () {
      return {
        disabled: false,
        isDisabled: false,
        api,
        query: this.$route.query,
        flag: false,
        allSelectSend: false,
        data: {},
        selectSend: [],
        sendData: [],
        tableData: [],
        multipleSelection: [],
        allAdviceList: [],
        dataList: {},
        dataBack: [],
        storage
      }
    },
    watch: {
      'visible' (val) {
        if (val) {
          this.setData()
          this.getExcuteByPatientId(this.query.patientId)
        }
        this.flag = val
      },
      'flag' (val) {
        this.$emit('update:visible', val)
      },
       // 监听全部区域里的医嘱数据源，如果发生改变重新分组
      'allAdviceList' (val) {
        this.setGroupList()
      },
       // 监听待发送区域医嘱的选中状态
      'selectSend' (val) {
        this.sendData = []
        val.map((v, index) => {
          this.sendData.push({
            'orderId': v,
            'patientId': this.query.patientId,
            'hospitalizedNumber': this.query.hospitalizedNumber
          })
        })
        // this.sendData = []
        if (val.length === Object.keys(this.dataList).length) {
          this.allSelectSend = true
        }
        if (val.length === 0) {
          this.allSelectSend = false
        }
      },
      // 监听是否为全部选择
      'allSelectSend' (val) {
        if (val) {
          this.setChecked()
        } else {
          this.selectSend = []
        }
      }
    },
    created () {
    },
    methods: {
      doTask () {
        if (this.sendData.length === 0) {
          this.$notify({
            title: '提示',
            type: 'info',
            message: '请先选择可执行的医嘱'
          })
        } else {
          this.executeTask({executeArr: this.sendData})
        }
      },
      executeTask (param) {
        this.api.executeTask(param).then(rs => {
          if (rs.head.errCode === 0) {
            this.$notify({
              title: '成功',
              type: 'success',
              message: '医嘱执行成功'
            })
            this.getExcuteByPatientId(this.query.patientId)
          }
        })
      },
      setChecked () {
        this.selectSend = []
        for (let key in this.dataList) {
          this.selectSend.push(key)
        }
      },
      close () {
        this.flag = false
      },
      setData () {
        let params = {
          hospitalizedNumber: this.$route.query.hospitalizedNumber,
          orderId: this.$route.query.orderId
        }
        this.api.getOutProvider(params).then(rs => {
          this.data = rs.data
        })
      },
      afterSelect () {
        let params = {
          processData: {
            taskId: this.query.taskId
          },
          businessData: {
            hospitalizedNumber: this.query.hospitalizedNumber,
            orderId: this.query.orderId,
            patientId: this.query.patientId,
            providerId: this.query.providerId
          }
        }
        this.api.doTask(params).then(rs => {
          if (rs.head.errCode === 0) {
            this.$notify({
              title: '成功',
              type: 'success',
              message: '已成功办理出科'
            })
            this.close()
            this.$router.push({path: '/inpatient/task'})
          }
        })
      },
      getExcuteByPatientId (id) {
        this.api.getExcuteByPatientId({patientId: id}).then(rs => {
          if (rs && rs.list) {
            this.allAdviceList = rs.list
            this.dataBack = JSON.parse(JSON.stringify(rs), true)
          } else if (rs && rs.data) {
            this.allAdviceList = rs.data
          }
        })
      },
       // 获取医嘱对应的订单编号集合
      getOrderIds (flag) {
        let ids = []
        this.dataList[flag].map(v => {
          ids.push(v.orderId)
        })
        return ids
      },
      // 根据医嘱ID分组
      setGroupList () {
        let obj = {}
        if (!this.allAdviceList[0]) {
          return []
        }
        this.allAdviceList.map(v => {
          if (obj[v.orderId]) {
            obj[v.orderId].push(v)
          } else {
            obj[v.orderId] = [v]
          }
        })
        this.dataList = obj
      }
    }
  }
</script>
<style scoped>
.dialog-oudepart .userinfo{border-radius: 4px; background: #f4f4f4;}
.dialog-oudepart .userinfo > .el-row{margin-bottom: 20px;padding:10px;}
.dialog-oudepart .userinfo .patientName{font-size:20px;font-weight:700;height:60px;line-height:60px;}
.dialog-oudepart .userinfo .patientName span{margin-right:20px;display: inline-block;width:90%;height:30px;line-height:30px;border-right:1px solid #dddddd;}
.baseinfo{line-height: 2}
.dialog-oudepart .baseinfo{padding-bottom:10px; }
.dialog-oudepart .baseinfo .el-col{color:#999999;}
.dialog-oudepart .baseinfo .el-col span{color:#000;}
.dialog-oudepart .baseinfo .el-col label{display: inline-block; width: 80px;text-align: right; }
.dialog-oudepart .userinfo .detail > .el-col{height:40px;line-height:40px;}
#indepart .table-wrap{font-size: 14px;border:1px solid #ddd; }
#indepart .table-wrap > tbody > tr:nth-child(even) > td{background: #f8f8f8;}
#indepart .table-wrap thead tr th{background: #f4f4f4;padding: 7px 6px;line-height: 24px;}
#indepart .table-item tr td{line-height:24px; padding: 7px 6px; vertical-align: middle; font-size:10px;}
#indepart .table-item tr td div {white-space: nowrap;text-overflow:ellipsis;overflow: hidden;line-height: 24px;min-height: 24px;}
#indepart  .taskTable {height:230px;overflow-y:auto;margin-top:15px;}
#indepart  table /deep/ .el-checkbox__label{display: none;}
#indepart  .doTask{margin:15px;}
#indepart  .doTask .el-button{float: right;}
#indepart  .task_title {font-size:16px;font-weight:700;margin:10px 0;}
@media screen and (max-width:1599px){
 #indepart .table-wrap {width:940px;}
}
</style>


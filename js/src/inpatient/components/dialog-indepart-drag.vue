<template>
  <!-- v-if="indepartObj && indepartObj.taskId" -->
  <el-dialog
  :visible.sync="flag"
  id='dialog_indepart'
  width="500px">
    <span slot="title">
      <strong>患者入科</strong>
    </span>
    <el-row class="userinfo clearfix">
      <el-col :span='4' class="lable">姓名：</el-col>
      <el-col :span='4' class="ellipsis">{{data.patient.name}}</el-col>
      <el-col :span='4' class="lable">性别：</el-col>
      <el-col :span='4'>{{data.patient.sex | formatSex}}</el-col>
      <el-col :span='4' class="lable">年龄：</el-col>
      <el-col :span='4'>{{data.patient.age}}岁</el-col>
      <el-col :span='4' class="lable">主身份：</el-col>
      <el-col :span='4' v-if='obj.memberLevels && obj.memberLevels.id'>会员</el-col>
      <el-col :span='4' v-else>非会员</el-col>
      <el-col :span='4' class="lable">保险信息：</el-col>
      <el-col :span='4' v-if='shangbao && shangbao.length > 0'>
        <el-dropdown @command="handleCommand" class="ellipsis" style='width:57px;'>
            <span class="el-dropdown-link">
              {{shangbaoItem.insurerName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in shangbao" :key='item.insurerId' :command='index'>{{item.insurerName}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-tooltip class="item" effect="light" placement="bottom-end">
            <i style='color: #BBBBBB;font-size:16px;' class="iconfont icon-zhuyuan-yizhu-shuomi"></i>
            <span slot="content">
              保险卡编号：<br/>{{shangbaoItem.policyNum}}<br/> 保险有效期：
              <br/>{{shangbaoItem.startTime | formatDateByExp('YYYY/MM/DD')}}-{{shangbaoItem.endTime | formatDateByExp('YYYY/MM/DD')}}<br/> 福利：{{shangbaoItem.welfare}}
            </span>
          </el-tooltip>
      </el-col>
      <el-col :span='4' v-else>--</el-col>
      <el-col :span='4' class="lable">床位：</el-col>
      <el-col :span='4' class="ellipsis">{{data2.hospitalizedBedName}}</el-col>
    </el-row>
    <el-form label-width="90px" :model="indepartFormObj" :rules="rules" ref="indepartForm">
      <el-row>
          <el-form-item label="主治医生(二级医生)" prop="hospitalizeddoctorItem">
            <div slot='label' style='lineHeight:18px'>
              主治医生<br/>
              <span style='fontSize:12px'>(二级医生)</span>
            </div>
            <el-select filterable clearable placeholder="请选择" class="wb100" v-model="indepartFormObj.hospitalizeddoctorItem" value-key="doctorId">
              <el-option
                v-for="item in doctorIdOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
      </el-row>
      <el-row>
          <el-form-item label="住院医生" prop="doctorassistantItem">
            <el-select filterable clearable placeholder="请选择" class="wb100" v-model="indepartFormObj.doctorassistantItem" value-key="doctorId">
              <el-option
                v-for="item in doctorIdOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
      </el-row>
      <el-row>
          <el-form-item  label="责任护士" prop="primaryNurseObj">
            <el-select filterable clearable placeholder="请选择" class="wb100" v-model="indepartFormObj.primaryNurseObj" value-key="id">
              <el-option
                v-for="item in primaryNurseIdOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
      </el-row>
      <el-row>
          <el-form-item  label="接诊护士" prop="receptionNurseItem">
            <el-select filterable clearable placeholder="请选择" class="wb100" v-model="indepartFormObj.receptionNurseItem" value-key="id">
              <el-option
                v-for="item in primaryNurseIdOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
      </el-row>
      <el-form-item label="打印" prop="">
        <el-checkbox v-model="indepartFormObj.bedCard" style="line-height:40px!important;">床头卡打印</el-checkbox>
        <el-checkbox v-model="indepartFormObj.wristCard" style="line-height:40px!important;">腕带打印</el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="close">取消</el-button>
      <el-button type="primary" @click="doEntryProvider" v-ever-click-once="disabled" :disabled="disabled">确认</el-button>
    </div>
    <print-wrap v-show="false" id="wristbandPrint" v-if="wristbandConfig && wristbandConfig.length && wristbandData" v-model="wristbandData" :settings="wristbandConfig" :type="1"></print-wrap>
  </el-dialog>
</template>

<script>
  import api from '@/inpatient/store/resident'
  import { mutiplePrint } from '@/inpatient/components/sendarea.print.js'
  // import wristbandApi from '@/sob/store/wristband'
  import PrintWrap from '@/sob/page/wristband/common/print.wrap'
import inhospital from '@/workspace/store/inhospital'
  export default {
    props: [],
    data () {
      return {
        data: {
          patient: {}
        },
        data2: {},
        disabled: false,
        flag: false,
        doctorIdOptions: [], // 医生
        primaryNurseIdOptions: [], // 责任护士
        indepartFormObj: {
          hospitalizeddoctorItem: null,
          doctorassistantItem: null,
          primaryNurseObj: null,
          receptionNurseItem: null
        },
        rules: {
          hospitalizeddoctorItem: [
            { required: true, message: '请选择主治医生', trigger: 'change', type: 'string' }
          ],
          doctorassistantItem: [
            { required: true, message: '请选择住院医生', trigger: 'change', type: 'string' }
          ],
          primaryNurseObj: [
            { required: true, message: '请选择责任护士', trigger: 'change', type: 'string' }
          ],
          receptionNurseItem: [
            { required: true, message: '请选择接诊护士', trigger: 'change', type: 'string' }
          ]
        },
        wristbandConfig: [],
        wristbandData: null,
        obj: {},
        shangbao: [],
        shangbaoItem: {}
      }
    },
    components: {
      PrintWrap
    },
    mounted () {
      // this.getWristbandConfig(0)
      this.$bus.$on('dialog:indepartDrag', this.open)
    },
    methods: {
      handleCommand (item) {
        this.shangbaoItem = this.shangbao[item]
      },
      async getDoctorsAndNursers (relationType, staffType, relationId, cb) { // 获取医生/护士列表
        let arr = []
        let rs = await inhospital.getStaffRecordVoListForService({
          relationType: relationType,
          relationId: relationId,
          staffType: staffType + ''
        })
        if (rs && rs.data[0]) {
          let obj = {}
          rs.data.map(v => {
            obj.id = v.id
            obj.name = v.name
            arr.push(obj)
            obj = []
          })
        }
        cb(arr)
      },
      async getWristbandConfig (type) {
        // const res = await wristbandApi.getConfig({isNewborn: type, visitType: 2})
        // if (res && res.data && res.data.length) {
        //   if (res.data[0] && res.data[0].content) {
        //     this.wristbandConfig = JSON.parse(res.data[0].content)
        //   }
        // }
      },
      async createWristband (done) {

      },
      async doEntryProvider () {
        this.$refs.indepartForm.validate(async(valid) => {
          if (valid) {
            // api
            // this.flag = false
            // this.$emit('success')
            // return
            var liuchengData = {
              patientId: this.data.patientId, //
              hospitalizedNumber: this.data.hospitalizedNumber, // string 是 住院号

              chiefDoctorId: this.indepartFormObj.hospitalizeddoctorItem, //
              chiefDoctorName: '', //
              hospitalizedDoctorId: this.indepartFormObj.doctorassistantItem, //
              hospitalizedDoctorName: '', //
              primaryNurseId: this.indepartFormObj.primaryNurseObj, //
              primaryNurseName: '', //

              receptionNurseId: this.indepartFormObj.receptionNurseItem, //
              receptionNurseName: '', //

              hospitalizedWardId: this.data2.hospitalizedWardId, // string 是 病房id
              hospitalizedWardName: this.data2.hospitalizedWardName, // string 是 病房名称
              hospitalizedBedId: this.data2.hospitalizedBedId, // string 是 病床id
              hospitalizedBedName: this.data2.hospitalizedBedName // string 是 病床名称
            }
            this.doctorIdOptions.forEach((val) => {
              if (val.id === liuchengData.chiefDoctorId) {
                liuchengData.chiefDoctorName = val.name
              }
              if (val.id === liuchengData.hospitalizedDoctorId) {
                liuchengData.hospitalizedDoctorName = val.name
              }
            })
            this.primaryNurseIdOptions.forEach((val) => {
              if (val.id === liuchengData.primaryNurseId) {
                liuchengData.primaryNurseName = val.name
              }
              if (val.id === liuchengData.receptionNurseId) {
                liuchengData.receptionNurseName = val.name
              }
            })
            let result = await api.hospitalizedEntranceMsgCreate(liuchengData).catch((e) => { })
            if (result) {
              this.$notify({
                title: '成功',
                type: 'success',
                message: '分床成功'
              })
              this.flag = false
              let arr = []
              if (this.indepartFormObj.bedCard) {
                arr.push({
                  code: 'ZY_CPOE_CHUANG_TOU_KA',
                  params: {
                    patientId: this.data.patientId,
                    hospitalizedNumber: this.data.hospitalizedNumber
                  }
                }) // 床头卡 只需要患者id
              }
              if (this.indepartFormObj.wristCard) {
                arr.push({
                  code: 'ZY_CPOE_CHENG_REN_WAN_DAI',
                  params: {
                    patientId: this.data.patientId,
                    visitType: 2,
                    hospitalizedNumber: this.data.hospitalizedNumber
                  }
                }) // 床头卡 只需要患者id
              }
              if (arr.length > 0) mutiplePrint(arr)
              this.$emit('success')
            } else {
              this.$notify({
                type: 'warning',
                message: result.head.errMsg
              })
            }
          }
        })
      },
      open (data, data2) { // data为患者信息  data2为床位信息
        if (data) {
          this.flag = true
          this.data = data
          this.data2 = data2
          this.dataReShow()
          this.getDoctorsAndNursers(401, 39, this.data.providerId, (arr) => { // 医生
            this.doctorIdOptions = arr
            if (data.chiefDoctorId) this.indepartFormObj.hospitalizeddoctorItem = data.chiefDoctorId // 主治医生
            if (data.hospitalizedDoctorId) this.indepartFormObj.doctorassistantItem = data.hospitalizedDoctorId // 住院医生
          })
          this.getDoctorsAndNursers(402, 40, this.data.hospitalizedAreaId, (arr) => {  // 护士
            this.primaryNurseIdOptions = arr
          })
          setTimeout(() => {
            this.$refs.indepartForm.resetFields()
          })
        }
      },
      close () {
        this.flag = false
        this.$refs.indepartForm.resetFields()
      },
      async dataReShow () { // 入科信息回显
        console.log(this.data)
        let res = await api.getAppliance2Entrance({
          hospitalizedNumber: this.data.hospitalizedNumber,
          patientId: this.data.patientId
        })
        this.obj = res.data
        this.shangbao = this.obj.patient.busiInsurs || [] // 处理商保信息
        this.shangbaoItem = this.shangbao[0] || {} // 处理商保信息
      }
    },
    computed: {

    },
    watch: {

    }
  }
</script>
<style lang='scss' scoped>
  #dialog_indepart {
    .userinfo{
      width: 470px;
      margin:0 auto;
      padding: 4px 15px;
      background: #f4f4f4;
      margin-bottom: 15px;
      .lable{
        text-align: right;
      }
      div {
        float: left;
        font-size: 14px;
        line-height: 25px;
        color: #000;
      }
    }
    .wb100{
      width: 100%;
    }
    // .el-select{
    //   width: 323px;
    // }
    .el-form-item__label{
      display: inline;
      line-height:40px!important;
    }
    .el-dialog__body{
      padding-bottom:0px!important;
    }
  }
</style>


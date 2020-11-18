<template>
  <div class="layout_inner oa">
    <ever-bread-crumb :path="resPath"></ever-bread-crumb>
    <div class=" min-high pos_re text-detail">
      <div class='patient-info'>
        <span class='label-info'>患者信息：</span>
        <span class='value-info'>{{userInfo.patientName}}</span>
        <span class='label-info'>接诊医生：</span>
        <span class='value-info'>{{userInfo.doctorName}}</span>
        <span class='label-info'>机构名称：</span>
        <span class='value-info'>{{userInfo.organName}}</span>
        <span class='label-info'>问诊时间：</span>
        <span class='value-info'>{{userInfo.dateStr}}</span>
        <p style='line-height: 20px'>
          <span class='label-info'>病情描述：</span>
          <span class='value-info' style='line-height: 20px;'>{{userInfo.patientRemark}}</span>
        </p>
        <p>
          <span v-for='(item, index) in srcList' :key='index' style='margin-right: 10px'>
            <el-image
              style="width: 100px; height: 160px"
              :src="srcList[index]"
              :preview-src-list="srcList">
            </el-image>
          </span>
        </p>
      </div>
      <div class='adopt-info'>
        <span class='label-info'>接诊医生：</span>
        <span class='value-info'>{{userInfo.doctorName}}</span>
        <span class='label-info'>机构名称：</span>
        <span class='value-info'>{{userInfo.organName}}</span>
        <span class='label-info'>接诊时间：</span>
        <span class='value-info'>{{userInfo.receptionTime ? $moment(userInfo.receptionTime).format('YYYY-MM-DD HH:mm') : '--'}}</span>
        <span class='label-info'>结诊时间：</span>
        <span class='value-info'>{{userInfo.visitEndTime ? $moment(userInfo.visitEndTime).format('YYYY-MM-DD HH:mm') : '--'}}</span>
        <div style='margin-top: 10px'>
          <span class='label-info'>诊断名称：</span>
          <span class='value-info'>{{mainDiagnoses.diseaseName ? mainDiagnoses.diseaseName : '--'}}</span>
          <span class='label-info'>诊断时间：</span>
          <span class="value-info">{{mainDiagnoses.createTime }}</span>
          <span class='value-info'>{{mainDiagnoses.createTime ? mainDiagnoses.toTimeText : '--'}}</span>
          <span class='label-info' v-if="isOrderDetails">拒绝时间：</span>
          <span class='value-info' v-if="isOrderDetails">{{userInfo.cancelTime ? userInfo.cancelTime : '--'}}</span>
          <span class='label-info' v-if="isOrderDetails">拒绝原因：</span>
          <span class='value-info' v-if="isOrderDetails">{{userInfo.cancelReason ? userInfo.cancelReason : '--'}}</span>
        </div>
      </div>
      <div>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="医嘱" name="first" v-if="visitType != 7">
            <doctor-enjoin @address='getAddress' v-if="activeName==='first'"></doctor-enjoin>
          </el-tab-pane>
          <el-tab-pane label="病历" name="second" v-if="visitType != 7">
            <medical-record :values='medicalValues' v-if="activeName==='second'"></medical-record>
          </el-tab-pane>
          <el-tab-pane label="问诊记录" name="third">
            <teletext-details v-if="activeName==='third' || visitType === 7" style="width:425px"></teletext-details>
          </el-tab-pane>
<!--          <el-tab-pane label="物流状态" name="fourth">-->
<!--            <template v-if="activeName==='fourth'">-->
<!--              <div v-for='(item, index) in addressList' :key='index'>-->
<!--                <div v-if='item.name'>-->
<!--                  <receiving-address-->
<!--                    :showexpress='true'-->
<!--                    :values='item'-->
<!--                    :list='item.list'-->
<!--                    ></receiving-address>-->
<!--                </div>-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-tab-pane>-->
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import receivingAddress from '../receiving.address'
import doctorEnjoin from '@/titancare/views/settlement/page/teletext/doctor.enjoin'
import medicalRecord from './medical.record'
import teletextDetails from './snapshot/pages/index'
import api from '@/titancare/api/operation'
export default {
  components: {
    receivingAddress,
    doctorEnjoin,
    medicalRecord,
    teletextDetails
  },
  data () {
    const visitType = parseInt(this.$route.query.visitType)
    return {
      visitType: visitType,
      activeName: visitType === 7 ? 'third' : 'first',
      addressDetails: [],
      addressList: [],
      userInfo: {},
      srcList: [],
      mainDiagnoses: {},
      api,
      medicalValues: {},
      resPath: ''
    }
  },
  mounted () {
    if (this.$route.name === 'ihdetail') {
      this.resPath = '/ihsystem/ihlist'
    }
    let visitNumber = this.$route.query.visitNumber
    let visitType = parseInt(this.$route.query.visitType)
    let orgId = this.$route.query.orgId
    api.getOrderInfo({ visitType, visitNumber }).then(rs => {
      this.userInfo = rs.data
      if (this.userInfo.cancelTime) {
        this.userInfo.cancelTime = this.$moment(this.userInfo.cancelTime).format('YYYY-MM-DD')
      }
      this.getUrl(visitNumber, visitType, orgId)
    })
  },
  computed: {
    isOrderDetails () {
      return this.$route.path === '/titancare/operation/teletext1/teletextdetails'
    }
  },
  methods: {
    getUrl (visitNumber, visitType, orgId) {
      /**
       * 查询图片路径
       */
      api.getFileUrl().then(rs => {
        if (!rs.errCode) {
          let images = this.userInfo.images ? this.userInfo.images.split(',') : []
          images.forEach(item => {
            this.srcList.push(rs.data + item)
          })
        }
      })
      /**
       * 获取诊断信息
       * rowValue.visitNumber
       */
      api.getMedicalRecordByVisitNumber({ 'visitNumbers': [ visitNumber ] }).then(res => {
        if (!res.errCode && res.data) {
          let diseaseName = ''
          let createTime = res.data.createTime
          res.data.diagnoseList.forEach(items => {
            diseaseName += diseaseName ? '/' + items.diagnose.diseaseName : items.diagnose.diseaseName
          })
          this.mainDiagnoses = { diseaseName, createTime }
        }
      })

      /**
       * 获取病历
       */

      let params = {
        data: {
          visitNumber
        },
        config: { 'x-org-id': orgId }
      }
      api.getByCodeAndVisitId(params).then(rs => {
        if (!rs.errCode && rs.data) {
          let allergens = []
          if (rs.data.allergicHistory) {
            rs.data.allergicHistory.guomin.forEach(items => {
              let text = ''
              items.allergen.forEach(item => {
                text += '  ' + item.name
              })
              allergens.push(text)
            })
          }
          let diagnoses = []
          /*
          (rs.data.diagnoseList || []).forEach(items => {
            let text = items.diagnose.diseaseName + ' -- 诊断备注：' + (items.diagnoseDetail ? items.diagnoseDetail : '')
            diagnoses.push(text)
          })
          */
          this.medicalValues = rs.data
          this.medicalValues.arrergen = allergens
          this.medicalValues.diagnose = diagnoses
        }
      })
    },
    getAddress (val) {
      this.addressList = val
    }
  }
}
</script>
<style lang='less' scoped>
.text-detail{
  padding: 20px;
  font-size: 14px;
  line-height: 14px;
  .topClose{
    color: #666;
    margin: 0;
    span{
      cursor: pointer;
    }
    &:hover{
      color: #1c7bef;
    }
  }
  .patient-info{
    border-bottom: 1px solid #ddd;
  }
  .adopt-info {
    margin: 15px 0;
    padding: 10px;
    background: #F0F5FA;
  }
  .label-info{
    color: #999;
  }
  .value-info{
    color: #333;
    margin-right: 20px;
  }
  .tip{
    border-top: 1px dotted #ddd;
    margin-top: 20px;
  }
  .tip-btn{
    width: 92px;
    height: 24px;
    line-height: 3px;
    font-size: 12px;
    color: #1c7bef;
    background: #fff;
    border: 1px solid #1c7bef;
    border-radius: 2px;
    margin-top: 3px;
  }
}
</style>

<template>
  <div>
    <ever-bread-crumb name="订单详情" is-custom-back @back="close"></ever-bread-crumb>
    <!-- <p class="title">订单详情</p> -->
    <div class="layout_inner container1">
      <!-- <p class="topClose">
        <span @click="close">&lt;&nbsp;&nbsp;返回</span>
      </p> -->
      <div class="patient-info">
        <span class="label-info">患者信息：</span>
        <span
          class="value-info"
        >{{patientInfo.name}} {{patientInfo.ageShowText}} {{patientInfo.sex === 1?'男':'女'}}</span>
        <span class="label-info">接诊医生：</span>
        <span class="value-info">{{serviceItem.doctorName}}</span>
        <span class="label-info">机构名称：</span>
        <span class="value-info">{{serviceItem.orgName}}</span>
        <span class="label-info">问诊时间：</span>
        <span class="value-info">{{userInfo.createTime}}</span>
        <p style="line-height: 20px">
          <span class="label-info">病情描述：</span>
          <span class="value-info" style="line-height: 20px;">{{userInfo.question}}</span>
        </p>
        <p>
          <span v-for="(item, index) in srcList" :key="index" style="margin-right: 10px">
            <el-image
              style="width: 100px; height: 160px"
              :src="srcList[index]"
              :preview-src-list="srcList"
            ></el-image>
          </span>
        </p>
      </div>
      <div class="adopt-info">
        <span class="label-info">接诊医生：</span>
        <span class="value-info">{{serviceItem.doctorName}}</span>
        <span class="label-info">机构名称：</span>
        <span class="value-info">{{serviceItem.orgName}}</span>
        <span class="label-info">接诊时间：</span>
        <span class="value-info">{{userInfo.answerTime ? userInfo.answerTime : '--'}}</span>
        <span class="label-info">结诊时间：</span>
        <span class="value-info">{{userInfo.finishTime ? userInfo.finishTime : '--'}}</span>
        <div style="margin-top: 10px">
          <span class="label-info">诊断名称：</span>
          <span class="value-info">{{mainDiagnoses.diseaseName ? mainDiagnoses.diseaseName : '--'}}</span>
          <span class="label-info">诊断时间：</span>
          <span class="value-info">{{mainDiagnoses.createTime ? mainDiagnoses.createTime : '--'}}</span>
        </div>
      </div>
      <div>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="医嘱" name="first">
            <doctor-enjoin @address="getAddress"></doctor-enjoin>
          </el-tab-pane>
          <el-tab-pane label="病历" name="second">
            <medical-record :values="medicalValues"></medical-record>
          </el-tab-pane>
          <el-tab-pane label="问诊记录" name="third">
            <div style="width: 50%">
              <teletext-details></teletext-details>
            </div>
          </el-tab-pane>
<!--          <el-tab-pane label="物流状态" name="fourth">-->
<!--            <div v-for="(item, index) in addressList" :key="index">-->
<!--              <div v-if="item.name">-->
<!--                <receiving-address-->
<!--                  :showexpress="true"-->
<!--                  :values="item"-->
<!--                  :list="item.list"-->
<!--                ></receiving-address>-->
<!--              </div>-->
<!--            </div>-->
<!--          </el-tab-pane>-->
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import receivingAddress from './receiving.address'
import doctorEnjoin from './doctor.enjoin'
import medicalRecord from '@/titancare/views/operationmanage/teletext/medical.record.vue'
import teletextDetails from './snapshot/pages/index'
import storage from '@/util/storage'
import api from '@/titancare/api/orderdetail/index.js'
export default {
  components: {
    receivingAddress,
    doctorEnjoin,
    medicalRecord,
    teletextDetails
  },
  data () {
    return {
      activeName: 'first',
      addressDetails: [],
      addressList: [],
      userInfo: {},
      srcList: [],
      mainDiagnoses: {},
      api,
      storage,
      medicalValues: {},
      patientInfo: {},
      serviceItem: {}
    }
  },
  mounted () {
    let params = JSON.parse(this.$route.query[0]).row
    this.userInfo = params
    this.patientInfo = JSON.parse(this.userInfo.patientInfo)
    this.serviceItem = JSON.parse(this.userInfo.serviceItem)
    this.getUrl(params)
  },
  methods: {
    close () {
      let params = JSON.parse(this.$route.query[0]).params.param
      this.$router.push({ name: 'refund', query: {queryobj: JSON.stringify(params)} })
    },
    getUrl (rowValue) {
      /**
       * 查询图片路径
       */
      api.getFileUrl().then(rs => {
        let images = this.userInfo.images ? this.userInfo.images.split(',') : []
        images.forEach(item => {
          this.srcList.push(rs + item)
        })
      })

      /**
       * 获取诊断信息
       * rowValue.visitNumber
       */
      this.mainDiagnoses = {}
      api.getMedicalRecordByVisitNumber({ 'visitNumbers': [rowValue.visitNumber] }).then(res => {
        if (res && res.diagnoseList && res.diagnoseList.length) {
          let diseaseName = ''
          let createTime = res.createTime
          res.diagnoseList.forEach(items => {
            diseaseName += diseaseName ? '/' + items.diagnose.diseaseName : items.diagnose.diseaseName
          })
          this.mainDiagnoses = { diseaseName, createTime }
        }
      })

      /**
       * 获取病历
       */

      let params = {
        'visitNumber': rowValue.visitNumber
      }
      params.config = { headers: { 'x-org-id': this.storage.getLocalStorage('CLINICID') } }
      api.getByCodeAndVisitId(params).then(rs => {
        if (JSON.stringify(rs) !== '{}') {
          let allergens = []
          rs.allergicHistory && rs.allergicHistory.guomin.forEach(items => {
            let text = ''
            items.allergen.forEach(item => {
              text += '  ' + item.name
            })
            allergens.push(text)
          })
          let diagnoses = []
          rs.diagnoseList.forEach(items => {
            let text = items.diagnose.diseaseName + ' -- 诊断备注：' + (items.diagnoseDetail ? items.diagnoseDetail : '')
            diagnoses.push(text)
          })
          this.medicalValues = rs
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
.mgl {
  margin-left: 30px;
}
.title {
  color: #606266;
}
.layout_inner {
  padding: 20px;
  margin-right: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}
.container1 {
  font-size: 14px;
  line-height: 14px;
  // .topClose {
  //   color: #666;
  //   margin: 0;
  //   span {
  //     cursor: pointer;
  //   }
  //   &:hover {
  //     color: #1c7bef;
  //   }
  // }
  .patient-info {
    margin-top: 20px;
    border-bottom: 1px solid #ddd;
  }
  .adopt-info {
    margin: 15px 0;
    padding: 10px;
    background: #f0f5fa;
  }
  .label-info {
    color: #999;
  }
  .value-info {
    color: #333;
    margin-right: 20px;
  }
  .tip {
    border-top: 1px dotted #ddd;
    margin-top: 20px;
  }
  .tip-btn {
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

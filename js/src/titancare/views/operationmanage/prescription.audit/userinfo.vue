<template>
  <div class='user-box'>
    <div v-if='!isShow'>
      <el-button type="primary" @click='adoptClick'>处方合理-通过</el-button>
      <el-button @click='notPassClick'>处方不合理-返回修改</el-button>
    </div>
    <div class='patient-info'>
      <span class='label-info'>患者信息：</span>
      <span class='value-info'>
        <span>{{userInfo.patientName}}</span>
        <span>{{userInfo.gender? (userInfo.gender === '1' ? "男" : '女') : ''}}</span>
        <span> {{ userInfo.birthday ? ages(userInfo.birthday) : ''}}</span>
      </span>
      <span class='label-info'>接诊医生：</span>
      <span class='value-info'>{{userInfo.orderDoctorSignature}}</span>
<!--      <span class='label-info'>机构名称：</span>-->
<!--      <span class='value-info'>{{userInfo.orgName}}</span>-->
      <span class='label-info'>问诊时间：</span>
      <span class='value-info'>{{userInfo.createTime}}</span>
      <p>
        <span class='label-info'>病情描述：</span>
        <span class='value-info' style='line-height: 20px;'>{{userInfo.question}}</span>
      </p>
    </div>
    <div class='adopt-info'  v-if='isShow'>
      <span class='label-info'>审核结果：</span>
      <span class='value-info'>{{status[detailsObj.auditStatus] ? status[detailsObj.auditStatus] : '--'}}</span>
      <span class='label-info'>药剂师：</span>
      <span class='value-info'>{{detailsObj.reviewDoctorSignature ? detailsObj.reviewDoctorSignature : '--'}}</span>
      <span class='label-info'>审核时间：</span>
      <span class='value-info'>{{detailsObj.auditTime ? detailsObj.auditTime : '--'}}</span>
      <p>
        <span class='label-info'>审核意见：</span>
        <span class='value-info' style='line-height: 20px;'>{{detailsObj.auditOpinion ? detailsObj.auditOpinion : '--'}}</span>
      </p>
    </div>
    <div>
      <p class='label-tip'>
        <span class='value-info'>诊断结果</span>
      </p>
      <p class='result'>
        <span class='label-info'>诊断名称：</span>
        <span class='value-info'>{{mainDiagnoses.diseaseName}}</span>
        <span class='label-info'>诊断时间：</span>
        <span class='value-info'>{{mainDiagnoses.createTime}}</span>
      </p>
    </div>
    <div v-for='(items, index) in detailsObj.recipeList' :key='index'>
      <div v-if='items.list.length'>
        <see-btn :values='items' :show='true' :status='detailsObj.auditStatus'></see-btn>
      </div>
      <div>
        <table-label v-for='(item, index) in items.list' :key='index' :name="serviceType[item[0].serviceType]" :resultData='item'></table-label>
      </div>
    </div>
    <el-dialog :title="dialogObj.title" :visible.sync="isShowdialog" :close-on-press-escape='false' :close-on-click-modal='false'>
      <span class='dialogSpan'>审核意见</span>
      <el-input
        type="textarea"
        :rows="5"
        maxlength="100"
        placeholder="请输入内容"
        v-model.trim="dialogValue">
      </el-input>
      <div style='margin-top: 20px;'>
        <el-button type="primary" @click='sendClick'>{{dialogObj.btn}}</el-button>
        <el-button @click='isShowdialog = false'>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tableLabel from '../tablelabel'
import seeBtn from '@/titancare/views/operationmanage/seebutton.vue'
import api from '@/titancare/api/operation/index'
export default {
  props: ['isShow', 'row'],
  components: {
    tableLabel,
    seeBtn
  },
  data () {
    return {
      isShowdialog: false,
      dialogValue: '',
      dialogObj: {
        title: '',
        btn: ''
      },
      api,
      detailsObj: {},
      status: {
        0: '待审核',
        1: '审核驳回',
        2: '审核通过'
      },
      serviceType: {
        301: '西药',
        302: '中成药',
        303: '中药材',
        304: '中药材'
      },
      mainDiagnoses: {},
      userInfo: {}
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    adoptClick () {
      this.dialogValue = ''
      this.dialogObj = {
        title: '处方合理-通过',
        btn: '审核通过'
      }
      this.isShowdialog = true
    },
    notPassClick () {
      this.dialogValue = ''
      this.dialogObj = {
        title: '处方不合理-返回修改',
        btn: '不通过'
      }
      this.isShowdialog = true
    },
    sendClick () {
      let params = {
        auditOpinion: this.dialogValue,
        platformAccountId: '',
        recipeOrderId: this.row.id,
        thcDoctor: {
          thcDoctorId: localStorage.getItem('USERID'),
          thcDoctorName: localStorage.getItem('DISPLAYNAME')
        }
      }
      if (this.dialogObj.btn === '审核通过') {
        params.auditStatus = 2
        api.goPass(params).then(res => {
          if (!res.errCode) {
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success'
            })
            this.isShowdialog = false
            this.$emit('closeSearch')
          }
        })
      } else {
        if (this.dialogValue === '') {
          this.$notify({
            title: '提示',
            message: '请填写审核不通过原因',
            type: 'warning'
          })
        } else {
          params.auditStatus = 1
          api.refuse(params).then(res => {
            if (!res.errCode) {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success'
              })
              this.isShowdialog = false
              this.$emit('closeSearch')
            }
          })
        }
      }
    },
    async getInfo () {
      // 查询图文信息
      let res = await api.getByOrderNo({ orderNo: this.row.groupId })
      let obj = res.data
      this.userInfo.question = obj.question || ''
      this.userInfo.createTime = obj.createTime || ''
      this.userInfo.patientName = this.row.patientName
      this.userInfo.gender = this.row.gender
      this.userInfo.birthday = this.row.birthday
      this.userInfo.orderDoctorSignature = this.row.orderDoctorSignature
      this.userInfo.orgName = this.row.orgName

      // 查询诊断
      this.mainDiagnoses = {}
      api.getMedicalRecordByVisitNumber({ 'visitNumbers': [ this.row.visitNumber ] }).then(res => {
        if (!res.errCode) {
          let diseaseName = ''
          let createTime = res.data.createTime
          res.data.diagnoseList.forEach(items => {
            diseaseName += diseaseName ? '/' + items.diagnose.diseaseName : items.diagnose.diseaseName
          })
          this.mainDiagnoses = { diseaseName, createTime }
        }
      })
      api.getRecipeOrderDetail({ recipeOrderId: this.row.id }).then(res => {
        if (!res.errCode) {
          res.data.recipeList.forEach(items => {
            let arr301 = []
            let arr302 = []
            let arr303 = []
            items.doctorAdviceList.forEach(item => {
              if (item.serviceType === '301') {
                let info = JSON.parse(item.content)
                info.doctorAdviceId = item.doctorAdviceId
                arr301.push(info)
              } else if (item.serviceType === '302') {
                let info = JSON.parse(item.content)
                info.doctorAdviceId = item.doctorAdviceId
                arr302.push(JSON.parse(item.content))
              } else if (item.serviceType === '303' || item.serviceType === '304') {
                let info = JSON.parse(item.content)
                info.doctorAdviceId = item.doctorAdviceId
                arr303.push(JSON.parse(item.content))
              }
            })
            items.list = []
            if (arr301.length) {
              items.list.push(arr301)
            }
            if (arr302.length) {
              items.list.push(arr302)
            }
            if (arr303.length) {
              items.list.push(arr303)
            }
          })
          this.detailsObj = res.data
        }
      })
    },
    ages (str) {
      let gender = ''
      let r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
      if (r == null) return false
      var d = new Date(r[1], r[3] - 1, r[4])
      if (d.getFullYear() === Number(r[1]) && (d.getMonth() + 1) === Number(r[3]) && d.getDate() === Number(r[4])) {
        var Y = new Date().getFullYear()
        gender = (Y - r[1]) + '岁'
      }
      return gender
    }
  },
  watch: {
    'row.id': {
      handler (n, o) {
        if (n) {
          this.getInfo()
        }
      }
    },
    isShow () {
      this.detailsObj = {}
    }
  }
}
</script>
<style lang='less' scoped>
.user-box {
  font-size: 14px;
  line-height: 14px;
  .label-info{
    color: #999;
  }
  .value-info{
    color: #333;
    margin-right: 20px;
  }
  .patient-info{
    margin-top: 20px;
    border-bottom: 1px solid #ddd;
  }
  .adopt-info{
    margin: 10px 0;
    padding: 10px 10px 1px;
    background: #f8f8f8;
  }
  .label-tip{
    line-height: 16px;
    margin-bottom: 10px;
    &:before{
      content: '';
      display: inline-block;
      position: relative;
      top: 4px;
      height: 14px;
      margin-right: 5px;
      border: 2px solid #1c7bef;
      border-radius: 2px;
    }
  }
  .result{
    padding: 0 0 0 9px;
  }
  .dialogSpan{
    display: inline-block;
    margin-bottom: 10px;
    font-size: 14px;
    color: #333;
  }
}
.user-box /deep/ .el-dialog__wrapper
.el-dialog{
  width: 395px;
}
</style>

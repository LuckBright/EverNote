<template>
  <div class="triagepatient">
    <el-popover placement="right" width="270" trigger="click" v-model="visible">
      <div class="title">
        <label>患者信息</label>
        <i class="el-icon-close" @click="visible=false"></i>
      </div>
      <div>
        <el-row>
          <el-col :span="8">姓名：</el-col>
          <el-col :span="16">{{data.patientName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">性别：</el-col>
          <el-col :span="16">
            <sys-value type="GBT.2261.1" :code="data.patientSex"></sys-value>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">出生日期：</el-col>
          <el-col :span="16">{{data.patientBirth | formatDateByExp('YYYY-MM-DD')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">电话：</el-col>
          <el-col :span="16">{{data.patientPhone}}</el-col>
        </el-row>
        <el-row class="line">
          <el-col :span="8">病历编号：</el-col>
          <el-col :span="16">{{data.visitNumber}}</el-col>
        </el-row>
        <!-- <el-row class="line lh40">
          <el-col class="lh40" :span="12">本次挂号时间：</el-col>
          <el-col class="lh40" :span="12">{{data.registrationTime | formatDateByExp}}</el-col>
        </el-row> -->
        <el-row class="footer tright">
          <!-- <el-button
            type="primary"
            size="medium"
            :disabled="(data.diagnosisType==='3' || data.diagnosisType==='5')&&data.queueState?false:true"
            @click="setflag(data)"
          >{{data.queueState==='1'?'标记离开':'手工签到'}}</el-button> -->
          <el-button size="medium" @click="linkDetailPage(data.patientId)">患者档案</el-button>
        </el-row>
      </div>
     <a type="text" slot="reference" size="small" @click="visible = !visible" :class="data.diagnosisType ==='4' ? 'gray': 'special'">
          {{data.patientName}}
        <span v-if="data.queueState==='5'">(离开)</span>
     </a>
    </el-popover>
  </div>
</template>
<script>
import api from '@/arrange/store/triageapi'
export default {
  props: {
    'data': {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      api,
      visible: false,
    }
  },
  created () {
  },
  methods: {
    setflag (val) {
      let params = {
        appointmentId: val.appointmentId,
        queueState: val.queueState
      }
      this.api.updateTriageQueue(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '标记成功',
            type: 'success'
          })
          if (val.queueState === '1') {
            val.queueState = '5'
          } else {
            val.queueState = '1'
          }
          this.visible = false
        }
      })
    },
    linkDetailPage (id) {
      this.visible = false
      let _url = this.$ever.crmIndex + '/crm/memberinfo/userinfo/memberbaseinfo/' + id
      window.open(_url, '_blank')
    },
    submitSort () {
    },
    cancel () {
      this.visible = false
    }
  }
}
</script>
<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  position: relative;
}
.title .el-icon-close {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px;
  cursor: pointer;
}
.el-row {
  line-height: 30px;
  height: 30px;
}
.lh40 {
  line-height: 40px;
  height: 40px;
}
.el-row .el-col:first-child {
  text-align: right;
  color: #666666;
}
.el-row .el-col:last-child {
  text-align: left;
  color: #000000;
}
.el-row.footer {
  text-align: center;
  margin-top: 10px;
}
.line {
  border-bottom: 1px solid #dddddd;
}
.layout_box .el-table .special {
  font-size: 14px;
  margin-left: 0px;
}
.layout_box .el-table .gray {
  font-size: 14px;
  margin-left: 0px;
  color: #666666;
}
.layout_box .el-table .special1 {
  font-size: 14px;
  margin-left: 0px;
  color: #1c7bef;
}
.el-table .el-button.el-button--small {
  padding: 0px 0px;
}
</style>

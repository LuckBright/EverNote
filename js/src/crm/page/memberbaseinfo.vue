<template>
  <div id="baseinfo">
    <el-row>
      <el-col :span="22">
        <span class="name">个人信息</span>
      </el-col>
      <el-col :span="2" align="right">
        <el-button type="text" @click="toEditPage">
          <i class="el-icon-edit"></i> 编辑
        </el-button>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-col :span="3" class="th">姓名：</el-col>
      <el-col :span="3" :pull="1">{{baseInfoObj.name}}</el-col>
      <el-col :span="3" class="th">性别：</el-col>
      <el-col :span="3" :pull="1">
        <div v-if="baseInfoObj.sex">
          <sys-value type="GBT.2261.1" :code="baseInfoObj.sex"></sys-value>
        </div>
      </el-col>
      <el-col :span="3" class="th">身份证号：</el-col>
      <el-col :span="3" :pull="1">{{baseInfoObj.idNo || '- -'}}</el-col>
      <el-col :span="3" class="th">出生日期：</el-col>
      <el-col
        :span="3"
        :pull="1"
      >{{baseInfoObj.birthday | formatDateByExp('YYYY-MM-DD')}}</el-col>
    </el-row>
    <el-row class="table">
      <el-col :span="3" class="th">年龄：</el-col>
      <el-col :span="3" :pull="1">
        <!-- <span>{{baseInfoObj && baseInfoObj.birthday ? ageShow(baseInfoObj) : ''}}</span> -->
        <span>{{baseInfoObj.ageShowText || ''}}</span>
      </el-col>
      <el-col :span="3" class="th">手机号码：</el-col>
      <el-col :span="3" :pull="1">
        <div class="height48">
          {{baseInfoObj.mobile ? baseInfoObj.mobile : '- -'}}
          <span v-if="baseInfoObj.mobile">
            <i class="iconfont icon-huiyuan_duanxin" @click="sendMessage"></i>
            <!-- <i class="iconfont icon-huiyuan_dianhu" @click="calling('mobile', baseInfoObj)"></i> -->
          </span>
        </div>
      </el-col>
      <el-col :span="3" class="th">座机号码：</el-col>
      <el-col :span="3" :pull="1">{{baseInfoObj.telephone ? baseInfoObj.telephone : '- -'}}</el-col>
      <el-col :span="3" class="th">渠道来源：</el-col>
      <el-col :span="3" :pull="1">{{baseInfoObj.sourceName ? baseInfoObj.sourceName : '- -'}}</el-col>
      <el-col :span="3" class="th">英文名：</el-col>
      <el-col :span="3" :pull="1">{{baseInfoObj.engName || '- -'}}</el-col>
    </el-row>
    <el-row class="table">
      <el-col :span="24">
        <el-col :span="2" class="th">标签：</el-col>
        <div v-if="baseInfoObj.member && baseInfoObj.member.objLabelList && baseInfoObj.member.objLabelList.length > 0">
          <el-tag
            v-for="(tag, i) in baseInfoObj.member.objLabelList"
            :key="i"
            :disable-transitions="false"
          >{{tag.labelName || ''}}</el-tag>
        </div>
      </el-col>
      <el-col :span="24">
        <el-col :span="3" class="th">备注：</el-col>
        <el-col :span="18" :pull="1" class="remark">{{baseInfoObj.remark}}</el-col>
      </el-col>
      <el-col :span="24">
        <div class style="border:1px dashed #e6e6e6;margin-bottom:20px;"></div>
      </el-col>
      <el-col :span="24">
        <el-col :span="3" class="th">其他证件：</el-col>
        <el-col :span="18" :pull="1" class="remark">
          <div class="card" v-for="(item, index) in baseInfoObj.idens" :key="index">
            <sys-value type="CV02.01.101" :code="item.type"></sys-value>
            : {{item.idNo}}
          </div>
        </el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="3" class="th">联系人：</el-col>
        <el-col :span="18" :pull="1" class="remark">
          <div v-for="(item, index) in baseInfoObj.contactList" :key="index">
            <sys-value type="GBT.4761" :code="item.type" class="mgr20"></sys-value>
            <span class="mgr20">{{item.name || '--'}}</span>
            <span class="mgr20">{{item.mobile || '--'}}</span>
            <span class="mgr20">
              <ever-address v-model="item.address" :convertToFnt="true"></ever-address>
            </span>
          </div>
        </el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="3" class="th">监护人：</el-col>
        <el-col :span="18" :pull="1" class="remark">
          <div v-for="(item, index) in baseInfoObj.guardianList" :key="index">
            <sys-value type="GBT.4761" :code="item.type" class="mgr20"></sys-value>
            <span class="mgr20">{{item.name}}</span>
            <span class="mgr20">{{item.mobile}}</span>
            <span class="mgr20">
              <ever-address v-model="item.address" :convertToFnt="true"></ever-address>
            </span>
          </div>
        </el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="3" class="th">户口地址1：</el-col>
        <el-col :span="21" :pull="1">
          <ever-address v-model="baseInfoObj.householdAddress" :convertToFnt="true"></ever-address>
        </el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="3" class="th">联系地址：</el-col>
        <el-col :span="21" :pull="1">
          <ever-address v-model="baseInfoObj.address" :convertToFnt="true"></ever-address>
        </el-col>
      </el-col>
      <el-col :span="3" class="th">血型：</el-col>
      <el-col :span="3" :pull="1">
        <div v-if="baseInfoObj.bloodType">
          <sys-value type="CV04.50.005" :code="baseInfoObj.bloodType"></sys-value>
        </div>
        <div v-else>- -</div>
      </el-col>
      <el-col :span="3" class="th">婚姻状况：</el-col>
      <el-col :span="3" :pull="1">
        <div v-if="baseInfoObj.marry">
          <sys-value type="GBT.2261.2" :code="baseInfoObj.marry"></sys-value>
        </div>
        <div v-else>- -</div>
      </el-col>
      <el-col :span="3" class="th">行政职称：</el-col>
      <el-col :span="3" :pull="1">
        <div v-if="baseInfoObj.career">
          <sys-value type="GBT.2261.4" :code="baseInfoObj.career"></sys-value>
        </div>
        <div v-else>- -</div>
      </el-col>
      <el-col :span="3" class="th">工作单位：</el-col>
      <el-col :span="3" :pull="1">{{baseInfoObj.company ? baseInfoObj.company : '- -'}}</el-col>
      <el-col :span="24">
        <el-col :span="3" class="th">工作地址：</el-col>
        <el-col :span="21" :pull="1">
          <ever-address v-model="baseInfoObj.workAddress" :convertToFnt="true"></ever-address>
        </el-col>
      </el-col>
      <el-col :span="3" class="th">国籍：</el-col>
      <el-col :span="3" :pull="1">
        <div v-if="baseInfoObj.country">
          <sys-value type="GBT.2659" :code="baseInfoObj.country"></sys-value>
        </div>
        <div v-else>- -</div>
      </el-col>
      <el-col :span="3" class="th">民族：</el-col>
      <el-col :span="3" :pull="1">
        <div v-if="baseInfoObj.nation">
          <sys-value type="GBT.3304" :code="baseInfoObj.nation"></sys-value>
        </div>
        <div v-else>- -</div>
      </el-col>
      <el-col :span="3" class="th">常用语言：</el-col>
      <el-col :span="3" :pull="1">
        <div v-if="baseInfoObj.language">
          <span v-for="(item,i) in baseInfoObj.language.split(',')" :key="i">
            <sys-value type="THC_SYS_LANGUAGE" :code="item"></sys-value>
          </span>
        </div>
        <div v-else>- -</div>
      </el-col>
      <el-col :span="24">
        <el-col :span="3" class="th">出生地：</el-col>
        <el-col :span="21" :pull="1">
          <ever-address v-model="baseInfoObj.birthAddress" :convertToFnt="true"></ever-address>
        </el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="3" class="th">籍贯地：</el-col>
        <el-col :span="21" :pull="1">
          <ever-address v-model="baseInfoObj.nativeAddress" :convertToFnt="true"></ever-address>
        </el-col>
      </el-col>
      <el-col :span="3" class="th">微信号：</el-col>
      <el-col
        :span="3"
        :pull="1"
      >{{baseInfoObj.member ? (baseInfoObj.member.wechat ? baseInfoObj.member.wechat : '- -') : '- -'}}</el-col>
      <el-col :span="3" class="th">QQ：</el-col>
      <el-col
        :span="3"
        :pull="1"
      >{{baseInfoObj.member ? baseInfoObj.member.qq ? baseInfoObj.member.qq : '- -' : '- -'}}</el-col>
      <el-col :span="3" class="th">微博昵称：</el-col>
      <el-col
        :span="3"
        :pull="1"
      >{{baseInfoObj.member ? baseInfoObj.member.weibo ? baseInfoObj.member.weibo : '- -' : '- -'}}</el-col>
      <el-col :span="3" class="th">Email：</el-col>
      <el-col
        :span="3"
        :pull="1"
      >{{baseInfoObj.member ? baseInfoObj.member.email ? baseInfoObj.member.email : '- -' : '- -'}}</el-col>
      <el-col :span="24">
        <el-col :span="3" class="th">创建时间：</el-col>
        <el-col :span="3" :pull="0">{{baseInfoObj.createTime || ''}}</el-col>
      </el-col>
    </el-row>
    <!-- <iphone ref="iphone" :data="callData" :hideicon="true"></iphone> -->
    <send-message ref="sendmessage" :users="users" :allparams="allparams"></send-message>
  </div>
</template>
<script>
import api from '../store/memberapi'
// import iphone from '../../crm/page/iphone.vue'
import sendMessage from '../page/sendmessage'

export default {
  data () {
    return {
      baseInfoObj: {},
      patientId: this.$route.params.patientId ? this.$route.params.patientId : 1,
      imgsrc: '',
      callData: '',
      users: '',
      allparams: {
        msgType: 110
      },
      contacts: '',
      contactinfo: '',
    }
  },
  created () {
    this.getPatientId()
  },
  methods: {
    getPatientId () {
      api.getBaseInfoById({ 'patientId': this.patientId, 'needIden': true, 'checkRelate': true }).then(rs => {
        this.baseInfoObj = rs.data
        this.contacts = rs.data.contactList.length > 0 ? rs.data.contactList[0].name : '--'
        this.contactinfo = rs.data.contactList.length > 0 ? rs.data.contactList[0].mobile : '--'
        this.users = [this.baseInfoObj]
      })
    },
    sendMessage () {
      this.$refs.sendmessage.sendVisible = true
    },
    toEditPage () {
      this.$router.push({ path: '/crm/memberinfo/userinfo/memberinfoedit/' + this.patientId })
    },
    // calling (flag, val) {
    //   this.callData = { mobile: flag === 'mobile' ? val.mobile : val.contactMobile, patientName: val.name, patientId: val.id }
    //   this.$refs.iphone.visible = true
    // }
  },
  components: {
    // iphone,
    sendMessage
  }
}
</script>
<style scoped>
#baseinfo {
  background: #fff;
}
#baseinfo .title {
  margin-bottom: 5px;
}
#baseinfo .title .el-col {
  padding: 0 10px;
}
#insuranceinfo .title .el-button {
  padding: 0;
}
.name {
  display: inline-block;
  height: 16px;
  line-height: 16px;
  border-left: 2px solid #1c7bef;
  padding-left: 10px;
}
#baseinfo .table {
  line-height: 48px;
  font-size: 14px;
  color: #151515;
}
#baseinfo .table .th {
  padding-left: 20px;
  color: #999999;
}
.remark {
  overflow: hidden;
  word-break: break-all;
}
.iconfont {
  color: #1c7bef;
}
.height48 {
  height: 48px;
}
.card {
  display: inline-block;
  margin-right: 20px;
}
.mgr20 {
  margin-right: 20px;
}
</style>

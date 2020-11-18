<template>
  <div id="memberinfo">
    <ever-bread-crumb name="添加客户" path="/crm/member" v-if="!isComponent"></ever-bread-crumb>
    <div class="layout_inner" :class="{layout_height: isComponent}">
      <div class="panel-body">
        <memberadd-profile
          :patient="patient"
          @formChange1="setVal1"
          @formChange2="setVal2"
          @formChange3="setVal3"
          ref="memberinfos"
        ></memberadd-profile>
        <user-insurance @formChange4="setVal4" @formChange5="setVal5"></user-insurance>
        <div class="ml30" :class="{fixedfooter: isComponent}">
          <el-button
            type="primary"
            :disabled="isSubmit"
            @click="submitCustomerInfoForm(false)"
            style="width:88px;"
          >
            <i class="iconfont icon-baocunweimoban"></i>保存
          </el-button>
          <el-button type="primary" :disabled="isSubmit" @click="submitCustomerInfoForm(true)">
            <i class="iconfont icon-baocunweimoban"></i>保存并继续新建
          </el-button>
          <el-button @click="cancel()" style="width:88px;">
            <i class="iconfont icon-quxiao"></i>取消
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../store/memberapi'
import memberaddProfile from './memberadd-profile'
import userInsurance from '../../workspace/page/userinsuranceadd'
import axios from 'axios'
import upconfig from '@/components/everuploadconfig'

export default {
  mixins: [upconfig],
  props: ['isComponent', 'patient'],
  data () {
    return {
      api,
      isSubmit: false,
      totalObj: {},
      iden: {},
      allergicHis: {},
      mainObj1: {},
      mainObj2: {},
      mainObj3: {},
      insurObj: {},
      bussinessInsurObj: [],
      avatarPic: '',
      facePic: '',
      wechat: '',
      email: '',
      weibo: '',
      qq: '',
      objLabelList: [],
      contactList: [],
    }
  },
  created () {
    this.$bus.$off('onError')
    this.$bus.$on('onError', val => {
      this.isSubmit = false
    })
  },
  methods: {
    async submitCustomerInfoForm (isCreate) {
      this.isSubmit = true
      this.totalObj.facePic = this.facePic
      this.totalObj.busiInsurs = this.bussinessInsurObj

      // obj1
      this.totalObj.name = this.mainObj1.name
      this.totalObj.sex = this.mainObj1.sex
      this.totalObj.idNo = this.mainObj1.idNo
      this.totalObj.agebirthday = this.mainObj1.agebirthday && this.mainObj1.agebirthday.agebirthday ? this.mainObj1.agebirthday.agebirthday : ''
      this.mainObj1.mobile = this.mainObj1.mobile ? this.mainObj1.mobile.replace(/-/g, '') : ''
      this.totalObj.age = this.mainObj1.agebirthday && this.mainObj1.agebirthday.age ? this.mainObj1.agebirthday.age : ''
      this.totalObj.isMonth = this.mainObj1.agebirthday && this.mainObj1.agebirthday.isMonth ? this.mainObj1.agebirthday.isMonth : ''
      this.totalObj.isDay = this.mainObj1.agebirthday && this.mainObj1.agebirthday.isDay ? this.mainObj1.agebirthday.isDay : ''
      this.totalObj.mobile = this.mainObj1.mobile
      this.totalObj.source = this.mainObj1.source
      this.objLabelList = this.mainObj1.objLabelList ? this.mainObj1.objLabelList : []
      this.totalObj.photoId = this.mainObj1.photoId
      this.totalObj.birthday = this.mainObj1.agebirthday && this.mainObj1.agebirthday.birthday ? this.mainObj1.agebirthday.birthday : ''
      this.totalObj.remark = this.mainObj1.remark ? this.mainObj1.remark : ''
      this.totalObj.isIgnoreMobile = this.mainObj1.checkedMobile ? this.mainObj1.checkedMobile : false

      // obj2
      this.mainObj2.contactList && this.mainObj2.contactList.forEach(item => {
        if (item.type === '') {
          delete this.mainObj2.contactList
        } else {
          this.totalObj.contactList = this.mainObj2.contactList
        }
      })
      this.totalObj.idens = this.mainObj2.iden ? this.mainObj2.iden : []
      this.totalObj.householdAddress = this.mainObj2.householdAddress
      this.totalObj.address = this.mainObj2.address.length

      this.totalObj.bloodType = this.mainObj2.bloodType ? this.mainObj2.bloodType : null
      this.totalObj.marry = this.mainObj2.marry ? this.mainObj2.marry : null
      this.totalObj.career = this.mainObj2.career ? this.mainObj2.career : ''
      this.totalObj.company = this.mainObj2.company ? this.mainObj2.company : ''
      this.totalObj.workAddress = this.mainObj2.workAddress ? this.mainObj2.workAddress : null
      this.totalObj.country = this.mainObj2.country ? this.mainObj2.country : null
      this.totalObj.nation = this.mainObj2.nation ? this.mainObj2.nation : null
      this.mainObj2.language = this.mainObj2.language ? this.mainObj2.language : null
      this.totalObj.newWeight = this.mainObj2.newWeight
      this.totalObj.birthAddress = this.mainObj2.birthAddress
      this.email = this.mainObj2.email ? this.mainObj2.email : ''
      this.qq = this.mainObj2.qq ? this.mainObj2.qq : ''
      this.wechat = this.mainObj2.wechat ? this.mainObj2.wechat : ''
      this.weibo = this.mainObj2.weibo ? this.mainObj2.weibo : ''

      let tempvisitNo = []
      if (this.mainObj3.visitNos) {
        this.mainObj3.visitNos.map(rs => {
          if (rs.no !== '' && rs.no !== null) {
            tempvisitNo.push(rs)
          }
        })
      }

      Object.assign(this.totalObj, this.insurObj, this.mainObj1, this.mainObj2, this.mainObj3)
      this.totalObj.visitCards = tempvisitNo
      this.totalObj.address = this.totalObj.address.length > 0 ? this.totalObj.address : ''
      // 插入一个读取身份证逻辑 by lvjiangtao@everjiankang.com
      if (this.totalObj.avatarPic && this.totalObj.avatarPic.startsWith('data:image/')) {
        let tempData = {
          base64: this.totalObj.avatarPic
        }

        var data = new URLSearchParams()
        for (var o in tempData) {
          data.append(o, tempData[o])
        }
        let res = await axios({
          url: this.action,
          method: 'post',
          headers: this.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
          data: data
        })
        if (res.head.errCode === 0) {
          this.totalObj.avatarPic = res.data.fileId
        }
      }

      let request = this.totalObj.id ? this.api.append : this.api.create
      this.$refs.memberinfos.$refs.userinfo.$refs.form.validate(valid => {
        if (valid) {
          request(this.totalObj, this.objLabelList).then(rs => {
            if (rs.head.errCode === 0) {
              this.isSubmit = false
              if (rs.data.patient.anonymous) {
                this.$messageTips(this, 'success', '匿名患者建档成功')
              } else {
                this.$messageTips(this, 'success', '操作成功')
              }
              if (isCreate) {
                this.$refs.memberinfos.sourceName = ''
                // this.$refs.memberinfos.initData()
                this.$refs.memberinfos.$refs.userinfo.$refs.form.resetFields()
              } else {
                if (this.isComponent) {
                  rs.data.patient.isSave = true
                  this.$emit('success', rs.data.patient)
                } else {
                  this.$router.push({ path: '/crm/memberinfo/userinfo/memberbaseinfo/' + rs.data.patientId })
                }
              }
            }
          })
        } else {
          this.isSubmit = false
          this.autofocus()
        }
      })
    },
    cancel () {
      if (this.isComponent) {
        this.$emit('success', false)
      } else {
        this.$router.push({ path: '/crm/member' })
      }
    },
    autofocus () {
      setTimeout(() => {
        var isError = document.getElementsByClassName('is-error')
        if (isError.length) {
          isError[0].querySelector('input').focus()
        }
      }, 1)
    },
    setVal1 (formObj) {
      this.mainObj1 = formObj
    },
    setVal2 (formObj) {
      this.mainObj2 = formObj
    },
    setVal3 (formObj) {
      this.mainObj3 = formObj
    },
    setVal4 (formObj) {
      this.insurObj = formObj
    },
    setVal5 (formObj) {
      this.bussinessInsurObj = formObj
    },
    setImg (val) {
      this.avatarPic = val
    },
    setFace (val) {
      this.facePic = val
    }
  },
  beforeCreate () {
    this.api = api
  },
  components: {
    memberaddProfile,
    userInsurance
  }
}
</script>
<style scoped>
#memberinfo .el-menu-user {
  background: none;
  margin-bottom: 30px;
}
#memberinfo .el-menu-user .el-menu-item {
  border-bottom: 2px solid #eee;
  color: #999;
}
#memberinfo .el-menu-user .el-menu-item:hover,
#memberinfo .el-menu-user .el-menu-item.is-active {
  border-bottom: 2px solid #1c7bef;
  background: #fff;
  color: #000;
}
#memberinfo .layout_height {
  height: calc(100vh - 180px);
  overflow: auto;
}
.mempanel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.main {
  background: rgb(240, 240, 240);
}
.main > div {
  background: #fff;
  padding-top: 5px;
}
.main-war .el-menu {
  background: #fff;
}
h2.main-title span {
  margin: 0 0 10px 0;
  border-bottom: 2px solid #1c7bef;
  background: #fff;
  color: #000;
  display: inline-block;
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  padding: 0 20px;
}
#memberinfo .fixedfooter {
  position: absolute;
  padding: 10px;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
#memberinfo .footer {
  padding: 0 0 0 30px;
}
.iconfont {
  font-size: 12px;
  margin-right: 5px;
}
</style>

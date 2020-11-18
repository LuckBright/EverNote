<template>
  <div id="mainheader">
    <header>
      <div class="headerAvt">
        <ever-upload1 v-model="avatarPic" ref="upload1" :limit="1" :handlerShow="false" class="isRadius" :key="currentKey" @success="handleUpdataUserAvt"></ever-upload1>
      </div>
      <el-row class="first">
        <span v-if="labelFlag" class="s1" :style="{color: color}">•</span>
        <strong>{{name}}</strong>
        <span v-if="anonymous" class="call ml10">
          <i class="iconfont icon-niming"></i>
        </span>
        <span v-if="busiInsur" @click="routePushToInsur()">
          <span v-if="busiInsur && busiInsur.busiInsurFlag">
            <i
              class="icon iconfont icon-menzhen-yibao1 cGreen"
              v-if="busiInsur.busiInsurNotExpire&&!busiInsur.busiInsurExpire"
            ></i>
            <i class="icon iconfont icon-menzhen-yibao1 cRed" v-if="busiInsur.busiInsurExpire"></i>
            <i class="icon iconfont icon-menzhen-yibao1 cGray" v-if="busiInsur.busiInsurAllExpire"></i>
          </span>
          <span v-if="busiInsur&&busiInsur.busiSupplInsurFlag">
            <i
              class="icon iconfont icon-menzhen-shangyebucho cGreen"
              v-if="busiInsur.busiSupplInsurNotExpire&&!busiInsur.busiSupplInsurExpire"
            ></i>
            <i
              class="icon iconfont icon-menzhen-shangyebucho cRed"
              v-if="busiInsur.busiSupplInsurExpire"
            ></i>
            <i
              class="icon iconfont icon-menzhen-shangyebucho cGray"
              v-if="busiInsur.busiSupplInsurAllExpire"
            ></i>
          </span>
        </span>
        <span v-if="sex == '1'" class="icon">
          <i class="iconfont icon-Fill1"></i>
        </span>
        <span v-if="sex == '2'" class="icon">
          <i class="iconfont icon-Fill"></i>
        </span>
        <span class="mSex">{{age}} | {{patientNumber}}</span>
        <span @click.stop="print({'id': id})" class="call">
          <i class="iconfont icon-menzhen-dayin"></i>
        </span>
        <span v-if="labelFlag">
          <el-tag
            v-for="item in objLabelList"
            :key="item.id"
            class="mr5"
            :closable="item.objType == 2 && item.systemFlag != 1"
            @close="remove(item.id, item.labelName)"
          >{{item.labelName}}</el-tag>
        </span>
        <p class="point">
          <span v-if="benefit" class="mgl25">{{benefit}}</span>
          <span>
            <integral-pover refs="intergral" :point="point" @update="updatePoint"></integral-pover>
          </span>
        </p>
      </el-row>
    </header>
  </div>
</template>
<script>
import api from '@/crm/store/memberapi'
import tagapi from '@/crm/store/tagapi'
import integralPover from '@/crm/components/integral.pover'
import { everprint, ageShow } from '@/util/common'

export default {
  data () {
    return {
      tagapi,
      patientId: this.$route.params.patientId,
      avatarPic: '',
      patientNumber: '',
      mobileValue: '',
      baseCode: 'CUSTOMER_LABEL_MEMBER',
      id: '',
      sex: '',
      age: '-',
      name: '',
      color: '#000',
      labelFlag: false,
      anonymous: false,
      oweStatus: false,
      busiInsur: {},
      point: '',
      benefit: '',
      selected: [],
      objLabelList: [],
      uploadAttrs: {},
      api,
      currentKey: new Date().getTime()
    }
  },
  created () {
    this.getUserAvtInfo()
    this.$bus.$on('updataHead', val => {
      if (val) {
        this.getUserAvtInfo()
      }
    })
    this.$bus.$on('updateInsurance', val => {
      if (val) {
        this.getUserAvtInfo()
      }
    })
    // 监听一个其他组件更新头像的方法，主要是患者头部信息和修改页面头像要联动修改，用bus的方式互相通知
    this.$bus.$on('update:head-userAvatar', val => {
      this.currentKey = new Date().getTime()
      this.avatarPic = val
    })
  },
  methods: {
    routePushToInsur () {
      this.$router.push('/crm/memberinfo/userinfo/userinsuranceinfo/' + this.patientId)
    },
    print (val) {
      if (val && val.id) {
        everprint(this.baseCode, { patientId: val.id }, {
          preview: true,
          cb: _ => {
            console.log('打印完成')
          },
          lang: '01'
        })
      }
    },
    // 上传头像直接更新passport数据，因为有可能是在编辑页面上传的，所以把上传成功的事件广播出去
    handleUpdataUserAvt (data) {
      api.updataUserAvt({
        id: this.patientId,
        pic: data.fileId
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '头像上传成功')
          this.$bus.$emit('update:profile-userAvatar', data.fileId)
        }
      })
    },
    getUserAvtInfo () {
      api.getBaseInfoById1({
        patientId: this.patientId
      }).then(result => {
        if (result.head.errCode === 0) {
          this.$bus.$emit('common:patientObj', result.data)
          this.id = result.data.id
          this.name = result.data.name
          this.avatarPic = result.data.avatarPic
          this.sex = result.data.sex
          this.age = result.data.ageShowText || ageShow(result.data)
          this.patientNumber = result.data.patientNumber && result.data.patientNumber !== 'temporary' ? result.data.patientNumber : '--'
          this.labelFlag = Boolean(result.data.member && result.data.member.objLabelList && result.data.member.objLabelList.length)
          this.color = (this.labelFlag) ? (result.data.member && result.data.member.objLabelList && result.data.member.objLabelList[0].color) : '#000'
          this.busiInsur = result.data.busiInsur
          this.benefit = result.data.benefit
          this.point = result.data.point
          this.anonymous = result.data.anonymous
          this.objLabelList = result.data.member && result.data.member.objLabelList
        }
      })
    },
    updatePoint (val) {
      this.point = val
    },
    remove (id, name) {
      this.$confirm('是否需要删除【' + name + '】行为标识?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tagapi.deleteLalbel({ 'id': id }).then(rs => {
          if (rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      }).catch((e) => {
      })
    }
  },
  components: {
    integralPover,
  }
}
</script>
<style scoped>
#mainheader {
  height: 90px;
  padding: 0 0 0 107px;
  position: relative;
  background: #fff url('../../assets/img/bg_header.png') right 0 no-repeat;
  box-shadow: 0 2px 8px 0 rgba(204, 204, 204, 0.36);
  margin-bottom: 12px;
}
#mainheader img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: absolute;
  left: 20px;
  top: 15px;
}
.first {
  font-size: 14px;
  padding-top: 17px;
}
.icon-Fill1 {
  color: #307eed;
  margin-top: 3px;
}
.icon-Fill {
  color: #fa669c;
  margin-top: 3px;
}
.avatar-uploader {
  width: 200px;
}
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
}
.avatar-uploader img {
  width: 100%;
  height: 100%;
}
.mSex {
  margin-right: 10px;
  margin-top: 5px;
  color: #999;
}
.s1 {
  vertical-align: top;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 34px;
}
.mgl25 {
  margin-right: 25px;
}
.cGray {
  color: #bbb;
}
.point {
  margin-top: 0;
}
.headerAvt {
  width: 60px;
  height: 60px;
  position: absolute;
  left: 20px;
  top: 15px;
}
.first {
  margin-top: 20px;
}
</style>

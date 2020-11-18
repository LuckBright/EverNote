<template>
  <div id="patientinfo">
    <el-row class="header">
      <el-col :span="16"><strong class="title">患者信息</strong></el-col>
      <el-col :span="8" align="right">
        <el-popover
          v-if="currentPatient"
          v-model="show"
          placement="top-start"
          title="选择新的患者"
          width="400"
          @show="showNewPatient"
          trigger="click">
          <el-form>
            <el-form-item>
              <ever-patient-select v-model="patientName" @select="selectPatient" :allow-create="true"></ever-patient-select>
            </el-form-item>
          </el-form>
          <el-button slot="reference" type="text">切换患者</el-button>
        </el-popover>
        <el-button type="text" @click="isEdit=true" v-if="currentPatient">编辑</el-button>
      </el-col>
    </el-row>
    <div class="body">
      <el-form v-if="patient" :model="currentPatient" label-width="100px" label-position="right">
        <el-form-item label="姓名：">
          <span>{{currentPatient.name}}</span>
        </el-form-item>
        <el-form-item label="性别：">
          <span>{{currentPatient.sex | formatSex}}</span>
        </el-form-item>
        <el-form-item label="身份证号：">
          <span>{{currentPatient.idNo}}</span>
        </el-form-item>
        <el-form-item label="出生日期：">
          <span>{{currentPatient.agebirthday && currentPatient.agebirthday.birthday ? $moment(currentPatient.agebirthday.birthday).format('YYYY/MM/DD') : ''}}</span>
        </el-form-item>
        <el-form-item label="年龄：">
          <span>{{currentPatient.agebirthday && (currentPatient.agebirthday.age || currentPatient.agebirthday.age === 0) ? currentPatient.agebirthday.age + '岁' : ''}}</span>
        </el-form-item>
        <el-form-item label="渠道：">
          <span>{{currentPatient.sourceName || ''}}</span>
        </el-form-item>
        <el-form-item label="手机：">
          <el-input v-model="newMobile" placeholder="手机号码" v-if="isEdit" size="mini"></el-input>
          <span v-else>{{currentPatient.mobile}}</span>
        </el-form-item>
        <el-form-item label="民族：">
          <sys-type code="GBT.3304" v-model="newNation" size="mini" v-if="isEdit"></sys-type>
          <sys-value type="GBT.3304" :code="currentPatient.nation" v-else></sys-value>
        </el-form-item>
        <el-form-item label="婚姻：">
          <sys-type code="GBT.2261.2" v-model="newMarry" size="mini" v-if="isEdit"></sys-type>
          <sys-value type="GBT.2261.2" :code="currentPatient.marry" v-else></sys-value>
        </el-form-item>
        <el-form-item label="联系地址：">
          <el-input v-model="newAddress" size="mini" :maxlength="50" placeholder="联系地址" v-if="isEdit"></el-input>
          <span v-else>{{currentPatient.address ? JSON.parse(currentPatient.address).addressDetail : '未填'}}</span>
        </el-form-item>
        <el-form-item label="标签：">
          <template v-if="currentPatient.member && currentPatient.member.labelNames">
            <el-tag type="info" size="small" v-for="(item, i) in currentPatient.member.labelNames.split(',')" :key="i">{{item}}</el-tag>
          </template>
        </el-form-item>
        <el-form-item label="" v-if="isEdit">
          <div style="padding-top:20px">
            <el-button size="small" type="primary" @click="updateMember">保存</el-button>
            <el-button size="small" @click="isEdit=false">取消</el-button>
          </div>
        </el-form-item>
        <div class="photo">
          <img :src="currentPatient.avatarPic ? $ever.imgurl + currentPatient.avatarPic : previews">
        </div>
      </el-form>
      <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
    </div>
  </div>
</template>
<script>
import appointapi from '@/arrange/store/appointapi'
export default {
  props: ['patient'],
  data () {
    return {
      appointapi,
      isEdit: false,
      show: false,
      currentPatient: '',
      patientName: '',
      newMobile: '',
      newAddress: '',
      newNation: '',
      newMarry: '',
      previews: '/static/assets/avtarbg.png'
    }
  },
  watch: {
    patient (val) {
      this.patientName = val.name
      this.currentPatient = Object.assign({}, val)
    },
    currentPatient () {
      this.newMobile = this.currentPatient.mobile
      this.newNation = this.currentPatient.nation
      this.newMarry = this.currentPatient.marry
      this.newAddress = this.currentPatient.address ? JSON.parse(this.currentPatient.address).addressDetail : ''
    }
  },
  methods: {
    selectPatient (val) {
      this.currentPatient = val
      this.show = false
      this.$emit('changepatient', val)
    },
    updateMember () {
      this.currentPatient.mobile = this.newMobile
      this.currentPatient.address = JSON.stringify({addressDetail: this.newAddress})
      this.currentPatient.nation = this.newNation
      this.currentPatient.marry = this.newMarry
      this.appointapi.updatePatientInfo(this.currentPatient).then(rs => {
        if (!rs.head.errCode) {
          this.isEdit = false
        }
      })
    },
    showNewPatient () {
      this.patientName = ''
      this.show = true
    }
  }
}
</script>

<style scoped>
  #patientinfo{margin-top: 10px;}
  .header{padding: 7px 0;}
  .header strong.title{padding-left: 6px; border-left: 3px solid #1C7BEF; font-size: 16px; color: #000; line-height: 36px;}
  .body{font-size: 14px; line-height: 1.5; display: block; height: 384px; overflow: auto; position: relative;}
  .body .el-form{padding: 6px 0;}
  .body .el-form /deep/ .el-form-item{margin-bottom: 0;}
  .body .el-form /deep/ .el-form-item__label,
  .body .el-form /deep/ .el-form-item__content{line-height: 33px; height: 33px;}
  .body .photo{width: 80px; height: 80px; position: absolute; right: 10px; top: 0; z-index: 999;}
  .body .photo img{width: 80px; height: 80px; border-radius: 50%;}
</style>

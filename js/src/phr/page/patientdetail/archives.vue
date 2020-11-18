<template>
  <div class="right-main-container">
    <div class="archives-box">
      <div class="archives-title">
        健康档案
      </div>
      <div class="archives-base-info">
        <el-row>
          <el-col :span="6"><div class="base-info-label">姓名：</div><div class="base-info-text">{{patientData.patientName}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">性别：</div><div class="base-info-text">{{patientData.genderName}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">身份证号：</div><div class="base-info-text">{{patientData.identificationNumber}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">出生日期：</div><div class="base-info-text">{{patientData.birthday}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">年龄：</div><div class="base-info-text">{{patientData.birthday | birthdayComputed}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">手机号：</div><div class="base-info-text">{{patientData.mobile}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">学历名称：</div><div class="base-info-text">{{patientData.educationName}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">国籍：</div><div class="base-info-text">{{patientData.nationName}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">民族：</div><div class="base-info-text">{{patientData.raceName}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">监护人：</div><div class="base-info-text">{{patientData.guardian}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">出生地：</div><div class="base-info-text">
            <ever-address v-model="patientData.birthplaceJson" :convertToFnt="true"></ever-address>
          </div></el-col>
          <el-col :span="6"><div class="base-info-label">籍贯：</div><div class="base-info-text">
            <ever-address v-model="patientData.nativeJson" :convertToFnt="true"></ever-address>
          </div></el-col>
          <el-col :span="6"><div class="base-info-label">婚姻：</div><div class="base-info-text">{{patientData.maritalStatusName}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">体重：</div><div class="base-info-text">{{patientData.weight}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">血型：</div><div class="base-info-text">{{patientData.aboBloodTypeCode}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">职业：</div><div class="base-info-text">{{patientData.professionName}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">工作单位：</div><div class="base-info-text">{{patientData.workCompanyName}}</div></el-col>
          <el-col :span="6"><div class="base-info-label">联系人：</div><div class="base-info-text"><template v-if="patientData.patientContact">{{patientData.patientContact.contactPersonName}} {{patientData.patientContact.contactPersonMobile}}</template></div></el-col>
          <el-col :span="12"><div class="base-info-label">户口地址：</div><div class="base-info-text">
            <ever-address v-model="patientData.householdAddressJson" :convertToFnt="true"></ever-address>
          </div></el-col>
          <el-col :span="24"><div class="base-info-label">现地址：</div><div class="base-info-text">
            <ever-address v-model="patientData.addressJson" :convertToFnt="true"></ever-address>
          </div></el-col>
        </el-row>
      </div>
      <div class="archives-create-info">
        <div class="create-info-item">
          建档者
        </div>
        <div class="create-info-item">
          {{patientData.patientRecordCreateName}}
        </div>
        <div class="create-info-item">
          建档日期
        </div>
        <div class="create-info-item">
          {{$moment(patientData.patientRecordCreateDate).format('YYYY-MM-DD')}}
        </div>
        <div class="create-info-item">
          医疗机构
        </div>
        <div class="create-info-item">
          {{patientData.patientCreateOrgName}}
        </div>
      </div>
      <div class="archives-history">
        <div class="history-title">
          病史信息：
        </div>
        <div class="history-item">
          <div class="history-item-label">既往史：</div>
          {{patientData.pastHistory}}
        </div>
        <div class="history-item">
          <div class="history-item-label">传染病史：</div>
          {{patientData.infectiousHistory}}
        </div>
        <div class="history-item">
          <div class="history-item-label">预防接种史：</div>
          {{patientData.vaccinationHistory}}
        </div>
        <div class="history-item">
          <div class="history-item-label">手术史：</div>
          {{patientData.surgeryHistory}}
        </div>
        <div class="history-item">
          <div class="history-item-label">输血史：</div>
          {{patientData.bloodTransfusionHistory}}
        </div>
        <div class="history-item">
          <div class="history-item-label">药物过敏史：</div>
          <template v-if="patientData.allergenHistory">
            <span v-for="(item, index) in JSON.parse(patientData.allergenHistory).guomin">
              <span v-for="(sitem, sindex) in item.allergen">
                {{sitem.name}}
                <span v-if="sindex !== item.allergen.length -1 ">-</span>
              </span>
              <span  v-if="index !== JSON.parse(patientData.allergenHistory).guomin.length -1 ">/</span>
            </span>

          </template>
        </div>
        <div class="history-item">
          <div class="history-item-label">非药物过敏史：</div>
          <template v-if="patientData.otherPastHistory">
            <span v-for="(item, index) in JSON.parse(patientData.otherPastHistory).guomin">
              <span v-for="(sitem, sindex) in item.allergen">
                {{sitem.name}}
                <span v-if="sindex !== item.allergen.length -1 ">-</span>
              </span>
              <span  v-if="index !== JSON.parse(patientData.otherPastHistory).guomin.length -1 ">/</span>
            </span>

          </template>
        </div>
        <div class="history-item">
          <div class="history-item-label">个人史：</div>
          {{patientData.personHistory}}
        </div>
        <div class="history-item">
          <div class="history-item-label">婚育史：</div>
          {{patientData.marriageChildbearingHistory}}
        </div>
        <div class="history-item">
          <div class="history-item-label">月经史：</div>
          {{patientData.menstrualHistory}}
        </div>
        <div class="history-item">
          <div class="history-item-label">家族史：</div>
          {{patientData.familyHistory}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '@/util/req'
import urls from '@/phr/api/urls'
export default {
  data () {
    return {
      patientData: {},
      adressObj: {}
    }
  },
  created () {
    this.getPatientData()
  },
  methods: {
    getPatientData () {
      request(urls.archives, {
        patientId: this.$route.query.patientId
      }).then((res) => {
        console.log(res)
        if (res.head.errCode === 0) {
          this.patientData = res.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .archives-box{
    min-width: 900px;
    max-width: 1400px;
    margin: 0 auto;
    background: #fff;
    font-size: 14px;
    box-sizing: border-box;
    padding: 0 20px 20px;
    min-height: 100%;
    .archives-title{
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      color: #333333;
      text-align: center;
      border-bottom: solid 1px  #E9EBEF;
      font-weight: bold;
    }
    .archives-base-info{
      /deep/ .el-col{
        margin-bottom: 17px;
      }
      margin-top: 15px;
      .base-info-label{
        display: inline-block;
        color: #666666;
        width: 70px;
        text-align: right;
      }
      .base-info-text{
        display: inline-block;
      }
    }
    .archives-create-info{
      display: flex;
      height: 36px;
      line-height: 36px;
      background: #F3F7FB;
      border: solid 1px #DADCE0;;
      .create-info-item{
        padding: 0  11px 0 11px;
        border-right: solid 1px #DADCE0;
        box-sizing: border-box;
        &:nth-last-of-type(1) {
          flex: 1;
          border-right: none;
        }
        &:nth-of-type(odd){
          color: #446487;
          min-width: 77px;
        }
        &:nth-of-type(even){
          min-width: 99px;
        }
      }
    }
    .archives-history{
      margin-top: 20px;
      .history-title{
        font-size: 16px;
        line-height: 35px;
      }
      .history-item{
        color: #777;
        line-height: 30px;
        .history-item-label{
          color: #000;
          display: inline-block;
        }
      }
    }
  }
</style>

<template>
  <div id="memberinfo">
    <ever-bread-crumb :name="'客户信息'" :path="'/crm/member'" showTitle="true" :pathTo="true" :have-return="true"></ever-bread-crumb>
    <!-- <main-header :patient-id="patientId"></main-header> -->
    <!-- 负责此业务的伙伴请自行调用新的患者信息头组件,mainheader组件已在471版本已删除-->
    <div>
      <el-row>
        <el-col :span="24">
          <el-menu mode="horizontal" class="mainmenu" :default-active="currentPage" router>
            <el-menu-item :index="'/crm/memberinfo/userinfo/memberbaseinfo/' + patientId" v-if="$hasPermission('Auth_menu_crm_member')">
              客户信息
            </el-menu-item>
            <!-- <el-menu-item :index="'/crm/memberinfo/healthyrecord/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_healthrd')">
              医疗背景
            </el-menu-item> -->
            <el-menu-item :index="'/crm/memberinfo/relationship/' + patientId">
              关系人
            </el-menu-item>
            <el-menu-item :index="'/crm/memberinfo/customerlabel/' + patientId">
              客户标签
            </el-menu-item>
            <!-- <el-menu-item :index="'/crm/memberinfo/memberdetailchar/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_detachar')">
              客户分析
            </el-menu-item> -->
            <el-menu-item :index="'/crm/memberinfo/customeranalysisfigure/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_detachar')">
              客户分析
            </el-menu-item>
            <!-- 预约、挂号、用药、检验检查记录431已废弃 http://jira.everjiankang.com/browse/CPGL-689 -->
            <!-- <el-menu-item :index="'/crm/memberinfo/reservationsrecord/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_reservatd')">
              预约记录
            </el-menu-item>
            <el-menu-item :index="'/crm/memberinfo/appointsrecord/' + patientId + '/2'" v-if="$hasPermission('Auth_menu_crm_member_register')">
              挂号记录
            </el-menu-item> -->
            <el-menu-item :index="'/crm/memberinfo/diagnosis/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_diagnosisrd')">
              诊疗记录
            </el-menu-item>
            <!-- <el-menu-item :index="'/crm/memberinfo/drugrecord/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_drugrecord')">
              用药记录
            </el-menu-item> -->
            <el-menu-item :index="'/crm/memberinfo/inspectrecord/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_inspectrecord')">
              客户上传报告
            </el-menu-item>
            <!-- <el-menu-item :index="'/crm/memberinfo/consultlist/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_consultlistrd')">
              咨询记录
            </el-menu-item> -->
            <el-menu-item :index="'/crm/memberinfo/feedbackinfo/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_feedbacklistrd')">
              反馈记录
            </el-menu-item>
            <el-menu-item :index="'/crm/memberinfo/snslist/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_snslistrd')">
              短信记录
            </el-menu-item>
            <!-- <el-menu-item :index="'/crm/memberinfo/physicallist/' + patientId">
              体检记录
            </el-menu-item> code 文件还在-->
            <el-menu-item :index="'/crm/memberinfo/cliniclist/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_cliniclistrd')">
              消费记录
            </el-menu-item>
            <el-menu-item :index="'/crm/memberinfo/orderlist/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_orderlistrd')" style="border-right:1px solid #ddd;">
              商城订单
            </el-menu-item>
            <el-menu-item :index="'/crm/memberinfo/commoditysuppliesinfo/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_supplylistrd')" style="border-right:1px solid #ddd;">
              商品耗材记录
            </el-menu-item>
            <el-menu-item :index="'/crm/memberinfo/combolist/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_combolist')" style="border-right:1px solid #ddd;">
              套餐记录
            </el-menu-item>
            <el-menu-item :index="'/crm/memberinfo/proofrecords/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_proofrecord')" style="border-right:1px solid #ddd;">
              证明记录
            </el-menu-item>
            <el-menu-item :index="'/crm/memberinfo/shippingaddresses/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_shippingaddress')" style="border-right:1px solid #ddd;">
              收货地址
            </el-menu-item>
            <el-menu-item :index="'/crm/memberinfo/myfollow/' + patientId" v-if="$hasPermission('Auth_menu_crm_member_myfollow')" style="border-right:1px solid #ddd;">
              随访历史
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
      <div id="mainframe" class="layout_inner">
        <transition name="el-fade-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        currentPage: '',
        patientId: ''
      }
    },
    created () {
      this.patientId = this.$route.params.patientId
      this.currentPage = this.$route.path
    },
    components: {
    }
  }
</script>
<style scoped>
  .ml2{padding-left:20px;}
  #memberinfo .mainmenu{border-top:1px solid #ddd;background: #f8f8f8;margin-bottom: 10px;float: left;}
  #memberinfo .mainmenu .el-menu-item{min-width:100px; text-align: center;height: 43px;line-height: 43px;border-right: 1px solid #ddd;border-bottom: none;}
  #memberinfo .mainmenu .el-menu-item:hover,
  #memberinfo .mainmenu .el-menu-item.is-active{border-bottom: none;background: #fff;color: #1C7BEF}
  #memberinfo .mainmenu .el-menu-item:last-child{border-right: none}
  .mainmenu >li {border-bottom:1px solid #ddd !important;}
  .mSex{margin-right:10px;margin-top:5px;}
</style>

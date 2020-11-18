<!-- 套餐、保障计划 详情页面（新建编辑）-->
<template>
  <div style="width: 100%; height: 100%;" class="pos_re">
    <ever-bread-crumb haveReturn="true" showTitle="true" :name="packageName || ($route.meta.type === 'plan' ? '新建保障计划':'新建套餐')"></ever-bread-crumb>
    <div class="layout_inner package-box" style="padding: 0 !improtant;" v-loading.body="packageLoading">
      <el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 10px 15px 15px!important;">
        <el-tab-pane v-if="['/card/marketingplanedit','/card/marketinprotecorderadd', '/card/marketingpackageadd','/card/marketingpackageedit', '/manages/marketingpackageadd','/manages/marketingpackageedit'].includes($route.path) " :disabled="isAdd && Number(activeName) <= 1 && tabShow.show1" label="基本信息" name="1">
          <!-- @transpackagename="handlePackageName" -->
          <basic-info-form @cancel="handleCancel" :packageDetails="packageDetails" :isGroupControl="isGroupControl" @updateInfo="getInfo"></basic-info-form>
        </el-tab-pane>
        <el-tab-pane :disabled="isAdd && Number(activeName) <= 2 && tabShow.show2" :label="$route.meta.type === 'plan' ? '项目内容' : '套餐内容'" name="2">
          <package-content :packageDetails="packageDetails" :isGroupControl="isGroupControl"></package-content>
        </el-tab-pane>
        <el-tab-pane label="套餐计划任务模版" v-if="isGroup == 1 ?isGroup == 1 && $route.query.categoryId === '06' : $route.query.categoryId === '06'" name="3">
          <plan-task ref="plan" :packageDetails="packageDetails"></plan-task>
        </el-tab-pane>
        <el-tab-pane :disabled="isAdd && Number(activeName) <= 3 && tabShow.show3" label="关联机构" name="4" v-if="isGroup == 1">
          <affiliated-organ :packageDetails="packageDetails" :isGroupControl="!!isGroupControl"></affiliated-organ>
        </el-tab-pane>
        <el-tab-pane :disabled="isAdd && Number(activeName) <= 4 && tabShow.show4" label="优惠价" name="5" v-if="$route.query.categoryId !== '06'">
          <discount-price :packageDetails="packageDetails" :isGroupControl="!!isGroupControl"></discount-price>
        </el-tab-pane>
      </el-tabs>
    </div>
    <slide-window
      :width="392"
      :paddingTop="70"
      :show="isShow"
      @getData="handleSlideShow"
      v-if="!isGroupControl && packageDetails && !packageDetails.isClinic" id="packageSilde" v-show="activeName == '2'"
    >
      <template slot="handler">
        <i class="icon iconfont icon-yingxiaogongju-yinyong"></i><span class="ml5 inline-block" style="width:2em">引用</span>
      </template>
      <template slot="default">
        <doctor-advice-template ref="medicalOrder"></doctor-advice-template>
      </template>
    </slide-window>
    <!-- <div v-if="!isGroupControl && packageDetails && !packageDetails.isClinic" id="packageSilde" class="slideWindow" :style="style" v-show="activeName == '2'">
      <div class="btn" v-on:click.stop="triggleLeftFun()" ref='triggleLeftFun' @mousedown="mousedown($event, 'triggleLeftFun')"><i class="icon iconfont icon-yingxiaogongju-yinyong"></i><span class="ml5">引用</span></div>
      <div class="cnt" v-on:click.stop="stopClickEvent($event)">
        <doctor-advice-template ref="medicalOrder"></doctor-advice-template>
      </div>
    </div> -->
  </div>
</template>
<script>
import { PACKAGE_FILE_TYPE } from '@/util/common'
import BasicInfoForm from '@/card/page/marketingpackage/basicinfoform'
import PackageContent from '@/card/page/marketingpackage/packagecontent'
import mousemove from '@/util/mousemove'
import DoctorAdviceTemplate from '@/card/page/marketingpackage/doctoradvicetemplate'
import AffiliatedOrgan from './affiliatedorgan'
import DiscountPrice from './discountprice'
import planTask from './guaranteeplan/plantasktemplate.vue'
import api from '@/card/store/packagemanagement/api'
import SlideWindow from '@/components/slidewindow'

export default {
  components: {
    BasicInfoForm,
    PackageContent,
    DoctorAdviceTemplate,
    AffiliatedOrgan,
    DiscountPrice,
    planTask,
    SlideWindow
  },
  mixins: [mousemove],
  data () {
    return {
      packageName: '', // 套餐名称
      activeName: '1',
      packageId: this.$route.query.packageId, // 套餐ID
      pathRoute: '',
      style: {
        left: 0
      },
      api,
      tabShow: {
        show1: true,
        show2: true,
        show3: true,
        show4: true
      },
      packageDetails: {},
      packageLoading: false,
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0,
      isGroupControl: true,
      isAdd: this.$route.meta.isAdd === 1,
      isTabClick: false,
      isShow: false
    }
  },
  watch: {
    'activeName': {
      handler (val) {
        if (val === '3') {
          this.$refs.plan.getDetails()
        }
      },
      deep: true
    }
  },

  created () {
    this.tabShow.show1 = false
    this.$bus.$on('package-tab', val => {
      if (val) {
        this.activeName = val.name
        if (this.isAdd) {
          this.tabShow['show' + val.name] = false
        }
      }
    })
    if (this.packageId) {
      this.getInfo()
    }
    if (!this.isGroup) { // 查询机构是否可编辑
      api.getClinicManageConfigForRecord({ type: PACKAGE_FILE_TYPE }).then(res => {
        if (res && res.data) this.isGroupControl = (String(res.data.isConfig) === '1')
      })
    } else {
      this.isGroupControl = false
    }
  },
  methods: {
    getInfo (id) {
      this.packageLoading = true
      let packageId = id || this.packageId
      let parms = { id: packageId, isGroup: this.isGroup }
      if (this.$route.meta.type === 'plan') {
        parms.orderId = this.$route.query.orderId
      }
      api.getPackageById(parms).then(result => {
        if (result && result.data) {
          this.packageLoading = false
          this.packageDetails = result.data
          if (result && result.data) this.packageName = result.data.name
        }
      }).catch(_ => {
        this.packageLoading = false
      })
    },
    handleClick (tab, event) {
      this.isTabClick = true
      // this.isShow = true
      // this.style.left = 0
      // this.triggleLeftFun()
      if (tab.name === '3') {
        this.$refs.plan.getDetails()
      } else {
        if (this.packageId) this.getInfo()
      }
    },
    handleCancel () { // 返回列表页
      this.$router.push(this.pathRoute)
    },
    handlePackageName (val) { // 套餐名称

    },
    handleSlideShow () {
      this.$refs.medicalOrder.list()
    }
    // triggleLeftFun () {
    //   if (this.moved) return
    //   if (this.style.left === 0) {
    //     this.style.left = '-392px'
    //   } else {
    //     this.style.left = 0
    //     this.$refs.medicalOrder.list()
    //   }
    // },
    // stopClickEvent (e) { }
  },
  mounted () {
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName + ''
    }
    // if (!this.isGroupControl && this.packageDetails && !this.packageDetails.isClinic) {
    //   this.mousedownInit('triggleLeftFun')
    //   domClickHandle('packageSilde', _ => {
    //     if (this.moved) return
    //     this.style.left = '-392px'
    //   })
    // }
  },
  deactivated () {
    this.$bus.$off('package-tab', {})
  }
}
</script>
<style lang="less" scoped>
.package-box {
  width: 100%;
  height: 94%;
  background-color: #ffffff;
  overflow-y: scroll;
}
// #packageSilde {
//   width: 392px !important;
// }
// .slideWindow {
//   padding-top: 55px;
//   width: 392px;
// }
// .slideWindow .cnt {
//   height: 100%;
//   width: 378px;
//   padding: 0 10px;
//   overflow-y: scroll;
// }
// .slideWindow .btn {
//   position: absolute;
//   left: 392px;
//   top: 150px;
//   width: 46px;
//   font-size: 12px;
//   padding: 10px 10px;
//   background-color: #1c7bef;
//   cursor: pointer;
//   color: #ffffff;
//   z-index: 200;
//   border-radius: 0 4px 4px 0;
// }
</style>

<template>
  <el-container class="fdc" id="app" style="height:100vh" direction="vertical">
    <el-header
      id="el-header"
      height="auto"
      v-if="showNav">
      <ever-nav></ever-nav>
    </el-header>
    <el-main class="layout_main_wrap" :class="{full: $route.meta.full, h: $route.meta.h}">
      <router-view></router-view>
      <ever-account-notice v-if="showNotice"></ever-account-notice>
      <update-tip v-show="tenantStatus"></update-tip>
      <version-tip v-show="visible" :visible.sync="visible">
        <!-- <template slot="tip">
          <p>verHashPost:{{ verHashPost }}</p>
          <p>verHashWin:{{ verHashWin }}</p>
        </template> -->
      </version-tip>
    </el-main>
  </el-container>
</template>

<script>
import everNav from '@/components/nav'
import everAccountNotice from '@/login/page/accountnotice'
import updateTip from '@/login/page/update.tip'
import versionTip from '@/login/page/version.tip'
import nprogress from 'nprogress'
import { renderYoumeng } from '@/util/common'
import watermark from 'watermark-dom'
const watermarkConfig = {
  watermark_txt: '租户升级中',  // 水印的内容
  watermark_color: '#000000',            // 水印字体颜色
  watermark_fontsize: '20px',          // 水印字体大小
  watermark_alpha: 0.1,               // 水印透明度，要求设置在大于等于0.005
  watermark_angle: 35,                 // 水印倾斜度数
  watermark_x: 0,                     // 水印起始位置x轴坐标
  watermark_y: 0,
  monitor: false // true不可删除，false可以删除
}
const watermarkResize = () => {
  watermark.load(watermarkConfig)
}

export default {
  name: 'app',
  data () {
    return {
      showNav: true,
      showNotice: true,
      tenantStatus: false,
      visible: false,
      content: '',
      verHashPost: '',
      verHashWin: '',
      enableYoumengStat: this.$ever.getClinicConfig().enableYoumengStat
    }
  },
  created () {
    if (this.enableYoumengStat !== '0') {
      renderYoumeng()
    }
  },
  watch: {
    '$route.path': {
      handler (val) {
        if (val === '/login' || val === '/reset' || val === '/forgot' || val === '/down' || val === '/upgrade') {
          this.showNav = false
          this.showNotice = false
        } else {
          this.showNav = true
          this.showNotice = true
        }
        if (val.indexOf('follow/task') > -1) {
          this.showNotice = false
        }
      },
      immediate: true
    },
    '$store.state.pending': function (num) {
      if (num > 0) {
        nprogress.start()
      }
      if (num === 0) {
        nprogress.done()
      }
    },
    // '$store.state.updating' (num) {
    //   if (Number(num) === 1) {
    //     this.tenantStatus = true
    //   } else {
    //     this.tenantStatus = false
    //   }
    // },
    '$store.state.tenantStatus' (num) {
      // 111: 维护中，内部访问，前端，动作: 没有特殊动作，只添加app-status头信息
      // 101: 维护中, 外部访问, 前端，动作: 添加app-status头信息，跳到维护页面
      // 110: 维护中，内部访问，后端接口，动作: 没有特殊动作，只添加app-status头信息
      // 100: 维护中，外部访问，后端接口，动作: 添加app-status头信息，所有接口返回 {'errURL':www.baidu.com} (测试数据可以修改)
      var ele = document.getElementById('wm_div_id')
      if (num === '100' || num === '101') {
        window.location = this.$ever.mainIndex + '/login'
        if (ele) {
          watermark.remove()
        }
      } else if (num === '110' || num === '111') {
        this.renderWaterMask()
      } else {
        if (ele) {
          watermark.remove()
        }
      }
    },
    '$store.state.versionHash' (val) {
      this.verHashPost = val
      this.verHashWin = window.version_info
      if (!val || !this.verHashWin) return // 阻止刷新闪现跳出
      if (val !== (this.verHashWin)) {
        if (this.timeout) return
        this.timeout = setTimeout(() => {
          this.visible = true
          clearTimeout(this.timeout)
          this.timeout = ''
        }, 30000) // 30秒后提示更新
      }
    }
  },
  methods: {
    renderWaterMask () {
      watermark.load(watermarkConfig)
      watermark.init(watermarkConfig)
      window.addEventListener('resize', watermarkResize)
    }
  },
  components: {
    everNav,
    everAccountNotice,
    updateTip,
    versionTip
  }
}
</script>

<style scoped>
/* z-index 没有规划，互相覆盖 todo 规范 */
.el-header {
  width: 100%;
  padding: 0;
  box-shadow: 0 5px 9px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
  text-align: center;
}
</style>

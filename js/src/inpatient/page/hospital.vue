<template>
  <div class="station_layout_wrap hospital_wrap" :class="{full: $route.matched[1] && $route.matched[1].meta.fullscreen}">
    <router-view class="station_layout_wrap" :key="key" type="zy" :space="space" v-if='show || !shadow'></router-view>
    <el-dialog v-if="shadow" :title="`选择${text}`" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true"  @close='returnback' width="400px">
      <div class="clearfix" style="lineHeight:40px">
        <span style="float:left">选择{{text}}</span>
        <switchward :text='text' ref="switchward1"  :space="space"></switchward>
      </div>
    </el-dialog>
    <div v-if="shadow" v-show="$route.query.from !== 'medicalReview'" class="switchWardRightBar" :class="openss ? 'switchWardRightBaractive':''" ref='switchWardRightBar' @mousedown='mousedown($event,"switchWardRightBar")'>
      <div class="rbl" @click="clickRight">切换{{text}}</div>
      <div class="clearfix">
        <span style="float:left">选择{{text}}</span>
        <switchward :text='text' :space="space" ref="switchward2" @close="close2"></switchward>
      </div>
    </div>
  </div>
</template>

<script>
// import Hospitalnav from './hospitalnav.vue'
import session from '../../util/session'
import storage from '@/util/storage.js'
import switchward from '@/inpatient/components/switch.ward'
import { domClickHandle } from '@/util/common'
// // 公共组件 bus 调用
// import dialogPackedBed from '@/inpatient/components/dialog-packed-bed' // 包床
// import dialogChangeBed from '@/inpatient/components/dialog-change-bed' // 换床
// import indepartDrag from '@/inpatient/components/dialog-indepart-drag' // 患者入科
// import outOf from '@/inpatient/components/out.of' // 出科
import mousemove from '@/util/mousemove'
export default {
  components: {
    switchward,
  },
  mixins: [session, mousemove],
  watch: {
    '$route.path': {
      handler (val) {
        this.shadow = !(this.$route.matched[0].meta.route === 'case' || !(this.$route.matched[1] && this.$route.matched[1].meta && this.$route.matched[1].meta.needSelectProvider === 'yes'))
        if (val) this.setVisible()
      },
    }
  },
  data () {
    return {
      options: [],
      value: '',
      dialogVisible: false,
      show: false,
      openss: false,
      key: new Date().getTime(),
      space: '',
      text: '病区',
      shadow: true
    }
  },
  created () {
    this.shadow = !(this.$route.matched[0].meta.route === 'case' || !(this.$route.matched[1] && this.$route.matched[1].meta && this.$route.matched[1].meta.needSelectProvider === 'yes'))
    this.space = this.$route.matched[0].meta.space || 'inpatient'
    this.text = this.space === 'inpatient' ? '病区' : '科室'
    this.setVisible()
    domClickHandle('switchWardRightBar', _ => {
      this.openss = false
    })
    this.$bus.$off('hospital_dialogVisible_open', this.open)
    this.$bus.$on('hospital_dialogVisible_open', this.open)
    this.$bus.$off('hospital_dialogVisible_close', this.close)
    this.$bus.$on('hospital_dialogVisible_close', this.close)
    let str = storage.getLocalStorage(`${this.space}Key`)
    if (str) this.key = str.split(',')[0]
  },
  mounted () {
    this.mousedownInit('switchWardRightBar')
  },
  methods: {
    returnback () {
      if (!storage.getLocalStorage(`${this.space}Key`)) {
        location.href = this.$ever.mainIndex + '/myclinic'
        this.dialogVisible = true
      }
    },
    setVisible () {
      if (!this.show) return
      if (this.$route.query.from === 'medicalReview') return
      this.dialogVisible = !storage.getLocalStorage(`${this.space}Key`)
    },
    clickRight () {
      if (this.moved) return
      this.openss = !this.openss
      this.$refs.switchward2.init()
    },
    keys (key) {
      if (key === '-1') return// -1是from=medicalReview 过来的患者也不能清空
      if (this.$route.query.from === 'msg') return // 消息跳转的也不清空
      if (this.key !== key) {
        this.$router.push({
          path: this.$route.path
        })
      }
      this.key = key
    },
    open () {
      this.dialogVisible = true
    },
    close (key) {
      this.show = true
      this.dialogVisible = false
      this.keys(key)
    },
    close2 (key) {
      this.openss = false
      this.keys(key)
    }
  }
}
</script>
<style lang="scss">
.hospital_wrap {
  background-color: #e9eef1;
  height: 100%;
  // overflow: hidden;
  .el-container {
    height: 100%;
  }
  .switchWardRightBar{
    z-index:11;
  }
}
</style>


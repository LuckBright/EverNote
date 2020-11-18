<template>
  <div class="full">
    <div id='oldmenzhen' :class="{flex_column_full: $route.name === 'patientcase'}" v-if='width == "double"' :key='key'>
      <workspaceTopBar @changeType='changeType' :width='width'></workspaceTopBar>
      <maincom ref='maincom' class="flex_col_1" style="height: 0px" :space='space'></maincom>
    </div>
    <div id='newmenzhen' :class="{flex_column_full: $route.name === 'patientcase'}" v-else :key='key'>
      <workspaceTopBar @changeType='changeType' :width='width'></workspaceTopBar>
      <mainnew ref='mainnew' class="flex_col_1" :space='space'></mainnew>
    </div>
    <div class="changeType" @click='changeType' v-if="!$route.query.examType || $route.query.examType!=='1'" ref='changeType' @mousedown='mousedown($event,"changeType")'>
      <i class="iconfont icon-qieping" style="color:#fff"></i>
    </div>
    <el-dialog
      title="请选择科室"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      width="400px"
      @close='returnback'>
      <switchComp :space='space'  @close='rightSwithClose' @open='openDialog'></switchComp>
    </el-dialog>
    <div class="workspace_right_bar" :class="rightSwitch ? 'active':''" ref='workspace_right_bar' @mousedown='mousedown($event,"workspace_right_bar")'>
      <div class="bar_switch" @click="rightSwitchBtn">切换科室</div>
      <switchComp ref='switchComp' @close='rightSwithClose' @open='openDialog' :space='space'></switchComp>
    </div>
  </div>
</template>
<script>
import maincom from './main.vue'
import mainnew from './main.new'
import workspaceTopBar from '@/workspace/page/workspace_top_bar.vue'
import storage from '@/util/storage.js'
import mousemove from '@/util/mousemove'
import switchComp from '@/workspace/components/switch.vue'
import { domClickHandle } from '@/util/common'
export default {
  props: ['space'],
  mixins: [mousemove],
  data () {
    return {
      key: 0,
      width: storage.getLocalStorage('YIHU_WIDTH') || ((this.$route.query.examType && this.$route.query.examType === '1') && 'double') || 'single',
      storage,
      formObjUpdate: false,
      dialogVisible: false,
      rightSwitch: false,
      sesstionKey: ''
    }
  },
  methods: {
    returnback () {
      if (!storage.getLocalStorage(`workspaceKey`)) {
        location.href = this.$ever.mainIndex + '/myclinic'
        this.dialogVisible = true
      }
    },
    rightSwitchBtn () {
      if (this.moved) return
      this.rightSwitch = !this.rightSwitch
      this.$refs.switchComp.open()
    },
    rightSwitchInit () {
      if (this.$route.query.from === 'kanban') {
        let obj = {}
        obj.id = this.$route.query.dptId
        obj.name = this.$route.query.dptName
        obj.doctorId = this.$store.state.currentUser.userId
        storage.setLocalStorage(`${this.space}Key`, `${obj.id},${obj.name},${obj.doctorId}`)
      }
      let str = storage.getLocalStorage(`${this.space}Key`)
      if (!str) {
        // this.dialogVisible = true
        this.queryClear()
      } else {
        let arr = str.split(',')
        if (!this.$store.state.currentUser.userId) return
        if (arr[2] !== this.$store.state.currentUser.userId) {
          localStorage.removeItem(this.sesstionKey)
          this.queryClear()
          // this.dialogVisible = true
        }
      }
    },
    queryClear () {
      this.$router.push({
        path: this.$route.path,
        query: {}
      })
    },
    openDialog () {
      this.dialogVisible = true
    },
    rightSwithClose (flag) {
      this.key++
      this.dialogVisible = false
      if (!flag) {
        sessionStorage.removeItem('outpatientUrlParams')
        this.$router.push({
          path: this.$route.path
        })
      }
    },
    changeType () {
      if (this.moved) return
      if (this.formObjUpdate) {
        this.$confirm('页面尚有信息未保存，切换后信息将会被清空，是否切换？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          sessionStorage.setItem('yihuchangType', 1)
          this.width = this.width === 'double' ? 'single' : 'double'
          storage.setLocalStorage('YIHU_WIDTH', this.width)
          this.formObjUpdate = false
        }).catch(() => {

        })
      } else {
        sessionStorage.setItem('yihuchangType', 1)
        this.width = this.width === 'double' ? 'single' : 'double'
        storage.setLocalStorage('YIHU_WIDTH', this.width)
        this.formObjUpdate = false
      }
    }
  },
  created () {
    this.sesstionKey = `${this.space}Key`
  },
  mounted () {
    this.mousedownInit('changeType')
    this.$bus.$off('workspace:index:changbingli')
    // this.$bus.$off('workspace:index:changbinglioff')
    this.$bus.$on('workspace:index:changbingli', update => {
      this.formObjUpdate = update
    })
    // this.$bus.$on('workspace:index:changbinglioff', patientId => {
    //   this.formObjUpdate = false
    // })
    this.mousedownInit('workspace_right_bar')
    this.rightSwitchInit()
    domClickHandle('workspace_right_bar', _ => {
      this.rightSwitch = false
    })
  },
  watch: {
    '$route.query': {
      handler (val) {
        // this.key++
        this.formObjUpdate = false
      },
      immediate: true
    },
    '$store.state.currentUser.userId': {
      handler (val) {
        this.rightSwitchInit()
      },
      immediate: true
    },
  },
  components: {
    maincom,
    mainnew,
    workspaceTopBar,
    switchComp
  }
}
</script>

<style scoped lang="scss">
.workspace_wrap{
  .workspace_right_bar {
    display: flex;
    // align-items: flex-end;
    position: fixed;
    right: -175px;
    top: 80%;
    width: 200px;
    padding-right:5px;
    background: #fff;
    transition: all ease-out 0.3s;
    box-shadow: -4px 4px 10px 2px rgba(0, 0, 0, 0.2);
    border-radius: 4px 0 0px 4px;
    overflow: hidden;
    z-index: 102;
    &.active {
      right: 0;
    }
    span {
      padding-left: 10px;
    }
    .bar_switch {
      color: #fff;
      width: 20px;
      text-align: center;
      font-size: 14px;
      padding: 12px 5px;
      background: #1c7bef;
      cursor: pointer;
    }
  }
}
.changeType {
  position: fixed;
  bottom: 5%;
  right: 0;
  z-index: 102;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #96acdf;
  line-height: 36px;
  text-align: center;
}
</style>

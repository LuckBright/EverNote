<template>
  <div class="containHeight" @click.native="getpackStatus">
    <div class="flex_layout_full">
      <el-aside width="310px" class="searchlist" :class="{'showlist':showlist}">
        <patient-list></patient-list>
        <el-button
          type="primary"
          icon="el-icon-d-arrow-left"
          class="leftbtn"
          @click="showlistClick"
        ></el-button>
      </el-aside>
      <el-container style="background: #fff; margin-left:10px;">
        <el-header style="font-size: 12px;height:auto;padding:0;background: #ebedef;">
          <common-head
            v-if="$route.query.patientId"
            :patientId="$route.query.patientId"
            :visitNumber="$route.query.visitNumber"
            code="003"
            :key="$route.query.visitNumber"
          ></common-head>
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            :router="false"
          >
            <el-menu-item index="/rcm/reconstruct/peddingsettlement">
              <div :class="obj.existPendingCharges?'subscript':''"></div>待结算
            </el-menu-item>
            <el-menu-item index="/rcm/reconstruct/refunded">
              <div :class="obj.existPendingRefounds?'subscript':''"></div>待退费
            </el-menu-item>
            <el-menu-item index="/rcm/reconstruct/settled">已结算</el-menu-item>
          </el-menu>
        </el-header>
        <div class="flex_layout_full">
          <div class="routerview" style="width:100%">
            <router-view :time="Date.now()" ref="outpatientfee"></router-view>
          </div>
        </div>
      </el-container>
    </div>
  </div>
</template>
<script>
import patientList from '@/rcm/page/outpatientSettlement/patientlist'
import CommonHead from '@/inpatient/components/common.head.js'
let schema = [
  {
    label: '患者姓名',
    name: 'patientid',
    placeholder: '输入患者姓名',
    type: 'patientselect',
    options: []
  }
]
export default {
  components: {
    patientList,
    CommonHead
  },
  watch: {
    $route: {
      handler: function (val, oldval) {
        if (val.query && val.query.showlist) {
          this.showlist = true
        }
        this.activeIndex = val.path
        this.obj.existPendingCharges = false
        this.obj.existPendingRefounds = false
        this.queryParams = this.$route.query
      },
      immediate: true
    },
  },
  filters: {
    filterstatus (val) {
      // 除了自费结算进行中的状态 0, '自费结算' 1, '医保结算' 2, '商保结算' 3, '待付款' 4, '已付款' 5, '待退费' 6,'已退费' 7, '大客户结算'
      switch (Number(val)) {
        case 0:
          return '自费结算'
        case 1:
          return '医保结算'
        case 2:
          return '商保结算'
        case 3:
          return '待付款'
        case 4:
          return '已付款'
        case 5:
          return '待退费'
        case 6:
          return '已退费'
        case 7:
          return '大客户结算'
      }
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.requestSwitch = true
    return {
      querySchema: schema,
      queryObj: obj,
      // 新页面
      activeIndex: '',
      queryParams: this.$route.query,
      obj: {
        memberCardFeeBalance: 0,
        point: 0,
        settleStatus: 0,
        settlecode: '',
        unpaidMealFlag: '',
        existPendingCharges: false,
        existPendingRefounds: false,
      },
      showlist: false,
      loading: null,
    }
  },
  mounted () {
    this.$bus.$off('bill:obj')
    this.$bus.$on('bill:obj', v => {
      Object.assign(this.obj, v)
    })
  },
  methods: {
    showlistClick () {
      this.showlist = !this.showlist
    },
    getpackStatus () {
      this.loading.close()
      document.onclick = null
      if (this.$refs.outpatientfee.$refs.settled) {
        this.$refs.outpatientfee.$refs.settled.handleRouterRange()
      } else {
        this.$refs.outpatientfee.handleRouterRange()
      }
    },
    handleSelect (key, keyPath) {
      let showDetail = 0
      if (key === '/rcm/reconstruct/peddingsettlement') {
        if (this.queryParams.settlementid) {
          delete this.queryParams.settlementid
        }
      } else if (key === '/rcm/reconstruct/refunded') {
        if (this.queryParams.settlementid) {
          delete this.queryParams.settlementid
        }
      } else if (key === '/rcm/reconstruct/settled') {
        showDetail = 1
      }
      this.$router.push({
        path: key,
        query: {
          ...this.queryParams,
          ...{ showDetail: showDetail }
        }
      })
    }
  }
}
</script>
<style scoped>
.searchlist {
  background: #fff;
  overflow: unset;
  position: relative;
  transition: all linear 0.1s;
}
.billheader /deep/ .form.ever_query_from .el-form-item {
  margin-top: 10px;
}
.containHeight .el-header /deep/ .el-form {
  background-color: #eaeaea;
}
.containHeight .el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
  font-weight: 500;
}
.containHeight .el-container.is-vertical {
  position: relative;
  height: 100%;
}
.containHeight .el-menu-demo .is-active {
  background-color: #f4f4f4;
}
.el-menu-demo {
  background-color: #f4f4f4;
  margin-top: 10px;
  background: #ebedef;
}
.containHeight .el-menu-demo .el-dropdown-menu__item--divided:before,
.el-menu,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: #f4f4f4;
}
.routerview {
  height: 100%;
}
.el-menu-demo /deep/ .el-menu-item:not(.is-disabled):hover,
.el-menu-demo /deep/ .el-menu-item:not(.is-disabled):focus {
  border-bottom: 2px solid #1c7bef !important;
}
.containHeight /deep/ .el-menu--horizontal > .el-menu-item.is-active {
  color: #1c7bef !important;
}
.message {
  color: #f56c6c;
  font-weight: 500;
}
.containHeight /deep/ .slotClass {
  height: 28px;
}
.containHeight /deep/ .slotClass .el-button {
  padding: 0;
}
.subscript {
  border-radius: 50%;
  padding: 5px;
  background: #f56c6c;
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 5px;
}
.leftbtn {
  position: absolute;
  right: -24px;
  top: 0;
  z-index: 1000;
}
.el-button.leftbtn {
  padding: 4px 4px;
}
.showlist {
  margin-left: -320px;
}
.flex_layout_full {
  overflow: hidden;
}
</style>


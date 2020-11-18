<template>
  <div class="flowchart">
    <div class="row clearfix" v-if="status!==1">
      <div
        class="flow-item"
        :class="[`flow-status-${item.status}`,{'current':item.sort==stepSettleStatus}]"
        v-for="(item,index) in patientIdentity"
        :key="index"
        @click="stepClick(item,index)"
      >
        <div>{{item.name}}</div>
      </div>
      <div class="iconRight">
        <el-button
          type="text"
          class="discountfee"
          @click="discountdialogbtn"
          v-if="settleStatus==0&&(!recollect)&&!hasStatus(1)&&!hasStatus(2)&&!this.hasStatus(7)"
          icon="icon iconfont icon-nav-jigou-zhekou"
        >打折</el-button>
        <el-badge
          value="未支付"
          :hidden="!(unpaidPackage&&settleStatus==0)"
          :class="{unpaidPackage:unpaidPackage}"
        >
          <el-button
            type="text"
            class="tc"
            @click="packagebtn"
            v-if="settleStatus==0"
            icon="icon iconfont icon-chanjian tc"
          >套餐及保障计划</el-button>
        </el-badge>
      </div>
    </div>
    <discountdialog :discountvisiable.sync="discountvisiable" v-bind="$attrs" v-on="$listeners"></discountdialog>
    <packageproject
      :packagevisiable.sync="packagevisiable"
      v-bind="$attrs"
      @afterPaid="selectOrderByPatient"
    ></packageproject>
  </div>
</template>
<script>
import discountdialog from '@/rcm/page/outpatientSettlement/discountdialog.vue'
import packageproject from '@/rcm/page/outpatientSettlement/package.vue'
import mealApi from '@/workspace/store/set.meal.api'
export default {
  props: {
    patientIdentity: {
      type: Array,
      default () {
        return []
      }
    },
    jumpStep: {
      type: Number,
      default: 0
    },
    settleStatus: {
      type: Number,
      default: 0
    },
    id: {
      type: String,
      default: ''
    },
    recollect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 0未结1已结2跳过
      discountvisiable: false,
      packagevisiable: false,
      status: this.$route.meta.status,
      setMealArr: []
    }
  },
  computed: {
    stepSettleStatus: {
      get () {
        return this.settleStatus
      },
      set (v) {
        this.$emit('update:settleStatus', Number(v))
      }
    },
    unpaidPackage: {
      get () {
        return this.setMealArr.some(item => item.status === '未支付')
      }
    }
  },
  methods: {
    async stepClick (item, index) {
      // 不允许切换身份了
    },
    // 自费批量打折
    discountdialogbtn () {
      this.discountvisiable = true
    },
    // 套餐列表
    packagebtn () {
      this.packagevisiable = true
    },
    // 查询是否有未支付套餐
    async selectOrderByPatient () {
      let queryParams = this.$route.query
      if (queryParams.patientId) {
        let params = {
          patientId: queryParams.patientId,
          deptCode: queryParams.dptId
        }
        const res = await mealApi.selectOrderByPatient(params)
        if (res && res.data && res.data.length) {
          this.setMealArr = res.data
        } else {
          this.setMealArr = []
        }
      }
    },
    hasStatus (status) {
      return this.patientIdentity.filter(v => v.sort === status && v.status === 1).length > 0
    }
  },
  mounted () {
    // 查询套餐情况
    this.selectOrderByPatient()
  },
  components: {
    discountdialog,
    packageproject
  },
  watch: {
    '$route.meta.status': {
      handler: function (newVal, oldVal) {
        this.status = newVal
      },
      immediate: true
    }
  }
}
</script>
<style scoped>
.row:before {
  display: table;
  content: " ";
}
.flowchart {
  min-width: 500px;
  margin-left: 10px;
  position: relative;
  font-size: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.flowchart .iconRight {
  float: right;
}
.flowchart .iconRight .discountfee,
.flowchart .iconRight .tc {
  font-size: 14px;
  color: #666;
  text-decoration: none;
  padding: 0;
}
.flowchart .iconRight .unpaidPackage {
  margin-right: 35px;
}
.flowchart .iconRight .discountfee:hover,
.flowchart .iconRight .tc:hover {
  color: #1c7bef !important;
}
.flow-item {
  float: left;
  width: 8%;
  max-width: 180px;
  text-align: center;
  padding-right: 5px;
  cursor: pointer;
}

.flow-item > div {
  position: relative;
  padding: 0px 0 0px 12px;
  line-height: 24px;
  background: #90a4ae;
  white-space: nowrap;
  overflow: visible;
  color: #fff;
}
.flow-item > div:before,
.flow-item > div:after {
  content: " ";
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 12px 0 12px 12px;
  border-color: transparent transparent transparent #90a4ae;
  position: absolute;
  left: 0;
  top: 0;
}

.flow-item > div:before {
  border-left-color: #fff;
  z-index: 1;
}
.flow-item > div:after {
  left: auto;
  right: -12px;
  z-index: 2;
}
*,
:after,
:before {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  /* box-sizing: border-box; */
}

.row .flow-item:first-child > div:before {
  display: none;
}
.flow-status-0 > div {
  background: #deeeff;
  color: #1c7bef;
}
.flow-status-0 > div:after {
  border-left-color: #deeeff;
}
.flow-status-1 > div {
  background: #dddddd;
  color: #666666;
}
.flow-status-1 > div:after {
  border-left-color: #dddddd;
}
.flow-status-2 > div {
  background: #fff2dc;
  color: #f27700;
}
.flow-status-2 > div:after {
  border-left-color: #fff2dc;
}
.current > div {
  background: #1c7bef;
  color: #ffffff;
}
.current > div:after {
  border-left-color: #1c7bef;
}
</style>


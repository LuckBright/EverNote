<template>
  <div class="layout_inner oxhya">
    <div class="panel-body">
      <h4 class="tit">审批详情</h4>
      <div class="cnt">
        <p><span class="ti">审批单名称：</span><span>{{ detailObject.processName }}</span></p>
        <p><span class="ti">发起人姓名：</span><span>{{ detailObject.initiatorName }}</span></p>
        <p><span class="ti">发起时间：</span><span>{{ $moment(Number(detailObject.startTime)).format("YYYY-MM-DD HH:MM:SS") }}</span></p>
        <p><span class="ti">业务编号：</span><span>{{ detailObject.businessCode }}</span></p>
        <p><span class="ti"></span><span><el-button type="primary" size="small" @click="goDetailUrl(detailObject.formUrl)">查看详情</el-button></span></p>
      </div>
      <div style="max-width: 700px">
        <approval-flows :processInstanceId="processInstanceId" @getProcessObj="getObj" @onSubmit="submitFn"></approval-flows>
      </div>
    </div>
  </div>
</template>
<script>
import approvalFlows from '@/message/page/approval.flows.vue'
import staticvars from '@/store/staticvars'

export default {
  components: {
    approvalFlows
  },
  data () {
    return {
      processInstanceId: this.$route.params.processInstanceId,
      detailObject: {}
    }
  },
  methods: {
    // 查看详情页面
    goDetailUrl (url) {
      // url 为 /rcm/index.html#/systemset/setlist/fsd111122
      window.open(staticvars.prefix + url)
    },
    // 根据状态显示不同图标
    getObj: function (val) {
      this.detailObject = val
    },
    // 审核通过之后的监听方法
    submitFn: function () {
      window.close()
    }
  }
}
</script>
<style scoped>
p {
  margin: 0;
}
.tit {
  border-left: 3px solid #1c7bef;
  padding-left: 5px;
  font-size: 14px;
  margin: 10px 0;
}
.cnt {
  line-height: 30px;
  color: #333;
  font-size: 14px;
}
.cnt p .ti {
  color: #666;
  display: inline-block;
  width: 8em;
  text-align: right;
}
</style>

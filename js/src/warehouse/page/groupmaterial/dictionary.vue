<template>
  <div>
    <ever-bread-crumb :name="breadCrumbName" path="/group/materials" showTitle="true" :pathTo="true"></ever-bread-crumb>
    <wh-form-custom :systemType="STENCIL_TYPE[0].id" :customApi="materialDictSpuApi" :customType="STENCIL_TYPE[0].name" :isSearch="true" backListRoute="/group/materials/"></wh-form-custom>
  </div>
</template>
<script>
import materialDictSpuApi from './store/materialdictspuapi'
import whFormCustom from '@/warehouse/page/components/whformcustom.vue'
import {STENCIL_TYPE} from '@/util/common'
export default {
  data () {
    return {
      breadCrumbName: this.$route.params.id ? `编辑${STENCIL_TYPE[0].name}` : `新建${STENCIL_TYPE[0].name}`,
      materialDictSpuApi,
      STENCIL_TYPE
    }
  },
  components: {
    whFormCustom
  }
}
</script>
<style lang="scss" scoped>
.query-model { background: #f4f4f4; width: calc(100% + 40px); margin-left: -120px; padding: 20px 40px; border-radius: 4px;}
.primary-info { margin: 0; margin-left: -100px; margin-top: -20px; }
.hr.primary-info { margin: 0; margin-left: -120px; margin-top: 10px; margin-bottom: 30px; width: calc(100% + 120px) }
.red { color: #e43}
.necessary {
  margin: 0 20px;
  min-height: 30px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px 20px;
  .title {
    line-height: 30px;
    height: 30px;
    font-size: 14px;
    color: #999;
    .require {
      color: #000
    }
    span:last-child {
      padding-left: 30px
    }
  }
  .content {
    ul.list {
      padding-bottom: 10px;
    }
    .el-tag {
      margin-bottom: 10px;
    }
  }
}
.necessary /deep/ .el-tag, .list-item.fl /deep/ .el-tag {
  height: 30px;
  line-height: 28px;
  padding: 0;
  padding-right: 10px;
  span { display: inline-block; padding-left: 10px;}
}
.queryClass {min-width: 220px; display: inline-block; margin-right: 5px}
// ul, li {list-style-type: none; margin: 0; padding: 0}
.steps { padding: 30px 0; padding-bottom: 50px}
.steps-box ul li { display: inline; line-height: 24px; color: #999}
.steps-box ul li .line { background: #e9e9e9; height: 3px; display: inline-block; margin: 0 50px; margin-top: 10px; width: 50%}
.circle { width: 24px; height: 24px; border-radius: 50%; background: #e9e9e9; display: inline-block; text-align: center; color: #bbb; margin-right: 10px}
.steps-box ul li.active { color: #1C7BEF}
.steps-box ul li.active .circle, .steps-box ul li.active .line { background: #1C7BEF; color: #fff;}
.titleBtn {transform: rotate(180deg); display: inline-block; margin-left: 5px;
  .iconfont {font-size: 12px}
}
.titleBtn.active {transform: rotate(270deg); animation: animated .35s}
.titleBtn.visited {transform: rotate(180deg); animation: animated_back .35s}
.list-item.fl {margin-top: 10px; margin-right: 10px}
@keyframes animated
{
from {transform: rotate(180deg);}
to {transform: rotate(270deg);}
}
@keyframes animated_back
{
from {transform: rotate(270deg);}
to {transform: rotate(180deg);}
}
</style>

<template>
  <div class="com-im-cus-confirm">
    <template v-if="roleType == ROLE_TYPE[1]">
      <div class="title">是否已经完成看诊？</div>
      <div class="desc">是否已经为您本次就诊提供了足够的帮助？</div>
      <div class="button">
        <div class="active">是</div>
        <div>否</div>
      </div>
    </template>
    <template v-else-if="roleType == ROLE_TYPE[2]">
      <div class="title">等待用户确认完成看诊...</div>
      <div class="desc">超时自动确认</div>
    </template>
  </div>
</template>

<script>
import { ROLE_TYPE } from '../util/models'

export default {
  props: {
    msgData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      ROLE_TYPE,
      roleType: localStorage.getItem('roleType')
    }
  }
}
</script>

<style lang="scss" scoped>
  .com-im-cus-confirm {
    width: 225px;
    padding: 12.5px;
    background-color: #fff;
    border-radius: 4px;
    .title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #000;
      margin-bottom: 12px;
    }
    .desc {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333;
    }
    .button {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      > div {
        width: 180px;
        height: 30px;
        border-radius: 4px;
        text-align: center;
        line-height: 30px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        background-color: #EAEAEB;
        color: #1C7BEF;
      }
      .active {
        background-color: #1C7BEF;
        margin-bottom: 12px;
        color: #fff;
      }
      > div:active {
        opacity: .7;
      }
    }
  }
</style>

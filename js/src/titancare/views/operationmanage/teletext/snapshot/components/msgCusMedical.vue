<template>
  <!-- 病历-->
   <div class="com-im-cus-medical">
    <div class="im-medical-content">
      <div class="name">
        <label>{{msgData.title || ''}}的病历</label>
      </div>
      <div class="content">
        <p class="title">诊断：<span class="txt">{{msgData.diagnosis || ''}}</span></p>
      </div>
      <div class="content">
        <p class="title">主诉：<span class="txt">{{msgData.mainComplaint || ''}}</span></p>
      </div>
    </div>
    <div class="medical-btn">查看详情</div>
  </div>
</template>
<script>
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
    }
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.com-im-cus-medical{
    width: 225px;
    background-color: #fff;
    border-radius: 4px;
    .im-medical-content{
      padding: 12.5px;
      .name{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #000000;
        text-align: left;
        font-weight: 700;
      }
      .content {
        margin-top: 7.5px;
        line-height: 14px;
        .title {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #999999;
          line-height: 18px;
          .txt {
            display:inline-block;
            max-width: 70%;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            line-height: 18px;
            color: #666;
            text-align: justify;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
          }
        }
      }
    }
    .medical-btn {
      padding: 12.5px 0;
      font-size: 12px;
      text-align: center;
      border-top:0.5px solid #DDDDDD;
    }
  }
</style>

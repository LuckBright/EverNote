<template>
  <div id="medicalRecord" class="pl15">
    <el-row class="title_history">
      <span></span>
      <div class="fl">{{$t('就诊历史')}}</div>
    </el-row>
    <diagnosis
      ref="diagnosis"
      @quote="quoteHandle"
      @treat="treat"
      :disabled="disabled"
      @getRecord="$emit('getRecord')"
      @openReport="openReport"
    ></diagnosis>
  </div>
</template>
<script>
import diagnosis from '@/workspace/components/diagnosis'
export default {
  props: ['disabled'],
  data () {
    return {
      activeName: 'history'
    }
  },
  methods: {
    openReport (value) {
      this.$emit('openReport', value)
    },
    quoteHandle (data) {
      this.$emit('quote', data)
    },
    treat (data) {
      this.$emit('treat', data)
    }
  },
  components: {
    diagnosis
  }
}
</script>
<style lang='scss'>
#medicalRecord {
  .title_history {
    font-size: 14px;
    line-height: 45px;
    span {
      float: left;
      width: 4px;
      height: 14px;
      background: #1c7bef;
      margin-right: 5px;
      margin-top: 15px;
    }
  }
}
</style>

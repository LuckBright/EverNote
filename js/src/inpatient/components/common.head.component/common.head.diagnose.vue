<template>
  <el-tooltip placement="bottom" effect="dark" :open-delay="500">
    <span>
      <span class="common-head-def-label">{{$t('主诊断')}}：</span><span class="common-head-def-value" v-if="zhenduanArr[0]">
      {{zhenduanArr[0]|formatLang('diseaseName', true)|formatDiagnosis(zhenduanArr[0])}}
      </span><span class="common-head-def-value" v-else>--</span>
    </span>
    <div slot="content">
      <span v-for="(item,index) in zhenduanArr" :key="item.id">
        <el-row v-if="index === 0">主诊断:{{item|formatLang('diseaseName', true)}}</el-row>
        <el-row v-else>其他诊断：{{item|formatLang('diseaseName', true)}}</el-row >
      </span>
    </div>
  </el-tooltip>
</template>
<script>
  export default {
    props: {
      itemConfig: {
        type: Object,
      },
      itemData: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    data () {
      return {
        zhenduanArr: []
      }
    },
    created () {
    },
    watch: {
      'itemConfig.value': {
        handler (val) {
          if (val) {
            try {
              this.zhenduanArr = JSON.parse(val)
            } catch (err) {
              this.zhenduanArr = []
            }
          }
        },
        deep: true
      },
    }
  }
</script>
<style></style>

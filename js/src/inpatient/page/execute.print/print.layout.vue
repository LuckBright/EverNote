<template>
  <div class="advice_manage_wrap flex_column_full_hidden row">
    <div class="patient_list">
      <listWaiting
        :from='from'
        :titleArr='titleArr'
        :areaId="areaId"
        :isCancel='true'
        @waitingdbclick="waitingdbclick"
      ></listWaiting>
    </div>
    <div class="advice_con flex_col_1">
      <router-view :from='from' :base-info="baseInfo"></router-view>
    </div>
  </div>
</template>
<script>
  import listWaiting from '@/inpatient/components/list.waiting.new'
  import { getQueryUrl } from '@/inpatient/util/inpatientConfig'

  export default {
    props: ['from'],
    data () {
      return {
        activeIndex: this.$route.name,
        titleArr: ['病区患者'],
        baseInfo: {},
        areaId: null
      }
    },
    created () {
      this.baseInfo = getQueryUrl(this.$route.query)
      let inpatientKey = localStorage.getItem('inpatientKey')
      if (inpatientKey) {
        this.areaId = inpatientKey.split(',')[0] || null
      }
    },
    watch: {
      activeIndex (val) {
        if (this.baseInfo) {
          this.$router.replace({
            path: this.$route.path,
            query: {
              ...this.baseInfo
            }
          })
        } else {
          this.$router.push(this.$route.path)
        }
      },
      '$route.name' (val) {
        this.activeIndex = val
      }
    },
    components: {
      listWaiting
    },
    methods: {
      waitingdbclick (data) {
        this.baseInfo = getQueryUrl(data)
        this.$router.replace({
          path: this.$route.path,
          query: {
            ...this.baseInfo
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .advice_manage_wrap{
    height: 100%;
    overflow: hidden;
    .advice_con{
      width: 100%;
      overflow-x: auto;
      height: 100%;
    }
  }
</style>

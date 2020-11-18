<template>
  <div class="advice_manage_wrap flex_column_full_hidden row">
    <div class="patient_list" v-if="from !== 'birth_nurse'">
      <listWaiting
        :from='from'
        :titleArr='titleArr'
        :areaId="areaId"
        :isCancel='true'
        @waitingdbclick="waitingdbClick"
      ></listWaiting>
    </div>
    <div class="advice_con flex_col_1">
      <router-view :from='from' :base-info="baseInfo" :hospitalized-number-list="hospitalizedNumberList" :clear-info="clearBaseInfo"></router-view>
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
        areaId: null,
        hospitalizedNumberList: []
      }
    },
    created () {
      this.baseInfo = getQueryUrl(this.$route.query)
      let inpatientKey = localStorage.getItem('inpatientKey')
      if (inpatientKey) {
        this.areaId = inpatientKey.split(',')[0] || null
      }
      this.$bus.$off('get_bq_list')
      this.$bus.$on('get_bq_list', (list) => {
        if (list && list.length) {
          this.hospitalizedNumberList = []
          list.forEach(item => {
            this.hospitalizedNumberList.push(item.hospitalizedNumber)
          })
        }
      })
    },
    watch: {
      activeIndex (val) {
        let str = this.from === 'birth_nurse' ? '/birth_nurse/advice/' : '/inpatient/advice/'
        if (this.baseInfo) {
          let obj = Object.assign({}, this.$route.query, this.baseInfo)
          this.$router.replace({
            path: str + val,
            query: {
              ...obj
            }
          })
        } else {
          this.$router.push(str + val)
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
      waitingdbClick (data) {
        this.baseInfo = getQueryUrl(data)
        let obj = {}
        if (!data) {
          obj = {
            areaId: this.$route.query.areaId,
            areaName: this.$route.query.areaName,
            page: this.$route.query.page,
            pagesize: this.$route.query.pagesize,
            q: this.$route.query.q
          }
        } else {
          obj = Object.assign({}, this.$route.query, this.baseInfo)
        }
        this.$router.replace({
          path: this.$route.path,
          query: {
            ...obj
          }
        })
      },
      clearBaseInfo () {
        this.baseInfo = {}
      }
    }
  }
</script>

<style lang="scss" scoped>
  .advice_manage_wrap{
    height: 100%;
    width: auto;
    overflow: hidden;
    .advice_con{
      height: 100%;
      overflow: hidden;
    }
  }
</style>

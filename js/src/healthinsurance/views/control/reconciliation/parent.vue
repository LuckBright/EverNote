<template>
  <div v-if="defaultInsuranceCode">
    <component v-if="component" :is="component" @medicalOrgChange="resolve"></component>
    <div v-else class="alg_c">暂无业务</div>
  </div>
</template>

<script>
import { orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { mapGetters } from '@/healthinsurance/store/modules/insuraneCenter/publish.js'
import getComponents from '@/rcm/otmdiscomponent/mixins/getComponents.js'
export default {
  mixins: [getComponents],
  data () {
    return {
      orgList,
      component: ''
    }
  },
  computed: {
    ...mapGetters([
      'defaultInsuranceCode'
    ]),
  },
  mounted () {
    // 获取默认的渲染组件
    this.getDefaultComponent()
  },
  methods: {
    getDefaultComponent () {
      // 如果是从adt住院登记跳转过来的，要直接查找到对应机构，并搜索出对应visitNumber的登记信息
      let q = this.$route.query.q
      let decodeQ = q && decodeURIComponent(q) || '{}'
      let { insuranceOrgId } = JSON.parse(decodeQ)
      if (insuranceOrgId) {
        this.getComponent(insuranceOrgId)
      } else {
        this.$watch('defaultInsuranceCode', v => {
          console.log('v', v)
          v && this.getComponent(v)
        }, {
          immediate: true
        })
      }
    },
    getComponent (orgId) {
      // 原来的写法有莫名其妙的orgId，在orgList中不存在，会报错
      const { componentName: compName } = orgList[orgId]
      this.component = this.$options.components[compName]
    },
    resolve (orgId) {
      this.getComponent(orgId)
    }
  }
}
</script>

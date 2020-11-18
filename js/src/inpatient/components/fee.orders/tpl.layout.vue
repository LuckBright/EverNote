<template>
  <div class="tpl-layout" v-if="tplFeeShow" @click="close">
    <transition name="slid-in" mode="out-in" appear>
      <div v-if="tplFeeShow" class="slide-content" @click.stop>
        <recipe-template
          class="tpl-wrap"
          :visitType="5"
          :provider-id="providerId"
          v-bind="$attrs"
          v-if="tplFeeShow"
          @quote="quoteRecipe"
        ></recipe-template>
      </div>
    </transition>
  </div>
</template>
<script>
import recipeTemplate from '@/sob/components/template/recipe.layout'
import api from './api'

export default {
  components: { recipeTemplate },
  props: {
    tplFeeShow: {
      type: Boolean,
      default: false
    },
    visitNumber: String,
    providerId: String,
    scene: {
      type: Number,
      default: 1
    },
    providerTypes: { // 执行地科室类型
      type: Array,
      default: () => ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04'] // 默认门急诊+医技
    }
  },
  data () {
    return {
      name: ''
    }
  },
  methods: {
    quoteRecipe (val) {
      this.$emit('quote', val)
    },
    // 获取service
    async getFeeService (datas) {
      let datasObj = {}
      let services = datas.map(item => {
        datasObj[item.serviceId] = item
        return {
          id: item.serviceId,
          isSet: 0
        }
      })
      let params = {
        providerId: this.providerId,
        scene: this.scene,
        services,
        visitNumber: this.visitNumber
      }
      const res = await api.queryOrgFeeTemplate(params).catch(() => false)
      if (res && res.length) {
        let p = []
        res.forEach(item => {
          datasObj[item.id].serviceItem = item
          if (item.hasExecuteProvider) {
            p.push(this.getExecuteProvider(datasObj[item.id]))
          }
        })
        await Promise.all(p)
      }
      return datas
    },
    // 获取执行科室
    async getExecuteProvider (data) {
      let res = await api.getExecuteProviderList({
        serviceId: data.serviceId,
        scene: this.scene,
        adviceType: +data.serviceItem.isSet === 1 ? 2 : 1,
        providerTypes: this.providerTypes,
        relationType: 2
      })
      if (res && res.length) {
        data.executeProviderId = res[0].providerId
        data.executeProviderName = res[0].providerName
      }
    },
    close () {
      this.$emit('update:tplFeeShow', false)
    }
  },
}
</script>
<style lang="scss" scoped>
  .slid-in-enter, .slid-in-leave-to {
    transform: translateX(800px)
  }
  .slid-in-enter-active, .slid-in-leave-active {
    transition: all 0.8s ease;
  }
  .tpl-layout {
    position: absolute;
    width: 100%;
    height: 100%;
    // background-color: rgba(0, 0, 0, 0.5);
    right: 0;
    top: 0;
    z-index: 99999;
    overflow: hidden;
    .slide-content {
      width: 800px;
      float: right;
      background-color: #fff;
      height: 100%;
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
    }
    .tpl-wrap {
      height: 100%;
    }
  }
</style>

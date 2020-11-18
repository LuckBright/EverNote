<template>
  <div>
    <material-list :isBacth="true" v-if="destroy" :key="deleteKey"></material-list>
  </div>
</template>

<script>
import materialList from '@/warehouse/page/institutionmaterial/materiallist.vue'
import storage from '@/util/storage'

export default {
  mixins: [storage],
  components: {
    materialList
  },
  data () {
    return {
      destroy: true,
      deleteKey: 1,
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
    }
  },
  // 组件销毁重新生成
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.deleteKey = vm.deleteKey + 1
      if (from.name === 'unifiedpricing') {
        vm.destroy = false
        vm.$nextTick(() => {
          vm.destroy = true
        })
      }
    })
  },
  // 离开当前路由进入详情，给详情路由修改菜单选中状态
  beforeRouteLeave (to, from, next) {
    if (to.name === 'materialdetail') {
      to.meta.thirdActiveIndex = from.path
    }
    next()
  }
}

</script>

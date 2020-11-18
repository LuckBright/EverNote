<template>
  <div
    class="station_layout"
    :class="{'page_layout_full': $route.meta.full || addFull, 'flex_column_full_hidden': $route.meta.h}"
  >
    <div
      class="storageSelect clearfix"
      :class="{'page_layout_full': $route.meta.full || addFull}"
      v-if="$route.path.indexOf('/storages')>-1 && storageItem && storageItem.length > 1 && !initstorageId && $route.path == '/storages'"
    >
      <jump></jump>
    </div>
    <div
      class="layout_box warehouse_wrap"
      :class="{'page_layout_full': $route.meta.full || addFull}"
    >
      <keep-alive>
        <router-view class="station_layout_wrap" v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view
        class="station_layout_wrap"
        v-if="!$route.meta.keepAlive"
        :class="{'flex_column_full_hidden': $route.meta.h}"
      ></router-view>
    </div>
  </div>
</template>
<script>
import session from '@/util/session'
import { debounce } from '@/util/common'
import '@/warehouse/page/assets/index.scss'
import storage from '@/util/storage'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import storageApi from '@/warehouse/store/storageroomapi'
import jump from '@/warehouse/page/storages/jump'
// 库房系统配置
import processSeting from '@/warehouse/page/storages/util/process.seting'
import dynamicLoadingRouter from '@/warehouse/mixins/dynamic.loading.router'
import drugSocket from '@/warehouse/mixins/drug.socket.js'
import getmacId from '@/rcm/otmdiscomponent/mixins/getmacaddress.js'
export default {
  data () {
    return {
      currentPath: this.$route.path,
      count: 0
    }
  },
  // 组件路由守卫
  beforeRouteEnter (to, from, next) {
    // 平台组根据权限设置路由菜单时，菜单资源中可能会不存在库房根路径‘/storages’，导致未选取当前库房id就进入库房
    // 根据资源菜单列表默认设置库房工作站的第一个页面为‘/storages/home’，
    // 进入库房具体页面之前，判断是否已经有库房id，如果没有重定向到库房根路径，然后根据路由配置逻辑去跳转选取库房操作页面
    if (to.path.indexOf('/storages/') > -1) {
      if (!localStorage.getItem('STORAGE_ID_VUEX')) {
        next('/storages')
      } else {
        next()
      }
    } else {
      next()
    }
  },
  beforeDestroy () {
    this.$bus.$off('nav:warehouseRouteChange')
  },
  async created () {
    // 每次刷新都要重新请求一下接口更新定价模式 这样做
    this.getStorageroomSystemConfig()
    // 库房工作站 注入动态路由和获取库房流程配置信息等
    if (this.$route.path.indexOf('/storages') > -1) {
      storage.removeSessionStorage('storageroomObject')
      this.getStorageroomList() // 每次刷新库房页面重新获取一次库房列表数据
      await this.getStorageroomProcess()  // 存储库房流程
      this.storageRouterNavSet()
      this.$bus.$on('nav:warehouseRouteChange', async ({ clear, meta, storageId }) => {
        clear && await this.getStorageroomProcess(storageId)  // 存储库房流程
        meta && await this.storageroomRouteChange(meta)
        this.storageRouterNavSet()
      })
    }
  },
  mounted () {
    // this.getDispenseSetting()
    document.addEventListener('keydown', function (e) {
      e = window.event || e
      const keycode = e.keyCode || e.which
      if (e.ctrlKey && keycode === 74) { // Ctrl + J
        e.preventDefault()
        window.event.returnValue = false
      }
    })
  },
  computed: {
    addFull () {
      // processDataId： 门诊发药和住院发药中才存在流程数据id
      return this.$route.meta.processDataId // 门诊发药流程、住院发药流程， 添加class：full
    }
  },
  components: {
    jump,
  },
  mixins: [session, getstorage, processSeting, dynamicLoadingRouter, drugSocket, getmacId],
  methods: {
    handleJump () {
      let url = this.$route.query.jumper ? '/storages?back=1&jumper=' + this.$route.query.jumper : '/storages?back=1'
      this.$router.replace(url)
    },
    handleStorageId: debounce(function (id, materialType) {
      if (this.storageId !== id) {
        storage.setLocalStorage('STORAGE_ID', id)
        storage.setLocalStorage('MATERIAL_TYPE', materialType)
        this.storageId = id
      }
    }),
    async getStorageroomList () {
      if (this.$route.name === 'storages') return
      let res = await storageApi.list({ userType: 1 })
      if (res && res.list) {
        let list = []
        res.list.forEach(item => {
          list.push({
            id: item.id,
            name: item.name,
            materialType: item.materialType,
            toExamine: item.toExamine,
            onLineToExamine: item.onLineToExamine,
            isInvented: item.isInvented
          })
        })
        storage.setLocalStorage('STORAGE_ITEM', JSON.stringify(list))
      }
    },
    getStorage: debounce(async function () {
      this.count++
      if (this.$route.name !== 'storages') return
      // 每次进入库房工作站， 都重新选择库房信息
      storage.removeLocalStorage('INIT_STORAGE_ID')
      storage.removeLocalStorage('STORAGE_ID')
      storage.removeLocalStorage('STORAGE_ID_VUEX')
      if (!this.storageId && !this.initstorageId) {
        this.handleJump()
      }
      let res = await storageApi.list({ userType: 1 })
      if (res && res.list) {
        let list = []
        res.list.forEach(item => {
          list.push({
            id: item.id,
            name: item.name,
            materialType: item.materialType,
            toExamine: item.toExamine,
            onLineToExamine: item.onLineToExamine,
            isInvented: item.isInvented
          })
        })
        if (list.length === 1) {
          const storageId = list[0].id
          storage.setLocalStorage('INIT_STORAGE_ID', storageId)
          storage.setLocalStorage('STORAGE_ID_VUEX', storageId)
          storage.setLocalStorage('STORAGE_ID', storageId)
          storage.setLocalStorage('MATERIAL_TYPE', list[0].materialType)
          storage.setLocalStorage('STORAGE_ROOM_TYPE', list[0].type)
          this.initstorageId = storageId
          // await this.getDispenseSetting(this.initstorageId)
          this.$router.push('/storages/home?storageId=' + storageId)
        }
        storage.setLocalStorage('STORAGE_ITEM', JSON.stringify(list))
        this.storageItem = list
      } else {
        // 解决库房多次请求接口bug（route change get interface）
        if (this.count > 1 || !res.length) {
          this.$messageTips(this, 'warning', '您还没有关联库房信息，请先去机构设置中关联库房', '查询库房信息')
        } else {
          JSON.parse(storage.getLocalStorage('STORAGE_ITEM')) && this.$router.replace('/storages/reload?path=/storages?back=1')
        }
        storage.removeLocalStorage('STORAGE_ITEM')
        storage.removeLocalStorage('INIT_STORAGE_ID')
        storage.removeLocalStorage('MATERIAL_TYPE')
      }
    }, 1000)
  },
  watch: {
    '$route': {
      handler: debounce(function (route) {
        if (route.query.back) return
        this.getStorage()
      }),
      deep: true,
      immediate: true
    },
    'storageId' (old, news) {
      if (old && news && old !== news) {
        this.$router.push('/storages/home')
      }
    }
  }
}
</script>
<style scoped>
.el-main .layout_box > div /deep/ .el-breadcrumb {
  margin-top: -10px;
}
.container {
  height: 100%;
}
.storageSelect {
  width: calc(100vw - 200px);
  margin: 0 auto;
  height: calc(100vh - 100px);
  /* padding-bottom: 50px; */
  overflow: hidden;
  background: #ebedef;
}
.animate {
  animation-duration: 0.1s;
  -webkit-animation-duration: 0.1s;
}
</style>

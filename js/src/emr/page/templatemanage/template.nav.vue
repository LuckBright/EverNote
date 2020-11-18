<template>
  <div class="left_menu">
        <div v-for="item in menuList"
             :key="item.businessType"
             class="left_menu_item"
             :class="{'active':item.isActive}"
             @click="handleTab(item)">
          <div>{{item.name}}</div>
        </div>
      </div>
</template>
<script>
import confirm from '@/util/confirm'
import {getMenuList, handleRoute} from '@/emr/config/template.config'
import update from '@/emr/mixins/update.js'// vuex存储数据
export default {
  name: 'template_nav',
  mixins: [update],
  props: {
    workshop: {
      type: String,
      required: true
    },
    role: {
      type: String
    }
  },
  data () {
    return {
      menuList: getMenuList(this.workshop, this.role),
      businessType: null
    }
  },
  watch: {
    'role' (val) {
      this.menuList = getMenuList(this.workshop, this.role)
      this.setMenuActive(Number(this.businessType))
    }
  },
  mounted () {
    this.handleBusinessType(this.$route.query.businessType, this.workshop)
    this.setMenuActive(Number(this.businessType))
  },
  methods: {
    initBusinessType (type, workshop) {
      if (!workshop) {
        this.businessType = type
        return false
      }
      if (workshop === 'groupManage') {
        this.businessType = type || 0
      } else if (workshop === 'orgSetting') {
        this.businessType = type || 1
      } else {
        this.businessType = type || 2
      }
    },
    emitBusinessType () {
      this.$emit('getBusinessType', this.businessType)
    },
    handleBusinessType (type, workshop) { // 对businessType赋值，发送，修改路由
      this.initBusinessType(type, workshop)
      this.emitBusinessType()
    },
    setMenuActive (val) {
      this.menuList.forEach(item => {
        if (item.businessType === val) {
          this.$set(item, 'isActive', true)
        } else {
          this.$set(item, 'isActive', false)
        }
      })
    },
     // 切换模版
    handleTab (curItem) {
      let tab = (val) => {
        this.setMenuActive(val)
        this.$parent.closeTpl()
        this.handleBusinessType(val)
        handleRoute(this, {
          businessType: val
        })
        this.setAsyncChange(false)
      }
      if (this.templateChange) {
        // confirm其实是浏览器的一个事件，这里被修改了
        confirm(this, {
          confirmCallBack: () => {
            this.$parent.saveTpl()
          },
          cancelCallBack: () => {
            tab(curItem.businessType)
          }
        })
      } else {
        tab(curItem.businessType)
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../../css/templatemanage.scss'
</style>

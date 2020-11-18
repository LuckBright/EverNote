/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-06-04 14:27:28
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-07-04 15:14:20
 * 菜单布局 -- 子路由管理
 */
<template>
  <el-container>
    <ever-container>
      <template v-slot:aside>
        <!-- 布局样式参考 100%高度 滚动 -->
        <el-container class="layout_inner page_layout_full_hidden" style="padding: 0; ">
          <el-container class="flex_column_full">
            <el-row class="flex_column_full">
              <el-col :span="24">
                <slot>
                  <medical-org-list
                    v-model="insuranceOrgId"
                    placeholder="请选择医保中心"
                    :defaultFirst="true"
                  ></medical-org-list>
                </slot>
              </el-col>
              <el-col :span="24" class="page_layout_full_hidden">
                <div class="menu_ul flex_scroll" v-if="showMenus.length">
                  <div
                    class="menu_li"
                    v-for="menu in showMenus"
                    :class="{'active': activeId == menu.id}"
                    :model="activeId"
                    :key="menu.id"
                    @click="handleSelectMenu(menu)"
                  >{{menu.customName||menu.name}}</div>
                </div>
                <div v-else class="pos_ab pos_c">暂无数据</div>
              </el-col>
            </el-row>
          </el-container>
        </el-container>
      </template>
      <template v-slot:main>
        <el-container class="layout_inner page_layout_full_hidden">
          <router-view v-if="activeId" :key="insuranceOrgId" :insuranceOrgId="insuranceOrgId"></router-view>
          <ever-no-data height="180" class="pos_ab pos_c poc_body" v-else></ever-no-data>
        </el-container>
      </template>
    </ever-container>
  </el-container>
</template>

<script>
import EverContainer from '@/healthinsurance/components/container'
import MedicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import { get } from 'lodash'

export default {
  name: 'LayoutCenter',
  components: { EverContainer, MedicalOrgList },
  props: {
    // 菜单列表
    menus: {
      type: Array,
      default: []
    },
  },
  data () {
    return {
      insuranceOrgId: '',
      activeName: ''
    }
  },
  methods: {
    handleSelectMenu (item) {
      const { id, routerLink } = item
      this.activeId = id
      this.$router.push(routerLink)
    }
  },

  computed: {
    showMenus () {
      if (!this.insuranceOrgId) return []
      const menus = this.menus.filter(menu => (
        menu[this.insuranceOrgId] ||
        // include是数组时，其中包含的值为机构id
        (Array.isArray(menu.include) && menu.include.includes(this.insuranceOrgId)) ||
        // menu.include=== true 所有的机构都需要该菜单
        menu.include === true)) || []
      let item
      if ((item = menus[0])) {
        this.handleSelectMenu(item)
      }
      return menus
    },
    activeId: {
      get () {
        return (this.activeName || get(this.showMenus[0], 'id', ''))
      },
      set (val) {
        this.$watch('insuranceOrgId', _ => {
          this.activeName = get(this.showMenus[0], 'id', '')
        })
        this.activeName = val
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../../assets/css/app-variables.less");
.menu_ul {
  padding: 0;
  .menu_li {
    display: block;
    line-height: 20px;
    padding: 10px;
    cursor: pointer;
    &:hover {
      background: @col_btn_02;
    }
    &.active {
      font-weight: bold;
      color: @col_o_05;
      background: @col_btn_02;
    }
  }
}
.m_auto {
  margin: 50px auto;
}
.pos_c {
  top: 50%;
  left: 50%;
  margin-left: -32px;
}
.poc_body {
  margin-top: -100px;
}
</style>

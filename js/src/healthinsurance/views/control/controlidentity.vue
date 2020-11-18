/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-06-04 14:27:28
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-07-04 10:15:21
 * 医保签到 -- 菜单 -- 子路由管理
 */
<template>
  <layout :menus="menus"></layout>
</template>

<script>
import Layout from '@/healthinsurance/components/layout'
export default {
  name: 'HealthInsuranceControl',
  components: { Layout },
  data () {
    return {
      menus: [{
        id: 1,
        name: '医保签到',
        routerLink: '/hi/control/controlidentity/signin',
        include: true
      }]
    }
  }
}
</script>

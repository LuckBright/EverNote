<!--
  物资 毒麻精放&抗菌药物 图标显示
  引用示例：<material-icons :icons="icons"></material-icons>
-->
<template>
  <span v-if="icons && icons.length">
    <el-tooltip v-for="(item, i) in icons" :key="i" placement="top">
      <span slot="content">{{item.name}}</span>
      <img class="mr5" style="width: 18px; height: 18px; vertical-align: sub;" :src="item.photo" :alt="item.name" />
    </el-tooltip>
  </span>
</template>

<script>
export default {
  props: {
    icons: Array
  },
  data () {
    return {

    }
  }
}
</script>

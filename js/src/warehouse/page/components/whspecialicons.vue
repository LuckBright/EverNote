<!--
  物资毒麻精放&抗菌药物图标显示
  引用示例：<ever-specialIcons v-if="scope.row.materialPropertys" :iconsData="scope.row.materialPropertys"></ever-specialIcons>
-->
<template>
  <span v-if="iconList.length">
    <el-tooltip v-for="(item, i) in iconList" :key="i" placement="top">
      <span slot="content">{{item.title}}</span>
      <img class="mr5" style="width: 18px; height: 18px; vertical-align: sub;" :src="item.url" :alt="item.title" />
    </el-tooltip>
  </span>
</template>

<script>
export default {
  props: {
    iconsData: Object
  },
  data () {
    return {
      specialArr: []
    }
  },
  computed: {
    iconList () {
      if (!this.iconsData || !(this.iconsData instanceof Object)) return []
      const _arr = []
      Object.keys(this.iconsData).forEach(key => {
        const icon = this.iconsData[key]
        if (icon instanceof Object && icon.photo) {
          const { name: title, photo: url } = icon
          url && _arr.push({
            title,
            url
          })
        }
        if (icon instanceof Array) {
          icon.forEach(item => {
            const { name: title, photo: url } = item
            url && _arr.push({
              title,
              url
            })
          })
        }
      })
      return _arr
    }
  }
}
</script>

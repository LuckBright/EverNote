<!--
  全局物资名称组件  （todo：大家根据具体需求完善拓展）
  引用示例：
  <material-name :materialName="scope.row.materialName" :icons="scope.row.icons"></material-name>
-->
<template>
  <span class="materialname">
    <span class="mr5">
      {{materialName}}
      <!-- 物资毒麻精放&抗菌药物图标显示 -->
      <material-icons v-if="icons && icons.length" :icons="icons"></material-icons>
    </span>
    <!-- 药品说明书  "-->
    <i v-if="localMaterialId" @click="drugOpen()" class="iconfont icon-shuoming"></i>
    <!-- 查看药品说明 -->
    <drug-instructions v-if="showInstructions" ref="drugTips" :localMaterialId="localMaterialId" :recipeId="recipeId"></drug-instructions>
    <slot></slot>
  </span>
</template>

<script>
/**
* @param {string} materialName        物资名称
* @param {array}  icons               物资毒麻精放&抗菌药物图标显示
* @param {string} localMaterialId     物资id查询说明书
* @param {string} recipeId     物资id查询id名称
*/

export default {
  props: {
    materialName: String,
    icons: Array,
    localMaterialId: String,
    recipeId: String
  },
  data () {
    return {
      showInstructions: false
    }
  },
  components: {
    'drug-instructions': () => import('@/warehouse/page/storages/dispensings/components/drug.instructions.vue')
  },
  methods: {
    drugOpen (data) {
      this.showInstructions = true
      this.$nextTick(_ => {
        setTimeout(_ => {
          this.$refs.drugTips.open()
        }, 500)
      })
    },
  }
}
</script>
<style lang="scss" scoped>
@import "../assets/base.scss";
/deep/ .iconfont.icon-shuoming {
  font-size: 16px;
  padding: 0px;
  color: $blue_color;
}
.materialname {
  .icon-shuoming {
    font-weight: normal;
    visibility: hidden;
  }
}
.materialname:hover {
  .icon-shuoming {
    visibility: inherit;
  }
}
</style>


<!-- 电子病历类型管理树结构 -->
<template>
  <div>
    <div class="tree-menu">
      <div class="clearfix clear">
        <p v-if="depth == 0" class="f14 pl10 chird_bg clearfix clear">
          <span class="fl pointer" @click="toggleChildren(showChildren)"><i v-if="treeData && treeData.length" :class="showChildren ? 'iconfont icon-domn' : 'iconfont icon-domn closeRight inlineblock'"></i>{{ label }}</span>
          <span v-if="isManage" class="inlineblock fr" style="width: 110px;">
            <ever-confirm class="fl" size="mini" width="228px" placement="left" :msg="`你是否删除${label}及其所有模版`" action="删除分组" @confirm="handelDelClassification(treeClassificationId)"></ever-confirm>
          </span>
          <el-row v-if="isManage" style="display: inline-block">
            <el-tooltip class="ml5" effect="dark" content="向上移动" placement="top" @click="handelRise(treeClassificationId)">
              <i class="iconfont icon-shangsheng"></i>
            </el-tooltip>
            <el-tooltip class="ml5" effect="dark" content="向下移动" placement="top" @click="handelDecline(treeClassificationId)">
              <i class="iconfont icon-xiajiang"></i>
            </el-tooltip>
          </el-row>
        </p>
        <div v-if="depth > 0" style="width: 100%">
          <p v-if="tabData && tabData.isLabel == 2" class="f14 pl10 content clearfix clear" :style="indent">
            <span class="fl pointer" @click="toggleChildren(showChildren)"><i v-if="treeData && treeData.length" :class="showChildren ? 'iconfont icon-domn' : 'iconfont icon-domn closeRight inlineblock'"></i>{{ label }}</span>
            <!-- <span class="fl">{{label}}</span> -->
            <span v-if="isManage" class="inlineblock fr" style="width: 110px;">
              <ever-confirm class="fl" size="mini" width="228px" placement="left" :msg="`你是否删除${label}及其所有模版`" action="删除分组" @confirm="handelDelClassificationChird(treeClassificationChirdId)"></ever-confirm>
            </span>
            <el-row v-if="isManage" style="display: inline-block">
              <el-tooltip class="ml5" effect="dark" content="向上移动" placement="top" @click="handelRise(treeClassificationChirdId)">
                <i class="iconfont icon-shangsheng"></i>
              </el-tooltip>
              <el-tooltip class="ml5" effect="dark" content="向下移动" placement="top" @click="handelDecline(treeClassificationChirdId)">
                <i class="iconfont icon-xiajiang"></i>
              </el-tooltip>
            </el-row>
          </p>
          <medicalrecord-tabulation v-else :tabulationData="tabData" :customApi="customApi" :isTree="true" :depth="depth" :isScrollIntoView="isScrollIntoView" :categoryList="categoryList" @tabQueryId="handelEdit" @delTabId="handelDelItem" @tabTemplateId="handelStencil" @tabRise="handelRise" @tabDecline="handelDecline"></medicalrecord-tabulation>
        </div>
      </div>
      <template v-if="showChildren">
        <div class="tab_con" v-for="(item, i) in treeData" :key="i" v-loading.body="loading">
          <medicalrecord-tree
            :treeData="item.children"
            :key="item.id+i"
            :tabData="item"
            :customApi="customApi"
            :depth="depth + 1"
            :label="item.name"
            :treeClassificationChirdId="item.id"
            :categoryList="categoryList"
            :isScrollIntoView="isScrollIntoView"
            @treeQueryId="handelEdit"
            @treeDelItemId="handelDelItem"
            @treeTemplateId="handelStencil"
            @treeDelClassificationChird="handelDelClassificationChird"
            @treeRise="handelRise"
            @treeDecline="handelDecline"></medicalrecord-tree>
        </div>
      </template>

    </div>
  </div>
</template>
<script>
import medicalrecordTabulation from '@/form/components/medicalrecordtabulation'
export default {
  /**
   * props                        字段含义
   * @param treeData              树型数据
   * @param customApi             传入自定义api
   * @param depth                 index
   * @param label                 当前分类name
   * @param tabData               table数据
   * @param treeClassificationId  当前父id
   */
  props: ['treeData', 'customApi', 'depth', 'label', 'tabData', 'treeClassificationId', 'categoryList', 'isScrollIntoView', 'treeClassificationChirdId'],
  data () {
    return {
      treeTableData: [],
      showChildren: false,
      recursiveTableData: [],
      loading: false,
      isManage: this.$route.matched[0].meta.manage || false
    }
  },
  name: 'medicalrecord-tree',
  created () {},
  computed: {
    indent () {
      return { marginLeft: `${this.depth * 20}px` }
    }
  },
  methods: {
    // 排序调整（上升）
    handelRise (id) {
      this.$emit('treeRise', id)
    },
    // 排序调整（下降）
    handelDecline (id) {
      this.$emit('treeDecline', id)
    },
    // 编辑
    handelEdit (id) {
      this.$emit('treeQueryId', id)
    },
    handelDelItem (id) {
      this.$emit('treeDelItemId', id)
    },
    // 模版
    handelStencil (id) {
      this.$emit('treeTemplateId', id)
    },
    handelDelClassification (id) {
      this.$emit('treeDelClassificationId', id)
    },
    handelDelClassificationChird (id) {
      this.$emit('treeDelClassificationChird', id)
    },
    toggleChildren (flag) {
      this.loading = true
      if (flag) {
        this.showChildren = false
      } else {
        this.showChildren = true
      }
      setTimeout(() => {
        this.loading = false
      }, 500)
    }
  },
  watch: {},
  components: {
    medicalrecordTabulation
  }
}
</script>
<style lang="less" scoped>
p {margin: 0;}
.content {line-height: 39px; height: 39px;}
.chird_bg {background-color: #f4f4f4; line-height: 39px; height: 39px; margin: 0;}
.chird_bgBtn {margin: 0 20px 0 0;}
.tab_con {border-top: 1px solid #cccccc;}
.inlineblock {display: inline-block;}
.pointer {cursor: pointer;}
// 下拉图标
.closeRight {
  transition: transform 0.5s;
  -moz-transition: -moz-transform 0.5s; /* Firefox 4 */
  -webkit-transition: -webkit-transform 0.5s; /* Safari 和 Chrome */
  -o-transition: -o-transform 0.5s;
  transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
}
</style>

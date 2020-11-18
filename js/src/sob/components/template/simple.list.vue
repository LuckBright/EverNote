<template>
  <div class="ever_simple_list">
    <div class="ever_menu_nav">
      <el-menu mode="horizontal" :default-active="belongType" @select="nav" style="display:block">
        <el-menu-item v-for="(item,index) in belong" :index="index" :key="index">{{item}}</el-menu-item>
      </el-menu>
    </div>
    <el-col class="tpl_list_box" v-if="tplList && tplList.length">
      <el-row>
        <el-col
          v-for="(item,index) in tplList"
          :key="index"
          @click.native="select(item, index)"
          :class="(curIndex === index && curType === belongType) ? 'cur' : ''"
        >
          <em>{{item.templateName}}</em>
        </el-col>
      </el-row>
    </el-col>
    <ever-no-data v-else size="small" style="margin:80px auto 40px"></ever-no-data>
  </div>
</template>
<script>

export default {
  data () {
    return {
      belong: {
        '1': '个人模版',
        '2': '科室模版'
      },
      curIndex: 0,
      curType: '1'
    }
  },
  props: {
    'tplList': {
      type: Array
    },
    'belongType': {
      type: String
    }
  },
  methods: {
    nav (panel) {
      this.curIndex = 0
      this.curType = panel
      this.$emit('nav', panel)
    },
    select (item, index) {
      this.curIndex = index
      this.curType = this.belongType
      this.$emit('select', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.tpl_list_box {
  flex: 1;
  padding: 15px;
  overflow: auto;
}
.ever_simple_list {
  display: flex;
  flex-direction: column;
  height: 100%;
  .ever_menu_nav {
    padding: 0;
    height: 40px;
    line-height: 40px;
    background: #fff;
    .el-menu {
      background: #fff;
      border-bottom: 2px solid #ddd;
      .el-menu-item {
        position: relative;
        height: 40px;
        line-height: 40px;
        padding: 0;
        width: 50%;
        text-align: center;
        font-size: 14px;
        border: none !important;
        &:hover {
          border: none !important;
          background: none;
        }
      }
      .el-menu-item.is-active {
        border: none !important;
        &:after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          border-bottom: 2px solid #1c78ef;
        }
      }
    }
  }
}
</style>

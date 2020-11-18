<template>
  <div class="submenu">
    <el-submenu :index="item.id" v-if="list(item) && list(item).length>0" class="el-menu-sub">
      <template slot="title">
        <div class="menu_title_flex">
          <span><i :class="item.icon"></i>{{item.name}}</span>
          <span class="alg_r" v-if="item.code === 'BING_CHENG_MANAGE'" style="padding-right: 16px;">
            <el-button @click.stop="print" size="mini">合并打印/续打</el-button>
          </span>
        </div>
      </template>
      <template v-for="child in list(item)">
        <sub-menu
          :name="(child.formTemplateName || child.name) + $moment(child.recordTime).format('YYYY-MM-DD HH:mm')"
          v-if="list(child) && list(child).length>0"
          :param="child"
          :key="child.id"
        ></sub-menu>
        <el-menu-item
          :name="(child.formTemplateName || child.name) + $moment(child.recordTime).format('YYYY-MM-DD HH:mm')"
          :index="child.formTemplateId+'/'+child.id+'/'+child.code"
          :key="child.id"
          v-else
        >
          <div
            class="ellipsis"
            :title="(child.formTemplateName || child.name) + $moment(child.recordTime).format('YYYY-MM-DD HH:mm')"
          >
            <i :class="child.icon"></i>
            <b class="print-icon" v-if="child.print === 1">(印)</b>
            <span>{{child.formTemplateName || child.name}}{{$moment(child.recordTime).format('YYYY-MM-DD HH:mm')}}</span>
          </div>
        </el-menu-item>
      </template>
    </el-submenu>
    <el-menu-item :index="item.id" v-else class="el-menu-each">
      <i :class="item.icon"></i>
      <b class="print-icon" v-if="child.print === 1">(印)</b>
      <span>{{item.name || item.formTemplateName}}{{$moment(item.recordTime).format('YYYY-MM-DD HH:mm')}}</span>
    </el-menu-item>
  </div>
</template>
<script>
export default {
  name: 'subMenu',
  props: ['param'],
  data: function () {
    return { item: this.param }
  },
  computed: {
    list (item) {
      return (item) => {
        if (item.children && item.medicalRecords) {
          return [...item.children, ...item.medicalRecords]
        } else if (!item.children && item.medicalRecords) {
          return [...item.medicalRecords]
        } else if (!item.medicalRecords && item.children) {
          return [...item.children]
        } else {
          return []
        }
      }
    }
  },
  methods: {
    print () {
      // this.$emit('print', 'BING_CHENG_MANAGE')
      this.$bus.$emit('print:medicalProcess', 'BING_CHENG_MANAGE')
    }
  }
}
</script>
<style lang="scss" scoped>
.menu_title_flex{
  display: inline-flex;
  width: 100%;
  span{
    flex: 1;
    .el-button{
      position: relative;
      top: -3px;
    }
  }
}
.el-submenu .el-menu {
  background-color: #fff !important;
}
.el-submenu /deep/ .el-submenu__title {
  height: 40px;
  line-height: 40px;
  background: #eee;
  -background-image: linear-gradient(
    -180deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  border-bottom: 1px solid #ccc;
  border-bottom-color: #ccc !important;
}
.el-menu-style,
.el-menu-style .el-menu {
  background-color: #ffffff !important;
}
.el-menu {
  background-color: #fff !important;
}
#patient_mgt .el-menu-item span {
  font-size: 14px !important;
}
.print-icon {
  color: #35a000;
  font-style: normal;
  font-size: 12px;
  vertical-align: 1px;
  font-family: PingFangSC-Regular;
  font-weight: bold;
}
</style>

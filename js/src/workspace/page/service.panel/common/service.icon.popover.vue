<template>
  <div class="service_icon">
    <el-popover popper-class="service_icon_popover" :width="width" trigger="click" placement="left">
      <div :class="{'service_icon_list': true, 'active_service': isactive}">
        <div v-for="(item, index) in EXPLAIN_ICON" :key="index">
          <span
            v-for="(items, index) in item"
            :style="'height: ' + items.height"
            :key="index"
            class="item"
          >
            <i :class="'iconfont ' + items.icon" :style="'color: ' + items.color"></i>
            <em>{{items.label}}</em>
          </span>
        </div>
      </div>
      <template slot="reference">
        <span class="service_icon_tips">
          <i class="iconfont icon-gantanhao"></i>操作说明
        </span>
      </template>
    </el-popover>
  </div>
</template>

<script>
import { EXPLAIN_ICON } from './service.config'
export default {
  data () {
    return {
      EXPLAIN_ICON,
      width: '',
      isactive: false
    }
  },
  mounted () {
    const that = this
    window.onresize = () => {
      if (window.innerWidth <= 1440) {
        that.width = 880
        that.isactive = true
      } else {
        that.width = 1400
        that.isactive = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.service_icon {
  overflow: hidden;
}
.service_icon_list {
  align-items: flex-start;
  align-items: left;
  font-size: 12px;
}
.active_service {
  overflow-x: scroll;
}
.item {
  line-height: 36px;
  padding: 0 9.3px;
}
.service_icon_tips {
  float: right;
  padding: 20px 10px 10px 0;
  font-size: 14px;
  color: #666;
  .iconfont {
    color: #bbb;
    margin-right: 5px;
  }
}
</style>

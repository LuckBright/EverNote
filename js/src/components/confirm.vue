<!--
  demo: <ever-confirm :msg="'确定删除 '+scope.row.name+' ？'" action="我是行内删除" @confirm="del(scope.row.id, scope.row)"></ever-confirm>
  参数注释：
    msg：弹窗内文案，一般是“确认删除XXX吗？”
    action: 按钮里显示的文字
    页面内需要提前注册确定删除的方法
-->
<template>
  <span>
    <el-popover
      :placement="placement"
      :width="width"
      trigger="click"
      v-model="visible">
      <p class="confirm_txt">
        <i class="iconfont icon-sales-zhuyi"></i>
        <span>{{msg}}</span>
      </p>
      <div style="text-align: center; margin: 0">
        <el-button size="mini" @click="visible = false">{{$t('取消')}}</el-button>
        <el-button type="primary" size="mini" @click="confirm()">{{$t('确定')}}</el-button>
      </div>
      <template slot="reference">
        <span v-if="$slots.reference">
          <slot name="reference"></slot>
        </span>
        <el-button
          v-else
          :type="type || 'danger'"
          :size="size || 'small'"
          :plain="plain ? true : false"
          :disabled="disabled"
        >{{action || '删除'}}</el-button>
      </template>
    </el-popover>
  </span>
</template>
<script>
export default {
  props: ['placement', 'width', 'msg', 'action', 'size', 'type', 'plain', 'disabled'],
  data () {
    return {
      visible: false
    }
  },
  methods: {
    confirm () {
      this.visible = false
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-popover.ever_popover_confirm {
  .confirm_txt {
    margin: 0;
    padding: 0 0 10px;
    white-space: nowrap;
    font-size: 14px;
    i {
      display: inline-block;
      font-size: 20px;
      color: #1c7bef;
      margin-right: 5px;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
  }
  // .el-button{
  //   padding: 5px 10px;
  // }
}
</style>

<template>
  <el-dialog
    :title="title"
    class="limit-dialog"
    width="500px"
    :visible.sync="visible"
    :modal-append-to-body="true"
    :append-to-body	="true"
    :close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="close"
  >
    <div class="waring-wrap">
      <slot name="content">
        <div>{{content}}</div>
      </slot>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  @click="close">
        我知道了
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: String,
    limitShow: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    }
  },
  methods: {
    close () {
      this.$emit('afterOk')
      this.$emit('update:limitShow', false)
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.limitShow
      },
      set: function (val) {
        this.$emit('update:limitShow', val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialog-footer {
    text-align: center
  }
  .waring-wrap {
    border: 1px solid #ee4433;
    border-radius: 4px;
    background: rgba(238, 68, 51, 0.12);
    box-shadow: none;
    color: #ee4433;
    margin-bottom: 20px;
    line-height: 22px;
    position: relative;
    padding: 15px;
    ul {
      padding: 0;
      margin: 0;
      li {
        line-height: 33px;
      }
    }
  }
</style>

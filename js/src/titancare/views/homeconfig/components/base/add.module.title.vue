<template>
  <div class="form-list">
    <div class="form-item">
      <span class="form-item-left">显示模块标题</span>
      <div class="form-item-right">
        <el-switch
            v-model="showTitle"
            :disabled="disabled"
            :active-value="moduleShowTtitle.show"
            :inactive-value="moduleShowTtitle.hide">
        </el-switch>
      </div>
    </div>
    <div class="form-item">
      <span class="form-item-left">模块标题</span>
      <div class="form-item-right">
        <input class="title-input" :disabled="showTitle !== moduleShowTtitle.show" v-model="iTitle" :placeholder="placeholder || '请输入标题'" type="text">
      </div>
    </div>
  </div>
</template>

<script>
import { moduleShowTtitle } from '../../assets/json/homeSection'

export default {
  name: 'add.module.title',
  props: {
    show: String,
    title: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      moduleShowTtitle: moduleShowTtitle,
      showTitle: this.show,
      iTitle: this.title
    }
  },
  watch: {
    showTitle (newVal) {
      this.$emit('showTitleChange', newVal)
    },
    iTitle (newVal) {
      this.$emit('titleChange', newVal)
    },
    show (newVal) {
      this.showTitle = newVal
    },
    title (newVal) {
      this.iTitle = newVal
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../assets/css/form-list";
  .title-input[disabled]{
    background-color: transparent;
  }
</style>

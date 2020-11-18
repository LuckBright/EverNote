<template>
  <div class="sort-editor">
    <div class="number" v-if="!isEdit">
      <span>{{value}}</span>
      <i class="el-icon-edit number-edit" @click="editNumber"></i>
    </div>
    <sys-text
      v-else
      ref="numberInput"
      v-model="sort"
      size="small"
      class="number-input"
      type="number"
      :field="{min: 0, step: 1}"
      @blur="handleBlur"
    ></sys-text>
  </div>
</template>
<script>
export default {
  props: {
    value: Number
  },
  data () {
    return {
      sort: this.value,
      isEdit: false
    }
  },
  methods: {
    editNumber () {
      this.sort = this.value
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.numberInput.$refs.input.focus()
      })
    },
    handleBlur () {
      this.isEdit = false
      this.$emit('change', this.sort)
    }
  }
}
</script>
<style lang="scss" scoped>
.sort-editor {
  .number {
    width: 54px;
    position: relative;
    text-align: center;
    padding-right: 22px;
    border: 1px solid transparent;
    .number-edit {
      position: absolute;
      right: 0px;
      line-height: 23px;
      background-color: #e2e2e2;
      padding: 0 3px;
      font-size: 13px;
      color: #666;
      display: none;
      cursor: pointer;
    }
    &:hover {
      border: 1px solid #ccc;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
      .number-edit {
        display: inline-block;
      }
    }
  }
  .number-input {
    width: 80px;
  }
}
</style>

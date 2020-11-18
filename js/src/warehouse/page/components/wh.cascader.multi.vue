<!--
  组件README：https://github.com/livelybone/vue-select
  expandType="hover"
-->
<template>
  <cascader-multi
    class="select"
    v-model="cascader"
    :options="showOptions"
    :popperProps="popperProps"
    :placeholder="placeholder || '请选择'"
    :searchPlaceholder="searchPlaceholder || '请输入搜索内容'"
    :canSearch="canSearch"
    :canEdit="canEdit"
    :disabled="disabled"
    :scrollbarProps="{isMobile: isMobile, maxHeight: '20vh'}"
    @search="log">
      <div class="alg_c" style="color: #999">暂无数据</div>
    </cascader-multi>
</template>

<script>
export default {
  props: ['options', 'value', 'disabled', 'filterable', 'placeholder', 'searchPlaceholder', 'userObject'],
  data () {
    return {
      isMobile: false,
      popperProps: {
        arrowPosition: 'start',
        arrowOffsetScaling: 1,
        popperOptions: {
          placement: 'bottom-start',
          modifiers: {
            preventOverflow: { padding: 20 }
          }
        }
      },
      keyword: '',
      thisArrList: []
    }
  },
  computed: {
    canSearch: function () {
      // 暂时去掉可以查询方法
      // this.filterable === undefined ? true : this.filterable
      return false
    },
    canEdit: function () {
      return this.disabled === undefined ? true : !this.disabled
    },
    showOptions: function () {
      return this.keyword ? this.options.filter(this.filter) : this.options
    },
    'cascader': {
      set (newVal) {
        let val = this.userObject ? this.getArrObjectList(newVal) : newVal
        this.$emit('input', val)
        this.$emit('change', val)
      },
      get () {
        return this.value || []
      }
    }
  },
  methods: {
    findArrObject (obj, ids) {
      this.thisArrList.push(obj)
      obj.children && obj.children.length && obj.children.forEach(item => {
        if (ids.includes(item.id)) {
          if (item.children && item.children.length) {
            this.findArrObject(item, ids)
          } else {
            this.thisArrList.push(item)
          }
        }
      })
    },
    getArrObjectList (val) {
      let arrObject = []
      val.length && val.forEach(ids => {
        this.thisArrList = []
        this.options.forEach(item => {
          if (ids.includes(item.id)) {
            this.findArrObject(item, ids)
            arrObject.push(this.thisArrList)
          }
        })
      })
      return arrObject
    },
    log (val) {
      this.keyword = val
      this.$emit('change', val)
    },
    filter: function (op) {
      return op.name.toString().indexOf(this.keyword) > -1
    }
  }
}
</script>

<style lang="less" scoped>
/** base color */
@col_b_01:#fff;
@col_b_03:#666;

/** other color */
@col_o_05:#1c7bef;

// 级联多选样式重置
.cascader-multi * {
  color: #000!important;
}
.cascader-multi {
  color: #000!important;
  /deep/ .icon-arrow {
    &::before{
      border-top-color: #c0c4cc;
      font-size: 14px;
    }
    right: 10px;
  }
  position: relative;
  padding: 0 5px;
  border: 1px solid #bbb;
  border-radius: 2px;
  background: @col_b_01;
  cursor: pointer;
  line-height: 28px;
}
.cascader-multi /deep/ .input.val {
  color: #bbb;
  background-color: @col_b_01!important
}
.cascader-multi /deep/ .val {
  height: 22px;
  line-height: 22px;
  background: #f0f2f5;
  border-radius: 4px;
  color: #000!important;
}
.cascader-multi:hover {
  border: 1px solid #1C7CEF;
}
.cascader-multi /deep/ span.val {
  padding-left: 4px;
  color: #C5C8CF !important;
  background: @col_b_01;
}
.cascader-multi .values {
  margin-top: 2px!important;
  color: #000!important;
}
.cascader-multi.disabled {
  background: #eee;
  border-color: #e4e7ed;
  cursor: not-allowed;
}
.cascader-multi.disabled /deep/ .icon-del {
  display: none!important;
}
.cascader-multi /deep/ .option {
  height: 32px;
  line-height: 32px;
  color: #000!important;
  white-space: nowrap;
}

.cascader-multi.cascader-multi /deep/ .option.selected, .cascader-multi.cascader-multi .options .option.selected {
  .icon-selected {display: none}
  .icon-expand::before {border-left-color: @col_b_03}
  color: @col_o_05!important;
  font-weight: bold!important;
}
.cascader-multi.cascader-multi /deep/ .scrollbar-content:hover .option {
  color: #000!important;
  &.selected {
    background: none!important;
    color: @col_o_05!important;
    font-weight: bold;
  }
  &:hover {
    background: @col_o_05!important;
    color: @col_b_01!important;
  }
}
.cascader-multi /deep/ .v {
  font-size: 14px;
  color: #000!important;
}
.cascader-multi.cascader-multi /deep/ .option:hover, .cascader-multi.cascader-multi .options .option:hover {
  .icon-expand::before {border-left-color: @col_b_01}
  .icon-expand::after {border-left-color: @col_o_05}
}
</style>

<template>
<div class="radio-list">
  <div class="search">
    <el-input
        @input="search"
        style="width: 100%;"
        size="small"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="word">
    </el-input>
  </div>
  <div class="list-content">
    <el-radio-group v-model="selected">
      <ul>
        <li class="list-item" :class="{'list-item-b': !attrs.icon}" :key="item.id" v-for="item in list">
          <el-radio :label="item.id">
            <template v-if="attrs.icon">
              <div class="icon-wrap" :class="{circleIcon: circleIcon}">
                <ever-image style="width: 40px;height: 40px;" :src="item[attrs.icon]"></ever-image>
              </div>
            </template>
            <span class="list-text">{{getText(item)}}</span>
          </el-radio>
        </li>
      </ul>
    </el-radio-group>
  </div>
  <div class="pager-wrap">
    <el-pagination
        background
        small
        :pager-count="5"
        :current-page="current"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</div>
</template>

<script>
import filePath from '../../mixins/filePath'

export default {
  name: 'radio.list',
  mixins: [filePath],
  props: {
    value: String,
    total: {
      type: Number,
      default: 0
    },
    current: Number,
    pageSize: Number,
    list: Array,
    attrs: {
      type: Object,
      default: () => {
        return {
          id: 'id',
          label: 'label',
          icon: 'icon',
          defaultImg: '',
          format: null
        }
      }
    },
    circleIcon: Boolean
  },
  data () {
    return {
      word: '',
      selected: ''
    }
  },
  watch: {
    selected (newVal) {
      this.$emit('input', newVal)
    }
  },
  methods: {
    handleCurrentChange (current) {
      this.$emit('currentChange', current)
    },
    search () {
      this.$emit('search', this.word)
    },
    getText (data) {
      if (this.attrs.format && typeof this.attrs.format === 'function') {
        return this.attrs.format(data)
      }
      return data[this.attrs.label]
    }
  }
}
</script>
<style>
  .el-pagination__jump{
    margin-left: 0;
  }
  .el-pagination__total{
    margin-right: 0;
  }
  .radio-list .el-radio__label{
    vertical-align: middle;
  }
  .radio-list .el-radio-group{
    width: 100%;
  }
  .radio-list .el-radio{
    width: 100%;
  }
</style>
<style scoped lang="less">
  ul,li{
    margin: 0;
    padding: 0;
  }
  .pager-wrap{
    width: 100%;
    overflow: hidden;
  }
  .search{
    margin-bottom: 10px;
  }
  .list-content{
    background-color: #ffffff;
    padding: 0 20px;
    margin-bottom: 10px;
    height: 400px;
    overflow: auto;
    box-sizing: border-box;
    .list-item{
      .icon-wrap{
        width: 40px;
        height: 40px;
        display: inline-block;
        .el-image{
          height: 100%;
        }
        &.circleIcon{
          border-radius: 50%;
          overflow: hidden;
        }
      }
      &.list-item-b{
        margin: 20px 0;
      }
      margin: 10px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .is-checked{
        .list-text{
          color: #1C7BEF;
        }
      }
      .list-text{
        font-size: 14px;
        color: #333333;
        vertical-align: top;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        max-width: 320px;
      }
    }
  }
</style>

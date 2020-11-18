<template>
  <div class="layout_inner">
    <div class="min-high pos_re prescription-box">
      <div class='leftSearch'>
        <left-search-list :tabsName='tabsName' :isShowAllBtn='true' @changeShow='changeShow' @changeRow='changeRow' @rowId="row = ''" ref='searchListRef'></left-search-list>
      </div>
      <div style='flex-grow: 1' v-if='row'>
        <user-info :isShow='isShow' :row='row' ref='userRef' @closeSearch='closeSearch'></user-info>
      </div>
    </div>
  </div>
</template>
<script>
import leftSearchList from '../leftsearchlist'
import userInfo from './userinfo'
export default {
  components: {
    leftSearchList,
    userInfo
  },
  data () {
    return {
      tabsName: {
        tab1: '待审核',
        tab2: '已审核'
      },
      isShow: false,
      row: ''
    }
  },
  methods: {
    changeShow (val) {
      this.isShow = val
      this.row = ''
    },
    changeRow (row) {
      this.row = row
    },
    /**
     * 审核弹框关闭触发查询
     */
    closeSearch () {
      this.row = ''
      this.$refs.searchListRef.searchList()
    }
  }
}
</script>
<style lang="less" scoped>
.layout_inner{
  height: 100%;
  padding-bottom: 20px;
}
.prescription-box{
  padding: 20px;
  display: flex;
  .leftSearch{
    border-right: 1px solid #ddd;
    margin-right: 10px;
  }
}
</style>

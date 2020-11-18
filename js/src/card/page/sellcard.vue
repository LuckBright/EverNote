<template>
  <div id="myrecharge">
    <ever-bread-crumb name="开卡"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <el-tabs @tab-click="changeTabs" active-name="1">
          <el-tab-pane label="卡号开卡" name="1">
            <open-card-tabs-two :select-data="selectData" @selectuser="showSelectUserPop" @deleteuser="deleteUser">
            </open-card-tabs-two>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <select-user-pop ref="selectuser" @selectUserVal="setSelectData"></select-user-pop>
  </div>
</template>

<script>
  import openCardTabsTwo from '../page/opencardtabstwo'
  import selectUserPop from '../page/selectusers'
  export default {
    data () {
      return {
        currTabs: '1',
        selectData: {
          userInfo: [],
          memberCardShares: []
        },
        selectNum: {
          userInfo: 1,
          memberCardShares: 5
        }
      }
    },
    methods: {
      changeTabs (tab) {
        this.currTabs = tab.name
        this.selectData = {
          userInfo: [],
          memberCardShares: []
        }
      },
      showSelectUserPop (name, count) {
        this.selectNum[name] = count
        this.$refs.selectuser.onDialogOpen(name, this.selectData[name], this.selectNum[name])
      },
      setSelectData (selected) {
        this.selectData[selected.key] = selected.data
      },
      deleteUser (i, name) {
        this.selectData[name].splice(i, 1)
      }
    },
    components: {
      openCardTabsTwo,
      selectUserPop
    }
  }
</script>
<style scoped>
.clearfix{*zoom:1;}
.clearfix:after{display:block;overflow:hidden;clear:both;height:0;visibility:hidden;content:".";}
.fl{float: left;}
.fr{float: right;}
.main-head form{margin-top: 0;}
.layout_inner {padding:0 20px;}
.panel-body {padding:0 15px;}
</style>

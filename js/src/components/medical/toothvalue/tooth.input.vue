<template>
  <el-card class="tcm-card" v-show="isShow">
    <el-row class="tcm-card-header">
      <el-col :span="23">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="title" name="first">
            <span slot="label">{{title}}</span>
            <div class="tcm-card-body">
              <el-row v-for="(item,i) in dataList" :key="i">
                <el-col :span="2" align="left">
                  <label class="title">{{item.name}}</label>
                </el-col>
                <el-col :span="22">
                  <span
                    class="fnt"
                    v-for="(arr, i) in item.list"
                    :key="i"
                    @click="selectItem(arr)"
                  >{{arr}}</span>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="模版" name="second">
            <span slot="label">模版</span>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="1" align="right">
        <i class="el-icon-close" @click="isShow=false"></i>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { toothDict } from './tooth.dict'

export default {
  props: ['inputvalue', 'code'],
  data () {
    return {
      isShow: false,
      currentTag: 0,
      list: toothDict,
      title: '',
      dataList: [],
      activeName: 'first'
    }
  },
  created () {
    for (var i = 0; i < toothDict.length; i++) {
      if (toothDict[i]['code'] === this.code) {
        this.dataList = toothDict[i]['list']
        this.title = toothDict[i]['name']
      }
    }
  },
  methods: {
    selectItem (val) {
      let textArr = this.inputvalue ? this.inputvalue.split('，') : []
      textArr.push(val)
      this.$emit('update:inputvalue', textArr.join('，'))
    }
  }
}

</script>
<style scoped>
.tcm-card {
  border-width: 1px;
  position: absolute;
  z-index: 9;
  top: 97px;
  width: auto;
}
.tcm-card-header .el-icon-close {
  color: #cccccc;
  font-size: 15px;
  cursor: pointer;
}
.toothInput .el-card__body {
  padding: 0;
}
.tcm-card .tcm-card-body {
  height: 160px;
  overflow-y: auto;
}
.tcm-card .el-row {
  margin-bottom: 10px;
}
.tcm-card .el-row label.title {
  display: inline-block;
  font-size: 14px;
}
/*  .tcm-card .el-checkbox-group{display: inline-block;color: #666;}
  .tcm-card .el-radio-group{padding-left:0;padding-right:20px;border-right: 1px solid #ddd;}
  .tcm-card .el-checkbox-group .el-checkbox,
  .tcm-card .el-radio-group .el-radio{color: #666;}
  .tcm-card .el-checkbox-group .el-checkbox{margin-right: 15px;}
  .tcm-card .el-checkbox-group .el-checkbox + .el-checkbox{margin-right: 15px;margin-left: 0;}*/
/*  .tcm-card .el-button__tag{margin: 0 15px 0 0;background: #ECF5FF;border: 1px solid #B3D8FF;padding: 7px 17px; color: #409EFF; border-radius: 2px;}
  .tcm-card .el-button__tag + .el-button{margin-left: 0;}
  .tcm-card .el-button__tag:hover{background: #409EFF;color: #ffffff;border-color: #409EFF;}*/
/*.tcm-card .el-radio-group + .el-radio-group{padding:0 20px;}
  .tcm-card .el-radio-group + .el-radio-group:last-child{border-right: none;}*/
/*  .tcm-card .submit-btn{width: 156px;text-align: center;}
*/
.fnt {
  display: inline-block;
  line-height: 22px;
  padding: 0 8px;
  border: 1px solid #e3e3e3;
  color: #969aa5;
  margin-right: 10px;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  margin-bottom: 5px;
}
.fnt:hover {
  color: #00a8cb;
  border-color: #00a8cb;
}
</style>

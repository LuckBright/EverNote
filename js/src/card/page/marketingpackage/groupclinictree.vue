<template>
  <div>
    <div class="tree-style">
      <div class="diy-tbody">
        <span>机构列表</span>
        <span style="width:270px;">失效日期</span>
        <span v-if="type==1 && $route.query.categoryId !== '06'" style="width:120px;">折扣比例</span>
        <span v-if="type==2" style="width:120px;">折后总金额</span>
        <span>可售机构</span>
        <span>可用机构</span>
      </div>
      <el-tree
        :data="treeData"
        ref="tree"
        node-key="id"
        :default-expand-all="true"
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <el-button type="text" @click="handleNodeClick(data)">{{ node.label }}</el-button>
          </span>
          <span v-if="!data.border" class="diy-tr" style="width: 270px;">
            <el-date-picker
              v-model="data.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </span>
          <span v-if="!data.border && type == 1 && $route.query.categoryId !== '06'" class="diy-tr" style="width:120px;">
            <ever-number v-model="data.discount" number-type="number"></ever-number>
          </span>
          <span v-if="!data.border && type == 2 && $route.query.categoryId !== '06'" class="diy-tr" style="width:120px;">
            <ever-number v-model="data.totalPriceDisSet" number-type="number"></ever-number>
          </span>
          <span v-if="!data.border" class="diy-tr">
            <el-checkbox v-model="data.isSale" :true-label="1" :false-label="0"></el-checkbox>
          </span>
          <span v-if="!data.border" class="diy-tr border">
            <el-checkbox v-model="data.isUse" :true-label="1" :false-label="0"></el-checkbox>
          </span>
        </span>
      </el-tree>
    </div>
    <div style="margin-top:20px;">
      <el-button type="primary" @click="confirm" :disabled="isClinic == 1 || isGroupControl">确认更新</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/card/store/packagemanagement/api'
export default {
  props: ['treeData', 'region', 'isClinic', 'type', 'isGroupControl'],
  data () {
    return {
      api,
      id: this.$route.query.packageId,
      checkValArr: [],
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0, // 是否集团
    }
  },
  methods: {
    handleCheckChange () {

    },
    handleNodeClick (data) {
      data.isSale = (data.isSale === 0 ? 1 : 0)
      data.isUse = (data.isUse === 0 ? 1 : 0)
      if (data.children && data.children.length > 0) {
        this.changeVal(data.children)
      }
    },
    changeVal (data) {
      data.forEach(item => {
        item.isSale = (item.isSale === 0 ? 1 : 0)
        item.isUse = (item.isUse === 0 ? 1 : 0)
        if (item.children && item.children.length > 0) {
          this.changeVal(item.children)
        }
      })
    },
    loopVal (data) {
      data.forEach(item => {
        if (!item.border && (item.isSale === 1 || item.isUse === 1)) {
          this.checkValArr.push(JSON.parse(JSON.stringify(item)))
        }
        if (item.children && item.children.length > 0) {
          this.loopVal(item.children)
        }
      })
    },
    confirm () {
      this.checkValArr = []
      this.loopVal(this.treeData)
      this.checkValArr.forEach(item => {
        item.orgId = item.id
        delete item.id
        delete item.label
        if (this.type === 1) {
          delete item.totalPriceDisSet
        } else {
          delete item.discount
        }
      })
      if (this.checkValArr.length === 0) {
        this.$messageTips(this, 'error', '请设置关联机构')
        return
      }
      let params = {
        id: this.$route.query.packageId,
        setMealSale: this.checkValArr
      }
      api.updateBatchRange({
        isGroup: this.isGroup,
        data: [
          params
        ]
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '关联成功')
          if (this.$route.meta.isAdd === 1 && this.$route.query.categoryId !== '06') {
            this.$bus.$emit('package-tab', { name: '4' })
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .diy-tr{
    width: 100px;
    height: 32px;
    float: right;
    padding:0 10px;
    text-align: center;
    box-sizing: border-box;
    font-weight: 400;
  }
  .diy-tr.border {
    border-left: 1px solid #cccccc;
  }
  .diy-tr /deep/ .el-date-editor input {
    height: 24px;
    line-height: 24px;
  }
  .diy-tr /deep/ .el-input input {
    height: 24px;
    line-height: 24ppx;
  }
  .custom-tree-node /deep/ .el-button span {
    color:#000000;
    font-size:14px;
    font-weight: 400;
  }
  .custom-tree-node {
    position: relative;
    width: 100%;
  }
  .diy-tbody{
    height: 30px;
    line-height: 30px;
    background-color: #EEEEEE;
    span{
      float: right;
      width: 100px;
      text-align: center;
      padding:0 10px;
      box-sizing: border-box;
      color: #000000;
      font-weight: 500;
    }
    :first-child{
      float: left;
      padding-left: 10px;
    }
  }
  .tree-style {
    border: 1px solid #cccccc;
    border-bottom: none;
    /deep/ .el-tree-node__content {
      height: 30px;
      border-bottom: 1px solid #cccccc;
    }
    /deep/ .el-tree-node__children .el-tree-node:last-child {
      border: none !important;
    }
  }
  .diy-tbody {
    border-bottom: 1px solid #cccccc;
  }
</style>


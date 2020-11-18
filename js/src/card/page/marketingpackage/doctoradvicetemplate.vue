<template>
  <div class="MealTemplate">
    <div class="header">
      <strong class="title">医嘱模版引用</strong>
    </div>
    <hr>
    <div>
      <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" labelWidth="0" :is-query="true" :inline="true" v-ever-bind-enter @query="list()">
        <template slot="default">
          <el-form-item>
            <el-button @click="list()" type="primary">查询</el-button>
          </el-form-item>
          </template>
      </ever-form2>
    </div>
    <el-row v-loading="loading" style="height: 100%;">
      <el-col :span="20" :flex="true" style="height: calc(90vh - 180px); overflow-y: scroll;">
        <el-tree
        :data="treeData"
        :props="props"
        node-key="id"
        ref="mealtree"
        show-checkbox>
        <span class="custom-tree-node" slot-scope="{ node }">
          <span v-if="node.label.length < 15">{{ node.label }}</span>
          <el-tooltip v-else effect="dark" :content="node.label" placement="top-start">
            <span class="tooltip-con">{{ node.label }}</span>
          </el-tooltip>
        </span>
        </el-tree>
      </el-col>
      <el-col :span="4">
        <div class="quotebtn">
          <el-button type="primary" @click="handleQuote">引用</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import api from '@/card/store/packagemanagement/api'
let querySchema = [{
  label: '',
  name: 'categoryId',
  comp: 'sys-type',
  props: {
    placeholder: '请选择套餐分类',
    code: 'THC_MEAL_CLASSIFY_CODE'
  },
  span: 24
},
{
  label: '',
  name: 'name',
  props: {
    placeholder: '请输入套餐名称'
  },
  span: 20
}]
export default {
  // props: ['treeData'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema: querySchema,
      queryObj: queryObj,
      loading: false,
      props: {
        label: 'label',
        children: 'children'
      },
      packageDiscount: '',
      treeData: [],
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0
    }
  },
  created () {
    // this.list()
  },
  methods: {
    list () {
      this.loading = true
      let params = {
        categoryId: this.queryObj.categoryId,
        name: this.queryObj.name
      }
      if (this.$route.meta.type === 'plan') {
        params.categoryId = '06'
      } else {
        params.categoryIds = this.queryObj.categoryId || '01,02,03'
      }
      api.getPackageList(params).then(result => {
        let res = result.data && result.data.resultList
        // 医嘱套餐引用模板tree
        this.treeData = []
        for (let item of res) { // 套餐层
          let muluchildren = []
          if (item.setMealCatalogs && item.setMealCatalogs.length > 0) {
            for (let mulu of item.setMealCatalogs) { // 目录层
              if (mulu.setMealDetails && mulu.setMealDetails.length > 0) {
                let detailChildren = []
                for (let mealDetail of mulu.setMealDetails) { // 医嘱层
                  detailChildren.push({id: mealDetail.id, label: mealDetail.serviceName})
                }
                muluchildren.push({id: mulu.id, label: mulu.name, children: detailChildren})
              }
            }
          }
          if (item.setMealDetails && item.setMealDetails.length > 0) {
            for (let mealDetail of item.setMealDetails) { // 直接放在根目录下的医嘱项
              muluchildren.push({id: mealDetail.id, label: mealDetail.serviceName})
            }
          }
          this.treeData.push({id: item.id, label: item.name, children: muluchildren})
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleQuote () {
      if (!this.$route.query.directoryId) {
        this.$messageTips(this, 'error', '请先选择一个要引用到的套餐目录')
        return false
      }
      // 获取套餐的折扣信息
      let params = {
        id: this.$route.query.packageId,
        isGroup: this.isGroup
      }
      api.getPackageById(params).then(result => {
        this.packageDiscount = result.data.discount
        let checkedNodes = this.$refs.mealtree.getCheckedNodes()
        let nodeids = []
      // 去除目录项，只留医嘱详细项
        for (let node of checkedNodes) {
          if (!node.children) {
            nodeids.push(node.id)
          }
        }
        let params = {
          setMealDetailIds: nodeids, // 选中要引用的医嘱id集合
          setMealId: this.$route.query.packageId, // 套餐id
          setMealCatalogId: this.$route.query.directoryId === 'root' ? '' : this.$route.query.directoryId, // 引用集合要添加到的目录id
          discount: this.packageDiscount || 100, // 默认折扣
          isGroup: this.isGroup
        }
        api.addMealDetailByQuote(params).then(result => {
          this.$messageTips(this, 'success', '引用成功')
        // 引用成功之后，刷新该目录下医嘱信息
          this.$bus.$emit('refresh:AdviceAfterQuote')
        })
      }).catch(() => {
        this.$messageTips(this, 'error', '未检测到新建套餐信息，无法使用引用功能')
      })
    }
  }
}
</script>
<style scoped>
.MealTemplate{
  position: relative;
  padding:15px;
}
.header strong.title{
  padding-left: 6px;
  border-left: 3px solid #1C7BEF;
  font-size: 16px;
  color: #000;
  line-height: 36px;
}
.quotebtn{
  position: absolute;
  top: 200px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tooltip-con {
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

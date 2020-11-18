<template>
  <div>
    <!-- <ever-bread-crumb name="药理分类" path="/group/pharmacologys" :showTitle="true"></ever-bread-crumb> -->
    <div class="layout_inner">
      <div class="main-head pos_re">
        <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" :is-query="true" @query="handelGetId">
          <template slot="materialSpuId">
            <pharma-cology-cascader style="width: 400px;" v-model="queryObj.materialSpuId" :customApi="api" :isValueArr="true"></pharma-cology-cascader>
          </template>
        </ever-form2>
        <div class="head-btn-right pos_ab">
          <el-button type="primary" @click="$router.push('/group/fastpharmacologys/')">未关联药理分类的药品</el-button>
        </div>
      </div>
      <classification-tree class="mt10" :customApi="api" :customClassifyId="materialSpuArr"></classification-tree>
    </div>
  </div>
</template>
<script>
import classificationTree from '@/warehouse/page/components/classificationtree'
import pharmaCologyCascader from '@/warehouse/page/components/pharmacologycascader'
import api from '@/warehouse/page/group/store/pharmacologyapi'

let querySchema = [
  {
    name: 'materialSpuId',
    label: '',
    comp: 'custom'
  }
]
export default {
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj: obj,
      materialSpuArr: []
    }
  },
  methods: {
    handelGetId () {
      this.materialSpuArr = this.queryObj.materialSpuId
    }
  },
  components: {
    classificationTree,
    pharmaCologyCascader
  }
}
</script>
<style lang="less" scoped>
</style>

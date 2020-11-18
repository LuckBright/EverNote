<template>
  <div>
    <ever-bread-crumb
      name="关联药品"
      path="/manages/agencypharmacologys"
      :showTitle="true"
      :pathTo="true"
    ></ever-bread-crumb>
    <div class="layout_inner flex_column_full">
      <div class="f16 mb5">
        <span>当前药理分类:</span>
        <span>{{drugsName}}</span>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="flex_column_full_hidden">
        <el-tab-pane label="已关联药品" name="associated" class="row">
          <div class="flex_column_full">
            <ever-form2
              :schema="querySchema"
              v-model="obj"
              ref="form"
              :inline="true"
              :is-query="true"
              @query="searchList"
            ></ever-form2>
            <span class="f14">已关联药理分类的药品 {{totalCount || 0}} 个</span>
            <div class="flex_col_1_hidden">
              <el-table
              style="height: calc(100% - 100px)"
              class="flex_column_full_hidden x-hidden"
              v-loading.fullscreen.lock="loading"
              :data="tableData"
              border>
              <el-table-column show-overflow-tooltip label="物资名称">
                <template slot-scope="scope">
                  <!-- 药理分类展示SPU维度数据 -->
                  <wh-code-to-name
                    :isExt="true"
                    :cType="3"
                    :patchObj="{
                      standard: true,
                      list: scope.row.ext,
                    }"
                  ></wh-code-to-name>
                </template>
              </el-table-column>
              <el-table-column label="适应症">
                <template slot-scope="scope">
                  <wh-code-to-name
                    :isExt="true"
                    :showIcon="false"
                    :patchObj="{
                      code: [INDICATION],
                      list: scope.row.ext,
                      isInfo: false
                    }"
                  ></wh-code-to-name>
                </template>
              </el-table-column>
            </el-table>
            </div>
            <ever-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pagesize="pagesize"
              :totalCount="totalCount"
              :current="current"
            ></ever-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import { patch, INDICATION, DRUGTYPE, pharmacologyCategoryRecursion, MATERILA_CODE } from '@/util/common'
import groupassociationdrugApi from '@/warehouse/page/group/store/associationdrugapi'
import materiallistApi from '@/warehouse/page/institutionmaterial/store/materiallistapi'
import api from '@/warehouse/page/agency/store/agencyassociationdrugapi'

let querySchema = [
  {
    name: 'materialSpuId',
    label: '',
    comp: 'everRemoteMethod',
    props: {
      placeholder: '通用名或商品名',
      api: materiallistApi,
      isLocalSettingSearch: true,
      showKeys: true,
      simpleQuery: true,
      needObjFlag: true,
      isMaterialPropertys: 'materialPropertys',
      params: { classifyId: DRUGTYPE, isClinic: false }
    },
    style: 'width: 300px;'
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      activeName: 'associated',
      drugsName: '',
      querySchema,
      MATERILA_CODE,
      obj,
      queryObj: {},
      objId: this.$route.params.id,
      INDICATION
    }
  },
  created () {
    this.queryObj = {...this.boj}
    this._getPharmacologyCategoryName(this.objId)
    // 药理分类ID
    this.queryObj.pharmacologyCategoryId = this.objId
    // 药品
    this.queryObj.classifyId = DRUGTYPE
  },
  methods: {
    searchList () {
      if (this.obj.materialSpuId instanceof Object) {
        this.queryObj.materialSpuId = this.obj.materialSpuId.materialSpuId
        this.list(true)
      } else {
        this.queryObj.materialSpuId = ''
        this.list(true)
      }
    },
    handleClick (tab, event) { },
    _getPharmacologyCategoryName (id) {
      groupassociationdrugApi.getPharmacologyCategoryById(id).then(res => {
        if (res && res.id) {
          let resName = []
          pharmacologyCategoryRecursion({ data: res, recursionName: 'pharmacologyCategorySonObject', pharmacologyArr: resName, arrName: 'name' })
          if (resName.length) this.drugsName = resName.join(' > ')
        }
      })
    },
    ...patch
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
@import './src/warehouse/page/group/view/organization/index.scss';
</style>

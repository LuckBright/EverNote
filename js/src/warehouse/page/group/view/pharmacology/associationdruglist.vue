<template>
  <div>
    <ever-bread-crumb name="关联药品" path="/group/pharmacologys" :showTitle="true" :pathTo="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="f14 mb20">
        <span>当前药理分类:</span>
        <span class="ml5">{{drugsName}}</span>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="关联药品" name="notAssociated">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            ref="form"
            :inline="true"
            :is-query="true"
            @query="list(true)"
          ></ever-form2>
          <el-table
            v-loading.fullscreen.lock="loading"
            :data="tableData"
            style="width: 100%"
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            border
            :stripe="false"
          >
            <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
            <el-table-column show-overflow-tooltip label="物资名称" prop>
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push('')">
                  <wh-code-to-name
                    :patchObj="{
                      list: scope.row.materialDictPropertys || scope.row.materialPropertys
                    }"
                  ></wh-code-to-name>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="适应症" prop>
              <template slot-scope="scope">
                <span>
                  <wh-code-to-name
                    :showIcon="false"
                    :patchObj="{
                      code: [INDICATION],
                      list: scope.row.materialPropertys,
                      isInfo: false
                    }"
                  ></wh-code-to-name>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="end">
            <ever-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pagesize="pagesize"
              :totalCount="totalCount"
              :current="current"
            ></ever-pagination>
          </el-row>
          <el-button
            :disabled="multipleSelection.length ? false : true"
            type="primary"
            @click="handelAssociation()"
          >关联</el-button>
        </el-tab-pane>
        <el-tab-pane label="已关联药品" name="associated">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            ref="form"
            :inline="true"
            :is-query="true"
            @query="list(true)"
          ></ever-form2>
          <span class="f16">已关联药理分类的药品 {{totalCount || 0}} 个</span>
          <el-table
            v-loading.fullscreen.lock="loading"
            :data="tableData"
            style="width: 100%"
            border
            :stripe="false"
          >
            <el-table-column width="10"></el-table-column>
            <el-table-column show-overflow-tooltip label="物资名称" prop>
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push('')">
                  <wh-code-to-name
                    :patchObj="{
                      list: scope.row.materialPropertys
                    }"
                  ></wh-code-to-name>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="适应症" prop>
              <template slot-scope="scope">
                <span>
                  <wh-code-to-name
                    :showIcon="false"
                    :patchObj="{
                      code: [INDICATION],
                      list: scope.row.materialPropertys,
                      isInfo: false
                    }"
                  ></wh-code-to-name>
                </span>
              </template>
            </el-table-column>
            <el-table-column label width="100" align="center" prop>
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="handleRelease(scope.row)">解除关联</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="end">
            <ever-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pagesize="pagesize"
              :totalCount="totalCount"
              :current="current"
            ></ever-pagination>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <tips-dialog title="提示消息" content="确认是否解除关联？" ref="dialog" :function="handleDel"></tips-dialog>
  </div>
</template>
<script>
import list from '@/util/list'
import { debounce, patch, INDICATION, DRUGTYPE, pharmacologyCategoryRecursion } from '@/util/common'
import api from '@/warehouse/page/group/store/associationdrugapi'
import materialdictSpuApi from '@/warehouse/page/groupmaterial/store/materialdictspuapi'
import tipsDialog from '@/warehouse/page/components/tipsdialog'
let querySchema = [
  {
    name: 'materialSpuId',
    label: '',
    comp: 'everRemoteMethod',
    props: {
      placeholder: '通用名或商品名',
      showKeys: true,
      api: materialdictSpuApi,
      isLocalSettingSearch: true,
      isMaterialPropertys: 'materialPropertys',
      apiName: 'spuList',
      params: { classifyId: DRUGTYPE }
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
      activeName: 'notAssociated',
      drugsName: '',
      multipleSelection: [],
      listApiName: '',
      querySchema,
      queryObj: obj,
      objId: this.$route.params.id,
      delId: '',
      INDICATION
    }
  },
  created () {
    this._getPharmacologyCategoryName(this.objId)
    // 药理分类ID
    this.queryObj.pharmacologyCategoryId = this.objId
    // 药品
    this.queryObj.classifyId = DRUGTYPE
  },
  methods: {
    handleDel: debounce(function () {
      api.del(this.delId).then(res => {
        if (res.flag) {
          this.list()
        }
      })
    }),
    handleClick (tab, event) {
      this.listApiName = ''
      this.totalCount = 0
      this.tableData = []
      this.queryObj.materialSpuId = ''
      if (tab.name === 'associated') {
        this.listApiName = 'associationList'
      }
      this.list()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleRelease (data) {
      this.delId = data.categoryMaterialRelationId
      this.$refs.dialog.open()
    },
    handelAssociation: debounce(function () {
      let params = { pharmacologyCategoryId: this.objId, materialSpuIds: [] }
      this.multipleSelection.forEach(item => {
        params.materialSpuIds.push(item.id)
      })
      api.updateOrCreate(params).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '关联成功')
          this.$router.push('/group/pharmacologys')
        }
      })
    }),
    _getPharmacologyCategoryName (id) {
      api.getPharmacologyCategoryById(id).then(res => {
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
  },
  components: {
    tipsDialog
  }
}
</script>
<style <style lang="less" scoped>
</style>

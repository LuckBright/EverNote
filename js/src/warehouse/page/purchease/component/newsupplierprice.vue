<template>
  <div class="layout_inner p0i">
    <div class="panel-body p0i">
      <div class="main-head pos_re">
        <ever-form2
          :schema="querySchema"
          :inline="true"
          v-model="queryObj">
          <template slot="default">
            <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
          </template>
          </ever-form2>
      </div>
      <el-table :data="tableData">
        <el-table-column prop width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="物资编码" prop="materialsCode" width="180" align="center">
        </el-table-column> -->
        <el-table-column label="物资名称" prop="materialsName">
          <template slot-scope="scope">
            <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="specification" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.spec || '-'}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" prop="packingUnit" label="包装单位">
          <template slot-scope="scope">
            {{scope.row.unitName || '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop
          align="center"
          width="120"
          label="采购单价"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.id && !scope.row.feState"
            >{{scope.row.purchasePrice | formatToFinacial(4)}}</div>
            <div v-else>
              <el-input-number
                placeholder="采购单价"
                class="priceInput"
                v-model="scope.row.purchasePrice"
                :controls="false"
                size="small"
                :precision="4">
              </el-input-number>
            </div>
          </template>
        </el-table-column>
        <el-table-column

          prop
          align="center"
          width="120"
          label="批发单价"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.id && !scope.row.feState"
            >
            <span v-if="scope.row.wholesalePrice !== null">{{scope.row.wholesalePrice | formatToFinacial(4)}}</span>
            <span v-else>-</span>
            </div>
            <div v-else>
              <el-input-number
                placeholder="批发单价"
                class="priceInput"
                v-model="scope.row.wholesalePrice"
                :controls="false"
                size="small"
                @blur="handlerWholesalePrice(scope.row)"
                :precision="4">
              </el-input-number>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.id && !scope.row.feState">
              <el-button size="small" type="info" @click="handleDetail(scope.row)">调价记录</el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleModifyPrice(scope.row, scope.$index)"
              >调价</el-button>
            </div>
            <div v-else>
              <el-button size="small" type="primary" @click="handleSave(scope.row)">保存</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleCancel(scope.row, scope.$index)"
              >取消</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-row>
    </div>
    <!-- 调价记录 -->
    <sup-detail ref="detail" :goodData="selectData" :isId="false"></sup-detail>
  </div>
</template>

<script>
import localApi from '@/warehouse/store/localdrugsettingapi.js' // 查询物资接口
import api from '@/warehouse/page/purchease/contract/api/contrct.js'
import suppSaveApi from '@/warehouse/store/supplierapi.js'
import supDetail from '@/warehouse/page/purchease/contract/component/suppdetail.vue' // 调价记录

var querySchema = [
  {
    name: 'localMaterialId',
    label: '商品名称',
    comp: 'material-select',
    props: {
      params: { isClinic: true, ifMoreThan: 1, offset: 0, splitFlag: 0 }
    },
    style: 'width: 350px'
  }
]
export default {
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.supplierLocalId = this.$route.params.supplierId
    return {
      queryObj,
      querySchema,
      suppSaveApi,
      objId: this.$route.params.id,
      supplierLocalId: this.$route.params.supplierId,
      tableData: [],
      offset: 0,
      localApi,
      api,
      selectData: {},
      current: 1,
      pagesize: 20,
      totalCount: 0,
      pageSizes: [10, 20, 50, 100],
      defaultObj: {} // 默认合同
    }
  },
  created () {
    let params = {
      supplierLocalId: this.supplierLocalId,
      offset: 0,
      pagesize: 20,
      status: 5,
      isDefault: 1
    }
    api.queryList(params).then(res => {
      if (res) {
        this.defaultObj = res[0]
        this.handlerQuery(res[0])
      }
    })
  },
  components: {
    supDetail
  },
  methods: {
    handleDetail (row) { // 掉价记录
      this.selectData = row
      this.$refs.detail.open()
    },
    list (data) { // 查列表
      if (data) {
        let params = {
          contractId: data.id,
          materialsId: this.queryObj.localMaterialId,
          offset: this.offset,
          pagesize: this.pagesize
        }
        api.selectNoContract(params).then(res => {
          if (res) {
            res.map(item => {
              item.fePrice = item.purchasePrice // 原采购单价
              item.feTradePrice = item.wholesalePrice // 原批发单价
            })
            this.tableData = res
            this.totalCount = res['totalCount']
          } else {
            this.tableData = []
            this.totalCount = 0
          }
        })
      }
    },
    handlerQuery (id) { // 物资查询
      this.list(this.defaultObj || id)
    },
    handleModifyPrice (row, index) { // 调价
      row.feState = 1
      if (row.wholesalePrice === null) row.wholesalePrice = undefined
      this.$set(this.tableData, index, row)
    },
    handlerWholesalePrice (row) {
      if (row.materialsId) {
        if (row.wholesalePrice < 0) {
          row.wholesalePrice = ''
          return this.$messageTips(this, 'warning', '批发单价小于0，请重新录入')
        }
      }
    },
    handleSave (row, index) { // 保存
      if (row.purchasePrice === '' || row.purchasePrice === undefined) return this.$messageTips(this, 'warning', '请检查输入的物资单价不能为空，请核对', '提示')
      if (row.purchasePrice && row.purchasePrice < 0) return this.$messageTips(this, 'warning', '请检查输入的物资单价不能小于0，请核对', '提示')
      if (row.wholesalePrice && row.wholesalePrice < 0) return this.$messageTips(this, 'warning', '请检查输入的批发价格不能小于0，请核对', '提示')
      if (row.fePrice !== row.purchasePrice || row.feTradePrice !== row.wholesalePrice) {
        let params = JSON.parse(JSON.stringify(row))
        params.purchasePrice = params.purchasePrice === undefined ? '' : params.purchasePrice
        params.wholesalePrice = params.wholesalePrice === undefined ? '' : params.wholesalePrice
        suppSaveApi.update(params).then(res => {
          if (typeof res === 'object') {
            row.feState = 0
            this.$set(this.tableData, index, row)
            this.list(this.defaultObj)
            return this.$messageTips(this, 'success', '保存成功')
          }
        })
      } else {
        row.feState = 0
        this.$set(this.tableData, index, row)
        this.list(this.defaultObj)
      }
    },
    handleCancel (row, index) { // 取消
      row.purchasePrice = row.fePrice
      row.wholesalePrice = row.feTradePrice
      row.feState = 0
      this.$set(this.tableData, index, row)
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.current - 1) * this.pagesize
      this.list(this.defaultObj)
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.list(this.defaultObj)
    }
  },
}

</script>
<style lang="less" scoped>
.priceInput {
  width: 100px;
  /deep/ .el-input__inner {
    padding: 0;
  }
}
</style>

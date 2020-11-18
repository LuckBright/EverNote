<template>
  <div>
    <ever-bread-crumb name="采购申请汇总" showTitle="true" :pathTo="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <!-- 基本信息 -->
        <div class="basic-info">
          <!-- 标题 -->
          <h4>基础信息</h4>
          <ever-form2
            :schema="schema"
            :nosubmit="true"
            class="from readform"
            v-model="obj">
          </ever-form2>
        </div>
        <!-- 采购单列表 -->
        <div v-if="obj.status == 2">
          <h4>采购单列表
            <doc-download
              size="small"
              class="fr mb10"
              v-if="obj.orders.length"
              @downFile="exportTable(1)"
              ref="exportProSupTable"
              btnTxt="导出采购单"
            ></doc-download>
          </h4>
          <el-table
            border
            :data="obj.orders">
            <el-table-column width="50"><template slot-scope="scope">{{scope.$index + 1}}</template></el-table-column>
            <el-table-column label="采购单号">
              <template slot-scope="scope">
                <el-button @click="$router.push(`/goods/focusdrugpurchease/${scope.row.id}?focus=focus`)" type="text">{{scope.row.code}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="供应商" prop="supplierName"></el-table-column>
            <el-table-column label="合同" prop="contractName"></el-table-column>
            <el-table-column label="创建人" prop="createBy"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
          </el-table>
        </div>
        <!-- 采购申请单列表 -->
        <div v-if="obj.status == 2">
          <h4>采购申请单列表
            <doc-download
              size="small"
              class="fr mb10"
              v-if="obj.applyDtos.length"
              @downFile="exportTable(2)"
              ref="exportProSupTable2"
              btnTxt="导出采购申请单"
            ></doc-download>
          </h4>
          <el-table
            border
            :data="obj.applyDtos">
            <el-table-column width="50"><template slot-scope="scope">{{scope.$index + 1}}</template></el-table-column>
            <el-table-column label="采购申请单号">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push(`/goods/focusprocurementdetail/${scope.row.id}`)">{{scope.row.code}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="机构名称" prop="clinicName"></el-table-column>
            <el-table-column label="收货库房" prop="storageRoomName"></el-table-column>
            <el-table-column label="申请人" prop="applicantName"></el-table-column>
            <el-table-column label="申请时间" prop="applyTime"></el-table-column>
          </el-table>
        </div>
        <!-- 采购申请单物资列表 -->
        <procurement-application :listData="obj" @change="getMaterList"></procurement-application>
        <!-- 按钮 -->
        <div v-if="obj.status == 1">
          <el-button type="primary" @click="submitSummary" :loading="btnLoading">提交</el-button>
          <el-button @click="backSummaryList" :loading="btnLoading">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../storages/store/procurementapi'
import { debounce } from '@/util/common'
import { DOWNLOAD_FILE } from '@/warehouse/views/util/constant.js'
import procurementApplication from '@/warehouse/page/purchease/component/procurementapplication.hz.vue' // 新版采购申请物资列表

let schema = [
  {
    name: 'billsNum',
    label: '汇总单据数量:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'orgNum',
    label: '汇总机构数量:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'remark',
    label: '备注:',
    span: 6
  }
]
let schema2 = [
  {
    name: 'code',
    label: '汇总单号:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'billsNum',
    label: '汇总单据数量:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'orgNum',
    label: '汇总机构数量:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createBy',
    label: '汇总人:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createTime',
    label: '汇总时间:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'remark',
    label: '备注:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  }
]

export default {
  data () {
    return {
      schema: [],
      obj: {},
      btnLoading: false,
      objId: this.$route.params.id,
      status: this.$route.query.status,
      totalPrice: 0
    }
  },
  created () {
    this.schema = this.status === '1' ? schema : schema2
    this.obj = this.$ever.createObjFromSchema(this.schema)
  },
  mounted () {
    api.querySummaryInfo({id: this.objId}).then(res => {
      if (res) {
        res.billsNum = res.billsNum + '张'
        res.orgNum = res.orgNum + '家'
        this.obj = res
        this.obj.itemDtos.forEach(item => {
          if (!item.price) item.price = undefined
          if (item.contractList && item.contractList.length) {
            let index = item.contractList.findIndex(item => item.status === 5)
            if (~index) item.defaultContrct = item.contractList[index]
          }
        })
      }
    })
  },
  methods: {
    exportTable: debounce(function (type) {
      api[type === 1 ? 'exportPurchaseOrderInfo' : 'focusExportPurchaseApplyInfo']({ id: this.objId }).then(res => {
        if (res) {
          this.$refs[type === 1 ? 'exportProSupTable' : 'exportProSupTable2'].downfile(DOWNLOAD_FILE + res.fileName)
          this.$messageTips(this, 'success', `${type === 1 ? '采购单' : '采购申请单'}导出成功`)
        }
      })
    }),
    backSummaryList () {
      this.$confirm('您填写的内容尚未提交，是否要离开页面？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/goods/procureapply')
      }).catch(() => {
        return false
      })
    },
    getMaterList (v, totalPrice) {
      this.obj.itemDtos = v
      this.totalPrice = totalPrice
    },
    submitSummary () {
      let params = {
        id: this.objId,
        totalPrice: this.totalPrice.indexOf(',') > -1 ? parseFloat(this.totalPrice.split(',').join('')) : parseFloat(this.totalPrice),
        itemDtos: JSON.parse(JSON.stringify(this.obj.itemDtos))
      }
      let check = params.itemDtos.some(item => {
        return !item.num || !item.supplierLocalId || !item.price
      })
      if (check) return this.everWarning('请先完善汇总单信息')
      let propHtml = ''
      params.itemDtos.forEach((item, index) => {
        if (!item.contractId && item.defaultContrct) propHtml += `${index === 0 ? '<div style="max-height: 200px; overflow-y:auto">' : ''}第${index + 1}行, ${item.materialName}<br>`
      })
      if (propHtml) {
        this.$confirm(propHtml + '</div><b>没有选择合同，将按照无合同购销方式提交，是否确认提交？</b>', '提示', {
          confirmButtonText: '提交',
          cancelButtonText: '返回',
          dangerouslyUseHTMLString: true,
        }).then(() => {
          params.itemDtos.forEach(item => {
            if (!item.contractId && item.defaultContrct) item.contractId = item.defaultContrct.id
            if (item.contractList) delete item.contractList
          })
          this.btnLoading = true
          api.submitSummary(params).then(res => {
            if (res) {
              this.everSuccess('完善汇总信息成功')
              this.$router.push('/goods/procureapply')
            }
            this.btnLoading = false
          })
        }).catch(() => {
          return false
        })
      } else {
        params.itemDtos.forEach(item => {
          if (!item.contractId && item.defaultContrct) item.contractId = item.defaultContrct
          if (item.contractList) delete item.contractList
        })
        this.btnLoading = true
        api.submitSummary(params).then(res => {
          if (res) {
            this.everSuccess('完善汇总信息成功')
            this.$router.push('/goods/procureapply')
          }
          this.btnLoading = false
        })
      }
    }
  },
  components: {
    procurementApplication
  }
}
</script>

<style lang="scss" scoped>
.layout_inner {
  padding: 20px;
  .panel-body {
    padding: 0;
  }
}
.mheight /deep/ .el-textarea__inner{
  height: 200px;
}
.from /deep/ .el-form-item .el-form-item__label {
  color: #999;
}
.stripTips {
  height: 14px;
  line-height: 14px;
  color: #333333;
  font-size: 14px;
  .strip {
    width: 3px;
    height: 14px;
    background: #1C7BEF;
  }
}
</style>

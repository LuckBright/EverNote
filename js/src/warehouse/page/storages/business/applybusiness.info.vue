<template>
  <div>
    <ever-bread-crumb name="申领" path="/storages/business/applybusinesses"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div v-for="(item, index) in infoList" :key="index">
          <div class="hr" v-if="index === 1" style="margin-bottom: 20px;"></div>
          <h4>基础信息</h4>
          <ever-form2
            :schema="item.schema"
            v-model="item.obj"
            :key="index"
            class="readform form"
            :nosubmit="true">
              <template slot="status">
                <span :class="{ 'red': item.status === 48 }">
                  {{item.obj.status | formateValueToFnt({list: FULL_STATE.apply})}}
                </span>
              </template>
              <template slot="outStoukCode">
              <a class="blue cur" @click="handleOutRoute(index)">{{item.obj.outStockCode}}</a>
              <span :class="{ 'red': item.obj.outStockStatus === 23 }">{{item.obj.outStockStatus | formateValueToFnt({list: FULL_STATE.outstock})}}</span>
            </template>
            <template slot="inStockCode">
              <a class="blue cur" @click="handleIntRoute(false, index)">{{item.obj.inStockCode}}</a>
              <span>{{item.obj.inStockStatus | formateValueToFnt({list: FULL_STATE.instock})}}</span>
            </template>
            <template slot="inReturnStockCode">
              <a class="blue cur" @click="handleIntRoute(true, index)">{{item.obj.inReturnStockCode}}</a>
              <span>{{item.obj.inReturnStockStatus | formateValueToFnt({list: FULL_STATE.instock})}}</span>
            </template>
            <template slot="description">
              <tooltip-info :content="item.obj.description"></tooltip-info>
            </template>
            <template slot="abolitionReason">
              <tooltip-info :content="item.obj.abolitionReason"></tooltip-info>
            </template>
          </ever-form2>
          <h4>物资明细</h4>
          <detail-table :tableData="item.purchaseRequisitionItem" :isBatch="isBatch"></detail-table>
          <!-- 取消按钮 -->
          <el-button type="primary" size="small" @click="handleCancel(index)" v-if="['42', '43', '48'].includes(`${item.obj.status}`)">取消</el-button>
        </div>
      </div>
    </div>
    <!-- 取消弹窗 -->
    <canceldrug-dialog ref="cancelDrug" @change="clickCancel" :title="'确认是否取消'"></canceldrug-dialog>
    <!-- loadinng -->
    <loading-cover :loading="onloadLoading">
      <h2 slot="title">数据加载中</h2>
    </loading-cover>
  </div>
</template>

<script>
import { floatTool, FULL_STATE, debounce } from '@/util/common'
import api from '@/warehouse/page/storages/store/applyapi.js'

let schema = [
  {
    name: 'code',
    label: '申领单号',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'status',
    label: '业务状态',
    comp: 'custom',
    span: 6
  },
  {
    name: 'applicantName',
    label: '申请人',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createDate',
    label: '申请时间',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'description',
    label: '备注',
    comp: 'custom',
    span: 6
  },
  {
    name: 'toStorageRoomName',
    label: '发货库房',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'outStoukCode',
    label: '出库任务单',
    comp: 'custom',
    span: 6
  },
  {
    name: 'requsitionStorageRoomName',
    label: '收货库房',
    comp: 'readonlyitem',
    span: 6
  }
]

const inStockSchema = {
  name: 'inStockCode',
  label: '入库任务单',
  comp: 'custom',
  span: 6
}

const returnStockSchema = {
  name: 'inReturnStockCode',
  label: '退返入库',
  comp: 'custom',
  span: 6
}

const cancelSchema = {
  name: 'abolitionReason',
  label: '取消原因',
  comp: 'custom',
  span: 6
}

export default {
  data () {
    return {
      floatTool,
      schema,
      FULL_STATE,
      infoList: [],
      isCanceIndex: 0,
      isBatch: false,
      onloadLoading: false,
      objId: this.$route.params.id || ''
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    handleIntRoute (flag, index) {
      const { inStockId, inStockStatus, inReturnStockStatus, inReturnStockId } = this.infoList[index]
      let isStorage = this.infoList[this.isCanceIndex].toStorageRoomId === this.storageId
      if (flag) {
        this.$router.push(inReturnStockStatus === FULL_STATE.instock[1].id ? `/storages/entry/entrysee/${inReturnStockId}` : inReturnStockStatus === 13 ? `/storages/entry/entryother/${inReturnStockId}` : `/storages/entry/entryedit/${inReturnStockId}?${'look='}${inReturnStockId}`)
      } else {
        this.$router.push(inStockStatus === FULL_STATE.instock[1].id ? `/storages/entry/entrysee/${inStockId}` : `/storages/entry/entryedit/${inStockId}?${inStockStatus === 13 && isStorage ? 'look' : 'look='}${inStockId}`)
      }
    },
    handleOutRoute (index) {
      const { outStockId, outStockStatus } = this.infoList[index]
      this.$router.push(outStockStatus === FULL_STATE.outstock[0].id ? `/storages/output/outputsee/${outStockId}` : `/storages/output/outputedit/${outStockId}?${outStockStatus === 24 ? 'look' : 'look='}${outStockId}`)
    },
    handleCancel (index) {
      this.isCanceIndex = index
      this.$refs.cancelDrug.open()
    },
    clickCancel: debounce(function (msg) {
      const { id, code } = this.infoList[this.isCanceIndex]
      let params = {
        id,
        abolitionReason: msg,
        status: 45,
        code
      }
      api.rollBackRequistion(params).then(res => {
        if (res) {
          this.getDetail()
          return this.everSuccess('取消申领单成功')
        }
      })
    }),
    async getDetail () {
      this.onloadLoading = true
      let params = { ids: [this.objId] }
      if (this.$route.query && this.$route.query.id) params.ids.splice(0, 0, this.$route.query.id)
      api.getById(params).then(res => {
        if (res && res.length) {
          this.isBatch = Boolean(res[0].pricingModel)
          this.infoList = res.length > 1 ? res.sort((a, b) => b['status'] - a['status']) : res
          this.infoList.forEach((item, index) => {
            let newSchema = JSON.parse(JSON.stringify(this.schema))
            this.$set(item, 'schema', newSchema)
            this.$set(item, 'obj', item)
            const { status, inReturnStockCode } = item
            if (status === 43 || (status === 44 && !inReturnStockCode)) {
              item.schema.splice(7, 0, inStockSchema)
            }
            if (['44', '45', '46', '47'].includes(`${status}`)) {
              if (['46', '47'].includes(`${status}`) || inReturnStockCode) {
                let inStock = item.schema.findIndex(schema => schema.name === 'inStockCode')
                if (~inStock) item.schema.splice(inStock, 1)
                item.schema.splice(7, 0, ...[returnStockSchema, inStockSchema])
              }
              if (['45', '47'].includes(`${status}`)) item.schema.push(cancelSchema)
            }
          })
          setTimeout(() => {
            this.onloadLoading = false
          }, 300)
        }
      })
    }
  },
  components: {
    canceldrugDialog: () => import('@/warehouse/page/purchease/component/canceldrug.vue'), // 取消弹窗
    loadingCover: () => import('@/warehouse/page/components/procurement/loadingcover'), // loading
    detailTable: () => import('./component/detail.table.vue'),
    tooltipInfo: () => import('@/warehouse/page/components/tooltip.schema.vue') // 取消原因
  }
}
</script>

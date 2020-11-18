<template>
  <div>
    <ever-bread-crumb name="调拨" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基础信息</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          :span="12"
          :nosubmit="true"
          class="readform">
          <template slot="outStoukCode">
            <a class="blue cur" @click="handleOutRoute">{{obj.outStockCode}}</a>
            <span>{{obj.outStockStatus | formateValueToFnt({list: FULL_STATE.outstock})}}</span>
          </template>
          <template slot="inStockCode">
            <a class="blue cur" @click="handleIntRoute(false)">{{obj.inStockCode}}</a>
            <span>{{obj.inStockStatus | formateValueToFnt({list: FULL_STATE.instock})}}</span>
          </template>
          <template slot="inReturnStockCode">
            <a class="blue cur" @click="handleIntRoute(true)">{{obj.inReturnStockCode}}</a>
            <span>{{obj.inReturnStockStatus | formateValueToFnt({list: FULL_STATE.instock})}}</span>
          </template>
          <template slot="abolitionReason">
            <tooltip-info :content="obj.abolitionReason"></tooltip-info>
          </template>
        </ever-form2>
        <!-- 表格区域 -->
        <h4>物资明细</h4>
        <detail-table :tableData="obj.itemList" :isBatch="isBatch"></detail-table>
        <!-- 底部按钮 -->
        <el-button type="primary" size="small" @click="handleCancle(112)" v-if="['109', '110'].includes(`${obj.status}`)">取消</el-button>
      </div>
    </div>
    <!-- 取消弹窗 -->
    <canceldrug-dialog ref="cancelDrug" @change="clickCancel" :title="'确认是否取消'"></canceldrug-dialog>
  </div>
</template>

<script>
import api from '@/warehouse/page/storages/store/allocationapi'
import setName from '@/util/setstatusname'
import { FULL_STATE, debounce } from '@/util/common'
import canceldrugDialog from '@/warehouse/page/purchease/component/canceldrug.vue' // 取消弹窗
import tooltipInfo from '@/warehouse/page/components/tooltip.schema.vue' // 取消原因

let schema = [
  {
    name: 'code',
    label: '调拨单号',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'statusName',
    label: '业务状态',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'applicantName',
    label: '申请人',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'applicantTime',
    label: '申请时间',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'reasons',
    label: '备注',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'requistionStorageRoom',
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
    name: 'toStorageRoom',
    label: '收货库房',
    comp: 'readonlyitem',
    span: 6
  },
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
  mixins: [setName],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      FULL_STATE,
      isBatch: false,
      objId: this.$route.params.id || '',
      schemaList: [], // 缓存的schema
    }
  },
  components: {
    canceldrugDialog,
    tooltipInfo,
    detailTable: () => import('./component/detail.table.vue'),
  },
  created () {
    this.getDetail()
    this.schemaList = JSON.parse(JSON.stringify(this.schema))
  },
  methods: {
    handleCancle () {
      this.$refs.cancelDrug.open()
    },
    clickCancel: debounce(function (msg) { // 弹窗确认取消调拨单
      let params = {
        id: this.objId,
        abolitionReason: msg,
        status: this.obj.status === 110 ? 114 : 112,
        code: this.obj.code
      }
      api.rollBackAllotBound(params).then(res => {
        if (res) {
          this.getDetail()
        }
      })
    }),
    handleIntRoute (flag) {
      const id = flag ? this.obj.inReturnStockId : this.obj.inStockId
      const status = flag ? this.obj.inReturnStockStatus : this.obj.inStockStatus
      let isStorage = this.obj.toStorageRoomId === this.storageId
      if (flag) {
        this.$router.push(status === FULL_STATE.instock[1].id ? `/storages/entry/entrysee/${id}` : status === 13 ? `/storages/entry/entryother/${id}` : `/storages/entry/entryedit/${id}?${'look='}${id}`)
      } else {
        this.$router.push(status === FULL_STATE.instock[1].id ? `/storages/entry/entrysee/${id}` : `/storages/entry/entryedit/${id}?${status === 13 && isStorage ? 'look' : 'look='}${id}`)
      }
    },
    handleOutRoute () {
      const id = this.obj.outStockId
      const status = this.obj.outStockStatus
      this.$router.push(status === FULL_STATE.outstock[0].id ? `/storages/output/outputsee/${id}` : `/storages/output/outputedit/${id}?${status === 24 ? 'look' : 'look='}${id}`)
    },
    getDetail () {
      api.getAllotBoundInfo({ id: this.objId }).then(res => {
        if (res && Object.keys(res).length) {
          this.isBatch = Boolean(res.pricingModel)
          this.obj = Object.assign({}, this.obj, res)
          this.obj.statusName = this.setName(FULL_STATE.allocation, res.status, true)
          const { status, inReturnStockCode } = res
          if (status === 110 || (status === 111 && !inReturnStockCode)) {
            this.schemaList.splice(7, 0, inStockSchema)
          }
          if (['113', '112', '114', '111'].includes(`${status}`)) {
            if (status !== 112 || inReturnStockCode) {
              let inStock = this.schemaList.findIndex(schema => schema.name === 'inStockCode')
              if (~inStock) this.schemaList.splice(inStock, 1)
              this.schemaList.splice(7, 0, ...[returnStockSchema, inStockSchema])
            }
            if (status !== 113) this.schemaList.push(cancelSchema)
          }
          this.schema = this.schemaList
        }
      })
    }
  }
}
</script>

<template>
  <div>
    <ever-bread-crumb name="退库" path="/storages/business/retiringbusinesses"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基础信息</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          class="readform form"
          :nosubmit="true">
          <template slot="stoukCode">
            <a class="blue cur" @click="handleOutRoute">{{obj.outStockCode}}</a>
            <span>{{obj.outStockStatus | formateValueToFnt({list: FULL_STATE.outstock})}}</span>
          </template>
          <template slot="inStockCode">
            <a class="blue cur" @click="handleIntRoute(false)">{{obj.inStockCode}}</a>
            <span>{{obj.inStockStatus | formateValueToFnt({list: FULL_STATE.instock})}}</span>
          </template>
          <template slot="inReturnStockCode">
            <a class="blue cur" @click="handleIntRoute(true)">{{obj.inReturnStockCode}}</a>
            <span v-if="obj.inReturnStockStatus">{{obj.inReturnStockStatus | formateValueToFnt({list: FULL_STATE.instock})}}</span>
            <span>无</span>
          </template>
          <template slot="description">
            <tooltip-info :content="obj.description"></tooltip-info>
          </template>
          <template slot="abolitionReason">
            <tooltip-info :content="obj.abolitionReason"></tooltip-info>
          </template>
        </ever-form2>
        <h4>物资明细</h4>
        <detail-table :tableData="obj.cancelStockItems" :isBatch="isBatch" :show-batch-info="true"></detail-table>
        <!-- 取消按钮 -->
        <el-button type="primary" size="small" @click="handleCancel" v-if="['62', '68'].includes(`${obj.status}`)">取消</el-button>
      </div>
    </div>
    <!-- 取消弹窗 -->
    <canceldrug-dialog ref="cancelDrug" @change="clickCancel" :title="'确认是否取消'"></canceldrug-dialog>
  </div>
</template>

<script>
import api from '@/warehouse/page/storages/store/retiringapi.js'
import setName from '@/util/setstatusname'
import { floatTool, FULL_STATE, debounce } from '@/util/common'

let schema = [
  {
    name: 'code',
    label: '退库单号',
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
    name: 'createBy',
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
    label: '退库原因',
    comp: 'custom',
    span: 6
  },
  {
    name: 'requsitionStorageRoomObject.name',
    label: '发货库房',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'stoukCode',
    label: '出库任务单',
    comp: 'custom',
    span: 6
  },
  {
    name: 'toStorageRoomObject.name',
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
  mixins: [setName],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      floatTool,
      FULL_STATE,
      schema,
      obj,
      isBatch: false,
      tableData: [],
      objId: this.$route.params.id || '',
      schemaList: [], // 缓存的schema
    }
  },
  created () {
    this.schemaList = JSON.parse(JSON.stringify(this.schema))
    this.getDetail()
    console.log(this.obj)
  },
  methods: {
    handleOutRoute () {
      const { outStockId, outStockStatus } = this.obj
      this.$router.push(outStockStatus === FULL_STATE.outstock[0].id ? `/storages/output/outputsee/${outStockId}` : `/storages/output/outputedit/${outStockId}?${outStockStatus === 24 ? 'look' : 'look='}${outStockId}`)
    },
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
    clickCancel: debounce(function (msg) {
      const { id, code } = this.obj
      let params = {
        id,
        abolitionReason: msg,
        status: 65,
        code
      }
      api.rollBackCancelStock(params).then(res => {
        if (res) {
          this.getDetail()
          return this.everSuccess('取消退库单成功')
        }
      })
    }),
    handleCancel () {
      this.$refs.cancelDrug.open()
    },
    getDetail () {
      api.getById({ id: this.objId }).then(res => {
        if (res && res.id) {
          this.isBatch = Boolean(res.pricingModel)
          this.obj = Object.assign(this.obj, res)
          const { status, inReturnStockCode } = res
          this.obj.statusName = this.setName(FULL_STATE.stockback, status, true)
          this.tableData = res.cancelStockItems
          if (status === 68 || (status === 64 && !inReturnStockCode)) {
            this.schemaList.splice(7, 0, inStockSchema)
          }
          if (['64', '65', '66', '67'].includes(`${status}`)) {
            if (status !== 65 || inReturnStockCode) {
              let inStock = this.schemaList.findIndex(schema => schema.name === 'inStockCode')
              if (~inStock) this.schemaList.splice(inStock, 1)
              this.schemaList.splice(7, 0, ...[returnStockSchema, inStockSchema])
            }
            if (['65', '66'].includes(`${status}`)) this.schemaList.push(cancelSchema)
          }
          this.schema = this.schemaList
        }
      })
    },
  },
  components: {
    canceldrugDialog: () => import('@/warehouse/page/purchease/component/canceldrug.vue'), // 取消弹窗
    detailTable: () => import('./component/detail.table.vue'),
    tooltipInfo: () => import('@/warehouse/page/components/tooltip.schema.vue') // 取消原因
  }
}
</script>

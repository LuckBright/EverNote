<template>
  <div>
    <ever-bread-crumb name="采购入库" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基础信息</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          :nosubmit="true"
          :class="[objId ? 'readform' : '']">
          <!-- 审核意见 -->
          <template slot="auditOpinion">
            <tooltip-info :content="obj.auditOpinion"></tooltip-info>
          </template>
          <!-- 入库任务单 -->
          <template slot="code">
            <span>{{obj.code}}</span>
            <span class="status">{{obj.statusName}}</span>
            <span v-if="!obj.code">无</span>
          </template>
        </ever-form2>
        <h4>物资明细</h4>
        <div class="listinfo" v-for="(list, i) in obj.inStockItemList" :key="i">
          <div class="table">
            <el-table
              :data.sync="list.item"
              style="width: 100%"
              :class="[list.items && list.items.length ? '' : 'table2']"
              empty-text="请先选择供应商和入库库房"
              :stripe="false"
            >
              <el-table-column prop="name" label="物资名称">
                <template slot-scope="scope">
                  <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                </template>
              </el-table-column>
              <el-table-column v-if="$route.path.indexOf('goods') > -1 && obj.status == 11" show-overflow-tooltip label="入库数量" align="center" width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.num}}{{scope.row.packagUnitName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                width="100"
                align="center"
                label="规格">
                <template slot-scope="scope">
                  <span>{{scope.row.spec || '-'}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="采购数量" align="center" width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.expectNum}}{{scope.row.packagUnitName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="80"
                align="center"
                label="采购单价">
                <template slot-scope="scope">{{scope.row.price | formatToFinacial(4)}}</template>
              </el-table-column>
              <el-table-column
                width="120"
                align="center"
                prop="totalPrice"
                label="采购金额（元）">
                <template slot-scope="scope">{{scope.row.totalPrice | formatToFinacial(4)}}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div style="padding: 10px">
        <span class="fr">采购总金额：<span class="yellow">¥{{obj.totalPrice| formatToFinacial(4)}}</span></span>
      </div>
      <div class="panel-footer">
        <el-button type="primary" @click="playOutStock(obj.type)" v-if="!look">开始入库</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../store/enterapi'
import { FULL_STATE, FULL_ORDER_NAME, PACKAGE_CODE, FULL_IN_OUT_TYPE, SPEC_CODE, patch } from '@/util/common'
import setName from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import accessStorageMixins from '@/warehouse/page/storages/mixins/accessstorage.mixins.js' // 出入库审核系列操作

let schema = [
  {
    name: 'code',
    label: '入库任务单',
    comp: 'custom',
    span: 6
  },
  {
    name: 'inStockTypeName',
    label: '入库类型',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createTime',
    label: '创建时间',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'storageRoomObject.name',
    label: '收货库房',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'supplierName',
    label: '供应商',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'contractName',
    label: '合同',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'billCode',
    label: '采购单',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'applyCode',
    label: '采购申请单',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createByName',
    label: '入库人',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'inDate',
    label: '入库时间',
    comp: 'readonlyitem',
    span: 6
  }
]
export default {
  mixins: [setName, getstorage, accessStorageMixins],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.inStockItemList = [{ invoiceStatus: 0, invoiceNo: '', item: [], items: [] }]
    return {
      schema,
      obj,
      api,
      SPEC_CODE,
      FULL_IN_OUT_TYPE,
      FULL_STATE,
      PACKAGE_CODE,
      FULL_ORDER_NAME,
      objId: this.$route.params.id,
      rules: {},
      storageFlag: false,
      currentRows: 0,
      look: this.$route.query.look,
      schemaList: []
    }
  },
  created () {
    this.schemaList = JSON.parse(JSON.stringify(this.schema))
    if (this.objId) {
      this.api.getById(this.objId).then(res => {
        if (res.auditerName && !this.schemaList.find(key => { return key.label === '审核人' })) {
          this.schemaList.push(...this.examineSchema)
        }
        this.schema = this.schemaList
        // 采购&到货入库单增加供应商显示
        if (res.type === FULL_IN_OUT_TYPE.intype[5].id) {
          if (res && res.supplierObject && res.supplierObject.name) res.supplierName = res.supplierObject.name
        }
        res.statusName = this.setName(FULL_STATE.instock, res.status, true)
        res.typeName = this.setName(FULL_ORDER_NAME.intype, res.type, true)
        res.inStockTypeName = this.setName(FULL_IN_OUT_TYPE.intype, res.type, true)
        let inStockItemList = []
        for (let i = 0; i < res.inStockItemList.length; i++) {
          for (let n = 0; n < res.inStockItemList[i].item.length; n++) {
            inStockItemList.push(res.inStockItemList[i].item[n])
          }
        }
        res.contractName = res.inStockItemList[0].item[0].contractName ? `${res.inStockItemList[0].item[0].supplyMode === 1 ? '（购销）' : '（代销）'}${res.inStockItemList[0].item[0].contractName}` : '无'
        this.obj = Object.assign({}, this.obj, res)
      })
    }
  },
  methods: {
    playOutStock (type) {
      this.$router.push('/storages/entry/purchaseentry/' + this.objId)
    },
    ...patch
  }
}
</script>

<style lang="less" scoped>
.status {
  color: red;
  margin: 0 0 0 10px;
}
</style>


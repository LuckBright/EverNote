<template>
  <div>
    <ever-bread-crumb name="优惠券使用详情" :showTitle="'优惠券使用详情'"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="list(true)">
          <template slot-scope="scope" slot="patientId">
            <ever-patient-select v-model="scope.obj['patientId']"></ever-patient-select>
            <span>{{scope.obj.userName}}</span>
          </template>
        </ever-query-form>
        <h4>统计信息</h4>
        <div style="font-size:12px">
          <span class="cell">发行量：{{sendCount}}张</span>
          <span class="cell">已发送：{{sendCount-exportCount}}张</span>
          <span class="cell">已使用：{{usedCount}}张</span>
        </div>
        <el-table :data="tableData" border>
          <el-table-column prop type="index" label="序号" width="55" align="center"></el-table-column>
          <el-table-column prop="code" label="券号"></el-table-column>
          <el-table-column prop align="center" label="领取人">
            <template slot-scope="scope">{{scope.row.patient ? scope.row.patient.name : '--'}}</template>
          </el-table-column>
          <el-table-column prop="updateTime" label="领取时间" :formatte="formatDate"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <sys-value type="THC_CARD_GIFT_STATUS" :code="scope.row.status"></sys-value>
            </template>
          </el-table-column>
          <el-table-column prop="origPrice" label="面额">
            <template slot-scope="scope" v-if="scope.row">{{money}} 元</template>
          </el-table-column>
          <el-table-column prop="salePrice" label="实际购买金额"></el-table-column>
          <el-table-column prop="useTime" label="使用时间" :formatte="formatDate"></el-table-column>
          <el-table-column prop="orderId" label="订单号"></el-table-column>
          <el-table-column prop label="操作" width="150" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">
                <el-button size="small" @click="handleFreeze(scope.$index, scope.row)">冻结</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDiscard(scope.$index, scope.row)"
                >作废</el-button>
              </span>
              <span v-if="scope.row.status == 3">
                <el-button size="small" @click="handleUnFreeze(scope.$index, scope.row)">解冻</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDiscard(scope.$index, scope.row)"
                >作废</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>

        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/card/store/giftbatchdetailapi.js'
import giftbatchApi from '@/card/store/giftbatchapi'
import list from '@/util/list'

var querySchema = [
  {
    name: 'code',
    type: 'text',
    label: '优惠券券号',
    placeholder: '输入优惠券券号'
  },
  {
    name: 'status',
    type: 'systype',
    code: 'THC_CARD_GIFT_STATUS',
    useValue: true,
    label: '优惠券状态'
  },
  {
    name: 'patientId',
    label: '领取人信息',
    type: 'custom'
  }
]

export default {
  mixins: [list],
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.batchId = this.$route.params.id
    return {
      tableData: [],
      querySchema: querySchema,
      queryObj: queryObj,
      totalCount: 0,
      totalNum: 0,
      sendCount: 0,
      usedCount: 0,
      exportCount: 0,
      money: this.$route.params.money
    }
  },
  methods: {
    handleFreeze (index, row) {
      this.$confirm('确定要冻结这张优惠券吗?', '提示').then(() => {
        return this.api.freeze(row.id)
      }).then(() => {
        this.list(this.queryObj)
      }).catch((e) => {

      })
    },
    handleUnFreeze (index, row) {
      this.$confirm('确定要解冻这张优惠券吗?', '提示').then(() => {
        return this.api.unfreeze(row.id)
      }).then(() => {
        this.list(this.queryObj)
      }).catch((e) => {

      })
    },
    handleDiscard (index, row) {
      this.$confirm('确定要作废这张优惠券吗?', '提示').then(() => {
        return this.api.discard(row.id)
      }).then(() => {
        this.list(this.queryObj)
      }).catch((e) => {

      })
    }
  },
  created () {
    giftbatchApi.getById(this.queryObj.batchId).then((result) => {
      this.sendCount = result.data.sendCount
      this.usedCount = result.data.usedCount
      this.totalNum = result.data.totalCount
      this.exportCount = result.data.exportCount
    })
  },
  beforeCreate () {
    this.api = api
  }
}
</script>


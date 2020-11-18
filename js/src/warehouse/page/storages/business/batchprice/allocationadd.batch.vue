<template>
  <div>
    <div class="layout_inner">
      <div class="panel-body">
        <ever-bread-crumb name="调拨" showTitle="true"></ever-bread-crumb>
        <h4>填写基础信息</h4>
        <ever-form2
          v-model="obj"
          ref="form"
          :nosubmit="true"
          :rules="rules"
          :span="12"
          :schema="allocationSchema">
        </ever-form2>
        <h4>添加物资</h4>
        <batch-table :value.sync="tableData" :queryParams="queryParams" :numName="'调拨'" ref="batchTable"></batch-table>
        <div class="footer">
          <el-button type="primary" class="w_100" size="small" :disabled="btnGray" @click="submitData(109)" :loading="unRepeatedBtn">提交</el-button>
          <el-button size="small" :disabled="btnGray" type="primary" @click="submitData(108)" :loading="unRepeatedBtn">暂存</el-button>
          <el-button size="small" @click="$router.go(-1)">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import warehouseReceiptMixins from '@/warehouse/page/storages/mixins/warehouse.receipt.mixins.js'
import { allocationSchema } from '@/warehouse/page/storages/business/store/batch.columns.js'
import { debounce } from '@/util/common'
import allocationapi from '@/warehouse/page/storages/store/allocationapi.js'
import storage from '@/util/storage'

export default {
  mixins: [warehouseReceiptMixins, storage],
  components: {
    batchTable: () => import('@/warehouse/page/storages/business/component/batch.table.vue')
  },
  data () {
    let obj = this.$ever.createObjFromSchema(allocationSchema)
    return {
      allocationSchema,
      obj,
      name: 'storageRoomId',
      schemaName: 'allocationSchema',
      queryParams: { materialType: '', offset: 0, pagesize: 9999, state: 0, isNeedStock: true },
      rules: { storageRoomId: { required: true, message: '必填项', trigger: 'blur' } },
    }
  },
  created () {
    this.initInfo()
    if (this.$route.query.id) {
      this.getDetail(this.$route.query.id)
    }
  },
  methods: {
    getDetail (id) {
      allocationapi.getAllotBoundInfo({ id: id }).then(res => {
        if (res && Object.keys(res).length) {
          this.obj.storageRoomId = res.toStorageRoomId
          this.obj.reasons = res.reasons
          this.obj.id = res.id
          this.obj.code = res.code
          setTimeout(() => {
            res.itemList && res.itemList.forEach(item => {
              this.$set(item, 'usableNum', item.stockUsableNum)
              if (item.num > item.stockUsableNum) {
                item.red = true
              }
            })
            this.tableData = this.obj.itemList = res.itemList
            this.tableData.push({ add: true })
          }, 100)
        }
      })
    },
    submitData: debounce(function (status) {
      let params = {
        toStorageRoomId: this.obj.storageRoomId, // 收货库房
        requsitionStorageRoomId: this.storageId, // 发货库房
        reasons: this.obj.reasons, // 调拨原因
        itemList: [],
        pricingModel: 1,
        clinicId: storage.getStorageByClinic('CLINICID') || '',
        status: status, // 调拨状态
      }
      let submit = false
      this.tableData && this.tableData.forEach(item => {
        const { localMaterialId, num } = item
        if (localMaterialId && num === '') submit = true
        if (localMaterialId && num) {
          params.itemList.push(item)
        }
      })
      if (this.$route.query.id || this.obj.id) params.id = this.$route.query.id || this.obj.id
      if (this.obj.code) params.code = this.obj.code
      if (submit) return this.everWarning('物资列表还有信息未录入')
      this.unRepeatedBtn = true
      allocationapi[(params.id) ? 'submitAllotBound' : 'createAllotBound'](params).then(res => {
        if (res) {
          if (res.stockErrorMessageList && res.stockErrorMessageList.length) { // 这个时候说明可用库存小于调拨数量
            // 更新页面上的库存
            let stockList = res.stockErrorMessageList
            stockList.forEach(item => {
              const { localMaterialId, sysBatchCode, num } = item
              let numIndex = this.tableData.findIndex(key => key.localMaterialId === localMaterialId && key.sysBatchCode === sysBatchCode)
              if (~numIndex) {
                this.$set(this.tableData[numIndex], 'usableNum', num)
                this.$set(this.tableData[numIndex], 'red', true)
                this.$set(this.tableData[numIndex], 'num', '')
              }
            })
            return this.$messageTips(this, 'warning', `${res.message}`, '提示', 2500, true)
          } else {
            this.obj.itemList = res.itemList
            this.obj.id = res.id
            this.obj.code = res.code
            this.everSuccess(`${status === 109 ? '提交调拨单成功' : '暂存调拨单成功'}`)
            if (res.id && status === 109) this.$router.push('/storages/business/allocationess/' + res.id)
          }
        }
      })
      setTimeout(() => {
        this.unRepeatedBtn = false
      }, 200)
    }),
  },
  watch: {
    'obj.storageRoomId' (val, oldval) {
      if (this.tableData.length && !this.tableData[0].localMaterialId) {
        if (this.$refs.remoteselect) this.$refs.remoteselect.options = []
      }
      this.oldVal = oldval
      if ((val || oldval) && val !== oldval && this.tableData.length && this.tableData[0].localMaterialId) {
        if (this.btn !== 7) { // 点击取消阻止触发弹窗
          let dom = document.querySelector('.el-form .el-input__inner')
          if (dom) dom.blur()
          this.$confirm(`调拨单中已经添加物资，如需修改收货库房，将自动清空已添加的物资`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.tableData = []
            setTimeout(() => {
              this.getClassifyIds()
              this.$refs.batchTable.resetTable()
            }, 100)
          }).catch(() => {
            this.handlerCancelStorage()
          })
          this.btn = 4
          return
        } else {
          this.btn = 0
        }
      } else {
        if (!val) this.tableData = []
      }
    },
    obj: {
      handler (v) {
        if (v.storageRoomId && !this.tableData.length) {
          this.getClassifyIds(v)
        }
      },
      deep: true
    }
  }
}
</script>

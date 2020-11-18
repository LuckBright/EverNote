<template>
  <div>
    <ever-bread-crumb name="申领" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>填写基础信息</h4>
        <ever-form2
          :schema="applySchema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          :nosubmit="true">
        </ever-form2>
        <h4>添加物资</h4>
        <batch-table :value.sync="tableData" :queryParams="queryParams" :numName="'申领'" ref="batchTable"></batch-table>
        <!-- 按钮组 -->
        <div class="footer">
          <el-button class="w_100" type="primary" size="small" :disabled="btnGray" :loading="unRepeatedBtn" @click="submitData(true)">提交</el-button>
          <el-button type="primary" size="small" :disabled="btnGray" :loading="unRepeatedBtn" @click="submitData(false)">暂存</el-button>
          <el-button size="small" :loading="unRepeatedBtn" @click="$router.go(-1)">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import warehouseReceiptMixins from '@/warehouse/page/storages/mixins/warehouse.receipt.mixins.js'
import storage from '@/util/storage'
import api from '@/warehouse/page/storages/store/applyapi.js'
import { applySchema } from '@/warehouse/page/storages/business/store/batch.columns.js'
import { debounce } from '@/util/common'

export default {
  mixins: [warehouseReceiptMixins, storage],
  components: {
    batchTable: () => import('@/warehouse/page/storages/business/component/batch.table.vue')
  },
  data () {
    let obj = this.$ever.createObjFromSchema(applySchema)
    return {
      applySchema,
      obj,
      name: 'toStorageRoomId',
      schemaName: 'applySchema',
      queryParams: { materialType: '', offset: 0, pagesize: 9999, state: 0, isNeedStock: true },
      rules: {
        toStorageRoomId: { required: true, message: '必填项', trigger: 'change' }
      },
    }
  },
  created () {
    this.initInfo()
    const { query, params } = this.$route
    if (query && query.id || params && params.id) {
      const id = query.id || params.id
      const clone = params && params.id
      this.getDetail(id, clone)
    }
  },
  methods: {
    submitData: debounce(function (flag) {
      let params = {
        materialType: '',
        toStorageRoomId: this.obj.toStorageRoomId,
        description: this.obj.description,
        requsitionStorageRoomId: this.storageId,
        purchaseRequisitionItem: [],
        pricingModel: 1,
        clinicId: storage.getStorageByClinic('CLINICID') || '',
      }
      let submit = false
      let usableNumMsg = false
      for (let i = 0; i < this.tableData.length; i++) {
        const { localMaterialId, num, usableNum } = this.tableData[i]
        if (localMaterialId && num === '') submit = true
        if (localMaterialId && num > usableNum) {
          usableNumMsg = true
          this.$set(this.tableData[i], 'num', '')
          this.$set(this.tableData[i], 'red', true)
        }
        // 如果有未填写的申领数量跳出循环
        if (submit) break
        if (localMaterialId) {
          params.purchaseRequisitionItem.push(this.tableData[i])
        }
      }
      if (this.$route.query.id || this.obj.id) params.id = this.$route.query.id || this.obj.id
      if (this.obj.code) params.code = this.obj.code
      if (submit) return this.everWarning('物资列表还有信息未录入')
      if (usableNumMsg) return this.everWarning('申领数量大于可用库存,请重新录入')
      this.unRepeatedBtn = true
      api[flag ? 'createOrUpdate' : 'temporaryStorageRequisition'](params).then(res => {
        if (res) {
          if (res && res.flag) {
            let { list } = res
            this.$router.push(`/storages/business/applybusiness/${list[0]}?isBatch=true`)
          } else {
            if (res.message && res.message.stockErrorMessageList) { // 这个时候说明可用库存已经变了
              // 更新页面上的库存
              let stockList = res.message.stockErrorMessageList
              stockList.forEach(item => {
                let numIndex = this.tableData.findIndex(key => key.localMaterialId === item.localMaterialId && key.sysBatchCode === item.sysBatchCode)
                if (~numIndex) {
                  this.$set(this.tableData[numIndex], 'usableNum', item.num)
                  this.$set(this.tableData[numIndex], 'red', true)
                  this.$set(this.tableData[numIndex], 'num', '')
                }
              })
              return this.$messageTips(this, 'warning', `${res.message.message}`, '提示', 2500, true)
            }
            this.obj.id = res.id
            this.obj.code = res.code
          }
          this.everSuccess(`${flag ? '提交申领单成功' : '暂存申领单成功'}`)
        }
      })
      setTimeout(() => {
        this.unRepeatedBtn = false
      }, 200)
    }),
    getDetail (id, clone) {
      let params = { ids: [id] }
      if (clone) Object.assign(params, { isCopy: 1 })
      api['getById'](params).then(res => {
        if (res) {
          const { toStorageRoomId, id, code, purchaseRequisitionItem, description, status } = Array.isArray(res) ? res[0] : res
          this.obj[this.name] = toStorageRoomId
          if (status === 41) {
            this.obj.code = code
            this.obj.id = id
          }
          this.obj.description = description
          let needTable = []
          let noNeedTable = []
          setTimeout(() => {
            purchaseRequisitionItem.forEach(item => {
              if (!item.materialState) {
                needTable.push(item)
              } else {
                noNeedTable.push(`<div>${item.materialName}</div>`)
              }
            })
            if (noNeedTable.length) {
              this.$messageTips(this, 'warning', `${noNeedTable.join('')}无效，已为您删除。`, '提示', 2500, true)
            }
            this.tableData = [...needTable, {add: true}]
          }, 100)
        }
      })
    },
  },
  watch: {
    'obj.toStorageRoomId' (val, oldval) {
      this.queryParams.storageRoomId = val
      if (this.tableData.length && !this.tableData[0].localMaterialId) {
        if (this.$refs.remoteselect) this.$refs.remoteselect.options = []
      }
      this.oldVal = oldval
      if ((val || oldval) && val !== oldval && this.tableData.length && this.tableData[0].localMaterialId) {
        if (this.btn !== 7) { // 点击取消阻止触发弹窗
          let dom = document.querySelector('.el-form .el-input__inner')
          if (dom) dom.blur()
          this.$confirm(`申领单已经添加当前库房的物资，如需修改发货库房，将自动清空已添加的物资`, '提示', {
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
        if (v[this.name] && !this.tableData.length) {
          this.getClassifyIds(v)
        }
      },
      deep: true
    }
  },
}
</script>

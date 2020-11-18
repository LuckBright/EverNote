<template>
  <div>
    <ever-bread-crumb name="退库" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>填写基础信息</h4>
        <ever-form2
          :schema="retiringSchema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          :nosubmit="true"
        ></ever-form2>
        <h4>添加物资</h4>
        <!-- 物资列表 -->
        <batch-table :value.sync="tableData" :queryParams="queryParams" :numName="'退库'" ref="batchTable"></batch-table>
        <!-- 按钮组 -->
        <div>
          <el-button type="primary" class="w_100" size="small" :disabled="btnGray" @click="submitData(true)" :loading="unRepeatedBtn">提交</el-button>
          <el-button size="small" :disabled="btnGray" type="primary" @click="submitData(false)" :loading="unRepeatedBtn">暂存</el-button>
          <el-button size="small" @click="$router.go(-1)">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import warehouseReceiptMixins from '@/warehouse/page/storages/mixins/warehouse.receipt.mixins.js'
import storage from '@/util/storage'
import api from '@/warehouse/page/storages/store/retiringapi.js'
import { retiringSchema } from '@/warehouse/page/storages/business/store/batch.columns.js'
import { debounce } from '@/util/common'

export default {
  mixins: [warehouseReceiptMixins],
  components: {
    batchTable: () => import('@/warehouse/page/storages/business/component/batch.table.vue')
  },
  data () {
    let obj = this.$ever.createObjFromSchema(retiringSchema)
    return {
      obj,
      retiringSchema,
      name: 'toStorageRoomId',
      schemaName: 'retiringSchema',
      queryParams: { materialType: '', offset: 0, pagesize: 9999, state: 0, isNeedStock: true },
      rules: {
        toStorageRoomId: { required: true, message: '必填项', trigger: 'change' },
        description: { required: true, message: '必填项', trigger: 'blur' }
      },
    }
  },
  created () {
    this.initInfo()
    const { query } = this.$route
    if (query && query.id) {
      this.getDetail(query.id)
    }
  },
  methods: {
    getDetail (id) {
      api.getById({ id }).then(res => {
        if (res && res.id) {
          this.btn = 7
          const { cancelStockItems } = res
          this.tableData = cancelStockItems
          Object.assign(this.obj, res)
        }
      })
    },
    submitData: debounce(function (flag) {
      this.$refs.form.$refs.form.validate(valid => {
        if (!valid) return
        let params = {
          materialType: '',
          description: this.obj.description,
          requsitionStorageRoomId: this.storageId,
          toStorageRoomId: this.obj.toStorageRoomId,
          cancelStockItems: [],
          pricingModel: 1,
          clinicId: storage.getStorageByClinic('CLINICID') || '',
        }
        let submit = false
        this.tableData && this.tableData.forEach(item => {
          const { localMaterialId, num, } = item
          let cloneItem = JSON.parse(JSON.stringify(item))
          if (localMaterialId && num === '') submit = true
          if (localMaterialId && num) {
            params.cancelStockItems.push(cloneItem)
          }
        })
        if (this.$route.query.id || this.obj.id) params.id = this.$route.query.id || this.obj.id
        if (this.obj.code) params.code = this.obj.code
        if (submit) return this.everWarning('物资列表还有信息未录入')
        this.unRepeatedBtn = true
        api[flag ? 'createCalcelStock' : 'temporarySave'](params).then(res => {
          if (res && Object.keys(res).length) {
            let { id, code } = res
            if (res && !id) {
              this.$router.push(`/storages/business/retiringbusiness/${res}`)
            } else {
              this.obj.id = id
              this.obj.code = code
            }
            this.everSuccess(`${flag ? '提交退库单成功' : '暂存退库单成功'}`)
          }
        })
        setTimeout(() => {
          this.unRepeatedBtn = false
        }, 200)
      })
    }),
  },
  watch: {
    'obj.toStorageRoomId' (val, oldval) {
      if (this.tableData.length && !this.tableData[0].localMaterialId) {
        if (this.$refs.remoteselect) this.$refs.remoteselect.options = []
      }
      this.oldVal = oldval
      if ((val || oldval) && val !== oldval && this.tableData.length && this.tableData[0].localMaterialId) {
        if (this.btn !== 7) { // 点击取消阻止触发弹窗
          let dom = document.querySelector('.el-form .el-input__inner')
          if (dom) dom.blur()
          this.$confirm(`退库单已经添加当前库房的物资，如需修改收货库房，将自动清空已添加的物资`, '提示', {
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

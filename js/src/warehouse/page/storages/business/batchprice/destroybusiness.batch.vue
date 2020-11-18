<template>
  <div>
    <ever-bread-crumb name="销毁报废" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>填写基础信息</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="12"
          :rules="rules"
          :nosubmit="true">
        </ever-form2>
        <h4>添加物资</h4>
        <batch-table :value.sync="tableData" :queryParams="queryParams" :numName="'销毁报废'"></batch-table>
        <div>
          <el-button class="w_100" type="primary" :loading="unRepeatedBtn" :disabled="btnGray" @click="submitBackCode(102)">提交</el-button>
          <el-button class="w_60" type="primary" :loading="unRepeatedBtn" :disabled="btnGray" @click="submitBackCode(101)">暂存</el-button>
          <el-button class="w_60" :loading="unRepeatedBtn" @click="backList">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import warehouseReceiptMixins from '@/warehouse/page/storages/mixins/warehouse.receipt.mixins.js'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import api from '@/warehouse/page/storages/store/destroyscrapapi.js'
import { schema } from '@/warehouse/page/storages/business/store/destroybusiness.columns.js'

export default {
  mixins: [warehouseReceiptMixins, getstorage],
  components: {
    batchTable: () => import('@/warehouse/page/storages/business/component/batch.table.vue')
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      name: 'destroy',
      schema,
      obj,
      unRepeatedBtn: false,
      queryParams: { offset: 0, pagesize: 20, state: 0, isNeedStock: true },
      rules: {
        destroyReason: [{ required: true, message: '必填项', trigger: 'blur' },
        { message: '输入最大长度为100个字符', trigger: 'blur', max: 100 }]
      },
    }
  },
  created () {
    this.queryParams.storageRoomId = this.storageId
    const { id } = this.$route.params
    if (id) this.getDetails(id)
  },
  methods: {
    // 点击返回按钮
    backList () {
      if (this.tableData.length && this.tableData[0].localMaterialId) {
        this.$confirm('您填写的内容尚未提交，是否要离开页面？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => {})
      } else {
        this.$router.go(-1)
      }
    },
    submitBackCode (status) {
      this.$refs.form.$refs.form.validate(valid => {
        if (!valid) return
        let params = {
          destroyReason: this.obj.destroyReason,
          status,
          pricingModel: 1,
          items: [],
          storageRoomId: this.storageId
        }
        let submit = false
        let borderRed = false
        this.tableData && this.tableData.forEach(item => {
          const { localMaterialId, num, red } = item
          let cloneItem = JSON.parse(JSON.stringify(item))
          if (localMaterialId && num === '') submit = true
          if (red) borderRed = true
          if (localMaterialId && num) {
            params.items.push(cloneItem)
          }
        })
        if (submit) return this.everWarning('物资列表还有信息未录入')
        if (borderRed) return this.everWarning('销毁报废数量大于可用库存')
        if (this.$route.query.id || this.obj.id) params.id = this.$route.query.id || this.obj.id
        if (this.obj.code) params.code = this.obj.code
        this.unRepeatedBtn = true
        api.createOrUpdate(params).then(res => {
          if (res && !res.message && res.id) {
            this.everSuccess('提交销毁报废单成功')
            if (status === 101) {
              this.obj.id = res.id
              this.obj.code = res.code
            } else {
              this.$router.push(`/storages/business/destroybusinessee/${res.id}`)
            }
          } else if (res.message) {
            this.$confirm(res.message, '提示', {dangerouslyUseHTMLString: true}).then(_ => {})
          }
        })
        setTimeout(() => { this.unRepeatedBtn = false }, 300)
      })
    },
    // 暂存数据获取
    getDetails (id) {
      api.getById({ id }).then(res => {
        if (res) {
          let { items, destroyReason, id, code } = res
          this.tableData = items.map(item => {
            item.usableNum = item.stockUsableNum
            if (item.num > item.stockUsableNum) item.red = true
            return item
          })
          this.tableData.push({ add: true })
          setTimeout(() => {
            this.obj.id = id
            this.obj.destroyReason = destroyReason
            this.obj.code = code
          }, 200)
        }
      })
    },
  },
  watch: {
    'obj.destroyReason' (v) {
      if (v && !this.tableData.length) this.tableData = [{ add: true }]
    }
  }
}
</script>

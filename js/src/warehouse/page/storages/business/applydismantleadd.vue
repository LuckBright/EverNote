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
          :nosubmit="true"
        ></ever-form2>
        <h4>添加物资</h4>
        <!-- 物资列表 -->
        <el-table 
          border
          empty-text="请先填写基础信息"
          :data="tableData">
          <el-table-column label="物资名称" align="center">
            <template slot-scope="scope">
              <material-select
                v-if="scope.row.add && scope.$index === tableData.length - 1"
                ref="remoteselect"
                :params="queryParams"
                :needObjFlag="true"
                @change="handleSelect">
              </material-select>
              <span v-else class="fl">{{scope.row.materialName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" width="80" align="center">
            <template slot-scope="{ row }">
              {{row.spec || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="可用库存" width="100" align="center">
            <template slot-scope="{ row }">
              {{row.usableNum || '-'}}
            </template>
          </el-table-column>
           <el-table-column label="申领数量" width="200" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.localMaterialId">
                <div class="fl">
                  <el-input
                    :class="{border_red: row.red}"
                    placeholder="申领数量"
                    style="width: 100px"
                    v-model="row.num"
                    type="number"
                    @blur="handleCheckNum(row)"
                    size="small"
                  ></el-input>
                  {{row.packagUnitName}}
                </div>
                <div class="fl w_60 stockRed">
                  <span class="red" v-if="row.num > row.usableNum">缺货</span>
                </div>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <i
                class="iconfont icon-bingli-shanchu"
                @click="handlerDelter(scope.$index)"
                :class="{'mr15': scope.$index === tableData.length - 1, 'red': !btnGray, 'cGray': btnGray}"
                v-if="tableData.length > 1 || (tableData.length === 1 && scope.row.localMaterialId)">
              </i>
              <i
                v-if="scope.$index === tableData.length - 1"
                @click="handlerAdd(scope.row, scope.$index)"
                :class="{ 'blue': !btnGray, 'cGray': btnGray }"
                class="iconfont icon-tianjiabingli">
                </i>
            </template>
          </el-table-column>
        </el-table>
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
import { CHINESE_MEDICINE_TYPE, checkNonNegativeInteger, debounce } from '@/util/common'
import { DECIMAL_FOUR } from '@/warehouse/util/reg.js'
import { applySchema } from '@/warehouse/page/storages/business/store/batch.columns.js'
import api from '@/warehouse/page/storages/store/applyapi.js'
import storage from '@/util/storage'

export default {
  mixins: [warehouseReceiptMixins, storage],
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
    const { query, params } = this.$route
    if (query && query.id || params && params.id) {
      const id = query.id || params.id
      const clone = params && params.id
      this.getDetail(id, clone)
    }
    this.initInfo()
  },
  methods: {
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
          console.log(purchaseRequisitionItem, this.obj)
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
    submitData: debounce(function (flag) {
      let params = {
        materialType: '',
        toStorageRoomId: this.obj.toStorageRoomId,
        description: this.obj.description,
        requsitionStorageRoomId: this.storageId,
        purchaseRequisitionItem: [],
        clinicId: storage.getStorageByClinic('CLINICID') || '',
      }
      let submit = false
      this.tableData && this.tableData.forEach(item => {
        const { localMaterialId, num, } = item
        let cloneItem = JSON.parse(JSON.stringify(item))
        if (localMaterialId && num === '') submit = true
        if (localMaterialId && num) {
          delete cloneItem.add
          params.purchaseRequisitionItem.push(cloneItem)
        }
      })
      if (this.$route.query.id || this.obj.id) params.id = this.$route.query.id || this.obj.id
      if (this.obj.code) params.code = this.obj.code
      if (submit) return this.everWarning('物资列表还有信息未录入')
      this.unRepeatedBtn = true
      api[flag ? 'createOrUpdate' : 'temporaryStorageRequisition'](params).then(res => {
        if (res) {
          if (res && res.flag) {
            let { list } = res
            this.$router.push(`/storages/business/applybusiness/${list.length > 1 ? list[0] + `?id=${list[1]}` : list[0]}`)
          } else {
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
    handleSelect (v) {
      if (v) {
        const { localMaterialId, classifyId, spec, materialName, unitId, usableNum, packagUnitName, materialSkuId, isExpiryDate, isManageAlone, unitName } = v
        if (v && this.tableData.some(item => item.localMaterialId === localMaterialId)) {
          this.$nextTick(_ => {
            this.$refs.remoteselect.select = ''
            this.$refs.remoteselect.options = []
          })
          return this.everWarning('当前物资已经存在列表中')
        }
        let metaerObj = {
          localMaterialId,
          classifyId,
          num: '',
          spec,
          add: true,
          materialName,
          unitId,
          usableNum,
          packagUnitName,
          materialSkuId,
          isExpiryDate,
          isManageAlone,
          unitName
        }
        this.$set(this.tableData, this.tableData.length - 1, metaerObj)
      } else {
        this.$set(this.tableData, this.tableData.length - 1, { add: true })
      }
    },
    handleCheckNum (row) {
      if (row.num === '') return this.titleTips(row, '请填写申领数量')
      if (Number(row.num) <= 0 && row.num) return this.titleTips(row, '申领数量不允许为0或负数')
      // if (Number(row.num) > Number(row.usableNum)) return this.titleTips(row, '退库数量大于可用库存数量')
      const dataType = row.classifyId || ''
      let pieces = !CHINESE_MEDICINE_TYPE.includes(dataType)
      // 除“中药饮片”和“中药颗粒”外其他类型的商品，限制出库数量录入小数
      if (pieces && !checkNonNegativeInteger(row.num) && row.num) return this.titleTips(row, '该商品只能按正整数出库')
      if (!DECIMAL_FOUR.test(row.num) && !pieces) return this.titleTips(row, '“中药饮片”和“中药颗粒”最多允许录入4位小数')
      if (row.red) row.red = false
    },
    handlerAdd (row) {
      if (this.btnGray) return
      if (row) {
        const { localMaterialId, num } = row
        if (!localMaterialId) return this.everWarning('请选择物资再点击添加')
        if (num <= 0 || num === '') return this.everWarning('请填写申领数量后再添加')
        this.$set(row, 'add', false)
        this.tableData.push({ add: true })
      }
    },
    handlerDelter (index) {
      if (this.btnGray) return
      if (this.tableData.length === 1) {
        this.tableData = [{ add: true }]
        this.$nextTick(_ => {
          if (this.$refs.remoteselect) {
            this.$refs.remoteselect.select = ''
            this.$refs.remoteselect.options = []
          }
        })
      } else {
        this.tableData.splice(index, 1)
        if (this.tableData[this.tableData.length - 1].localMaterialId) {
          this.tableData[this.tableData.length - 1].add = false
        }
      }
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
          this.$confirm(`申领单已经添加当前库房的物资，如需修改收货库房，将自动清空已添加的物资`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.tableData = []
            setTimeout(() => {
              this.getClassifyIds()
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
<style scoped lang="less">
.border_red /deep/ .el-input__inner {
  border-color: red;
}
.stockRed {
  height: 28px;
  line-height: 28px;
  font-weight: 700;
}
</style>

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
          <el-table-column label="生产批号" align="center" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId && scope.row.isExpiryDate">
                <ever-select
                  v-if="scope.row.add"
                  :index="scope.$index"
                  clearable="true"
                  v-model="scope.row.batchNum"
                  customValue="batchNum"
                  :options="scope.row.batchNumList"
                  size="small"
                  :filterable="true"
                  placeholder="生产批号"
                  @visibleChange="queryBatchNumList"
                  @change="selectBatchNumList"
                  @clear="clearBatchNumList">
                </ever-select>
                <span v-else>{{scope.row.batchNum}}</span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="生产日期" align="center" width="100">
            <template slot-scope="{ row: {produceDate, batchNum} }">
              <span v-if="batchNum">{{produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="有效期" align="center" width="100">
            <template slot-scope="{ row: {validityDate, batchNum} }">
              <span v-if="batchNum">{{validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="可用库存" width="100" align="center">
            <template slot-scope="{ row }">
              {{row.usableNum || '-'}}
            </template>
          </el-table-column>
           <el-table-column label="退库数量" width="180" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.localMaterialId">
                <el-input
                  v-if="row.add || (!row.add && row.numShow)"
                  :class="{border_red: row.red}"
                  placeholder="退库数量"
                  style="width: 100px"
                  v-model="row.num"
                  type="number"
                  @blur="handleCheckNum(row)"
                  size="small"
                ></el-input>
                <span v-else>{{row.num}}</span>
                <span>{{row.packagUnitName}}</span>
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
import storage from '@/util/storage'
import api from '@/warehouse/page/storages/store/retiringapi.js'
import inventoryqueryApi from '@/warehouse/store/getmaterialinfoapi'
import outputstockApi from '@/warehouse/page/outputstorageroom/outputstockapi.js'
import { CHINESE_MEDICINE_TYPE, checkNonNegativeInteger, debounce } from '@/util/common'
import { retiringSchema } from '@/warehouse/page/storages/business/store/batch.columns.js'
import { DECIMAL_FOUR } from '@/warehouse/util/reg.js'
import { btnGray } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'

export default {
  mixins: [warehouseReceiptMixins, storage],
  data () {
    let obj = this.$ever.createObjFromSchema(retiringSchema)
    return {
      retiringSchema,
      obj,
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
    const { query } = this.$route
    if (query && query.id) {
      this.getDetail(query.id)
    }
    this.initInfo()
  },
  methods: {
    getDetail (id) {
      api.getById({ id }).then(res => {
        if (res && res.id) {
          this.btn = 7
          const { cancelStockItems } = res
          this.tableData = cancelStockItems.map(item => {
            item.usableNum = item.stockContainerUsableNum
            return item
          })
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
          clinicId: storage.getStorageByClinic('CLINICID') || '',
        }
        let submit = false
        this.tableData && this.tableData.forEach(item => {
          const { localMaterialId, num, } = item
          let cloneItem = JSON.parse(JSON.stringify(item))
          if (localMaterialId && num === '') submit = true
          if (localMaterialId && num) {
            delete cloneItem.add
            delete cloneItem.batchNumList
            params.cancelStockItems.push(cloneItem)
          }
        })
        params.cancelStockItems = this.sortData(params.cancelStockItems)
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
    // 相同的物资排序在一起
    sortData (list) {
      let arr = JSON.parse(JSON.stringify(list))
      arr.sort((a, b) => {
        if (a['localMaterialId'] !== b['localMaterialId']) {
          return a['localMaterialId'].localeCompare(b['localMaterialId'])
        }
      })
      return arr
    },
    queryBatchNumList (v) {
      if (v) {
        let data = this.tableData.find(item => item.add)
        if (data) {
          const { localMaterialId } = data
          const localBatchList = this.tableData.filter(key => !key.add && localMaterialId === key.localMaterialId)
          outputstockApi.stocklist({ localMaterialId, storageRoomId: this.storageId }).then(res => {
            if (localBatchList.length) {
              data.batchNumList = res.filter(batch => !localBatchList.some(fin => fin.batchNum === batch.batchNum))
            }
          })
        }
      }
    },
    selectBatchNumList (v) {
      if (!v) return
      let data = this.tableData.find(item => item.add)
      if (data) {
        const selectData = data.batchNumList.find(select => select.batchNum === v)
        if (selectData) {
          const { usableNum, produceDate, validityDate } = selectData
          data.usableNum = usableNum
          data.produceDate = produceDate
          data.validityDate = validityDate
          data.batchNum = v
        }
      }
    },
    clearBatchNumList (v) {
      let data = this.tableData.find(item => item.add)
      if (data) {
        data.usableNum = ''
        data.produceDate = ''
        data.validityDate = ''
        data.batchNum = ''
      }
    },
    handleSelect (v) {
      if (v) {
        if (v.isManageAlone) return this.everWarning('该商品属于唯一码管理，暂不支持')
        inventoryqueryApi.list(Object.assign(this.queryParams, { ifMoreThanZero: 0, localMaterialId: v.localMaterialId })).then(res => {
          if (res && res.list && res.list.length) {
            const { localMaterialId, classifyId, spec, materialName, unitId, packagUnitName, materialSkuId, isManageAlone, isExpiryDate, isInvented, batchNumList, usableNum } = res.list[0]
            // 找出列表中已添加的相同物资
            const localBatchList = this.tableData.filter(key => !key.add && localMaterialId === key.localMaterialId)
            let newBatchList = []
            // 过滤掉已选择批次
            if (localBatchList.length) {
              newBatchList = batchNumList.filter(batch => !localBatchList.some(fin => fin.batchNum === batch.batchNum))
            }
            let metaerObj = {
              localMaterialId,
              classifyId,
              isInvented,
              num: '',
              spec,
              add: true,
              materialName,
              unitId,
              usableNum: isExpiryDate ? '' : usableNum,
              packagUnitName,
              materialSkuId,
              isExpiryDate,
              isManageAlone,
              batchNumList: localBatchList.length ? newBatchList : batchNumList,
              batchNum: ''
            }
            this.$set(this.tableData, this.tableData.length - 1, metaerObj)
            // 选择的时候默认选择第0条生产批号
            if (metaerObj.batchNumList.length) this.selectBatchNumList(metaerObj.batchNumList[0].batchNum)
          }
        })
      } else {
        this.$set(this.tableData, this.tableData.length - 1, { add: true })
      }
    },
    handleCheckNum (row) {
      if (row.num === '') return this.titleTips(row, '请填写退库数量')
      if (Number(row.num) <= 0 && row.num) return this.titleTips(row, '退库数量不允许为0或负数')
      if (Number(row.num) > Number(row.usableNum)) return this.titleTips(row, '退库数量大于可用库存数量')
      const dataType = row.classifyId || ''
      let pieces = !CHINESE_MEDICINE_TYPE.includes(dataType)
      // 除“中药饮片”和“中药颗粒”外其他类型的商品，限制出库数量录入小数
      if (pieces && !checkNonNegativeInteger(row.num) && row.num) return this.titleTips(row, '该商品只能按正整数出库')
      if (!DECIMAL_FOUR.test(row.num) && !pieces) return this.titleTips(row, '“中药饮片”和“中药颗粒”最多允许录入4位小数')
      if (row.red && (Number(row.num) <= Number(row.usableNum))) row.red = false
    },
    handlerAdd (row) {
      if (this.btnGray) return
      if (row) {
        const { localMaterialId, num } = row
        if (!localMaterialId) return this.everWarning('请选择物资再点击添加')
        if (num <= 0 || num === '') return this.everWarning('请填写退库数量后再添加')
        this.$set(row, 'add', false)
        this.$set(row, 'numShow', false)
        this.tableData.push({ add: true })
      }
    },
    handlerDelter (index) {
      console.log(index, 'handlerDelter', this.tableData)
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
          this.tableData[this.tableData.length - 1].numShow = true
        }
      }
    },
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
  computed: {
    btnGray () {
      return btnGray(this.tableData)
    }
  }
}

</script>
<style scoped lang="less">
.border_red /deep/ .el-input__inner {
  border-color: red;
}
</style>

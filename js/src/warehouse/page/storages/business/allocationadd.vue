<template>
  <div>
    <ever-bread-crumb name="调拨" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>{{!objId ? '填写基础信息' : '基础信息'}}</h4>
        <ever-form2
          v-model="obj"
          ref="form"
          :nosubmit="true"
          :rules="rules"
          :span="12"
          :schema="allocationSchema">
        </ever-form2>
        <!-- 添加物资 -->
        <h4>{{!objId ? '添加物资' : '物资明细'}}</h4>
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
            <template slot-scope="scope">
              {{scope.row.spec || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="可用库存" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.usableNum || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="调拨数量" width="180" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId">
                <el-input
                  :class="{border_red: scope.row.red}"
                  placeholder="调拨数量"
                  style="width: 100px"
                  v-model="scope.row.num"
                  type="number"
                  @focus="handleStorageNum(scope.row.num)"
                  @blur="handleCheckNum(scope.row, false)"
                  size="small"
                ></el-input>
                <span>{{scope.row.packagUnitName}}</span>
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
        <div class="footer">
          <el-button type="primary" class="w_100" size="small" :disabled="btnGray" @click="submitData(109)" :loading="unRepeatedBtn">提交</el-button>
          <el-button size="small" :disabled="btnGray" type="primary" @click="submitData(108)" :loading="unRepeatedBtn">暂存</el-button>
          <el-button size="small" @click="$router.go(-1)">返回</el-button>
        </div>
      </div>
    </div>
    <!-- 可用库存小于调拨数量提示弹窗 -->
    <el-dialog
      title="提示"
      class="edit_dialog"
      :visible.sync="visible"
      width="30%">
      <span v-html="stockData"></span>
      <div>调拨数量大于可用库存数量，请修改后重新提交。</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerUpdate" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import storageroomApi from '@/warehouse/store/storageroomapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { checkNonNegativeInteger, CHINESE_MEDICINE_TYPE, debounce } from '@/util/common'
import { allocationSchema } from '@/warehouse/page/storages/business/store/batch.columns.js'
import allocationapi from '@/warehouse/page/storages/store/allocationapi.js'
import storage from '@/util/storage'

export default {
  mixins: [getstorage],
  data () {
    let obj = this.$ever.createObjFromSchema(allocationSchema)
    return {
      objId: '',
      allocationSchema,
      obj,
      tableData: [],
      queryParams: { materialType: '', offset: 0, pagesize: 9999, state: 0, isNeedStock: true },
      rules: {
        storageRoomId: { required: true, message: '必填项', trigger: 'blur' }
      },
      storageArr: [],
      storageNum: '',
      unRepeatedBtn: false,
      visible: false,
      stockData: '',
      name: 'storageRoomId',
      schemaName: 'allocationSchema',
      stockItemList: [], // 缺货之后的list
    }
  },
  created () {
    if (this.$route.query.id) {
      this.getDetail(this.$route.query.id)
    }
    this.initInfo()
  },
  computed: {
    btnGray () {
      if (this.tableData && this.tableData.length && this.tableData.length === 1) {
        const data = this.tableData[0]
        let { localMaterialId, num } = data
        if (localMaterialId && num > 0) {
          return false
        } else {
          return true
        }
      } else {
        return !this.tableData.length
      }
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
    handlerUpdate () { // 更新页面可用库存
      this.visible = false
      this.tableData.forEach(item => {
        this.stockItemList.forEach(stock => {
          if (item.localMaterialId === stock.localMaterialId) {
            this.$set(item, 'usableNum', stock.usableNum)
            this.$set(item, 'red', true)
          }
        })
      })
    },
    // 重置参数
    initInfo () {
      Object.assign(this.queryParams, { isInvented: this.isInvented, storageRoomId: this.storageId })
      storageroomApi.list(this.queryParams).then(res => {
        if (res) {
          this.storageArr = res.list
          let storageRoomId = this.$ever.getFieldFromSchema(this.allocationSchema, 'storageRoomId').props
          storageRoomId.options = res.list.filter(item => item.id !== this.storageId)
          if (storageRoomId.options.length === 1) {
            this.obj.storageRoomId = storageRoomId.options[0].id
          }
        }
      })
    },
    handleStorageNum (num) { // 记录原始调拨数量
      this.storageNum = num
    },
    handleCheckNum (row, flag) { // 调拨数量输入框
      if (row.num === '') return this.titleTips(flag, row, '请填写调拨数量')
      if (Number(row.num) <= 0 && row.num) {
        return this.titleTips(flag, row, '调拨数量不允许为0或负数')
      }
      if (Number(row.num) > Number(row.usableNum)) {
        return this.titleTips(flag, row, '调拨数量大于可用库存数量')
      }
      const dataType = row.classifyId || ''
      let reg = /^([1-9]\d*|0)(\.\d{1,4})?$/
      let pieces = !CHINESE_MEDICINE_TYPE.includes(dataType)
      if (pieces && !checkNonNegativeInteger(row.num) && row.num) { // 除“中药饮片”和“中药颗粒”外其他类型的商品，限制出库数量录入小数
        this.titleTips(flag, row, '该商品只能按正整数出库')
      }
      if (!reg.test(row.num) && !pieces) {
        return this.titleTips(false, row, '“中药饮片”和“中药颗粒”最多允许录入4位小数')
      }
      if (row.red && (Number(row.num) <= Number(row.usableNum))) row.red = false
    },
    titleTips (flag, row, text) {
      if (flag) {
        row.num = this.storageNum
      } else {
        row.num = ''
        this.$set(row, 'red', true)
        return this.everWarning(`${text}，请重新录入`)
      }
    },
    submitData: debounce(function (status) {
      let params = {
        toStorageRoomId: this.obj.storageRoomId, // 收货库房
        requsitionStorageRoomId: this.storageId, // 发货库房
        reasons: this.obj.reasons, // 调拨原因
        itemList: [],
        clinicId: storage.getStorageByClinic('CLINICID') || '',
        status: status, // 调拨状态
      }
      let submit = false
      this.tableData && this.tableData.map(item => {
        const { localMaterialId, num, materialSkuId, unitId, classifyId } = item
        if (localMaterialId && num === '') submit = true
        if (localMaterialId && num) {
          params.itemList.push({
            num, // 调拨数量
            unitId, // 单位id
            classifyId,
            materialSkuId, // 商品类型
            localMaterialId // 商品id
          })
        }
      })
      if (this.$route.query.id || this.obj.id) params.id = this.$route.query.id || this.obj.id
      if (this.obj.code) params.code = this.obj.code
      if (submit) return this.everWarning('物资列表还有信息未录入')
      this.unRepeatedBtn = true
      allocationapi[(params.id) ? 'submitAllotBound' : 'createAllotBound'](params).then(res => {
        if (res) {
          if (res.stockErrorMessageList && res.stockErrorMessageList.length) { // 这个时候说明可用库存小于调拨数量
            let stock = []
            this.stockItemList = []
            res.stockErrorMessageList.forEach(item => {
              stock.push(`<div>${item.materialName}</div>`)
              this.stockItemList.push({ // 所有可用库存小于调拨数量的list
                usableNum: item.num,
                localMaterialId: item.localMaterialId
              })
            })
            this.stockData = stock.join('')
            this.visible = true
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
    handlerAdd (row, index) {
      if (this.btnGray) return
      if (row) {
        const { localMaterialId, num } = row
        if (!localMaterialId) return this.everWarning('请选择物资再点击添加')
        if (num <= 0 || num === '') return this.everWarning('请填写调拨数量后再添加')
        this.$set(row, 'add', false)
        this.tableData.push({ add: true })
      }
    },
    // 物资查询添加
    handleSelect (v, index) {
      if (v) {
        const { localMaterialId, classifyId, spec, materialName, unitId, usableNum, packagUnitName, materialSkuId } = v
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
          spec: spec,
          add: true,
          materialName,
          unitId,
          usableNum,
          packagUnitName,
          materialSkuId
        }
        this.$set(this.tableData, this.tableData.length - 1, metaerObj)
      } else {
        this.$set(this.tableData, this.tableData.length - 1, { add: true })
      }
    },
    handlerCancelStorage () { // 更改库房提示取消，恢复原库房
      if (this.btn !== 3) {
        this.obj.storageRoomId = this.oldVal
        this.btn = 7
      }
    },
    getClassifyIds (v) {
      if (this.obj.storageRoomId) {
        let data = v || this.obj
        this.tableData = [{ add: true }]
        // 处理调拨物资查询所需参数classifyIds
        let toStorageRoom // 收货库房
        let storageRoom // 本库房
        this.storageArr.forEach(item => {
          if (item.id === this.storageId) {
            storageRoom = JSON.parse(item.materialType)
          }
          if (item.id === data.storageRoomId) {
            toStorageRoom = JSON.parse(item.materialType)
          }
        })
        let materArr = []
        toStorageRoom.map(mater => {
          const index = storageRoom.findIndex(keys => { return mater === keys })
          if (~index) {
            materArr.push(storageRoom[index])
          }
        })
        this.queryParams.classifyIds = materArr
      } else {
        this.tableData = []
      }
    }
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
<style lang="less" scoped>
.border_red /deep/ .el-input__inner {
  border-color: red;
}
</style>

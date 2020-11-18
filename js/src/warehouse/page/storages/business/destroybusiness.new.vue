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
        <div class="backsss">
          <ever-table
            border
            :span-method="arraySpanMethod"
            :columns="columns"
            :table-class="'no-hover'"
            :el-table-attr="eltableAttr"
            :tableKey="'localMaterialId'"
            :data="hanlderItems">
            <!-- 物资查询 -->
            <template slot="materialName" slot-scope="scope">
              <material-select
                v-if="scope.$index === obj.items.length - 1 && !scope.row.showName && !scope.row.id"
                ref="materselect"
                :needObjFlag="true"
                :params="queryParams"
                @change="selectMaterial">
              </material-select>
              <span v-else>{{scope.row.materialName}}</span>
            </template>
            <!-- 批次选择 -->
            <template slot="batchNum" slot-scope="scope">
              <span v-if="scope.row.localMaterialId && scope.row.isExpiryDate">
                <ever-select
                  style="width: 150px"
                  @change="batchNumChange($event, scope.row)"
                  @visibleChange="visibleChange(scope.row, scope.$index)"
                  v-model="scope.row.batchNum"
                  :options="scope.row.batchNumList"
                  :customValue="'id'"
                  :needObjFlag="true"
                  placeholder="生产批号">
                </ever-select>
                <span style="width:25px;display:inline-block; vertical-align: middle;">
                  <i v-if="scope.row.last && scope.row.localMaterialId && scope.row.batchNumList && scope.row.batchNumList.length > 1" class="iconfont icon-tianjiabingli fr blue" @click="addBednum(scope.$index)"></i>
                </span>
              </span>
              <span v-else>--</span>
            </template>
            <!-- 退货数量-->
            <template slot="num" slot-scope="scope">
              <span v-if="scope.row.localMaterialId">
                <el-input style="width: 100px" :class="{inputerror: scope.row.inputError}" type="number" v-model="scope.row.num" @change="calcInboundNum(scope.row, scope.$index)"></el-input><span class="ml5">{{scope.row.packagUnitName}}</span>
              </span>
              <span v-else>--</span>
            </template>
            <!-- 操作-->
            <template slot="operate" slot-scope="scope">
              <span>
                <i v-if="scope.row.localMaterialId || obj.items.length > 1" class="iconfont icon-bingli-shanchu blue" @click="deleteBednum(scope.$index)"></i>
                <i v-if="scope.$index === obj.items.length - 1" @click="addListItem" class="iconfont icon-tianjiabingli blue" :class="{cGray: (!scope.row.localMaterialId && obj.items.length === 1)}"></i>
              </span>
            </template>
          </ever-table>
        </div>
        <div>
          <el-button class="w_100" type="primary" :loading="btnLoading" :disabled="btnDisabled" @click="submitBackCode(102)">提交</el-button>
          <el-button class="w_60" type="primary" :loading="btnLoading" :disabled="btnDisabled" @click="submitBackCode(101)">暂存</el-button>
          <el-button class="w_60" :loading="btnLoading" @click="backList">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/destroyscrapapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import inventoryQueryApi from '@/warehouse/store/getmaterialinfoapi'
import { schema, columns, defaultItem } from './store/destroybusiness.columns'
import { CHINESE_MEDICINE_TYPE, floatTool } from '@/util/common'
import { hanlderItems } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'

export default {
  mixins: [getstorage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.items = []
    return {
      schema,
      obj,
      columns,
      objId: this.$route.params.id,
      queryParams: { offset: 0, pagesize: 20, state: 0, isNeedStock: true },
      eltableAttr: {'empty-text': '请先填写基础信息'},
      rules: {
        destroyReason: { required: true, message: '必填项', trigger: 'blur' }
      },
      btnLoading: false
    }
  },
  created () {
    this.queryParams.storageRoomId = this.storageId
    this.objId && this.getDetails()
  },
  computed: {
    // 判断 提交/暂存 按钮是否可以点击
    btnDisabled () {
      return !this.obj.items.length || !this.obj.destroyReason ||
      (this.obj.items.length === 1 && this.obj.items.some(item => !item.localMaterialId || (item.isExpiryDate && !item.batchNum) || !item.num)) ||
      (this.obj.items.length > 1 && this.obj.items.some(item => item.localMaterialId && ((item.isExpiryDate && !item.batchNum) || !item.num)))
    },
    // 计算需要合并单元格的物资，记录物资 下标和length old
    hanlderItems () {
      return hanlderItems(this.obj.items)
    }
  },
  methods: {
    // 点击返回按钮
    backList () {
      let len = this.obj.items
      if (len.length && len[0].localMaterialId) {
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
    // 验证当前物资列表数据是否可以提交
    checkSubmitData () {
      return this.obj.items.some(item => {
        return (item.localMaterialId && ((item.isExpiryDate && !item.batchNum) || !item.num || item.inputError))
      })
    },
    // 提交数据
    submitBackCode (status) {
      this.$refs.form.$refs.form.validate(valid => {
        if (this.checkSubmitData()) return this.everWarning('请先完善当前物资列表数据')
        let params = Object.assign({destroyReason: this.obj.destroyReason, status, storageRoomId: this.storageId})
        params.items = this.obj.items.filter(item => item.localMaterialId).map(item => {
          const {
            localMaterialId,
            materialSkuId,
            classifyId,
            unitId,
            isManageAlone,
            isExpiryDate,
            isNum,
            produceDate,
            validityDate,
            num
          } = item
          return Object.assign({
            localMaterialId,
            materialSkuId,
            classifyId,
            unitId,
            isManageAlone,
            isExpiryDate,
            isNum,
            produceDate,
            validityDate,
            num
          }, item.isExpiryDate ? {batchNum: item.batchNum.id || item.batchNum} : {})
        })
        if (this.objId) params.id = this.objId
        if (this.obj.code) params.code = this.obj.code
        this.btnLoading = true
        api.createOrUpdate(params).then(res => {
          if (res && !res.message && res.id) {
            this.everSuccess('保存成功')
            if (status === 101) {
              this.objId = res.id
              this.obj.code = res.code
            } else {
              this.$router.push(`/storages/business/destroybusinessee/${res.id}`)
            }
          } else {
            if (res.message) {
              res.stockErrorMessageList.forEach(item => {
                if (item.type === 1) {
                  this.obj.items.forEach(child => {
                    if (child.localMaterialId === item.localMaterialId) {
                      child.stockUsableNum = item.num
                      child.inputError = true
                    }
                  })
                } else if (item.type === 2) {
                  this.obj.items.forEach(child => {
                    let batchNum = child.batchNum.id || child.batchNum
                    if (child.localMaterialId === item.localMaterialId && batchNum === item.batchNum) {
                      child.stockContainerUsableNum = item.num
                      child.inputError = true
                    }
                  })
                }
              })
              this.$confirm(res.message, '提示', {dangerouslyUseHTMLString: true}).then(_ => {})
            }
          }
          this.btnLoading = false
        })
      })
    },
    // 选择查询的物资
    selectMaterial (data, index) {
      if (data) {
        const { localMaterialId } = data
        if (typeof index === 'undefined' && this.hanlderItems.some(item => item.localMaterialId === localMaterialId)) return this.everWarning('当前物资已存在')
        // 根据物资id查询物资批号
        inventoryQueryApi.list({localMaterialId, ifMoreThanZero: 1, storageRoomId: this.storageId}).then(res => {
          if (res && res.list && res.list.length) {
            data.stockUsableNum = res.list[0].usableNum
            if (data.isExpiryDate) {
              let batchNumList = res.list[0].batchNumList.map(item => {
                item.id = item.batchNum
                return item
              })
              let oldBatchNumList = JSON.parse(JSON.stringify(batchNumList))
              if (typeof index !== 'undefined') {
                let localArr = this.obj.items.filter(child => child.localMaterialId === data.localMaterialId)
                let selectBatchList = batchNumList.filter(bbs => !localArr.some(child => child.batchNum === bbs.id))
                this.obj.items.forEach((item, index) => {
                  if (item.localMaterialId === data.localMaterialId) {
                    let thisBatchNum = oldBatchNumList.find(check => check.id === item.batchNum)
                    item.oldBatchNumList = oldBatchNumList
                    item.oldBatch = item.batchNum
                    item.changesBatchNum = item.batchNum
                    this.$set(this.obj.items[index], 'batchNumList', selectBatchList.concat([thisBatchNum]))
                  }
                })
              } else {
                let batchNum = batchNumList[0]
                const {produceDate, validityDate, usableNum} = batchNum
                this.$set(this.obj.items, this.obj.items.length - 1, Object.assign(data, {oldBatchNumList, batchNumList}, batchNumList.length === 1 ? {
                  produceDate,
                  validityDate,
                  stockContainerUsableNum: usableNum,
                  batchNum,
                } : {}))
              }
            } else {
              this.$set(this.obj.items, this.obj.items.length - 1, data)
            }
          } else {
            this.$set(this.obj.items, this.obj.items.length - 1, Object.assign({}, defaultItem))
            return this.everWarning('库存查询结果为空')
          }
        })
      } else {
        this.$set(this.obj.items, this.obj.items.length - 1, Object.assign({}, defaultItem))
      }
    },
    // 添加批号选择
    addBednum (index) {
      let newObject = Object.assign({}, this.obj.items[index])
      if (this.obj.items.some(item => item.localMaterialId === newObject.localMaterialId && ((item.isExpiryDate && !item.batchNum) || !item.num))) return this.everWarning('请先完善当前物资信息')
      for (let item in newObject) {
        if (['batchNum', 'inStockCode', 'changesBatchNum', 'changesInStock', 'oldBatch', 'oldInStockCode', 'totalPrice', 'num', 'stockContainerUsableNum', 'validityDate', 'produceDate', 'sysBatchId', 'price'].includes(item)) newObject[item] = ''
      }
      // 过滤掉已经选择的 批次号
      const findArr = this.obj.items.filter(item => item.localMaterialId === newObject.localMaterialId)
      let batchNumList = JSON.parse(JSON.stringify(newObject.batchNumList))
      // 物资是按效期管理
      if (newObject.isExpiryDate) {
        findArr.forEach(item => {
          let newArr = []
          batchNumList.forEach(child => {
            const batchNum = item.batchNum.id || item.batchNum
            if (child.id !== batchNum) {
              newArr.push(child)
            }
          })
          batchNumList = JSON.parse(JSON.stringify(newArr))
        })
      }
      // 物资是按效期管理
      if (newObject.isExpiryDate) {
        newObject.batchNumList = batchNumList
        newObject.inStockCodes = []
      }
      this.obj.items.splice(index + 1, 0, newObject)
      if (newObject.batchNumList.length === 1) {
        let val = newObject.batchNumList[0]
        newObject.batchNum = val
        const {produceDate, validityDate, usableNum} = val
        newObject = Object.assign(newObject, {produceDate, validityDate, stockContainerUsableNum: usableNum})
        newObject.num = ''
        this.handlerBatchSelect(newObject)
        newObject.changesBatchNum = Object.assign({}, val)
      }
      if (this.obj.items[this.obj.items.length - 1].localMaterialId) {
        this.obj.items[this.obj.items.length - 1].showName = true
      }
    },
    // 添加物资
    addListItem () {
      if (this.obj.items.some(item => !item.localMaterialId || (item.isExpiryDate && !item.batchNum) || !item.num)) return this.everWarning('请先完善当前列表信息')
      this.obj.items.push(Object.assign({}, defaultItem))
      // 点击添加最后一行输入框自动聚焦
      this.$nextTick(_ => {
        setTimeout(_ => {
          if (this.$refs.materselect && this.$refs.materselect.$el.querySelectorAll('input')) {
            this.$refs.materselect.$el.querySelectorAll('input')[0].focus()
          }
        }, 100)
      })
    },
    // 删除批号
    deleteBednum (index) {
      if (this.obj.items.length === 1) {
        this.obj.items = [Object.assign({}, defaultItem)]
        this.$nextTick(_ => {
          this.$refs.materselect.select = ''
          this.$refs.materselect.options = []
        })
      } else {
        // 删除的批号和入库单 还原进每一个下拉列表中
        let newObject = Object.assign({}, this.obj.items[index])
        this.obj.items.splice(index, 1)
        if (this.obj.items[this.obj.items.length - 1].localMaterialId) {
          this.obj.items[this.obj.items.length - 1].showName = true
        }
        if (!this.obj.items.some(item => item.localMaterialId === newObject.localMaterialId)) return
        if ((newObject.isExpiryDate && !newObject.batchNumList) || !newObject.isExpiryDate) return
        this.updateSelect(newObject)
        this.obj.items = JSON.parse(JSON.stringify(this.obj.items))
      }
    },
    updateSelect (newObject) {
      if (!newObject.localMaterialId) return
      // 按效期管理
      if (newObject.isExpiryDate) {
        // 当前要删除的批号
        const parentBatchNum = newObject.batchNum.id || newObject.batchNum
        // 取出当前批次的Object对象
        let findBatchNum = newObject.oldBatchNumList.find(item => item.id === parentBatchNum)
        this.obj.items.forEach(item => {
          if (item.localMaterialId === newObject.localMaterialId) {
            if (!item.batchNumList.some(child => child.id === parentBatchNum)) {
              item.batchNumList.push(Object.assign({}, findBatchNum))
            }
          }
        })
      }
    },
     // 生产批号选择
    batchNumChange (val, data) {
      if (data.oldBatch === val.id) {
        data.oldBatch = ''
        return
      }
      let newObject = {}
      if (data.changesBatchNum) {
        let changesBatchNum = JSON.parse(JSON.stringify(data.changesBatchNum))
        newObject = Object.assign({}, data, {batchNum: changesBatchNum})
      }
      const {produceDate, validityDate, usableNum} = val
      data = Object.assign(data, {produceDate, validityDate, stockContainerUsableNum: usableNum})
      this.handlerBatchSelect(data)
      if (newObject.batchNum) {
        let parentBatchNum = newObject.batchNum.id || newObject.batchNum
        if (parentBatchNum && val.id !== parentBatchNum) this.updateSelect(Object.assign({}, newObject))
      }
      data.changesBatchNum = Object.assign({}, val)
      this.$set(data, 'num', '')
    },
    // 批号选择 下拉框过滤已经选择的数据
    handlerBatchSelect (data) {
      let localArr = this.obj.items.filter(child => child.localMaterialId === data.localMaterialId) || []
      // 按效期管理
      if (data.isExpiryDate) {
        let parentBatchNum = data.batchNum.id || data.batchNum
        localArr.forEach((item, index) => {
          let itemBatchNum = item.batchNum.id || data.batchNum
          // 选择的数据为自己  不做处理
          if (parentBatchNum === itemBatchNum) return
          // 过滤掉所有已经选择的数据
          item.batchNumList = item.batchNumList.filter(childs => {
            return childs.id !== parentBatchNum
          })
        })
      }
    },
    visibleChange (row, index) {
      if (row.isExpiryDate && !row.batchNumList) {
        this.selectMaterial(row, index)
      }
    },
    // 暂存数据获取
    getDetails () {
      api.getById({ id: this.objId }).then(res => {
        if (res) {
          if (res.items) res.items.push(Object.assign({}, defaultItem))
          this.obj = Object.assign(this.obj, res)
          this.obj.items.forEach((item, index) => {
            if (item.num > item.stockContainerUsableNum) {
              this.$set(this.obj.items[index], 'inputError', true)
            }
            // 计算当前同一物资退货数量之和
            let totalNums = 0
            let indexs = []
            this.obj.items.forEach((child, index) => {
              if (item.localMaterialId === child.localMaterialId) {
                totalNums = floatTool.add(child.num, totalNums)
                indexs.push(index)
              }
            })
            // 总的退货数量大于库存可用数量
            if (totalNums > item.stockUsableNum) {
              indexs.forEach(item => {
                this.$set(this.obj.items[item], 'inputError', true)
              })
            }
          })
        }
      })
    },
    // 数量输入验证
    calcInboundNum (data, index) {
      const float = /^(\+)?\d+(\.\d+)?/
      const parse = /^(\+)?\d*$/
      if (data.num <= 0 || !data.num) {
        data.num = ''
        this.$set(this.obj.items[index], 'inputError', true)
        return this.$messageTips(this, 'warning', '销毁报废数量不允许为0或负数')
      }
      let dataType = data.classifyId || ''
      if (CHINESE_MEDICINE_TYPE.includes(dataType)) {
        if (!float.test(data.num)) {
          data.num = ''
          this.$set(this.obj.items[index], 'inputError', true)
          return this.$messageTips(this, 'warning', '数量不能小于0，请重新录入')
        }
        let num = String(data.num).split('.')
        if (num[1] && num[1].length > 4) data.num = data.num.toFixed(4)
      } else {
        if (!parse.test(data.num)) {
          data.num = ''
          this.$set(this.obj.items[index], 'inputError', true)
          return this.$messageTips(this, 'warning', '该物资销毁报废数量只允许录入整数')
        }
      }
      if (data.num > data.stockContainerUsableNum) {
        this.$set(this.obj.items[index], 'inputError', true)
        return this.everWarning('销毁报废数量大于批次可用库存')
      }
      if (data.num > data.stockUsableNum) {
        this.$set(this.obj.items[index], 'inputError', true)
        return this.everWarning('销毁报废数量大于库存可用数量')
      }
      // 计算当前同一物资退货数量之和
      let totalNums = 0
      let indexs = []
      this.obj.items.forEach((item, index) => {
        if (item.localMaterialId === data.localMaterialId) {
          totalNums = floatTool.add(item.num, totalNums)
          indexs.push(index)
        }
      })
      // 总的退货数量大于库存可用数量
      if (totalNums > data.stockUsableNum) {
        indexs.forEach(item => {
          this.$set(this.obj.items[item], 'inputError', true)
        })
        return this.everWarning('销毁报废数量大于物资总可用库存')
      } else {
        indexs.forEach(item => {
          this.$set(this.obj.items[item], 'inputError', false)
        })
      }
      this.$set(this.obj.items[index], 'inputError', false)
    },
    // 合并表格
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let columnIndes = [0, 1, 2]
      if (columnIndes.includes(columnIndex) && this.obj.items.length > 1) {
        if (((rowIndex - (row.thisTableIndex + row.thisTableCount)) % row.thisTableCount) === 0) {
          return {
            rowspan: row.thisTableCount,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
  },
  watch: {
    'obj.destroyReason' (v) {
      if (v && !this.obj.items.length) this.obj.items = [Object.assign({}, defaultItem)]
    },
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
.backsss {
  /deep/ .inputerror .el-input__inner {
    border: 1px solid #ff0000;
  }
}
</style>

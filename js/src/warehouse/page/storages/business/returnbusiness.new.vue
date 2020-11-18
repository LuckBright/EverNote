<template>
  <div>
    <ever-bread-crumb name="采购退货" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>填写基础信息</h4>
        <ever-form2
          :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" :nosubmit="true">
          <template slot="supplierLocalId">
            <!-- 供应商选择 -->
            <ever-remoteMethod
              ref="supplierSelect"
              placeholder="供应商"
              v-model="obj.supplierLocalId"
              :api="supplierLocalApi"
              :showName="'supplierObject'"
              :params="{showflag: 1}"
              @change="supplierChange"
              :isSilentQuery="true">
            </ever-remoteMethod>
          </template>
          <template slot="default"></template>
        </ever-form2>
        <h4>添加物资</h4>
        <div class="backsss">
          <ever-table
            ref="everTable"
            :columns="columns"
            :border="true"
            :span-method="arraySpanMethod"
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
                  <i v-if="scope.row.last && scope.row.localMaterialId && scope.row.batchNumList && (scope.row.batchNumList.length > 1 || scope.row.inStockCodes.length > 1)" class="iconfont icon-tianjiabingli fr" @click="addBednum(scope.$index)"></i>
                </span>
              </span>
              <span v-else>--</span>
            </template>
            <!-- 采购入库单号选择-->
            <template slot="inStockCode" slot-scope="scope">
              <span v-if="scope.row.localMaterialId">
                <ever-select
                  style="width: 190px"
                  @change="inStockCodeChange($event, scope.row)"
                  @visibleChange="visibleChange(scope.row, scope.$index)"
                  v-model="scope.row.inStockCode"
                  :options="scope.row.inStockCodes"
                  :customValue="'inStockCode'"
                  :needObjFlag="true"
                  placeholder="采购入库单">
                </ever-select>
                <span style="width:25px;display:inline-block; vertical-align: middle;">
                  <i v-if="scope.row.last && scope.row.localMaterialId && !scope.row.isExpiryDate && scope.row.inStockCodes && scope.row.inStockCodes.length > 1" class="iconfont icon-tianjiabingli fr" @click="addBednum(scope.$index)"></i>
                </span>
              </span>
              <span v-else>--</span>
            </template>
            <!-- 退货数量-->
            <template slot="num" slot-scope="scope">
              <span v-if="scope.row.localMaterialId">
                <el-input style="width: 100px" :class="{inputerror: scope.row.inputError}" type="number" v-model="scope.row.num" @input="backPriceChange($event, scope.row)" @blur="calcInboundNum(scope.row, scope.$index)"></el-input><span class="ml5">{{scope.row.packagUnitName}}</span>
              </span>
              <span v-else>--</span>
            </template>
            <!-- 操作-->
            <template slot="operate" slot-scope="scope">
              <span>
                <i v-if="obj.items.length !== 1 || (obj.items.length == 1 && scope.row.localMaterialId)" class="iconfont icon-bingli-shanchu" @click="deleteBednum(scope.$index)"></i>
                <i v-if="scope.$index === obj.items.length - 1" @click="addListItem" class="iconfont icon-tianjiabingli"></i>
              </span>
            </template>
          </ever-table>
          <div class="totalprice">
            <span class="ml10">退货总金额：<span class="cOrange">{{totalPrice | formatToFinacial(4)}}</span></span>
          </div>
        </div>
        <div>
          <el-button class="w_100" type="primary" :loading="btnLoading" :disabled="btnDisabled" @click="submitBackCode(72)">提交</el-button>
          <el-button class="w_60" type="primary" :loading="btnLoading" :disabled="btnDisabled" @click="submitBackCode(71)">暂存</el-button>
          <el-button class="w_60" :loading="btnLoading" @click="backList">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { floatTool, CHINESE_MEDICINE_TYPE } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
import api from '../store/givebackapi'
import { defaultItem, schema, columns } from '@/warehouse/page/storages/business/store/columns.js'
import storage from '@/util/storage'

export default {
  mixins: [getstorage, storage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.items = []
    return {
      schema,
      obj,
      columns,
      supplierLocalApi,
      CHINESE_MEDICINE_TYPE,
      objId: this.$route.params.id,
      btnLoading: false,
      btnDisabled: true,
      totalPrice: 0,
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''),
      oldSupplierlocalId: null,
      eltableAttr: {'empty-text': '请先填写基础信息'},
      rules: {
        supplierLocalId: { required: true, message: '必填项', trigger: 'change' },
        description: { required: true, message: '必填项', trigger: 'blur' }
      },
      queryParams: { materialType: '', offset: 0, pagesize: 20, state: 0, splitFlag: 0, isNeedSysBatchStock: true },
    }
  },
  created () {
    this.queryParams.storageRoomId = this.storageId
    if (this.objId) {
      this.getDetails()
    }
  },
  computed: {
    // 计算需要合并单元格的物资，记录物资 下标和length old
    hanlderItems () {
      return this.obj.items.map((item, index) => {
        let childIndex = this.obj.items.findIndex(child => child.localMaterialId === item.localMaterialId)
        const thisArr = this.obj.items.filter(child => child.localMaterialId === item.localMaterialId)
        // 当前物资第一次出现的下标
        item.thisTableIndex = childIndex
        // 当前物资存在几条
        item.thisTableCount = thisArr.length
        // 当前物资的最后一条打上标记  last 需要显示添加批号按钮
        item.last = index === childIndex + thisArr.length - 1
        return item
      })
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
    // 切换供应商
    supplierChange (val) {
      if (val) {
        if (this.oldSupplierlocalId && this.oldSupplierlocalId !== val) {
          this.changeSupplier(false, val)
        } else {
          this.oldSupplierlocalId = val
          this.queryParams.supplierLocalId = val
          this.obj.items = [Object.assign({}, defaultItem)]
        }
      } else {
        if (this.oldSupplierlocalId) {
          this.changeSupplier(true, val)
        }
      }
    },
    // 切换供应商或者清除供应商
    changeSupplier (clear, val) {
      if (this.obj.items.some(item => item.localMaterialId)) {
        this.$confirm('单据中已经添加物资，如需修改供应商将自动清空已添加的物资', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (clear) {
            this.obj.items = []
            this.oldSupplierlocalId = null
          } else {
            this.obj.items = [Object.assign({}, defaultItem)]
          }
          this.queryParams.supplierLocalId = val
          this.domBlur(true)
        }).catch(() => {
          this.obj.supplierLocalId = this.oldSupplierlocalId
          this.queryParams.supplierLocalId = this.oldSupplierlocalId
          this.domBlur()
        })
      } else {
        if (clear) {
          this.obj.items = []
          this.oldSupplierlocalId = null
        } else {
          this.obj.items = [Object.assign({}, defaultItem)]
        }
        this.queryParams.supplierLocalId = val
      }
    },
    // 切换供应商  弹窗点击取消 取消下拉框的聚焦事件
    domBlur (clear) {
      this.$nextTick(_ => {
        if (this.$refs.supplierSelect && this.$refs.supplierSelect.$children) {
          this.$refs.supplierSelect.$children[0].blur()
          if (clear && this.$refs.materselect) {
            this.$refs.materselect.select = ''
            this.$refs.materselect.options = []
          }
        }
      })
    },
    // 退货数量输入验证
    calcInboundNum (data, index) {
      const float = /^(\+)?\d+(\.\d+)?/
      const parse = /^(\+)?\d*$/
      if (data.num <= 0 || !data.num) {
        data.num = ''
        data.totalPrice = ''
        this.$set(this.obj.items[index], 'inputError', true)
        return this.$messageTips(this, 'warning', '退货数量不允许为0或负数')
      }
      let dataType = data.classifyId || ''
      if (this.CHINESE_MEDICINE_TYPE.includes(dataType)) {
        if (!float.test(data.num)) {
          data.num = ''
          data.totalPrice = ''
          this.$set(this.obj.items[index], 'inputError', true)
          return this.$messageTips(this, 'warning', '退货数量不能小于0，请重新录入')
        }
        let num = String(data.num).split('.')
        if (num[1] && num[1].length > 4) data.num = Number(data.num).toFixed(4)
      } else {
        if (!parse.test(data.num)) {
          data.num = ''
          data.totalPrice = ''
          this.$set(this.obj.items[index], 'inputError', true)
          return this.$messageTips(this, 'warning', '退货数量不能有小数，请重新录入')
        }
      }
      if (data.num > data.stockSysBatchUsableNum || data.num > data.inStockNum) {
        this.$set(this.obj.items[index], 'inputError', true)
        return this.everWarning('退货数量大于批次可用库存。')
      }
      if (data.num > data.stockUsableNum) {
        this.$set(this.obj.items[index], 'inputError', true)
        return this.everWarning('退货数量大于总可用库存。')
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
        return this.everWarning('退货数量大于物资总可用库存')
      } else {
        indexs.forEach(item => {
          this.$set(this.obj.items[item], 'inputError', false)
        })
      }
      this.$set(this.obj.items[index], 'inputError', false)
    },
    // 计算退货金额
    backPriceChange (val, data) {
      data.totalPrice = floatTool.multiply(data.price, val)
    },
    // 采购单选择
    inStockCodeChange (val, data) {
      if (data.oldInStockCode === val.id) {
        data.oldInStockCode = ''
        return
      }
      let newObject = {}
      if (data.changesBatchNum || data.changesInStock) {
        newObject = Object.assign({}, data, {batchNum: data.changesBatchNum, inStockCodes: data.changesBatchNum ? data.changesBatchNum.inStockCodes : [], inStockCode: data.changesInStock})
      }
      let obj = Object.assign({}, val)
      obj.inStockCode = obj.id
      delete obj.id
      data = Object.assign(data, obj)
      data.num = ''
      data.totalPrice = ''
      // 释放上一个选择过的批次和
      this.handlerBatchSelect(data)
      if ((newObject.isExpiryDate && newObject.batchNum) || (!newObject.isExpiryDate && newObject.inStockCode)) {
        let oldBatchNum = null
        let parentBatchNum = null
        if (newObject.isExpiryDate) {
          oldBatchNum = newObject.batchNum.id || newObject.batchNum
          parentBatchNum = data.batchNum.id || data.batchNum
        }
        if ((parentBatchNum && oldBatchNum && oldBatchNum !== parentBatchNum) || (newObject.inStockCode && data.inStockCode && newObject.inStockCode !== data.inStockCode)) this.updateSelect(Object.assign({}, newObject))
      }
      data.changesBatchNum = data.batchNum
      data.changesInStock = obj.inStockCode
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
        newObject = Object.assign({}, data, {batchNum: changesBatchNum, inStockCodes: changesBatchNum.inStockCodes, inStockCode: data.changesInStock})
      }
      data.inStockCodes = val.inStockCodes
      if (val.inStockCodes.length === 1) {
        let obj = Object.assign({}, val.inStockCodes[0])
        obj.inStockCode = obj.id
        delete obj.id
        data = Object.assign(data, obj)
        this.handlerBatchSelect(data)
        if (newObject.batchNum) {
          let parentBatchNum = newObject.batchNum.id || newObject.batchNum
          if (parentBatchNum && val.id !== parentBatchNum) this.updateSelect(Object.assign({}, newObject))
        }
        data.changesBatchNum = Object.assign({}, val)
        data.changesInStock = obj.inStockCode
        data.num = ''
        data.totalPrice = ''
      } else {
        data.inStockCode = ''
        data.inStockNum = ''
        data.stockSysBatchUsableNum = ''
        data.price = ''
        data.num = ''
        data.totalPrice = ''
      }
    },
    // 批号选择 下拉框过滤已经选择的数据
    handlerBatchSelect (data) {
      let localArr = this.obj.items.filter(child => child.localMaterialId === data.localMaterialId) || []
      let parentInStockCode = data.inStockCode.id || data.inStockCode
      // 按效期管理
      if (data.isExpiryDate) {
        let parentBatchNum = data.batchNum.id || data.batchNum
        localArr.forEach((item, index) => {
          let itemBatchNum = item.batchNum.id || item.batchNum
          let itemInStockCode = item.inStockCode.id || item.inStockCode
          // 选择的数据为自己  不做处理
          if (parentBatchNum === itemBatchNum && parentInStockCode === itemInStockCode) return
          // 选择的数据批次相同 过滤掉 入库列表里面的单号
          if (parentBatchNum === itemBatchNum && parentInStockCode !== itemInStockCode) {
            item.inStockCodes = item.inStockCodes.filter(ches => {
              return ches.id !== parentInStockCode
            })
          }
          // 过滤掉所有已经选择的数据
          item.batchNumList = item.batchNumList.filter(childs => {
            let inow = false
            if (childs.id === parentBatchNum) {
              if (childs.inStockCodes.length === 1) {
                inow = true
              } else {
                childs.inStockCodes = childs.inStockCodes.filter(ches => {
                  return ches.id !== parentInStockCode
                })
              }
            }
            return !inow
          })
        })
      } else {
        // 按数量管理
        localArr.forEach((item, index) => {
          let itemInStockCode = item.inStockCode.id || item.inStockCode
          if (parentInStockCode === itemInStockCode) return
          item.inStockCodes = item.inStockCodes.filter(ches => {
            return ches.id !== parentInStockCode
          })
        })
      }
    },
    // 添加物资
    addListItem () {
      if (this.obj.items.some(item => !item.localMaterialId || (item.isExpiryDate && !item.batchNum) || !item.inStockCode || !item.num)) return this.everWarning('请先完善当前列表信息')
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
    async deleteBednum (index) {
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
        if ((newObject.isExpiryDate && !newObject.batchNumList) || (!newObject.isExpiryDate && !newObject.inStockCodes)) return
        this.updateSelect(newObject)
        this.obj.items = JSON.parse(JSON.stringify(this.obj.items))
      }
    },
    updateSelect (newObject) {
      if (!newObject.localMaterialId) return
      const parentInStockCode = newObject.inStockCode.id || newObject.inStockCode
      // 按效期管理
      if (newObject.isExpiryDate) {
        // 当前要删除的批号
        const parentBatchNum = newObject.batchNum.id || newObject.batchNum
        // 取出当前批次的Object对象
        let findBatchNum = newObject.oldBatchNumList.find(item => item.id === parentBatchNum)
        const findInStockCode = findBatchNum.inStockCodes.find(item => item.id === parentInStockCode)
        this.obj.items.forEach(item => {
          if (item.localMaterialId === newObject.localMaterialId) {
            let batchNum = item.batchNum.id || item.batchNum
            if (parentBatchNum === batchNum && findInStockCode && !item.inStockCodes.some(child => child.id === parentInStockCode)) {
              item.inStockCodes.splice(item.inStockCodes.length - 1, 0, findInStockCode)
            }
            let editInStock = item.batchNumList.find(child => child.id === parentBatchNum)
            if (editInStock) {
              if (!editInStock.inStockCodes.some(child => child.id === parentInStockCode)) {
                editInStock.inStockCodes.push(findInStockCode)
              }
            } else {
              let newbatchNum = Object.assign({}, findBatchNum)
              newbatchNum.inStockCodes = newbatchNum.inStockCodes.filter(bbs => bbs.id === parentInStockCode)
              item.batchNumList.push(newbatchNum)
            }
          }
        })
      // 按数量管理
      } else {
        // 找出原数据中的入库单号Object对象赋值给每一个下拉列表
        const findInStockCode = newObject.oldInStockCodes.find(item => item.id === parentInStockCode)
        this.obj.items.forEach(item => {
          if (item.localMaterialId === newObject.localMaterialId && findInStockCode && !item.inStockCodes.some(child => child.id === findInStockCode.id)) {
            item.inStockCodes.push(Object.assign({}, findInStockCode))
          }
        })
      }
    },
    // 添加批号选择
    addBednum (index) {
      let newObject = Object.assign({}, this.obj.items[index])
      if (this.obj.items.some(item => item.localMaterialId === newObject.localMaterialId && ((item.isExpiryDate && !item.batchNum) || !item.inStockCode || !item.num))) return this.everWarning('请先完善当前物资信息')
      for (let item in newObject) {
        if (['batchNum', 'inStockCode', 'changesBatchNum', 'changesInStock', 'oldBatch', 'oldInStockCode', 'totalPrice', 'num', 'inStockNum', 'stockSysBatchUsableNum', 'validityDate', 'produceDate', 'sysBatchId', 'price'].includes(item)) newObject[item] = ''
      }
      // 过滤掉已经选择的 批次号 和 采购单号
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
            if (child.id === batchNum && child.inStockCodes.length >= 1) {
              const inStockCode = item.inStockCode.id || item.inStockCode
              child.inStockCodes = child.inStockCodes.filter(cods => cods.id !== inStockCode)
              if (child.inStockCodes.length) newArr.push(child)
            }
          })
          batchNumList = JSON.parse(JSON.stringify(newArr))
        })
      }
      // 物资是按效期管理
      if (newObject.isExpiryDate) {
        newObject.batchNumList = batchNumList
        newObject.inStockCodes = []
      } else {
        //  按数量管理
        newObject.inStockCodes = newObject.inStockCodes.filter(item => {
          return !findArr.some(child => item.id === child.inStockCode)
        })
      }
      this.obj.items.splice(index + 1, 0, newObject)
      if (this.obj.items[this.obj.items.length - 1].localMaterialId) {
        this.obj.items[this.obj.items.length - 1].showName = true
      }
    },
    // 选择物资
    selectMaterial (data) {
      // 校验当前列表是否存在该物资
      if (this.obj.items.some(item => item.localMaterialId === data.localMaterialId)) {
        this.$nextTick(_ => {
          if (this.$refs.materselect) {
            this.$refs.materselect.select = ''
          }
        })
        return this.everWarning('选择物资已存在当前列表中')
      }
      if (data) {
        this.setItemData(data)
      } else {
        this.obj.items.splice(this.obj.items.length - 1, 1, Object.assign({}, defaultItem))
      }
    },
    setItemData (data, index) {
      // 查询当前物资对应的库房生产批号、采购入库单号、库存数量、价格
      api.listQuery(Object.assign(this.queryParams, { localMaterialId: data.localMaterialId, supplierLocalId: this.obj.supplierLocalId, pricingModel: this.isBatch, pageType: 15 })).then(res => {
        let lastIndex = this.obj.items.length - 1
        if (res && res.localMaterialId) {
          // 简化后端返回的数量 只取出前端需要的数据
          let {batchNumList, num} = res
          // 按效期管理物资
          if (data.isExpiryDate) {
            batchNumList = batchNumList.map(item => {
              item.inStockCodes = []
              item.batchNumList.forEach(child => {
                const {inStockCode, inStockNum, price, usableNum, produceDate, validityDate, sysBatchId, supplyMode, salePrice, sysBatchCode} = child
                item.inStockCodes.push({id: inStockCode, inStockCode: inStockCode + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + price + '元', sysBatchId, inStockNum, price, supplyMode, stockSysBatchUsableNum: usableNum, validityDate, produceDate, salePrice, sysBatchCode})
              })
              return {id: item.batchNum, inStockCodes: item.inStockCodes}
            })
            // 设置下拉框查询物资批号、采购入库单下拉框options
            if (typeof index !== 'undefined') {
              let localArr = this.obj.items.filter(child => child.localMaterialId === data.localMaterialId)
              let selectBatchList = JSON.parse(JSON.stringify(batchNumList))
              localArr.forEach(item => {
                let newArr = []
                selectBatchList.forEach(child => {
                  const batchNum = item.batchNum.id || item.batchNum
                  if (child.id !== batchNum) {
                    newArr.push(child)
                  }
                  if (child.id === batchNum && child.inStockCodes.length >= 1) {
                    const inStockCode = item.inStockCode.id || item.inStockCode
                    child.inStockCodes = child.inStockCodes.filter(cods => cods.id !== inStockCode)
                    if (child.inStockCodes.length) newArr.push(child)
                  }
                })
                selectBatchList = JSON.parse(JSON.stringify(newArr))
              })
              // 同时批量设置相同物资的所有下拉框
              this.obj.items.forEach(child => {
                if (child.localMaterialId === data.localMaterialId) {
                  let newSelect = JSON.parse(JSON.stringify(selectBatchList))
                  let batchNum = batchNumList.find(item => item.id === child.batchNum)
                  let thisBatch = newSelect.find(item => item.id === batchNum.id)
                  if (thisBatch) {
                    let findInstock = batchNum.inStockCodes.find(item => item.id === child.inStockCode)
                    thisBatch.inStockCodes.push(findInstock)
                    this.$set(child, 'inStockCodes', JSON.parse(JSON.stringify(thisBatch.inStockCodes)))
                    this.$set(child, 'oldInStockCodes', JSON.parse(JSON.stringify(batchNum.inStockCodes)))
                  } else {
                    let newbatchNum = Object.assign({}, batchNum)
                    newbatchNum.inStockCodes = newbatchNum.inStockCodes.filter(item => item.id === child.inStockCode)
                    newSelect.push(newbatchNum)
                    this.$set(child, 'inStockCodes', newbatchNum.inStockCodes)
                    this.$set(child, 'oldInStockCodes', JSON.parse(JSON.stringify(batchNum.inStockCodes)))
                  }
                  this.$set(child, 'batchNumList', newSelect)
                  this.$set(child, 'oldBatchNumList', JSON.parse(JSON.stringify(batchNumList)))
                  child.oldBatch = child.batchNum
                  child.oldInStockCode = child.inStockCode
                }
              })
            } else {
              // 生产批号只有一条
              if (batchNumList.length === 1) {
                this.obj.items[lastIndex].batchNum = batchNumList[0]
                // 采购入库单只有一个
                this.obj.items[lastIndex].inStockCodes = batchNumList[0].inStockCodes
                if (batchNumList[0].inStockCodes.length === 1) {
                  this.obj.items[lastIndex] = Object.assign(this.obj.items[lastIndex], batchNumList[0].inStockCodes[0])
                  this.obj.items[lastIndex].inStockCode = batchNumList[0].inStockCodes[0].id
                }
              }
              this.obj.items[lastIndex] = Object.assign(this.obj.items[lastIndex], data, {batchNumList, stockUsableNum: num, oldBatchNumList: JSON.parse(JSON.stringify(batchNumList))})
            }
          // 按数量管理物资
          } else {
            // 简化采购入库单下拉数据
            let inStockCodes = batchNumList.map(item => {
              const {inStockCode, inStockNum, price, usableNum, produceDate, validityDate, sysBatchId, supplyMode} = item
              return {id: inStockCode, inStockCode: inStockCode + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + price + '元', sysBatchId, supplyMode, inStockNum, price, stockSysBatchUsableNum: usableNum, validityDate, produceDate}
            })
            if (typeof index !== 'undefined') {
              let itemArr = this.obj.items.filter(item => item.localMaterialId === data.localMaterialId)
              // 同时批量设置相同物资的所有下拉框
              this.obj.items.forEach(child => {
                if (child.localMaterialId === data.localMaterialId) {
                  child.oldInStockCode = child.inStockCode
                  let newInstocks = inStockCodes.filter(item => {
                    return !itemArr.some(bs => bs.inStockCode === item.id)
                  })
                  const find = inStockCodes.find(item => item.id === child.inStockCode)
                  if (find) newInstocks.push(find)
                  this.$set(child, 'inStockCodes', newInstocks)
                  this.$set(child, 'oldInStockCodes', JSON.parse(JSON.stringify(inStockCodes)))
                }
              })
            } else {
              let stockCode = {}
              // 如果采购入库单列表只有一条数据 默认选中
              if (inStockCodes.length === 1) {
                stockCode = Object.assign({}, inStockCodes[0])
                stockCode.inStockCode = stockCode.id
                delete stockCode.id
              }
              this.obj.items[lastIndex] = Object.assign(this.obj.items[lastIndex], data, {oldInStockCodes: JSON.parse(JSON.stringify(inStockCodes)), inStockCodes, stockUsableNum: num}, stockCode)
            }
          }
        } else {
          this.obj.items.splice(lastIndex, 1, Object.assign({}, defaultItem))
          this.$nextTick(_ => {
            if (this.$refs.materselect) {
              this.$refs.materselect.select = ''
            }
          })
          return this.everWarning('该物资的库存信息为空')
        }
      })
    },
    // 暂存的时候点击批号或者采购入库单下拉框查询物资信息
    visibleChange (row, index) {
      if ((row.isExpiryDate && !row.batchNumList) || (!row.isExpiryDate && !row.inStockCodes)) {
        this.setItemData(row, index)
      }
    },
    // 验证当前物资列表数据是否可以提交
    checkSubmitData () {
      return this.obj.items.some(item => {
        return (item.localMaterialId && ((item.isExpiryDate && !item.batchNum) || !item.inStockCode || !item.num || item.inputError))
      })
    },
    // 提交采购退货单
    submitBackCode (status) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (this.checkSubmitData()) return this.everWarning('请先完善当前物资列表数据')
          let params = Object.assign({items: []}, this.obj, {totalPrice: 0, storageRoomId: this.storageId, status})
          // 简化提交的数据
          params.items = this.obj.items.filter(item => item.localMaterialId).map(item => {
            const {localMaterialId, isExpiryDate, num, sysBatchId, materialSkuId, supplyMode, produceDate, validityDate, unitId, price, totalPrice, batchNum, inStockCode, sysBatchCode, salePrice} = item
            params.totalPrice = floatTool.add(totalPrice, params.totalPrice)
            return Object.assign({
              localMaterialId,
              num,
              materialSkuId,
              materialType: item.classifyId,
              sysBatchId,
              unitId,
              price,
              isExpiryDate,
              supplyMode,
              totalPrice,
              salePrice,
              sysBatchCode,
              inStockCode: inStockCode.id ? inStockCode.id : inStockCode
            }, item.isExpiryDate ? {batchNum: batchNum.id ? batchNum.id : item.batchNum, produceDate, validityDate} : {})
          })
          params.totalPrice = this.totalPrice
          params.pricingModel = this.isBatch
          this.btnLoading = true
          api.createOrUpdate(params).then(res => {
            if (res && !res.message && res.id) {
              this.everSuccess(`${status === 72 ? '提交' : '保存'}成功`)
              if (status === 72) {
                this.$router.push(`/storages/business/returnbusinessee/${res.id}`)
              } else {
                this.objId = res.id
                this.obj.status = res.status
                this.obj.id = res.id
                this.obj.code = res.code
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
                      let batchNum = typeof child.batchNum === 'object' ? child.batchNum.id : child.batchNum
                      if (child.localMaterialId === item.localMaterialId && batchNum === item.batchNum) {
                        child.inputError = true
                      }
                    })
                  } else if (item.type === 3) {
                    this.obj.items.forEach(child => {
                      let batchNum = typeof child.batchNum === 'object' ? child.batchNum.id : child.batchNum
                      if (child.localMaterialId === item.localMaterialId && batchNum === item.batchNum && child.inStockCode === item.inStockCode) {
                        child.stockSysBatchUsableNum = item.num
                        child.inputError = true
                      }
                    })
                  }
                })
                this.obj.items = JSON.parse(JSON.stringify(this.obj.items))
                this.$confirm(res.message, '提示', {dangerouslyUseHTMLString: true}).then(_ => {
                })
              }
            }
            this.btnLoading = false
          })
        }
      })
    },
    // 获取采购退货单详情
    getDetails () {
      api.getById({id: this.objId}).then(res => {
        if (res) {
          if (res.items && res.items.length === 1) res.items.push(Object.assign({}, defaultItem))
          this.obj = res
          this.obj.items.forEach(child => {
            if (child.num > child.stockSysBatchUsableNum || child.num > child.stockUsableNum) {
              child.inputError = true
            }
          })
          this.oldSupplierlocalId = res.supplierLocalId
        }
      })
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
    'obj.items': {
      handler (v) {
        this.btnDisabled = (v.length === 1 && !v[0].localMaterialId) || (v.every(item => item.localMaterialId && ((item.isExpiryDate && !item.batchNum) || !item.inStockCode || !item.num)))
        this.totalPrice = 0
        v.forEach(item => {
          if (item.localMaterialId) {
            const totalPrice = this.$filters.formatToFinacial(item.totalPrice, 4)
            this.totalPrice = floatTool.add(totalPrice, this.totalPrice)
          }
        })
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.backsss {
  /deep/ .inputerror .el-input__inner {
    border: 1px solid #ff0000;
  }
}
.totalprice {
  text-align: right;
  line-height: 40px;
  font-weight: bold;
  font-size: 16px;
}
</style>

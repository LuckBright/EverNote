<template>
  <div>
    <ever-bread-crumb name="采购入库" :showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4 class="pos_re">填写基础信息</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          class="from"
          ref="form"
          :span="12"
          :rules="rules"
          :nosubmit="true">
            <template slot="description">
              <ever-select
                v-model="obj.description"
                :options="descriptionArr"
                :clearable="true"
                :needObjFlag="true"
                placeholder="合同选择"
                @change="descriptionChange"
                @clear="descriptionClear">
              </ever-select>
            </template>
        </ever-form2>
        <h4>添加物资</h4>
        <div class="listinfo" v-for="(list, i) in obj.purchaseAcceptanceItemList" :key="i">
          <entry-table
          :supplierLocalId="obj.supplierLocalId"
          ref="entryTable"
          :parentData="obj.purchaseAcceptanceItemList"
          :key="i"
          :is-batch="isBatch"
          :list="list"
          :status="status"
          :invoiceNos="invoiceNos"
          :description="obj.description || defaultContrct"
          :queryParams="queryParams"
          :tableCode="tableCode"
          @updataList="updataList"
          @deleteListItem="deleteListItem"
          :itemKey="i">
          </entry-table>
        </div>
      </div>
      <div class="addlist">
        <el-button
          v-if="!submitBtnDisabled"
          @click="handleAddInvoice()"
          type="text"
          icon="icon iconfont icon-tianjia"
        >添加发票</el-button>
        <span class="fr">
          入库总金额：{{totalPrice | formatToFinacial(4)}}
        </span>
      </div>
      <div class="footer">
        <el-button type="primary"
          :disabled="submitBtnDisabled"
          class="w_100"
          @click="submitForm('form', examine ? 100 : 11)" :loading="unRepeatedBtn">提交</el-button>
        <el-button type="primary"
          class="w_60"
          :disabled="submitBtnDisabled"
          @click="submitForm('form', 9)" :loading="unRepeatedBtn">暂存</el-button>
          <el-button @click="retrunParve" class="w_60">返回</el-button>
      </div>
    </div>
    <!-- 发票号重复提示 -->
    <el-dialog title="提示" :visible.sync="errorInvoiceVisible" width="350px">
      <div class="invocielist">
        <div v-html="errorInvoiceHtml"></div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button size="small" @click="errorInvoiceVisible = !errorInvoiceVisible" type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '../store/enterapi'
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
import contrctApi from '@/warehouse/page/purchease/contract/api/contrct'
import { floatTool, debounce, patch, PACKAGE_CODE } from '@/util/common'
import setName from '@/util/setstatusname'
import sysvalue from '@/warehouse/store/sysvalueapi'
import componentsApi from '../store/componentsapi'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import addProduct from '@/warehouse/page/components/addproduct'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import entryTable from './entry.table'
import entryCheck from './entrycheck.js'
import { BUSINESS_TYPE_COLLECT } from '@/warehouse/views/util/constant.js'
import accessStorageMixins from '@/warehouse/page/storages/mixins/accessstorage.mixins.js' // 出入库审核系列操作
import storage from '@/util/storage'

let schema = [
  {
    name: 'supplierLocalId',
    label: '供应商',
    comp: 'ever-remoteMethod',
    labelWidth: '52px',
    props: {
      api: supplierLocalApi,
      showName: 'supplierObject',
      initoptions: [],
      disabled: false,
      isSilentQuery: true
    },
    span: 6
  },
  {
    name: 'description',
    label: '合同',
    comp: 'custom',
    span: 6,
    labelWidth: '38px',
    style: 'width: 100%'
  },
  {
    name: 'remarks',
    label: '备注',
    span: 6,
    labelWidth: '38px',
    props: {
      maxlength: 100
    }
  }
]
let tableCode = {
  localMaterialId: '',
  name: '',
  iname: '',
  price: undefined,
  oldPrice: '',
  num: '',
  totalPrice: '',
  showTotalPrice: '',
  batchNum: '',
  isExpiryDate: '',
  produceDate: '',
  unitId: '',
  salePrice: '',
  serviceId: '',
  validityDate: ''
}
export default {
  mixins: [setName, getstorage, entryCheck, accessStorageMixins, storage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.purchaseAcceptanceItemList = [{ invoiceStatus: 0, invoiceNo: '', item: [] }]
    return {
      schema,
      obj,
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
      newObj: null,
      PACKAGE_CODE,
      api,
      contrctApi,
      supplierLocalApi,
      tableCode,
      DRAFTP: false,
      errorInvoiceVisible: false,
      errorInvoiceHtml: '',
      objId: this.$route.params.id,
      dosageFormArr: [],
      temSupplierLocalId: '',
      queryParams: { offset: 0, pagesize: 20, storageRoomId: '', splitFlag: 0, state: 0, isNeedFreightCode: true, isNeedSalePrice: true },
      rules: {
        supplierLocalId: { required: true, message: '必填项', trigger: 'change' }
      },
      isCancel: false,
      submitBtnDisabled: true,
      currentRows: 0,
      dialogBtn: '',
      dialogTitle: '',
      dialogContent: '',
      dialogFunction: '',
      dialogCanclFun: '',
      changeSupplierLocalId: [],
      invoiceNos: [],
      descriptionArr: [],
      flag: true,
      cachePrice: '',
      warehousingType: '',
      unRepeatedBtn: false, // 控制重复提交
      totalPrice: 0,
      status: 9,
      examine: false,
      defaultContrct: null,
      switchSelect: false,
      laisd: false,
      oldDescription: null
    }
  },
  created () {
    this.getDetail()
    this._info()
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    getExamine () {
      if (this.$route.name === 'entryadd') this.warehousingType = '10'
      let type = BUSINESS_TYPE_COLLECT.find(type => { return type.id === this.warehousingType })
      if (type) {
        let settingItemLimits = this.processConfig.storageroomSystemConfig && this.processConfig.storageroomSystemConfig.settingItemLimits || []
        settingItemLimits.length && settingItemLimits.forEach(item => {
          if (`${item.orderType}` === type.examine) {
            this.examine = !item.status
          }
        })
      }
    },
    retrunParve () {
      let len = this.obj.purchaseAcceptanceItemList
      if (len.length && len[0].item.length) {
        this.$confirm('您填写的内容尚未提交，是否要离开页面？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.go(-1)
        })
      } else {
        this.$router.go(-1)
      }
    },
    // 清除合同
    descriptionClear (v, index) {
      let len = this.obj.purchaseAcceptanceItemList
      if (len.length > 2 || (len[0].item.length && len[0].item[0].localMaterialId)) {
        this.$confirm('清除合同将清除已添加的数据，是否继续操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._setList(true)
          this.oldDescription = null
        }).catch(() => {
          this.obj.description = this.oldDescription
        })
      }
    },
    // 切换合同
    descriptionChange (v, index) {
      if (this.oldDescription && v.id === this.oldDescription.id) return
      let len = this.obj.purchaseAcceptanceItemList
      if (len.length > 2 || (len[0].item.length && len[0].item[0].localMaterialId)) {
        this.domBlur()
        this.$confirm('切换合同将清除已添加的数据，是否继续操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.oldDescription = v
          this.domBlur()
          this._setList(true, true)
        }).catch(() => {
          this.obj.description = this.oldDescription
        })
      } else {
        this.oldDescription = v
      }
    },
    updataList (data, key) {
      this.$set(this.obj.purchaseAcceptanceItemList, key, data)
    },
    // 删除发票及物资
    deleteListItem (i) {
      this.$confirm('删除后发票及物资内容将无法恢复，是否继续删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.obj.purchaseAcceptanceItemList.splice(i, 1)
        if (!this.obj.purchaseAcceptanceItemList.length) {
          this.obj.purchaseAcceptanceItemList = [{ invoiceStatus: 0, invoiceNo: '', item: [] }]
          this._setList(true)
        }
      })
    },
    getDetail () {
      if (this.$route.params.id) {
        this.api.getById(this.$route.params.id).then(res => {
          this.handleSetObject(res)
        })
      }
      this.getExamine()
    },
    async handleSetObject (res) {
      this.newObj = res
      this.warehousingType = res.type
      let newObj = JSON.parse(JSON.stringify(res))
      if (newObj && newObj.id) {
        let obj = {}
        let batchNumArr = []
        newObj.inStockItemList.forEach(item => {
          item.invoiceNo = item.invoiceNo.trim()
          if (item.item[0].invoiceStatus !== '1') {
            item.invoiceStatus = Number(item.item[0].invoiceStatus)
          } else {
            item.invoiceStatus = 0
          }
          obj.contractId = item.item[0].contractId
          // 给同一物资最后一个批号添加  添加批次按钮
          this.handlerMark(item.item)
          // 最后一行添加搜索框
          let temCode = JSON.parse(JSON.stringify(this.tableCode))
          for (let key in temCode) {
            temCode[key] = ''
          }
          item.item.push(JSON.parse(JSON.stringify(temCode)))
          // 选出所有的物资ID和批次  然后去系统批次中查询
          item.item.forEach(child => {
            if (child.localMaterialId) {
              batchNumArr.push({localMaterialId: child.localMaterialId, batchNum: child.batchNum})
              if (this.isBatch) {
                child.markupPercentage = (!newObj.isStaging ? child.markupPercentage : child.bonusRate) || 0
                child.ceilingPrice = (!newObj.isStaging ? child.highestCeilingPrice : child.ceilingPrice) || 0
              }
            }
          })
        })
        obj.purchaseAcceptanceItemList = newObj.inStockItemList
        obj.supplierLocalId = newObj.supplierLocalId
        obj.totalPrice = newObj.totalPrice
        obj.remarks = newObj.description
        // 查询当前单据中的物资批次是否存在系统物资批次中
        await this.api.judgeBatchNumIsExist(batchNumArr).then(res => {
          if (res && res.length) {
            res.forEach(item => {
              newObj.inStockItemList.forEach(child => {
                let findObj = child.item.find(pData => pData.localMaterialId === item.localMaterialId && pData.batchNum === item.batchNum && item.isExist)
                if (findObj) findObj.isbatch = true
              })
            })
          }
          this.obj = Object.assign({}, this.obj, obj)
          this.laisd = true
        })
      }
    },
    handlerMark (list) {
      let localId = []
      list.forEach((child, index) => {
        if (!localId.includes(child.localMaterialId)) {
          localId.push(child.localMaterialId)
          let indexs = []
          list.forEach((item, index) => {
            if (item.localMaterialId === child.localMaterialId) {
              indexs.push(index)
            }
          })
          if (indexs.length) {
            list[indexs[indexs.length - 1]].mark = 1
          }
        }
      })
    },
    handleDeleteInvoice (i) {
      this.currentRows = i
      this.$refs.dialogInvoice.open()
    },
    confirm () {
      this.obj.purchaseAcceptanceItemList.splice(this.currentRows, 1)
    },
    domBlur () {
      this.$nextTick(_ => {
        let dom = document.querySelectorAll('.el-form .el-input__inner')
        if (dom && dom.length) dom.forEach(item => { item.blur() })
      })
    },
    // 提交参数处理
    hanlderParamsData (status) {
      let description = this.obj.description || this.defaultContrct
      // 处理入库总价
      let newTotalPrice = this.$filters.formatToFinacial(this.totalPrice, 4)
      if (newTotalPrice.indexOf(',') > -1) {
        newTotalPrice = parseFloat(newTotalPrice.split(',').join(''))
      } else {
        newTotalPrice = parseFloat(newTotalPrice)
      }
      let params = {
        inStockItemList: [],
        status: status,
        totalPrice: newTotalPrice,
        supplyMode: description.purchaseSaleType,
        storageRoomId: this.storageId,
        supplierLocalId: this.obj.supplierLocalId,
        description: this.obj.remarks
      }
      if (this.objId) params.id = this.objId
      if (this.newObj && this.newObj.type) params.type = this.newObj.type
      let listObj = JSON.parse(JSON.stringify(this.obj.purchaseAcceptanceItemList))
      listObj.forEach((list, index) => {
        list.item.forEach((item, itemIndex) => {
          if (item.localMaterialId) {
            Object.assign(item, {
              expectNum: item.num,
              materialType: item.classifyId,
              supplyMode: description.purchaseSaleType,
              contractId: description.id,
              storageRoomId: this.storageId,
              supplierLocalId: this.obj.supplierLocalId,
              unitId: item.unitId,
            }, description.purchaseSaleType === 1 ? { invoiceStatus: list.invoiceStatus ? list.invoiceStatus : 1, invoiceNo: list.invoiceNo } : {})
            if (this.isBatch) {
              item.bonusRate = item.markupPercentage
              item.priceList = item.priceList ? item.priceList : item.serviceId ? [{ price: item.salePrice, scene: 'base' }] : []
            }
            delete item.markupPercentage
            delete item.addData
            delete item.showTotalPrice
            delete item.iname
            delete item.totalPrice
            params.inStockItemList.push(item)
          }
        })
      })
      return params
    },
    //  submit提交
    submitForm: debounce(function (form, status, refresh) {
      this.$refs.form.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.cheListData()) {
            return this.$messageTips(this, 'warning', '入库单中还有未完善的信息，请先完善信息再提交')
          }
          const checkObj = this.obj.purchaseAcceptanceItemList.filter(item => item.invoiceStatus === 0 && item.item[0].localMaterialId)
          const findObj = this.obj.purchaseAcceptanceItemList.find(item => item.invoiceStatus === 0 && item.invoiceNo)
          if (checkObj.length > 1 || findObj) return this.$messageTips(this, 'warning', '请先填写并保存发票号')
          // 验证发票号是否有重复
          if (this.invoiceNos.length) {
            const res = await componentsApi.getBillNum({ invoiceNos: this.invoiceNos }).then(res => {
              return res
            })
            if (res.length) {
              let html = ''
              res.forEach(item => {
                html += '发票' + item + '与系统中已存在发票重复<br>'
              })
              this.errorInvoiceVisible = true
              this.errorInvoiceHtml = html
              return false
            }
          }
          if (status === 11 && !this.obj.description) {
            this.domBlur()
            this.$confirm('没有选择合同，将按照无合同购销方式提交，是否确认提交？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.confirmPop(status)
            })
          } else {
            this.confirmPop(status)
          }
        }
      })
    }, 200),
    confirmPop (status) {
      this.unRepeatedBtn = true
      this.api[this.objId ? 'purchase' : 'createNew'](this.hanlderParamsData(status)).then(res => {
        if (res.flag) {
          this.unRepeatedBtn = false
          if (status === 9) {
            if (this.objId) {
              this.getDetail()
            } else {
              this.$router.replace(`/storages/entry/entryadd/${res.id}`)
              this.objId = res.id
              this.getDetail()
            }
            this.$messageTips(this, 'success', '保存成功。')
          } else {
            if (res.id || this.objId) this.$router.replace(`/storages/entry/purchaseentry/${res.id || this.objId}`)
          }
        }
      })
    },
    handleAddInvoice () {
      // const checkObj = this.obj.purchaseAcceptanceItemList.find(item => item.invoiceStatus === 0)
      // if (checkObj) return this.$messageTips(this, 'warning', '请先填写并保存发票号')
      this.obj.purchaseAcceptanceItemList.push({ invoiceStatus: 0, invoiceNo: '', item: [JSON.parse(JSON.stringify(this.tableCode))] })
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    // 获取合同
    getContrctList (flag) {
      if (flag) {
        this.contrctApi.queryList({ supplierLocalId: this.obj.supplierLocalId, isDefault: 1, offset: 0, pagesize: 999 }).then(res => {
          if (res && res.length) {
            this.descriptionArr = JSON.parse(JSON.stringify(res)).filter(item => {
              // item.name = item.purchaseSaleType === 1 ? '（购销）' + item.name : '（代销）' + item.name
              return item.status === 1
            })
            this.defaultContrct = JSON.parse(JSON.stringify(res)).filter(item => item.status === 5)[0]
            this.queryParams.supplyMode = this.defaultContrct.purchaseSaleType
            this.queryParams.contractId = this.defaultContrct.id
            if (!this.defaultContrct || this.obj.contractId !== this.defaultContrct.id) {
              this.obj.description = res.find(item => item.id === this.obj.contractId)
            }
          } else {
            this.descriptionArr = []
            this.defaultContrct = null
            this.queryParams.supplyMode = ''
            this.queryParams.contractId = ''
            this.obj.description = {}
          }
        })
      } else {
        this.obj.description = ''
        this.defaultContrct = null
        this.queryParams.supplyMode = ''
        this.queryParams.contractId = ''
        this.descriptionArr = []
      }
    },
    _info () {
      this.queryParams.storageRoomId = this.obj.storageRoomId = this.storageId
    },
    _setList (flag, chex) {
      if (flag) {
        this.obj.purchaseAcceptanceItemList = [{ invoiceStatus: 0, invoiceNo: '', item: [this.tableCode] }]
      } else {
        this.obj.purchaseAcceptanceItemList = [{ item: [] }]
      }
      this.$nextTick(_ => {
        if (this.$refs.entryTable[0].$refs.remoteselect) this.$refs.entryTable[0].$refs.remoteselect.select = ''
      })
      this.obj = Object.assign(JSON.parse(JSON.stringify(this.obj)), !chex ? {description: ''} : {})
    },
    // 计算入库总金额
    countTotal (v) {
      let count = 0
      v.length && v.forEach(item => {
        let newObj = JSON.parse(JSON.stringify(item.item))
        count += this.calcTotalPrice(newObj, 'showTotalPrice')
      })
      this.totalPrice = !isNaN(count) ? count : 0.00
      // 提交按钮是否可以提交
      if (Array.isArray(v) && v[0].item.length) {
        const { localMaterialId, batchNum, produceDate, validityDate, num, price } = v[0].item[0]
        // const invoiceStatus = v[0].invoiceStatus === 1 || v[0].invoiceStatus === 3 // 是否选了发票
        // const purchaseSaleType = (this.obj.description && this.obj.description.purchaseSaleType === 2) // 是否是代销
        if (localMaterialId && num && price >= 0) {
          if (v[0].item[0].isExpiryDate === 0) { // 不是有效期管理
            this.submitBtnDisabled = false
          } else { // 有效期管理
            if (batchNum && produceDate && validityDate) {
              this.submitBtnDisabled = false
            }
          }
        } else {
          this.submitBtnDisabled = true
        }
      }
    },
    // 计算发票总金额
    calcTotalPrice (data, price) {
      let totalPrice = 0
      let ids = []
      for (let i = 0; i < data.length; i++) {
        if (!ids.includes(data[i].localMaterialId) && data[i][price]) {
          totalPrice = floatTool.add(data[i][price] || 0, totalPrice)
          ids.push(data[i].localMaterialId)
        }
      }
      return !isNaN(totalPrice) ? totalPrice : 0.00
    },
    // 发票集合
    handlerInvoiceNos (data) {
      let invoiceNos = []
      data.forEach(item => {
        if (item.invoiceNo && item.invoiceStatus === 3) invoiceNos.push(item.invoiceNo)
      })
      this.invoiceNos = invoiceNos
    },
    handlerSwithchObj (val, oldval, stat) {
      if (this.objId && this.laisd) {
        this.laisd = false
        this.getContrctList(true)
        return
      }
      let len = this.obj.purchaseAcceptanceItemList
      if (len.length > 2 || (len[0].item.length && len[0].item[0].localMaterialId)) {
        if (!this.switchSelect) {
          this.domBlur()
          this.$confirm('单据中已经添加物资，如需修改供应商、合同，将自动清空已添加的物资', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.switchSelect = false
            if (val) {
              this._setList(true)
              this.getContrctList(true)
            } else {
              this._setList(false)
              this.getContrctList(false)
            }
          }).catch(() => {
            this.switchSelect = true
            this.obj.supplierLocalId = oldval
          })
        } else {
          this.switchSelect = false
        }
      } else {
        if (val) {
          this._setList(true)
          this.getContrctList(true)
        } else {
          this._setList(false)
          this.getContrctList(false)
        }
      }
    },
    ...patch
  },
  watch: {
    // 计算总价
    'obj.purchaseAcceptanceItemList': {
      handler (v) {
        this.countTotal(v)
        this.handlerInvoiceNos(v)
      },
      deep: true
    },
    // 供应商选择
    'obj.supplierLocalId' (val, oldval) {
      this.queryParams.supplierLocalId = val
      this.handlerSwithchObj(val, oldval, 'supplierLocalId')
    },
    'obj.description': {
      handler (v, oldv) {
        if (v) {
          this.queryParams.supplyMode = v.purchaseSaleType
          this.queryParams.contractId = v.id
        } else {
          this.queryParams.supplyMode = this.defaultContrct && this.defaultContrct.purchaseSaleType
          this.queryParams.contractId = this.defaultContrct && this.defaultContrct.id
        }
      },
      deep: true
    }
  },
  components: {
    addProduct,
    tipDialog,
    entryTable
  }
}
</script>
<style lang="scss" scoped>
.layout_box .panel .panel-body {
  padding: 20px;
}
.from /deep/ .el-form-item {
  margin-left: 30px;
}
.listinfo{
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 30px;
  .invoice{
    margin-top: 0;
  }
}
.invocielist{
  div{
    line-height: 30px;
  }
}
.addlist{
  padding: 10px;
  padding-top: 0;
}
.footer {
  padding-bottom: 20px;
}
</style>

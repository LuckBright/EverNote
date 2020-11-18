<template>
  <div id="product">
    <div class="product">
      <el-row>
        <el-col :span="14" class="product-col">
          <!-- 发票编码 -->
          <div class="invoice" v-if="flag">
            <el-form :inline="true" class="demo-form-inline" onsubmit="return false;" v-if="!flags" size="small">
              <el-form-item label="发票编号：" ref="invoiceTitle">
                <el-input
                   v-if="invoiceStatus === 0"
                  placeholder="请输入发票号"
                  v-model="invoiceNo"
                  clearable>
                </el-input>
                <span v-if="invoiceStatus === 1">发票未到</span>
                <span v-if="invoiceStatus === 2">发票随货</span>
                <span v-if="invoiceStatus === 3">{{invoiceNo}}</span>
              </el-form-item>
              <el-form-item style="width: 200px;">
                <div v-if="invoiceStatus === 0">
                  <el-button type="text" @click="handleSaveInvoice(invoiceNo)">保存</el-button>
                  <el-button type="text" @click="handleNoInvoice(1)">发票未到</el-button>
                  <el-button type="text" @click="handleNoInvoice(2)">发票随货</el-button>
                </div>
                <div v-if="invoiceStatus !== 0">
                  <el-button type="text" @click="handleAddNewInvoice(invoiceNo)">修改</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <!-- 查询商品 -->
          <div class="remoteselect">
            <remote-select v-if="queryParams.materialType == DRUGTYPE" showName='drugObject' ref="remoteselect" :disabled="!flag" :queryParams="queryParams" apiName="purchaseList" :api="getMaterialInfoApi" @selectSave="handleSelect" :value="goodName" v-model="goodName" :index='1' :index2="2" :islocal="true"></remote-select>
            <remote-select v-if="queryParams.materialType == MATERIALTYPE" showName='consumptiveMaterialObject' ref="remoteselect" :disabled="!flag" :queryParams="queryParams" apiName="purchaseList" :api="getMaterialInfoApi" @selectSave="handleSelect" :value="goodName" :index='1' :index2="2" :islocal="true"></remote-select>
            <remote-select v-if="queryParams.materialType == EQUIPMENTTYPE" showName='equipmentObject' ref="remoteselect" :disabled="!flag" :queryParams="queryParams" apiName="purchaseList" :api="getMaterialInfoApi" @selectSave="handleSelect" :value="goodName" :index='1' :index2="2" :islocal="true"></remote-select>
          </div>
          <el-form v-if="flag && invoiceStatus !== 0" :inline="true" onsubmit="return false;" label-position="right" label-width="90px" :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-row class="list-el-row">
              <el-col :span="24">
                <el-form-item label="采购单价:" v-if="isGood && remoteSelectId" prop="price">
                  <el-input-number
                    size="small"
                    style="width: 150px"
                    placeholder="采购单价"
                    :precision="4"
                    :controls="false"
                    v-model="ruleForm.price">
                  </el-input-number>
                  <span>元/<span v-if="ruleForm.localSettingObject">
                    <wh-single-code-to-name
                    :isExt="true"
                    :patchObj="{
                      list: ruleForm.localSettingObject.materialSkuObject.ext,
                      code: PACKAGE_CODE
                    }">
                  </wh-single-code-to-name>
                  </span></span>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation')">
                <el-form-item label="货位号:" v-if="isGood && remoteSelectId && objId">
                  <span>{{ruleForm.freight && ruleForm.freight.code ? ruleForm.freight.code : '无货位号'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="list-el-row" v-if="isGood && ((isExpiryDate && isManageAlone) || (isExpiryDate && !isManageAlone)) && remoteSelectId">
              <el-col :span="24">
                <el-form-item label="生产批号:" prop="batchNum">
                  <el-input
                    size="small"
                    class="batch-number"
                    placeholder="生产批号"
                    @input="handlerBatchNum(ruleForm)"
                    v-model="ruleForm.batchNum"
                    @blur="handleCheckBtach">
                  </el-input>
                </el-form-item>
                <el-form-item label=" " prop="produceDate" class="noStar batch-number">
                  <date-picker
                    size="small"
                    v-model="ruleForm.produceDate"
                    align="right"
                    type="date"
                    :disabled="ruleForm.isbatch && ruleForm.isbatch ? true : false"
                    @change="handleCheckBtach"
                    placeholder="生产日期"
                    :outformat="'yyyy-MM-dd'">
                  </date-picker>
                </el-form-item>
                <el-form-item label=" " prop="validityDate" class="noStar batch-number">
                  <date-picker
                    size="small"
                    v-model="ruleForm.validityDate"
                    @change="handleCheckBtach"
                    align="right"
                    :disabled="ruleForm.isbatch && ruleForm.isbatch ? true : false"
                    type="date"
                    placeholder="到期日期"
                    :outformat="'yyyy-MM-dd'">
                  </date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="list-el-row" v-if="isGood && ((!isManageAlone && isExpiryDate) || (!isManageAlone && !isExpiryDate)) && remoteSelectId">
              <el-col :span="24">
                <el-form-item label="入库数量:" prop="num">
                  <el-input
                    size="small"
                    placeholder="入库数量"
                    type="number"
                    v-model="ruleForm.num"
                    clearable>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="list-el-row" v-if="isGood && isManageAlone && remoteSelectId">
              <el-col :span="24">
                <el-form-item label="绑定编码:">
                  <ever-select size="small" v-model="isCode" :options="options"></ever-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="list-el-row" v-if="isGood && isManageAlone && remoteSelectId">
              <el-col :span="24">
                <el-form-item label="扫唯一码:" v-ever-bind-enter="{cycle: true}">
                  <el-input
                    size="small"
                    :class="{'width1': ownUniqueCodes}"
                    class="own"
                    placeholder="唯一码"
                    v-model="ruleForm.uniqueCode"
                    @keyup.enter.native="handleEnterAddUniqueCode"
                    clearable>
                  </el-input>
                  <el-input
                    size="small"
                    v-if="ownUniqueCodes"
                    class="width1 good"
                    placeholder="商品自带编码"
                    @keyup.enter.native="handleEnterAddUniqueCode"
                    v-model="ruleForm.ownUniqueCodes"
                    clearable>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="list-el-row">
              <el-col :span="24">
                <el-form-item label=" ">
                  <el-button size="small" type="primary" :disabled="!isGood" @click="submitForm('ruleForm')">添加入库商品</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form style="margin-top: 50px;" v-else :inline="true" onsubmit="return false;" label-position="right" label-width="90px" :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-row class="list-el-row">
              <el-col :span="24">
                <el-form-item label=" ">
                  <el-button size="small" type="primary" @click="submitForm('ruleForm')" disabled>添加入库商品</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <!-- 扫描结果 -->
        <el-col :span="10" class="product-col">
          <div class="rightHeader" v-if="flag">
            <!-- {{clear}} -->
          </div>
          <div class="rightBody" v-if="inStockItemDetailStockContainerList.length">
            <h5>已扫描商品 {{inStockItemDetailStockContainerList.length}} 个</h5>
            <ul class="list" :style="((isExpiryDate && isManageAlone) || (isExpiryDate && !isManageAlone) || (!isExpiryDate && !isManageAlone)) && isManageAlone ? 'height: 280px' : ''">
              <li v-for="(code, index) in inStockItemDetailStockContainerList" :key="index"><span>{{code.uniqueCode}}</span><span>{{code.ownUniqueCodes}}</span><el-button type="text" class="red" @click="handleDeleteRow(index)">删除</el-button></li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>
<script>
import remoteSelect from '../joinstorage/remoteselect'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import uniqueCodeApi from '@/warehouse/page/storages/store/uniquecodeapi'
import componentsApi from '@/warehouse/page/storages/store/componentsapi'
import inventoryQueryApi from '@/warehouse/store/inventoryqueryapi'
import api from '@/warehouse/page/storages/store/enterapi.js'
import { floatTool, DRUGTYPE, MATERIALTYPE, EQUIPMENTTYPE, patch, PACKAGE_CODE } from '@/util/common'
// import addProductMethods from '@/warehouse/page/storages/util/addproduct'
let options = [
  { id: 1, name: '不绑定商品自带编码' },
  { id: 2, name: '绑定商品自带编码' }
]
export default {
  // mixins: [addProductMethods],
  name: 'product',
  props: ['queryParams', 'flag', 'list', 'id', 'clear', 'flags', 'orderType', 'billCode'],
  data () {
    return {
      ruleForm: {
        id: '',
        unitId: '',
        batchNum: '',
        num: '',
        ownUniqueCodes: '',
        uniqueCode: '',
        produceDate: '',
        price: '',
        totalPrice: '',
        validityDate: '',
        freight: {}
      },
      api,
      PACKAGE_CODE,
      ownUniqueCodes: false,
      isExpiryDate: 0,
      isManageAlone: 0,
      isCode: 1,
      inStockItemDetailStockContainerList: [
        // {uniqueCode: 1, ownUniqueCodes: 3}
      ],
      objId: this.$route.params.id,
      invoiceStatus: 0,
      invoiceNo: '',
      goodName: '',
      isGood: false,
      options,
      getMaterialInfoApi,
      rules: {
        price: { required: true, message: '请填写采购价后再添加', trigger: 'blur' },
        batchNum: { required: true, message: '请填写生产批号后再添加', trigger: 'blur' },
        produceDate: { required: true, message: '请填写生产日期后再添加', trigger: ['blur'] },
        validityDate: { required: true, message: '请填写有效期后再添加', trigger: ['blur'] },
        num: { required: true, message: '请填写入库数量后再添加', trigger: 'blur' }
      },
      remoteSelectId: '',
      DRUGTYPE,
      MATERIALTYPE,
      EQUIPMENTTYPE,
    }
  },
  methods: {
    handlerBatchNum (v) {
      if (v && v.batchNum && v.localMaterialId) {
        api.getStockBatchNum({ localMaterialId: v.localMaterialId, batchNum: v.batchNum }).then(res => {
          if (res && res.length) {
            v.validityDate = res[0].validityDate
            v.produceDate = res[0].produceDate
            v.isbatch = true
          } else {
            v.validityDate = ''
            v.produceDate = ''
            v.isbatch = false
          }
        })
      }
    },
    handleCheckBtach () {
      if (this.ruleForm.batchNum && this.ruleForm.produceDate && this.ruleForm.validityDate) {
        let params = {
          localMaterialId: this.ruleForm.localMaterialId,
          batchNum: this.ruleForm.batchNum,
          produceDate: this.ruleForm.produceDate,
          validityDate: this.ruleForm.validityDate
        }
        inventoryQueryApi.checkBatch(params).then(res => {
          if (!res) {
            this.$messageTips(this, 'warning', '您输入的该商品批号信息和已有的该商品批号信息不一致，请核实后在输入')
            this.ruleForm.batchNum = ''
            this.ruleForm.produceDate = ''
            this.ruleForm.validityDate = ''
          }
        })
      }
    },
    handleSelect (data) {
      if (this.invoiceStatus === 0) {
        this.$messageTips(this, 'warning', '发票编号不能为空，请录入发票编号')
        this._resetFrom()
        return
      }
      data && data.id ? this.isGood = true : this.isGood = false
      if (data.enableDate) data.enableDate = ''
      if (data.disableDate) data.disableDate = ''
      this.inStockItemDetailStockContainerList = []
      if (data.localSettingObject) {
        this.isExpiryDate = data.localSettingObject.isExpiryDate
        this.isManageAlone = data.localSettingObject.isManageAlone
      }
      for (let item in this.ruleForm) {
        this.ruleForm[item] = data[item] || ''
      }
      this.remoteSelectId = data.id
      Object.assign(this.ruleForm, data)
    },
    handleDeleteRow (index) {
      this.inStockItemDetailStockContainerList.splice(index, 1)
    },
    handleNoInvoice (status) {
      this.invoiceStatus = status
      this.invoiceNo = ''
    },
    handleAddNewInvoice () {
      this.invoiceStatus = 0
      this.invoiceNo = ''
    },
    handleSaveInvoice (val) {
      if (val === '') {
        this.$messageTips(this, 'warning', '发票编号不能为空，请录入发票编号')
        return
      }
      if (val) {
        let params = {
          billNum: val
        }
        if (!this.objId && this.id) {
          params = {
            id: this.id,
            billNum: val
          }
        }
        componentsApi.getBillNum(params).then(res => {
          if (res === -1) {
            this.invoiceStatus = 3
          } else {
            this.$messageTips(this, 'warning', '您提交的发票号已经存在，请检查后重新录入')
          }
        })
      }
    },
    handleEnterAddUniqueCode (e) {
      if (this.isExpiryDate && (!this.ruleForm.batchNum || !this.ruleForm.produceDate || !this.ruleForm.validityDate)) {
        this.$messageTips(this, 'warning', '该商品为效期管理和唯一码管理，请先填写批号、生产日期和有效期')
        return
      }
      if (this.ruleForm.uniqueCode === '') {
        this.$messageTips(this, 'warning', '唯一码不能为空，请重新核对')
        this._getFocus('.own')
        return
      }
      if (this.isCode === 2 && this.ruleForm.ownUniqueCodes === '' && e.target.placeholder === '唯一码') {
        this.$messageTips(this, 'warning', '商品编码不能为空，请重新核对')
        this._getFocus('.good')
        return
      }
      if (this.ruleForm.ownUniqueCodes === this.ruleForm.uniqueCode) {
        this.$messageTips(this, 'warning', '唯一码和商品编码重复，请重新核对')
        this._getFocus('.good')
        setTimeout(() => {
          this.ruleForm.ownUniqueCodes = ''
        }, 1000)
        return
      }
      // orderType  单据位采购入库类型
      if (!this.orderType) {
        let tempUniqueCode = this.ruleForm.uniqueCode
        let tempOwnUniqueCodes = this.ruleForm.ownUniqueCodes
        this.ruleForm.uniqueCode && uniqueCodeApi.getOutput({ code: this.ruleForm.uniqueCode, billCode: this.billCode }).then(res => {
          if (res && res.stockContainerItemObject && res.stockContainerItemObject.uniqueCode === tempUniqueCode && this.ruleForm.ownUniqueCodes) {
            this.ruleForm.ownUniqueCodes && uniqueCodeApi.getOutput({ code: this.ruleForm.ownUniqueCodes, billCode: this.billCode }).then(result => {
              if (result && result.uniqueCodeAllDetailVoObject && result.uniqueCodeAllDetailVoObject.ownUniqueCodes === tempOwnUniqueCodes) {
                this._(e, result)
              } else {
                this._setTimeRun('.good', 'ownUniqueCodes')
              }
            })
          } else if (res && res.uniqueCodeAllDetailVoObject && res.uniqueCodeAllDetailVoObject.uniqueCode === tempUniqueCode && !this.ruleForm.ownUniqueCodes) {
            this._(e, res)
          } else {
            this._setTimeRun('.own', 'uniqueCode')
          }
        })
        return
      }
      this.ruleForm.uniqueCode && uniqueCodeApi.getEntry({ code: this.ruleForm.uniqueCode }).then(res => {
        // finally = true 不存在
        if (res.finally && this.ruleForm.ownUniqueCodes) {
          this.ruleForm.ownUniqueCodes && uniqueCodeApi.getEntry({ code: this.ruleForm.ownUniqueCodes }).then(result => {
            if (result) {
              this._(e, result)
            } else {
              this._setTimeRun('.good', 'ownUniqueCodes')
            }
          })
        } else if (res.finally && !this.ruleForm.ownUniqueCodes) {
          this._(e, res)
        } else {
          this._setTimeRun('.own', 'uniqueCode')
        }
      })
    },
    submitForm (formName) {
      if (!this.isGood) {
        this.$messageTips(this, 'warning', '请先添加商品')
        return
      }
      if (!this.invoiceNo && this.invoiceStatus === 0) {
        this.$messageTips(this, 'warning', '请添加发票编码')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isManageAlone && !this.inStockItemDetailStockContainerList.length) {
            this.$messageTips(this, 'warning', '请扫描添加唯一码')
            return
          }
          if (!this.ruleForm.num && (this.inStockItemDetailStockContainerList.length || this.purchaseAcceptanceItemDetailList.length)) {
            let num = this.inStockItemDetailStockContainerList.length || this.purchaseAcceptanceItemDetailList.length
            this.ruleForm.totalPrice = floatTool.multiply(this.ruleForm.price, num)
          } else {
            this.ruleForm.totalPrice = floatTool.multiply(this.ruleForm.price, this.ruleForm.num)
          }
          this.ruleForm.id && delete this.ruleForm.id
          if (this.ruleForm.unitId) {
            this.ruleForm.unitId = this.ruleForm.unitId
            delete this.ruleForm.unitId
          }
          let tempRuleForm = Object.assign({}, this.ruleForm)
          if (tempRuleForm.localSettingObject && tempRuleForm.localSettingObject.isManageAlone && !tempRuleForm.localSettingObject.isExpiryDate) {
            delete tempRuleForm.batchNum
            delete tempRuleForm.validityDate
            delete tempRuleForm.produceDate
          }
          this.$emit('saveObject', Object.assign({ invoiceNo: this.invoiceNo, inStockItemDetailStockContainerList: this.inStockItemDetailStockContainerList, invoiceStatus: this.invoiceStatus }, tempRuleForm))
          setTimeout(() => {
            this._resetFrom()
          }, 500)
        }
      })
    },
    _ (e, res) {
      if (this._codeValidator() && this._forPropsList(e)) {
        this._setCodes(res)
      }
    },
    _resetFrom () {
      for (let item in this.ruleForm) {
        this.ruleForm[item] = ''
      }
      this.inStockItemDetailStockContainerList = []
      this.$refs.remoteselect.select = ''
      this.remoteSelectId = ''
    },
    _codeValidator () {
      return this._validatorMsg(this.inStockItemDetailStockContainerList)
    },
    _validatorMsg (inStockItemDetailStockContainerList) {
      for (let i = 0; i < inStockItemDetailStockContainerList.length; i++) {
        let item = inStockItemDetailStockContainerList[i]
        if (item.uniqueCode + '' === this.ruleForm.uniqueCode + '' || item.ownUniqueCodes + '' === this.ruleForm.uniqueCode + '') {
          this.$messageTips(this, 'warning', '该唯一码已经存在或唯一码和商品编码重复，请重新核对')
          this._setTimeRun('.own', 'uniqueCode')
          return false
        }
        if (item.uniqueCode + '' === this.ruleForm.ownUniqueCodes + '' || item.ownUniqueCodes + '' === this.ruleForm.ownUniqueCodes + '') {
          this.$messageTips(this, 'warning', '该商品编码已经存在或商品编码和唯一码重复，请重新核对')
          this._setTimeRun('.good', 'ownUniqueCodes')
          return false
        }
      }
      return true
    },
    _forPropsList (e) {
      for (let i = 0; i < this.list.length; i++) {
        let data = this.list[i]
        if (data.item) {
          return this._checkList(e)
        } else {
          console.log('no item')
        }
      }
      return true
    },
    _checkList (e) {
      for (let i = 0; i < this.list.length; i++) {
        let data = this.list[i]
        for (let n = 0; n < data.item.length; n++) {
          let item = data.item[n]
          if (item && item.inStockItemDetailStockContainerList) {
            for (let m = 0; m < item.inStockItemDetailStockContainerList.length; m++) {
              let inStockList = item.inStockItemDetailStockContainerList[m]
              if (this.isCode === 1 && (inStockList.uniqueCode + '' === this.ruleForm.uniqueCode || inStockList.ownUniqueCodes + '' === this.ruleForm.uniqueCode)) {
                this.$messageTips(this, 'warning', '该唯一码已经存在，请重新核对')
                this._setTimeRun('.own', 'uniqueCode')
                return false
              }
              if ((inStockList.ownUniqueCodes + '' === this.ruleForm.uniqueCode + '' || inStockList.ownUniqueCodes + '' === this.ruleForm.ownUniqueCodes + '') && e.target.placeholder === '商品自带编码') {
                this.$messageTips(this, 'warning', '该唯一码已经存在，请重新核对')
                this._setTimeRun('.own', 'uniqueCode')
                return false
              }
              if ((inStockList.uniqueCode + '' === this.ruleForm.uniqueCode + '' || inStockList.uniqueCode + '' === this.ruleForm.ownUniqueCodes + '') && e.target.placeholder === '唯一码') {
                this.$messageTips(this, 'warning', '该商品编码已经存在，请重新核对')
                this._setTimeRun('.good', 'ownUniqueCodes')
                return false
              }
            }
          }
        }
      }
      return true
    },
    _setCodes (res) {
      let tempData = JSON.parse(JSON.stringify(this.ruleForm))
      if (res && res.uniqueCodeAllDetailVoObject) tempData = Object.assign({}, tempData, res.uniqueCodeAllDetailVoObject)
      if (this.ownUniqueCodes && this.ruleForm.ownUniqueCodes) {
        this.inStockItemDetailStockContainerList.push({
          uniqueCode: tempData.uniqueCode,
          ownUniqueCodes: tempData.ownUniqueCodes,
          batchNum: tempData.batchNum,
          produceDate: tempData.produceDate,
          validityDate: tempData.validityDate
        })
        this.ruleForm.ownUniqueCodes = this.ruleForm.uniqueCode = ''
      }
      if (!this.ownUniqueCodes && !this.ruleForm.ownUniqueCodes) {
        this.inStockItemDetailStockContainerList.push({
          uniqueCode: tempData.uniqueCode,
          batchNum: tempData.batchNum,
          produceDate: tempData.produceDate,
          validityDate: tempData.validityDate
        })
        this.ruleForm.uniqueCode = ''
      }
    },
    _getFocus (cls) {
      document.querySelectorAll(cls + ' .el-input__inner')[0].focus()
    },
    _setTimeRun (cls, code) {
      setTimeout(() => {
        this.ruleForm[code] = ''
      }, 1000)
      this._getFocus(cls)
    },
    ...patch
  },
  components: {
    remoteSelect
  },
  watch: {
    'queryParams.materialType' (val) { // 切换库房清空物资
      this.goodName = ''
    },
    'clear' (val) {
      val && this._resetFrom()
    },
    'isCode' (val) {
      if (val === 1) {
        this.ownUniqueCodes = false
      } else {
        this.ownUniqueCodes = true
      }
      this.ruleForm.uniqueCode = this.ruleForm.ownUniqueCodes = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.product { background: #f9f9f9; margin-bottom: 10px;
  text-align: left!important;
  border-radius: 5px;
  border: 1px solid #eee;
  .product-col.el-col:first-child { border-right: 1px solid #eee; padding: 10px 0 20px 0;
    .invoice { padding: 0 30px; padding-bottom: 5px; border-bottom: 1px solid #eee; height: 42px; margin-top: 0px;}
  }
  .product-col.el-col:last-child { padding: 10px 0 20px 0;
    .rightHeader {border-bottom: 1px solid #eee; height: 47px}
    .rightBody {
      padding-left: 30px;
      h5 { font-size: 14px; margin: 20px 0;}
      .list { padding-left: 30px;
        overflow-y: auto;
        height: 230px;
        li { line-height: 30px; height: 30px; font-size: 14px; color: #000}
        span { width: 50%; display: inline-block;}
        span:first-child { width: 40%}
        //  visibility: hidden;
        .el-button.red { width: 10%; color: #e43;}
        li:hover .el-button.red { visibility: inherit;}
      }
    }
  }
  .list-el-row, .remoteselect { padding: 0 30px}
  .remoteselect { padding-top: 20px;}
  .list-el-row:first-child, .list-el-row:last-child { margin-top: 10px;}
  .el-form-item.noBottom { margin: 10px 0;}
  .noStar /deep/ .el-form-item__label {width: 0px!important; padding-right: 0}
  .el-form-item {
    .width { width: 30%!important; margin-right: 10px}
    .width1 { width: 45%!important; margin-right: 10px}
  }
}
.noStar /deep/ .el-form-item__label:before { content: ''!important}
@media screen and (max-width: 1600px) {
  .product .batch-number {width: 150px;}
}
.el-table__body-wrapper {
  .is-without-controls /deep/ .el-input__inner{
    padding: 0;
    width: 100px;
  }
}
</style>

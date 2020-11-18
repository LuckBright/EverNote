<template>
  <div id="product">
    <div class="product">
      <el-row>
        <el-col :span="14" class="product-col">
          <!-- 查询商品 -->
          <div class="remoteselect">
            <material-select
              ref="remoteselect"
              :params="queryParams"
              :needObjFlag="true"
              :disabled="!flag"
              @change="handleSelect">
            </material-select>
          </div>
          <el-form v-if="flag" :inline="true" onsubmit="return false;" label-position="right" label-width="90px" :model="ruleForm" :rules="rules" ref="ruleForm" size="small">
            <el-row class="list-el-row" v-if="(isExpiryDate && isManageAlone) || (isExpiryDate && !isManageAlone)">
              <el-col :span="24">
                <el-form-item v-if="ruleForm && ruleForm.isExpiryDate &&!ruleForm.isManageAlone" label="生产批号:" prop="batchNum">
                  <ever-select
                    :index="indexList"
                    clearable="true"
                    v-model="ruleForm.batchNum"
                    customValue="batchNum"
                    :options="ruleForm.batchNumList"
                    size="small"
                    placeholder="生产批号"
                    @visibleChange="queryBatchNumList"
                    @change="selectBatchNumList"
                    @clear="clearBatchNumList">
                  </ever-select>
                </el-form-item>
                <el-form-item class="line32" v-if="ruleForm.batchNum" label="生产日期:">
                  <span v-if="ruleForm.produceDate">{{ruleForm.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </el-form-item>
                <el-form-item class="line32" v-if="ruleForm.batchNum" label="到期日期:">
                  <span v-if="ruleForm.validityDate">{{ruleForm.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
                  <span v-else>-</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="list-el-row" v-if="ruleForm.localMaterialId">
              <el-col :span="24">
                <el-form-item v-if="ruleForm.localMaterialId" label="可用库存:">
                  <span v-if="ruleForm.batchNum">{{ruleForm.usableNum}}</span>
                  <span v-else-if="ruleForm && ruleForm.isManageAlone">{{ruleForm.usableNum}}</span>
                  <span v-else-if="ruleForm && !ruleForm.isExpiryDate && !ruleForm.isManageAlone">{{ruleForm.usableNum}}</span>
                  <span v-else>-</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="list-el-row" v-if="ruleForm.localMaterialId && !ruleForm.isManageAlone">
              <el-col :span="24">
                <el-form-item label="数量:" prop="num">
                  <div class="quantity_input">
                    <el-input
                      placeholder="数量"
                      type="number"
                      v-model="ruleForm.num"
                      @blur="handleTestNum(ruleForm)"
                      clearable>
                    </el-input>
                  </div>
                  <span>{{ruleForm.unitName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="list-el-row" v-if="ruleForm.localMaterialId && isManageAlone">
              <el-col :span="24">
                <el-form-item label="扫唯一码:" v-ever-bind-enter="{cycle: true}">
                  <el-input
                    class="own"
                    placeholder="唯一码"
                    v-model="ruleForm.uniqueCode"
                    @keyup.enter.native="handleEnterAddUniqueCode"
                    clearable>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="list-el-row">
              <el-col :span="24">
                <el-form-item label=" ">
                  <el-button type="primary" :disabled="ruleForm.num !== '' || detailList[0] ? false : true" @click="submitForm('ruleForm')">添加商品</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <!-- 扫描结果 -->
        <el-col :span="10" class="product-col">
            <div class="rightBody" v-if="detailList.length">
              <h5>已扫描商品 {{detailList.length}} 个</h5>
              <ul class="list">
                <li v-for="(code, index) in detailList" :key="index">
                  <span>{{code.uniqueCode}}</span>
                  <span>{{code.ownUniqueCodes ? code.ownUniqueCodes : ''}}</span>
                  <el-button type="text" class="red" @click="handleDeleteRow(index)">删除</el-button>
                </li>
              </ul>
            </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>
<script>
import outputstockApi from '../outputstorageroom/outputstockapi'
import uniqueCodeApi from '@/warehouse/page/storages/store/uniquecodeapi'
// import inventoryQueryApi from '@/warehouse/store/inventoryqueryapi'
import inventoryQueryApi from '@/warehouse/store/getmaterialinfoapi'
import { debounce, DRUGTYPE, MATERIALTYPE, EQUIPMENTTYPE, patch, PACKAGE_CODE, CHINESE_MEDICINE_TYPE } from '@/util/common'
// import addProductMethods from '@/warehouse/page/storages/util/addproduct'
// import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'
export default {
  name: 'product',
  props: ['queryParams', 'flag', 'list', 'clear', 'type', 'storageRoomId'],
  data () {
    return {
      ruleForm: {},
      isExpiryDate: 0,
      isManageAlone: 0,
      detailList: [],
      goodName: '',
      indexList: '',
      classifyId: '',
      inventoryQueryApi,
      PACKAGE_CODE,
      REMOTE_METHODS_PLACEHOLDER,
      outputstockApi,
      rules: {
        batchNum: { required: true, message: '请选择生产批号', trigger: 'change' },
        num: { required: true, message: '请填写可用库存数量', trigger: 'change' }
      }
    }
  },
  created () {
    this.ruleForm = Object.assign({}, {
      localMaterialId: '',
      usableNum: '',
      isInvented: '',
      materialName: '',
      unitName: '',
      isExpiryDate: '',
      classifyId: '',
      batchNum: '',
      batchNumList: [],
      num: '',
      isManageAlone: '',
      spec: '',
      unitId: '',
      uniqueCode: '',
      produceDate: '',
      validityDate: '',
      freight: {}
    })
    if (this.queryParams.materialType === DRUGTYPE) {
      this.ruleForm = Object.assign({}, this.ruleForm, {
        drugObject: {}
      })
    } else if (this.queryParams.materialType === MATERIALTYPE) {
      this.ruleForm = Object.assign({}, this.ruleForm, {
        consumptiveMaterialObject: {}
      })
    } else if (this.queryParams.materialType === EQUIPMENTTYPE) {
      this.ruleForm = Object.assign({}, this.ruleForm, {
        equipmentObject: {}
      })
    }
  },
  methods: {
    handleTestNum (data) {
      if (data.num <= 0) {
        this.ruleForm['num'] = ''
        this.rules.num.message = `${this.type}数量为0或未输入，请重新录入`
        // this.$messageTips(this, 'warning', this.type + '数量为0或未输入，请重新录入')
        return
      }
      const float = /^(\+)?\d+(\.\d+)?/
      const parse = /^(\+)?\d*$/
      let dataType = data.classifyId || ''
      if (!CHINESE_MEDICINE_TYPE.includes(dataType)) {
        if (!parse.test(data.num)) {
          this.ruleForm.num = ''
          this.rules.num.message = `${this.type}数量不能小于0并且不能有小数，请重新录入`
          // this.$messageTips(this, 'warning', this.type + '数量不能小于0并且不能有小数，请重新录入')
          return
        }
      } else {
        if (!float.test(data.num)) {
          this.ruleForm.num = ''
          this.rules.num.message = `${this.type}数量不能小于0，请重新录入`
          // this.$messageTips(this, 'warning', this.type + '数量不能小于0，请重新录入')
          return
        }
      }
      if (data.num > data.usableNum) {
        this.ruleForm.num = ''
        this.rules.num.message = `${this.type}出库数量不能大于可用数量`
        // this.$messageTips(this, 'warning', '出库数量不能大于可用数量' + this.type + '数量')
        return
      }
    },
    queryBatchNumList (v) {
      if (v && this.ruleForm.localMaterialId) {
        this.$set(this.ruleForm, 'batchNumList', [])
        let params = {
          localMaterialId: this.ruleForm.localMaterialId,
          materialType: this.materialType,
          storageRoomId: this.storageRoomId
        }
        this.outputstockApi.stocklist(params).then(res => {
          this.list.forEach(it => {
            res.forEach((its, index) => {
              if (it.localMaterialId + '' === this.ruleForm.localMaterialId + '' && its.batchNum + '' === it.batchNum + '') {
                res.splice(index, 1)
              }
            })
          })
          res[0] && this.$set(this.ruleForm, 'batchNumList', res)
        })
      }
    },
    clearBatchNumList (v) {
      this.$set(this.ruleForm, 'usableNum', '')
      this.$set(this.ruleForm, 'produceDate', '')
      this.$set(this.ruleForm, 'validityDate', '')
    },
    selectBatchNumList (v) {
      this.ruleForm.num = ''
      // this.obj = JSON.parse(JSON.stringify(this.obj))
      if (v === '') return
      let usableNum = ''
      let produceDate = ''
      let validityDate = ''
      let index = this.ruleForm.batchNumList.findIndex(it => {
        return it.batchNum === v
      })
      this.indexList = index
      usableNum = index > -1 ? this.ruleForm.batchNumList[index].usableNum : ''
      produceDate = index > -1 ? this.ruleForm.batchNumList[index].produceDate : ''
      validityDate = index > -1 ? this.ruleForm.batchNumList[index].validityDate : ''
      this.$set(this.ruleForm, 'usableNum', usableNum)
      this.$set(this.ruleForm, 'produceDate', produceDate)
      this.$set(this.ruleForm, 'validityDate', validityDate)
      this.$set(this.ruleForm, 'materialType', this.classifyId)
    },
    handleSelect (data) {
      this.ruleForm = Object.assign({}, {
        localMaterialId: '',
        usableNum: '',
        isInvented: '',
        materialName: '',
        unitName: '',
        isExpiryDate: '',
        classifyId: '',
        batchNum: '',
        batchNumList: [],
        num: '',
        isManageAlone: '',
        spec: '',
        unitId: '',
        uniqueCode: '',
        produceDate: '',
        validityDate: '',
        freight: {}
      })
      if (!data || data.localMaterialId !== this.ruleForm.localMaterialId) {
        this.detailList = []
      }
      if (!data) {
        for (let key in this.ruleForm) {
          this.ruleForm[key] = ''
        }
        return
      }
      let params = Object.assign(this.queryParams, { ifMoreThanZero: 1, localMaterialId: data.localMaterialId })
      delete params.state
      inventoryQueryApi.list(params).then(res => {
        if (res && res.list && res.list.length) {
          let row = res.list[0]
          if (row) {
            this.isExpiryDate = row.isExpiryDate
            this.isManageAlone = row.isManageAlone
            this.classifyId = row.classifyId
          }
          for (let key in this.ruleForm) {
            if (row.localMaterialId) {
              key === 'num' || key === 'usableNum' || key === 'batchNum' ? '' : this.ruleForm[key] = row[key] || row[key] === 0 ? row[key] : ''
            } else {
              this.ruleForm[key] = ''
            }
          }
          this.ruleForm.unitId = data.unitId
          if (row.isManageAlone) {
            this.ruleForm.usableNum = row.usableNum || row.usableNum === 0 ? row.usableNum : ''
          }
          if (!row.isManageAlone && !row.isExpiryDate) {
            this.ruleForm.usableNum = row.usableNum || row.usableNum === 0 ? row.usableNum : ''
          }
        }
      })
    },
    handleEnterAddUniqueCode () {
      if (this.ruleForm.uniqueCode === '') {
        this.$messageTips(this, 'warning', '唯一码不能为空，请重新核对')
        this._getFocus('.own')
        return
      }
      this.ruleForm.uniqueCode && uniqueCodeApi.getOutput({ code: this.ruleForm.uniqueCode, storageRoomId: this.storageRoomId }).then(res => {
        if (res && res.stockContainerItemObject && res.stockContainerItemObject.localMaterialId) {
          let tempUniqueCode = this.ruleForm.uniqueCode
          let localMaterialId = res.stockContainerItemObject.localMaterialId
          let compareData = this.ruleForm
          if (compareData.localMaterialId !== localMaterialId) {
            this._setTimeRun('.own', 'uniqueCode')
            return this.$messageTips(this, 'warning', '该唯一码绑定商品在当前' + this.type + '明细中不存在，请核实后再扫码')
          }
          if (res && res.uniqueCodeAllDetailVoObject && (res.uniqueCodeAllDetailVoObject.uniqueCode === tempUniqueCode || res.uniqueCodeAllDetailVoObject.ownUniqueCodes === tempUniqueCode)) {
            this._total(res)
          } else {
            // if (res.uniqueCodeAllDetailVoObject.ownUniqueCodes === tempUniqueCode) this.$messageTips(this, 'warning', '该唯一码不存在，请核实后再扫码')
            this._setTimeRun('.own', 'uniqueCode')
          }
        } else {
          this._setTimeRun('.own', 'uniqueCode')
        }
      })
    },
    handleDeleteRow (index) {
      this.detailList.splice(index, 1)
    },
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isManageAlone && !this.detailList.length) {
            this.$messageTips(this, 'warning', '请扫描添加唯一码')
            return
          }
          if (this.isExpiryDate && !this.isManageAlone && (this.ruleForm['num'] <= 0 || this.ruleForm['num'] === '')) {
            this.$messageTips(this, 'warning', '请填写' + this.type + '数量后再添加')
            return
          }
          if (!this.isExpiryDate && !this.isManageAlone && (this.ruleForm['num'] <= 0 || this.ruleForm['num'] === '')) {
            this.$messageTips(this, 'warning', '请填写' + this.type + '数量后再添加')
            return
          }
          if (this.isManageAlone && this.detailList[0]) {
            this.$emit('saveObject', Object.assign({}, { detailList: this.detailList }, this.ruleForm))
          } else {
            this.$emit('saveObject', Object.assign({}, this.ruleForm))
          }
          setTimeout(() => {
            this._resetFrom()
          }, 500)
        }
      })
    }),
    _total (res) {
      if (this._codeValidator() && this._forPropsList()) {
        this._setCodes(res)
      }
    },
    _codeValidator () {
      return this._validatorMsg(this.detailList)
    },
    _validatorMsg (detailList) {
      for (let i = 0; i < detailList.length; i++) {
        let item = detailList[i]
        if (item.uniqueCode + '' === this.ruleForm.uniqueCode + '') {
          this.$messageTips(this, 'warning', '该唯一码已经存在')
          this._setTimeRun('.own', 'uniqueCode')
          return false
        }
        if (item.ownUniqueCodes + '' === this.ruleForm.uniqueCode + '') {
          this.$messageTips(this, 'warning', '该商品码已经存在')
          this._setTimeRun('.own', 'uniqueCode')
          return false
        }
      }
      return true
    },
    _forPropsList () {
      for (let i = 0; i < this.list.length; i++) {
        let data = this.list[i]
        if (data) {
          return this._checkList()
        } else {
          console.log('no item')
        }
      }
      return true
    },
    _checkList () {
      for (let i = 0; i < this.list.length; i++) {
        let data = this.list[i]
        if (data.detailList) {
          for (let n = 0; n < data.detailList.length; n++) {
            let inStockList = data.detailList[n]
            if (inStockList.uniqueCode + '' === this.ruleForm.uniqueCode) {
              this.$messageTips(this, 'warning', '该唯一码绑定商品在当前' + this.type + '明细中已存在，请核实后再扫码')
              this._setTimeRun('.own', 'uniqueCode')
              return false
            }
            if (inStockList.ownUniqueCodes + '' === this.ruleForm.uniqueCode) {
              this.$messageTips(this, 'warning', '该商品码绑定商品在当前' + this.type + '明细中已存在，请核实后再扫码')
              this._setTimeRun('.own', 'uniqueCode')
              return false
            }
          }
        }
      }
      return true
    },
    _resetFrom () {
      for (let item in this.ruleForm) {
        this.ruleForm[item] = ''
      }
      this.detailList = []
      if (this.$refs.remoteselect) {
        this.$refs.remoteselect.select = ''
        this.$refs.remoteselect.options = []
      }
    },
    _setCodes (res) {
      let tempData = JSON.parse(JSON.stringify(this.ruleForm))
      if (res && res.uniqueCodeAllDetailVoObject) tempData = Object.assign({}, tempData, res.uniqueCodeAllDetailVoObject)
      this.detailList.push({
        uniqueCode: tempData.uniqueCode,
        ownUniqueCodes: tempData.ownUniqueCodes,
        batchNum: tempData.batchNum,
        produceDate: tempData.produceDate,
        validityDate: tempData.validityDate
      })
      this._setTimeRun('.own', 'uniqueCode')
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
  watch: {
    'clear' (val) {
      val && this._resetFrom()
    }
  }
}
</script>
<style lang="scss" scoped>
.product { background: #f9f9f9; margin-bottom: 10px;
  text-align: left!important;
  border-radius: 5px;
  border: 1px solid #eee;
  .product-col.el-col:first-child { border-right: 1px solid #eee; padding: 10px 0 20px 0;}
  .product-col.el-col:last-child { padding: 10px 0 20px 0;
    .rightHeader {border-bottom: 1px solid #eee; height: 47px}
    .rightBody {
      padding-left: 30px;
      h5 { font-size: 14px; margin: 20px 0;}
      .list { padding-left: 30px;
        overflow-y: auto;
        height: 230px;
        li { line-height: 30px; height: 30px; font-size: 14px; color: #000}
        span { width: 40%; display: inline-block; visibility: show;}
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
  .line32 /deep/ .el-form-item__content{line-height: 32px;}
}
.noStar /deep/ .el-form-item__label:before { content: ''!important}
li{list-style: none !important;}
</style>

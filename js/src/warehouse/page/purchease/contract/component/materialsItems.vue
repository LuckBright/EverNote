<template>
  <div>
    <el-button type="primary" size="mini" @click="handlerUpload" v-if="!objId || disabled">导入</el-button>
      <!-- 下载 -->
      <doc-download
        v-if="!objId || disabled"
        @downFile="downFile"
        :btnType="'text'"
        @exportStatus="changeStatus"
        ref="childMethodt"
        btnTxt="下载导入模板">
      </doc-download>
      <div>
        <ever-form2 :schema="schema" v-model="materObj" :inline="true">
          <template slot="default">
            <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
          </template>
        </ever-form2>
      </div>
      <el-table
        class="w ever-table scrollTable"
        :border="true"
        v-ever-bind-enter="{ resetHead: !objId ? 2 : 1 }"
        :data="tableData">
        <el-table-column align="center" width="40">
          <template slot-scope="scope">
            <span v-if="scope.$index !== tableData.length - 1">{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="物资编码" width="210" align="center" prop>
          <template slot-scope="scope">
            <span v-if="scope.row.materialsCode">{{scope.row.materialsCode}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="物资名称" prop>
          <template slot-scope="scope">
            <material-select
              ref="remoteselect"
              :params="queryParams"
              :needObjFlag="true"
              :disabled="objId ? !disabled : false"
              @change="handleSelect"
              v-if="scope.$index === tableData.length - 1 && !scope.row.show"
            ></material-select>
            <span v-else>
              <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="规格" width="80" align="center" prop>
          <template slot-scope="scope">
            <span>{{scope.row.spec || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="包装单位" width="80" align="center" prop>
          <template slot-scope="scope">
            {{scope.row.unitName || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="采购单价" width="100" align="center" prop>
          <template slot-scope="scope">
            <span v-if="scope.row.materialsId">
              <span v-if="objId && !disabled && !scope.row.purchasePrice">-</span>
              <el-input-number
                class="priceInput"
                v-if="!objId || (objId && disabled) || (objId && disabled && scope.$index === tableData.length - 1)"
                v-model="scope.row.purchasePrice"
                :controls="false"
                size="small"
                placeholder="采购单价"
                @blur="handlePrice(scope.row, scope.$index)"
                :precision="4">
              </el-input-number>
              <span v-if="scope.$index !== tableData.length - 1 && (!disabled && objId) && scope.row.purchasePrice">{{scope.row.purchasePrice | formatToFinacial(4)}}</span>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="批发单价" width="100" align="center" prop>
          <template slot-scope="scope">
            <span v-if="scope.row.materialsId">
              <span v-if="objId && !disabled && !scope.row.wholesalePrice">-</span>
              <el-input-number
                class="priceInput"
                placeholder="批发单价"
                v-if="!objId || (objId && disabled) || (objId && disabled && scope.$index === tableData.length - 1)"
                v-model="scope.row.wholesalePrice"
                :controls="false"
                size="small"
                @blur="handleWholesalePrice(scope.row, scope.$index)"
                :precision="4">
              </el-input-number>
              <span v-if="scope.$index !== tableData.length - 1 && (!disabled && objId) && scope.row.wholesalePrice">{{scope.row.wholesalePrice | formatToFinacial(4)}}</span>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="调价记录" v-if="objId" width="100" align="center" prop>
          <template slot-scope="scope">
            <el-button
              size="small"
              type="info"
              v-if="scope.row.show"
              @click="handleDetail(scope.row)">调价记录</el-button>
              <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center" v-if="objId && purchaseSaleType === 2" prop>
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
              :disabled="!disabled">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" prop>
          <template slot-scope="scope">
            <i :class="{ 'blue': !objId || (objId && disabled), 'gray': objId && !disabled, 'mr15': scope.$index === tableData.length - 1 }"
              class="iconfont icon-bingli-shanchu"
              v-if="(scope.row.add || status === 2 || !objId) && tableData.length > 1"
              @click="handlerDelete(scope.row, scope.$index)"></i>
              <el-button
              type="text"
              v-if="scope.$index === tableData.length - 1"
              @click="handlerAdd(scope.row, scope.$index)">
                <i :class="{ 'blue': !objId || (objId && disabled), 'gray': objId && !disabled }"
                  class="iconfont icon-tianjiabingli">
                </i>
              </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 导入弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      width="30%">
      <div class="layout_inner">
        <p class="enclosure">
          <span class="fl">{{'上传附件'}}</span>
          <span class="upload fl cur">
            <span class="uploadMsg">{{uploadMsg}}</span>
          </span>
          <upload-file2
            only="true"
            :showFileList="true"
            @before="beforeHandlerUpload"
            @success="handleSuccess"
            class="prupload"
            accept=".xls,.xlsx"
            uploadApiType="ucloud"
          ></upload-file2>
        </p>
        <!-- 下载 -->
        <doc-download
          @downFile="downFile"
          :btnType="'text'"
          @exportStatus="changeStatus"
          ref="childMethodt"
          btnTxt="下载导入模板">
        </doc-download>
        <!-- 错误提示 -->
        <div v-if="ImportInfo && ImportInfo.flag === false">
          <p>{{ImportInfo.info}}</p>
          <h3 class="alg_c">错误提示！</h3>
          <div class="tipMsg">
            <div class="msg">
              <div v-for="(item, index) in ImportInfo.data" :key="index">
                {{item}}
              </div>
            </div>
          </div>
        </div>
        <!-- 成功提示 -->
        <div v-if="ImportInfo && ImportInfo.flag">
          <p>{{ImportInfo.info}}</p>
          <h3 class="alg_c">导入成功！</h3>
        </div>
        <div class="alg_c mt10">
          <el-button type="primary" size="small" @click="dialogVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 调价记录 -->
    <supp-detail ref="detail" :goodData="selectData"></supp-detail>
  </div>
</template>

<script>
import remoteSelect from '@/warehouse/page/joinstorage/remoteselect.vue'
import materApi from '@/warehouse/page/institutionmaterial/store/materiallistapi.js'
import localApi from '@/warehouse/store/localdrugsettingapi.js' // 查询物资接口
import api from '../api/contrct.js'
import SuppDetail from '@/warehouse/page/purchease/contract/component/suppdetail.vue' // 调价记录
import { REMOTE_METHODS_PLACEHOLDER, REMOTE_METHODS_WIDTH, DOWNLOAD_FILE } from '@/warehouse/views/util/constant'

import {
  SPEC_CODE,
  PACKAGE_CODE,
  GOLBAL_VAL_MATERIL_NAME,
  } from '@/util/common'
let schema = [
  {
    name: 'materName',
    label: '物资名称',
    comp: 'material-select',
    style: REMOTE_METHODS_WIDTH,
    props: {
      params: { isClinic: true, ifMoreThan: 1, offset: 0, splitFlag: 0 }
    },
    span: 12
  }
]
// let priceSub = /^(-?\d+)(\.\d{4})?$/
export default {
  props: {
    supplierLocalId: { // 动态供应商ID
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let materObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      materObj,
      tableData: [], // 物资列表数据
      queryParams: { isClinic: true, ifMoreThan: 1, offset: 0, splitFlag: 0, state: 0 },
      materApi,
      localApi,
      api,
      SPEC_CODE,
      REMOTE_METHODS_PLACEHOLDER,
      GOLBAL_VAL_MATERIL_NAME,
      PACKAGE_CODE,
      uploadMsg: '请选择导入文件（.xls .xlsx）',
      dialogVisible: false,
      fileUrlDownLoad: '', // 缓存的下载模板链接
      ImportInfo: {},
      status: '',
      objId: this.$route.params.id,
      queryList: [], // 缓存的一份查询前的原数组
      selectData: {}, // 调价记录对象
      queryTable: [], // 缓存的一份数据
      purchaseSaleType: '',
      remoteObj: {},
      showQuery: false
    }
  },
  created () {
    this.tableData = [{ iName: '' }]
    this.queryList = this.tableData
    api.downLoad().then(res => {
      if (res && res.fileUrl) {
        this.fileUrlDownLoad = res.fileId
      }
    })
    if (this.objId) { // 查看页面赋值
      api.getById({ id: this.objId }).then(res => {
        if (res) {
          this.status = res.status
          this.purchaseSaleType = res.purchaseSaleType
          if (res.materialsItems && res.materialsItems.length) {
            res.materialsItems.forEach(item => {
              item.show = true
              if (item.wholesalePrice === null) item.wholesalePrice = undefined
            })
            this.tableData = res.materialsItems
            this.tableData.push({ iName: '', add: true })
            this.queryList = this.tableData
          }
        }
      })
    }
  },
  watch: {
    'dialogVisible' (val) {
      if (!val) {
        this.uploadMsg = '请选择导入文件（.xls .xlsx)'
        this.ImportInfo = {}
      }
    },
    tableData: {
      handler (v) {
        this.$emit('change', v)
      },
      deep: true
    },
    'materObj.materName' (val) { // 当查询物资清空之后还原列表
      if (!val) {
        // this.tableData = this.queryList
        if (!this.queryTable[this.queryTable.length - 1].localMaterialId) this.queryTable.pop()
        let resData = JSON.parse(JSON.stringify(this.queryTable))
        let newTable = JSON.parse(JSON.stringify(this.tableData))
        newTable.forEach(item => {
          let { materialsId, purchasePrice, wholesalePrice } = item
          if (materialsId) {
            let index = resData.findIndex(key => { return item.materialsId === key.materialsId })
            if (~index) {
              resData[index].purchasePrice = purchasePrice
              resData[index].wholesalePrice = wholesalePrice
            } else {
              resData.push(item)
            }
          }
        })
        this.tableData = this.queryList = [...resData, { iName: '', add: true }]
      }
    }
  },
  methods: {
    handlerQuery () { // 物资查询
      if (this.materObj.materName) {
        const newObj = this.queryList.find(item => { return item.materialsId === this.materObj.materName })
        if (newObj) {
          newObj.add = false
          this.tableData = [newObj]
          // this.tableData.push({ iName: '', add: true })
        } else {
          this.tableData = []
        }
      } else {
        return this.$messageTips(this, 'warning', '请选择物资再点击查询')
      }
      this.queryTable = JSON.parse(JSON.stringify(this.queryList))
    },
    handleDetail (row) { // 调价记录
      this.selectData = row
      this.$refs.detail.open()
    },
    handlequeryData (res, table) {
      let resData = JSON.parse(JSON.stringify(res))
      let newTable = JSON.parse(JSON.stringify(table))
      if (!newTable[newTable.length - 1].materialsId) newTable.pop()
      newTable.forEach((item, index) => {
        const resfilterindex = resData.findIndex(key => { return item.materialsId === key.materialsId })
        if (~resfilterindex) {
          item.purchasePrice = resData[resfilterindex].purchasePrice
          item.wholesalePrice = resData[resfilterindex].wholesalePrice
          resData.splice(resfilterindex, 1)
        }
      })
      resData.map(item => {
        item.add = true
        item.show = true
      })
      this.tableData = [...newTable, ...resData, { iName: '', add: true }]
      this.queryList = this.tableData
    },
    handleSuccess (file) { // 导入
      if (file) {
        let parmas = {
          fileUrl: `${this.$ever.fileUrl}${DOWNLOAD_FILE}${file.fileId}`,
          contractId: this.objId ? this.objId : '',
          supplierLocalId: this.objId ? this.supplierLocalId : ''
        }
        api.importItem(parmas).then(res => {
          if (res) {
            this.ImportInfo = res
            this.handlequeryData(res.data, this.tableData)
          }
        })
      }
    },
    handlerDelete (row, index) { // 删除
      if (!this.disabled && this.objId) return
      this.tableData.splice(index, 1)
      this.queryList = this.tableData
    },
    handlePrice (v, index) { // 采购单价
      if (v.materialsId) {
        if (v.purchasePrice < 0 || v.purchasePrice === '' || v.purchasePrice === undefined) {
          v.purchasePrice = undefined
          return this.$messageTips(this, 'warning', '采购单价小于0，请重新录入')
        }
        this.queryList[index].purchasePrice = v.purchasePrice
      }
    },
    handleWholesalePrice (v, index) { // 批发单价
      if (v.materialsId) {
        if (v.wholesalePrice < 0) {
          v.wholesalePrice = undefined
          return this.$messageTips(this, 'warning', '批发单价小于0，请重新录入')
        }
        this.queryList[index].wholesalePrice = v.wholesalePrice
      }
    },
    downFile () { // 下载导入模板
      this.$refs.childMethodt.downfile(DOWNLOAD_FILE + this.fileUrlDownLoad)
    },
    changeStatus (a) { // 下载导入模板
      if (a) {
        this.$messageTips(this, 'success', '下载导入模板成功')
      }
    },
    beforeHandlerUpload (file) { // 监控上传文件，更换输入框内显示文字
      this.uploadMsg = file.name
    },
    handlerUpload () { // 导入
      this.dialogVisible = true
    },
    handleSelect (v) { // 添加物资下拉框
      if (v) {
        if (this.showQuery) return
        // 添加的时候校验缓存的表格数据和目前展示的表格数据的集合
        let checkTable = [...this.tableData, ...this.queryTable]
        const identical = checkTable.find(item => { return item.materialsId === v.localMaterialId })
        if (identical) return this.$messageTips(this, 'warning', '该物资已经存在。')
        this.remoteObj = v
        let objectInfo = Object.assign({
          materialsId: v.localMaterialId, // 物资id
          purchasePrice: undefined, // 采购单价
          wholesalePrice: undefined, // 批发单价
          status: 1,
          add: true,
          show: true,
          materialsCode: v.code
        }, v)
        this.$set(this.tableData, this.tableData.length - 1, objectInfo)
      } else {
        this.$set(this.tableData, this.tableData.length - 1, { iName: '' })
      }
      this.queryList = this.tableData
      this.queryTable = JSON.parse(JSON.stringify(this.tableData))
    },
    handlerAdd (v, index) { // 添加物资
      if (!this.disabled && this.objId) return
      if (v) {
        const rows = Object.assign({}, v)
        if (rows['purchasePrice'] < 0 || rows['purchasePrice'] === '' || rows['purchasePrice'] === undefined) {
          return this.$messageTips(this, 'warning', '采购单价未输入，请输入后再点击添加')
        }
        if (rows.materialsId) {
          this.tableData.push(rows)
          if (this.tableData[index].add === undefined) {
            this.tableData[index].add = undefined
          } else {
            this.tableData[index].add = true
          }
          this.tableData[index].show = true // 代表已经添加的物资
          this.$set(this.tableData, this.tableData.length - 1, { iName: '', add: true })
          this.queryList = this.tableData
          // 点击添加最后一行输入框自动聚焦
          this.$nextTick(_ => {
            setTimeout(_ => {
              if (this.$refs.remoteselect && this.$refs.remoteselect.$el.querySelectorAll('input')) {
                this.$refs.remoteselect.$el.querySelectorAll('input')[0].focus()
              }
            }, 100)
          })
        } else {
          this.$messageTips(this, 'warning', '此药品无效，请选择其他药品')
        }
      }
    },
  },
  components: {
    remoteSelect,
    SuppDetail,
  }
}

</script>
<style lang="less" scoped>
.gray {
  color: #D7D7D7;
}
.priceInput {
  width: 79px;
  /deep/ .el-input__inner {
    padding: 5px;
  }
}
.upload {
  border: 1px solid #ddd;
  width: 300px;
  display: inline-block;
  height: 25px;
  line-height: 25px;
  margin-left: 10px;
}
.prupload {
  position: absolute;
  left: 87px;
  /deep/ .el-upload .el-button--primary {
    width: 300px;
    height: 25px;
    opacity: 0;
  }
  /deep/ .el-upload-list {
    // display: none;
  }
}
.uploadMsg {
  color: #ADAAAA;
  padding-left: 10px;
}
.enclosure {
  line-height: 30px;
}
.tipMsg {
  width: 100%;
  height: 230px;
  border: 1px solid #ddd;
  overflow-y: scroll;
}
.msg {
  padding: 20px;
}
.scrollTable /dee/ .el-table__body-wrapper {
  max-height: 620px;
  overflow-y: scroll;
}
.v-modal {
  z-index: 2110;
}
</style>

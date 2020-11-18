<template>
  <div>
    <el-dialog title="盘点表" :visible.sync="dialogVisible" :fullscreen="true" id="page1">
      <div class="tabpane">
        <div class="main-head">
          <h4>盘点单信息</h4>
          <ever-form-model
            :schema="schema"
            v-model="obj"
            :api="api"
            :rules="rules"
            ref="form"
            labelWidth="140px"
            label-position="right">
          </ever-form-model>
        </div>
        <div class="main-option">
          <el-row :gutter="20" type="flex" justify="end">
            <doc-download :id="this.obj.id" @downFile="downFile" ref="childMethod" @exportStatus="changeStatus" btnTxt="导出EXCEL文件"></doc-download>
            <el-button type="primary" @click="printFile(obj)">打印网页版本</el-button>
            <el-button @click="handleCancle()">取消盘点</el-button>
            <el-button type="primary" @click="dialogVisible = false">返回</el-button>
          </el-row>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column show-overflow-tooltip
            prop="lineNum"
            width="60"
            label="行号">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop=""
            label="药品编码">
            <template slot-scope="scope">
              <span v-if="scope.row.localSettingObject">{{scope.row.localSettingObject.materialSkuObject.code}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop=""
            label="商品名">
            <template slot-scope="scope">
              <span v-if="scope.row.localSettingObject">{{findBasesourceCode({arr: scope.row.localSettingObject.materialSkuObject.materialPropertys, code: MATERILA_CODE[1]})}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop=""
            label="通用名">
            <template slot-scope="scope">
              <span v-if="scope.row.localSettingObject">{{findBasesourceCode({arr: scope.row.localSettingObject.materialSkuObject.materialPropertys, code: MATERILA_CODE[0]})}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop=""
            label="规格">
            <template slot-scope="scope">
              <span v-if="scope.row.localSettingObject">
                <wh-code-to-name
                  :showIcon="false"
                  :patchObj="{
                    code: [SPEC_CODE],
                    list: scope.row.localSettingObject.materialSkuObject.materialPropertys,
                    isInfo: false
                  }"
                ></wh-code-to-name>
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="batchNum"
            label="批号">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="manufacturer.name"
            label="厂商">
            <template slot-scope="scope">
              <span v-if="scope.row.localSettingObject">{{findBasesourceCode({arr: scope.row.localSettingObject.materialSkuObject.materialPropertys, code: PRODUCER})}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="unitGroupItem.name"
            label="单位">
            <template slot-scope="scope">
              <span v-if="scope.row.localSettingObject">{{findBasesourceCode({arr: scope.row.localSettingObject.materialSkuObject.materialPropertys})}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="stockNum"
            align="right"
            label="账面数量">
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount">
          </ever-pagination>
        </el-row>
      </div>
    </el-dialog>
    <tip-dialog title="确认是否取消盘点" content="盘点单取消后不能恢复，请确认是否取消盘点？" @click="handleCancle" ref="dialog" :function="cancelForm"></tip-dialog>
  </div>
</template>

<script>
import storageRoomApi from '@/warehouse/store/storageroomapi'
import drugstocktakingapi from '@/warehouse/store/drugstocktakingapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { debounce, patch, SPEC_CODE, PRODUCER } from '@/util/common'
import setName from '@/util/setstatusname'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import { DOWNLOAD_FILE } from '@/warehouse/views/util/constant.js'
var schema = [
  {
    name: 'code',
    label: '盘点计划单编号',
    disabled: true
  },
  {
    name: 'storageRoomId',
    label: '盘点药库',
    type: 'select',
    options: [],
    disabled: true
  },
  {
    name: 'user',
    label: '盘点人员',
    disabled: true
  },
  {
    name: 'checkTime',
    label: '盘点时间',
    type: 'date',
    disabled: true,
    outformat: 'yyyy-MM-dd HH:mm:ss'
  }
]
let filename = ''
let bucketName = ''
export default {
  mixins: [getstorage, setName],
  props: ['data', 'type'],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.requisitionId = ''
    return {
      api: drugstocktakingapi,
      schema,
      obj,
      SPEC_CODE,
      PRODUCER,
      filename,
      bucketName,
      dialogVisible: false,
      tableData: [],
      offset: 0,
      pagesize: 20,
      totalCount: 0,
      pageSizes: [10, 20, 50, 100],
      pageLayout: 'total, sizes, prev, pager, next, jumper',
      rules: {
        storageRoomId: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ]
      }
    }
  },
  created () {
    this._info()
    storageRoomApi.list({ isInvented: 0 }).then(result => {
      this.$ever.getFieldFromSchema(schema, 'storageRoomId').options = result.list
    })
  },
  methods: {
    show (obj) {
      this.obj = obj
      this.obj.id = obj.id
      this.printinfo = obj
      this.getStockInfo().then(result => {
        this.obj = Object.assign({}, this.obj, result.data)
        this.tableData = result.data.inventoryTakingItemVoList
        this.totalCount = result.data.totalCount
        this.pagesize = 20
      })
      this.dialogVisible = true
    },
    printFile: debounce(function (obj) {
      var printTable = document.getElementById('print')
      var $iframe = document.getElementById('piframe')
      var doc = $iframe.contentWindow.document
      var win = $iframe.contentWindow
      doc.write(document.head.innerHTML)
      doc.write(printTable.innerHTML)
      setTimeout(function () {
        win.focus()
        win.print()
        doc.close()
      }, 300)
    }),
    downFile (data) {
      let params = {
        'materialType': this.materialType,
        'inventoryTakingId': this.obj.id,
        'storageRoomId': this.storageId
      }
      drugstocktakingapi.downloadFile(params).then(result => {
        if (result) {
          this.$refs.childMethod.downfile(DOWNLOAD_FILE + result.fileName)
        }
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getStockInfo().then(result => {
        this.obj = Object.assign(this.obj, result.data)
        this.tableData = Object.assign([], result.data.inventoryTakingItemVoList)
        this.totalCount = result.data.totalCount
      })
    },
    handleCurrentChange (val) {
      this.offset = (val - 1) * this.pagesize
      this.getStockInfo().then(result => {
        this.obj = Object.assign(this.obj, result.data)
        this.tableData = Object.assign([], result.data.inventoryTakingItemVoList)
        this.totalCount = result.data.totalCount
      })
    },
    getStockInfo: function (refresh) {
      var params = Object.assign({}, this.params, { 'inventoryTakingId': this.obj.id })
      if (refresh) {
        this.offset = 0
      }
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      params.offset = this.offset
      params.pagesize = this.pagesize
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      return drugstocktakingapi.getItemById(params).then(result => {
        result.data.user = result.data.staff.name
        return result
      })
    },
    changeStatus (a) {
      let status = this.obj.status
      if (status === 1) {
        let params = {
          'inventoryTakingId': this.obj.id,
          'status': 2,
          'storageRoomId': this.storageId
        }
        drugstocktakingapi.updateStatus(params).then(result => {
          this.dialogVisible = false
          this.$emit('exportStatus', 1)
        })
      } else {
        this.dialogVisible = false
      }
    },
    cancelForm: debounce(function () {
      this.api.del(this.obj.id).then(res => {
        if (res) {
          this.dialogVisible = false
          this.$emit('exportStatus', 1)
        }
      })
    }),
    handleCancle () {
      this.$refs.dialog.open()
    },
    _info () {
      this.obj.materialType = this.materialType
    },
    ...patch
  },
  watch: {
    'dialogVisible': function () {
      if (this.dialogVisible === false) {
        this.$emit('visibleStatus', 1)
      }
    }
  },
  components: {
    tipDialog
  }
}
</script>
<style media="screen" lang="scss" scoped>
  .el-table /deep/ .el-table__expanded-cell { padding: 10px 20px}
  #page1 { page-break-after:always }
</style>

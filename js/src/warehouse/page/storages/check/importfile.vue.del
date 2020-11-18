<template>
  <div>
    <el-dialog title="导入模版" :visible.sync="dialogVisible" :fullscreen="true">
      <div class="tabpane">
        <div class="main-head">
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
          <el-button type="primary" @click="updateStatus">导入完成</el-button>
          <upload-file @success="uploadSuccess" previewInline="true" uploadApiType="ucloud" maxNum="1"></upload-file>
          <el-button @click="handleCancle()">取消盘点</el-button>
          <el-button type="primary" @click="dialogVisible = false">返回</el-button>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column show-overflow-tooltip
            prop="lineNum"
            width="50"
            label="行号">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop=""
            label="物品编码">
            <template slot-scope="scope">
              <span v-if="scope.row.localSettingObject">{{scope.row.localSettingObject.code}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop=""
            label="商品名称">
            <template slot-scope="scope">
              <span v-if="scope.row.localSettingObject">{{findBasesourceCode({arr: scope.row.localSettingObject.materialSkuObject.materialPropertys, code: MATERILA_CODE[1]})}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="manufacturer.name"
            label="生产厂商">
            <template slot-scope="scope">
              <span v-if="scope.row.localSettingObject">{{findBasesourceCode({arr: scope.row.localSettingObject.materialSkuObject.materialPropertys, code: PRODUCER})}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop=""
            label="物品条码编号">
            <template slot-scope="scope">
              <span v-if="scope.row.localSettingObject">{{findBasesourceCode({arr: scope.row.localSettingObject.materialSkuObject.materialPropertys, code: BAR_CODE})}}</span>
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
            prop="localSetting.manageType"
            label="管理模式">
            <template slot-scope="scope">
              <sys-value type="THC_WH_MATERIALS_MANAGER_MODE" :code="scope.row.localSettingObject && scope.row.localSettingObject.manageType"></sys-value>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="container.name"
            label="货位">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="batchNum"
            label="批次">
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
          <el-table-column show-overflow-tooltip
            prop="num"
            align="right"
            label="实物数量">
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
import { debounce, BAR_CODE, SPEC_CODE, MATERILA_CODE, PRODUCER, patch } from '@/util/common'
import setName from '@/util/setstatusname'
import tipDialog from '@/warehouse/page/components/tipsdialog'

var schema = [
  {
    name: 'code',
    label: '盘点计划单编号',
    disabled: true
  },
  {
    name: 'storageRoomId',
    label: '盘点库房',
    type: 'select',
    options: [],
    disabled: true
  }
]
export default {
  mixins: [getstorage, setName],
  props: ['data', 'type'],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.requisitionId = ''
    return {
      schema,
      api: drugstocktakingapi,
      obj,
      BAR_CODE,
      SPEC_CODE,
      MATERILA_CODE,
      PRODUCER,
      dialogVisible: false,
      tableData: [],
      offset: 0,
      pagesize: 20,
      totalCount: 0,
      pageSizes: [10, 20, 50, 100],
      rules: {
        storageRoomId: [
          { required: true, message: '必填项', trigger: 'blur' }
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
      this.obj.id = obj.id
      this.getStockInfo().then(result => {
        this.obj = Object.assign(this.obj, result.data)
        this.tableData = Object.assign([], result.data.inventoryTakingItemVoList)
        this.totalCount = result.data.totalCount
        this.pagesize = 20
      })
      this.dialogVisible = true
    },
    uploadSuccess (result) {
      var params = {
        'materialType': this.materialType
      }
      params = Object.assign(params, result)
      drugstocktakingapi.uploadFile(params).then(result => {
        if (result.success) {
          this.$messageTips(this, 'success', result.success)
          this.recieveData()
        }
      })
    },
    updateStatus () {
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i]
        if (item.num === '' || item.num === undefined || item.num === null) {
          this.$notify({
            title: '警告',
            message: '请确保每个物品有实物数量',
            type: 'warning'
          })
          return false
        }
      }
      let params = {
        'inventoryTakingId': this.obj.id,
        'status': 3,
        'storageRoomId': this.storageId
      }
      this.api.updateStatus(params).then(result => {
        this.dialogVisible = false
        this.$emit('exportStatus', 1)
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
        return result
      })
    },
    recieveData () {
      this.getStockInfo().then(result => {
        this.obj = Object.assign(this.obj, result.data)
        this.tableData = Object.assign([], result.data.inventoryTakingItemVoList)
        this.totalCount = result.data.totalCount
      })
    },
    exportFile: function () {
      drugstocktakingapi.getExportById(this.obj.id).then(result => {
      })
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
      this.obj.storageRoomId = this.storageId
    },
    ...patch
  },
  components: {
    tipDialog
  }
}
</script>
<style media="screen" lang="scss" scoped>
  .el-table /deep/ .el-table__expanded-cell { padding: 10px 20px}
  .el-table__expanded-cell { padding: 10px 20px}
</style>

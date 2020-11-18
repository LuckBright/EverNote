<template>
  <div>
    <ever-bread-crumb name="申领" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form2 :schema="schema" v-model="obj" ref="form" :span="12" :nosubmit="true" :class="{readform: objId}">
        </ever-form2>
        <h4>执行情况</h4>
        <el-form ref="form" label-width="120px" :inline="true" class="readform">
          <el-form-item label="出库单：">
            <a class="blue cur" v-if="obj.outStockObject" @click="handleOutRoute">{{obj.outStockObject.code}}</a>
            <span v-if="obj.status == FULL_STATE.apply[4].id" class="ml20">{{obj.statusName}}</span>
            <span v-else-if="obj.status == FULL_STATE.apply[3].id && obj.outStockObject" class="ml20">{{setName(FULL_STATE.outstock, obj.outStockObject.status, true)}}</span>
            <span v-else class="ungenerated">未生成</span>
          </el-form-item>
          <el-form-item label="入库单：">
            <a class="blue cur" v-if="obj.inStockObject && obj.outStockObject && obj.outStockObject.status == FULL_STATE.outstock[1].id" @click="handleIntRoute">{{obj.inStockObject.code}}</a>
            <span class="ml20" v-if="obj.outStockObject && obj.outStockObject.status == FULL_STATE.outstock[1].id">{{setName(FULL_STATE.instock, obj.inStockStatus, true)}}</span>
            <span class="ungenerated" v-else>未生成</span>
          </el-form-item>
        </el-form>
        <h4>申领商品明细</h4>
        <div class="listinfo">
          <div class="table">
            <el-table
              :data="obj.purchaseRequisitionItem"
              style="width: 100%">
              <div>
                <el-table-column show-overflow-tooltip
                  width="10">
                </el-table-column>
              </div>
              <div>
                <el-table-column show-overflow-tooltip
                  width="50">
                  <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column
                  prop="name"
                  label="商品名称">
                  <template slot-scope="scope">
                    <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column prop label="规格" align="center" width="80px">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec || '-'}}</span>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column show-overflow-tooltip
                  width="80"
                  align="center"
                  label="单位">
                  <template slot-scope="scope">
                    <span>{{scope.row.unitName || '-'}}</span>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column show-overflow-tooltip
                  prop="num"
                  align="right"
                  label="申领数量"
                  width="120">
                  <template slot-scope="scope">
                    <span>{{scope.row.num}}</span>
                  </template>
                </el-table-column>
              </div>
              <div>
                <el-table-column
                  width="10">
                </el-table-column>
              </div>
            </el-table>
          </div>
        </div>
      </div>
      <div class="panel-footer">
        <el-button v-if="objId && obj.status == 44 && obj.outStockObject && (obj.outStockObject.status == 20 || obj.outStockObject.status == 23)" type="primary" @click="handleCancle">取消</el-button>
        <el-button v-if="taskId && obj.status == 42" type="primary" @click="switchForm">我知道</el-button>
        <el-button v-if="objId && obj.inStockStatus === 11 && obj.toStorageRoomId !== this.storageId" type="primary" @click="$router.push('/storages/business/applybusinessadd/' + obj.id)">复制</el-button>
      </div>
    </div>
    <tipDialog :title="dialogTitle" :content="dialogContent" ref="dialog" :function="dialogFunction" :cancelFun="dialogCanclFun"></tipDialog>
  </div>
</template>
<script>
import api from '../store/applyapi'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import { debounce, FULL_STATE, patch, SPEC_CODE, PACKAGE_CODE, GOLBAL_VAL_MATERIL_NAME, parserJSON, parserComplex } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import setName from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { everprint } from '@/util/print'

let schema = [
  {
    name: 'code',
    label: '申领单号：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'requsitionStorageRoomObject.name',
    label: '申领库房：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'createBy',
    label: '申领人：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'statusName',
    label: '申领状态：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'toStorageRoomObject.name',
    label: '发货库房：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'createDate',
    label: '申领时间：',
    comp: 'readonlyitem',
    span: 8
  },
  {
    name: 'description',
    label: '申领原因：',
    comp: 'readonlyitem',
    span: 24
  }
]
export default {
  mixins: [setName, getstorage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.purchaseRequisitionItem = []
    return {
      schema,
      obj,
      api,
      SPEC_CODE,
      FULL_STATE,
      PACKAGE_CODE,
      GOLBAL_VAL_MATERIL_NAME,
      dosageFormArr: [],
      objId: this.$route.params.id,
      taskId: this.$route.query.taskId,
      createDate: '',
      dialogTitle: '',
      dialogContent: '',
      dialogFunction: '',
      dialogCanclFun: ''
    }
  },
  created () {
    this.getDetail().then((res) => {
      Object.assign(this.obj, res)
    })
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    handleOutRoute () {
      // 是否本库房
      let isStorage = this.obj.toStorageRoomObject.id === this.storageId
      const id = this.obj.outStockObject.id
      const status = this.obj.outStockStatus
      this.$router.push(status === FULL_STATE.outstock[0].id ? `/storages/output/outputsee/${id}` : `/storages/output/outputedit/${id}?${status === 24 && isStorage ? 'look' : 'look='}${id}`)
    },
    handleIntRoute () {
      const id = this.obj.inStockObject.id
      const status = this.obj.inStockStatus
      this.$router.push(status === FULL_STATE.instock[1].id ? `/storages/entry/entrysee/${id}` : status === 13 ? `/storages/entry/entryother/${id}` : `/storages/entry/entryedit/${id}?${'look='}${id}`)
    },
    printTable () {
      everprint('WARHOUSE_APPLY_BILL', {}, {
        preview: true,
        lang: 'zh',
        cb: _ => {
          console.log('打印完成')
        }
      })
    },
    getDetail (id) {
      return new Promise((resolve, reject) => {
        api.getById({ id: this.objId }).then(res => {
          res.createDate = res.createDate
          res.statusName = this.setName(FULL_STATE.apply, res.status, true)
          res.items = []
          for (let i = 0; i < res.purchaseRequisitionItem.length; i++) {
            let item = res.purchaseRequisitionItem[i]
            let tempParams = {
              unitId: item.localSettingObject ? parserJSON({ data: item.localSettingObject.materialSkuObject.ext, propertys: PACKAGE_CODE }).trim() : ''
            }
            if (item.localSettingObject && item.localSettingObject.isManageAlone) {
              tempParams.batchNum = ''
              tempParams.validityDate = ''
            }
          }
          resolve(res)
        })
      })
    },
    switchForm: debounce(function () {
      let params = {
        id: this.$route.params.id,
        type: 0,
        billType: this.obj.code
      }
      this.api.updateSwitch(params).then(res => {
        if (res) this.$router.push('/storages/business/applybusiness/' + this.objId + '?look=' + this.objId)
      })
    }),
    handleCancle () {
      this.dialogTitle = '确认是否取消'
      this.dialogContent = '申领单取消后不能恢复，请确认是否取消？'
      this.dialogFunction = this.submitCancel
      this.$refs.dialog.open()
    },
    submitCancel: debounce(function () {
      this.api.createOrUpdate({ id: this.objId }).then(res => {
        this.getDetail().then((res) => {
          this.obj = Object.assign({}, this.obj, res)
        })
      })
    }),
    ...patch
  },
  watch: {
    '$route' (val) {
      this.taskId = val.query.taskId
      if (this.taskId) {
        this.getDetail().then((res) => {
          this.obj = Object.assign({}, this.obj, res)
        })
      }
    }
  },
  components: {
    tipDialog
  }
}
</script>

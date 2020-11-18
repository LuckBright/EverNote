<template>
  <div>
    <ever-bread-crumb name="关联物资" path="/warehouse/equipments"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>商品信息</h4>
        <el-form label-width="140px" class="form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="商品名称：">{{ drug.name || DEFAULT}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品编码：">{{ drug.code || DEFAULT }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品牌：">{{ drug.byname || DEFAULT }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产厂商：">{{ drug.engName || DEFAULT }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册编码：">{{ drug.ratifyCode || DEFAULT }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="医疗机构：">{{ drug.drugCategoryId || DEFAULT }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <h4 class="panel-hr">基本信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          labelWidth="140px"
          label-position="right"
        >
          <template slot="manageStyle">
            <el-checkbox
              label="按有效期管理"
              v-model="obj.isExpiryDate"
              :true-label="1"
              :false-label="0"
              style="padding-right: 50px"
            ></el-checkbox>
            <el-checkbox
              label="按唯一码管理"
              v-model="obj.isManageAlone"
              :true-label="1"
              :false-label="0"
            ></el-checkbox>
          </template>
        </ever-form-model>
        <h4 class="panel-hr">
          <el-button
            style="float:right"
            size="small"
            type="primary"
            @click.native.prevent="handleAddSupplier()"
          >添加供应商</el-button>供应商信息
        </h4>
        <el-table style="width: 100%" :data="supplierTableData" border>
          <el-table-column show-overflow-tooltip prop="name" label="供应商名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="supplierName" label="供应商简称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="unifiedCode" label="社会统一信用代码"></el-table-column>
          <el-table-column show-overflow-tooltip prop align="right" width="200" label="采购价格">
            <template slot-scope="scope">
              <span v-if="scope.row.id">{{scope.row.price | formatToFinacial(4)}}</span>
              <el-input v-model="scope.row.price" placeholder="请输入" style="width:100px" v-else></el-input>
              <span style="padding-left: 5px; color: #999">元</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop width="100" label>
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.id"
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <h4 class="panel-hr">单位信息</h4>
        <el-table :data="obj.item" style="width: 100%" border>
          <el-table-column show-overflow-tooltip prop="unitType" label="单位类型">
            <template slot-scope="scope">
              <span>{{scope.row.unitTypename}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="unitId" label="选择单位">
            <template slot-scope="scope">
              <ever-select
                v-model="scope.row.unitId"
                :options="unitArr"
                size="small"
                style="width:140px"
              ></ever-select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="enableDate" label="生效日期">
            <template slot-scope="scope">
              <date-picker size="small" v-model="scope.row.enableDate"></date-picker>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="disableDate" label="失效日期">
            <template slot-scope="scope">
              <date-picker size="small" v-model="scope.row.disableDate"></date-picker>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="panel-footer">
        <el-button type="primary" @click="submitForm()" v-if="!id">保存</el-button>
        <el-button type="primary" @click="submitForm()" v-if="id">保存</el-button>
      </div>
    </div>
    <supplier-dialog ref="supplierdialog" @selectedSupplier="handleSupplier"></supplier-dialog>
  </div>
</template>

<script>
import api from '../store/localdrugsettingapi'
import equipmengt from '../store/equipmengtapi'
import unitGroupItem from '../store/unitgroupitemapi'
import { EQUIPMENTTYPE } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import supplierDialog from './drugbehospitalized/supplierdialog'

var schema = [
  // {
  //   name: 'manageType',
  //   label: '管理模式',
  //   type: 'systype',
  //   code: 'THC_WH_MATERIALS_MANAGER_MODE'
  // },
  // {
  //   name: 'isConfirm',
  //   label: '申领审批',
  //   type: 'radio',
  //   options: [{id: 0, name: '否'}, {id: 1, name: '是'}],
  //   span: 24
  // },
  // {
  //   name: 'sendType',
  //   label: '配送方式',
  //   type: 'systype',
  //   code: 'THC_WH_PR_DELIVERY'
  // },
  {
    name: 'manageStyle',
    label: '管理方式:',
    type: 'custom',
    span: 24
  }
]
export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    var init = {
      globalMaterialId: this.$route.params.objId,
      item: [],
      isExpiryDate: 0,
      isManageAlone: 0
    }
    obj = Object.assign(obj, init)
    obj.isManageAlone = 1
    return {
      TYPE: EQUIPMENTTYPE,
      schema,
      obj: obj,
      unitArr: [],
      api,
      code: 'THC_WH_LOCALSETTING_UNIT_TYPE',
      id: this.$route.params.id,
      objId: this.$route.params.objId,
      itemlist: [],
      supplierTableData: [],
      rules: {
        opdUnit: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ],
        inpatientUnit: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ],
        purchaseType: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ]
      },
      drug: {},
      DEFAULT: '无'
    }
  },
  methods: {
    handleAddSupplier () {
      this.$refs.supplierdialog.open(this.supplierTableData)
    },
    handleSupplier (data) {
      this.supplierTableData.push(data)
    },
    submitForm () {
      for (let i = 0; i < this.obj.item.length; i++) {
        if (!this.obj.item[i].unitId) {
          this.$notify({
            type: 'warning',
            message: '请选择单位'
          })
          return false
        }
      }
      this.obj.materialType = this.TYPE
      let supplierArr = []
      if (this.supplierTableData && this.supplierTableData.length) {
        for (let i = 0; i < this.supplierTableData.length; i++) {
          if (!this.supplierTableData[i].price) {
            this.$messageTips(this, 'warning', '请填写供应商采购价格')
            return
          }
          supplierArr.push({
            id: this.supplierTableData[i].id ? this.supplierTableData[i].id : '',
            supplierLocalId: this.supplierTableData[i].supplierLocalId ? this.supplierTableData[i].supplierLocalId : '',
            supplierId: this.supplierTableData[i].supplierId,
            price: this.supplierTableData[i].price
          })
        }
      }
      this.obj.supplierLocalProductVos = supplierArr
      api.createOrUpdate(this.obj).then(result => {
        this.$router.push('/warehouse/equipments')
      })
    },
    getDrugInfo () {
      equipmengt.getById(this.objId)
        .then(result => {
          this.drug = result
          // return result.drugUnitId
        })
      unitGroupItem.list({ localMaterialId: this.objId, unitGroupId: this.$route.params.unitGroupId, materialType: this.TYPE }).then(res => {
        this.unitArr = res
      })
      this.getLocalInfo()
    },
    getLocalInfo () {
      if (this.id) {
        api.getById(this.id)
          .then(result => {
            this.obj = Object.assign(this.obj, result)
            this.obj.isManageAlone = 1
            this.itemlist = this.obj.item
            this.supplierTableData = result.supplierLocalProductVos ? result.supplierLocalProductVos : []
            this.getSysvalueInfo()
          })
      } else {
        this.getSysvalueInfo()
        Promise.resolve()
      }
    },
    getSysvalueInfo () {
      sysvalue.listOnce(this.code).then(result => {
        var _options1 = []
        for (var sysv of result) {
          let _sysObj = {}
          _sysObj.unitId = ''
          _sysObj.unitType = sysv.id
          _sysObj.unitTypename = sysv.name
          _sysObj.disableDate = sysv.disableDate
          _sysObj.enableDate = sysv.enableDate
          for (var i = 0; i < this.itemlist.length; i++) {
            if (this.itemlist[i].unitType === sysv.id) {
              _sysObj.unitId = this.itemlist[i].unitId
            }
          }
          if (!_sysObj.unitId) {
            if (_sysObj.unitType === 293) {
              _sysObj.unitId = this.drug.saleUnitId
            }
            if (_sysObj.unitType === 292) {
              _sysObj.unitId = this.drug.purchaseUnitId
            }
            if (_sysObj.unitType === 204) {
              _sysObj.unitId = this.drug.storageRoomUnitId
            }
            if (_sysObj.unitType === 203) {
              _sysObj.unitId = this.drug.storageRoomUnitId
            }
          }
          _options1.push(_sysObj)
          this.$forceUpdate()
        }
        this.obj.item = JSON.parse(JSON.stringify(_options1))
      })
    }
  },
  created () {
    this.getDrugInfo()
  },
  components: {
    supplierDialog
  }
}
</script>

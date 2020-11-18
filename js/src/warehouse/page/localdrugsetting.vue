<template>
  <div>
    <ever-bread-crumb :name="purchaseName" path="/warehouse/drugs"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>药品信息</h4>
        <el-form label-width="140px" class="form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="药品名称：">{{ drug.name }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="药品编码：">{{ drug.code }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通用名称：">{{ drug.byname }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文名称：">{{ drug.engName }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="批准文号：">{{ drug.ratifyCode }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="药品分类：">{{ setName(drugCategory, drug.drugType, true) }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <h4>基本信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          labelWidth="140px"
          label-position="right"
        ></ever-form-model>

        <h4>单位信息</h4>
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
  </div>
</template>

<script>
import api from '../store/localdrugsettingapi'
import drug from '../store/drugapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { DRUGTYPE } from '@/util/common'
import sets from '@/util/setstatusname'
import { diction } from '@/store/common'

var schema = [
  {
    name: 'manageType',
    label: '管理模式',
    type: 'systype',
    code: 'THC_WH_MATERIALS_MANAGER_MODE'
  },
  {
    name: 'isConfirm',
    label: '申领是否需要审批',
    type: 'radio',
    options: diction.yesno
  },
  {
    name: 'sendType',
    label: '配送方式',
    type: 'systype',
    code: 'THC_WH_PR_DELIVERY'
  }
]
export default {
  mixins: [sets],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    var init = {
      globalMaterialId: this.$route.params.objId,
      item: []
    }
    obj = Object.assign(obj, init)

    return {
      TYPE: DRUGTYPE,
      schema,
      obj: obj,
      unitArr: [],
      api,
      purchaseName: '药品关联',
      code: 'THC_WH_LOCALSETTING_UNIT_TYPE',
      id: this.$route.params.id,
      objId: this.$route.params.objId,
      itemlist: [],
      drugCategory: [],
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
      drug: {}
    }
  },
  methods: {
    submitForm () {
      this.obj.materialType = this.TYPE
      for (let i = 0; i < this.obj.item.length; i++) {
        let items = this.obj.item[i]
        if (items.unitId === '') {
          this.$messageTips(this, 'warning', '请选择完全部单位信息')
          return
        }
      }
      api.createOrUpdate(this.obj).then(result => {
        this.$router.push('/warehouse/drugs')
      })
    },
    getDrugInfo () {
      drug.getById(this.objId)
        .then(result => {
          this.drug = result
          this.unitArr = result.unitGroupItemList
        })
      this.getLocalInfo()
    },
    getLocalInfo () {
      if (this.id) {
        api.getById(this.id)
          .then(result => {
            this.obj = Object.assign(this.obj, result)
            this.itemlist = this.obj.item
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
              _sysObj.unitId = this.drug.saleUnitId ? this.drug.saleUnitId : ''
            }
            if (_sysObj.unitType === 292) {
              _sysObj.unitId = this.drug.purchaseUnitId ? this.drug.purchaseUnitId : ''
            }
            if (_sysObj.unitType === 204) {
              _sysObj.unitId = this.drug.storageRoomUnitId ? this.drug.storageRoomUnitId : ''
            }
            if (_sysObj.unitType === 203) {
              _sysObj.unitId = this.drug.storageRoomUnitId ? this.drug.storageRoomUnitId : ''
            }
          }
          _options1.push(_sysObj)
        }
        this.obj.item = JSON.parse(JSON.stringify(_options1))
      })
    }
  },
  created () {
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
      this.drugCategory = res
    })
    this.getDrugInfo()
    // Promise.all([this.getDrugInfo(), this.getLocalInfo()])
    // .then(this.getSysvalueInfo())
  }
}
</script>

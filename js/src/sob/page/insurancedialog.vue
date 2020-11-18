<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" class="ui_dialog_02">
      <div class>
        <el-form :inline="true" :model="chargingItemForm" class="demo-form-inline">
          <el-form-item label="保险公司">
            <el-select v-model="chargingItemForm.insuranceOrgID" placeholder="请选择保险公司" clearable>
              <el-option
                v-for="insur in insurs"
                :key="insur.id"
                :label="insur.name"
                :value="insur.id"
              >
                <span>{{ insur.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="项目编码">
            <el-input v-model="chargingItemForm.itemCode" placeholder="项目编码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onChargingFormSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="chargingItemData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="id" label="id" type="selection"></el-table-column>
        <el-table-column prop="category" label="类别">
          <template slot-scope="scope">
            <sys-value type="THC_SOB_SERVICE_INSURANCE_TYPE" :code="scope.row.category"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="insuranceOrgName" label="保险公司名称"></el-table-column>
        <el-table-column prop="itemCode" label="项目编码"></el-table-column>
        <el-table-column prop="itemName" label="项目名称" width="120"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onInsuranceSubmit">
          <i class="icon iconfont icon-baocunweimoban"></i>保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../store/insuranceapi'
import sysvalue from '../../warehouse/store/sysvalueapi'

export default {
  name: 'servicesdialog',
  props: ['title', 'categoryOptions', 'objId', 'service'],
  data () {
    return {
      dialogTableVisible: false,
      loading: false,
      insurs: [],
      chargeLevelData: [],
      chargeLevel: '',
      chargingItems: '',
      chargingItemData: [],
      chargingItemForm: {
        insuranceOrgID: '',
        category: 1,
        itemCode: ''
      }
    }
  },
  methods: {
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogOpen () {
      this.chargingItemData = []
      this.chargingItemForm = {
        insuranceOrgID: '',
        category: '',
        itemCode: ''
      }
      this.dialogTableVisible = true
    },
    querySearchAsync () {
      // if (queryString !== '') {
      //   this.loading = true
      //   let params = {
      //     name: queryString
      //   }
      //   var _tmpArr = []
      //   api.getInsuranceList(params).then(results => {
      //     this.loading = false
      //     for (var result of results) {
      //       _tmpArr.push({
      //         name: result.insuranceOrgCnName,
      //         id: result.id
      //       })
      //     }
      //     this.insurs = _tmpArr
      //   })
      // } else {
      //   this.insurs = []
      // }
    },
    onChargingFormSubmit () {
      this.chargingItemForm.pagesize = 1000
      this.chargingItemForm.offset = 0
      if (!this.chargingItemForm.category) {
        delete this.chargingItemForm.category
      }
      this.chargingItemForm.category = this.service.category
      if (!this.chargingItemForm.itemCode) {
        delete this.chargingItemForm.itemCode
      }
      api.getMergeList(this.chargingItemForm).then(result => {
        result.map(v => {
          v.chargeLevelData = this.chargeLevelData
          v.chargeLevel = '1'
          v.insurancePrice = ''
        })
        this.chargingItemData = result
      })
    },
    handleSelectionChange (val) {
      var _obj = []
      for (var _c of val) {
        let _tmpObj = {}
        _tmpObj.chargingItemId = _c.id
        _tmpObj.insuranceCode = _c.insuranceOrgID
        _tmpObj.insuranceType = _c.insuranceType
        //        _tmpObj.chargeLevel = _c.chargeLevel
        //        _tmpObj.insurancePrice = _c.insurancePrice
        _obj.push(_tmpObj)
      }
      this.chargingItems = _obj
    },
    onInsuranceSubmit () {
      let data = this.chargingItemData
      let ids = this.chargingItems
      let obj = {
        serviceId: this.objId,
        chargingItems: ids
      }
      if ((data && !data[0]) || !ids) {
        this.$messageTips(this, 'warning', '您还没有选择关联保险')
        return false
      }
      api.createOrUpdate(obj).then(res => {
        this.$emit('selectChange')
        this.onDialogClose()
      })
    }
  },
  created () {
    api.listInsuranceOrg().then(result => {
      for (var insur of result) {
        insur.name = insur.insuranceOrgCnName
      }
      this.insurs = result
    })
    sysvalue.listOnce('THC_RCM_CHARGE_LEVEL').then(result => {
      this.chargeLevelData = result
    })
  }
}
</script>
<style scoped>
.insurancePrice {
  width: 80px;
}
.el-radio + .el-radio {
  margin-left: 10px;
}
</style>

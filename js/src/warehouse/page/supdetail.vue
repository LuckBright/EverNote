<template>
  <div id>
    <el-dialog title="供应商价格修改记录" :visible.sync="dialogVisible" class="ui_dialog_02">
      <el-form label-width="100px" class="form">
        <el-row>
          <el-col :span="24">
            <el-form-item label="物资名称：">
              <div v-if="goodData.localSettingObject" class="line32">
                <span v-if="goodData.localSettingObject.classifyId == BLOOD_CLASSIFYID">
                  <wh-code-to-name
                    :isExt="true"
                    :patchObj="{
                    code: GENERAL_CODE,
                    list: goodData.localSettingObject.materialSkuObject.ext,
                    attributeValue: 'materialPropertyValues',
                    isInfo: false
                  }"
                  ></wh-code-to-name>
                </span>
                <span v-else>
                  <wh-code-to-name
                    :isExt="true"
                    :patchObj="{
                  code: MATERILA_NAME_CODE,
                  list: goodData.localSettingObject.materialSkuObject.ext,
                  isInfo: false
                }"
                  ></wh-code-to-name>
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规格：">
              <div v-if="goodData.localSettingObject" class="line32">
                <span v-if="goodData.localSettingObject.classifyId == BLOOD_CLASSIFYID">
                  <wh-code-to-name
                    :showIcon="false"
                    :isExt="true"
                    :patchObj="{
                    code: [BLOOD_SPECIFICATION],
                    list: goodData.localSettingObject.materialSkuObject.ext,
                    isInfo: false
                }"
                  ></wh-code-to-name>
                </span>
                <span v-else>
                  <wh-code-to-name
                    :showIcon="false"
                    :isExt="true"
                    :patchObj="{
                  code: [SPU_SPEC_CODE],
                  list: goodData.localSettingObject.materialSkuObject.ext,
                  isInfo: false
                }"
                  ></wh-code-to-name>
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="包装单位：">
              <div
                v-if="goodData.localSettingObject"
                class="line32"
              >
              <wh-single-code-to-name
                :isExt="true"
                :patchObj="{
                  list: goodData.localSettingObject.materialSkuObject.ext,
                  code: PACKAGE_CODE
                }"
              ></wh-single-code-to-name>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%" :stripe="false">
        <el-table-column prop align="center" width="155" label="调价时间">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime">{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop label="调整人">
          <template slot-scope="scope">
            <span v-if="scope.row.staffObject">{{scope.row.staffObject.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop="oriPrice" label="原单价(元)">
          <template slot-scope="scope" v-if="scope.row.oriPrice">{{scope.row.oriPrice | formatToFinacial(4)}}</template>
        </el-table-column>
        <el-table-column align="right" prop="price" label="新单价(元)">
          <template slot-scope="scope">{{scope.row.price | formatToFinacial(4)}}</template>
        </el-table-column>
        <el-table-column align="right" prop="oriTradePrice" label="原批发单价(元)">
          <template slot-scope="scope" v-if="scope.row.oriTradePrice">{{scope.row.oriTradePrice | formatToFinacial(4)}}</template>
        </el-table-column>
        <el-table-column align="right" prop="tradePrice" label="批发单价(元)">
          <template slot-scope="scope" v-if="scope.row.tradePrice">{{scope.row.tradePrice | formatToFinacial(4)}}</template>
        </el-table-column>
        <el-table-column prop="description" label="调价原因"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import api from '../store/supplierpriceapi'
import { patch, BLOOD_CLASSIFYID, BLOOD_SPECIFICATION, PACKAGE_CODE, GENERAL_CODE, SPU_SPEC_CODE, MATERILA_NAME_CODE } from '@/util/common'
export default {
  props: ['isFlag', 'goodData'],
  data () {
    return {
      api,
      dataInfo: {},
      tableData: [],
      dialogVisible: false,
      SPU_SPEC_CODE,
      BLOOD_SPECIFICATION,
      PACKAGE_CODE,
      BLOOD_CLASSIFYID,
      GENERAL_CODE,
      MATERILA_NAME_CODE
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
    },
    getDetail () {
      this.api.getInfo({ supplierLocalProductId: this.goodData.id }).then(res => {
        if (res.supplierLocalProduct.drugObject) {
          this.dataInfo.byname = res.supplierLocalProduct.drugObject.byname
          this.dataInfo.name = res.supplierLocalProduct.drugObject.name
          this.dataInfo.spec = res.supplierLocalProduct.drugObject.spec
        } else if (res.supplierLocalProduct.equipmentObject) {
          this.dataInfo.byname = res.supplierLocalProduct.equipmentObject.byname
          this.dataInfo.name = res.supplierLocalProduct.equipmentObject.name
          this.dataInfo.spec = res.supplierLocalProduct.equipmentObject.spec
        } else if (res.supplierLocalProduct.consumptiveMaterialObject) {
          this.dataInfo.byname = res.supplierLocalProduct.consumptiveMaterialObject.byname
          this.dataInfo.name = res.supplierLocalProduct.consumptiveMaterialObject.name
          this.dataInfo.spec = res.supplierLocalProduct.consumptiveMaterialObject.spec
        }
        this.dataInfo.supplierName = res.supplierLocalProduct.supplierLocalObject ? res.supplierLocalProduct.supplierLocalObject.supplierObject.name : ''
        this.dataInfo.manufacturerName = res.supplierLocalProduct.manufacturerObject ? res.supplierLocalProduct.manufacturerObject.name : ''
        this.dataInfo = Object.assign({}, this.dataInfo, this.goodData)
        this.tableData = res.supplierLocalProduct.supplierLocalProductList
      })
    },
    ...patch
  },
  watch: {
    'dialogVisible' (v, oV) {
      if (v) this.getDetail()
    }
  }
}
</script>
<style scoped>
.el-form-item {
  margin-bottom: 0;
}
.line32 {
  height: 32px;
  line-height: 32px;
}
.form {
  margin-top: 0;
}
</style>

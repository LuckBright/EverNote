<template>
  <div id>
    <el-dialog title="调价记录" :visible.sync="dialogVisible" class="ui_dialog_02">
      <ever-form2 :schema="schema" v-model="obj" ref="form3" labelWidth="80px" class="custom-form-item" :nosubmit="true"></ever-form2>
      <!-- 调价详情 -->
      <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%" :stripe="false">
        <el-table-column prop align="center" width="40">
          <template slot-scope="scope">{{scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column prop align="center" width="155" label="调价时间">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime">{{scope.row.createTime}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop label="调整人">
          <template slot-scope="scope">
            <span v-if="scope.row.adjustBy">{{scope.row.adjustBy}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop label="原单价(元)">
          <template slot-scope="scope">
            <span v-if="scope.row.oldPrice === null">-</span>
            <span v-else>{{scope.row.oldPrice | formatToFinacial(4)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop label="新单价(元)">
          <template slot-scope="scope">
            <span v-if="scope.row.newPrice === null">-</span>
            <span v-else>{{scope.row.newPrice | formatToFinacial(4)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop label="原批发单价(元)">
          <template slot-scope="scope">
            <span v-if="scope.row.oldWholesalePrice === null">-</span>
            <span v-else>{{scope.row.oldWholesalePrice | formatToFinacial(4)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop label="新批发单价(元)">
          <template slot-scope="scope">
            <span v-if="scope.row.newWholesalePrice === null">-</span>
            <span v-else>{{scope.row.newWholesalePrice | formatToFinacial(4)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import api from '../api/contrct.js'
import {
  patch,
  GOLBAL_VAL_MATERIL_NAME,
  PACKAGE_CODE,
  } from '@/util/common'
let schema = [
  {
    name: 'materialName',
    label: '物资名称:',
    comp: 'readonlyitem',
    span: 24
  },
  {
    name: 'spec',
    label: '规格:',
    comp: 'readonlyitem',
    span: 12
  },
  {
    name: 'unitName',
    label: '包装单位:',
    comp: 'readonlyitem',
    span: 12
  }
]
export default {
  props: {
    goodData: {
      type: Object,
      default: () => { }
    },
    isId: { // 是否用objid
      type: Boolean,
      default: true
    }
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      api,
      GOLBAL_VAL_MATERIL_NAME,
      PACKAGE_CODE,
      dataInfo: {},
      tableData: [],
      dialogVisible: false,
      objId: this.$route.params.id
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
    },
    getDetail () {
      if (this.goodData) {
        this.obj.materialName = this.goodData.materialName
        this.obj.spec = this.goodData.spec
        this.obj.unitName = this.goodData.unitName
      }
      api.priceList({ contractId: this.isId ? this.objId : this.goodData.contractId, materialsId: this.goodData.materialsId }).then(res => {
        if (res && res.length) {
          this.tableData = res
        } else {
          this.tableData = []
        }
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
<style scoped lang="scss">
.ui_dialog_02 /deep/ .el-dialog{
  width: 800px;
}
.custom-form-item {
  /deep/ .el-form-item.el-form-item--small {
    margin-bottom: 0!important;
  }
  /deep/ .el-form-item__label {
    color: #666
  }
}

.line32 {
  height: 32px;
  line-height: 32px;
}
.form {
  margin-top: 0;
}
</style>

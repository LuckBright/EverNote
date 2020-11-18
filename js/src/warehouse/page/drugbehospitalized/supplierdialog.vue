<template>
  <div id="supplier">
    <el-dialog :visible.sync="dialogVisible" width="900px" class="ui_dialog_02">
      <div style="font-size: 20px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="选择供应商" name="select">
            <div class="setupsupplier">
              <div class="setupsupplier2">
                <ever-query-form class :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
                <el-table
                  v-loading.body="loading"
                  :data="tableData"
                  style="width: 100%"
                  height="340"
                  border
                >
                  <el-table-column label width="55" prop>
                    <template slot-scope="scope">
                      <el-radio class="radio" v-model="selected" :label="scope.row">
                        <span>&nbsp;</span>
                      </el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip label="供应商名称" prop="name"></el-table-column>
                  <el-table-column show-overflow-tooltip label="供应商简称" prop="supplierName"></el-table-column>
                  <el-table-column show-overflow-tooltip label="社会统一信用代码" prop="unifiedCode"></el-table-column>
                  <el-table-column show-overflow-tooltip label="类型" prop>
                    <template slot-scope="scope">{{setName(supplierTypeArr, scope.row.type)}}</template>
                  </el-table-column>
                </el-table>
                <ever-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :totalCount="totalCount"
                  :current="current"
                ></ever-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="新建供应商" name="setup">
            <div class="selectsupplier" v-if="activeName == 'setup'">
              <ever-form2
                :schema="schema"
                v-model="obj"
                ref="form"
                :span="12"
                :rules="rules"
                :api="api"
                :info="info"
                labelWidth="150px"
                :nosubmit="true"
                @objsaved="afterSave"
              ></ever-form2>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">
          <i class="iconfont icon-quxiao"></i>取消
        </el-button>
        <el-button @click="submit" type="primary">
          <i class="iconfont icon-tijiao"></i>提交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import beHospitalizedApi from '@/warehouse/store/behospitalizedapi'
import supplierApi from '@/warehouse/store/supplierapi'
import list from '@/util/list'
import setname from '@/util/setstatusname'
import { validateCreditCodeTest } from '@/util/validate'
import sysvalue from '@/warehouse/store/sysvalueapi'
var schema = [
  {
    name: 'name',
    label: '供应商名称',
    props: {
      placeholder: '请输入供应商名称'
    },
    span: 22
  },
  {
    name: 'supplierName',
    label: '供应商简称',
    props: {
      placeholder: '请输入供应商简称'
    },
    span: 22
  },
  {
    name: 'type',
    label: '供应商类型',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_VENDOR_TYPE'
    },
    span: 22
  },
  {
    name: 'unifiedCode',
    label: '社会统一信用代码',
    props: {
      placeholder: '请输入社会统一信用代码'
    },
    span: 22
  }
]
var querySchema = [
  {
    name: 'name',
    label: '',
    placeholder: ''
  }
]
export default {
  mixins: [list, setname],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    const _this = this
    var validateCreditCode = (rule, value, callback) => {
      validateCreditCodeTest(_this, rule, value, 'unifiedCode', supplierApi, callback)
    }
    return {
      dialogVisible: false,
      activeName: 'select',
      selected: '',
      schema,
      obj,
      querySchema,
      queryObj,
      beHospitalizedApi,
      info: true,
      api: supplierApi,
      tableData: [],
      supplierTypeArr: [],
      supplierTableData: [],
      rules: {
        name: [{ required: true, message: '必填项', trigger: 'blur' }],
        supplierName: [{ required: true, message: '必填项', trigger: 'blur' }],
        type: [{ required: true, message: '必填项', trigger: 'blur' }],
        unifiedCode: [{ required: true, validator: validateCreditCode, trigger: 'blur' }]
      },
      noStoreQuery: true
    }
  },
  created () {
    sysvalue.listOnce('THC_WH_VENDOR_TYPE').then(res => {
      if (res) {
        this.supplierTypeArr = res
      }
    })
  },
  methods: {
    afterSave (data) {
      data.supplierId = data.id
      delete data.id
      this.$emit('selectedSupplier', data)
      this.close()
      this.activeName = 'select'
    },
    open (data) {
      this.activeName === 'select'
      this.queryObj.name = ''
      this.supplierTableData = data
      this.query(this.queryObj)
      this.dialogVisible = true
    },
    close () {
      this.dialogVisible = false
    },
    submit () {
      if (this.activeName === 'setup') {
        this.$refs.form.submitForm()
      } else {
        var index = -1
        if (this.supplierTableData && this.supplierTableData.length) {
          index = this.supplierTableData.findIndex(item => {
            return (item.id === this.selected.id || item.supplierId === this.selected.id)
          })
        }
        if (index > -1) {
          this.$messageTips(this, 'warning', '您选择的供应商已经添加，请选择其他供应商')
          return
        }
        if (this.selected) {
          this.selected.supplierId = this.selected.id
          delete this.selected.id
          this.$emit('selectedSupplier', this.selected)
          this.close()
        } else {
          this.$messageTips(this, 'warning', '请选择供应商')
        }
      }
      this.selected = ''
    },
    handleClick (val) {
      if (val === 'setup') {
        this.$nextTick(function () {
          this.$refs.form.resetForm()
        })
      }
    }
  },
  watch: {
    'activeName' (val) {
      if (val === 'setup') {
        this.$nextTick(function () {
          this.$refs.form.resetForm()
          for (let key in this.obj) {
            this.obj[key] = ''
          }
        })
      }
    }
  }
}
</script>
<style scoped>
#supplier /deep/ .setupsupplier2 {
  display: block;
  width: 100%;
}
.setupsupplier3 {
  width: 100%;
}
@media screen and (max-width: 1600px) {
  #supplier /deep/ .ui_dialog_02 .el-dialog .el-dialog__body {
    max-height: 520px;
  }
}
</style>

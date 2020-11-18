<template>
  <div>
    <div class="btn-container">
      <el-button type="primary" @click="add" :disabled="packageDetails.isClinic == 1 || isGroupControl">新增</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        class="discount"
        :row-class-name="tableRowClassName"
        v-loading="loading">
        <el-table-column
          prop="preferentialName"
          label="优惠名称"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="packageDetails.isClinic == 1">{{scope.row.preferentialName}}</span>
            <a v-else href="javascript:void(0)" @click="querydetail(scope.row)">{{scope.row.preferentialName}}</a>
          </template>
        </el-table-column>
        <el-table-column
          v-if="packageDetails.discountSet == 1"
          prop="discount"
          label="折扣比例"
          align="center"
          width="100">
          <template slot-scope="scope">
            {{scope.row.discount}}{{scope.row.discount?'%':''}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="packageDetails.discountSet == 2"
          prop="totalPriceDisSet"
          label="折扣金额"
          align="center"
          width="120">
          <template slot-scope="scope">
            {{scope.row.totalPriceDisSet | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="活动时间"
          width="310"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.startDate || '--'}}
            至
            {{scope.row.endDate || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="areasNames"
          label="适用地区"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="50"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
          {{scope.row.status == 0 ? '删除': scope.row.status == 1 ? '激活' : '停用'}}
        </template>
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="b"
          label="操作"
          width="120"
        >
        <template slot-scope="scope">
          <package-confirm
            @confirm="changeStatus(scope.row, 1)"
            :disabled="packageDetails.isClinic == 1 || isGroupControl"
            v-if="scope.row.status == 2"
            :msg="'确定要激活吗？'"
            :buttonVal="'激活'"
            :type="'primary'"
            :plain="true"
            :iconType="0"
          ></package-confirm>
          <package-confirm
            @confirm="changeStatus(scope.row, 2)"
            :disabled="packageDetails.isClinic == 1 || isGroupControl"
            v-if="scope.row.status == 1"
            :msg="'确定要停用吗？'"
            :buttonVal="'停用'"
            :type="'danger'"
            :plain="true"
            :iconType="0"
          ></package-confirm>
          <package-confirm
            @confirm="changeStatus(scope.row, 0)"
            :disabled="packageDetails.isClinic == 1 || isGroupControl"
            v-if="scope.row.status != 0"
            :msg="'确定要删除吗？'"
            :buttonVal="'删除'"
            :type="'danger'"
            :plain="true"
            :iconType="0"
          ></package-confirm>
        </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="logInfo.title" :visible.sync="logInfoVisibile" width="580px" class='order ui_dialog_02 spe discount' :close-on-click-modal="false">
      <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="20"
        :rules="rules"
        labelWidth="100px"
        label-position="right"
      >
        <template slot="time">
          <el-row>
            <el-col :span="9">
              <el-date-picker
                style="width: 100%;"
                v-model="startDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-col>
            <el-col :span="2" style="text-align:center;">
              至
            </el-col>
            <el-col :span="9">
              <el-date-picker
                style="width: 100%;"
                v-model="endDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-col>
          </el-row>
        </template>
        <template slot="areasList">
          <el-select v-model="obj.areasList" style="width:100%;" @change="areasListChange" multiple placeholder="请选择">
            <el-option
              v-for="(item, index) of areasListOptions"
              :key="index"
              :label="item.cityName"
              :value="item.cityCode">
            </el-option>
          </el-select>
        </template>
        <template slot="default">
          <el-col>
            <el-form-item>
              <el-button @click="logInfoVisibile = false">取消</el-button>
              <el-button type="primary" :loading="confirmLoading" @click="confirmBtn">确认</el-button>
            </el-form-item>
          </el-col>
        </template>
      </ever-form2>
      <!-- <span slot="footer" class="dialog-footer">
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
import api from '@/card/store/packagemanagement/api'
import activityApi from '@/card/store/activityapi'
import storage from '@/util/storage'
import PackageConfirm from '@/card/page/packagemanagement/packageconfirm'
export default {
  props: ['packageDetails', 'isGroupControl'],
  components: {
    PackageConfirm
  },
  data () {
    let schema = [
      {
        name: 'preferentialName',
        label: '优惠名称'
      },
      {
        name: 'time',
        label: '活动时间',
        comp: 'custom'
      },
      {
        name: 'areasList',
        label: '适用地区',
        comp: 'custom'
      },
      {
        name: 'remarks',
        label: '备注'
      }
    ]
    let rules = {
      preferentialName: [
        { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    let obj = this.$ever.createObjFromSchema(schema)
    obj.areasList = []
    return {
      api,
      rules,
      schema,
      type: 2,
      obj,
      loading: false,
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0, // 是否集团
      tableData: [],
      logInfo: {
        title: '新增',
        id: ''
      },
      confirmLoading: false,
      logInfoVisibile: false,
      areasListOptions: [],
      cityCode: '',
      startDate: '',
      endDate: ''
    }
  },
  methods: {
    areasListChange (val) {
      if (this.cityCode && !val.includes(this.cityCode) && !this.isGroup) {
        this.obj.areasList.push(this.cityCode)
      }
    },
    add () {
      this.obj.areasList = []
      this.logInfoVisibile = true
    },
    querydetail (row) {
      this.obj.preferentialName = row.preferentialName
      this.obj.areasList = row.areasList
      this.obj.remarks = row.remarks
      this.obj.discount = row.discount
      this.obj.totalPriceDisSet = row.totalPriceDisSet
      this.startDate = row.startDate
      this.endDate = row.endDate
      this.logInfo.title = '编辑'
      this.logInfo.id = row.id
      this.logInfoVisibile = true
    },
    tableRowClassName ({ row, rowIndex }) {
      if (Number(row.status) === 2) {
        return 'stop-use-color'
      }
    },
    confirmBtn () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.obj, { isGroup: this.isGroup, startDate: this.startDate, endDate: this.endDate })
          params.setMealId = this.$route.query.packageId
          this.confirmLoading = true
          if (this.logInfo.id) {
            params.id = this.logInfo.id
          }
          api.createOrUpdateDiscount(params).then(rs => {
            if (rs.head.errCode === 0) {
              this.confirmLoading = false
              this.logInfoVisibile = false
              let title = (this.logInfo.id ? '编辑' : '新增') + '成功'
              this.$messageTips(this, 'success', title)
              this.getInfo()
            }
          }).catch(rj => {
            this.confirmLoading = false
            let title = (this.logInfo.id ? '编辑' : '新增') + '失败'
            this.$messageTips(this, 'error', title)
          })
        }
      })
    },
    getInfo () {
      let params = { id: this.$route.query.packageId, isGroup: this.isGroup }
      if (this.$route.meta.type === 'plan') {
        params.orderId = this.$route.query.orderId
      }
      api.getPackageById(params).then(rs => {
        if (rs && rs.data) {
          this.tableData = rs.data.setMealPreferentials
        }
      })
    },
    changeStatus (row, status) {
      let url = 'delTypeDiscount'
      let params = {
        id: row.id,
        isGroup: this.isGroup
      }
      let val = '删除成功'
      if (status !== 0) {
        url = 'changeTypeDiscount'
        params.status = status
        val = Number(status) === 1 ? '激活成功' : '停用成功'
      }
      api[url](params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', val)
          this.getInfo()
        }
      })
    },
    discountType (rule, value, callback) {
      if (Number(this.obj.discount) > 0 && Number(this.obj.discount) <= 100) {
        callback()
      } else {
        callback(new Error('请输入0-100之间的整数!'))
      }
    },
    disSetType (rule, value, callback) {
      if (Number(this.obj.totalPriceDisSet) > 0 || String(this.obj.totalPriceDisSet) === 0) {
        callback()
      } else {
        callback(new Error('请输入正整数!'))
      }
    }
  },
  created () {
    api.getTreeNodesByClinicId({ outOrgGetOrgListByConditionReqDTO: { idList: [storage.getLocalStorage('CLINICID')] } }).then(rs => {
      if (rs.head.errCode === 0 && rs.data.length) {
        this.cityCode = rs.data[0].cityCode
      }
    })
    activityApi.getClinicCityList().then(rs => {
      this.areasListOptions = rs && rs.data && rs.data.length ? rs.data : []
    })
  },
  watch: {
    'logInfoVisibile': {
      handler (newValue) {
        if (!newValue) {
          this.obj.preferentialName = ''
          this.obj.totalPriceDisSet = ''
          this.obj.discount = ''
          this.obj.remarks = ''
          this.obj.areasList = []
          this.startDate = ''
          this.endDate = ''
          this.logInfo.id = ''
          this.confirmLoading = false
          this.logInfo.title = '新增'
        }
      },
      immediate: true
    },
    'packageDetails.setMealPreferentials': {
      handler (val) {
        this.tableData = val
      },
      immediate: true
    },
    'packageDetails.discountSet': {
      handler (val, oldVal) {
        if (val !== oldVal && this.schema.length === 5) {
          this.schema.splice(1, 1)
        }
        if (this.schema.length !== 5 && this.packageDetails.discountSet === 2) {
          this.schema.splice(1, 0, {
            name: 'totalPriceDisSet',
            label: '折扣金额',
            props: {
              placeholder: '请输正整数'
            }
          })
          this.rules['totalPriceDisSet'] = [
            { validator: this.disSetType, trigger: 'blur' }
          ]
        } else if (this.schema.length !== 5 && this.packageDetails.discountSet === 1) {
          this.rules['discount'] = [
            { validator: this.discountType, trigger: 'blur' }
          ]
          this.schema.splice(1, 0, {
            name: 'discount',
            label: '折扣比例',
            props: {
              placeholder: '请输入0-100之间的整数'
            }
          })
        }
        this.obj = this.$ever.createObjFromSchema(this.schema)
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.btn-container {
  text-align: right;
}
.discount /deep/ .stop-use-color td div {
  color: red;
}
.discount /deep/ tr td:nth-child(2) {
  input {
    height: 24px;
  }
  .el-input-group__append {
    padding: 0 5px;
    color: #000;
  }
}
.log-form /deep/ .el-date-editor.el-input {
  width: 210px;
}
.ui_dialog_02 /deep/ .el-dialog__footer {
  border: none;
  .el-button {
    padding: 8px 15px;
  }
}
.discount /deep/ .el-row .el-col:nth-child(2) input {
  background: #fef5be;
}
.discount /deep/ .el-row .el-col:nth-child(2) .is-error input {
  background-color: #ffdede;
}
</style>


<template>
  <div>
    <ever-bread-crumb :name="obj.id ? '编辑模版' : '新建模版'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div id="addfeetemplate">
      <div class="layout_inner">
        <ever-form2
          class="ever_form_spe label_bold"
          ref="tplForm"
          :nosubmit="true"
          :rules="rules"
          :schema="schema"
          v-model="obj"
          labelWidth="80px"
        >
          <template slot="dptId" v-if="showDpt">
            <el-radio-group v-model="obj.dptId" v-if="dptData && dptData.length">
              <template v-if="dptData && dptData.length" v-for="(item, index) in dptData">
                <el-radio :label="item.id">{{item.name}}</el-radio>
              </template>
            </el-radio-group>
            <p v-else class="noRelateDpt">请联系管理员维护科室和人员关系后重试！</p>
          </template>
        </ever-form2>
      </div>
      <div class="layout_inner">
        <div class="send-body" style="position:relative;min-height:350px;">
          <el-table :data="tableData" :span-method="arraySpanMethod" v-if="tableData.length">
            <el-table-column prop="orderItemList" label="项目名称" width="410">
              <template slot-scope="scope">
                <template v-if="scope.row.orderItemList && scope.row.orderItemList.length">
                  <el-table class="el-table-child no-border" :data="scope.row.orderItemList" :show-header="false">
                    <el-table-column prop="serviceName" width="400">
                      <template slot-scope="scopes">
                        <template v-if="scope.row.orderItemList.length > 1 && ['301', '302'].includes(scope.row.serviceClassification)">
                          <template v-if="scope.row.orderItemList.length === 2">
                            <template v-if="scopes.$index === 0">
                              <i class="advice_main_icon">┏</i>{{scopes.row.serviceName}}</template>
                            <template v-if="scopes.$index === 1">
                              <i class="advice_main_icon">┗</i>{{scopes.row.serviceName}}</template>
                          </template>
                          <template v-else>
                            <template v-if="scopes.$index === 0">
                              <i class="advice_main_icon">┏</i>{{scopes.row.serviceName}}</template>
                            <template v-if="scopes.$index > 0 && scopes.$index < (scope.row.orderItemList.length - 1)">
                              <i class="advice_main_icon">┣</i>{{scopes.row.serviceName}}</template>
                            <template v-if="scopes.$index === (scope.row.orderItemList.length - 1)">
                              <i class="advice_main_icon">┗</i>{{scopes.row.serviceName}}</template>
                          </template>
                        </template>
                        <template v-else>
                          <template v-if="['303', '304'].includes(scope.row.adviceType)">
                            <span v-for="(drag, k) in JSON.parse(scope.row.adviceContent, true)" :key="k" class="eline">
                              <label>{{drag.serviceItem.name}}</label>
                              <label style="top:-5px;" class="lab" v-if="drag.footnote">(
                                <sys-value type="THC_SYS_DECOCTINGMETHOD" :code="drag.footnote"></sys-value>)</label>
                              <label style="bottom:-5px;" class="lab">{{drag.amount}}{{drag.amountUnitTxt}}</label>
                            </span>
                          </template>
                          <template v-else>
                            {{scopes.row.serviceName}}
                          </template>
                        </template>
                      </template>
                    </el-table-column>
                    <!-- 业务分类 -->
                    <el-table-column prop="finType">
                      <template slot-scope="scopes">
                        <sys-value type="THC_RCM_FIN_TYPE" :code="scopes.row.finType"></sys-value>
                      </template>
                    </el-table-column>
                    <el-table-column prop="spec">
                      <template slot-scope="scopes">
                        {{scopes.row.spec ? scopes.row.spec : '——'}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="quantity">
                      <template slot-scope="scopes">
                        <template v-if="scopes.row.quantity">
                          {{scopes.row.quantity}}{{scopes.row.unitName}}
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sellingPrice">
                      <template slot-scope="scopes">
                        {{scopes.row.price ? '￥' + Number(scopes.row.price).toFixed(2) : '￥0.00'}}
                      </template>
                    </el-table-column>
                    <el-table-column>
                      <template slot-scope="scopes" v-if="!scopes.$index">
                        <el-button type="primary" size="small" :disabled="!dptData.length" @click="editWaitData(scope.row, scope.$index)">编辑</el-button>
                        <ever-confirm
                          :msg="'确认删除该补费项？'"
                          :plain="true"
                          :action="'删除'"
                          :disabled="!dptData.length"
                          @confirm="delWaitData(scope.row, scope.$index)"
                        ></ever-confirm>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="业务分类">
            </el-table-column>
            <el-table-column label="规格">
            </el-table-column>
            <el-table-column label="数量">
            </el-table-column>
            <el-table-column label="单价">
            </el-table-column>
            <el-table-column label="操作">
            </el-table-column>
          </el-table>
          <ever-no-data
            style="position: absolute; margin: 0; width: 130px; height: 130px; left: 50%; margin-left: -65px; top: 50%;margin-top: -65px;"
            v-if="!tableData.length"
          ></ever-no-data>
        </div>
        <el-row class="send-footer" style="padding-top: 10px;">
          <el-col align="right">
            <el-button type="primary" @click="saveTemplate" :disabled="!tableData.length || !dptData.length">保存</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="layout_inner footarea">
        <h3 class="e_til">补费</h3>
        <div class="add_order_handle mt10">
          <ever-form2 v-ever-bind-enter ref="orderForm" :schema="querySchema" v-model="queryObj" :nosubmit="true" :gutter="10" :rules="feeRules" labelPosition="top" :row-flex="true">
            <template slot="serviceItem">
              <service-select class="service_select" v-model="queryObj.serviceItem" :type="adviceType" value-key="id" placeholder="" :scene="3" :is-add-tpl="true"></service-select>
            </template>
            <template slot="price">
              <div class="no_wrap">¥ {{queryObj.serviceItem && queryObj.serviceItem.price && queryObj.quantity ? (queryObj.serviceItem.price * queryObj.quantity).toFixed(2) : '0.00'}}</div>
            </template>
            <template slot="handlerBtn">
              <el-button type="primary" class="handle_btn" @click="supplyOrder" :disabled="supplyDisabled || !dptData.length">补费</el-button>
            </template>
          </ever-form2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/sob/store/casecontentdeptapi'
import agencysentence from '@/warehouse/page/agency/store/agencysentenceapi'
import storage from '@/util/storage'

let schema = [
  {
    name: 'dptId',
    label: '所属科室',
    comp: 'custom'
  },
  {
    name: 'name',
    label: '模版名称',
    span: 6,
    props: {
      placeholder: '请输入模版名称',
      maxlength: 20
    }
  }
]
let querySchema = [
  {
    name: 'serviceItem',
    label: '收费项目',
    comp: 'custom'
  },
  {
    name: 'quantity',
    label: '数量',
    comp: 'sys-text',
    span: 6,
    props: {
      type: 'number',
      append: '',
      field: {
        min: 1,
        max: 999
      }
    }
  },
  {
    name: 'price',
    label: '金额',
    comp: 'custom',
    span: 6
  },
  {
    name: 'handlerBtn',
    label: '　',
    comp: 'custom',
    span: 6
  }
]
export default {
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    obj.id = ''
    obj.type = ''
    obj.content = ''
    return {
      api,
      obj,
      schema,
      queryObj,
      querySchema,
      userId: this.$store.state.currentUser.userId,
      baseInfo: this.$route.query,
      visitType: this.$route.params.visitType ? parseInt(this.$route.params.visitType) : 1,
      dptData: [],
      tableData: [],
      sending: false,
      supplyDisabled: false,
      showDpt: false,
      adviceType: '301,302,303,304,800,801,802,867,2125,2126,2466,300,553',
      rules: {
        name: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      feeRules: {
        serviceItem: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        quantity: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        openProviderId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        executeProviderId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        finType: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        serviceName: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    '$store.state.currentUser': {
      handler (val) {
        this.userId = val.userId
      },
      deep: true
    },
    'userId' (val) {
      if (val) {
        this.getDepts()
      }
    },
    'obj.dptId' (val) {
      if (!this.dptData[0]) {
        return false
      }
      this.obj.dptName = this.dptData.filter(v => {
        return val === v.id
      })[0].name
    },
    'queryObj.serviceItem' (val) {
      this.$ever.getFieldFromSchema(this.querySchema, 'quantity').props.append = val.unitName
    }
  },
  created () {
    this.obj.id = this.$route.params.id
    if (this.visitType === 1) {
      this.obj.type = 100
    } else if (this.visitType === 3) {
      this.obj.type = 101
    } else if (this.visitType === 5) {
      this.obj.type = 16
    }
    this.baseInfo.userId = this.userId
    this.getDepts()
    this.setEditData()
  },
  methods: {
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let index = 0
      if (columnIndex === index) {
        return [1, 6]
      } else if (columnIndex > index) {
        return [0, 0]
      }
    },
    async getDepts () {
      this.dptData = []
      if (!this.userId) {
        return
      }
      const res = await agencysentence.getLocalSectionVoBySearch({relationType: 401, relationId: this.userId})
      this.showDpt = true
      if (res && res.length) {
        res.forEach(item => {
          this.dptData.push({id: item.sectionRecordId, name: item.name})
        })
        if (!this.obj.dptId) {
          this.obj.dptId = this.dptData[0].id
        }
      } else {
        this.supplyDisabled = true
      }
    },
    supplyOrder () {
      let isValid = true
      this.supplyDisabled = true
      this.$refs.orderForm.$refs.form.validate(valid => {
        if (!valid) {
          isValid = false
        }
      })
      if (isValid) {
        this.queryObj.orderItemList = []
        this.queryObj.serviceItem.name = this.queryObj.serviceItem.byname + (this.queryObj.serviceItem.name ? '（' + this.queryObj.serviceItem.name + '）  ' : '  ') + (this.queryObj.serviceItem.spec ? ' ' + this.queryObj.serviceItem.spec : '')
        if (this.queryObj.serviceItem.servSetItemList && this.queryObj.serviceItem.servSetItemList.length) {
          this.queryObj.orderItemList = this.queryObj.serviceItem.servSetItemList
          this.queryObj.price = this.queryObj.serviceItem.price
          this.queryObj.serviceItem.quantity = this.queryObj.quantity
        } else {
          this.queryObj.serviceItem.serviceName = this.queryObj.serviceItem.name
          this.queryObj.serviceItem.quantity = this.queryObj.quantity
          this.queryObj.orderItemList.push(this.queryObj.serviceItem)
        }
        delete this.queryObj.serviceItem.echo
        this.tableData.push(JSON.parse(JSON.stringify(this.queryObj)))
        this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
        this.$refs.orderForm.$refs.form.resetFields()
        setTimeout(() => {
          this.supplyDisabled = false
        }, 1000)
      } else {
        this.supplyDisabled = false
      }
    },
    editWaitData (item, index) {
      this.queryObj.serviceItem = item
      this.queryObj.quantity = item.quantity
      this.queryObj.price = item.price
      this.tableData.splice(index, 1)
    },
    delWaitData (item, index) {
      this.tableData.splice(index, 1)
    },
    saveTemplate () {
      this.$refs.tplForm.$refs.form.validate(v => {
        if (!v) {
          this.subDisabled = false
          return false
        }
        this.obj.content = JSON.stringify(this.tableData)
        this.api.createOrUpdate(this.obj).then(rs => {
          if (rs.head.errCode) {
            return false
          }
          this.$messageTips(this, 'success', '计费模版保存成功', '成功')
          storage.setLocalStorage('prescriptionTemplateType', '2')
          this.$router.push({ name: 'templateList', params: { query: { type: '2' } } })
        })
      })
    },
    setEditData () {
      if (!this.obj.id) {
        return false
      }
      this.api.getById(this.obj.id).then(rs => {
        Object.assign(this.obj, rs.data)
        this.tableData = JSON.parse(rs.data.content)
      })
    }
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
  .noRelateDpt {
    margin: 0;
    color: #ee4433;
  }
  .el-table-child {
    /deep/.el-table__body {
      width: 100% !important;
    }
    /deep/ .el-table__row {
      td {
        border-bottom: 1px solid #ccc !important;
        &:first-child {
          .cell {
            padding-left: 0;
          }
        }
      }
      &:last-child {
        td {
          border-bottom: none !important;
        }
      }
    }
  }
  .footarea {
    .e_til {
      font-size: 16px;
      margin: -20px -20px 0;
      padding: 10px 20px;
      border-bottom: 1px solid #ccc;
    }
    .add_order_handle {
      max-width: 70%;
      min-width: 800px;
      .no_wrap {
        white-space: nowrap;
      }
      .handle_btn {
        display: inline-block;
        vertical-align: top;
      }
    }
    /deep/ .el-form-item__label {
      justify-content: flex-start;
    }
  }
</style>

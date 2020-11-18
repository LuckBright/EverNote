<template>
  <div>
    <ever-bread-crumb name="组套管理" :path="path" v-if="isRouter"></ever-bread-crumb>
    <div class="layout_inner flex_col_1_auto">
      <div class="panel-body">
        <h4 v-if="isRouter">组套信息</h4>
        <!-- 基本信息表单 -->
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          @objsaved="afterSave"
          label-position="right"
        >
        </ever-form-model>
        <template v-if="extendForm && extendForm.schema && extendForm.schema.length">
          <h4 class="mt20">扩展信息</h4>
          <ever-form2
            :schema="extendForm.schema"
            v-model="extendForm.obj"
            label-position="right"
            :nosubmit="true"
          ></ever-form2>
        </template>
        <div>
          <div class="organization-table">
            <el-button class="save-btn" type="primary" :loading="btnLoading" @click="submit" v-if="!objId || belong === '1'">保存</el-button>
          </div>
        </div>
      </div>
      <div v-if="objId" class="panel-body" style="margin-top:45px">
        <el-tabs class="ever_tabs_top">
          <el-tab-pane label="组套子项">
            <el-button
              @click="onAddInsurance"
              type="primary"
              size="small"
              style="float: right;margin-bottom: 10px"
              v-if="belong === '1'"
            >添加</el-button>
            <el-table
              :data="newItemData"
              :border="false"
              tooltip-effect="dark"
              :summary-method="getSummaries"
              :show-summary="belong !== '1'"
              @selection-change="handleSelectionChange"
            >
              <el-table-column width="60" type="index"></el-table-column>
              <el-table-column prop="code" label="项目编号"></el-table-column>
              <el-table-column prop="name" label="医嘱项目名称">
                <template slot-scope="scope">
                  {{scope.row.byname || scope.row.name}}
                   <b style="fontWeight:normal" v-show='scope.row.byname != scope.row.name && scope.row.name && scope.row.byname'>({{scope.row.name}})</b>
                </template>
              </el-table-column>
              <el-table-column prop="itemName" label="分类">
                <template slot-scope="scope">
                  <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="quantity" label="数量"></el-table-column>
              <template v-for="item in priceColumns">
                <el-table-column
                  v-if="item.display"
                  :key="item.prop"
                  :prop="item.prop"
                  :label="item.label"
                  align="center"
                >
                  <template slot-scope="scope">
                    <price-td
                      :disabled="true || ((!+String(scope.row.isAdvice)[1]) && scope.row.isAdvice !== 1)"
                      :row="priceList[scope.row.id] || {}"
                      :td-key="item.prop"
                      :td-key-name="item.label"
                      :id="scope.row.id"
                      :key="item.prop"
                    ></price-td>
                  </template>
                </el-table-column>
              </template>
              <el-table-column prop label="操作" width="150" align="center" v-if="belong === '1'">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="primary"
                    @click.native.prevent="editRow(scope.$index, newItemData)"
                  >编辑</el-button>
                  <ever-confirm
                    :msg="'确定删除该项？'"
                    action="删除"
                    @confirm="deleteRow(scope.$index, newItemData)"
                  ></ever-confirm>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <template v-if="!isManage">
            <el-tab-pane label="开单科室">
              <associate-dept
                :flag="1"
                :belong="belong"
                :obj-detail="objDetail"
                :clinic-list="obj.relateOrgList"
                :advide-type="2"
              ></associate-dept>
            </el-tab-pane>
            <el-tab-pane label="执行科室">
              <associate-dept
                :flag="2"
                :belong="belong"
                :obj-detail="objDetail"
                :clinic-list="obj.relateOrgList"
                :advide-type="2"
              ></associate-dept>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
    </div>

    <serviceset-dialog
      v-if="objId"
      :title="title"
      :objId="objId"
      ref="serviceset"
      @selectChange="updateServiceSetList"
      :sel-data="newItemData"
    ></serviceset-dialog>
    <serviceset-child
      v-if="objId"
      ref="child"
      :childData="childData"
      :set-id="objId"
      @update="getChildList"
    ></serviceset-child>
  </div>
</template>
<script>
import ServicesetDialog from './servicesetdialog'
import ServicesetChild from './servicesetchildedit'
import sysvalue from '@/warehouse/store/sysvalueapi'
import api from '../../store/servicesetapi'
import form from '@/util/form'
import { createSchemaByItems } from '@/util/formcustom'
import associateDept from '../service-fee'
import { objRemove, objFind } from '@/util/common'
import priceInfo, {priceTd} from '@/manages/components/price.manage/price.info'

export default {
  mixins: [form],
  props: {
    isRouter: {
      type: Boolean,
      default: true
    },
    afterSaveCallback: Function
  },
  data () {
  /**
   * 组套新建编辑字段顺序
   * 系统分类/组套名称/英文名称/外送/检索码/销售单位/项目编码/原系统编码/状态/备注
   */
    let schema = [
      {
        name: 'serviceSetClassification1',
        type: 'cascader',
        label: '系统分类',
        options: []
      },
      {
        name: 'name',
        type: 'text',
        label: '组套名称',
        clearable: true,
        max: 40
      },
      {
        name: 'code',
        type: 'text',
        label: '项目编码',
        clearable: true,
        min: 1,
        max: 40
      },
      {
        name: 'unit',
        type: 'systype',
        label: '销售单位',
        code: 'THC_WH_DOSE_UNIT',
        clearable: true,
        useValue: true
      },
      {
        name: 'enName',
        type: 'text',
        label: '英文名称',
        clearable: true,
        min: 1,
        max: 80
      },
      {
        name: 'pinyinCode',
        type: 'text',
        label: '检索码',
        clearable: true,
        min: 1,
        max: 40
      },
      {
        name: 'refCode',
        type: 'text',
        label: '原系统编码',
        clearable: true,
        min: 1,
        max: 40
      },
      {
        name: 'outwardDelivery',
        type: 'checkbox',
        label: '',
        options: [
          { id: 1, name: '外送' }
        ]
      },
      // {
      //   name: 'relateOrgList1',
      //   type: 'custom',
      //   label: '关联机构'
      // },
      {
        name: 'isValid',
        label: '状态',
        type: 'systype',
        code: 'THC_SOB_AVAILABLE_STATE',
        useValue: true
      },
      {
        name: 'description',
        label: '备注',
        span: 24,
        type: 'textarea',
        max: 400
      }
    ]
    if (this.$route.params && this.$route.params.belong === '2') {
      schema.map(item => {
        item.disabled = true
        return item
      })
    }
    let obj = this.$ever.createObjFromSchema(schema)
    obj.serviceSetClassification = ''
    obj.serviceSetClassification1 = null
    obj.threeServiceClassify = []
    obj.isValid = '1'
    obj.belongType = '1'
    // obj.relateOrgList1 = []
    // obj.relateOrgList = []
    return {
      schema,
      obj,
      api,
      childData: null,
      objId: this.$route.params.id,
      title: '选择收费项目',
      itemData: [],
      belong: this.$route.params.belong || '1',
      rules: {
        name: [{ required: true, message: '必填项', trigger: 'blur' }],
        displayName: [
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '必填项', trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        serviceSetClassification1: [{ required: true, message: '必填项', trigger: ['blur'] }],
        unit: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
        isValid: [{ required: true, message: '必填项', trigger: 'change' }]
      },
      extendForm: {
        schema: [],
        obj: {},
        rules: []
      },
      templateId: '',
      objDetail: { isSet: 1 },
      wuziTypeOptions: [],
      isChange: true,
      path: '',
      clinicRecordList: [],
      btnLoading: false,
      priceList: [],
      priceColumns: []
    }
  },
  components: {
    ServicesetDialog,
    ServicesetChild,
    associateDept,
    priceTd: priceTd() // 价格显示组件
  },
  computed: {
    newItemData () {
      let arr = []
      this.itemData.forEach(item => {
        item.totalprice = item.quantity * item.price
        arr.push(item)
      })
      return arr
    }
  },
  async created () {
    if (this.$route.meta.thirdActiveIndex === '/manages/stackconcise') {
      this.path = '/manages/stackconcise'
    } else if (this.$route.meta.thirdActiveIndex === '/manages/stack') {
      this.path = '/manages/stack'
    } else {
      this.path = `/warehouse/serviceset/${this.$route.params.belong}`
    }
    // 判断是否在管理工作台
    this.isManage = this.$route.matched[0].meta.manage
    if (this.isManage) {
      this.belong = '1'
    } else {
      objRemove(this.schema, {name: 'isValid'})
    }
    // this.getClinicRecordList()
    sysvalue
      .cascade('THC_WH_OBJECT_TYPE', ['798'])
      .then(options => {
        this.wuziTypeOptions = options
        this._setSchemaParmas('798', 'serviceSetClassification1')
      })
    if (this.objId) {
      this.rules.pinyinCode = [
        // { required: true, message: '必填项', trigger: 'blur' },
        { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
      ]
    }
  },
  mounted () {
    // 疗程子项列表
    if (this.objId) {
      this.$ever.getFieldFromSchema(
        this.schema,
        'serviceSetClassification1'
      ).disabled = true
      this.$ever.getFieldFromSchema(
        this.schema,
        'code'
      ).disabled = true
      this._getServiceSetItemList()
    }
  },
  methods: {
    // 过滤物资分类
    _setSchemaParmas (type, str) {
      // this.obj.serviceSetClassification1 = []
      let list = []
      this.wuziTypeOptions.forEach(item => {
        if (item.id === '798') {
          list = item.children
        }
      })
      this.$ever.getFieldFromSchema(this.schema, str).options = list
      if (this.objId) {
        setTimeout(() => {
          this.obj.serviceSetClassification1 = [
            this.objDetail.serviceSetClassification
          ]
          if (this.objDetail.threeServiceClassify) {
            this.obj.serviceSetClassification1.push(this.objDetail.threeServiceClassify)
          }
        }, 300)
      }
    },
    submit () {
      let serviceAttrList = []
      for (let item in this.extendForm.obj) {
        let data = {
          //            templateId: this.templateId,
          fieldCode: item
        }
        if (this.objDetail.id) {
          data.serviceId = this.objDetail.id
        }
        if (
          this.extendForm.obj[item] &&
          this.extendForm.obj[item] instanceof Object
        ) {
          data.defValue = this.extendForm.obj[item].id
          data.defNameValue = this.extendForm.obj[item].name
        } else {
          data.defValue = this.extendForm.obj[item]
        }
        if (this.extendForm.obj[`${item}ValueSet`]) {
          data.valueSetJson = JSON.stringify(
            this.extendForm.obj[`${item}ValueSet`]
          )
          data.valueSetCode = this.extendForm.obj[`${item}ValueSet`].setCode
        }
        serviceAttrList.push(data)
      }
      this.obj.serviceAttrList = serviceAttrList
      // 转换项目分类
      this.obj.oneLevelType = '798'
      this.obj.serviceSetClassification = this.obj.serviceSetClassification1[0]
      this.obj.threeServiceClassify = this.obj.serviceSetClassification1[1]
      this.obj.outwardDeliveryFlag = this.obj.outwardDelivery ? 1 : 0
      this.submitForm().then((res) => {
        if (res.head.errCode === 0) {
          if (!this.isRouter) {
            this.$emit('success', res.data)
          } else {
            this.$notify({
              title: '提示',
              message: `${this.objId ? '修改' : '创建'}成功`,
              duration: 1000,
              type: 'success',
              onClose: () => {
                if (this.afterSaveCallback) {
                  this.afterSaveCallback()
                  return
                }
                this.$router.push({
                  path: this.$route.meta.thirdActiveIndex
                })
              }
            })
          }
        }
        this.btnLoading = false
      }).catch(() => {
        this.btnLoading = false
      })
    },
    submitForm () {
      return new Promise((resolve, reject) => {
        if (this.$refs.selfvalidate) {
          let comps = this.$refs.selfvalidate
          if (!Array.isArray(comps)) {
            comps = [comps]
          }
          for (let i = 0; i < comps.length; i++) {
            if (typeof comps[i].validate === 'function') {
              comps[i].validate(valid => {
                if (!valid) {
                  return reject('validate false')
                }
              })
            }
          }
        }
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.api.createOrUpdate(this.obj, this.isWarehouse).then(result => {
              resolve(result)
            }).catch(_ => {
              this.disabled = false
              reject('save error')
            })
          } else {
            this.disabled = false
            setTimeout(() => {
              var isError = document.getElementsByClassName('is-error')
              if (isError.length) {
                isError[0].querySelector('input').focus()
              }
            }, 1)
            reject('validate error')
          }
        })
      })
    },
    async getServiceItems (val) {
      if (
        val && !['300', '301', '302', '303', '304', '800', '801', '802', '867', '1124', '2125', '798', '799', '10003', '3002', '3001'].includes(val)
      ) {
        val = '867'
      }
      const res = await api.getServiceItems({ serviceClassification: val })
      if (res && res.schemaValue) {
        this.templateId = res.id
        this.setServiceItems(res.schemaValue, val)
      }
    },
    setServiceItems (schemaValue, val) {
      let schemaObj = JSON.parse(schemaValue)
      let opts = {
        setValue: true,
        showItems: [
          'entrust',
          'inremark',
          'decoction',
          'specimenType',
          'checkGuidance',
          'position',
          'positionValueSet'
        ]
      }
      if (val === '2125') {
        opts.showItems = [
          'entrust',
          'inremark',
          'decoction',
          'specimenType',
          'checkGuidance'
        ]
      }
      if (this.objId && this.belong === '2') {
        opts.disabled = true
      } else {
        opts.disabled = false
      }
      let extendForm = createSchemaByItems(schemaObj, opts)
      if (objFind(extendForm.schema, {name: 'specimenType'})) {
        extendForm.schema.unshift({
          name: 'specimenCount',
          label: '标本数量',
          comp: 'sys-text',
          props: {
            max: 9,
            min: 1,
            disabled: this.belong === '2' || false,
            type: 'number',
            field: {
              max: 9,
              min: 1,
              limitInteger: true
            }
          },
          span: 6
        })
        extendForm.obj.specimenCount = this.obj.specimenCount || 1
      }
      extendForm.schema.forEach(val => {
        val.props.clearable = true
      })
      this.extendForm = extendForm
    },
    updateServiceSetList () {
      // setTimeout(() => {
      this._getServiceSetItemList()
      // }, 100)
    },
    onAddInsurance () {
      // 协定方要到过去标识
      this.$refs.serviceset.onDialogOpen(this.obj, this.newItemData)
    },
    handleSelectionChange (val) {
      let _ids = []
      for (let _c of val) {
        _ids.push(_c.id)
      }
      this.obj.chargingItemId = _ids
    },
    editRow (index, rows) {
      this.childData = rows[index]
      this.$refs.child.onDialogOpen()
    },
    deleteRow (index, rows) {
      if (rows && rows[index]) {
        let params = {
          serviceSetId: this.objId,
          serviceId: rows[index].id
        }
        this.api.delItem(params).then(res => {
          rows.splice(index, 1)
          this.$messageTips(this, 'success', '删除成功', '提示')
        })
      }
    },
    getChildList () {
      this._getServiceSetItemList()
    },
    _getServiceSetItemList () {
      this.api
        .getServiceSetItemList({
          serviceSetId: this.objId
        })
        .then(res => {
          if (res && res.length) {
            // Object.assign(this.itemData, res).splice()
            this.itemData = res
            let orgId = this.$route.query.orgId
            if (orgId) {
              let itemIdList = res.map(item => item.id)
              this.getPriceList({orgId, itemIdList})
            }
          }
        })
    },
    // 获取组套子项价格体系
    async getPriceList (params) {
      let info = await priceInfo.getPriceConfig(params, 'item')
      this.priceColumns = info.columns.map(item => {
        item.display = true
        return item
      })
      let data = info.data
      this.itemData && this.itemData.forEach(item => {
        data[item.id] && Object.values(data[item.id]).forEach(v => {
          v.count = item.quantity
        })
      })
      this.priceList = data
    },
    // 组套明细汇总
    getSummaries (row) {
      const { columns } = row
      const sums = []
      let data = Object.values(this.priceList)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总'
          return
        }
        let col = objFind(this.priceColumns, {prop: column.property})
        let maxPointLen = 0
        if (col) {
          let total = data.reduce((sum, item) => {
            let v = item[column.property]
            let price = String(v && v.price || 0)
            let pointIndex = price.indexOf('.') + 1
            if (pointIndex) {
              maxPointLen = Math.max(maxPointLen, (price.length - pointIndex))
            }
            return sum + (v && (v.price * v.count))
          }, 0)
          sums[index] = isNaN(total) ? '-' : total.toFixed(maxPointLen)
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  },
  watch: {
    'obj.serviceSetClassification1' (val) {
      if (val && val.length && !this.objId) {
        this.getServiceItems(val[0])
      }
    },
    'obj.serviceSetClassification' (val) {
      if (val) {
        this._setSchemaParmas('798', 'serviceSetClassification1')
      }
    },
    '$route.params.belong' (val) {
      this.belong = val
    },
    objDetail: {
      handler (val) {
        if (
          val &&
          val.healthServiceTemplate &&
          val.healthServiceTemplate.schemaValue
        ) {
          this.setServiceItems(val.healthServiceTemplate.schemaValue)
          this.isChange = false
        }
        if (val.outwardDeliveryFlag) {
          this.obj.outwardDelivery = val.outwardDeliveryFlag === 1
        }
      },
      deep: true
    },
    'extendForm.obj.positionValueSet' (val) {
      if (val && val.setCode) {
        if (this.isChange) {
          this.extendForm.obj.position = ''
        } else {
          this.isChange = true
        }
        this.$ever.getFieldFromSchema(
          this.extendForm.schema,
          'position'
        ).props.code = val.setCode
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cell {
  font-size: 12px;
}
.panel-body {
  /deep/ .el-form {
    .el-form-item__content {
      height: 37px;
    }
  }
}
.cell .tit {
  display: inline-block;
  width: 10em;
  text-align: right;
}
.organization-table {
  padding:0 13px;
  position: relative;
  margin-top: 40px;
  .save-btn {
    position: absolute;
    right: 0;
  }
}
</style>

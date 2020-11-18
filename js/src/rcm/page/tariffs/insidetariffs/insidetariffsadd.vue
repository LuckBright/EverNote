<template>
  <div v-loading="loading">
    <ever-bread-crumb name="维护"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>价目表信息</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          :nosubmit="true"
          class="base-div-tree"
          ref="form"
          :span="8"
          :info="true"
          labelWidth="120px"
          label-position="right"
        >
          <template slot="validDateTime">
            <el-col :span="12">
              <el-form-item prop="finDate" label="日期范围">
                <date-picker v-model="obj.validDateTime" type="daterange" outformat="yyyy-MM-dd"></date-picker>
              </el-form-item>
            </el-col>
          </template>
          <template slot="baseType">
            <el-select v-model="obj.baseType" :disabled="!!objId">
              <el-option
                v-for="item in itemClassificationArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot="useClinicId">
            <el-tree
              :data="options"
              node-key="id"
              ref="tree"
              show-checkbox
              :check-strictly="true"
              :default-checked-keys="defaultcheck"
              v-show="!ifRoot"
              :props="defaultProps"
            ></el-tree>
            <span v-show="ifRoot">{{name}}</span>
          </template>
        </ever-form2>
        <h4 class="panel-hr">
          <el-button
            class="fr"
            type="primary"
            size="small"
            @click="loadAllDetail"
            :loading="btnAllLoading"
            :disabled="applybtn"
          >导入所有项目</el-button>
          <el-button
            class="fr"
            type="primary"
            size="small"
            style="margin-right:10px;"
            @click="loadDetail"
            :loading="btnLoading"
            :disabled="applybtn"
          >新增项目</el-button>项目明细
        </h4>
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          :api="api"
          :inline="true"
          :is-query="true"
          :info="true"
          v-if="objId"
          @query="query()"
        ></ever-form2>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column show-overflow-tooltip type="index" label="序号" width="60"></el-table-column>
          <el-table-column show-overflow-tooltip prop label="物资分类" v-if="baseType == 2">
            <template slot-scope="scope">
              <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop label="收费项分类" v-if="baseType == 1">
            <template slot-scope="scope">
              <sys-value type="THC_RCM_FIN_TYPE" :code="scope.row.finType"></sys-value>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="code" label="项目代码"></el-table-column>
          <el-table-column show-overflow-tooltip prop="itemName" label="项目名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="itemByName" label="通用名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="unit" label="单位"></el-table-column>
          <el-table-column show-overflow-tooltip label="单价(元)">
            <template slot-scope="scope">
              <el-input
                type="number"
                v-model="scope.row.price"
                @focus="handleFocusPrice(scope.row.price)"
                @change="handleInputPrice(scope.row.price, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="statusName" label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="delDetail(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:right;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="20"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
          ></el-pagination>
        </div>
      </div>
      <div class="panel-footer">
        <el-button type="primary" @click="updateBase()" :disabled="tableData.length == 0">保存</el-button>
      </div>
    </div>
    <base-tariffs-log
      :dialogMB.sync="dialogMB"
      :priceTableId="objId"
      :baseType="obj.baseType"
      @loadBaseDetail="loadBaseDetail"
    ></base-tariffs-log>
  </div>
</template>
<script>
import api from '@/rcm/store/tariffs/insidetariffsapi'
import medicalinsuexportApi from '@/insurance/store/medicalinsuexportapi'
import baseTariffsLog from './basetariffslog'
import list from '@/util/list'
import { checkAmountIntensiveReading } from '@/util/common'

var pickerOptions = {
  disabledDate (time) {
    return time.getTime() < Date.now() - 8.64e7
  }
}
var schema = [
  {
    name: 'baseType',
    comp: 'custom',
    span: 6,
    label: '内部交易类型'
  },
  {
    name: 'priceTableName',
    label: '价目表名称',
    span: 6,
    props: {
      maxlength: 30
    }
  },
  {
    name: 'validDateStart',
    label: '生效日期自',
    comp: 'date-picker',
    span: 6,
    props: {
      outformat: 'YYYY-MM-DD HH:mm:ss',
      pickerOptions: pickerOptions
    }
  },
  {
    name: 'validDateEnd',
    label: '生效日期至',
    comp: 'date-picker',
    span: 6,
    props: {
      outformat: 'YYYY-MM-DD HH:mm:ss',
      pickerOptions: pickerOptions
    }
  },
  // {
  //   name: 'useClinicId',
  //   span: 8,
  //   comp: 'custom',
  //   label: '适用机构'
  // }
]
var querySchema = [
  {
    name: 'keyword',
    label: '项目名称'
  }
]
export default {
  mixins: [list],
  components: {
    baseTariffsLog
  },
  data () {
    let rules = {
      priceTableName: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      validDateStart: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      validDateEnd: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      baseType: [
        { required: true, message: '必填项', trigger: ['blur', 'change'] }
      ]
    }
    let obj = this.$ever.createObjFromSchema(schema)
    obj.validDateStart = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    obj.validDateEnd = this.$moment('9999-12-31').format('YYYY-MM-DD HH:mm:ss')
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    obj.useClinicId = []
    return {
      schema,
      obj: obj,
      queryObj,
      querySchema,
      api,
      objId: this.$route.params.id,
      rules,
      tableData: [],
      totalCount: 0,
      loading: false,
      lock: true,
      current: 1,
      itemClassificationArr: [
        { id: '1', name: '跨机构发药' },
        // { id: '2', name: '跨机构调拨' }, // 2020-6-3 其他支持方未提供支持
      ],
      options: [],
      architectureList: [],
      ifRoot: true,
      name: '',
      curclinicId: '',
      applybtn: false,
      btnLoading: false,
      btnAllLoading: false,
      architectureId: '',
      defaultProps: {
        children: 'children',
        label: 'label',
        diycheck: false
      },
      actiondata: {},
      defaultcheck: [],
      isgroup: false,
      time: null,
      priceNum: 0,
      cachePriceNum: 0,
      dialogMB: false,
      baseType: 1
    }
  },
  methods: {
    delDetail (row) {
      let params = [{ id: row.id }]
      api.delDetails(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.query()
        }
      })
    },
    loadDetail () {
      let that = this
      that.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          that.dialogMB = true
        }
      })
    },
    loadAllDetail () {
      let that = this
      that.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let query = {
            serviceClassification: '',
            finType: '',
            itemName: ''
          }
          this.loadBaseDetail('ALL', [], query)
        }
      })
    },
    loadBaseDetail (importType, itemArray, query) { // 明细定价导入的保存
      let that = this
      that.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          that.loading = true
          let params = {
            priceTableName: that.obj.priceTableName,
            validDateStart: that.obj.validDateStart,
            validDateEnd: that.obj.validDateEnd,
            baseType: that.obj.baseType,
            useClinicIds: that.initUseClinicIds(),
            importByParam: {
              type: importType,
              serviceClassification: query.serviceClassification,
              finType: query.finType,
              itemName: query.itemName
            }
          }
          if (this.objId) {
            params.id = this.objId
          }
          if (importType === 'SELECTED') {
            params.importByParam.itemList = itemArray
          }
          if (this.tableData.length > 0) {
            params.pageItemList = this.tableData
          }
          api.priceSave(params).then(result => {
            that.loading = false
            if (result.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功')
              that.dialogMB = false
              that.objId = result.data
              if (that.objId) {
                that.$router.replace('/financeistall/insidetariffsedit/' + that.objId)
                this.list()
              }
            }
          }, errFn => {
            that.loading = false
          })
        }
      })
    },
    handleFocusPrice (price) {
      this.cachePriceNum = price
    },
    handleInputPrice (data, index) {
      let res = checkAmountIntensiveReading({ price: data, num: this.priceNum })
      if (res && res[0]) {
        this.cachePriceNum = res[0]
        this.$set(this.tableData[index], 'currentPrice', this.cachePriceNum)
      } else {
        this.$set(this.tableData[index], 'currentPrice', this.cachePriceNum)
        this.$messageTips(this, 'warning', `请输入小数点后${this.priceNum}位以内单价`)
      }
    },
    query () {
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.list()
    },
    async getSelect (id) {
      api.getSelect({ clinicId: id }).then(result => {
        if (!result.data.isTenant && result.data.orgTree && result.data.orgTree.length > 0) {
          this.ifRoot = true
          this.architectureId = result.data.orgTree[0]['clinicId']
          this.name = result.data.orgTree[0]['architectureName']
        } else if (result.data.isTenant && result.data.orgTree && result.data.orgTree.length > 0) {
          this.ifRoot = false
          this.architectureList = result.data.orgTree
          this.options = this.initOptions(this.architectureList)
        } else {
          this.name = ''
          this.applybtn = true
          this.$notify({
            message: '请前往(机构设置>组织管理)维护适用机构信息',
            type: 'error'
          })
        }
      })
    },
    initOptions (data) {
      data.forEach(function (item) {
        delete item.children
      })
      let map = {}
      data.forEach(function (item) {
        if (item.priceManageType === '0') {
          item['disabled'] = true
        }
        map[item.id] = item
      })
      let val = []
      data.forEach(function (item) {
        let parent
        item.label = item.architectureName || null
        item.id = item.clinicId
        parent = map[item.parentId]
        if (parent) {
          (parent.children || (parent.children = [])).push(item)
        } else {
          val.push(item)
        }
      })
      return val
    },
    list (val) {
      if (this.objId) {
        let params = {
          offset: this.offset,
          pagesize: this.pagesize,
          priceTableId: this.objId
        }
        params = Object.assign(params, this.queryObj)
        for (let key in params) {
          if (params[key] === '' || key === 'requestSwitch') {
            delete params[key]
          }
        }
        api.getTradingPriceAndDetails(params).then(result => {
          // if (result.data.useClinicList && result.data.useClinicList.length > 0) {
          //   this.initCheckedKeys(result.data.useClinicList)
          // }
          result.data.master.baseType = String(result.data.master.baseType)
          this.obj = Object.assign(this.obj, result.data.master)
          this.baseType = this.obj.baseType // 列表列数只有在数据获取后才更新
          this.initScheme(val)
          this.initaction(result)
          this.tableData = result.data.details
          this.totalCount = result.data.totalCount
        })
      }
    },
    initScheme (val) { // 只有首次加载的时候才做更新
      if (!val) return
      if (this.querySchema.length === 2) {
        this.querySchema.shift()
      }
      if (this.baseType === '2') {
        this.querySchema.unshift(
          {
            name: 'serviceClassification',
            label: '物资分类',
            comp: 'sys-type',
            props: {
              code: 'THC_WH_OBJECT_SUB_TYPE',
              useValue: false,
              clearable: true
            }
          }
        )
      } else {
        this.querySchema.unshift(
          {
            name: 'finType',
            label: '收费项分类',
            comp: 'sys-type',
            props: {
              code: 'THC_RCM_FIN_TYPE',
              useValue: true,
              clearable: true
            }
          }
        )
      }
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
    },
    initCheckedKeys (data) { // 适用机构回显时，需要根据当前机构是集团定价还是机构定价，如果是机构定价，则默认制灰，并且取消选中状态
      if (this.curclinicId) {
        this.initCheckedKeysTwo(data)
      } else {
        medicalinsuexportApi.getClinicInfo().then(result => { // 获取基本信息，机构id、机构名称
          this.curclinicId = result.data.id
          this.initCheckedKeysTwo(data)
        })
      }
    },
    initCheckedKeysTwo (data) {
      api.getSelect({ clinicId: this.curclinicId }).then(result => {
        if (result.data.isTenant && result.data.orgTree && result.data.orgTree.length > 0) {
          let json = result.data.orgTree
          let uses = []
          data.forEach(item => {
            let curinfo = json.find(key => String(key.clinicId) === String(item))
            if (curinfo && curinfo.priceManageType !== '0') {
              uses.push(item)
            }
          })
          this.$refs.tree.setCheckedKeys(uses)
        }
      })
    },
    initaction (json) {
      this.actiondata['topClinicid'] = json.data.master.clinicid
      this.actiondata['priceTableId'] = json.data.master.id
      this.actiondata['dataFrom'] = json.data.master.dataFrom
      this.actiondata['useClinicIds'] = []
    },
    initUseClinicIds () { // 保存时处理 适用机构数据
      // let useClinicIds = []
      // if (this.ifRoot) {
      //   useClinicIds.push(this.architectureId)
      // } else {
      //   let uses = this.$refs.tree.getCheckedKeys()
      //   uses.forEach(item => {
      //     useClinicIds.push(item)
      //   })
      // }
      // return useClinicIds
      return [this.orgId]
    },
    updateBase () {
      let that = this
      that.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          that.loading = true
          let len = 0
          that.tableData.forEach(item => {
            let price = String(item.price).split('.')
            if (price[1] && price[1].length > that.priceNum || price < 0) {
              len++
            }
          })
          if (len > 0) {
            that.$messageTips(that, 'warning', `请输入小数点后${that.priceNum}位以内正数单价`)
            that.loading = false
            return
          }
          let params = {
            priceTableName: that.obj.priceTableName,
            validDateStart: that.obj.validDateStart,
            validDateEnd: that.obj.validDateEnd,
            baseType: that.obj.baseType,
            useClinicIds: that.initUseClinicIds(),
            id: that.objId,
            pageItemList: that.tableData
          }
          api.priceSave(params).then(result => {
            that.loading = false
            if (result.head.errCode === 0) {
              that.$messageTips(that, 'success', '保存成功')
            } else {
              that.$messageTips(that, 'error', '更新失败，请重试')
            }
          }, errFn => {
            that.loading = false
          })
        }
      })
    }
  },
  async created () {
    api.getPricePrecision({}).then(res => {
      if (res && res.data) this.priceNum = res.data.scale
    })
    medicalinsuexportApi.getClinicInfo().then(result => {
      this.obj.name = result.data.name
      this.curclinicId = result.data.id
      // this.defaultcheck.push(result.data.id)
      // this.getSelect(result.data.id)
    })
    if (this.$route.params.id) {
      this.objId = this.$route.params.id
      this.list(true)
    }
    this.orgId = localStorage.getItem('CLINICID')
  },
  beforeDestroy () {
  },
  watch: {
    'obj.baseType': {
      handler (cur, old) {

      }
    }
  }
}
</script>
<style lang="less" scoped>
.base-div-tree {
  .el-col-4 {
    &:nth-child(2) {
      .el-form-item__content {
        margin-left: 20px !important;
      }
    }
    &:first-child .el-select {
      width: 100%;
    }
  }
  .el-tree {
    padding: 7px !important;
  }
}
</style>

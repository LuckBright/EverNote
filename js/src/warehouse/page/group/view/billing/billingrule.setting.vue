<template>
  <div class="layout_inner">
    <div v-if="isWarehouse" class="inventory">
      <span>计费联动库存</span>
      <el-switch v-model="allSwitch" @change="changeSwitch()"></el-switch>
      <p class="look_out">注：开启后，实物类收费项目计费时会联动库存</p>
    </div>
    <div class="config">
      <span>计费权限配置</span>
      <div class="look_out">
        <p>计费范围：设置哪些类型的收费项目，可以计费；欠费规则：设置哪些类型收费项目欠费后，也可以计费</p>
        <el-button v-if="isWarehouse" type="primary" @click="add()">新建</el-button>
      </div>
      <ever-table
        :isPagination="true"
        ref="table"
        :columns="columns"
        :data="tableData"
        @eventChange="eventChange"
      >
        <template slot="sceneCode" slot-scope="scope">
          <span>{{scope.row.sceneCodeAttr}}</span>
          <!-- <sys-value type="THC_PATIENT_HEADER" :code="scope.row.sceneCode"></sys-value> -->
        </template>
        <template slot="chargePermissionRange" slot-scope="scope">
          <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.chargePermissionRange"></sys-value>
        </template>
        <template slot="chargePermissionArrearageRule" slot-scope="scope">
          <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.chargePermissionArrearageRule"></sys-value>
        </template>
      </ever-table>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="45%">
      <ever-form2
        :rules="rules"
        labelWidth="80px"
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
      >
        <template slot="sceneCode">
          <span v-if="!isWarehouse">{{this.queryObj.sceneCodeAttr}}</span>
          <!-- <sys-value v-if="!isWarehouse" type="THC_PATIENT_HEADER" :code="queryObj.sceneCode"></sys-value> -->
          <el-select
            v-if="isWarehouse"
            v-model="queryObj.sceneCode"
            :placeholder="'请选择工作站'"
            style="width:100%;"
            :disabled="title === '编辑'"
          >
            <el-option
              v-for="item in scene"
              :key="item.sceneCode"
              :label="item.sceneCodeAttr"
              :value="item.sceneCode"
            ></el-option>
          </el-select>
        </template>
        <div slot="default"></div>
      </ever-form2>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/warehouse/page/group/store/billingapi.js'
import sysvalue from '@/warehouse/store/sysvalueapi'
let querySchema = [
  {
    name: 'sceneCode',
    comp: 'custom',
    label: '工作站:'
  },
  {
    name: 'chargePermissionRange',
    label: '计费范围:',
    comp: 'select',
    props: {
      options: [],
      multiple: true,
      filterable: true,
      clearable: true,
      placeholder: '请选择医嘱项目类型'
    },
    style: 'width:100%',
  },
  {
    name: 'chargePermissionArrearageRule',
    comp: 'ever-select',
    label: '欠费规则:',
    props: {
      options: [],
      multiple: true,
      filterable: true,
      clearable: true,
      placeholder: '请选择医嘱项目类型'
    }
  }
]
export default {
  data () {
    let queryobj = this.$ever.createObjFromSchema(querySchema)
    return {
      serviceType: '1',
      allSwitch: true,
      tableData: [],
      querySchema: querySchema,
      queryObj: queryobj,
      dialogVisible: false,
      scene: [],
      rowInfo: {},
      rules: {
        sceneCode: [
          {
            required: true,
            message: '请选择工作站',
            trigger: 'blur'
          }
        ]
      },
      title: '',
      isWarehouse: this.$route.path.indexOf('warehouse') > -1,
      columns: [
        {
          label: '工作站',
          slot: 'sceneCode',
          width: '150'
        },
        {
          label: '计费范围',
          slot: 'chargePermissionRange'
        },
        {
          label: '欠费计费规则',
          slot: 'chargePermissionArrearageRule'
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          width: '150',
          label: '操作',
          btns: [
            'edit',
            'del'
          ]
        }
      ]
    }
  },
  mounted () {
    if (!this.isWarehouse) this.columns[3].btns = ['edit']
    // 查询联动
    if (this.isWarehouse) this.getIsOutStock()
    // 查询机构或集团列表
    this.getChargeRulePermission()
    sysvalue.cascade('THC_WH_OBJECT_SUB_TYPE')
      .then(options => {
        let arr = []
        options.forEach(val => {
          if (!['299', '341', '503', '504', '553'].includes(val.id)) {
            arr.push(val)
          }
        })
        this.$ever.getFieldFromSchema(this.querySchema, 'chargePermissionRange').props.options = arr
        this.$ever.getFieldFromSchema(this.querySchema, 'chargePermissionArrearageRule').props.options = arr
      })
  },
  methods: {
    async add () {
      this.title = '新建'
      this.dialogVisible = true
      this.queryObj.sceneCode = ''
      this.queryObj.chargePermissionRange = []
      this.queryObj.chargePermissionArrearageRule = ''
      this.rowInfo = {}
      this.getDefaultChargeRulePermission()
    },
    // 查询工作站
    async getDefaultChargeRulePermission () {
      let res = await api.getDefaultChargeRulePermission()
      this.scene = res.data
      this.tableData.forEach(val => {
        if (this.rowInfo.sceneCode !== val.sceneCode) this.scene.splice(this.scene.findIndex(item => val.sceneCode === item.sceneCode), 1)
      })
    },
    async getIsOutStock () {
      let res = await api.getIsOutStock()
      if (res.data === 1) this.allSwitch = true
      else this.allSwitch = false
    },
    async getChargeRulePermission () {
      let res = this.isWarehouse ? await api.getChargeRulePermission() : await api.getDefaultChargeRulePermission()
      if (res) {
        this.tableData = res.data
        // 查询工作站
        this.getDefaultChargeRulePermission()
      }
    },
    async changeSwitch () {
      let obj = {
        categoryCode: 'CHARGE_IS_OUT_STOCK',
        categoryValues: this.allSwitch ? 1 : 2
      }
      let res = await api.updateIsOutStock(obj)
      if (res) {
        this.$messageTips(this, 'success', '保存成功')
      }
    },
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    edit (row) {
      this.title = '编辑'
      this.rowInfo = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.queryObj.sceneCodeAttr = row.sceneCodeAttr
      this.queryObj.sceneCode = row.sceneCode
      this.queryObj.chargePermissionRange = row.chargePermissionRange ? row.chargePermissionRange.split(',') : ''
      this.queryObj.chargePermissionArrearageRule = row.chargePermissionArrearageRule ? row.chargePermissionArrearageRule.split(',') : ''
      this.getDefaultChargeRulePermission()
    },
    async del (row) {
      let obj = {
        categoryCode: 'CHARGE_PERMISSION',
        sceneCode: row.sceneCode
      }
      let res = await api.deleteChargeRulePermission(obj)
      if (res) {
        this.$messageTips(this, 'success', '删除成功')
        this.getChargeRulePermission()
      }
    },
    async save () {
      this.$refs.form.$refs.form.validate((valid) => {
        if (valid) {
          let sceneObj = this.scene.find((item) => item.sceneCode === this.queryObj.sceneCode)
          let obj = {
            sceneCodeAttr: sceneObj.sceneCodeAttr,
            sceneCode: this.queryObj.sceneCode,
            chargePermissionRange: this.queryObj.chargePermissionRange ? this.queryObj.chargePermissionRange.join(',') : '',
            chargePermissionArrearageRule: this.queryObj.chargePermissionArrearageRule ? this.queryObj.chargePermissionArrearageRule.join(',') : ''
          }
          obj = Object.assign(this.rowInfo, obj)
          this.isWarehouse ? this.updateRequer('updateChargeRulePermission', obj) : this.updateRequer('updateDefaultChargeRulePermission', obj)
        } else {
          return false
        }
      })
    },
    updateRequer (name, obj) {
      api[name](obj).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '保存成功')
          this.dialogVisible = false
          this.getChargeRulePermission()
        }
      })
    }
  },
  // watch: {
    // 'queryObj.chargePermissionRange' (val) {
      // sysvalue.cascade('THC_WH_OBJECT_SUB_TYPE')
      //   .then(options => {
      //     let arr = []
      //     if (this.queryObj.chargePermissionArrearageRule) {
      //       this.queryObj.chargePermissionArrearageRule.forEach(el => {
      //         if (val.includes(el)) arr.push(el)
      //       })
      //       this.queryObj.chargePermissionArrearageRule = arr
      //     }
      //   })
    // }
  // },
  // components: {
  // }
}
</script>
<style lang="scss" scoped>
.inventory,
.config {
  span {
    margin-right: 20px;
    font-weight: 400;
    font-size: 15px;
  }
  .look_out {
    font-size: 13px;
    color: #666;
    display: flex;
    span {
      margin-right: 0px;
      font-size: 13px;
      color: red;
    }
    p {
      flex: 1;
    }
  }
  // /deep/ .el-select--small {
  //   width: 100%!important;
  // }
}
.inventory {
  margin-bottom: 40px;
}
</style>

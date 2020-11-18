<template>
  <div>
    <ever-bread-crumb :name="'编辑编号'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2
        :schema="schema"
        v-model="obj"
        :api="api"
        ref="form"
        :rules="rules"
        class="pdt20"
        label-position="right"
      >
        <template slot="tenantId">
          <ever-org-select v-model="obj.tenantId" v-if="obj.isGlobal == 3" type="select" :isOrg="false" fields="code"></ever-org-select>
          <ever-select v-model="obj.tenantId" v-else :options="tenantArr" :disabled="isGlobalDisable"></ever-select>
        </template>
        <template slot="explain">
          <div style="margin-left:-70px;">
            <label for="注解说明">注解说明</label><br>
            <label for="">a、“类型”的解释：“默认编号规则”类型的，用于产生集团编号，默认编号规则不可删除；每个机构必须配置“机构专属规则”的编号规则，否则将会报错。</label><br>
            <label for="">b、业务使用的解释：默认编号规则将同时产生集团号和机构号，这里标注业务组默认使用的是集团号还是机构号。</label>
          </div>
        </template>
        <template slot="configWay">
          <el-form-item label="业务使用" v-if="obj.isGlobal === '2'" style="margin-left:-120px;">
            <el-select v-model="obj.configWay">
              <el-option
                v-for="item in configArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <div slot="default"></div>
      </ever-form2>
    </div>
    <div class="layout_inner">
      <h4 style="height:36px;line-height:36px;margin: 0 0 10px;">编号配置
        <el-button type="primary" @click="save" style="float:right">保存</el-button>
      </h4>
      <el-table :data="tableData" border>
        <el-table-column
          prop="name"
          label="配置名称"
          :span="1"
          align="left"
          :cell-style="'background-color:green;'"
        ></el-table-column>
        <el-table-column label="说明" prop="state" align="left" :span="2"></el-table-column>
        <el-table-column label="内容" align="center" :span="3">
          <template slot-scope="scope">
            <div v-if="scope.$index == 0">
              <el-input v-model="prefix" :maxlength="3" @blur="checkInput"></el-input>
            </div>
            <div v-if="scope.$index == 2">
              <ever-select v-model="firmType" :options="optionsArr"></ever-select>
            </div>
            <div v-if="scope.$index == 3">
              <ever-select v-model="birthValue" :options="dataType"></ever-select>
            </div>
            <div v-if="scope.$index == 4">
              <el-row>
                <el-col :span="12">
                  <el-select v-model="serial" placeholder="请选择" style="vertical-align: text-top;">
                    <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-input-number
                    v-model="flowNumber"
                    placeholder="编号起始值如: 1"
                    :min="1"
                    :max="100000000"
                    style="margin-top: 3px;line-height: 26px;"
                  ></el-input-number>
                </el-col>
              </el-row>
            </div>
            <div v-if="scope.$index == 5">
              <el-input v-model="suffix" :maxlength="3" @blur="checkInput"></el-input>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="配置顺序" align="center" :span="2">
          <template slot-scope="scope">
            <el-input-number
              class="orderNumber"
              v-model="scope.row.orderNumber"
              :min="1"
              :max="6"
              label="描述文字"
              style="margin-top: 3px;line-height: 26px;"
            ></el-input-number>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>
<script>
import api from '@/crm/store/numberapi'
export default {
  data () {
    let isGlobalDisable = this.$route.query.numberId ? true : false
    let schema = [
      {
        name: 'illustrate',
        label: '编号说明',
        comp: 'el-input',
        props: {
          type: 'textarea',
          minRows: 4,
          maxRows: 4,
          placeholder: '请输入内容'
        },
        span: 21
      },
      {
        name: 'codeName',
        label: '编号名称',
        comp: 'sys-type',
        props: {
          code: 'THC_SYS_RULE_CONFIG',
          useValue: true
        },
        span: 7
      },
      {
        name: 'isGlobal',
        label: '类型',
        comp: 'sys-type',
        props: {
          code: 'THC_PATIENT_NO_TYPE',
          useValue: true,
          disabled: isGlobalDisable
        },
        span: 7
      },
      {
        name: 'tenantId',
        label: '归属',
        comp: 'custom',
        span: 6
      },
      {
        name: 'configWay',
        comp: 'custom',
        span: 6
      },
      {
        name: 'explain',
        comp: 'custom',
        span: 24
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.configWay = 1
    return {
      api,
      schema,
      obj,
      pageType: this.$route.params.type,
      tableData: [],
      prefix: '',
      flowNumber: '',
      firmType: '',
      birthValue: '',
      suffix: '',
      serial: 1,
      rulerItemList: [],
      tenantArr: [],
      numberId: this.$route.query.numberId ? this.$route.query.numberId : '',
      sourceId: '',
      isGlobalDisable: this.$route.query.numberId ? true : false,
      optionsArr: [
        {
          id: '1',
          name: '需要'
        },
        {
          id: '0',
          name: '不需要'
        }
      ],
      dataType: [
        {
          id: '0',
          name: '年'
        },
        {
          id: '1',
          name: '年月'
        },
        {
          id: '2',
          name: '年月日'
        },
        {
          id: '3',
          name: '不需要'
        }
      ],
      configArr: [
        {
          value: 1,
          label: '集团号'
        },
        {
          value: 2,
          label: '机构号'
        }
      ],
      configRequire: false,
      rules: {
        codeName: [
          { required: true, message: '请选择编号名称', trigger: 'blur' }
        ],
        isGlobal: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        tenantId: [
          { required: true, message: '请选择归属', trigger: 'blur' }
        ],
        configWay: [
          { required: this.configRequire, message: '请选择编号配置', trigger: 'change', type: 'number' }
        ]
      },
      cacheIsGlobal: ''
    }
  },
  created () {
    if (this.numberId) {
      this.getById(this.numberId)
    } else {
      this.getName()
    }
    this.getBlocInfo()
  },
  watch: {
    'obj.isGlobal': {
      handler (val) {
        if (val === '1') {
          this.tenantArr = []
        } else if (val === '2') {
          // this.obj.configWay = ''
          this.getBlocInfo()
        }
        if (this.cacheIsGlobal !== val) this.obj.tenantId = ''
        this.cacheIsGlobal = val
        this.configRequire = val === '2'
      }
    },
    'obj': {
      handler (val) {
        if (val.codeName && val.isGlobal && val.tenantId) {
          this.getSource()
        }
      },
      deep: true
    }
  },
  methods: {
    save () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (!this.checkInput()) {
            this.$notify({
              type: 'error',
              message: '请按照说明配置'
            })
          } else {
            this.editObj()
            this.api.createOrUpdate(this.obj).then(rs => {
              if (rs.head.errCode === 0) {
                this.$router.push({ name: 'membernumberlist' })
              }
            })
          }
        }
      })
    },
    getBlocInfo () {
      let tenantId = this.$store.state.currentUser.tenantId
      let name = this.$store.state.currentUser.organizationName
      let tempArr = []
      let obj = {}
      obj['id'] = String(tenantId)
      obj['name'] = name
      tempArr.push(obj)
      this.tenantArr = tempArr
    },
    getById (id) {
      this.api.getById({ 'id': id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.cacheIsGlobal = rs.data.isGlobal
          Object.assign(this.obj, rs.data)
          this.tableData = rs.data.rulerItemList
          this.prefix = rs.data.rulerItemList[0].valueName
          this.firmType = rs.data.rulerItemList[2].valueName
          this.birthValue = rs.data.rulerItemList[3].valueName
          this.flowNumber = rs.data.rulerItemList[4].valueName
          this.serial = rs.data.rulerItemList[4].serialNumberLength
          this.suffix = rs.data.rulerItemList[5].valueName
          if (rs.data.isGlobal === '3') {
            this.obj.tenantId = rs.data.orgId ? String(rs.data.orgId) : ''
          } else {
            this.obj.tenantId = rs.data.tenantId && String(rs.data.tenantId)
          }
        }
      })
    },
    getName () {
      this.api.getByName().then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data
        }
      })
    },
    editObj () {
      this.obj.id = this.numberId
      this.rulerItemList = []
      let prefix = {
        'name': '前缀',
        'valueName': this.prefix,
        'orderNumber': '1'
      }
      let Iden = {
        'name': '应用标识',
        'orderNumber': '2'
      }
      let firmType = {
        'name': '业务类型',
        'valueName': this.firmType,
        'orderNumber': '3'
      }
      let birthValue = {
        'name': '日期',
        'valueName': this.birthValue,
        'orderNumber': '4'
      }
      let orderValue = {
        'name': '流水号',
        'valueName': this.flowNumber,
        'serialNumberLength': this.serial,
        'orderNumber': '5'
      }
      let suffix = {
        'name': '后缀',
        'valueName': this.suffix,
        'orderNumber': '6'
      }
      this.rulerItemList.push(prefix)
      this.rulerItemList.push(Iden)
      this.rulerItemList.push(firmType)
      this.rulerItemList.push(birthValue)
      this.rulerItemList.push(orderValue)
      this.rulerItemList.push(suffix)
      this.obj.rulerItemList = this.rulerItemList
    },
    checkInput () {
      let reg = /(\d{0,3})|(\w{0,3})/
      if (!reg.test(this.prefix) || !reg.test(this.suffix)) {
        return false
      } else {
        return true
      }
    },
    getSource () {
      api.getSourceId({
        setCode: this.obj.codeName,
        isGlobal: this.obj.isGlobal,
        sourceId: this.obj.tenantId
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.flowNumber = rs.data
        }
      })
    }
  }
}
</script>
<style scoped>
.pdt20 {
  padding-top: 20px;
}
.orderNumber {
  width: 120px;
}
</style>

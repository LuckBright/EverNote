<template>
  <div class="adverse_drug">
    <div class="row">
      <div class="left">
        <div class="title">
          <span class="span"></span>药品不良事件登记
        </div>
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          :inline="false"
          :rules="rules"
          ref="form"
          :nosubmit="true"
        >
          <template slot="patientId">
            <ever-patient-select
              :key="queryObj.patientId"
              v-model="queryObj.patientId"
              @select="selectPatient"
              :allow-create="false"
              :showAttrType="false"
            ></ever-patient-select>
          </template>
          <template
            slot="patientNo"
          >{{patient.patientOrg && patient.patientOrg.patientNumber || '--'}}</template>
          <template slot="phone">{{patient.mobile || '--'}}</template>
          <template slot="isImpact">
            <el-radio-group v-model="queryObj.isImpact">
              <el-radio label="1">有</el-radio>
              <el-radio label="0">无</el-radio>
            </el-radio-group>
          </template>
          <template slot="scene">
            <el-radio disabled v-model="queryObj.scene" label="1">门诊</el-radio>
          </template>
          <template slot="localMeterialId">
            <el-select
              v-model="queryObj.localMeterialId"
              filterable
              remote
              clearable
              placeholder="请输入关键词"
              @focus="remoteMethod('')"
              @change="select"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in drugNameOptions"
                :key="item.localMaterialId"
                :label="item.selfName"
                :value="item.localMaterialId"
              ></el-option>
            </el-select>
          </template>
          <template slot="diagnosis">
            <div style="width:100%;overflow:hidden">
              <ever-diagnosis ref="diagnosis" v-model="queryObj.diagnosis" :check="true"></ever-diagnosis>
            </div>
          </template>
          <template slot="finderId">
            <el-select clearable v-model="queryObj.finderId">
              <el-option label="患者" value="患者"></el-option>
              <el-option label="护士" value="护士"></el-option>
              <el-option label="药师" value="药师"></el-option>
              <el-option label="医生" value="医生"></el-option>
            </el-select>
          </template>
          <template slot="finder">
            <el-select clearable v-model="queryObj.finder">
              <el-option label="护士" value="护士"></el-option>
              <el-option label="药师" value="药师"></el-option>
              <el-option label="医生" value="医生"></el-option>
            </el-select>
          </template>
          <template slot="button">
            <el-button @click="createAdverseDrugReaction" type="primary" class="sure-btn">确定</el-button>
            <el-button @click="reset" class="reset-btn">重置</el-button>
          </template>
        </ever-form2>
      </div>
      <div class="flex_column_1_hidden right">
        <ever-form2
          :schema="querySchemaQuery"
          v-model="queryObjQuery"
          :inline="true"
          ref="form2"
          :nosubmit="true">
          <template slot="query">
            <ever-patient-select
              :key="queryObjQuery.query"
              v-model="queryObjQuery.query"
              @select="selectPatientRight"
              :allow-create="false"
              :showAttrType="false"
            ></ever-patient-select>
          </template>
          <template slot="localMaterialId">
            <el-select
              v-model="queryObjQuery.localMeterialId"
              filterable
              remote
              clearable
              placeholder="请输入关键词"
              @focus="remoteMethod('')"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in drugNameArr"
                :key="item.localMaterialId"
                :label="item.selfName"
                :value="item.localMaterialId"
              ></el-option>
            </el-select>
          </template>
          <template slot="isImpact">
            <el-select clearable v-model="queryObjQuery.isImpact">
              <el-option label="有" value="1"></el-option>
              <el-option label="无" value="0"></el-option>
            </el-select>
          </template>
          <template slot="button">
            <el-button @click="getAdverseDrugReaction">查询</el-button>
          </template>
        </ever-form2>
        <div class="flex_col_1_hidden main-wrap">
          <el-table height="100%" :data="tableData" border class="table-height-30" style="width: 100%">
            <el-table-column prop="reactionTime" label="发生时间" width="135">
              <template
                slot-scope="scope"
              >{{scope.row.reactionTime | formatDateByExp("YYYY-MM-DD HH:mm")}}</template>
            </el-table-column>
            <el-table-column prop="patient.name" label="患者" width="80"></el-table-column>
            <el-table-column prop="patient.sex" label="性别" width="60">
              <template slot-scope="scope">{{scope.row.patient && scope.row.patient.sex | formatSex}}</template>
            </el-table-column>
            <el-table-column prop="patient.birthday" label="出生日期" width="180">
              <template
                slot-scope="scope"
              >{{scope.row.patient && scope.row.patient.birthday | formatDateByExp("YYYY-MM-DD")}}</template>
            </el-table-column>
            <el-table-column prop="phone" label="电话" width="120"></el-table-column>
            <el-table-column prop="drugName" label="药品名称" width="180"></el-table-column>
            <el-table-column prop="produceName" label="生产厂商" width="180"></el-table-column>
            <el-table-column prop="spec" label="药品规格" width="100"></el-table-column>
            <el-table-column prop="dosage" label="用法" width="120">
              <template slot-scope="scope">
                <sys-value type="CV06.00.102" :code="scope.row.dosage"></sys-value>
              </template>
            </el-table-column>
            <el-table-column prop="frequency" label="频次" width="100">
              <template slot-scope="scope">
                {{scope.row.frequency |options(frequencyOptions)}}
              </template>
            </el-table-column>
            <el-table-column prop="measure" label="剂量" width="80"></el-table-column>
            <el-table-column prop="contentunit" label="单位" width="80"></el-table-column>
            <el-table-column prop="diagnosisStr" label="原诊断" width="180"></el-table-column>
            <el-table-column prop="drugReactionType" label="不良反应类型" width="180">
              <template slot-scope="scope">
                <sys-value type="THC_CLINICAL_ADVERSE_EVENT" :code="scope.row.drugReactionType"></sys-value>
              </template>
            </el-table-column>
            <el-table-column prop="symptom" label="出现症状" width="180"></el-table-column>
            <el-table-column prop="processing" label="处理过程" width="180"></el-table-column>
            <el-table-column prop="isImpact" label="对原疾病影响" width="120">
              <template slot-scope="scope">{{scope.row.isImpact == '1' ? '有':'无'}}</template>
            </el-table-column>
            <el-table-column prop="finderId" label="发现人" width="100"></el-table-column>
            <el-table-column prop="finder" label="报告人" width="100"></el-table-column>
            <el-table-column prop="creator" label="录入人员" width="100"></el-table-column>
            <el-table-column prop="createTime" label="录入时间" width="100">
              <template
                slot-scope="scope"
              >{{scope.row.createTime | formatDateByExp("YYYY-MM-DD HH:mm")}}</template>
            </el-table-column>
            <el-table-column prop="updater" label="修改人员" width="100"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="180">
              <template
                slot-scope="scope"
              >{{scope.row.updateTime | formatDateByExp("YYYY-MM-DD HH:mm")}}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="getAdverseDrugReactionById(scope.row.id)"
                >修改</el-button>
                <el-button type="danger" plain size="small" @click="drop(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/workspace/store/inhospital.js'
import sysvalue from '@/warehouse/store/sysvalueapi'
import storage from '@/util/storage.js'
import recipeapi from '@/workspace/store/recipeapi.js'
// import { isJsonStr } from '@/util/common'
import { searchFuzzy } from '@/rcm/store/inpatientSettlement/inpatientSettlement.js'
let querySchema = [
  {
    name: 'patientId',
    label: '患者姓名/编号',
    span: 18,
    comp: 'custom'
  },
  {
    name: 'scene',
    span: 6,
    comp: 'custom'
  },
  {
    name: 'patientNo',
    label: '患者档案号',
    span: 12,
    comp: 'custom'
  },
  {
    name: 'phone',
    label: '联系电话',
    span: 12,
    comp: 'custom'
  },
  {
    name: 'reactionTime',
    label: '发生时间',
    comp: 'elDatePicker',
    props: {
      span: 24,
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      placeholder: '选择日期'
    }
  },
  {
    name: 'localMeterialId',
    label: '药品名称',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'produceName',
    label: '生产厂商',
    span: 24,
    comp: 'el-input',
    props: {
      disabled: true,
      clearable: true
    }
  },
  {
    name: 'spec',
    label: '药品规格',
    span: 12,
    comp: 'el-input',
    props: {
      disabled: true,
      clearable: true
    }
  },
  {
    name: 'measure',
    label: '剂量',
    span: 12,
    props: {
      placeholder: '剂量'
    },
    slots: [
      {
        name: 'append',
        template: '<span>--</span>'
      }
    ]
  },
  {
    name: 'dosage',
    label: '用法',
    comp: 'sys-type',
    span: 12,
    props: {
      code: 'CV06.00.102'
    }
  },
  {
    name: 'frequency',
    label: '频次',
    span: 12,
    comp: 'el-select',
    props: {
      options: []
    }
  },
  {
    name: 'drugReactionType',
    label: '不良反应类型',
    span: 24,
    comp: 'sys-type',
    props: {
      code: 'THC_CLINICAL_ADVERSE_EVENT'
    }
  },
  {
    name: 'isImpact',
    label: '对原疾病影响',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'diagnosis',
    label: '原来诊断',
    comp: 'custom'
  },
  {
    name: 'symptom',
    label: '出现症状',
    comp: 'el-input',
    props: {
      type: 'textarea',
      maxlength: 200
    }
  },
  {
    name: 'processing',
    label: '处理过程',
    comp: 'el-input',
    props: {
      type: 'textarea',
      maxlength: 200
    }
  },
  {
    name: 'finderId',
    label: '发现人员',
    span: 12,
    comp: 'custom'
  },
  {
    name: 'finder',
    label: '报告人员',
    span: 12,
    comp: 'custom'
  },
  {
    name: 'button',
    comp: 'custom',
    span: 24
  }
]
let querySchemaQuery = [
  {
    name: 'query',
    label: '患者姓名/编号',
    span: 18,
    comp: 'custom',
    props: {
      clearable: true
    }
  },
  {
    name: 'drugReactionType',
    label: '不良反应类型',
    span: 24,
    comp: 'sys-type',
    props: {
      code: 'THC_CLINICAL_ADVERSE_EVENT'
    }
  },
  {
    name: 'isImpact',
    label: '对原疾病影响',
    span: 24,
    comp: 'custom'
  },
  // {
  //   name: 'classifyId',
  //   label: '药品类型',
  //   span: 24,
  //   comp: 'sys-type',
  //   props: {
  //     code: 'THC_WH_OBJECT_SUB_TYPE   '
  //   }
  // },
  {
    name: 'localMaterialId',
    label: '药品名称',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'button',
    comp: 'custom',
    span: 24
  }
]
export default {
  components: {
  },
  filters: {
    options (id, options) {
      let txt = '--'
      options.forEach(ele => {
        if (ele.id === id) txt = ele.name
      })
      return txt
    }
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    let queryObjQuery = this.$ever.createObjFromSchema(querySchemaQuery)
    queryObj.scene = '1'
    function arrval (rule, value, callback) {
      if (value.length === 0) {
        callback(new Error('请选择原来诊断!'))
      } else {
        callback()
      }
    }
    function numbers (rule, value, callback) {
      if (!value || isNaN(Number(value))) {
        callback(new Error('请输入剂量!'))
      } else {
        callback()
      }
    }
    return {
      api,
      queryObj,
      recipeapi,
      querySchema,
      querySchemaQuery,
      queryObjQuery,
      rules: {
        diagnosis: [
          { required: true, message: '请选择原来诊断', validator: arrval }
        ],
        measure: [
          { required: true, message: '请输入剂量', validator: numbers }
        ],
        patientId: [
          { required: true, message: '请选择患者', trigger: 'change', type: 'string' }
        ],
        frequency: [
          { required: true, message: '请选择频次', trigger: 'change', type: 'string' }
        ],
        dosage: [
          { required: true, message: '请选择用法', trigger: 'change', type: 'string' }
        ],
        spec: [
          { required: true, message: '请选择药品规格', trigger: 'change', type: 'string' }
        ],
        produceName: [
          { required: true, message: '请输入生产厂商', trigger: 'change', type: 'string' }
        ],
        reactionTime: [
          { required: true, message: '请选择发生时间', trigger: 'change', type: 'string' }
        ],
        finder: [
          { required: true, message: '请选择报告人员', trigger: 'change', type: 'string' }
        ],
        finderId: [
          { required: true, message: '请选择发现人员', trigger: 'change', type: 'string' }
        ],
        processing: [
          { required: true, message: '请输入处理过程', trigger: 'change', type: 'string' }
        ],
        symptom: [
          { required: true, message: '请输入出现症状', trigger: 'change', type: 'string' }
        ],
        isImpact: [
          { required: true, message: '请输入对原疾病影响', trigger: 'change', type: 'string' }
        ],
        drugReactionType: [
          { required: true, message: '请选择不良反应类型', trigger: 'change', type: 'string' }
        ],
        localMeterialId: [
          { required: true, message: '请选择药品名称', trigger: 'change', type: 'string' }
        ]
      },
      tableData: [],
      patient: {},
      drugNameDefaultArr: [],
      drugNameArr: [],
      drugNameOptions: [],
      drug: {},
      loading: false,
      change: false,
      storage,
      searchFuzzy,
      frequencyOptions: []
    }
  },
  watch: {
    'queryObj.patientId': {
      handler (val) {
        if (val && !this.change) {
          this.getPatientHistoryDoctorAdviceAndDiagnosis()
        } else {
          this.change = false
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
    this.getUsefreqList()
  },
  methods: {
    async getUsefreqList () {
      let res = await this.recipeapi.getUsefreqList()
      res.data = res.data || []
      res.data.forEach(ele => {
        ele.id = ele.code
      })
      this.frequencyOptions = res.data
      this.$ever.getFieldFromSchema(this.querySchema, 'frequency').props.options = res.data
    },
    async drop (id) {
      let res = await this.api.delAdverseDrugReactionByIds({
        ids: [id]
      })
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          title: '删除成功',
          type: 'success',
          message: res.head.errMsg
        })
        this.getAdverseDrugReaction()
      }
    },
    selectPatientRight (val) {
      this.queryObjQuery.query = val ? val.name : ''
    },
    async selectPatient (val, flag) {
      let data = val
      this.$refs.diagnosis.resetInput()
      if (flag) {
        let res = await this.searchFuzzy({
          keyword: val.id
        })
        if (res.data && res.data.resultList && res.data.resultList.length === 1) {
          data = res.data.resultList[0] || {}
        }
      }
      this.$nextTick(_ => {
        this.patient = data || {}
        this.queryObj.patientNo = this.patient.patientOrg && this.patient.patientOrg.patientNumber
        this.queryObj.phone = this.patient.mobile
      })
    },
    async select (val, flag) {
      let res = await this.api.getSourceByLocalSettingListByIdsForService({
        ids: [val]
      })
      if (res.data) {
        this.drugNameOptions.forEach(item => {
          if (item.localMaterialId === val) {
            this.queryObj.globalMaterialId = item.globalMaterialId
            this.queryObj.serviceId = item.id
          }
        })
        let obj = res.data[0] || {}
        this.queryObj.classifyId = obj.classifyId
        this.drug = obj
        this.queryObj.drugName = obj.byName
        this.queryObj.produceName = obj.produceName
        this.queryObj.spec = obj.packageInfo // 规格
        this.queryObj.measure = obj.content // 剂量
        this.queryObj.contentunit = obj.contentUnitText
        if (this.queryObj.contentunit) {
          this.$ever.getFieldFromSchema(this.querySchema, 'measure').slots[0].template = '<span>' + this.queryObj.contentunit + '</span>'
        } else {
          this.$ever.getFieldFromSchema(this.querySchema, 'measure').slots[0].template = '<span>--</span>'
        }
        this.queryObj.dosage = obj.useWay ? obj.useWay.split(',')[0] : ''// 用法
        this.queryObj.frequency = obj.frequency // 频次
      }
    },
    async remoteMethod (val) {
      if (!val) {
        this.drugNameOptions = this.drugNameDefaultArr
      } else {
        this.loading = true
        let res = await this.api.queryService({
          name: val,
          serviceBelongType: 2,
          serviceClassificationList: ['301', '302', '303', '304']
        })
        let arr = res.data
        for (var i = 0; i < arr.length; i++) {
          let code = await sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', arr[i].serviceClassification) || ''
          let spec = arr[i].spec || ''
          let name = arr[i].name || '--'
          arr[i].selfName = name + ' ' + spec + ' ' + code
        }
        this.drugNameArr = res.data
        this.drugNameOptions = res.data
        this.loading = false
      }
    },
    async getPatientHistoryDoctorAdviceAndDiagnosis () { // 根据患者查出来关联的药品
      let res = await this.api.getPatientHistoryDoctorAdviceAndDiagnosis({
        patientId: this.queryObj.patientId,
        serviceTypes: ['301', '302'],
        visitType: '1',
        offset: 0,
        pagesize: 100
      })
      if (res.data && res.data.serviceList) {
        let arr = res.data.serviceList
        for (var i = 0; i < arr.length; i++) {
          arr[i].selfName = arr[i].serviceName + ' ' + await sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', arr[i].serviceType)
          arr[i].adviceJson = arr[i].adviceJson || {}
          arr[i].localMaterialId = arr[i].localMaterialId
        }
        this.drugNameDefaultArr = arr
      }
      this.queryObj.diagnosis = res.data.diagnoseList || []
    },
    async getAdverseDrugReaction () {
      let res = await this.api.getAdverseDrugReaction(this.queryObjQuery)
      let obj = res.data.map(v => {
        v.diagnosis = JSON.parse(v.diagnosis)
        let arr = []
        v.diagnosis.forEach(val => {
          arr.push(val.diseaseName)
        })
        v.diagnosisStr = arr.join(',')
        return v
      })
      obj.map(v => {
      })
      this.tableData = obj
    },
    reset () {
      this.$refs.form.resetForm()
      delete this.queryObj.id
      this.patient = {}
      this.queryObj.classifyId = ''
      this.queryObj.contentunit = ''
      this.queryObj.diagnosis = []
      this.$nextTick(_ => {
        this.$refs.diagnosis.resetInput()
        this.$nextTick(_ => {
          this.$refs.diagnosis.$refs.form[0].clearValidate()
        })
      })
      this.queryObj.drugName = ''
      this.queryObj.globalMaterialId = ''
      this.queryObj.patientId = ''
      this.queryObj.scene = '1'
      this.queryObj.serviceId = ''
      this.queryObj.reactionTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      this.$ever.getFieldFromSchema(this.querySchema, 'measure').slots[0].template = '<span>--</span>'
    },
    async init () {
      this.queryObj.reactionTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      this.getAdverseDrugReaction()
      if (this.$route.matched[0].meta.space === 'workspace' && this.storage.getSessionStorage('outpatientUrlParams')) {
        let obj = JSON.parse(this.storage.getSessionStorage('outpatientUrlParams'))
        let res = await this.searchFuzzy({
          keyword: obj.patientId
        })
        this.queryObj.patientId = obj.patientId
        this.selectPatient(res.data.resultList[0])
      }
    },
    async getAdverseDrugReactionById (id) {
      this.reset()
      let res = await this.api.getAdverseDrugReactionById({ id })
      let obj = res.data[0]
      delete obj.updateTime
      delete obj.updaterId
      delete obj.updater
      delete obj.tenantId
      delete obj.visitSn
      delete obj.serviceName
      delete obj.reporter
      delete obj.reporterId
      delete obj.record
      delete obj.recordId
      delete obj.recordTime
      delete obj.orgId
      delete obj.isValid
      delete obj.description
      delete obj.delFlag
      delete obj.createTime
      delete obj.creator
      delete obj.creatorId
      this.patient = obj.patient || {}
      this.selectPatient(this.patient, true)
      delete obj.patient
      obj.diagnosis = JSON.parse(obj.diagnosis)
      obj.measure = Number(obj.measure)
      this.change = true
      this.queryObj = obj
      this.queryObj.reactionTime = this.$moment(this.queryObj.reactionTime).format('YYYY-MM-DD HH:mm:ss')
      this.$ever.getFieldFromSchema(this.querySchema, 'measure').slots[0].template = '<span>' + this.queryObj.contentunit + '</span>'
      this.remoteMethod(this.queryObj.drugName)
    },
    async createAdverseDrugReaction () {
      this.$refs.form.$refs.form.validate(async valid => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.queryObj))
          obj.diagnosis = JSON.stringify(obj.diagnosis)
          let res = await this.api.createAdverseDrugReaction(obj)
          if (res.head && res.head.errCode === 0) {
            this.$notify({
              title: '创建成功',
              type: 'success',
              message: res.head.errMsg
            })
            this.getAdverseDrugReaction()
            this.reset()
          }
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.adverse_drug {
  height: 100%;
  /deep/ .ever_diagnosis_wrap{
    width: 120%;
  }
  .el-form {
    /deep/ .el-row {
      .el-col {
        &:nth-child(2) {
          color: #000;
        }
      }
    }
  }
  /deep/ .el-input__inner {
    height: 32px;
  }
  .row {
    display: flex;
    flex-direction: row;
    height: 100%;
    // align-items: stretch;
    flex-wrap: nowrap;
  }
  .title {
    color: #000;
    font-weight: bold;
    padding-left: 10px;
    padding-bottom: 10px;
    .span {
      display: inline-block;
      width: 3px;
      height: 15px;
      background: #1c7bef;
      vertical-align: middle;
      margin-top: -2px;
      margin-right: 5px;
    }
  }
  .left {
    flex: 0 0 485px;
    width: 485px;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    margin-right: 12px;
    padding-top: 10px;
    /deep/ .el-form {
      width: 470px;
      flex: 1;
      padding-right: 10px;
      overflow-y: auto;
    }
    /deep/ .ever_diagnosis_wrap .el-form {
      width: auto;
      overflow-y: inherit;
    }
  }
  .right {
    width: calc(100% - 510px);
    box-sizing: border-box;
    height: 100%;
    background: #fff;
    padding: 10px;
    .layout_box {
      .el-form-item__label {
        min-width: 126px;
      }
    }
  }
  /deep/ .el-col-6 {
    .el-form-item__content {
      margin-left: 15px !important;
    }
  }
  /deep/ .sure-btn,
  /deep/ .reset-btn {
    width: 68px;
    height: 40px;
  }
}
</style>


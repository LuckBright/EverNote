<template>
  <ever-form2
    onsubmit="return false;"
    :schema="querySchema"
    v-model="queryObj"
    ref="form"
    :inline="true"
    :is-query="true"
    :input-query="true"
    @query="list(true)">
    <template slot="outStartDate">
      <ever-range-picker
        width="260px"
        dateType="daterange"
        :autoWidth="false"
        :clearable="true"
        :start.sync="queryObj.outStockStartDate"
        :end.sync="queryObj.outStockEndDate"
        :outformat="`YYYY-MM-DD HH:mm:ss`"
        :default-time="['00:00:00', '23:59:59']"
        @change="list"
      ></ever-range-picker>
    </template>
    <template slot="visitStartDate">
      <ever-range-picker
        width="260px"
        dateType="daterange"
        :autoWidth="false"
        :clearable="true"
        :start.sync="queryObj.startDate"
        :end.sync="queryObj.endDate"
        :outformat="`YYYY-MM-DD HH:mm:ss`"
        :default-time="['00:00:00', '23:59:59']"
        @change="list"
      ></ever-range-picker>
    </template>
    <template slot="default">
      <el-form-item class="ml10">
        <el-button size="small" type="primary" @keyup.enter.native="list" @click="list">查询</el-button>
      </el-form-item>
    </template>
  </ever-form2>
</template>

<script>
import { warehouse as axios } from '@/warehouse/store/api'
import { delObjIsNull } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
const querySchemaArr = [
  {
    name: 'patientId',
    label: '患者',
    comp: 'ever-patient-select',
    mate: [1, 2, 3, 4],
    props: {
      placeholder: '患者姓名、患者档案号、就诊卡号',
      width: '300px'
    },
  },
  {
    name: 'searchCode',
    label: '处方号/业务单号',
    mate: [1, 2, 3, 4],
    props: {
      clearable: true,
      placeholder: '处方号/业务单号/执行单号'
    },
    style: 'width: 300px'
  },
  {
    label: '执行科室',
    name: 'executeProviderId',
    mate: [1, 2, 3, 4],
    comp: 'ever-select',
    props: {
      options: []
    }
  },
  {
    label: '物资名称',
    name: 'localMaterialId',
    mate: [3, 4],
    comp: 'material-select',
    props: {

    },
    style: 'width: 350px'
  },
  {
    label: '业务类型',
    name: 'scene',
    mate: [2, 4],
    comp: 'select',
    props: {
      options: [
        {
          id: '',
          name: '全部'
        },
        {
          id: 1,
          name: '线下门诊'
        },
        {
          id: 5,
          name: '线上门诊'
        },
      ]
    }
  },
  {
    label: '出库日期',
    name: 'outStartDate',
    mate: [4],
    comp: 'custom'
  },
  {
    label: '开单日期',
    name: 'visitStartDate',
    mate: [2, 4],
    comp: 'custom'
  }
]
export default {
  mixins: [getstorage],
  props: {
    // 根据mate参数选择池子里面的schema
    mate: {
      type: Number,
      default: 1
    },
    // 可以自己传过来的查询schema
    schema: {
      type: Array,
      default: () => []
    },
    // 查询所需其他组件中参数
    otherArgs: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    // 初始化查询数据
    let querySchema = []
    if (this.schema.length) {
      this.schema.forEach(item => {
        // 传入的如果是Object对象，直接添加
        if (item instanceof Object) {
          querySchema.push(item)
        } else {
          // 传入的是筛选条件name名字，去querySchema里面找到对象
          const find = querySchemaArr.find(child => child.name === item)
          find && querySchema.push(find)
        }
      })
    } else {
      // 根据传入的mate参数去querySchema里面的数据  没有传入默认展示所有查询条件
      querySchema = this.mate ? querySchemaArr.filter(item => item.mate.includes(this.mate)) : querySchemaArr
    }
    const queryObj = Object.assign(this.$ever.createObjFromSchema(querySchema), this.otherArgs)
    return {
      querySchema,
      queryObj
    }
  },
  created () {
    // 设置placeholder显示
    if (this.$route.path.indexOf('/outpaitent') > -1 || this.$route.path.indexOf('/wmsprescribe') > -1) {
      this.$ever.getFieldFromSchema(this.querySchema, 'patientId').props.placeholder = '患者姓名、患者编号、就诊卡号'
      this.$ever.getFieldFromSchema(this.querySchema, 'searchCode').label = '处方号/业务单号'
      this.$ever.getFieldFromSchema(this.querySchema, 'searchCode').props.placeholder = '处方号/业务单号/执行单号'
    } else {
      this.$ever.getFieldFromSchema(this.querySchema, 'patientId').props.placeholder = '患者姓名、患者编号、就诊卡号、住院病案号'
      if (this.$ever.getFieldFromSchema(this.querySchema, 'searchCode')) {
        this.$ever.getFieldFromSchema(this.querySchema, 'searchCode').label = 'UDD药包'
        this.$ever.getFieldFromSchema(this.querySchema, 'searchCode').props.placeholder = 'UDD药包'
      }
    }
    if (this.querySchema.some(item => item.name === 'executeProviderId')) {
      this.initExecuteProviderOptions()
    }
  },
  methods: {
    list () {
      this.$emit('query', delObjIsNull(Object.assign({}, this.queryObj)), true)
    },
    // 获取执行科室
    async initExecuteProviderOptions () {
      let params = {
        containOtherStorageroom: 0,
        storageRoomId: this.storageId,
        processId: this.processId,
        processConfigurationId: this.processConfigurationId,
        type: this.$route.path.indexOf('/outpaitent') > -1 ? 1 : 3,
        orderType: this.$route.path.indexOf('back') > -1 ? 2 : 1
      }
      await axios.cancelPost('order/searchProviderList', params).then(res => {
        if (res && res.length) {
          this.$ever.getFieldFromSchema(this.querySchema, 'executeProviderId').props.options = res.map(item => {
            return {
              id: item.executeProviderId,
              name: item.executeProviderName
            }
          })
        }
      })
    },
  },
  computed: {
    // 当前库房流程配置数据
    currentProcessConfig () {
      return this.$store.state.processConfig.thisStorageroomProcessConfig
    },
    // 流程id
    processConfigurationId () {
      return this.currentProcessConfig.id
    },
    // 当前流程配置code  100001 100002 100003 等
    processId () {
      return this.currentProcessConfig.processId
    }
  },
}
</script>

<style lang="scss" scoped>
.el-form--inline{
  margin-top: -10px;
  /deep/ .el-form-item--small{
    margin-top: 10px!important;
  }
}
</style>

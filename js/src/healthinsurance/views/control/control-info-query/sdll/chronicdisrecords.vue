<template>
  <div class="tableContainer" v-loading="loading">
    <ever-form2 ref="queryform" :inline="true" :schema="schema" :rules="rules" v-model="queryObj">
      <template slot="btns">
        <el-button type="primary" size="small" @click="beforeQueryList">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-table class="table" :data="disTableData" border stripe>
      <el-table-column label="疾病编码" prop="jbbm"></el-table-column>
      <el-table-column label="疾病名称" prop="jbmc"></el-table-column>
    </el-table>
    <el-table class="table" :data="recordTableData" border stripe>
      <el-table-column label="医院名称" prop="yymc"></el-table-column>
      <el-table-column label="医院编码" prop="yybm" width="80"></el-table-column>
      <el-table-column label="数量" prop="sl" width="60">
        <template slot-scope="scope">{{scope.row.sl&&parseInt(scope.row.sl)}}</template>
      </el-table-column>
      <el-table-column label="结算日期" prop="jsrq"></el-table-column>
      <el-table-column label="医疗项目编码" prop="ylxmbm"></el-table-column>
      <el-table-column label="医疗项目名称" prop="ylxmmc"></el-table-column>
      <el-table-column label="剂型名" prop="jxm"></el-table-column>
      <el-table-column label="规格" prop="gg" width="60"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { queryBasicInfo, queryBryyqk } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
import { mbyyqkQueryType } from '@/rcm/otmdiscomponent/config-js/sdll-baseconfig.js'
const schema = [{
  label: '个人编号',
  name: 'grbh'
},
{
  label: '查询类别',
  name: 'cxlb',
  comp: 'ever-select',
  props: {
    options: mbyyqkQueryType
  }
},
{
  label: '起止日期',
  name: 'timeStartAndEnd',
  comp: 'everRangePicker',
  props: {
    disabled: false,
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
{
  label: '',
  labelWidth: '15px',
  name: 'btns',
  comp: 'custom'
}]
const rules = {
  grbh: [{
    required: true,
    message: '请填写个人编号',
    trigger: 'change'
  }]
}
export default {
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.cxlb = '0'
    this.$ever.getFieldFromSchema(schema, 'timeStartAndEnd').props.disabled = true
    return {
      schema,
      rules,
      queryObj,
      loading: false,
      disTableData: [],
      recordTableData: []
    }
  },
  methods: {
    getsbjgbh () {
      const params = {
        insuranceOrgId: sdllCode,
        sbjgbh: '000000', // 社保机构编号写死的
        macId: this.macId,
        jsonPara: {
          grbh: this.queryObj.grbh,
          xzbz: 'C'
        }
      }
      return queryBasicInfo(params)
    },
    beforeQueryList () {
      this.$refs.queryform.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.getsbjgbh().then(res => {
            const { sbjgbh } = res.data
            if (sbjgbh) {
              this.queryList(sbjgbh)
            } else {
              this.$messageTips(this, 'error', '未获取到社保局编号')
              return false
            }
          }).catch((err) => {
            console.log('err', err)
            this.loading = false
          })
        }
      })
    },
    queryList (sbjgbh) {
      const [qsrq, zzrq] = this.queryObj.timeStartAndEnd
      const params = {
        macId: this.macId,
        insuranceOrgId: sdllCode,
        sbjgbh: sbjgbh,
        jsonPara: {
          ...this.queryObj,
          qsrq: qsrq && this.$moment(qsrq).format('YYYYMMDD'),
          zzrq: zzrq && this.$moment(zzrq).format('YYYYMMDD')
        }
      }
      Object.keys(params.jsonPara).forEach(key => {
        if (!params.jsonPara[key]) {
          delete params.jsonPara[key]
        }
      })
      queryBryyqk(params).then(res => {
        const { dssick: disTableData, dsinfo: recordTableData } = res.data
        this.disTableData = disTableData
        this.recordTableData = recordTableData
        this.loading = false
      }).catch(err => {
        console.log('err', err)
        this.disTableData = []
        this.recordTableData = []
        this.loading = false
      })
    }
  },
  watch: {
    'queryObj.cxlb': {
      handler: function (val, oldval) {
        if (val === '0') {
          this.$ever.getFieldFromSchema(this.schema, 'timeStartAndEnd').props.disabled = true
        } else {
          this.$ever.getFieldFromSchema(this.schema, 'timeStartAndEnd').props.disabled = false
        }
      }
    }
  },
}
</script>
<style scoped>
.tableContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.table {
  overflow: auto;
}
</style>

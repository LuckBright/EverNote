<template>
  <div class="layout_inner">
    <ever-form2
      ref="queryform"
      :schema="schema"
      :rules="rules"
      v-model="queryObj"
      labelWidth="auto"
    >
      <template slot="btns">
        <el-button type="primary" size="small" @click="list">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <div class="identity">
      <h3>身份</h3>
      <span>{{identity}}</span>
    </div>
    <h3>封锁信息</h3>
    <el-table :data="blockData" border stripe>
      <el-table-column label="封锁对象" prop="target"></el-table-column>
      <el-table-column label="险种类型" prop="inType"></el-table-column>
      <el-table-column label="单位/个人封锁原因" prop="reason"></el-table-column>
      <el-table-column label="封锁类别" prop="blockadeType"></el-table-column>
      <el-table-column label="封锁开始时间" prop="startDay">
        <template slot-scope="scope">{{scope.row.startDay | timeFormatter}}</template>
      </el-table-column>
      <el-table-column label="封锁终止时间" prop="endDay">
        <template slot-scope="scope">{{scope.row.endDay | timeFormatter}}</template>
      </el-table-column>
      <el-table-column label="封锁经办人" prop="comparePerson"></el-table-column>
      <el-table-column label="封锁经办日期" prop="compareDay">
        <template slot-scope="scope">{{scope.row.compareDay | timeFormatter}}</template>
      </el-table-column>
      <el-table-column label="封锁原因注释" prop="notes"></el-table-column>
      <el-table-column label="个人封锁对应卡号" prop="cardNo"></el-table-column>
    </el-table>
    <h3>审批信息</h3>
    <el-table :data="checkData" border stripe>
      <el-table-column label="身份证号" prop="idno"></el-table-column>
      <el-table-column label="姓名" prop="personname"></el-table-column>
      <el-table-column label="疾病编码" prop="diagnosisCode"></el-table-column>
      <el-table-column label="疾病名称" prop="diagnosisName"></el-table-column>
      <el-table-column label="审批类别" prop="approvalType"></el-table-column>
      <el-table-column label="开始日期" prop="startDay">
        <template slot-scope="scope">{{scope.row.startDay | timeFormatter}}</template>
      </el-table-column>
      <el-table-column label="终止时间" prop="endDay">
        <template slot-scope="scope">{{scope.row.endDay | timeFormatter}}</template>
      </el-table-column>
      <el-table-column label="审核标识" prop="approvalFlag"></el-table-column>
      <el-table-column label="审批编号" prop="approvalNo"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { blockAdeInfo, chronicBig, jilinHg } from '@/rcm/store/otmdiscomponent/jljh-api.js'
import { jljhCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import personno from '@/rcm/otmdiscomponent/personno.vue'
const schema = [{
  label: '个人编号',
  name: 'personno',
  comp: personno,
  props: {
    insuranceOrgId: jljhCode
  },
  span: 4
},
{
  label: '',
  name: 'btns',
  labelWidth: '15px',
  comp: 'custom',
  span: 4
}]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      rules: {
        personno: [{
          required: true,
          message: '请先选择个人编号',
          trigger: 'change'
        },
        {}]
      },
      identity: '',
      blockData: [],
      checkData: [],
      insuranceOrgId: jljhCode
    }
  },
  methods: {
    list () {
      this.$refs.queryform.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          var params = Object.assign({ macId: this.macId, insuranceOrgId: this.insuranceOrgId }, this.queryObj)
          let apiArray = [this.jilinHg, this.blockAdeInfo, this.chronicBig]
          apiArray.forEach(api => {
            api(params)
          })
        }
      })
    },
    jilinHg (params) {
      jilinHg(params).then(res => {
        this.identity = res.data && (res.data.flag > 0 ? '吉化职工' : '非吉化职工')
      }).catch((err) => {
        console.log('err', err)
      })
    },
    blockAdeInfo (params) {
      blockAdeInfo(params).then(res => {
        this.blockData = res.data && res.data.infos
      }).catch((err) => {
        console.log('err', err)
      })
    },
    chronicBig (params) {
      chronicBig(params).then(res => {
        this.checkData = res.data && res.data.infos
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    }
  },
  filters: {
    timeFormatter (val) {
      return val && val.substring(0, 8)
    }
  }
}
</script>
<style scoped>
.identity {
  margin-bottom: 15px;
}
h3 {
  display: inline;
}
</style>

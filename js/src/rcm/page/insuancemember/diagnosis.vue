<!--
 * @Author: renpengfei
 * @Date: 2019-08-19 15:34:40
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-09-02 15:15:03
 -->
<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="诊断信息" name="first">
      <h4 class="settle_title dis">诊断信息</h4>
      <el-table :data="diaobj" border style="width: 100%">
        <el-table-column prop="typeName" label="诊断类型"> </el-table-column>
        <el-table-column prop="diseaseName" label="诊断名称"> </el-table-column>
        <el-table-column prop="diagnosisCode" label="诊断编码"> </el-table-column>
        <el-table-column prop="doctorName" label="诊断医生"> </el-table-column>
        <el-table-column prop="recordTime" label="诊断时间"> </el-table-column>
      </el-table>

      <!-- <h4 class="settle_title">病例信息</h4> -->
      <template v-for="item in medicalRecord">
        <phrref
          :key="item.id"
          :schema-id="item.formTemplateId"
          :id="item.id"
          :disabled="true"
        ></phrref>
      </template>
    </el-tab-pane>
    <el-tab-pane label="医嘱信息" name="second">
      <el-table :data="advice" border style="width: 100%">
        <el-table-column prop="createTime" label="开立时间">
          <template slot-scope="scope">
            {{
              $moment(scope.row && scope.row.createTime).format("YYYY-MM-DD")
            }}
          </template>
        </el-table-column>
        <el-table-column prop="serviceType" label="医嘱类型">
          <template slot-scope="scope">
            <!-- THC_SOB_SERVICE_TYPE -->
            <sys-value
              type="THC_WH_OBJECT_SUB_TYPE"
              :code="scope.row.serviceType"
            ></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="adviceJson.doctorAdviceName" label="医嘱">
        </el-table-column>
        <el-table-column prop="useFreq" label="频次">
          <template slot-scope="scope">
            <!-- <sys-value type="CV06.00.228" :code="scope.row.useFreq"></sys-value> -->
            {{ scope.row.adviceJson && scope.row.adviceJson.useFreqName }}
          </template>
        </el-table-column>
        <el-table-column prop="employ" label="用法">
          <template slot-scope="scope">
            <!-- <sys-value type="CV06.00.102" :code="scope.row.employ"></sys-value> -->
            {{ scope.row.adviceJson && scope.row.adviceJson.employName }}
          </template>
        </el-table-column>
        <el-table-column prop="entrust" label="嘱托"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{
              OUTPATIENT_ADVICE_STATUS[String(scope.row.status)] &&
                OUTPATIENT_ADVICE_STATUS[String(scope.row.status)].txt
            }}
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import phrref from '@/form/components/phrref'
import { OUTPATIENT_ADVICE_STATUS } from '@/util/common'

export default {
  props: {
    diaobj: {
      type: Array,
      default: () => []
    },
    advice: {
      type: Array,
      default: () => []
    },
    medicalRecord: {
      type: Array,
      default: () => []
    }
  },
  components: {
    phrref
  },
  data () {
    return {
      activeName: 'first',
      tableData: [],
      OUTPATIENT_ADVICE_STATUS: OUTPATIENT_ADVICE_STATUS
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style scoped>
.settle_title {
  height: 16px;
  line-height: 16px;
  padding-left: 10px;
  border-left: 3px solid #1c7bef;
  margin-top: 20px;
  margin-bottom: 0;
}
.dis {
  margin-top: 5px;
  margin-bottom: 0;
}
.diaginfo label {
  color: #8a929e;
}
.diaginfo label {
  width: 150px;
  display: inline-block;
  text-align: right;
}
.diaginfo {
  padding: 10px 0;
  line-height: 32px;
}
.diaginfo ul {
  padding: 0;
  margin: 0;
}
</style>

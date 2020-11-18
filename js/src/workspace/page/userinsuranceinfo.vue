<template>
  <div id="insuranceinfo">
    <div v-show="this.$ever.getClinicConfig().showMedicalInsurce === '1'">
      <el-row class="title">
        <el-col :span="22">
          <span class="name">社保信息</span>
        </el-col>
        <el-col :span="2" align="right">
          <el-button type="text" @click="toEditPage">
            <i class="el-icon-edit"></i> 编辑
          </el-button>
        </el-col>
      </el-row>
      <el-row class="table">
        <el-col :span="24" class="th">
          <span>社会保障卡号码：</span>
          {{socialinsur.socialIdNo}}
        </el-col>
        <el-col :span="24" class="th">
          <span>社保卡号：</span>
          {{socialinsur.socialSecurityNo}}
        </el-col>
        <el-col :span="24" class="th">
          <span>医保应用号：</span>
          {{socialinsur.medicalNo}}
        </el-col>
      </el-row>
      <hr>
    </div>

    <el-row class="title">
      <el-col :span="22">
        <span class="name">商保信息</span>
      </el-col>
      <el-col :span="2" align="right">
        <el-button type="text" @click="toEditPage">
          <i class="el-icon-edit"></i> 编辑
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border>
      <el-table-column label="保险公司名称" prop="insurerName"></el-table-column>
      <el-table-column label="产品名称" prop="productName"></el-table-column>
      <el-table-column label="保险产品分类" prop="typeName">
        <template slot-scope="scope">{{scope.row.typeName || '- -'}}</template>
      </el-table-column>
      <el-table-column label="投保企业" prop="insurCompany"></el-table-column>
      <el-table-column label="保单编号" prop="policyNum"></el-table-column>
      <el-table-column label="保单团体号" prop="origNum"></el-table-column>
      <el-table-column label="有效期" prop>
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | formatDateByExp('YYYY-MM-DD') }} - {{ scope.row.endTime | formatDateByExp('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="患者福利" show-overflow-tooltip prop="welfare" align="left"></el-table-column>
      <el-table-column label="证件" show-overflow-tooltip prop>
        <template slot-scope="scope">
          <p v-if="scope.row.image">
            <a :href="$ever.fileUrl2 + scope.row.image" target="_blank">保险卡</a>
          </p>
          <p v-if="scope.row.copyFile">
            <a :href="$ever.fileUrl2 + scope.row.copyFile" target="_blank">保险卡复印件</a>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="内部备注"
        show-overflow-tooltip
        prop="interiorContent"
        align="center"
        v-if="$hasPermission('Auth_menu_crm_member_insurance_remarks')"
      ></el-table-column>
    </el-table>
  </div>
</template>
<script>
import api from '../store/userinsuranceapi'

export default {
  data () {
    return {
      api,
      patientId: this.$route.params.patientId ? this.$route.params.patientId : '',
      tableData: [],
      socialinsur: {}
    }
  },
  methods: {
    toEditPage () {
      this.$router.push({ path: '/crm/memberinfo/userinfo/userinsuranceedit/' + this.patientId })
    }
  },
  created () {
    api.getSocialInsur({
      patientId: this.patientId
    }).then(result => {
      this.socialinsur = result.data ? result.data : {
        certId: '--',
        cardNum: '--'
      }
    })

    api.getBusinessInsur({
      patientId: this.patientId
    }).then(result => {
      this.tableData = result.data
    })
  }
}
</script>
<style scoped>
p {
  margin: 0;
}
#insuranceinfo .title {
  margin-bottom: 5px;
}
#insuranceinfo .title .el-col {
  padding: 0 10px;
}
#insuranceinfo .title span.name {
  display: inline-block;
  height: 16px;
  line-height: 16px;
  border-left: 2px solid #1c7bef;
  padding-left: 10px;
}
#insuranceinfo .title .el-button {
  padding: 0;
}
#insuranceinfo .table {
  line-height: 36px;
  font-size: 14px;
  color: #151515;
  margin-bottom: 20px;
}
#insuranceinfo .table .th {
  padding-left: 20px;
}
#insuranceinfo .table .th span {
  color: #999999;
}
#insuranceinfo .tablelist {
  margin-top: 16px;
}
#insuranceinfo .tablelist th,
#insuranceinfo .tablelist td {
  height: 50px;
  line-height: 50px;
}
</style>

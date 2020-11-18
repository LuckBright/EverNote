<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-10-24 10:33:16
 -->
<template>
  <div class="insur" v-loading="loading">
    <aside class="left" style="display:flex;flex-direction:column;">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        :is-query="true"
        :labelWidth="'70px'"
        class="search"
      >
        <template slot="patientId">
          <getpatientbyorgid v-model="queryObj.patientId" :orgId="String(queryObj.orgId)"></getpatientbyorgid>
        </template>

        <template slot="daterange">
          <ever-range-picker :start.sync="queryObj.beginDate" :end.sync="queryObj.endDate"></ever-range-picker>
        </template>
        <template slot="default">
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="search">查 询</el-button>
              <el-button @click="reset">重 置</el-button>
            </el-form-item>
          </el-col>
        </template>
      </ever-form2>
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        class="flex_column_full_hidden main-wrap"
      >
        <el-tab-pane label="待处理" name="first">
          <insurtable
            :queryObj="queryObj"
            ref="first"
            :activeName="activeName"
            @sendPatientId="sendPatientId"
          ></insurtable>
        </el-tab-pane>
        <el-tab-pane label="已处理" name="second">
          <insurtable
            :type="2"
            :queryObj="queryObj"
            ref="second"
            :activeName="activeName"
            @sendPatientId="sendPatientId"
          ></insurtable>
        </el-tab-pane>
      </el-tabs>
    </aside>
    <section class="right">
      <div>
        <el-button type="primary" @click="insuranceBtn">{{ text }}</el-button>
        <div class="baseinfo clearfix">
          <el-col :span="4">
            <div class="name">{{ appointment.patientName | filterEmpty }}</div>
            <div class="age">
              <sys-value class="sex" type="GBT.2261.1" :code="appointment.patientSex"></sys-value>
              {{
              $moment(
              appointment.patient && appointment.patient.birthday
              ).format("YYYY-MM-DD") | filterEmpty
              }}
            </div>
          </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="8">
                <label>患者档案号：</label>
                <span>{{ appointment.patientNumber | filterEmpty }}</span>
              </el-col>
              <el-col :span="8">
                <label>住院病案号：</label>
                <span>{{ appointment.inpatientNumber | filterEmpty }}</span>
              </el-col>
              <el-col :span="8">
                <label>预约时间：</label>
                <span v-if="appointment.dateStr && appointment.startTimeStr">
                  {{
                  ` ${appointment.dateStr} ${appointment.startTimeStr}`
                  }}
                </span>
                <span v-else>--</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <label>看诊机构：</label>
                <span>{{ appointment.organName | filterEmpty }}</span>
              </el-col>
              <el-col :span="6">
                <label>看诊科室：</label>
                <span>{{ appointment.deptName | filterEmpty }}</span>
              </el-col>
              <el-col :span="6">
                <label>看诊医生：</label>
                <span>{{ appointment.doctorName | filterEmpty }}</span>
              </el-col>
              <el-col :span="6">
                <label>预约备注：</label>
                <span>{{ appointment.symptom | filterEmpty }}</span>
              </el-col>
            </el-row>
          </el-col>
        </div>
        <el-tabs v-model="insuranceName" v-if="insurance && insurance.length > 0">
          <el-tab-pane
            :label="item.insurerName"
            :name="item.id"
            v-for="item in insurance"
            :key="item.id"
          >
            <div class="insurinfo">
              <ul>
                <li>
                  <label>保险公司名称：</label>
                  <span>{{ item.insurerName | filterEmpty }}</span>
                </li>
                <li>
                  <label>产品名称：</label>
                  <span>{{ item.productName | filterEmpty }}</span>
                </li>
                <li>
                  <label>保险编号：</label>
                  <span>{{ item.policyNum | filterEmpty }}</span>
                </li>
                <li>
                  <label>有效期：</label>
                  <span>
                    {{ $moment(item.startTime).format("YYYY-MM-DD") }} 至
                    {{ $moment(item.endTime).format("YYYY-MM-DD") }}
                  </span>
                </li>
                <li>
                  <label>保险类型：</label>
                  <span>{{ item.typeName | filterEmpty }}</span>
                </li>
                <li>
                  <label>投保企业：</label>
                  <span>{{ item.insurCompany | filterEmpty }}</span>
                </li>
                <li>
                  <label>保险团体号：</label>
                  <span>{{ item.origNum | filterEmpty }}</span>
                </li>
                <li>
                  <label>患者福利：</label>
                  <span>{{ item.welfare | filterEmpty }}</span>
                </li>
                <li>
                  <label>保险专员内部备注：</label>
                  <span>{{ item.interiorContent | filterEmpty }}</span>
                </li>
                <li>
                  <label>上传信息：</label>
                  <template v-if="item.filePath">
                    <el-button type="text" @click="download(item.filePath)">下载上传信息</el-button>
                  </template>
                  <template v-else>--</template>
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="sobinfo">
          <diagnosis :diaobj="diagnose" :medicalRecord="medicalRecord" :advice="advice"></diagnosis>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
let schema = [
  {
    name: 'daterange',
    label: '到诊时间',
    comp: 'custom', // daterangepicker 涉及到动态属性，用 slot 方式比较好解决动态绑定问题
    span: 24
  },
  {
    label: '机构',
    name: 'orgId',
    comp: 'everOrgSelect',
    props: {
      clearable: true,
      type: 'select',
      isOrg: false, // 选集团科室
      fields: 'id'
    },
    span: 24
  },
  {
    name: 'patientId',
    label: '患者姓名',
    comp: 'custom',
    span: 24
  }
]
import getpatientbyorgid from '@/rcm/page/insuancemember/getpatientbyorgid'
import insurtable from '@/rcm/page/insuancemember/table'
import diagnosis from '@/rcm/page/insuancemember/diagnosis'
import { getPatientInfo } from '@/rcm/store/outpatient/outpatient.js'
export default {
  components: {
    getpatientbyorgid,
    insurtable,
    diagnosis
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    // 启用requestSwitch，禁掉list里面默认的mounted调用list
    obj.requestSwitch = true
    obj.beginDate = new Date()
    obj.endDate = new Date()
    return {
      loading: false,
      querySchema: schema,
      queryObj: obj,
      activeName: 'first',
      advice: [],
      appointment: {},
      diagnose: [],
      insurance: [],
      urlparams: {},
      medicalRecord: []
    }
  },
  watch: {
    queryObj: {
      handler (val, oldval) {
        this.$refs[this.activeName].list()
      },
      deep: true
    }
  },
  mounted () {
    this.$refs && this.$refs[this.activeName].list()
  },
  filters: {
    filterEmpty (value) {
      if (value) {
        return value
      } else {
        return '--'
      }
    }
  },
  computed: {
    text: function () {
      return this.activeName === 'first' ? '保险结算' : '查看结算'
    },
    insuranceName: {
      set (newVal) {
        this.$emit('input', newVal)
      },
      get () {
        return this.insurance.length > 0 ? this.insurance[0].id : null
      }
    }
  },
  methods: {
    download (url) {
      window.open(url)
    },
    initdata () {
      this.advice = []
      this.diagnose = []
      this.insurance = []
      this.medicalRecord = []
      this.appointment = {}
      this.urlparams = {}
    },
    sendPatientId (data) {
      this.initdata()
      if (data) {
        this.urlparams = Object.assign({}, this.urlparams, data)
        this.getBaseInfo(data)
      }
    },
    async getBaseInfo (val) {
      this.loading = true
      try {
        let params = {
          patientId: '',
          visitNumber: ''
        }
        let data = await getPatientInfo({ ...params, ...val })
        this.appointment = Object.assign(
          {},
          this.baseinfo,
          data.data && data.data.appointment,
          data.data &&
          data.data.appointment &&
          data.data.appointment.patient &&
          data.data.appointment.patient.patientOrg
        )
        this.advice = data.data && data.data.advice && data.data.advice
        this.diagnose = data.data && data.data.diagnose && data.data.diagnose
        this.insurance = data.data && data.data.insurance && data.data.insurance
        this.medicalRecord =
          data.data && data.data.medicalRecord &&
          data.data.medicalRecord.filter(v => Number(v.designerId) === 1)
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    search () {
      this.$refs[this.activeName].list()
    },
    handleClick (tab, event) {
      this.$refs[this.activeName].list()
    },
    reset () {
      Object.keys(this.queryObj).forEach(v => {
        v !== 'requestSwitch' ? (this.queryObj[v] = '') : null
      })
    },
    insuranceBtn () {
      let path = ''
      let showDetail = 0
      let settlementid = ''
      if (this.urlparams && this.urlparams.settlementIds.length > 0) {
        path = this.$ever.rcmIndex + '/rcm/reconstruct/settled'
        if (this.urlparams.settlementIds.length === 1) {
          showDetail = 0
          settlementid = this.urlparams.settlementIds[0]
        } else {
          showDetail = 1
          settlementid = ''
        }
      } else {
        path = this.$ever.rcmIndex + '/rcm/reconstruct/peddingsettlement'
      }
      const url = `${path}?patientId=${this.urlparams.patientId}&visitNumber=${this.urlparams.visitNumber}&showDetail=${showDetail}&settlementid=${settlementid}&dptId=${this.urlparams.deptId}&showlist=true&isnoprint=true`
      window.open(url)
    }
  }
}
</script>
<style scoped>
.layout_box {
  height: 100%;
}
.insur {
  display: flex;
}
.insur /deep/ .el-date-editor {
  width: 100% !important;
}
.insur /deep/ .el-select {
  width: 100% !important;
}
.left {
  width: 446px;
  padding: 10px 0;
  background: #ffffff;
}
.right {
  margin-left: 10px;
  padding: 10px;
  background: #ffffff;
  flex: 1;
  overflow-y: scroll;
}
.baseinfo,
.insurinfo {
  border-bottom: 1px solid #d9ddde;
  padding: 10px 0;
  line-height: 32px;
}
.insurinfo ul {
  padding: 0;
  margin: 0;
}
.insurinfo label {
  width: 150px;
  display: inline-block;
  text-align: right;
}
.baseinfo label,
.insurinfo label {
  color: #8a929e;
}
.baseinfo span,
.insurinfo span {
  color: #333333;
}
.baseinfo > .el-col {
  padding: 0 5px;
  font-size: 14px;
}
.baseinfo > .el-col:nth-child(1) {
  border-right: 1px solid #d9ddde;
}
.sobinfo {
  margin-top: 10px;
}
.name {
  font-size: 16px;
  color: #333333;
  font-weight: 500;
}
.age {
  font-size: 12px;
  color: #8a929e;
}
.age /deep/ .sex {
  color: #8a929e;
}
.search {
  padding: 0 10px;
}
.el-tabs {
  font-size: 14px;
  margin-top: 10px;
}
</style>


<template>
  <div class="list-container">
    <ever-table
      ref="table"
      :is-auto-height="false"
      class="light-theme-table"
      row-key="id"
      :show-index="false"
      :columns="columns"
      :data="list"
      :is-pagination="false"
    >
      <template slot="patientNo" slot-scope="scope">
        <template>
          <a  style="color:#4484C9" href="javascript:" @click="goPatientDetail(scope.row)">{{
            scope.row.patientNumber
          }}</a>
        </template>
      </template>
      <template slot="age" slot-scope="scope">
        <template>
          {{ scope.row.birthday | birthdayComputed }}
        </template>
      </template>
      <template slot="type" slot-scope="scope">
        <template>
          <el-switch
            @change="change(scope.row.patientId)"
            v-model="scope.row.status"
            active-color="#ACC7F8"
            inactive-color="#BBC2D2"
            :disabled="!scope.row.status"
          >
          </el-switch>
          关注
        </template>
      </template>
      <template slot="count" slot-scope="scope">
        <template>
          <template v-if="getVisitTotal(scope.row.visitNumList) !== 0">
            <el-tooltip popper-class="date-year-tip" placement="bottom">
              <div slot="content">
                <p v-for="item in scope.row.visitNumList" :key="item.visitTypeCode">
                  {{ item.visitTypeName }}：{{ item.visitNumber }}次
                </p>
              </div>
              <el-button type="text">
                {{ getVisitTotal(scope.row.visitNumList) }}
              </el-button>
            </el-tooltip>
          </template>
          <template v-else>
            <el-button type="text" style="color: #333">
              0
            </el-button>
          </template>
        </template>
      </template>
    </ever-table>
  </div>
</template>

<script>
import urlMap from '@/phr/api/urls'

export default {
  props: {
    list: Array
  },
  data () {
    return {
      columns: [
        {
          prop: 'patientNo',
          label: '患者档案号',
          slot: 'patientNo',
        },
        {
          prop: 'patientName',
          label: '患者姓名',
          width: '100',
          showOverflowTooltip: true,
        },
        {
          prop: 'genderName',
          label: '性别',
          width: '60'
        },
        {
          prop: 'birthday',
          label: '出生日期',
          formatter: ({ value }) => {
            return value ? this.$moment(value).format('YYYY-MM-DD') : '--'
          },
          width: '100',
        },
        {
          prop: 'age',
          label: '年龄',
          slot: 'age',
          width: '100',
        },

        {
          prop: 'mobile',
          label: '手机号',
        },
        {
          prop: 'identificationNumber',
          label: '身份证',
          showOverflowTooltip: true,
        },
        {
          prop: 'type',
          label: '状态',
          slot: 'type',
        },
        {
          prop: 'count',
          label: '就诊次数',
          slot: 'count',
        },
        {
          prop: 'educationName',
          label: '学历名称',
          hidden: true
        },
        {
          prop: 'nationName',
          label: '国籍',
          hidden: true
        },
        {
          prop: 'raceName',
          label: '民族',
          hidden: true
        },
        {
          prop: 'guardian',
          label: '监护人',
          hidden: true
        },
        {
          prop: 'birthplaceCityName',
          label: '出生地',
          hidden: true
        },
        {
          prop: 'nativeCityName',
          label: '籍贯',
          hidden: true
        },
        {
          prop: 'maritalStatusName',
          label: '婚姻',
          hidden: true
        },
        {
          prop: 'weight',
          label: '体重',
          hidden: true
        },
        {
          prop: 'aboBloodTypeCode',
          label: '血型',
          hidden: true
        },
        {
          prop: 'professionName',
          label: '职业',
          hidden: true
        },
        {
          prop: 'workCompanyName',
          label: '工作单位',
          hidden: true
        },
        {
          prop: 'householdAddressDetail',
          label: '户口地址',
          hidden: true
        },
        {
          prop: 'addressDetail',
          label: '现地址',
          hidden: true
        },
      ],
      url: urlMap.search,
    }
  },
  methods: {
    getVisitTotal (list) {
      let temptotal = 0
      if (list) {
        list.forEach((item, index) => {
          temptotal += item.visitNumber
        })
      }
      return temptotal
    },
    goPatientDetail (item) {
      if (this.getVisitTotal(item.visitNumList) === 0) {
        this.$messageTips(this, 'warning', '无就诊记录', '提示')
        return
      }
      this.$router.push({
        path: '/phr/patientdetail',
        query: {
          patientId: item.patientId,
          pagequery: { ...this.$route.query }
        }
      })
    },
    change (patientId) {
      this.$emit('delete', patientId)
    }
  }
}
</script>

<style scoped>
.list-container /deep/ .el-switch__core:after {
  width: 16px;
  height: 16px;
  top: -3px;
  left: -2px;
  box-shadow: 0 0 2px 0 #707794;
}
.list-container /deep/ .el-switch__core {
  width: 30px !important;
  height: 12px;
}
.list-container /deep/ .el-switch.is-checked .el-switch__core:after {
  left: 100%;
  margin-left: -13px;
  background-color: #2265e1;
}
</style>

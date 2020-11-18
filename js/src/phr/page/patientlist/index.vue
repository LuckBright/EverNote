<template>
  <div class="layout_inner gn">
    <listswitch @go="go" class="cp" :status="true"></listswitch>
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list">查询</el-button>
            <el-button size="small" @click="resetSearchForm()">重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <!--    :config-option="{isAutoId: false}"-->
    <ever-table
      ref="table"
      is-auto-height
      class="light-theme-table"
      row-key="id"
      :show-index="false"
      :columns="columns"
      :url="url"
      :params.sync="queryObj"
      :maxBtnCount="6"
    >
      <template slot="patientNo" slot-scope="scope">
        <template>
          <a href="javascript:" @click="goPatientDetail(scope.row)">{{
            scope.row.patientNumber
          }}</a>
        </template>
      </template>
      <template slot="age" slot-scope="scope">
        <template>
          {{ scope.row.birthday | birthdayComputed }}
        </template>
      </template>
      <template slot="count" slot-scope="scope">
        <template>
          <template v-if="getVisitTotal(scope.row.visitNumList) !== 0">
            <el-tooltip popper-class="date-year-tip" placement="bottom">
              <div slot="content">
                <p v-for="item in scope.row.visitNumList">
                  {{ item.visitTypeName }}：{{ item.visitNumber }}次
                </p>
              </div>
              <el-button type="text">
                {{ getVisitTotal(scope.row.visitNumList) }}
              </el-button>
            </el-tooltip>
          </template>
          <template v-else>
            <el-button type="text" style="color: #333"> 0 </el-button>
          </template>
        </template>
      </template>
    </ever-table>
  </div>
</template>

<script>
import urlMap from '@/phr/api/urls'
import listswitch from '@/phr/page/patientlist/listswitch'

// import { request } from '@/util/req'
let querySchema = [
  {
    name: 'patientName',
    label: '患者名称',
    props: {
      clearable: true,
      placeholder: '请输入患者名称'
    }
  },
  {
    name: 'patientNumber',
    label: '患者档案号',
    props: {
      clearable: true,
      placeholder: '请输入患者档案号'
    }
  },
  {
    name: 'mobile',
    label: '手机号',
    props: {
      clearable: true,
      placeholder: '请输入手机号'
    }
  },
  {
    name: 'identificationNumber',
    label: '身份证号',
    props: {
      clearable: true,
      placeholder: '请输入身份证号'
    }
  }
]
export default {
  components: {
    listswitch
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.rid = 'Auth_menu_phr_patientlist'
    return {
      tableListStatus: true,
      querySchema,
      queryObj,
      columns: [
        {
          prop: 'patientNo',
          label: '患者档案号',
          slot: 'patientNo',
        },
        {
          prop: 'patientName',
          label: '患者姓名',
        },
        {
          prop: 'genderName',
          label: '性别',
        },
        {
          prop: 'age',
          label: '年龄',
          slot: 'age',
        },
        {
          prop: 'birthday',
          label: '出生日期',
          formatter: ({ value }) => {
            return value ? this.$moment(value).format('YYYY-MM-DD') : '--'
          }
        },
        {
          prop: 'mobile',
          label: '手机号',
        },
        {
          prop: 'identificationNumber',
          label: '身份证号',
          showOverflowTooltip: true,
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
      url: urlMap.patientList,
      configOption: {
        // id: '_PHR_PATIENT_LIST'
        isAutoId: true,
      }
    }
  },
  methods: {
    go () {
      this.$router.push({ name: 'patientlist' })
    },
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
    /**
     *重置搜索条件
     */
    resetSearchForm () {
      this.$refs.form.resetForm()
      this.list()
    },
    /**
     * 请求列表
     */
    list () {
      this.$refs.table.list(true)
    },
  }
}
</script>

<style lang="scss" scoped>
.layout_inner {
  .cp {
    top: 64px;
  }
}
.gn {
  background: none;
}
</style>

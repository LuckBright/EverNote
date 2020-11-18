<template>
  <div class="pdt20">
    <div class="el-breadcrumb ever_breadcrumb"></div>
    <div id="sourcelist">
      <el-row>
        <el-col :span="24">
          <el-menu mode="horizontal" :default-active="currentPage" router>
            <el-menu-item class="sourcemenu bulec" :index="'/crm/sourcelist/'">渠道管理</el-menu-item>
            <el-menu-item class="sourcemenu" :index="'/crm/sourcekpi/'">渠道业绩</el-menu-item>
            <el-menu-item class="sourcemenu" :index="'/crm/sourcemember/'">渠道客户</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
      <el-row class="pd20">
        <el-col :span="24">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            ref="form"
            :inline="true"
            :is-query="true"
            @query="list(true)"
          >
            <template slot="times">
              <ever-range-picker :start.sync="queryObj.start" :end.sync="queryObj.end"></ever-range-picker>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
      <el-row class="pdr20">
        <el-col :span="24" align="right">
          <el-button type="primary" @click="addCreatesource">添加渠道</el-button>
        </el-col>
      </el-row>
      <el-row class="pd20">
        <el-col :span="24">
          <el-table :data="tableData" border class="el-td-border">
            <el-table-column prop="sn" label="渠道ID" width="120" align="center"></el-table-column>
            <el-table-column prop="name" label="渠道名称" width="150" align="center"></el-table-column>
            <el-table-column label="类型" align="center" width="120">
              <template
                slot-scope="scope"
              >{{scope.row.channelType && scope.row.channelType.name || '--'}}</template>
            </el-table-column>
            <el-table-column prop="coopCity" label="合作城市" align="center" width="120"></el-table-column>
            <!-- <el-table-column prop="opDptName" label="合作部门" align="center" width="120"></el-table-column> -->
            <!-- <el-table-column label="合作方式" align="center" width="120">
              <template slot-scope="scope">{{scope.row.coopTypeName || '--'}}</template>
            </el-table-column>-->
            <el-table-column prop="income" label="收入" align="center" width="240"></el-table-column>
            <el-table-column prop="ratio" label="收入占比" align="center" width="180"></el-table-column>
            <el-table-column prop="profit" label="业绩" width="80" align="center"></el-table-column>
            <el-table-column prop="opOrigName" label="机构" width="160" align="center"></el-table-column>
            <el-table-column prop="opDoctorName" label="维护人" width="160" align="center"></el-table-column>
            <el-table-column label="状态" align="center" min-width="120">
              <template slot-scope="scope">
                <sys-value type="THC_CC_MEMBER_CHANNEL_STATUS" :code="scope.row.status"></sys-value>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="linkDetailPage(scope.row.id)">查看</el-button>
                <!-- v-if="scope.row.level" -->
                <el-button size="small" type="primary" @click="goDown(scope.row)">查看下级渠道</el-button>
              </template>
            </el-table-column>
          </el-table>
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '../store/sourceapi'
import capi from '../../warehouse/store/clinicapi'
import coopapi from '../store/cooperationapi'
import depart from '../../warehouse/store/departmentapi'
import utillist from '../../util/list'
let querySchema = [
  {
    name: 'origId',
    comp: 'ever-org-select',
    label: '机构',
    props: {
      type: 'select',
      fields: 'id',
    }
  },
  {
    name: 'typeId',
    comp: 'ever-select',
    props: {
      options: [],
    },
    clearable: false,
    label: '类型',
    placeholder: '选择类型',
    span: 3
  },
  {
    name: 'status',
    label: '状态',
    comp: 'sys-type',
    props: {
      code: 'THC_CC_MEMBER_CHANNEL_STATUS',
      useValue: true,
      clearable: true
    }
  },
  {
    name: 'times',
    label: '时间范围',
    comp: 'custom'
  },
  // {
  //   name: 'profitSeq',
  //   label: '业绩',
  //   comp: 'sys-type',
  //   props: {
  //     code: 'THC_MEMBER_CHANNEL_PROFIT_SEQ',
  //     useValue: true
  //   }
  // },
  {
    name: 'name',
    label: '',
    comp: 'el-input',
    props: {
      placeholder: '渠道名称'
    }
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.times = []
    queryObj.start = ''
    queryObj.end = ''
    queryObj.parentId = 0
    return {
      api: api,
      capi,
      coopapi,
      depart: depart,
      querySchema: querySchema,
      visible: true,
      queryObj: queryObj,
      selected: []
    }
  },
  created () {
    // this.getClinicList(querySchema, 'origId')
    this.getCooptype(querySchema, 'typeId')
    this.currentPage = this.$route.path
  },
  methods: {
    linkDetailPage (id) {
      this.$router.push({ path: '/crm/sourcedetail', query: { id: id } })
    },
    goDown (row) {
      this.$router.push({ path: '/crm/sourcesub', query: { id: row.id, name: row.name } })
    },
    addCreatesource () {
      this.$router.push({ name: 'createsource', path: 'createsource' })
    },
    getCooptype (schema, name) {
      let typeId = this.$ever.getFieldFromSchema(schema, name)
      this.api.getTypelist().then(rs => {
        if (rs.data) {
          typeId.props.options = rs.data
        }
      })
    },
    getClinicList (schema, name) {
      let dpt = this.$ever.getFieldFromSchema(schema, name)
      this.capi.list().then(rs => {
        dpt.props.options = rs
      })
    }
  }
}
</script>
<style scoped>
#sourcelist {
  border: 1px solid #d1dbe5;
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.pd20 {
  padding: 20px;
}
.pdr20 {
  padding-right: 20px;
}
.sourcemenu {
  margin: 0px 20px;
  width: 90px;
  text-align: center;
}
.pdl20 {
  padding-left: 20px;
}
.bulec {
  color: #1c7bef;
}
</style>

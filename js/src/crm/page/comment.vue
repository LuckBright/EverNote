<template>
  <div id="consultlist">
    <ever-bread-crumb name="客户评价" show-edit-fnt="false"></ever-bread-crumb>
    <el-card>
      <el-row>
        <el-col :span="24">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            ref="form"
            :inline="true"
            :is-query="true"
            v-ever-bind-enter
            @query="list(true)"
          ></ever-form2>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            @selection-change="handleSelectionChange"
            :data="tableData"
            border
          >
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="appointmentId" label="预约编号" width="120" align="center"></el-table-column>
            <el-table-column prop="dptName" label="科室" width="150" align="center"></el-table-column>
            <el-table-column prop="auditOperatorName" label="医生" align="center" width="120"></el-table-column>
            <el-table-column
              v-for="(item, i) in tableData[0].evaItemList"
              :label="item.name"
              :key="i"
              align="center"
              width="120"
            >
              <template
                slot-scope="scope"
              >{{scope.row.evaItemList.filter(v => v.name === item.name)[0].score}}星</template>
            </el-table-column>
            <el-table-column prop="content" label="评价内容" align="center" width="240"></el-table-column>
            <el-table-column prop="patientName" label="客户" align="center" width="180"></el-table-column>
            <el-table-column prop="createTime" label="评价时间" width="160" align="center"></el-table-column>
            <el-table-column label="状态" align="center" min-width="120">
              <template slot-scope="scope">
                <sys-value type="THC_CC_COMMENT_STATUS" :code="scope.row.status"></sys-value>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button size="small" @click="linkDetailPage(scope.row.id)">查看</el-button>
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
    </el-card>
  </div>
</template>
<script>
import api from '../store/commentapi'
import depart from '../../warehouse/store/departmentapi'
import utillist from '../../util/list'
let querySchema = [
  {
    name: 'dptId',
    label: '科室',
    comp: 'el-select',
    props: {
      options: [],
      placeholder: '全部'
    }
  },
  {
    name: 'hasContent',
    label: '评价内容',
    comp: 'el-select',
    props: {
      options: [
        {
          id: '0',
          name: '无'
        },
        {
          id: '1',
          name: '有'
        }
      ],
      placeholder: '全部'
    }
  },
  {
    name: 'status',
    label: '状态',
    comp: 'el-select',
    props: {
      options: [
        {
          id: 1,
          name: '已发布'
        },
        {
          id: 2,
          name: '已隐藏'
        }
      ],
      placeholder: '全部'
    }
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    // queryObj.status = 1
    return {
      api: api,
      depart: depart,
      querySchema: querySchema,
      visible: true,
      queryObj: queryObj,
      selected: []
    }
  },
  created () {
    this.getDptList(querySchema, 'dptId')
  },
  methods: {
    getDptList (schema, name) {
      let dpt = this.$ever.getFieldFromSchema(schema, name).props
      this.depart.list().then(rs => {
        dpt.options = rs
      })
    },
    linkDetailPage (id) {
      this.$router.push({ name: 'commentinfo', path: 'commentinfo', query: { id: id } })
    },
    handleSelectionChange (val) {
      this.selected = val.filter(item => {
        item.mobile = item.patient.mobile
        return item.patientId !== null
      })
    }
  }
}
</script>
<style scoped>
#consultlist .title .el-col {
  height: 36px;
  line-height: 36px;
}
#consultlist .title .el-col strong {
  font-size: 18px;
}
#consultlist .title .el-col span {
  font-size: 12px;
}
#consultlist .tab {
  vertical-align: top;
}
#consultlist .tab .el-button {
  margin: 0;
  border-radius: 0;
  width: 25%;
}
</style>

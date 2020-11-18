<template>
  <div>
    <ever-table
      :columns="columns"
      :data="tableData"
      @eventChange="eventChange"
      table-default-cell-value="-"
      :is-record-url-params="false"
    >
      <template slot="content">
        <el-table-column label="操作"  width="80px">
          <template slot-scope="scope">
            <a v-show="scope.row.content && scope.row.status == 4" :href="scope.row.content" target="_blank">查看</a>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <ever-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount" :current="current"></ever-pagination>
  </div>
</template>

<script>
import api from '@/crm/store/feedbackapi'
import list from '@/util/list'
import { tableColWidth } from '@/util/table-config'
export default {
  mixins: [list],
  data () {
    return {
      api,
      listApiName: 'listJob',
      queryObj: {
        patientId: this.$route.params.patientId
      },
      columns: [
        {
          prop: 'qnaireName',
          showOverflowTooltip: true,
          label: '问卷名称'
        },
        {
          prop: 'orgName',
          showOverflowTooltip: true,
          label: '发送机构'
        },
        {
          prop: 'deptName',
          width: tableColWidth.name4W80,
          label: '科室'
        },
        {
          prop: 'doctorName',
          width: tableColWidth.name4W80,
          label: '医生'
        },
        {
          prop: 'appointmentTime',
          width: tableColWidth.datetimeAllW160,
          label: '预约时间'
        },
        {
          prop: 'sendTime',
          width: tableColWidth.datetimeAllW160,
          label: '问卷发送时间'
        },
        {
          prop: 'sender',
          width: tableColWidth.name4W80,
          label: '发送人',
          formatter ({value}) {
            return '系统'
          }
        },
        {
          prop: 'modifyTime',
          width: tableColWidth.datetimeAllW160,
          label: '问卷填写时间'
        },
        {
          prop: 'status',
          label: '问卷状态',
          width: tableColWidth.name4W80,
          formatter: ({value}) => {
            if (value === 4) {
              return '已填写'
            } else {
              return '未填写'
            }
          }
        },
        {
          slotName: 'content'
        }
      ],
    }
  },
  created () {},
  methods: {
    eventChange ({btnType, col, row}) {
      console.log(btnType, col, row)
    }
  }
}
</script>



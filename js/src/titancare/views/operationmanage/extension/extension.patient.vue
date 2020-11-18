<template>
  <div>
    <p>
      <span style="font-size: 12px">推荐患者数量：</span>
      {{totalCount}}
    </p>
    <ever-table
      ref="tableRef"
      :columns="columns"
      :data="tableData"
      border
    ></ever-table>
    <p style="text-align: right">
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        background
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </p>
  </div>
</template>
<script>
  import list from '@/titancare/mixins/list.js'
  import api from '@/titancare/api/operation/extension'
  export default {
    mixins: [list],
    data () {
      return {
        tableData: [],
        doctorObj: null,
        columns: [
          { prop: 'patientNumber', label: '患者档案号' },
          { prop: 'patientName', label: '姓名' },
          {
            prop: 'patientSex',
            label: '姓别',
            formatter ({ row }) {
              return row.patientSex && (row.patientSex === '1' ? '男性' : '女性')
            }
          },
          { prop: 'patientPhone', label: '手机号' },
          { prop: 'createTime', label: '绑定档案时间' },
        ],
      }
    },
    created() {
      this.doctorObj = JSON.parse(this.$route.query.obj)
      this.list()
    },
    methods: {
      list () {
        let params = {
          currentPage: this.current,
          pagesize: this.pagesize,
          doctorId: this.doctorObj.doctorId,
          startTime: this.doctorObj.startTime,
          endTime: this.doctorObj.endTime
        }
        api.getPatientListByDoctorId(params).then(rs => {
          if (!rs.errCode) {
            console.log('rs', rs)
            this.tableData = rs.data.resultList
            this.totalCount = rs.data.totalCount
          }
        })
      }
    },
  }
</script>

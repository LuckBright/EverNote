<template>
  <div>
    <ever-table
      :columns="columns"
      :data="tableData"
      @eventChange="eventChange"
      table-default-cell-value="--"
      :is-record-url-params="false"
    >
    </ever-table>
    <ever-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount" :current="current"></ever-pagination>
  </div>
</template>
<script>
  import list from '@/util/list'
  import api from '@/crm/store/supplylistapi'
  import { tableColWidth } from '@/util/table-config'
  export default {
    mixins: [list],
    data () {
      return {
        api,
        queryObj: {
          patientId: this.$route.params.patientId
        },
        columns: [
          {
            prop: 'itemname',
            showOverflowTooltip: true,
            label: '耗材名称'
          },
          {
            prop: 'diagnosis',
            label: '门诊诊断'
          },
          {
            prop: 'price',
            width: tableColWidth.name4W80,
            align: 'right',
            label: '项目单价',
            formatter: ({value}) => {
              return this.$filters.formatToFinacial(value)
            }
          },
          {
            prop: 'quantity',
            width: tableColWidth.name4W80,
            align: 'right',
            label: '数量'
          },
          {
            prop: 'clinicName',
            label: '开单机构'
          },
          {
            prop: 'orderDeptName',
            label: '开单科室'
          },
          {
            prop: 'doctorName',
            label: '开单人'
          },
          {
            prop: 'storageRoomName',
            label: '发放库房'
          },
          {
            prop: 'outStaffName',
            width: tableColWidth.name4W80,
            label: '发放人'
          },
          {
            prop: 'outDate',
            width: tableColWidth.datetimeAllW160,
            label: '发放时间'
          },
          {
            prop: 'createTime',
            width: tableColWidth.datetimeAllW160,
            label: '结算时间'
          }
        ]
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

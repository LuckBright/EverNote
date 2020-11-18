<template>
    <div class="phr_detail_qitayizhu">
      <ever-table ref="table" :columns="columns" :data="tableData" border>
      </ever-table>
    </div>
</template>
<script>
import phrapi from '@/workspace/store/component'
export default {
  props: {
    params: {
      type: Object
    }
  },
  data () {
    return {
      tableData: [],
      columns: [
        // {
        //   name: 'adviceOrderDatetime',
        //   label: '开立时间',
        //   comp: 'custom'
        // },
        {
          prop: 'doctorAdviceContentJson',
          label: '项目名称',
          showOverflowTooltip: true
        },
        {
          prop: 'quantity',
          label: '数量',
          showOverflowTooltip: true
        },
        {
          prop: 'price',
          label: '金额',
          formatter: ({value, row}) => {
            // console.log('row', row)
            return '¥ ' + this.$filters.formatToFinacial(row.price * row.quantity, 2)
          },
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceRemark',
          label: '嘱托',
          showOverflowTooltip: true
        }
      ]
    }
  },
  created () {
    let params = {
      adviceType: 'other',
      orgId: this.params.visitOrgId,
      visitNumber: this.params.visitSerialNumber,
      patientId: this.params.patientId,
      // status: 4, // 已完成
      offset: 0,
      pagesize: 10000
    }
    if (Number(this.params.visitType) === 3) { // 住院没有接口暂时先这么写
      this.tableData = []
    } else {
      phrapi.opAdviceView(params).then(res => {
        this.tableData = res.data.resultList ? res.data.resultList : []
      })
    }
  }
}
</script>


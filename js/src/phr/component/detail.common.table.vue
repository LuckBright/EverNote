<template>
  <div>
<!--    :config-option="{isAutoId: false}"-->
    <ever-table
      ref="table"
      :fixedHeight="$route.query.fromType === 'crm' ? 1 : 130"
      class=""
      row-key="id"
      :show-index="false"
      :columns="tableColunmns"
      :params.sync="queryObj"
      :url="url"
      :maxBtnCount="6">
<!--      <template slot="setName" slot-scope="scope">-->
<!--        <template>-->
<!--          <span>{{scope.row.setName}}</span> - <span class="cGray"><sys-value type="THC_SET_VERSION" :code="scope.row.setVersion"></sys-value></span>-->
<!--        </template>-->
<!--      </template>-->
    </ever-table>
  </div>
</template>

<script>
import { formateColums } from '@/phr/util/formateData'
export default {
  props: {
    url: {
      type: [Object, String],
      default: () => {}
    },
    columns: {
      type: [Object, Array],
      default: () => []
    },
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      tableColunmns: [],
      queryObj: {
        visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
        visitSerialNumber: this.$route.query.visitSerialNumber || this.phrPatientActive.visitSerialNumber,
        patientId: this.$route.query.patientId,
        outpatientSerialNumber: this.$route.query.outpatientSerialNumber,
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
      }
    }
  },
  created () {
    this.tableColunmns = formateColums(this.columns, this.title)
  },
  methods: {
  }
}
</script>


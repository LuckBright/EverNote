<template>
  <div>
    <ever-table
      :columns="columns"
      :data="tableData"
      @eventChange="eventChange"
      table-default-cell-value="-"
      :is-record-url-params="false"
    >
      <template slot="opCol">
        <el-table-column label="操作"  width="120px">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleSee(scope.row)">查看</el-button>
            <el-button type="primary" @click="handlePrint(scope.row)">打印</el-button>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <ever-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount" :current="current"></ever-pagination>
    <detail-doc :title-info="detailObj.certificationName" ref="detail" :obj="detailObj"></detail-doc>
  </div>
</template>

<script>
import api from '@/workspace/store/proofrecord'
import memberApi from '@/crm/store/memberapi'
import list from '@/util/list'
import { tableColWidth } from '@/util/table-config'
import DetailDoc from '@/workspace/components/detaildoc'
import phrapi from '@/form/store/phrapi'
import docapi from '@/form/store/api'
import { jcpPrintEditor } from '@/util/common'
export default {
  mixins: [list],
  data () {
    return {
      api,
      listApiName: 'getProof',
      queryObj: {
        patientId: this.$route.params.patientId
      },
      columns: [
        {
          prop: 'certificationName',
          label: '证明名称'
        },
        {
          prop: 'createTime',
          width: tableColWidth.datetimeAllW160,
          label: '创建时间'
        },
        {
          prop: 'createName',
          width: tableColWidth.name5W90,
          label: '创建人'
        },
        {
          prop: 'updateTime',
          width: tableColWidth.datetimeAllW160,
          label: '最后修改时间'
        },
        {
          prop: 'updateName',
          width: tableColWidth.name5W90,
          label: '修改人'
        },
        {
          prop: 'treatmentTime',
          width: tableColWidth.datetimeAllW160,
          label: '就诊时间'
        },
        {
          prop: 'deptName',
          width: tableColWidth.name4W80,
          label: '就诊科室'
        },
        {
          prop: 'allDiagResult',
          label: '诊断',
          formatter: this.formatContent,
          showOverflowTooltip: true
        },
        {
          slotName: 'opCol'
        }
      ],
      detailObj: {}
    }
  },
  created () {
    memberApi.getBaseInfoById1({patientId: this.$route.params.patientId}).then(res => {
      if (res && res.data) Object.assign(this.detailObj, res.data)
    })
  },
  methods: {
    async handlePrint (row) { // 打印
      const htmlObj = await phrapi.getByRecordId4FormData(row.medicalRecordId)
      const config = await docapi.getTpl(row.formTemplateId)
      let printConfig = {}
      jcpPrintEditor(this, printConfig, config.pageSettings, [{ dom: htmlObj.data.text }])
    },
    handleSee (row) { // 查看
      Object.assign(this.detailObj, row)
      this.$refs.detail.toggle()
    },
    formatContent ({ value }) {
      const arr = []
      if (Array.isArray(value)) {
        value.forEach(item => {
          item.notify = ''
          item.checked = ''
          if (item.comment) {
            item.notify = `(${item.comment})`
          }
          if (item.diagnoseType === 2) {
            item.checked = '?'
          }
          if (item.diseaseName) {
            arr.push(
              `${item.diseaseNameEn || ''} ${item.diseaseName}${item.notify}${
                item.checked
              }`
            )
          } else if (item.diagName) {
            arr.push(
              `${item.diagNameEn || ''} ${item.diagName}${item.notify}${
                item.checked
              }`
            )
          }
        })
      }
      return arr.join(',')
    },
    eventChange ({btnType, col, row}) {
      console.log(btnType, col, row)
    }
  },
  components: {
    DetailDoc
  }
}
</script>

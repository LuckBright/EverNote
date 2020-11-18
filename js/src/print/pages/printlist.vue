<template>
  <div>
    <div class="layout_inner">
      <div class="panel-body">
        <div>
          <ever-form2 :schema="querySchema" v-model="queryObj" :is-query="true" :inline="true" :nosubmit="true">
          </ever-form2>
        </div>
        <ever-table
          :columns="columns"
          :url="printlist"
          :params.sync="queryObj"
          ref="table"
          >
          <template slot="op" slot-scope="scope">
            <!-- <el-dropdown split-button  size="mini" type="primary" trigger="click"
              @click="print(scope.row.busiCode, scope.row.dataReqParams)"
              @command="command => {print(scope.row.busiCode, scope.row.dataReqParams, false, command)}">
                打印
              <el-dropdown-menu slot="dropdown" class="table-button-menu">
                <el-dropdown-item v-for="lang in scope.row.langSupports" :key="lang" :command="lang">{{lang}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button
              size="mini"
              @click="print(scope.row.busiCode, scope.row.dataReqParams, true)">
              预览
            </el-button> -->
            <printbtn size="mini"
              :lang="scope.row.lang"
              :code="scope.row.busiCode"
              :params="scope.row.dataReqParams"
              :key="scope.row.busiCode"
              :support-langs="scope.row.langSupports">
            </printbtn>
            <el-button
              size="mini"
              @click="historyView(scope.row)">
              历史
            </el-button>
          </template>
        </ever-table>
      </div>
      <printhis :doc="currentDoc" ref="logview"></printhis>
    </div>
  </div>
</template>
<script>
import { list } from '@/print/store/urls'
import { everprint } from '@/util/print'
import printhis from './printhis'
import printbtn from '@/print/components/printbtn'
let querySchema = [
  {
    name: 'busiCode',
    label: 'code'
  }, {
    name: 'busiDocName',
    label: '文档名称'
  }, {
    name: 'patientId',
    label: '患者',
    comp: 'ever-patient-select'
  }, {
    name: 'startTime',
    comp: 'el-date-picker',
    label: '起始时间',
    props: {
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      placeholder: '选择起始时间'
    }
  }, {
    name: 'endTime',
    comp: 'el-date-picker',
    label: '结束时间',
    props: {
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      placeholder: '选择结束时间'
    }
  }
]
export default {
  data () {
    let columns = [
      {
        prop: 'busiCode',
        label: 'Code'
      },
      {
        prop: 'busiDocName',
        label: '文档名称'
      },
      {
        prop: 'createTime',
        label: '时间'
      },
      {
        prop: 'printStatus',
        label: '状态',
        formatter ({ value }) {
          return value === 0 ? '待打印' : '已打印'
        }
      },
      {
        slot: 'op',
        label: '操作'
      }
    ]
    return {
      columns,
      querySchema,
      queryObj: {
        patientId: null,
        busiCode: null,
        busiDocName: null,
        startTime: null,
        endTime: null
      },
      printlist: list,
      currentDoc: null
    }
  },
  methods: {
    print (code, params, preview, lang) {
      everprint(code, params, {
        preview,
        lang
      })
    },
    historyView (row) {
      this.currentDoc = row
      this.$refs.logview.open()
    }
  },
  components: {
    printhis,
    printbtn
  }
}
</script>


<template>
  <el-dialog
    title="打印历史"
    :visible.sync="dialogVisible"
    >
    <ever-table
      v-if="queryObj.busiDocId"
      :key="tkey"
      :columns="columns"
      :url="loglist"
      :params.sync="queryObj"
      :is-record-url-params="false"
    >
    <template slot="op" slot-scope="scope">
      <el-button
        size="mini"
        @click="print(scope.row.id, doc.busiCode, doc.dataReqParams, false)">打印</el-button>
      <el-button
        size="mini"
        @click="print(scope.row.id, doc.busiCode, doc.dataReqParams, true)">预览</el-button>
    </template>
    </ever-table>
  </el-dialog>
</template>
<script>
  import {everprintlog} from '@/util/print'
  import {loglist} from '@/print/store/urls'
  export default {
    props: ['doc'],
    data () {
      let columns = [
        {
          label: '操作人',
          prop: 'optUserName'
        },
        {
          label: '时间',
          prop: 'createTime'
        },
        {
          slot: 'op',
          label: '操作'
        }
      ]
      let queryObj = {}
      if (this.doc) {
        queryObj = {busiDocId: this.doc.busiDocId}
      }
      return {
        dialogVisible: false,
        loglist: loglist,
        queryObj,
        columns
      }
    },
    methods: {
      print (id, code, params, preview) {
        everprintlog(id, code, params, {
          preview
        })
      },
      open () {
        this.dialogVisible = true
      }
    },
    watch: {
      'doc': {
        handler (newVal) {
          if (newVal) {
            this.queryObj.busiDocId = this.doc.busiDocId
          }
        }
      }
    },
    computed: {
      tkey () {
        return this.doc.busiDocId + this.dialogVisible
      }
    }
  }
</script>

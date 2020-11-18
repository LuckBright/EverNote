<template>
  <div>
      <el-table
        v-if="docs.length>0"
        ref="table"
        class="margin no-border"
        :data="docs"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column align="left">
          <template slot="header">
            {{ $t(title) }}
          </template>
          <template slot-scope="scope">
            <div style="width: 100%">
              <span style="color:#666;font-size:14px;">{{ $t(scope.row.label) }}</span>
              ：{{scope.row.value }}
              <el-button type="text" @click="quoteVal(scope.row)">引用</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import ParseHtml from '@/emr/config/parsehtml.js'
import Quote from '@/emr/config/quote.js'
export default {
  inject: ['recordInfo'],
  props: {
    dataId: {
      type: String
    },
    title: {
      type: String
    }
  },
  data () {
    return {
      quote: new Quote(this),
      designerId: this.recordInfo.designerId,
      parseHtml: new ParseHtml(),
      disabled: false,
      selectedArr: [],
      docs: []
    }
  },
  created () {
    this.getInstance()
  },
  watch: {
    'dataId': function () {
      this.getInstance()
    },
    docs: {
      handler (val) {
        console.log(val)
      },
      deep: true
    }
  },
  methods: {
    quoteVal (row) {
      this.quote.quoteFromDoc({designerId: this.designerId, quoteInfo: row})
    },
    async getInstance () {
      let res = await request(urlMap.medicalRecord.getInstance, {
        id: this.dataId
      }, 'get')
      if (res.data) {
        this.html = res.data.data.text
        this.parseHtml.insertHTML(this.html)
        this.docs = this.parseHtml.getData()
        this.docs = this.docs.filter(item => {
          return item.value !== ''
        })
      }
    },
    storeSelected () {

    }
  }

}
</script>
<style>
.el-table .none {
  display: none;
}
</style>

<style lang="scss" scoped>
/deep/ .el-table .el-table-column--selection .cell {
  overflow: visible;
}
.label {
  font-size: 14px;
  font-weight: bold;
}
.form-item-ref {
  margin-bottom: 15px;
}
.bg {
  background-image: linear-gradient(
    -269deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.02) 100%
  );
  font-size: 16px;
}
.m {
  margin-left: 12px;
}
.margin {
  margin: 0px;
}
/deep/ .el-table {
  tr:hover {
    td {
      background-color: transparent !important;
    }
  }
  .el-table__header-wrapper {
    th {
      background: transparent;
    }
  }
}
</style>


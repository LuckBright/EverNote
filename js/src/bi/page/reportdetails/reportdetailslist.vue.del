<template>
  <div>
    <ever-bread-crumb name="报表详细" :showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          :inline="true"
          :is-query="true"
        >
          <template slot="default">
            <el-form-item>
              <el-button @click="list(true)">查询</el-button>
            </el-form-item>
          </template>
        </ever-form2>
        <div class="main-option">
          <h4>{{obj.hisReportName}}</h4>
          <el-button type="primary" @click="handleExport">导出</el-button>
          <el-button type="primary" @click="handlePrint">打印</el-button>
        </div>
      </div>
      <ever-form2
        :schema="totalSchema"
        v-model="totalObj"
        ref="formTotal"
        :span="12"
        :nosubmit="true"
      ></ever-form2>
      <iframe
        v-if="biReportUrlUser"
        id="printIframe"
        ref="iframe"
        :src="biReportUrlUser"
        frameborder="0"
        style="width: 100%;positon: relative; top: 0;height: calc(100vh - 400px)"
      ></iframe>
      <el-row type="flex" justify="end" v-if="totalCount">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-row>
      <!-- 新报表方法，待所有报表启用postMessage统一返回数据启用 -->
      <!-- <ever-form2 :schema="totalSchema" v-model="totalObj" ref="formTotal" :span="12" :nosubmit="true"></ever-form2>
      <div v-if="totalCount">
        <iframe v-if="biReportUrlUser" id="printIframe" ref="iframe" :src="biReportUrlUser" frameborder="0" style="width: 100%;positon: relative; top: 0;height: calc(100vh - 400px)"></iframe>
        <el-row type="flex" justify="end">
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pagesize="pagesize"
            :totalCount="totalCount" :current="current">
          </ever-pagination>
        </el-row>
      </div>
      <ever-no-data v-else></ever-no-data>-->
    </div>
  </div>
</template>
<script>
// import reportsetApi from '@/bi/store/reportsetapi'
import { switchQuerySchema, switchTotalSchema } from '@/bi/util/reportconfig'
import moment from 'moment'
import list from '@/util/list'
import { frPrint } from '@/util/print'

import urlMap from '@/systemset/urls'
import { request } from '@/util/req'

let querySchema = []
let totalSchema = []
export default {
  mixins: [list],
  data () {
    return {
      querySchema,
      queryObj: {},
      totalSchema,
      totalObj: {},
      objId: this.$route.params.id,
      obj: {},
      biReportUrlUser: '',
      cacheBiReportUrlUser: '',
      exportExcel: '&format=excel&extype=simple',
    }
  },
  created () {
    if (this.objId) {
      this.getDetails(this.objId)
    }
  },
  mounted () {
    let _this = this
    _this.totalCount = ''
    window.addEventListener('message', function (e) {
      if (e.data && !e.data.source) {
        let totalData = e.data
        _this.$nextTick(() => {
          _this.totalCount = totalData.totalRecord
          Object.assign(_this.totalObj, totalData)
        })
      }
    }, false)
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.list(true)
    },
    // 导出
    handleExport () {
      if (this.totalCount) {
        let exportUrl = `${this.cacheBiReportUrlUser}&${this._encodeSearchParams(this.queryObj, true)}&${this.exportExcel}`
        window.open(exportUrl, '_blank')
      }
    },
    // 打印
    handlePrint () {
      if (this.totalCount) {
        let params = JSON.parse(JSON.stringify(this.queryObj))
        Object.assign(params, { print: 1 })
        frPrint(this.obj.hisReportCode, params, { preview: true })
      }
    },
    createObject (hisReportCode) {
      querySchema = switchQuerySchema(hisReportCode) || []
      totalSchema = switchTotalSchema(hisReportCode) || []
      console.log(totalSchema, 'totalSchema')
      return {
        querySchema,
        queryObj: this.$ever.createObjFromSchema(querySchema),
        totalSchema,
        totalObj: this.$ever.createObjFromSchema(totalSchema)
      }
    },
    list (flag) {
      // 报表分页offset清零,返回当第一页
      if (flag) {
        this.offset = 0
        this.current = 1
      }
      this.biReportUrlUser = ''
      if (this.cacheBiReportUrlUser) {
        this.biReportUrlUser = `${this.cacheBiReportUrlUser}&${this._encodeSearchParams(this.queryObj)}`
      }
    },
    getDetails () {
      request(urlMap.report.getById, {
        id: this.$route.params.id
      }).then(res => {
        if (res.head.errCode === 0) {
          this.obj = res.data
          let result = res.data
          this.cacheBiReportUrlUser = JSON.parse(JSON.stringify(result.biReportUrlUser))
          this.querySchema = this.createObject(result.hisReportCode).querySchema
          this.queryObj = this.createObject(result.hisReportCode).queryObj
          this.queryObj.startTime = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
          this.queryObj.endTime = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
          this.totalSchema = this.createObject(result.hisReportCode).totalSchema
          this.totalObj = this.createObject(result.hisReportCode).totalObj
          this.list(true)
        }
      })
    },
    _encodeSearchParams (obj, flag) {
      let params = []
      Object.keys(obj).forEach((key) => {
        let value = obj[key]
        if (typeof value === 'undefined') {
          value = ''
        }
        if (key === 'endTime' && value) {
          let endTimeVal = value.substring(0, 10)
          value = endTimeVal + ' 23:59:59'
        }
        params.push([key, encodeURIComponent(value)].join('='))
      })
      if (!flag) params = [...params, ...[`pagesize=${this.pagesize}`, `offset=${this.offset}`]]
      return params.join('&')
    }
  },
  watch: {
    'queryObj.endTime' (val) {
      if (val) {
        let endTimeVal = val.substring(0, 10)
        this.$nextTick(() => {
          this.queryObj.endTime = endTimeVal + ' 23:59:59'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.main-option h4 {
  margin: 0;
  float: left;
  line-height: 36px;
}
</style>

/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-10-19 11:02:22
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-09 14:27:25
 * 采付结算管理 -- 发票列表
 */

<template>
  <div class="layout_inner flex_col_1_auto">
   <!-- 搜索域 -->
    <ever-form2
      onsubmit="return false;"
      v-model="queryObj"
      ref="form"
      :schema="querySchema"
      :inline="true"
      :isQuery="true"
      @query="list(true)">
      <template slot="default">
        <el-form-item>
          <el-button type="primary" @click="list()">查询</el-button>
          <el-button @click="resetFields">重置</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <doc-download @downFile="downFile" :exportType="3" ref="childMethods" btnTxt="导出"></doc-download>
        </el-form-item>
      </template>
    </ever-form2>


    <!-- 表格域 -->
      <!-- table-class="no-margin-table flex_column_full_hidden x-hidden small-padding"
      class="flex_scroll flex_hidden" -->
    <ever-table
      ref="tableList"
      :table-loading="loading"
      :columns="Columns"
      :data="tableData">
      <template slot-scope="{ row }" slot="operation">
        <div v-if="row.url">
          <!-- hack 图片预览功能 -->
          <!-- <div class="pos_re cur"><span class="pos_ab blue">查看</span></div>
          <el-image
            style="width: 30px; height: 25px; display: block"
            class="imgPos"
            :src="$ever.fileUrl2 + row.url"
            :preview-src-list="[$ever.fileUrl2 + row.url]">
          </el-image> -->
          <img-see :url="row.url"></img-see>
        </div>
      </template>
    </ever-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current"
      :pagesize="pagesize"
      :page-sizes="pageSizes"
    >
    </ever-pagination>
  </div>
</template>

<script>
import * as api from '@/rcm/payment/api/index'
import querySchema from './schema'
import Columns from './columns'
import list from '@/util/list'
import ImgSee from './img.see'

export default {
  name: 'INVOICE_LIST',
  mixins: [list],
  components: {
    ImgSee
  },
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      loading: false,
      querySchema,
      Columns,
      queryObj,
      listApiName: 'getInvoice',
      api,
      tableData: []
    }
  },
  methods: {
    downFile () {
      api.exportInvoice(this.queryObj).then(result => {
        const { data } = result
        if (data) {
          // 想尽一切办法拿到下载的url
          // let fileurl = this.$ever.fileUrl2 + data.fileId
          // this.$refs.childMethods.downfile(fileurl)
          window.open(this.$ever.fileUrl2 + data.fileId)
        } else {
          this.everWarning('系统异常，导出失败')
        }
      })
    },
    resetFields () {
      this.$refs.form.$refs.form.resetFields()
    }
  }
}
</script>

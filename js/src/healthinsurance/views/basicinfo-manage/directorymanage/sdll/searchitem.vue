<template>
  <div style="width:100%;">
    <ever-form2 :inline="true" :schema="schema" v-model="queryObj">
      <template slot="btns">
        <el-button type="primary" size="small" @click="query">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-table :data="tableData" border stripe>
      <el-table-column label="疾病编码" prop="jbbm"></el-table-column>
      <el-table-column label="疾病名称" prop="jbmc"></el-table-column>
      <el-table-column label="疾病名称拼音" prop="py"></el-table-column>
      <el-table-column label="门诊大病类别" prop="mzdblb"></el-table-column>
      <el-table-column label="社保机构编号" prop="sbjgbh"></el-table-column>
      <el-table-column label="险种范围" prop="xzfw"></el-table-column>
      <el-table-column label="注销标志" prop="zxbz"></el-table-column>
      <el-table-column label="服务范围" prop="fwfw"></el-table-column>
      <el-table-column label="备注" prop="bz"></el-table-column>
    </el-table>
    <ever-pagination
      :current="current"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
    <div>本次下载：{{count}}条数据，{{needToFresh?"还有待更新的数据":"已无待更新数据"}}</div>
  </div>
</template>

<script>
import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import list from '@/util/list'
import { schema } from './dir-schema.js'
import { queryYyxmInfoBySxh } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
export default {
  mixins: [list],
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      count: 0, // 本次下载的记录条数
      needToFresh: false // 是否还有需更新的记录
    }
  },
  methods: {
    query () {
      let params = {
        macId: this.macId,
        insuranceOrgId: sdllCode,
        jsonPara: {
          filetype: 'json',
          sxh: this.queryObj.sxh || 0
        }
      }
      queryYyxmInfoBySxh(params).then(res => {
        this.$messageTips(this, 'success', '查询成功')
        const { yyxm_ds: tableData, sl, sfjxxz } = res.data
        this.tableData = tableData
        this.count = sl
        this.needToFresh = sfjxxz
      }).catch((err) => {
        console.log('err', err)
      })
    }
  },
  created () {
    this.query()
  },
}
</script>

<template>
  <div style="width:100%;">
    <ever-form2 :inline="true" :schema="schema" v-model="queryObj">
      <template slot="btns">
        <el-button type="primary" size="small" @click="query">更新</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-table :data="tableData" border stripe>
      <el-table-column label="记录顺序号" prop="sxh"></el-table-column>
      <el-table-column label="医疗项目编码" prop="ylxmbm"></el-table-column>
      <el-table-column label="医疗项目标准名称" prop="ylxmbzmc"></el-table-column>
      <el-table-column label="拼音" prop="py"></el-table-column>
      <el-table-column label="适用症" prop="syz"></el-table-column>
      <el-table-column label="禁忌" prop="jj"></el-table-column>
      <el-table-column label="规格" prop="gg"></el-table-column>
      <el-table-column label="单位" prop="dw"></el-table-column>
      <el-table-column label="参考价" prop="ckj"></el-table-column>
      <el-table-column label="剂型码" prop="jxm"></el-table-column>
      <el-table-column label="注销标志" prop="zxbz"></el-table-column>
      <el-table-column label="生产企业" prop="scqy"></el-table-column>
      <el-table-column label="产地码" prop="cdm"></el-table-column>
      <el-table-column label="处方药标志" prop="cfybz"></el-table-column>
      <el-table-column label="GMP标志" prop="gmpbz"></el-table-column>
      <el-table-column label="最小规格" prop="zxgg"></el-table-column>
      <el-table-column label="更新时间" prop="gxsj"></el-table-column>
      <el-table-column label="药品标志" prop="ypbz"></el-table-column>
      <el-table-column label="结算项目编号" prop="jsxmbh"></el-table-column>
      <el-table-column label="注册证号" prop="zczh"></el-table-column>
      <el-table-column label="批准文号" prop="pzwh"></el-table-column>
      <el-table-column label="包装规格" prop="bzgg"></el-table-column>
    </el-table>
    <div>本次下载：{{count}}条数据，{{needToFresh?"还有待更新的数据":"已无待更新数据"}}</div>
  </div>
</template>

<script>
import list from '@/util/list'
import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { schema } from './dir-schema.js'
import { queryMlBySxh } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
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
          sxh: this.queryObj.sxh
        }
      }
      queryMlBySxh(params).then(res => {
        this.$messageTips(this, 'success', '更新成功')
        const { yyxm_ds: tableData, sl, sfjxxz } = res.data
        this.tableData = tableData
        this.count = sl
        this.needToFresh = sfjxxz
      }).catch((err) => {
        console.log('err', err)
      })
    }
  },
}
</script>

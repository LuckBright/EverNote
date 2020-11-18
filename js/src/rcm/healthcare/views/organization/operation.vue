/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-07 14:52:33
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-07-03 18:37:44
 * 医保管理 -- 经办机构信息
 */
<template>
<div class="layout_inner flex_col_1_auto" v-loading="loading">
  <ever-form2 :schema="schema" label-width="200px" v-model="obj" ref="form" :nosubmit="true" class="readform"></ever-form2>
</div>
</template>

<script>
import { getDesignnatedOrgHandelOrgInfo } from '@/rcm/store/otmdiscomponent/hlj-api.js'

const schema = [
  {
    name: 'orgNo',
    label: '机构编码:',
    comp: 'readonlyitem'
  },
  {
    name: 'orgName',
    label: '机构名称:',
    comp: 'readonlyitem'
  },
  {
    name: 'handelDischargeSettlementCanEnterDiseaseTypeManuallyCode',
    label: '办理出院结算时是否可以手工输入病种:',
    comp: 'readonlyitem'
  },
  {
    name: 'otherMark',
    label: '其他标志:',
    comp: 'readonlyitem'
  },
]
export default {
  data () {
    const obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      loading: true
    }
  },
  created () {
    getDesignnatedOrgHandelOrgInfo({
      macId: this.macId
    }).then(res => {
      const { data = {} } = res
      if (data) Object.assign(this.obj, data)
    }).finally(_ => {
      this.loading = false
    })
  }
}
</script>


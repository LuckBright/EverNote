<template>
<div>
  <div class="layout_inner">
    <ever-form-model
      :schema="schema"
      v-model="obj"
      :api="api"
      ref="form"
      labelWidth="140px"
      label-position="right">
    </ever-form-model>
    <div class="conbox">
      <el-checkbox v-model="checkstatus" :disabled="true">费用采集信息</el-checkbox>
    </div>
    <div class="conbox btnbox">
      <doc-download @downFile="downFile" size="small" ref="downloadfile" style="margin-right: 20px;"></doc-download>
    </div>
  </div>
</div>
</template>
<script>
  import api from '../store/settlementapi'
  let schema = [
    {
      name: 'startDate',
      label: '交易起始日期',
      outformat: 'yyyy-MM-dd',
      type: 'date'
    },
    {
      name: 'endDate',
      label: '交易终止日期',
      outformat: 'yyyy-MM-dd',
      type: 'date'
    },
    {
      name: 'patientId',
      label: '患者',
      type: 'patientselect',
      options: []
    }
  ]
  export default {
    data () {
      var obj = this.$ever.createObjFromSchema(schema)
      return {
        checkstatus: true,
        schema,
        obj,
        api
      }
    },
    methods: {
      downFile () {
        let that = this
        api.exportSettlementsInfo(Object.assign({}, this.obj)).then(response => {
          if (response.head.errCode === 0) {
            that.$refs.downloadfile.downfile(response.data.key, response.data.bucketName)
          } else {
            that.$refs.downloadfile.loading = false
          }
        }, errorFn => {
          that.$refs.downloadfile.loading = false
        })
      }
    },
    created () {
    }
  }
</script>
<style scoped>
  .conbox { padding-left: 140px; margin-bottom: 30px; clear: both; }
  .btnbox { margin-bottom: 10px; }
</style>

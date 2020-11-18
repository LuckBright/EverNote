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
      <el-radio v-model="obj.extype" label="1">药品目录</el-radio>
      <el-radio v-model="obj.extype" label="2">诊疗及服务设施目录</el-radio>
    </div>
    <div class="conbox btnbox">
      <!-- <upload-file @uploadSuccess="uploadSuccess" size="small" style="margin-right: 20px;"></upload-file> -->
      <upload-file @success="uploadSuccess" previewInline="true" maxNum="1" btnTxt="上传" style="float:left; margin-right: 20px;" tips="" uploadApiType="ucloud"></upload-file>
      <doc-download @downFile="downFile" ref="downloadfile" style="margin-right: 20px;"></doc-download>
    </div>
  </div>
</div>
</template>
<script>
  import api from '../store/medicalinsuexportapi'
  import insuranceorgapi from '@/insurance/store/insuranceorgapi'
  let schema = [
    {
      name: 'name',
      label: '医疗机构名称',
      disabled: true
    },
    {
      name: 'organizationCode',
      label: '医疗机构代码',
      disabled: true
    },
    {
      name: 'insuranceOrgId',
      label: '保险机构',
      type: 'select',
      options: []
    }
  ]
  export default {
    data () {
      var obj = this.$ever.createObjFromSchema(schema)
      obj.extype = '1'
      return {
        schema,
        obj,
        api
      }
    },
    methods: {
      uploadSuccess (result) {
        let params = {
          bucketName: result.bucket,
          key: result.name
        }
        if (this.obj.extype === '1') {
          api.medicineImport(params).then(result => {
            if (result.head.errCode === 0) {
              this.$notify({
                type: 'success',
                message: '上传成功'
              })
            }
          })
        } else {
          api.chargeItemsImport(params).then(result => {
            if (result.head.errCode === 0) {
              this.$notify({
                type: 'success',
                message: '上传成功'
              })
            }
          })
        }
      },
      downFile () {
        let that = this
        if (this.obj.extype === '1') {
          api.medicineExport().then(response => {
            that.$refs.downloadfile.downfile(response.data.key, response.data.bucketName)
          }, errorFn => {
            that.$refs.downloadfile.loading = false
          })
        } else {
          api.chargeItemsExport().then(response => {
            that.$refs.downloadfile.downfile(response.data.key, response.data.bucketName)
          }, errorFn => {
            that.$refs.downloadfile.loading = false
          })
        }
      }
    },
    created () {
      api.getClinicInfo().then(result => {
        this.obj.name = result.data.name
        this.obj.organizationCode = result.data.organizationCode
      })
      insuranceorgapi.list({
        corpType: '0'
      }).then(result => {
        for (var insur of result.data) {
          insur.name = insur.insuranceOrgCnName
        }
        this.$ever.getFieldFromSchema(this.schema, 'insuranceOrgId').options = result.data
        if (result.data.length > 0) {
          this.obj.insuranceOrgId = result.data[0].id
        }
      })
    }
  }
</script>
<style scoped>
  .conbox { padding-left: 140px; margin-bottom: 30px; clear: both; }
  .btnbox { margin-bottom: 10px; }
</style>

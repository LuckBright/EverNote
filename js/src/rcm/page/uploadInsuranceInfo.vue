<template>
  <div>
    <ever-bread-crumb name="归档资料上传" path="/financial/insuranceInfoManage"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <div style="border: 1px solid #ebedef">
          <div
            style="height:40px;background-color:#ebedef;line-height: 40px;margin-bottom: 20px;color: #000;padding-left: 10px;font-weight: bold;"
          >患者信息</div>
          <div class="panel-body" style="width:50%">
            <ever-form2
              class="diy-form"
              :schema="schema"
              v-model="obj"
              :span="24"
              :api="api"
              :info="true"
              :nosubmit="true"
              :rules="rules"
              ref="form"
              label-position="right"
            >
              <template slot="insurance">
                <ever-select
                  v-model="queryObj.insurance"
                  :options="periodArr"
                  :clearable="true"
                  style="width: 100%"
                ></ever-select>
              </template>
              <template slot="time">
                <date-picker v-model="queryObj.time" outformat="yyyy-MM-dd"></date-picker>
              </template>
              <template slot="settlementNo">
                <ever-select
                  v-model="queryObj.settlementNo"
                  :options="SettlementNoArr"
                  :clearable="true"
                  style="width: 100%"
                ></ever-select>
              </template>
              <ever-patient-select
                slot="patientId"
                v-model="queryObj.name"
                @select="(item) => {handleSelect(item)}"
              ></ever-patient-select>
            </ever-form2>
          </div>
        </div>
        <div style="border: 1px solid #ebedef;margin-top: 20px;">
          <div
            style="height:40px;background-color:#ebedef;line-height: 40px;margin-bottom: 20px;color: #000;padding-left: 10px;font-weight: bold;"
          >
            图片附件
            <span style="color:red;position:relative;top:5px;left:3px;">*</span>
          </div>
          <div style="padding: 0 0 20px 20px">
            <upload-file2
              @success="uploadSuccess"
              @change="fileList"
              listType="picture-card"
              :list="uploadList"
              v-if="updateShow"
            ></upload-file2>
          </div>
        </div>
        <div style="margin-top:20px;text-align: left;">
          <el-button type="primary" style="margin-right:20px;" @click="createInfo">保存</el-button>
          <el-button type="primary" @click="createInfo(2)" v-if="!isEdit">保存并新建</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import insuranceorgapi from '@/insurance/store/insuranceorgapi'
import api from '../store/insuranceInfoManageApi'
import list from '../../util/list'

let schema = [
  {
    name: 'patientId',
    comp: 'custom',
    label: '患者姓名'
  },
  {
    name: 'insurance',
    label: '保险公司',
    comp: 'custom'
  },
  {
    name: 'time',
    label: '看诊日期',
    comp: 'custom'
  },
  {
    name: 'settlementNo',
    placeholder: '结算单号',
    label: '结算单号',
    comp: 'custom'
  },
  {
    name: 'remark',
    placeholder: '备注',
    label: '备注',
    props: {
      maxlength: 50
    }
  }
]
export default {
  mixins: [list],
  data () {
    let validatePatientId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('必填项'))
      } else {
        callback()
      }
    }
    let rules = {
      patientId: [
        { validator: validatePatientId, trigger: 'blur' }// 使用required对这个这个姓名组件验证失效，使用自定义校验方法
      ],
      time: [
        { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    var obj = this.$ever.createObjFromSchema(schema)
    obj.name = ''
    return {
      api,
      obj,
      queryObj: obj,
      schema: schema,
      printObj: {},
      periodArr: [],
      SettlementNoArr: [],
      fileArr: [],
      isEdit: false,
      id: this.$route.params.id,
      uploadList: [],
      info: {},
      rules,
      isClear: false,
      updateShow: true
    }
  },
  created () {
    this.edit()
    this.getPeriodArr()
  },
  watch: {
    'obj.patientId': {
      async handler (cur, old) {
        if (!this.isClear && this.isEdit) {
          this.isClear = true
        } else {
          this.queryObj.settlementNo = ''
        }
        this.getSettlementNo(cur)
      },
      deep: true
    }
  },
  methods: {
    edit () {
      if (this.$route.params.id) {
        this.isEdit = true
        this.getInfo()
        // this.getEnableFormVal = await api.getEnableForm({id: this.$route.params.id})
      }
    },
    handleSelect (item) {
      this.queryObj.patientId = item.id
    },
    getInfo () {
      api.getInfo({ id: this.id }).then(result => {
        this.info = result.data
        this.queryObj.patientId = String(result.data.patientId)
        this.queryObj.remark = result.data.remark
        this.queryObj.name = result.data.name
        this.queryObj.time = result.data.updateTime
        this.queryObj.settlementNo = String(result.data.settlementNo)
        this.queryObj.insurance = String(result.data.comInsuranceOrg === '0' ? '' : result.data.comInsuranceOrg)
        result.data.detail.forEach(key => {
          let obj = {
            name: key.picName,
            url: key.picUrl
          }
          this.uploadList.push(obj)
        })
      })
    },
    fileList (fileList) {
      this.fileArr = fileList
    },
    uploadSuccess (file) {
    },
    getPeriodArr () {
      insuranceorgapi.list({}).then(result => {
        result.data.forEach((insur, index) => {
          insur.name = insur.insuranceOrgCnName
          insur.id = String(insur.id)
        })
        this.periodArr = result.data
      })
    },
    getSettlementNo (id) {
      api.getSettlementNo({ patientId: id }).then(result => {
        result.forEach((insur, index) => {
          insur.name = insur.settlementNo
          insur.id = String(insur.settlementNo)
        })
        this.SettlementNoArr = result
      })
    },
    clearInfo () {
      this.queryObj.patientId = ''
      this.queryObj.name = ''
      this.queryObj.insurance = ''
      this.queryObj.time = ''
      this.queryObj.settlementNo = ''
      this.queryObj.remark = ''
      this.SettlementNoArr = []
      this.updateShow = false
      this.uploadList = []
      setTimeout(() => {
        this.updateShow = true
      }, 500)
    },
    updateInfo (key) {
      let comInsuranceName = ''
      let settlementId = ''
      let type = ''
      let url = 'createInfo'
      this.periodArr.forEach(key => {
        if (key.id === this.queryObj.insurance) {
          comInsuranceName = key.insuranceOrgCnName
        }
      })
      this.SettlementNoArr.forEach(key => {
        if (key.id === this.queryObj.settlementNo) {
          settlementId = key.settlementId
          type = key.type
        }
      })
      let params = {
        patientId: this.queryObj.patientId,
        comInsuranceOrg: this.queryObj.insurance ? this.queryObj.insurance : 0,
        comInsuranceName: comInsuranceName,
        clinicDate: this.queryObj.time,
        settlementId: settlementId,
        settlementNo: this.queryObj.settlementNo,
        remark: this.queryObj.remark,
        type: type,
        details: []
      }
      this.fileArr.forEach(key => {
        params.details.push({ picUrl: key.url, picName: key.name })
      })
      if (this.isEdit) {
        params = Object.assign(this.info, params)
        url = 'update'
      }
      api[url](params).then(result => {
        this.$messageTips(this, 'success', '保存成功')
        if (key === 2) {
          this.clearInfo()
        } else {
          this.$router.push({ path: '/financial/insuranceInfoManage' })
        }
      })
    },
    createInfo (key) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (this.fileArr.length < 1) {
            this.$notify.error({
              title: '',
              message: '请至少上传一张图片！'
            })
            return
          }
          this.updateInfo(key)
        }
      })
    },
    linktosettlementlist (row) {
      this.$router.push({
        path: '/rcm/settlements',
        query: {
          q: JSON.stringify({
            settleDate: [row.settledate, row.settledate],
            patientId: row.patientid,
            dept: row.orderDept,
            insurorgid: row.insurOrgId
          })
        }
      })
    }
  }
}
</script>
<style type="text/css" scoped>
.diy-form.el-form--label-right .el-col.el-col-24:first-child label:before {
  content: "*";
  margin-right: 4px;
  color: #ff4949;
}
.diyUpload {
  float: right;
}
.preview_inline {
  display: none !import;
}
</style>

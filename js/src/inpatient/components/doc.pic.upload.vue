<template>
  <el-dialog
    title="上传"
    :visible.sync="dialogVisible"
    class="ui_dialog_02 spe3"
    :close-on-click-modal="closeOnClickModal"
  >
    <ever-form2 :schema="schema" v-model="obj" ref="form" :rules="rules" :nosubmit="true">
      <template slot="docType">
        <el-select v-model="docType" placeholder="请选择">
          <el-option
            v-for="sitem in docTypeOpts"
            :key="sitem.code"
            :label="sitem.name"
            :value="sitem.code"
            v-if="!!sitem.status && sitem.code !== '406'"
          ></el-option>
        </el-select>
      </template>
      <template slot="content">
        <upload-file
          ref="uploadFile"
          @success="uploadSuccess"
          @change="fileList"
          listType="picture-card"
          nomodal="true"
          :tips="uploadTips"
          :maxNum="maxNum"
          :list="showList"
        ></upload-file>
      </template>
    </ever-form2>
    <div class="dialog-footer" slot="footer">
      <el-button @click="closeDialog">
        <i class="iconfont icon-quxiao"></i>取消
      </el-button>
      <el-button type="primary" @click="submit">
        <i class="iconfont icon-tijiao"></i>确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/inpatient/store/phr'
import { DOC_MENU } from '@/inpatient/components/doc.menu.js'
import { objFind } from '@/util/common'
export default {
  data () {
    const DOC = DOC_MENU[400]
    const docTypeOpts = DOC.children
    let schema = DOC.schema
    let rules = DOC.rules
    let obj = this.$ever.createObjFromSchema(schema)
    let docType = this.docTypeCode || DOC.children[0].code
    return {
      api,
      DOC_MENU,
      objFind,
      schema,
      rules,
      obj,
      docType,
      docTypeOpts,
      dialogVisible: false,
      fileArr: [],
      maxNum: 5,
      detailData: null,
      showList: [],
      urlCode: objFind(DOC_MENU[400].children, { code: docType }).api,
      uploadTips: '图片大小不能超过10M，只支持jpg、png和jpeg格式，图片数量限制在5张以内',
      closeOnClickModal: false
    }
  },
  props: ['inpatientInfo', 'docTypeCode'],
  methods: {
    openDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
    },
    uploadSuccess: function (file) {
      console.log('file--->', file)
    },
    fileList: function (fileList) {
      this.fileArr = []
      if (fileList && fileList.length) {
        fileList.forEach(item => {
          this.fileArr.push(item.upload)
        })
      }
    },
    async getByHosNumber () {
      if (this.inpatientInfo && this.inpatientInfo.hospitalizedNumber) {
        const res = await api.getByHosNumber({ hospitalizedNumber: this.inpatientInfo.hospitalizedNumber }, this.urlCode)
        if (res && res.length) {
          this.detailData = res[0]
          this.showList = JSON.parse(this.detailData.content)
        } else {
          this.detailData = null
          this.showList = []
        }
      } else {
        this.showList = []
      }
    },
    async setUrlCode (isSet) {
      let params = this.$route.params
      if (isSet && params.parentCode === '400' && params.pageType === 'gallery') {
        this.docType = params.docCode
      }
      this.urlCode = objFind(DOC_MENU[400].children, { code: this.docType }).api
      await this.getByHosNumber()
    },
    async submit () {
      if (this.$refs.uploadFile.process) {
        this.$messageTips(this, 'info', '图片上传中，请稍后保存', '提示')
        return
      }
      if ((!this.detailData || !this.detailData.id) && (!this.fileArr || !this.fileArr.length)) {
        return
      }
      let data = Object.assign({}, this.inpatientInfo)
      data.content = JSON.stringify(this.fileArr)
      if (this.detailData && this.detailData.id) {
        data.id = this.detailData.id
      }
      data.noteType = '0'
      const res = await api.createOrUpdate(data, this.urlCode)
      if (res) {
        this.closeDialog()
        this.toDetailPage()
        this.$messageTips(this, 'success', '保存成功', '提示')
      } else {
        this.$messageTips(this, 'error', '保存失败', '提示')
      }
    },
    toDetailPage () {
      let params = this.$route.params
      if (params && params.parentCode === '400' && params.docCode === this.docType && params.pageType === 'gallery') {
        this.$emit('docUpload')
      } else {
        this.$router.push({
          name: 'inpatientDocPage',
          params: {
            parentCode: '400',
            docCode: this.docType,
            docChildCode: '1',
            pageType: 'gallery'
          },
          query: {
            patientId: this.inpatientInfo.patientId,
            hospitalizedNumber: this.inpatientInfo.hospitalizedNumber
          }
        })
      }
    }
  },
  watch: {
    'docType': {
      async handler () {
        if (this.$refs.uploadFile) this.$refs.uploadFile.setList()
        await this.setUrlCode()
      }
    },
    'dialogVisible': {
      async handler (val) {
        if (val) {
          await this.setUrlCode(true)
        }
      }
    }
  }
}
</script>

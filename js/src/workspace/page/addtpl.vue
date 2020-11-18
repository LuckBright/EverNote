<template>
  <el-dialog
    title="保存模版"
    :visible.sync="visible"
    class="ui_dialog_02 spe"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form  v-model="obj" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="模版名称" prop="name">
        <el-input v-model="obj.name" placeholder="请输入模版名称" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="模版类型" prop="businessType">
        <el-radio-group v-model="obj.businessType">
          <el-radio :label="1">机构模版</el-radio>
          <el-radio :label="2">个人模版</el-radio>
          <el-radio :label="3">科室模版</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">
        <i class="iconfont icon-quxiao"></i>取消
      </el-button>
      <el-button type="primary" @click="save">
        <i class="iconfont icon-tijiao"></i>确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import storage from '@/util/storage'
import urlMap from '@/systemset/urls'
import inpatientUrlMap from '@/inpatient/urls'
import { request } from '@/util/req'
export default {
  props: {
    content: {},
    show: Boolean,
    dptId: {
      type: String
    },
    schemaId: {
      type: String
    },
    formTplInfo: {// 文档型全部信息，表单型只有模版信息获取不到categoryId（因为表单要调两个接口）
      type: Object
    },
    code: {
      type: String
    }
  },
  data () {
    // 检测名称是否有冲突
    this.getCategoryIdByCode()
    var checkName = (rule, value, callback) => {
      this.chooseBusinessId()
      if (this.obj.name === '') {
        return callback(new Error('模版名称不能为空'))
      }
      let checkNameParams = {
        name: this.obj.name,
        businessId: this.obj.businessId,
        businessType: this.obj.businessType,
        categoryId: this.categoryId
      }

      request(urlMap.templateManage.checkName, checkNameParams).then(res => {
        if (res.data) {
          return callback(new Error('模版名称有冲突'))
        } else {
          callback()
        }
      })
    }
    return {
      obj: {
        name: '',
        businessType: 2,
        businessId: '',
      },
      designerId: Number(this.formTplInfo.designerId),
      categoryId: '',
      visible: this.show,
      rules: {
        name: [
          { required: true, trigger: ['change', 'blur'], validator: checkName }
        ],
        // businessType: [
        //   { required: true, trigger: 'change', validator: checkName }
        // ]
      },
      deleteKey: ['doctorId', 'dptId', 'formDataId', 'id', 'patientId', 'printCode', 'recordTime', 'visitId']
    }
  },
  created () {
    // this.getCategoryIdByCode()
  },
  methods: {
    getCategoryIdByCode () {
      request(inpatientUrlMap.medicalRecord.getCategoryByCode, {
        code: this.code
      }).then(res => {
        if (res.head.errCode === 0) {
        // 获取分类id
          this.categoryId = res.data.id
        }
      })
    },
    saveTpl () {
      this.getCategoryIdByCode()
      this.chooseBusinessId()
      if (!this.categoryId) {
        this.$messageTips('this', 'warnning', 'categoryId不存在')
      }
      let params = {
        name: this.obj.name,
        businessId: this.obj.businessId,
        businessType: this.obj.businessType,
        designerId: this.formTplInfo.designerId,
        categoryId: this.categoryId
      }
      // 判断是文档编辑器还是表单编辑器 1表单型 2文档型
      if (this.designerId === 1) {
        // 保存表单编辑器需要的一坨参数
        params.formTemplateReq = {
          designerId: '1',
          templateId: null,
          schema: {
            designerId: '1',
            templateId: this.formTplInfo.templateId,
            templateName: this.obj.name,
            element: this.formTplInfo.element,
            props: this.formTplInfo.props
          }
        }
        params.formDataReq = {
          formTemplateId: this.formTplInfo.templateId,
          data: this.content
        }
        if (params.formDataReq.data && params.formDataReq.data.hasOwnProperty('undefined')) {
          delete params.formDataReq.data['undefined']
        }
      } else {
        // 保存文档编辑器用的一坨参数
        params.formTemplateReq = {
          designerId: '2',
          templateId: null,
          schema: {
            templateName: this.obj.name,
            element: this.content,
            editable: true,
            formTemplateId: null,
            pageSettings: this.formTplInfo.pageSettings,
            templateId: null
          }
        }
      }

      // 保存成功重新渲染树和模版
      request(urlMap.templateManage.saveTpl, params).then(res => {
        if (res.head.errCode !== 0) return false
        this.$emit('saveTpl')
        this.$emit('finished')
        this.$messageTips(this, 'success', '保存成功', '提示')
        this.visible = false
      })
    },
    save () {
      let isValid = true
      this.$refs.form.validate(valid => {
        isValid = valid
      })
      if (isValid) {
        this.saveTpl()
      }
    },
    close () {
      this.$emit('update:show', false)
    },
    chooseBusinessId () {
      const type = Number(this.obj.businessType)
      if (type === 1) { // 机构
        this.obj.businessId = storage.getLocalStorage('CLINICID')
      } else if (type === 2) { // 个人
        this.obj.businessId = storage.getLocalStorage('USERID')
      } else {
        this.obj.businessId = this.dptId
      }
    }
  },
  watch: {
    'obj.businessType' (val) {
      this.$refs.form.validateField('name')
    },
    visible (val) {
      this.obj.name = ''
      this.$emit('update:show', this.visible)
    },
    show () {
      this.visible = this.show
    }
  }
}
</script>
<style lang="scss" scoped>
.tree_box {
  height: 300px;
  overflow-x: hidden;
  border: 1px solid #ccc;
  /deep/ .el-form-item__content {
    margin-left: 8px !important;
  }
  .el-tree-node__content {
    .custom-tree-node {
      position: relative;
    }
    .custom-tree-node > span {
      position: absolute;
      padding-left: 20px;
      z-index: 1;
      top: -20px;
      left: -20px;
    }
  }
}
</style>


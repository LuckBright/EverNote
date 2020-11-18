<template>
  <el-dialog title="引用模版"
             ref="quoteTpl"
             :visible="visible"
             class="dialog_quote_tpl"
             @update:visible="close"
             width="700px"
             @close="close"
             :close-on-click-modal="false"
             destroy-on-close>
    <el-form :model="form">
      <el-form-item label="显示名称"
                    :label-width="formLabelWidth">
        <el-input v-model="form.name"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label=""
                    :label-width="formLabelWidth">
        <el-divider></el-divider>
      </el-form-item>
      <el-form-item label=""
                    :label-width="formLabelWidth">
        <el-tabs v-model="activeName"
                 @tab-click="handleClick">
          <el-tab-pane label="科室"
                       name="3"></el-tab-pane>
          <el-tab-pane label="集团"
                       name="0"></el-tab-pane>
          <el-tab-pane label="机构"
                       name="1"></el-tab-pane>
          <el-tab-pane label="个人"
                       name="2"></el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item label=""
                    :label-width="formLabelWidth">
        <el-input placeholder="请输入模版名称"
                  suffix-icon="el-icon-search"
                  v-model="templateName">
        </el-input>
      </el-form-item>
      <el-form-item label=""
                    :label-width="formLabelWidth">
        <div class="tpl_list_wrap">
          <div class="tpl_list"
               v-for="item in tplList"
               :class="{'active':item.isChecked}"
               :key="item.id"
               @dblclick="dblQuote(item)"
               @click="checkedTpl(item)">
            {{item.name}}
          </div>
        </div>
      </el-form-item>
      <!-- <el-form-item label="模版属性" :label-width="formLabelWidth" v-if="rootCode==='BING_CHENG_JI_LU'">
          <el-checkbox label="另立专项" name="type"  v-model="form.anotherRecord" :true-label="1" :false-label="0"></el-checkbox>
          <el-checkbox label="另起一页" name="type"  v-model="form.anotherPage" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item> -->
      <el-form-item label=""
                    :label-width="formLabelWidth">
        <el-button type="primary"
                   @click="quote">引 用</el-button>
        <el-button @click="close">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
// import { tplList } from './data.js'
import storage from '@/util/storage'
export default {
  props: {
    visible: {
      type: Boolean
    },
    code: {
      type: String
    },
    dptId: {
      type: String
    },
    rootCode: {
      type: String
    }
  },
  data () {
    return {
      curTpl: {},
      tplList: [],
      dialogFormVisible: false,
      form: {
        name: '',
        anotherPage: 0,
        anotherRecord: 0
      },
      templateName: '', // 模版名称，搜索时候用
      activeName: '3',
      formLabelWidth: '120px',
      quoteObj: {},
      quoteTemplates: [],
      businessId: this.dptId
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.getCategoryByCode()
      }
    },
    templateName () {
      // console.log('模版名称变化')
      this.getTplList()
    },
    activeName (val) {
      this.quoteObj.formTemplateId = ''
      if (val === '3') { // 科室
        this.businessId = this.dptId
      } else if (val === '0') { // 集团
        this.businessId = storage.getLocalStorage('TENANTID')
      } else if (val === '1') { // 机构
        this.businessId = storage.getLocalStorage('CLINICID')
      } else if (val === '2') { // 个人
        this.businessId = storage.getLocalStorage('USERID')
      }
      // console.log('科室变化')
      this.getTplList()
    },
    code (val) {
      if (!this.code) return false
      this.activeName = '3'
      this.getCategoryByCode()
      // console.log('code变化', val)
    },
    'form.name' (val) {
      this.quoteObj.title = val
    }
  },
  methods: {
    dblQuote (tpl) {
      this.checkedTpl(tpl)
      this.quote()
    },
    getCategoryByCode () {
      request(urlMap.medicalRecord.getCategoryByCode, {
        code: this.code
      }).then(res => {
        if (res.head.errCode === 0) {
          this.curTpl = {
            id: res.data.id,
            categoryId: res.data.id,
            categoryName: res.data.name,
            type: res.data.type
          }
          this.getTplList()
        }
      })
    },
    getTplList () {
      request(urlMap.medicalRecord.tplList, {
        businessType: this.activeName,
        businessId: this.businessId,
        categoryId: this.curTpl.id,
        name: this.templateName
      }).then(res => {
        this.tplList = res.data
      })
    },
    checkedTpl (tpl) {
      this.tplList.map(item => {
        this.$set(item, 'isChecked', false)
      })
      let tmp = this.tplList.filter(item => {
        return item.id === tpl.id
      })[0]
      this.$set(tmp, 'isChecked', true)
      this.quoteObj.formTemplateName = tmp.name
      this.quoteObj.title = this.form.name || tmp.name
      this.quoteObj.formTemplateId = tmp.formTemplateId
      this.quoteObj.designerId = tmp.designerId
      this.quoteObj.deptId = tmp.businessId
      this.quoteObj.code = tmp.code
      this.quoteObj.id = tmp.id
      this.form.anotherPage = tmp.anotherPage
      this.form.anotherRecord = tmp.anotherRecord
      this.quoteObj.anotherPage = this.form.anotherPage
      this.quoteObj.anotherRecord = this.form.anotherRecord
    },
    handleClick (tab, event) {
    },
    close () {
      this.form.name = ''
      // this.activeName = '3'
      this.tplList.map(item => {
        this.$set(item, 'isChecked', false)
      })
      for (let key in this.quoteObj) {
        this.quoteObj[key] = ''
      }
      this.$emit('update:visible', false)
    },
    quote () {
      if (!this.quoteObj.formTemplateId) {
        this.$messageTips(this, 'warning', '请选择一个模版', '提示')
        return false
      }
      let localQuoteTemplates = storage.getLocalStorage('quoteTemplates')
      this.quoteTemplates = localQuoteTemplates ? JSON.parse(localQuoteTemplates) : []
      if (this.quoteTemplates) {
        if (this.quoteTemplates.includes(this.quoteObj.formTemplateId)) {
          this.$messageTips(this, 'warning', '已引用过当前模版尚未保存', '提示')
          return false
        }
      }
      this.quoteObj.isUpdate = true
      this.quoteObj.type = 'tpl'
      this.quoteObj.editable = true// 引用时病历为可编辑状态
      this.quoteObj.showSubmit = true
      this.quoteObj.recordType = Number(this.curTpl.type)
      this.quoteObj.status = 1
      this.quoteObj.categoryId = this.curTpl.id
      this.quoteObj.categoryName = this.curTpl.categoryName
      this.quoteObj.recordType = Number(this.curTpl.type)
      this.quoteObj.anotherPage = this.form.anotherPage
      this.quoteObj.anotherRecord = this.form.anotherRecord
      this.quoteObj.rootCode = this.rootCode
      this.$emit('quoteTpl', Object.assign({}, this.quoteObj))
      this.close()
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog_quote_tpl {
  /deep/.el-tabs__nav-wrap:after {
    background: transparent;
  }
  /deep/.el-tabs__header {
    margin: 0;
  }
  .el-form-item {
    margin: 10px;
  }
  /deep/.el-form-item__content {
    line-height: 32px;
  }
  /deep/.el-divider--horizontal {
    margin: 0;
  }
  .tpl_list_wrap {
    max-height: 320px;
    overflow-y: scroll;
    border: 1px solid #ccc;
  }
  .tpl_list {
    border-bottom: 1px solid #ccc;
    padding-left: 15px;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background: #409eff;
      color: #fff;
      cursor: pointer;
    }
  }
  .active {
    background: #409eff;
    color: #fff;
    cursor: pointer;
  }
}
</style>

<template>
    <div class="create_tpl">
        <el-dialog
          title="新建模版"
          :visible.sync="dialogVisible"
          width="470px"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :before-close="cancel">
          <div class="form">
            <ever-form2
              class="custom-form"
              ref="createTplForm"
              :schema="schema"
              v-model="form"
              :nosubmit="true"
              :rules="rules"
              labelWidth="80px"
            >
            <template slot="name">
                <check-name
                  :name="checkParams.name"
                  v-model="form.name" 
                  ref="checkName"
                  :space='workshop'
                  :checkNameParams="form"
                ></check-name>
              </template>
              <template slot="designerId">
                <el-radio v-model="form.designerId" label="2">文档</el-radio>
                <el-radio v-model="form.designerId" label="1"  v-if='workshop !== "tech"'>表单</el-radio>
              </template>
              <template slot="modelCopy">
                <el-radio-group v-model="form.delivery">
                  <el-radio :label="0">自定义模版</el-radio>
                  <el-radio :label="1">复用模版</el-radio>
                  <el-radio :label="2">关联模版</el-radio>
                </el-radio-group>
              </template>
              <template slot="searchTemplate">
                <el-autocomplete
                  :disabled="searchDisabled"
                  v-model="templateName"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入内容"
                  @select="handleSelect"
                  :popper-append-to-body="false"
                  style="width:100%;"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.name}}</div>
                  </template>
                </el-autocomplete>
              </template>
              <template slot="modelAttr">
                  <el-checkbox label="另立专项" name="type"  v-model="form.anotherRecord" :true-label="1" :false-label="0" :disabled="modelAttrrDisabled"></el-checkbox>
                  <el-checkbox label="另起一页" name="type"  v-model="form.anotherPage" :true-label="1" :false-label="0" :disabled="modelAttrrDisabled"></el-checkbox>
                  <!-- <el-checkbox label="自动增加时间锚点" name="type"  v-model="form.autoInsertTime" :true-label="1" :false-label="0" :disabled="modelAttrrDisabled"></el-checkbox>
                  <el-checkbox label="自动增加标题" name="type"  v-model="form.autoInsertTitle" :true-label="1" :false-label="0" :disabled="modelAttrrDisabled"></el-checkbox> -->
              </template>
              
              <template slot="defaultTpl">
                <div class="default_tpl">
                  <el-checkbox 
                    v-if="Number(checkParams.businessType)===3"
                    v-model="defaultVal" 
                    :true-label="1" 
                    :false-label="0">设置为默认打开的模版</el-checkbox>
                  <ever-subject-select
                    v-else-if="Number(checkParams.businessType)===1"
                    ref="ess" 
                    v-model="subjectList" 
                    placeholder="请选择科室"
                    type="tree" 
                    multiple
                    :params="{orgId:checkParams.businessId,type1CodeList:type1CodeList,type2CodeList:type2CodeList}">
                  </ever-subject-select>
                  <el-tree
                    v-else-if="Number(checkParams.businessType)===0"
                    :data="orgData"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    @check="check"
                    :props="defaultProps"
                    >
                  </el-tree>
                </div>
              </template>
              
            </ever-form2>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import { request } from '@/util/req'
import { uniq } from 'lodash'
import {BING_CHENG_JI_LU_CODE} from '@/emr/config/template.config.js'
import checkName from '@/emr/components/check.tpl.name'
export default{
  name: 'add_tpl',
  components: {
    checkName
  },
  props: {
    api: Object,
    dialogVisible: {
      type: Boolean,
      default: false
    },
    workshop: String,
    checkParams: {
      type: Object,
      required: true,
      default () {
        return {
          id: '', // 集团模版创建的时候需要这个参数
          categoryId: '',
          categoryName: '',
          businessType: '',
          businessId: '',
          categoryDepts: [],
          code: '',
          type: ''// 1住院，2门诊，3护理，4，其他，5词条
        }
      }
    }
  },
  data () {
    let form = {}
    let schema = [
      {
        name: 'name',
        label: '模版名称',
        comp: 'custom'
      },
      {
        name: 'designerId',
        label: '模版类型',
        comp: 'custom'
      },
      {
        name: 'modelCopy',
        label: '复用模版',
        comp: 'custom'
      },
      {
        name: 'searchTemplate',
        label: '搜索模版',
        comp: 'custom'
      },
      {
        name: 'modelAttr',
        label: '模版属性',
        comp: 'custom'
      },
      {
        name: 'defaultTpl',
        label: '模版设置',
        comp: 'custom'
      },
    ]
    if (this.workshop === 'tech') {
      schema.splice(4, 1)
    }
    if (Number(this.checkParams.businessType) === 2 || this.workshop === 'tech') {
      schema = schema.slice(0, -1)
    }

    form = this.$ever.createObjFromSchema(schema)
    form.designerId = '2'
    form.delivery = 0
    form.anotherPage = 0
    form.anotherRecord = 0
    form.autoInsertTime = 0
    form.autoInsertTitle = 0
    form.categoryDepts = []

    form.name = ''
    form.businessType = this.checkParams.businessType
    form.businessId = this.checkParams.businessId
    form.categoryId = this.checkParams.categoryId

    // 检测是否选择可复用的模版
    var checkTplId = (rule, value, callback) => {
      if (!this.form.formTemplateId) {
        if (this.form.delivery === 0) {
          callback()
        } else {
          callback(new Error('请选择一个模版'))
        }
      } else {
        callback()
      }
    }
    return {
      type1CodeList: [],
      type2CodeList: [],
      orgData: [],
      defaultVal: 0,
      subjectList: [],
      form,
      searchDisabled: true,
      templateName: '',
      schema,
      rules: {
        searchTemplate: [
            { required: true, validator: checkTplId, trigger: ['change', 'blur'] }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    getOrgTree () {
      request(this.api.templateManage.getOrgTree, {
        type: this.checkParams.type
      }).then(res => {
        if (res.head.errCode === 0) {
          this.orgData = res.data.tree
          this.$refs.tree.setCheckedKeys(this.checkParams.categoryDepts)
        }
      })
    },
    check (data, obj) {
      let checkedNodes = this.$refs.tree.getCheckedNodes()
      this.form.categoryDepts = []
      checkedNodes.forEach(item => {
        if (item.leaf === 1) { // 1为科室节点，0为机构节点
          this.form.categoryDepts.push(item.id)
        }
      })
      this.form.categoryDepts = uniq(this.form.categoryDepts)
    },
    querySearchAsync (tplName, cb) {
      if (this.form.delivery === 1) { // 复用模版
        return this.getTplList(tplName, cb)
      } else if (this.form.delivery === 2) { // 关联模版
        return this.getOldTplList(tplName, cb)
      }
    },
    handleSelect (item) {
      this.templateName = item.name
      this.form.formTemplateId = item.formTemplateId
    },
    cancel (done) {
      this.$refs.createTplForm.$refs.form.resetFields()
      this.$emit('update:dialogVisible', false)
      this.$emit('close')
    },
    submitForm () {
      if (this.workshop !== 'tech') {
        if (Number(this.checkParams.businessType) === 0) {
          this.check()
        } else if (Number(this.checkParams.businessType) === 1) {
          let checkedNodes = this.$refs.ess.$refs.tree.getCheckedNodes()
          if (checkedNodes && checkedNodes.length > 0) {
            checkedNodes.forEach(item => {
              this.form.categoryDepts.push(item.id)
            })
          } else {
            this.form.categoryDepts = []
          }
          // this.form.categoryDepts = this.$refs.ess.$refs.tree.getCheckedNodes()
        }
      }
      this.$refs.createTplForm.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.checkName.$refs.tplName.validate(valid1 => {
            if (valid1) {
              this.$emit('submit', Object.assign({}, this.checkParams, this.form))

              this.$refs.createTplForm.$refs.form.resetFields()
            }
          })
        } else {
          console.error('提交失败')
          return false
        }
      })
    },
    getOldTplList (tplName, cb) {
      let params = {
        name: tplName,
        designerId: this.form.designerId
      }
      request(this.api.templateManage.getOldTplList, params).then(res => {
        if (!res.data) return false
        let list = res.data.resultList
        if (this.workshop === 'tech') { // tech的接口返回的数据结构不同，兼容处理了下
          list = res.data
          list.map(item => {
            item.id = item.formTemplateId
          })
        }
        if (list.length === 0) {
          this.form.formTemplateId = ''
        } else {
          list = list.map(item => {
            this.$set(item, 'formTemplateId', item.id)
            return item
          })
        }
        cb(list)
      })
    },
    getTplList (name, cb) {
      let params = Object.assign({}, this.checkParams, {
        name,
        designerId: this.form.designerId
      })
      request(this.api.templateManage.getTplList, params).then(res => {
        if (!res.data) return false
        let list = []
        res.data.map(item => {
          item.id = item.formTemplateId
          list.push(item)
        })
        if (list.length === 0) {
          this.form.formTemplateId = ''
        }
        cb(list)
      })
    }
  },
  computed: {
    modelAttrrDisabled () {
      return !BING_CHENG_JI_LU_CODE.includes(this.checkParams.code)
    }
  },
  watch: {
    'defaultVal' (val) {
      // 适用科室模版
      if (Number(val) === 1) {
        this.form.categoryDepts = [this.checkParams.businessId]
      } else {
        this.form.categoryDepts = []
      }
    },
    'subjectList': {
      handler (val) {
        this.form.categoryDepts = val
        // console.log('科室', val)
      }
    },
    'form.delivery': {
      handler (val) {
        this.templateName = ''
        this.form.formTemplateId = ''
        switch (val) {
          case 0:// 自定义模版
            this.searchDisabled = true

            if (this.$refs.createTplForm) {
              this.form.formTemplateId = ''
              this.$refs.createTplForm.$refs.form.clearValidate('searchTemplate')
            }
            break
          case 1:// 复用模版
            this.searchDisabled = false
            break
          case 2:// 关联模版
            this.searchDisabled = false
            break
        }
      },
      immediate: true
    },
    'form.designerId': {
      handler (val) {
        this.templateName = ''
        this.form.formTemplateId = ''
        this.form.delivery = 0
      },
      immediate: true
    }
  },
  created () {
    if (Number(this.checkParams.businessType) === 0 && this.workshop !== 'tech') {
      this.getOrgTree()
    } else if (Number(this.checkParams.businessType) === 1) {
      this.subjectList = this.checkParams.categoryDepts
      if (Number(this.checkParams.type) === 1 || Number(this.checkParams.type) === 3) { // 住院 护理
        this.type1CodeList = ['01']
        this.type2CodeList = ['01.01']
      } else if (Number(this.checkParams.type) === 2) { // 门诊
        this.type1CodeList = ['01', '02']
        this.type2CodeList = ['01.02', '01.03', '01.04', '02.01', '02.02', '02.03', '02.04']
      } else {
        this.type1CodeList = []
        this.type2CodeList = []
      }
    }
  },
  mounted () {
    if ((this.checkParams.businessType === 3) && (this.checkParams.categoryDepts.length > 0)) {
      this.defaultVal = 1
    }
  }
}
</script>
<style lang="scss" scoped>
.create_tpl{
  /deep/.el-form-item__content .default_tpl{
    max-height: 300px;
    overflow: hidden;
    overflow-y: auto;
     min-height: 33px;
    .el-tree {
      margin-top: 3px;
    }
    .subjectWar {
      height: 300px;
    }
  }
  /deep/.el-dialog__footer {
    border-top-color: #eeeeee;
  } 
}

</style>

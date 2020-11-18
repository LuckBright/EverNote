<template>
  <div class="create_entry">
    <el-dialog
      title="编辑词条"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel">
      <ever-form2
              class="custom-form"
              ref="createTplForm"
              :schema="schema2"
              v-model="form"
              :nosubmit="true"
              :rules="rules"
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
            </ever-form2>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { request } from '@/util/req'
import checkName from '@/emr/components/check.tpl.name'
let schema2 = [
  {
    name: 'name',
    label: '模版名称',
    comp: 'custom'
  }
]
export default {
  components: {
    checkName
  },
  props: {
    api: Object,
    dialogVisible: Boolean,
    workshop: String,
    checkParams: {
      type: Object,
      default () {
        return {
          categoryId: '',
          businessType: '',
          businessId: ''
        }
      }
    }
  },
  data () {
    let form = {}
    form = this.$ever.createObjFromSchema(schema2)

    form.name = ''
    form.businessType = this.checkParams.businessType
    form.businessId = this.checkParams.businessId
    form.categoryId = this.checkParams.categoryId

    // 检测是否选择可复用的模版
    var checkTplId = (rule, value, callback) => {
      if (!this.form.formTemplateId) {
        if (this.form.delivery) {
          callback(new Error('请选择一个模版'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      form,
      schema2,
      template_holder: '请输入模版名称',
      rules: {
        searchTemplate: [
            { required: true, validator: checkTplId, trigger: ['change', 'blur'] }
        ]
      },
      searchDisabled: true,
      templateName: ''
    }
  },
  watch: {
    'form.delivery': {
      handler (val) {
        this.templateName = ''
        if (val) {
          this.searchDisabled = false
        } else {
          this.searchDisabled = true
        }
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.createTplForm.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.checkName.$refs.tplName.validate(valid1 => {
            if (valid1) {
              this.update()
              this.$refs.createTplForm.$refs.form.resetFields()
            }
          })
        } else {
          console.error('提交失败')
          return false
        }
      })
    },
    update () {
      delete this.form.formTemplateId
      this.$emit('update', Object.assign({}, this.checkParams, this.form))
    },
    handleSelect (item) {
      this.templateName = item.name
      this.form.formTemplateId = item.id
    },
    querySearchAsync (tplName, cb) {
      if (this.form.delivery) {
        return this.getTplList(tplName, cb)
      }
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
          this.template_holder = '无可用模版'
          this.searchDisabled = true
        } else {
          this.searchDisabled = false
          this.template_holder = '请选择一个模版'
        }
        cb(list)
      })
    },
    cancel () {
      this.$refs.createTplForm.$refs.form.resetFields()
      this.$emit('update:dialogVisible', false)
      this.$emit('close')
    }
  }
}
</script>

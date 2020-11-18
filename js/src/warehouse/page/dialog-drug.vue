<template>
  <div id="">
    <el-dialog :title="title" :visible.sync="dialogFlag" class="ui_dialog_02 spe">
      <ever-form2 :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" nosubmit="true">
      </ever-form2>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm"><i class="icon iconfont icon-tijiao"></i>提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import form from '@/util/form'
import {CLASSIFY, CLASSIFYS} from '../schema/drug'
import { Notification } from 'element-ui'
var obj = {}
var schema = []
export default {
  props: ['title', 'api', 'handleId'],
  mixins: [form],
  data () {
    if (this.$route.path === '/global/generals') {
      schema = CLASSIFY
    } else {
      schema = CLASSIFYS
    }
    obj = this.$ever.createObjFromSchema(schema)
    obj.level = 1
    obj.pcode = ''
    obj.typeList = []
    return {
      obj,
      schema,
      dialogFlag: false,
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        enableDate: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ]
      }
    }
  },
  created () {
    this.api.bylevel({level: 1}).then(res => {
      if (res.length) {
        for (let alias of res) {
          alias.id = alias.code
        }
        this.$ever.getFieldFromSchema(this.schema, 'classify1').props.options = res
      }
    })
  },
  methods: {
    submitForm: function () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          if (this.$route.path === '/global/generals' && !this.obj.classify1) {
            this.$notify({
              type: 'warning',
              message: '请选择四级分类'
            })
            return
          }
          let classifys = [this.obj.classify1, this.obj.classify2, this.obj.classify3, this.obj.classify4]
          let arrs = []
          for (let i = 0; i < classifys.length; i++) {
            if (classifys[i]) {
              arrs.push(classifys[i])
            }
          }
          this.obj.pcode = arrs[arrs.length - 1]
          this.obj.level = this.$route.path === '/global/generals' ? 5 : arrs.length + 1
          this.api.createOrUpdate(this.obj, this.isWarehouse).then(result => {
            Notification.success('操作成功')
            this.afterSave('objsaved', result)
          })
        }
      })
    },
    afterSave () {
      this.dialogFlag = false
      this.$emit('cb')
    },
    close () {
      this.dialogFlag = false
    },
    open () {
      this.dialogFlag = true
    },
    _getOptions (v, num) {
      this.api.bycode({pcode: v}).then(res => {
        if (res.length) {
          for (let alias of res) {
            alias.id = '' + alias.code
          }
        }
        this.$ever.getFieldFromSchema(this.schema, `classify${num + 1}`).props.options = res.length ? res : []
      })
    },
    _setSchemaOpts (arr) {
      for (let i = 0; i < arr.length; i++) {
        this.$ever.getFieldFromSchema(this.schema, arr[i]).props.options = []
      }
    }
  },
  watch: {
    'handleId' (v, oV) {
      if (v) {
        this.getDetail(v)
      } else {
        for (let key in this.obj) {
          this.obj[key] = ''
        }
      }
    },
    'obj.classify1' (v, oV) {
      if (v) {
        this._getOptions(v, 1)
        if (!this.handleId) {
          this.obj.classify2 = ''
          this.obj.classify3 = ''
          this.obj.classify4 = ''
        }
        if (this.$route.path === '/global/generals') {
          this._setSchemaOpts(['classify3', 'classify4'])
        } else {
          this._setSchemaOpts(['classify3'])
        }
      }
    },
    'obj.classify2' (v, oV) {
      if (v) {
        this._getOptions(v, 2)
        if (!this.handleId) {
          this.obj.classify3 = ''
          this.obj.classify4 = ''
        }
        if (this.$route.path === '/global/generals') {
          this._setSchemaOpts(['classify4'])
        }
      }
    },
    'obj.classify3' (v, oV) {
      if (v) {
        if (this.$route.path === '/global/classifys') {
          return
        }
        this._getOptions(v, 3)
        if (!this.handleId) {
          this.obj.classify4 = ''
        }
      }
    },
    'obj.typeList' (v, oV) {
      if (v) {
        for (let i = 0; i < v.length; i++) {
          this.obj['classify' + (i + 1)] = v[i].code
        }
      }
    },
    'obj.enableDate' (v, oV) {
      if (v) {
        this.obj.enableDate = v
      }
    }
  }
}
</script>
<style scoped>
  p.right { text-align: right; font-size: 12px;}
</style>

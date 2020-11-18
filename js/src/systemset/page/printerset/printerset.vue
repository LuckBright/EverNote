<template>
  <div>
    <ever-bread-crumb name="打印机设置" path="/systemset/printersetlist"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="12"
        :rules="rules"
        label-position="right"
      >
        <template slot="paperName">
          <el-select v-model="obj.paperName" placeholder="请选择" clearable value-key="name">
            <el-option
              v-for="item in paperNameArr"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <div slot="default">
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="createOrUpdate">保存</el-button>
              <el-button @click="resetForm()">返回</el-button>
            </el-form-item>
          </el-col>
        </div>
      </ever-form2>
    </div>
  </div>
</template>
<script>
import jcp from 'jcpjs'
import printerSelect from '@/components/printerselect'

// 需要配置打印机的单据（大家补充）
let printDoc = [
  { id: '默认', name: '默认' },
  { id: 'A4横向', name: 'A4横向' },
  { id: 'A4纵向', name: 'A4纵向' },
  { id: 'A5横向', name: 'A5横向' },
  { id: 'A5纵向', name: 'A5纵向' },
  { id: '标签40*20', name: '标签40*20' },
  { id: '标签50*40', name: '标签50*40' },
  { id: '标签100*40', name: '标签100*40' },
  { id: '新生儿腕带60*20', name: '新生儿腕带60*20' },
  { id: '标签70*55', name: '标签70*55' },
  { id: '成人腕带80*25', name: '成人腕带80*25' },
  { id: '热敏80', name: '热敏80' }
]

var schema = [
  {
    name: 'code',
    label: '单据名称',
    comp: 'ever-select',
    span: 24,
    parentClass: 'paperName',
    props: {
      placeholder: '请输入单据名称（这个名称为系统单据的标识，请跟具体开发或者产品沟通之后填写。）',
      options: [],
      filterable: true,
      multiple: true,
    }
  },
  {
    name: 'printer',
    label: '选择打印机',
    comp: printerSelect,
    span: 8
  },
  {
    name: 'paperName',
    label: '选择纸张类型',
    comp: 'custom',
    span: 8,
    props: {
      options: []
    }
  },
  {
    name: 'orientation',
    label: '纵向打印',
    comp: 'radio',
    span: 8,
    props: {
      options: [{ id: '否', name: 1 }, { id: '是', name: 2 }]
    }
  },
  {
    name: 'paperWidth',
    label: '纸张宽度',
    span: 8,
    props: {
      placeholder: '纸张宽度',
      type: 'number'
    },
    slots: [
      {
        name: 'append',
        template: '<span>毫米</span>'
      }
    ]
  },
  {
    name: 'paperHeight',
    label: '纸张高度',
    span: 8,
    props: {
      placeholder: '纸张高度',
      type: 'number'
    },
    slots: [
      {
        name: 'append',
        template: '<span>毫米</span>'
      }
    ]
  },
  {
    name: 'marginTop',
    label: '上边距',
    span: 8,
    props: {
      placeholder: '上边距(输入值必须大于等于0.5)',
      type: 'number'
    },
    slots: [
      {
        name: 'append',
        template: '<span>毫米</span>'
      }
    ]
  },
  {
    name: 'marginRight',
    label: '右边距',
    span: 8,
    props: {
      placeholder: '右边距(输入值必须大于等于0.5)',
      type: 'number'
    },
    slots: [
      {
        name: 'append',
        template: '<span>毫米</span>'
      }
    ]
  },
  {
    name: 'marginBottom',
    label: '下边距',
    span: 8,
    props: {
      placeholder: '下边距(输入值必须大于等于0.5)',
      type: 'number'
    },
    slots: [
      {
        name: 'append',
        template: '<span>毫米</span>'
      }
    ]
  },
  {
    name: 'marginLeft',
    label: '左边距',
    span: 8,
    props: {
      placeholder: '左边距(输入值必须大于等于0.5)',
      type: 'number'
    },
    slots: [
      {
        name: 'append',
        template: '<span>毫米</span>'
      }
    ]
  }
]

export default {
  data () {
    var rules = {
      code: [{ required: true, message: '必填项', trigger: 'blur' }]
    }
    let obj = this.$ever.createObjFromSchema(schema)
    obj = {
      code: '',
      printer: '',
      paperName: '',
      orientation: 2,
      paperWidth: '',
      paperHeight: '',
      marginTop: '0.5',
      marginRight: '0.5',
      marginBottom: '0.5',
      marginLeft: '0.5'
    }

    return {
      schema,
      obj,
      objCode: this.$route.params.id,
      rules,
      paperNameArr: [],
      printDoc
    }
  },
  watch: {
    'obj.printer': function (val) {
      this.obj.paperName = {}
      jcp.getJCP().getPapers(val, (papers) => {
        var _arr = []
        papers.forEach(item => {
          _arr.push({
            label: item.name,
            value: item
          })
        })
        this.paperNameArr = _arr
      })
    },
    'obj.paperName': function (val) {
      this.obj.paperWidth = val.width / 10
      this.obj.paperHeight = val.height / 10
    }
  },
  created () {
    if (!this.isWindows) {
      this.$messageTips(this, 'error', '设置页面只能在windows环境使用!')
    }
    this.rebuildSetArr()
  },
  methods: {
    isWindows () {
      return /windows|win32/i.test(navigator.userAgent)
    },
    rebuildSetArr () {
      jcp.getJCP().getSettingsIds(settings => {
        settings.forEach((item, index) => {
          for (var i = 0; i < this.printDoc.length; i++) {
            if (this.printDoc[i].id === item) {
              this.printDoc[i].disabled = true
            }
          }
        })
        this.$ever.getFieldFromSchema(this.schema, 'code').props.options = this.printDoc
      })
    },
    resetForm () {
      this.$router.push({ name: 'printersetlist' })
    },
    createOrUpdate () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          var setArr = this.obj.code
          setArr.forEach(item => {
            var _printObj = {}
            Object.assign(_printObj, this.obj)
            _printObj.paperName = this.obj.paperName.name
            delete _printObj.code
            jcp.getJCP().setLastSettings(item, _printObj)
          })
          this.$messageTips(this, 'success', '保存成功', '提示')
          window.setTimeout(_ => {
            this.$router.push({ name: 'printersetlist' })
          }, 500)
        }
      })
    }
  },
  components: {
    printerSelect
  }
}
</script>
<style scoped>
.tip {
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  background: #ddd;
  border: 1px solid #000;
  margin: 10px 0 15px;
  border-radius: 3px;
}
</style>


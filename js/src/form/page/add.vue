<template>
  <div>
    <el-tabs class="flex_column_full_hidden" v-model="activeName">
      <el-tab-pane label="全局设置" name="second" class="content-pane">
        <el-form label-position="right" label-width="80px" :model="tpl" id="editform" :disabled="disabled">
          <el-form-item label="模版名称" v-if="space==='systemset'">
            <el-input v-model="tpl.templateName"></el-input>
          </el-form-item>
          <el-form-item label="标签位置">
            <el-radio-group v-model="tpl.props.labelPosition">
              <el-radio label="right">右对齐</el-radio>
              <el-radio label="left">左对齐</el-radio>
              <el-radio label="top">上下</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input v-model="tpl.props.labelWidth"></el-input>
          </el-form-item>
          <el-form-item label="元素间距">
            <el-input v-model.number="tpl.props.gutter"></el-input>
          </el-form-item>
          <el-form-item label="记录时间">
            <el-checkbox v-model="tpl.props.hasRecordTime">显示</el-checkbox>
          </el-form-item>
          <el-form-item label="患者信息">
            <el-checkbox v-model="tpl.props.patientInfo">需要</el-checkbox>
          </el-form-item>
          <el-form-item label="规则需要的数据元">
            <!-- <metaselect v-model="tpl.props.metaNames" :multiple="true" label-name="name" value-name="name"></metaselect> -->
            <elementary :multiple="true" :val="tpl.props.metaNames" v-model="tpl.props.metaNames"></elementary>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="单个元素设置" name="first" class="content-pane">
        <h5 v-if="currentEle">编辑表单项 {{currentEle.label}}</h5>
        <el-form label-position="right" label-width="80px" :model="element" :disabled="disabled">
          <el-form-item style="margin:0;" v-if="!currentEle">
            <span style="color:red;font-size:14px;">!新增的表单元素，需要进行保存后才可以进行正常的编辑操作</span>
          </el-form-item>
          <el-form-item label="位置" v-if="tpl.element.length">
            <el-select v-model="index" style="width: 100%" filterable>
              <el-option
                v-for="(item, index) in tpl.element"
                :key="index"
                :label="item.label + ' 位置：' + index"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据元">
            <elementary :val="element.name" v-model="meta"></elementary>
          </el-form-item>
          <el-form-item label="组件名称">
            <!-- <el-autocomplete
              class="inline-input"
              v-model="element.comp"
              :fetch-suggestions="queryComp"
              placeholder="请输入内容"
              style="width: 100%"
            ></el-autocomplete> -->
            <el-select v-model="element.comp" style="width: 100%">
              <el-option v-for="(type) in comps" :key="type.value" :label="type.label" :value="type.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="包含内容"
            v-if="['select', 'autocomplete', 'p', 'span', 'radio', 'checkbox', 'h5', 'div'].indexOf(element.comp) > -1 && !element.code"
          >
            <el-input v-model="element.innerContent" type="textarea"></el-input>
          </el-form-item>
          <el-form-item v-if="element.hasVal" label="数据类型">
            <el-select v-model="element.rule.dataType" style="width: 100%">
              <el-option v-for="type in dataTypes" :key="type.value" :label="type.name" :value="type.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="允许输入" v-if="element.comp=='select' || element.code">
            <el-checkbox v-model="element.props.allowCreate"></el-checkbox>
          </el-form-item>
          <template v-if="compType!=='4'">
            <el-form-item v-if="!element.hasVal" label="对齐方式">
              <el-radio-group v-model="element.align">
                <el-radio label="left">左对齐</el-radio>
                <el-radio label="center">居中</el-radio>
                <el-radio label="right">右对齐</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="标签名称">
                  <el-input v-model="element.label"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标签宽度">
                  <el-input v-model="element.labelWidth"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-form-item label="占位宽度">
            <el-slider v-model="element.col.span" :step="2" :min="0" :max="24" show-stops></el-slider>
            <el-checkbox v-model="element.newRow">强制换行</el-checkbox>
            <!-- <el-select v-model="element.props.col.span" placeholder="请选择">
             <el-option
               v-for="item in spans"
               :key="item"
               :label="item"
               :value="item * 2">
             </el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="element.isCanTemplate">可保存为模板</el-checkbox>
          </el-form-item>
          <el-form-item label="验证" v-if="element.hasVal">
            <el-row>
              <el-col :span="8">
                <el-checkbox v-model="element.rule.required">必填项</el-checkbox>
              </el-col>
              <el-col :span="8">最小值
                <el-input style="width: 40px" v-model.number="element.rule.min"/>
              </el-col>
              <el-col :span="8">最大值
                <el-input style="width: 40px" v-model.number="element.rule.max"/>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="自定义验证" v-if="element.hasVal">
            <el-row>
              <el-col :span="24">
                <el-checkbox v-model="element.ref" true-label="selfvalidate">启用自定义校验</el-checkbox>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="组件传值" v-if="element.hasVal">
            <el-row>
              <el-col :span="24">
                <el-input v-model="element.extralProps" :placeholder="extralPropsPlaceholder"></el-input>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="出现规则" v-if="element.hasVal">
            <el-input type="textarea" v-model="element.expression" placeholder="eg：obj['字段1'] === '字段值' && obj['patientInfo']['患者信息字段'] === '字段值'"></el-input>
            <div style="line-height: 22px;">表单式：obj['当前表单内字段']； obj['patientInfo']['患者信息字段']； obj['metaData']['外部数据元字段']</div>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="disabled" @click="addItem()" type="primary" v-if="!currentEle">添加</el-button>
            <el-button :disabled="disabled" @click="finishEdit()" type="primary" v-if="currentEle">完成编辑</el-button>
          </el-form-item>

        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import metaselect from './metaselect'
import elementary from './elementary'
import {isJsonString} from '@/util/common'
let initElement = {
  align: 'right',
  hasVal: true,
  newRow: false,
  isCanTemplate: false,
  col: {
    span: 24,
    offset: 0,
    push: null,
    pull: 0,
    cla: 'ever-form-item'
  },
  innerContent: '',
  rule: {
    required: false,
    dataType: 'string'
  },
  comp: 'input',
  label: '',
  labelWidth: '',
  extralProps: '',
  props: { allowCreate: false, filterable: false }
}

let comps = [
  {
    name: 'input',
    label: '输入',
    type: 'string'
  },
  {
    name: 'text',
    label: '文本',
    type: 'string'
  },
  {
    name: 'autocomplete',
    label: '单行文本',
    type: 'string'
  },
  {
    name: 'textarea',
    label: '多行文本',
    type: 'string'
  },
  {
    name: 'date',
    label: '日期',
    type: 'string'
  },
  {
    name: 'metacode',
    label: '值集',
    type: 'string'
  },
  {
    name: 'ever-diagnosis',
    label: '诊断组件',
    type: 'array'
  },
  {
    name: 'everStaffSelect',
    label: '手术医师组件',
    type: 'string'
  },
  {
    name: 'eyedcx',
    label: '眼睛度数',
    type: 'string'
  },
  {
    name: 'eyeocuexam',
    label: '眼球运动检查',
    type: 'string'
  },
  {
    name: 'toothvalue',
    label: '牙位图组件',
    type: 'string'
  },
  {
    name: 'inputrange',
    label: '输入范围',
    type: 'string'
  },
  {
    name: 'ever-allergen',
    label: '过敏史',
    type: 'string'
  },
  {
    name: 'ever-skintest',
    label: '皮试',
    type: 'string'
  },
  {
    name: 'select',
    label: '下拉选择',
    type: 'string'
  },
  {
    name: 'radio',
    label: '单选',
    type: 'string'
  },
  {
    name: 'checkbox',
    label: '多选',
    type: 'array'
  },
  // {
  //   name: 'uploadFile',
  //   label: '上传文件',
  //   type: 'array '
  // },
  {
    name: 'h4',
    label: '标题',
    hasVal: false
  },
  // {
  //   name: 'div',
  //   label: 'div',
  //   hasVal: false
  // },
  // {
  //   name: 'custom'
  // },
  {
    name: 'wysiwyg',
    label: '富文本',
    type: 'string'
  },
  {
    name: 'breathinput',
    label: '呼吸',
    type: 'string'
  },
  {
    name: 'pulseinput',
    label: '脉搏',
    type: 'string'
  },
  {
    name: 'eventinput',
    label: '事件',
    type: 'string'
  }

]
export default {
  props: ['tpl', 'insertIndex', 'currentEle', 'disabled'],
  data () {
    return {
      space: '',
      extralPropsPlaceholder: '例如：' + JSON.stringify({ showType: 'complex' }),
      activeName: 'second',
      spans: Array(12).fill(1).map((v, index) => { return index + 1 }),
      compType: '1',
      meta: null,
      element: JSON.parse(JSON.stringify(initElement)),
      // ['string', 'number', 'array', 'object']'字符串', '数值', '数组', '对象'
      dataTypes: [
        {
          name: '字符串',
          value: 'string'
        },
        {
          name: '数值',
          value: 'number'
        },
        {
          name: '数组',
          value: 'array'
        },
        {
          name: '对象',
          value: 'object'
        },
        {
          name: '文本',
          value: 'text'
        },
        {
          name: '字符',
          value: 'char'
        },
      ],
      comps: comps.map(v => {
        v.value = v.name
        return v
      })
    }
  },
  watch: {
    'tpl.props.metaNames' (val) {
      if (val) {
        this.tpl.props.metaNames = val
      }
    },
    'meta' (newVal) {
      if (newVal) {
        if (newVal.name) this.element.name = newVal.name
        this.element.code = newVal.code
        if (newVal.id) this.element.id = newVal.id
        // if (newVal.widgetType === 'inputrange' && (newVal.displayName.indexOf('血压') > -1)) {
        //   this.element.ref = 'selfvalidate'
        //   this.element.props.type = 1
        // }
        // this.element.code = newVal.code
        // this.element.comp = newVal.widgetType
        // this.element.label = newVal.displayName
        // this.element.rule.dataType = newVal.dataType
        // this.element.id = newVal.id
      }
    },
    'currentEle' (newVal) {
      if (newVal) {
        this.element = newVal
        if (newVal.id) {
          this.compType = '2'
          this.meta = {
            id: newVal.id,
            widgetType: newVal.comp,
            displayName: newVal.label,
            dataType: newVal.rule.dataType,
            code: newVal.code
          }
        } else if (this.element.comp === 'custom') {
          this.meta = ''
          this.compType = '4'
        } else {
          this.meta = ''
          this.compType = '1'
        }
      }
    },
    'element.comp' (newVal) {
      let arr = this.comps.filter(v => v.name === newVal)
      this.element.hasVal = true
      if (arr.length) {
        this.element.rule.dataType = this.element.rule.dataType || arr[0].type
        if (arr[0].hasVal === false) {
          this.element.hasVal = false
        }
      }
    }
  },
  mounted () {
    this.space = this.$route.matched[0].meta.space
  },
  methods: {
    addItem () {
      if (this.element.extralProps && !isJsonString(this.element.extralProps)) {
        return this.$messageTips(this, 'warning', '组件传值数据格式错误，请检查', '提示')
      }
      if (this.element.props.allowCreate) {
        this.element.props.filterable = true
      }
      this.$emit('add', this.element)
      console.log('添加', this.element)
      this.element = JSON.parse(JSON.stringify(initElement))
    },
    finishEdit () {
      if (this.element.extralProps && !isJsonString(this.element.extralProps)) {
        return this.$messageTips(this, 'warning', '组件传值数据格式错误，请检查', '提示')
      }
      if (this.element.props.allowCreate) {
        this.element.props.filterable = true
      }
      this.element = JSON.parse(JSON.stringify(initElement))
      this.$emit('finishEdit', this.currentEle)
      console.log('完成编辑', this.currentEle)
      this.$emit('update:currentEle', null)
    },
    queryComp (query, cb) {
      // let results = this.comps.filter(v => {
      //   return v.value.indexOf(query) > -1
      // })
      cb(this.comps)
    }

  },
  components: {
    metaselect,
    elementary
  },
  computed: {
    index: {
      set (val) {
        this.$emit('update:insertIndex', val)
      },
      get () {
        return this.insertIndex
      }
    }
  }
}
</script>
<style scoped>
.content-pane {
  padding: 0 10px;
}
/*.el-radio + .el-radio {
    margin-left: 0;
    margin-right: 30px;
  }*/
</style>

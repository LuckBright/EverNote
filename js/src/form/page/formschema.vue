<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb v-if="!breadHidden" name="列表" :path="`${rootPath}formschemas`"></ever-bread-crumb>
    <div class="flex_column_1_hidden layout_inner spe">
      <el-row class="flex_layout_full" type="flex">
        <el-col class="config_wrap" :span="6">
          <addform class="page_layout_full_hidden" @add="addItem"  @finishEdit="editItem" :tpl="tpl" :insert-index.sync="insertIndex" :current-ele.sync="currentEle" :disabled="disabled"></addform>
          <div class="layer" v-if="disabled"></div>
        </el-col>
        <el-col class="form_wrap flex_col_1_hidden" :span="18">
          <div class="flex_column_full_hidden" id="editform">
            <ever-form2 :all-disabled="disabled" :schema="schema" v-model="obj" ref="form" :span="24" :rules="rules" :label-width="tpl.props.labelWidth" :label-position="tpl.props.labelPosition" :is-manage="true" :nosubmit="tpl.props.nosubmit" class="flex_col_1_auto form">
            </ever-form2>
            <div class="bom_wrap">
              <slot name="saveBtn"></slot>
              <el-button type="primary" v-if="!saveHidden" :disabled="disabled" @click="saveTpl()" style="float:right">保存模版</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import urlMap from '@/emr/urls'
  import { request } from '@/util/req'
  import {getMixed} from '@/util/formconverter'
  import editbar from './editbar'
  import Vue from 'vue'
  import formapi from '../store/api'
  import addform from './add'
  import {deepObjectCompile} from '@/util/diff'

  export default {
  /**
   * props                        字段含义
   * @param templateId            表单模版id
   * @param formDataId            数据模版id
   * @param templateName          表单模版名称
   * @param saveHidden            是否隐藏表单保存按钮
   */
    props: ['templateId', 'customName', 'breadHidden', 'disabled', 'templateName', 'saveHidden', 'formDataId'],
    data () {
      let tplProps = {
        labelPosition: 'right',
        labelWidth: '120px',
        nosubmit: true,
        gutter: 0,
        hasRecordTime: false,
        isCanTemplate: false,
        patientInfo: false,
        metaNames: []
      }
      return {
        oldTpl: {}, // add 监控改变
        oldObj: {},
        checkObj: false,
        tplUpdate: false,
        objUpdate: false,
        tpl: {
          designerId: '1',
          templateName: this.templateName,
          element: [],
          props: JSON.parse(JSON.stringify(tplProps))
        },
        tplProps,
        schema: [],
        rules: null,
        obj: {},
        insertIndex: -1,
        currentEle: null,
        formDataObj: {},
        objId: this.$route.params.id || this.templateId
      }
    },
    created () {
      if (this.customName) this.tpl.templateName = JSON.parse(JSON.stringify(this.customName))
      if (this.objId !== '-1' && this.objId) {
        formapi.getTpl(this.objId).then(result => {
          this.tpl = result
          this.tpl.props = Object.assign({}, this.tplProps, this.tpl.props)
          this.insertIndex = this.tpl.element.length - 1
          // add 监控改变
          this.oldTpl = JSON.parse(JSON.stringify(this.tpl))
        })
      }
      this.getFormData()
    },
    computed: {
      rootPath () {
        return `${this.$route.matched[0].path}/`
      }
    },
    methods: {
      delObjKeys () {
        let objkeys = Object.keys(this.obj)
        if (!objkeys.length) return
        let elementNames = []
        if (this.tpl && this.tpl.element && this.tpl.element.length > 0) {
          this.tpl.element.forEach(item => {
            elementNames.push(item.name)
          })
          objkeys.forEach(name => {
            if (elementNames.indexOf(name) === -1) {
              delete this.obj[name]
            }
          })
        }
      },
      // 通过formDataId获取模版的数据
      async getFormData () {
        if (!this.formDataId || this.formDataId === '-1') return
        let res = await request(urlMap.templateManage.getFormDataById, {
          id: this.formDataId
        })
        if (res && res.data && res.data.data) {
          this.formDataObj = res.data.data
          Object.assign(this.obj, this.formDataObj)
          this.delObjKeys()
          this.oldObj = JSON.parse(JSON.stringify(this.obj))
          this.checkObj = true
          // console.dir()
        }
      },
      editItem (curEle) {
        // this.tpl.element.forEach(item => {
        //   console.log(item.id, curEle.id)
        //   if (item.id === curEle.id) {
        //     this.$delete(item, 'name')
        //   }
        // })
      },
      addItem (element) {
        let arr = JSON.parse(JSON.stringify(this.tpl.element))
        this.insertIndex += 1
        this.tpl.element = [...arr.slice(0, this.insertIndex), JSON.parse(JSON.stringify(element)), ...arr.slice(this.insertIndex)]
      },
      edit (index) {
        let arr = this.tpl.element
        this.currentEle = arr[index]
      },
      prev (index) {
        if (index > 0) {
          let arr = JSON.parse(JSON.stringify(this.tpl.element))
          let prev = arr[index - 1]
          arr[index - 1] = arr[index]
          arr[index] = prev
          this.tpl.element = arr
        }
      },
      next (index) {
        if (index < (this.tpl.element.length - 1)) {
          let arr = JSON.parse(JSON.stringify(this.tpl.element))
          let next = arr[index + 1]
          arr[index + 1] = arr[index]
          arr[index] = next
          this.tpl.element = arr
        }
      },
      del (index) {
        this.tpl.element.splice(index, 1)
        this.delObjKeys()
      },
      saveTpl () {
        if (this.tpl.templateId) {
          // 判断表单是否可保存为模板
          if (this.tpl.element && this.tpl.element.length) {
            let foundResult = this.tpl.element.find((item) => {
              return !!item.isCanTemplate
            })
            this.tpl.props.isCanTemplate = !!foundResult
          }
          this.tpl.element = this.tpl.element.map(v => {
            v.defaultVal = this.obj[v.name]
            return v
          })
        }
        formapi.saveTpl(this.tpl).then(_ => {
          // 判断是否返回病历类型管理
          if (this.templateId || this.customName) {
            this.$emit('saveTemplate', {data: _, isTemplateId: this.templateId})
          } else {
            this.$router.push(`${this.rootPath}formschemas`)
          }
        })
      },
      editbarInit () {
        let formComp = this
        this.$nextTick(_ => {
          this.$refs.form.$el.querySelectorAll('.ever-form-item').forEach((ele, index) => {
            if (ele.querySelectorAll('.editbar').length) {
              return
            }
            if (ele.classList.contains('submit-zone')) {
              return
            }
            // 机构设置工作站只读模式
            if (this.disabled) return
            var ComponentClass = Vue.extend(editbar)
            var instance = new ComponentClass({
              propsData: {
                index: index
              },
              mounted () {
                this.$on('edit', index => {
                  console.log('edit', index)
                  formComp.edit(index)
                })
                this.$on('delete', index => {
                  console.log('delete', index)
                  formComp.del(index)
                })
                this.$on('prev', index => {
                  console.log('prev', index)
                  formComp.prev(index)
                })
                this.$on('next', index => {
                  formComp.next(index)
                })
              }
            })
            instance.$mount()
            ele.appendChild(instance.$el)
          })
        })
      }
    },
    watch: {
      'tpl': {
        handler (val) {
          let obj = getMixed(this.tpl.element)
          this.schema = obj.schema
          this.rules = obj.rules
          // this.obj = obj.obj || {}//这个位置如果给obj重新赋值，会导致之前的表单数据全部清空
          this.obj = Object.assign(obj.obj, this.obj)
          this.editbarInit()
          // add 监控改变
          this.tplUpdate = deepObjectCompile(val, this.oldTpl)
          // 判断表单是否可保存为模板
          let schema = JSON.parse(JSON.stringify(val))
          if (schema.element && schema.element.length) {
            let foundResult = schema.element.some((item) => {
              return item.isCanTemplate === true
            })
            schema.props.isCanTemplate = foundResult
          }

          schema.element = schema.element.map(v => {
            v.defaultVal = this.obj[v.name]
            return v
          })
          // console.log('模版有更新', this.tplUpdate)
          // console.log('tpl', val)
          this.$emit('fromTpl', {designerId: '1', schema: schema, templateId: val.templateId}, this.tplUpdate || this.objUpdate)
        },
        deep: true
      },
      'obj': {
        handler (val) {
          this.editbarInit()
          if (this.checkObj) { // 检查obj有没有获取最新数据，解决新建时候保存完成仍然提示未保存
            this.objUpdate = deepObjectCompile(val, this.oldObj)
          } else {
            this.objUpdate = false
          }
          this.$emit('formObj', this.objUpdate || this.tplUpdate)
        },
        deep: true
      },
      'formDataId' () {
        console.log('触发了')
        this.getFormData()
      }
    },
    components: {
      addform
    }
  }
</script>
<style lang="scss" scoped>
  .config_wrap{
    width: 500px;
    position: relative;
    .layer {
      width: 100%;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      background:rgba(0,0,0,0);
      z-index:99;
    }
    /deep/.el-tabs{
      .el-tabs__nav-scroll{
        padding: 0 20px;
      }
      .el-tabs__content{
        overflow: auto;
        overflow-x: hidden;
      }
    }
  }
  .form_wrap{
    .el-form, .bom_wrap{
      padding: 10px 20px;
    }
  }
  #editform {
    position: relative;
  }
  #editform .editbar {
    position: absolute;
    right: 10px;
    bottom: 5px;
  }
  #editform .ever-form-item {
    position: relative;
    padding: 10px 10px 0 10px;
    border: 1px dashed #ddd;
  }
</style>

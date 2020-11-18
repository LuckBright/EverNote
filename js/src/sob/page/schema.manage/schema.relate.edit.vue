<template>
  <div>
    <ever-bread-crumb name="ServicePattern" :path="$route.meta.thirdActiveIndex"></ever-bread-crumb>
    <div class="layout_inner auto-scroll">
      <ever-form2
        ref="form"
        :schema="schema"
        v-model="obj"
        :rules="rules"
        label-position="right" :nosubmit="true">
        <template slot="serviceClassification1">
          <el-cascader :options="classOptions" v-model="obj.serviceClassification1" clearable style="width:100%" :props="{ checkStrictly: true }">
          </el-cascader>
        </template>
        <template slot="serviceList">
          <el-form v-for="(item, index) in obj.serviceList" :key="index" style="margin-bottom:15px" :rules="serviceRules" :model="item" ref="serviceForm">
            <el-row>
              <el-col :span="20">
                <el-form-item prop="service">
                  <service-select class="service_select" v-model="item.service" value-key="id" :type="obj.serviceClassification1[0]" :is-set="obj.type === '2'" :scene="obj.scene ? Number(obj.scene) : ''" belongType="1">
                  </service-select>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="handle_btn">
                <!-- <i class="iconfont icon-delete" v-if="obj.serviceList.length > 1" @click="delItem(index)"></i>
                <i class="iconfont icon-tianjia" v-if="(index + 1) === (obj.serviceList.length)" @click="addItem(index)"></i> -->
              </el-col>
            </el-row>
          </el-form>
        </template>
      </ever-form2>
      <el-button style="margin-left: 120px; !important" type="primary" @click="submit" :disabled="disabled">保存</el-button>
    </div>
  </div>
</template>

<script>
  import api from '@/sob/store/schema.relate'
  import apiM from '@/sob/store/schema.manage'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  import form from '@/util/form'
  import { scene } from './template.scene'
  export default {
    data () {
      let schema = [
        {
          name: 'schema',
          label: '模版名称',
          comp: 'sys-select',
          span: 12,
          props: {
            placeholder: '请选择模版',
            options: [],
            field: {
              useObject: true
            }
          }
        },
        {
          name: 'scene',
          label: '使用场景',
          comp: 'sys-select',
          span: 12,
          props: {
            options: scene
          }
        },
        {
          name: 'serviceClassification1',
          label: '医嘱项目类型',
          comp: 'custom',
          span: 12
        },
        {
          name: 'type',
          comp: 'sys-select',
          label: '医嘱类别',
          span: 12,
          props: {
            type: 'radio',
            options: [
              { id: '1', name: '收费项' },
              { id: '2', name: '组套' }
            ]
          }
        },
        {
          name: 'serviceList',
          label: '医嘱项目',
          comp: 'custom',
          span: 14
        }
      ]
      let obj = this.$ever.createObjFromSchema(schema)
      obj.scene = ''
      obj.type = '1'
      obj.serviceClassification1 = []
      obj.serviceList = [{service: ''}]
      return {
        api,
        schema,
        obj,
        objId: this.$route.params.id,
        successPath: this.$route.meta.thirdActiveIndex,
        objDetail: {},
        classOptions: [],
        isInitData: true,
        rules: {
          schema: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          scene: [
            {required: true, message: '必填项', trigger: 'change'}
          ]
        },
        serviceRules: {
          service: [
            {required: false, message: '必填项', trigger: 'change'}
          ]
        }
      }
    },
    mixins: [form],
    created () {
      this.getSchemaList()
      this.getClassOptions()
    },
    methods: {
      getClassOptions () {
        sysvalue.cascade(
          'THC_WH_OBJECT_TYPE', ['798', '294', '296']).then(options => {
            options.forEach(item => {
              if (item.children) {
                this.classOptions = this.classOptions.concat(item.children)
              }
            })
          })
      },
      async getSchemaList () {
        let schemaList = await apiM.list({offset: 0, pagesize: 100, name: this.objDetail.templateName || ''})
        if (schemaList && schemaList.data && schemaList.data.resultList && schemaList.data.resultList.length) {
          let list = []
          schemaList.data.resultList.map(item => {
            list.push({id: item.id, name: item.templateName})
            return item
          })
          this.$ever.getFieldFromSchema(this.schema, 'schema').props.options = schemaList.data.resultList
        }
      },
      validate () {
        let allValid = true
        this.$refs.serviceForm.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              allValid = false
            }
          })
        })
        return allValid
      },
      addItem () {
        this.serviceRules.service[0].required = true
        this.$nextTick(() => {
          let isValid = true
          isValid = this.validate()
          if (isValid) this.obj.serviceList.push({service: ''})
        })
      },
      delItem (i) {
        this.obj.serviceList.splice(i, 1)
      },
      submit () {
        if (this.obj.schema && this.obj.schema.id) {
          this.obj.templateId = this.obj.schema.id
        }
        if (this.obj.serviceClassification1 && this.obj.serviceClassification1.length) {
          this.obj.serviceClassification = this.obj.serviceClassification1[0]
          if (this.obj.serviceClassification1.length > 1) {
            this.obj.threeServiceClassify = this.obj.serviceClassification1[1]
          } else {
            this.obj.threeServiceClassify = ''
          }
        }
        let adviceIds = []
        let adviceNames = []
        if (this.obj.serviceList && this.obj.serviceList.length) {
          this.obj.serviceList.forEach(item => {
            if (item.service && item.service.id) {
              adviceIds.push(item.service.id)
              adviceNames.push(item.service.name)
            }
          })
          if (adviceIds.length) {
            this.obj.adviceId = adviceIds.join(',')
          }
          if (adviceNames.length) {
            this.obj.adviceName = adviceNames.join(',')
          }
        }
        delete this.obj.serviceList
        delete this.obj.schema
        delete this.obj.serviceClassification1
        this.submitForm()
      }
    },
    watch: {
      'obj.serviceClassification' () {
        this.obj.serviceList = [{service: ''}]
      },
      'obj.type' () {
        if (!this.isInitData && this.objId || !this.objId && this.isInitData) {
          this.obj.serviceList = [{service: ''}]
        }
      },
      'objDetail': {
        handler (val) {
          if (val.templateName) {
            this.getSchemaList()
            this.obj.schema = val.templateName
            this.schema[0].props.disabled = true
          }
          if (!val.type) {
            this.obj.type = '1'
          } else {
            this.obj.type = String(val.type)
          }
          this.obj.scene = String(val.scene)
          if (val.serviceClassification) {
            this.obj.serviceClassification1.push(val.serviceClassification)
          }
          if (val.threeServiceClassify) {
            this.obj.serviceClassification1.push(val.threeServiceClassify)
          }
          if (val.adviceId && val.adviceName) {
            this.$set(this.obj.serviceList, 0, {service: {id: val.adviceId, name: val.adviceName}})
          }
          this.$nextTick(() => {
            this.isInitData = false
          })
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss" scoped>
.layout_inner {
  /deep/ .el-form-item__content {
    height: 40px;
  }
}
.auto-scroll {
  flex: 1;
  overflow: auto;
}
.handle_btn {
  white-space: nowrap;
  .iconfont{
    padding: 5px;
    color: #aaa;
    &:nth-child(1){
      margin-left: 10px;
      }
  }
}
</style>

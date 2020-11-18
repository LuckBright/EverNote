<template>
  <div id="createconsult">
    <el-card id="createconsult">
    <ever-form-model
      :schema="schema"
      v-model="obj"
      :api="api"
      :rules="rules"
      ref="form"
      label-position="right">
    </ever-form-model>
  </el-card>
  </div>
</template>
<script>
  import api from '../store/consultapi'
  import depart from '../../warehouse/store/departmentapi'
  import form from '../../util/form'
  let schema = [
    {
      name: 'dptObj',
      type: 'select',
      options: [],
      label: '咨询部门：',
      needObjFlag: true,
      clearable: true,
      placeholder: '选择部门',
      span: 12
    },
    {
      name: 'way',
      type: 'systype',
      label: '咨询方式',
      code: 'THC_CC_FOLLOWUP',
      disabled: true,
      useValue: true,
      span: 12
    },
    {
      name: 'source',
      type: 'systype',
      code: 'THC_CONSULT_RESOURCE',
      label: '来源',
      clearable: false,
      useValue: true,
      span: 12
    },
    {
      name: 'forWhom',
      type: 'systype',
      code: 'THC_CONSULT_CONFOR',
      label: '为谁咨询',
      placeholder: '选择咨询对象',
      clearable: false,
      useValue: true,
      span: 12
    },
    {
      name: 'content',
      type: 'textarea',
      label: '内容：',
      rows: 4,
      max: 500,
      placeholder: '请输入咨询内容',
      span: 20
    }
  ]
  export default {
    props: ['initdata', 'consultId'],
    mixins: [form],
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      obj.creator = this.$store.state.currentUser.userId
      obj.patientId = ''
      obj.dptId = ''
      obj.dptName = ''
      obj.way = 1
      return {
        schema,
        id: this.$route.query.id,
        api,
        depart,
        obj,
        userPop: false,
        calledPop: false,
        loading: false,
        rules: {
          forWhom: [
            {required: true, message: '请选择为谁咨询', trigger: 'change'}
          ],
          source: [
            {required: true, message: '请选择来源', trigger: 'change'}
          ],
          content: [
            {required: true, message: '请输入咨询内容', trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      'obj.dptObj' (val) {
        this.obj.dptId = val.id
        this.obj.dptName = val.name
      },
      initdata (val) {
        if (val) {
          this.obj.patientId = this.initdata
        }
      }
    },
    created () {
      if (this.initdata) this.obj.patientId = this.initdata
      if (this.consultId) {
        this.id = this.consultId
      }
      this.getDptList(schema, 'dptObj')
      this.initData()
    },
    methods: {
      saveTempalte () {
        this.$refs.form.$refs.form.validate(valid => {
          delete this.obj.dptObj
          if (valid) {
            this.loading = true
            this.api.create(this.obj).then(rs => {
              if (rs.head.errCode === 0) {
                this.$emit('saveconsult', rs.data.id)
              }
            })
          }
        })
      },
      initData () {
        if (!this.id) {
          return false
        }
        this.api.request({id: this.id}).then(rs => {
          rs.data.source += ''
          rs.data.way += ''
          rs.data.forWhom += ''
          rs.data.dptObj = {
            id: rs.data.dptId,
            name: rs.data.dptName
          }
          this.obj = Object.assign(this.obj, rs.data)
        })
      },
      getDptList (schema, name) {
        let field = this.$ever.getFieldFromSchema(schema, name)
        this.depart.list().then(rs => {
          field.options = rs
        })
      }
    }
  }
</script>
<style scoped>
  #createconsult .el-input-group__append .el-button{background: #1C7BEF;border-radius: 0;color: #fff;}
</style>

<template>
  <div>
    <ever-bread-crumb name="" :path="$route.meta.thirdActiveIndex"></ever-bread-crumb>
    <div class="layout_inner auto-scroll">
      <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="11"
        :rules="rules"
        :nosubmit="true"
      >
      </ever-form2>
      <div class="form_handle">
        <el-button type="primary" @click="submitForm" :disabled="btnDisabled">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/sob/store/schema.manage'
import form from '@/util/form'

export default {
  mixins: [form],
  data () {
    let schema = [
      {
        name: 'name',
        label: '模板名称',
        span: 12,
        props: {
          maxlength: 40
        }
      },
      {
        name: 'schemaValue',
        label: 'schema值',
        comp: 'textarea',
        span: 24
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.relationType = []
    return {
      api,
      obj,
      schema,
      objId: this.$route.params.id,
      btnDisabled: false,
      objDetail: {},
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        id: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        schemaValue: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },
  components: {
  },
  methods: {
    async submitForm () {
      this.btnDisabled = true
      this.$refs.form.$refs.form.validate(async valid => {
        if (valid) {
          if (this.objId) {
            this.obj.id = this.objId
          }
          const res = await api.createOrUpdate(this.obj)
          if (res && res.head && res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功！', '提示')
            this.$router.push(this.$route.meta.thirdActiveIndex)
          } else {
            this.btnDisabled = false
          }
        } else {
          this.btnDisabled = false
        }
      })
    },
    cancel () {
      this.$router.push(this.$route.meta.thirdActiveIndex)
    }
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
.form_handle {
  padding-left: 120px;
}
.auto-scroll {
  flex: 1;
  overflow: auto;
}
</style>

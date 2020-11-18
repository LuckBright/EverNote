/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-27 10:20:09
 * @Last Modified by: renpengfei
 * @Last Modified time: 2020-06-02 17:48:15
 * 影响机构 + 调价说明
 */
<template>
  <ever-form2
    class="reset-form_width"
    :schema="schema"
    v-model="obj"
    ref="form"
    label-width="0"
    :rules="rules">
    <!-- 保存按钮可以不写，用form默认的。 下面的实现方式是自定义保存按钮。 slot="default" 会替换表单默认的保存与重置按钮-->
    <template slot="default">
      <el-col></el-col>
    </template>
  </ever-form2>
</template>

<script>
import { mapState } from 'vuex'
import { ModuleName } from './enum'

const schema = [
  {
    name: 'org',
    comp: 'ever-select',
    props: {
      multiple: true,
      options: [],
      placeholder: '影响机构'
    }
  },
  {
    name: 'desc',
    comp: 'textarea',
    props: {
      placeholder: '请输入调价说明',
      maxlength: '200',
      showWordLimit: true
    }
  }
]

export default {
  props: {
    orgOptions: Array, // 父组件传入机构列表
  },
  data () {
    return {
      schema: [],
      obj: {},
      rules: {
        'org': [{ required: true, message: '请选择影响机构', trigger: 'change' }],
        'desc': [{ required: true, message: '请输入调价说明', trigger: 'change' }],
      }
    }
  },
  mounted () {
    this.$nextTick(_ => {
      this.$refs.form.$refs.form.clearValidate()
    })
  },
  computed: {
    ...mapState(ModuleName, {
      orgList: state => state.orgList,
      isTenant: state => state.isTenant
    })
  },
  watch: {
    isTenant: {
      handler (v) {
        this.schema = schema.slice(0)
        if (!v) {
          this.schema = this.schema.filter(schema => schema.name !== 'org')
        }

        this.obj = this.$ever.createObjFromSchema(this.schema)
      },
      immediate: true
    },
    orgList: {
      handler () {
        if (this.isTenant && !this.orgOptions) {
          this.setOrgOptions(this.orgList)
        }
      },
      deep: true,
      immediate: true
    },
    orgOptions: {
      handler (options) {
        // 非集团修改价格的情况， 不需要展示机构select框
        if (!this.isTenant) return
        if (options) {
          this.obj.org = (this.obj.org || []).filter(id => options.map(item => item.id).includes(id))
          this.setOrgOptions(options || [])
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    setOrgOptions (options) {
      this.$ever.getFieldFromSchema(
        this.schema,
        'org'
      ).props.options = options
    },
  }
}
</script>
<style lang="scss" scoped>
  .reset-form_width /deep/ .el-input__count {
    background: none;
  }
</style>

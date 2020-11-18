<template>
  <div>
    <p>表单示例</p>
    <el-button type="primary" @click="addControl">添加一个控件</el-button>
    <el-button type="primary" @click="changeProperty">改一个属性</el-button>
    <ever-form2
      class="custom-form"
      :schema="schema"
      v-model="obj"
      ref="form"
      :span="span"
    >
    </ever-form2>
  </div>
</template>

<script>
  export default {
    data () {
      let schema = [
        {
          name: 'testText',
          label: '输入框',
          className: '',
          props: {
            maxlength: 3,
          },
        },
      ]
      let obj = this.$ever.createObjFromSchema(schema)
      return {
        schema,
        obj,
        span: 12,
      }
    },
    methods: {
      addControl () {
        this.schema.push({
          name: 'added',
          label: '新增的schema'
        })
      },
      changeProperty () {
        this.span = this.span === 12 ? 24 : 12
      },
    }
  }
</script>


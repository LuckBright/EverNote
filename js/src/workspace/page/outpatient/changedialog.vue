<template>
  <el-dialog class="history-compare" :close-on-click-modal="false" :visible.sync="show" width="1200px">
    <template slot="title">
      <div>
        <span class="font16">{{title}}</span>
      </div>
    </template>
    <el-row>
      <el-col :span="24">
        <changedoc
          @success="success"
          v-if="show"
          :schema-id="schemaId"
          :data-id="dataId"
          :is-doc="isDoc"
          :tpl-code="tplCode"
          :node-type="nodeType"
          ref="change"
        ></changedoc>
      </el-col>
    </el-row>
    <div slot="footer">
      <ever-form2 :schema="schema" v-model="obj" ref="userInfo" :nosubmit="true"></ever-form2>
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="save">提交修改申请</el-button>
    </div>
  </el-dialog>
</template>

<script>
import changedoc from './changedoc'

const schema = [
  {
    name: 'comment',
    label: '备注',
    comp: 'textarea',
    props: {
      placeholder: '请输入备注(最多100字)',
      width: '100%'
    }
  }
]
export default {
  props: ['schemaId', 'dataId', 'isDoc', 'tplCode', 'nodeType'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      obj,
      schema,
      show: false,
      textarea: '',
      title: '修改病历'
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {
    obj: {
      handler (val) {
        this.obj.comment = this.obj.comment.substr(0, 100)
      },
      deep: true
    }
  },
  methods: {
    open () {
      this.show = true
      this.obj.comment = ''
    },
    save () {
      this.$refs.change.save(this.obj.comment)
    },
    success () {
      this.$emit('success')
      this.show = false
    }
  },
  components: {
    changedoc
  }
}
</script>
<style scoped lang="scss">
.bo {
  margin-bottom: 10px;
}
</style>

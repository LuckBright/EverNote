<template>
  <el-dialog
    :title="title"
    :visible.sync="localVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    :key="currentKey"
    :width="width">
    <div class="addUser">
      <ever-form2
        ref="form"
        v-model="obj"
        :schema="schema"
        :inline="true"
        :is-query="true">
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="handleSel" :disabled="selUserDisabled">{{btnMsg}}</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
  </el-dialog>
</template>
<script>
let schema = [
  {
    label: '人员搜索',
    name: 'id',
    comp: 'ever-staff-select',
    props: {
      fields: 'id',
      clearable: true,
      type: 'select',
      params: {
        everQueryType: 'out',
      }
    },
  },
]
export default {
  props: {
    title: {
      type: String,
      default: '人员搜索'
    },
    width: {
      type: String,
      default: '400px'
    },
    visible: {
      type: Boolean,
      default: false
    },
    btnMsg: {
      type: String,
      default: '确认委派'
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      localVisible: this.visible,
      schema,
      obj,
      currentKey: new Date().getTime(),
      selUserDisabled: true
    }
  },
  methods: {
    handleSel () {
      this.$emit('handleSubmit', this.obj)
    }
  },
  watch: {
    obj: {
      handler (val) {
        if (val.id) {
          this.selUserDisabled = false
        } else {
          this.selUserDisabled = true
        }
      },
      deep: true
    },
    visible (val) {
      this.localVisible = val
    },
    localVisible (val) {
      if (val) {
        this.obj.id = ''
      }
      this.$emit('update:visible', val)
    },
  },
}
</script>

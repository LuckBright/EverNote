<template>
  <div id="dialoginfected">
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      :before-close="close"
      append-to-body
      width="1200px"
      class="ui_dialog_02">
      <ever-form2 v-if="tpl.templateId" :schema="schema" v-model="obj"
        ref="form" :span="24"  :label-width="tpl.props.labelWidth" :label-position="tpl.props.labelPosition"
        :gutter="tpl.props.gutter"
        :allDisabled="true"
        @focus="(name, obj) => {this.$emit('focus', name, obj)}"
        class="form remote-form" :nosubmit="nosubmit">
        <template v-for="name in slotNames" :slot="name">
          <slot :name="name"></slot>
        </template>
        <template slot="default">
          <slot>
            <el-col :span="24" slot="default">
              <el-form-item>
                <el-button type="primary" @click="save()">保存</el-button>
              </el-form-item>
            </el-col>
          </slot>
        </template>
      </ever-form2>
      <span slot="footer" class="dialog-footer">
        <hr>
        <el-button @click="close" type="primary">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getMixed} from '@/util/formconverter'
import phrapi from '@/form/store/phrapi'
export default {
  props: ['code', 'visitId', 'patientId', 'slotNames', 'value', 'dptId', 'schemaId', 'nosubmit', 'readonly', 'dataId', 'open'],
  data () {
    return {
      schema: [],
      rules: null,
      tpl: {
        props: {}
      },
      initObj: {},
      obj: {},
      dialogVisible: false
    }
  },
  created () {
    // alert(this.schemaId)
    this.getTpl()
  },
  watch: {
    open: function (val) {
      this.dialogVisible = val
    },
    schemaId: function (val) {
      this.getTpl()
    },
    dataId: function (val) {
      this.getTpl()
    }
  },
  methods: {
    close (done) {
      this.$emit('close', false)
      if (typeof done === 'function')done()
    },
    getTpl () {
      let promise
      if (this.code) {
        promise = phrapi.getTemplateByCode(this.code, this.dptId)
      } else {
        if (this.dialogVisible) {
          promise = phrapi.queryTemplateDetail(this.schemaId)
        } else {
          return false
        }
      }
      promise.then(result => {
        this.tpl = result
        let obj = getMixed(this.tpl.element)
        this.schema = obj.schema
        this.$emit('update:schemaId', this.tpl.templateId)
        this.rules = obj.rules
        if (!this.obj.id) {
          this.obj = obj.obj
          this.initObj = JSON.parse(JSON.stringify(obj.obj))
        }
        return this.tpl.templateId
      }).then(schemaId => {
      // 有dataId说明有实例
      // dataId不存在，或者dataId==-1时候调用formData
        if (this.dataId) {
          // console.log('dataId', this.dataId)
        // -1为点击新建，但是不能确定有没有实例
          // 点击实例渲染模版
          if (this.dataId !== '-1') {
            phrapi.getByRecordId4FormData(this.dataId).then(result => {
              let data = result.data
              data.id = result.id
              this.obj = data
              this.initObj = JSON.parse(JSON.stringify(data))
            })
          }
        } else {
          this._getFormData(schemaId)
        }
      })
    }
  }
}
</script>


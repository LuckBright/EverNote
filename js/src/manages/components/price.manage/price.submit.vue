<template>
  <span>
    <el-button v-bind="$attrs" @click="submitClick" :disabled="disabled">发布价格</el-button>
    <el-dialog
      title="调价说明"
      :visible.sync="dialogVisible"
      width="300px"
      :modal="modal"
      style="text-align: left">
      <ever-form2
        ref="priceDec"
        v-model="obj"
        :schema="schema"
        :rules="rules"
        :nosubmit="true"
        class="priceform"
        :validateOnRuleChange="false"
        :showMessage="formShowMessage"
      ></ever-form2>
      <!-- <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入内容"
        v-model="desc">
      </el-input> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEvent" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>
<script>
import api from '@/manages/api/price'
export default {
  props: {
    source: { // 机构或者集团【org】【tenant】
      type: String,
      default: 'tenant'
    },
    sourceModule: { // cpoe warehouse
      type: String,
      default: 'cpoe'
    },
    modal: { // 解决弹窗嵌套的时候，调价弹窗遮罩层级过高
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    checkLength: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      obj: {
        desc: ''
      },
      formShowMessage: false,
      schema: [{
        label: '',
        name: 'desc',
        comp: 'el-input',
        props: {
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          placeholder: '请输入调价说明',
          maxlength: 200
        },
        span: 24,
        labelWidth: '0px'
      }],
      rules: {
        desc: {
          required: true,
          message: '不能为空',
          trigger: ['change', 'blur']
        }
      },
      loading: false
    }
  },
  methods: {
    submitClick () {
      if (this.checkLength && this.$parent.priceChangeList && !this.$parent.priceChangeList.length) {
        return this.$messageTips(this, 'warning', '没有修改任何数据!')
      }
      this.dialogVisible = true
    },
    submitEvent () {
      this.loading = true
      this.$refs.priceDec && this.$refs.priceDec.$refs.form.validate(valid => {
        if (valid) {
          let param = {
            by: 'adjustByItem',
            source: this.source,
            sourceModule: this.sourceModule,
            desc: this.obj.desc
          }
          this.$emit('submit', this.submit, param)
          this.dialogVisible = false
          this.obj.desc = ''
        }
        this.loading = false
      })
    },
    async submit (param) {
      return api.createPriceToService(param)
    }
  }
}
</script>
<style lang="scss" scoped>
.priceform /deep/ .el-form-item {
  display: block;
  /deep/ .el-form-item__content{
    display: block;
  }
}
</style>

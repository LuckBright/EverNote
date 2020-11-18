<template>
    <div class="dialog_print">
        <el-dialog 
            title="打印模式"
            :visible="visible"
            @update:visible="close"
            width="700px"
            @close="close"
            :close-on-click-modal="false"
            destroy-on-close>
            <el-form :model="form">
                <el-form-item label="打印份数" :label-width="formLabelWidth">
                    <el-input v-model="form.copies" autocomplete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="打印模式" :label-width="formLabelWidth">
                    <el-radio label="normalPrint" v-model="form.printModel">正常打印</el-radio>
                </el-form-item>
                <el-form-item label="" :label-width="formLabelWidth">
                    <el-radio label="continuePrint" v-model="form.printModel">续打</el-radio>
                </el-form-item>
                <el-form-item label="" :label-width="formLabelWidth">
                  <el-button type="primary" @click="submit">确定</el-button>
                  <el-button @click="close">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
     // printVisible: false,
      form: {
        copies: 1,
        curPage: '2',
        printModel: 'normalPrint'
      },
      formLabelWidth: '120px'
    }
  },
  mounted () {
    // this.printVisible = this.visible
  },
  methods: {
    submit () {
      // let from = Number(this.form.pageFrom)
      // let to = Number(this.form.pageTo)
      // let setting = {}
      // if ((from || from >= 0) && (to || to > 0) && from < to) {
      //   setting = {
      //     copies: this.form.copies,
      //     pageFrom: Number(this.form.pageFrom) || 1,
      //     pageTo: Number(this.form.pageTo) || 1
      //   }
      // } else {
      //   setting = {
      //     copies: this.form.copies
      //   }
      // }
      let setting = {
        copies: this.form.copies
      }

      if (this.form.printModel === 'continuePrint') {
        this.$emit('submitContinuePrint', setting)
      } else {
        this.$emit('submitPrint', setting)
      }
      this.$emit('update:visible', false)
    },
    close () {
      // this.visible = false
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog_print{
    /deep/.number{
        display:inline-block;
        width:15%;
    }
    .el-form-item{
        margin:10px;
    }
    /deep/.el-form-item__content{
        line-height:32px;
    }    
}
</style>

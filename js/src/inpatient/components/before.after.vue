<template>
  <div class="ever_status_wrap" style="overflow:hidden;padding-right:10px">
    <el-form :rules="rules" :model="value" style="margin-bottom:10px" ref="form">
      <el-row class="item_spe">
        <el-col :span="10">
          <el-form-item prop="before">
            <el-input-number v-model="value.before" :min="min" :max="max" :controls="controls" placeholder="入院前"><template slot="prepend">入院前</template></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="alg_c">
          <i>→</i>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="after">
            <el-input-number v-model="value.after" :min="min" :max="max" :controls="controls" placeholder="入院后"><template slot="prepend">入院后</template></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: ['value', 'required'],
    data () {
      return {
        disabled: true,
        min: 0,
        max: 100,
        controls: false,
        rules: {
          before: [
            {required: true, message: '必填项', trigger: 'change', type: 'number'}
          ],
          after: [
            {required: true, message: '必填项', trigger: 'change', type: 'number'}
          ]
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ever_status_wrap{
    .item_spe{
      padding: 12px 0 15px;
      .alg_c{
        font-siez: 16px;
        color: #aaa;
      }
      .el-input-number{
        width: 100%;
        /deep/ .el-input{
          display: inline-table;
        }
      }
    }
    .el-col{
      &:nth-last-child(3) {
         padding-right: 3px !important;
       }
      }
    }
</style>

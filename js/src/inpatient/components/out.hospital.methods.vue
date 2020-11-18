<template>
  <div class="ever_status_wrap" style="overflow:hidden;padding-right:10px">
    <el-form :rules="rules" :model="value" ref="form">
      <el-form-item prop="key">
        <el-radio-group v-model="value.key">
          <el-row class="item_spe">
            <template v-for="(key,val) in OUT_HOSPITAL_METHODS">
              <el-col :span="elSpan(val)" :key="val">
                <el-radio :label="val">{{key}}<template v-if="(val === '2'|| val === '3') && value.key === val">，拟接收医疗机构名称<el-form-item prop="txt">
                  <el-input v-model="value.txt" :maxlength="200" placeholder="请输入拟接收医疗机构名称"></el-input></el-form-item></template></el-radio>
              </el-col>
            </template>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {OUT_HOSPITAL_METHODS} from '@/util/common'
  export default {
    props: ['value', 'required'],
    data () {
      return {
        disabled: true,
        OUT_HOSPITAL_METHODS,
        rules: {
          key: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ],
          txt: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ]
        }
      }
    },
    methods: {
      elSpan (val) {
        if (val === '1' || val === '4') {
          return 6
        } else if (val === '5' || val === '6') {
          return 4
        } else if (val === '2') {
          return 18
        } else if (val === '3') {
          return 24
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ever_status_wrap{
    .item_spe{
      padding: 5px 10px 0 0;
      .alg_c{
        font-siez: 16px;
        color: #aaa;
      }
    }
    .el-col{
      height: 40px;
      line-height: 40px;
      &:nth-last-child(2) {
         padding-right: 5px !important;
       }
      }
    }
    .el-form-item{
      display: inline-block;
      /deep/ .el-form-item__error{
        left: 20px !important;
      }
    }
    .el-input{
      margin-left: 20px;
      max-width:200px;
    }
</style>

<template>
  <div style="height: 100%; overflow: auto">
    <div class="list-title">
     快递费设置
    </div>
    <div>
      <el-form ref="setform" :model="form" :rules="rules">
        <div class="form-item-box">
          <el-form-item class="form-title" label="快递费用适用分类">
            <el-radio-group v-model="form.fullTypeSet">
              <el-radio :label="1">自定义</el-radio>
              <el-radio :label="2">全部</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item  label="">
            <el-checkbox-group :disabled="form.fullTypeSet === 2" v-model="form.fullTypes">
              <el-checkbox :label="item.code"  v-for="item in fullTypeOption"  :key="item.code">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="form-item-box">
          <el-form-item class="form-title" label="快递费额度"></el-form-item>
          <el-form-item label="" prop="basisCost">
            基础费用 <el-input v-model="form.basisCost"></el-input> 元
          </el-form-item>
          <el-form-item label="满减设置">
            <el-radio-group v-model="form.fullSet">
              <el-radio :label="1">有</el-radio>
              <el-radio :label="2">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" prop="fullCost">
            满 <el-input  :disabled="form.fullSet === 2"  v-model="form.fullCost"></el-input> 元免运费
          </el-form-item>
        </div>
        <div class="form-item-box btn-box">
          <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import expressCount from '../smsrecharge/index'
import { request } from '@/util/req'
export default {
  components: {
    expressCount
  },
  data () {
    return {
      fullTypeOption: [],
      form: {
        fullTypeSet: 1,
        fullTypes: ['301', '302', '303', '304'],
        basisCost: 0,
        fullSet: 2,
        fullCost: ''
      },
      rules: {
        basisCost: [
          { validator: this.checkbasisCost, trigger: 'blur' }
        ],
        fullCost: [
          { validator: this.checkFullDel, trigger: 'blur' }
        ],
      }
    }
  },
  created () {
    this.getTypes()
    this.getFormData()
  },
  methods: {
    checkbasisCost (rule, value, callback) {
      if (!/(^[1-9]\d*$)|(^0\.\d+$)|(^[1-9]\d*\.\d+$)/.test(value)) {
        return callback(new Error('请输入正确费用格式'))
      } else {
        callback()
      }
    },
    checkFullDel (rule, value, callback) {
      if (!/(^[1-9]\d*$)|(^0\.\d+$)|(^[1-9]\d*\.\d+$)/.test(value) && this.form.fullSet === 1) {
        return callback(new Error('请输入正确费用格式'))
      } else {
        callback()
      }
    },
    submitForm () {
      this.$refs['setform'].validate((valid) => {
        if (valid) {
          request({ url: '/platform-extend/courierFeesSet/save', isStatic: false }, this.form, 'post').then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功！', '提示')
            }
          })
        }
      })
    },
    getTypes () {
      request({ url: '/thc-platform-core/valueSetItem/getValueSetItems/', isStatic: false }, { 'setCode': 'THC_WH_OBJECT_SUB_TYPE' }, 'post').then(res => {
        if (res.head.errCode === 0) {
          this.fullTypeOption = res.data
        }
      })
    },
    getFormData () {
      request({ url: '/platform-extend/courierFeesSet/queryOne', isStatic: false }, {}, 'post').then(res => {
        if (res.head.errCode === 0 && res.data) {
          this.form = res.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .list-title{
    height: 42px;
    background: #fff;
    line-height: 42px;
    padding-left: 30px;
    font-size: 14px;
    position: relative;
    border-bottom: solid 1px #DADCE0;
    &:after{
      content: '';
      display: block;
      height: 14px;
      width: 3px;
      background: #1C7BEF;
      position: absolute;
      left: 19px;
      top: 14px;
    }
  }
  /deep/ .el-radio-group{
    height: 40px;
    line-height: 40px;
  }
  /deep/ .el-form-item{
    margin-bottom: 0;
    /deep/ .el-form-item__content{
      display: inline-block;
      .el-input{
        display: inline-block;
        width: auto;
      }
    }
  }
  /deep/ .el-form .form-title{
    .el-form-item__label{
      font-weight: bold;
      margin-left: -10px;
    }
  }
  .form-item-box{
    padding: 5px 30px 15px;
    background: #fff;
  }
  .btn-box{
    padding: 10px 20px 25px;
  }
</style>

<template>
  <el-dialog 
    :title="title" 
    :visible="value" 
    class="ui_dialog_02 inpatient_base_dialog"
    :close-on-click-modal='false'
    :show-close='showClose'
    width='450px'
    @close="close">
    <div class="diloag_patient_info">
      <p class="name">姓名：{{patient && patient.patientName}}</p>
      <p>性别：{{patient && patient.sex | formatSex}}</p>
      <p>出生日期：{{ patient && patient.birthday | formatDateByExp("YYYY-MM-DD")}}</p>
    </div>
    <slot></slot>
    <div slot="footer" class="dialog-footer" v-if='showBtn'>
      <el-button  @click="close">取消</el-button>
      <el-button type="primary" :disabled="disabled" @click="$emit('save')"   
        >确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/inpatient/store/resident.js'
export default {
  props: {
    title: String,
    value: Boolean,
    patient: {
      type: Object,
      default () {
        return {}
      }
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      api
    }
  },
  computed: {

  },
  components: {
  },
  mounted () {
  },
  methods: {
    patientinfo (data) {
    },
    save () {

    },
    close () {
      this.$emit('input', false)
    },
    async open () {
    },
    beforeClose () {

    }
  }
}
</script>
<style lang='scss' scoped>
.inpatient_base_dialog{
  /deep/ .el-dialog__footer{
    border-top:none;
  }
  button {
    padding-left: 15px;
    padding-right: 15px;
  }
  .diloag_patient_info{
    background-color: #F0F5FA;
    padding: 0 10px;
    font-size: 14px;
    color: #2B333D;
    line-height: 36px;
    text-align: center;
    display: flex;
    justify-content:space-between;
    p{
      margin: 0;
      span{
        color: #999;
      }  
    }
    .width{
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .name{
      font-weight: 700;
      span{
        float: right;
        width: 1px;
        padding: 8px 0;
        margin-top: 10px;
        margin-left: 10px;
        background-color: #979797;
        opacity: .3;
      }
    }
  }
  /deep/ .el-form{
      padding-top:15px;
      .el-form-item{
          margin-bottom: 15px;
      }
      .el-form-item__content{
          line-height: 32px;
          .el-input__inner{
              height: 32px;
              line-height: 32px;
          }
      }

  }
  /deep/ .back{
      padding-left: 15px;
      padding-bottom: 15px;
      span{
          color: #1C7BEF;
          text-decoration: underline;
          cursor: pointer;
          padding-left: 10px;
      }
  }
  /deep/ .wb100{
    width: 100%;
  }
    
}
</style>

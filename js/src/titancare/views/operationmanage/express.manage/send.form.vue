<template>
  <div class='form-box'>
    <el-form :model="form">
      <el-form-item label="快递公司" label-width="80px">
        <el-select
          v-model="form.expressComCode"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          value-key='name'
          @change='changeSelect'
          :remote-method="remoteMethod">
          <el-option
            v-for='item in expressOptions'
            :key='item.id'
            :label='item.name'
            :value='item'
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="快递单号" label-width="80px">
        <el-input v-model="form.expressNumber"></el-input>
        <i class='el-icon-plus icon-btn' @click='addFormClick'></i>
        <div v-for='(item, index) in forms' :key='item.key'>
          <el-input v-model="item.expressNumber"></el-input>
          <i class='el-icon-delete icon-btn' @click='deleteFormClick(index)'></i>
        </div>
      </el-form-item>
    </el-form>
    <div style='margin-top: 20px; padding-left: 80px'>
      <el-button type="primary" @click='sendClick'>发药</el-button>
      <el-button @click='closeClick'>取消</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/titancare/api/operation'
export default {
  props: ['rowValue', 'title', 'idList', 'num'],
  data () {
    return {
      form: {
        expressComCode: '',
        expressNumber: '',
        expressComName: ''
      },
      forms: [],
      api,
      expressOptions: [],
      expressCode: '',
      expressName: ''
    }
  },
  methods: {
    sendClick () {
      let obj = {
        expressComCode: this.form.expressComCode.comCode,
        expressComName: this.form.expressComCode.com,
        expressNumber: this.form.expressNumber
      }
      this.forms.forEach(item => {
        item.expressComCode = this.expressCode
        item.expressComName = this.expressName
      })
      let values = [obj, ...this.forms]

      let params = null
      if (this.title === '整包发药') {
        params = {
          expressList: values,
          recipeOrderIdList: [this.rowValue.id],
          type: 1
        }
      } else {
        params = {
          doctorAdviceIdList: this.idList,
          expressList: values,
          recipeOrderIdList: [this.rowValue.id],
          num: this.num,
          type: 2
        }
      }
      api.goDeliver(params).then(res => {
        if (!res.errCode) {
          this.$notify({
            title: '成功',
            message: '发药成功',
            type: 'success'
          })
          this.$emit('closeSearch')
        }
      })
    },
    closeClick () {
      this.$emit('close')
    },
    addFormClick () {
      this.forms.push({
        key: Math.random(),
        expressComCode: '',
        expressNumber: '',
        expressComName: ''
      })
    },
    deleteFormClick (index) {
      this.forms.splice(index, 1)
    },
    changeSelect (val) {
      this.expressCode = val.comCode
      this.expressName = val.com
    },
    remoteMethod (val) {
      if (val) {
        api.queryCom({ name: val }).then(res => {
          if (!res.errCode) {
            res.data.resultList.forEach(item => {
              item.name = item.com
            })
            this.expressOptions = res.data.resultList
          }
        })
      }
    }
  }
}
</script>
<style lang='less' scoped>
.form-box{
  /deep/ .el-form-item .el-form-item__content .el-input {
    width: 90%;
  }
  /deep/ .el-form-item .el-form-item__content .el-select {
    width: 100%;
  }
  .icon-btn{
    margin-left: 9px;
    color: #1C7BEF;
    cursor: pointer;
  }
}
</style>

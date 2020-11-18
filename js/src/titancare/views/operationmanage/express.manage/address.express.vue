<template>
  <div class='address-box'>
    <div>
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
          <el-button @click='sendClick'>合并发药</el-button>
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
    </div>
    <div>
      <receiving-address :showexpress='isShow' :values=values[0]></receiving-address>
    </div>
    <div v-for='(value, index) in values' :key='index'>
      <div v-for='(items, index) in value.recipeList' :key='index'>
        <see-btn v-if='items.list.length' :values='items' :status='2'></see-btn>
        <table-label
          v-for='(item, index) in items.list'
          :key='index'
          :name=serviceType[item[0].serviceType]
          :resultData='item'
          :isShowCheckBox='isShow'
          ref='tableref'
          ></table-label>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/titancare/api/operation'
import tableLabel from '../tablelabel'
import receivingAddress from '../receiving.address'
import seeBtn from '@/titancare/views/operationmanage/seebutton.vue'

export default {
  components: {
    tableLabel,
    receivingAddress,
    seeBtn
  },
  props: ['values'],
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
      expressName: '',
      isShow: false,
      serviceType: {
        301: '西药',
        302: '中成药',
        303: '中药材',
        304: '中药材'
      }
    }
  },
  methods: {
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
      let idList = []
      this.values.forEach(item => {
        idList.push(item.recipeOrderId)
      })
      let params = {
        expressList: values,
        recipeOrderIdList: idList,
        type: 3
      }
      api.goDeliver(params).then(res => {
        // console.log('发药成功', res)
        if (res === 'SUCCESS') {
          this.$notify({
            title: '成功',
            message: '发药成功',
            type: 'success'
          })
          this.$emit('closeExpressDialog')
        }
      })
    },
    remoteMethod (val) {
      if (val) {
        api.queryCom({ name: val }).then(res => {
          if (res.list.length) {
            res.list.forEach(item => {
              item.name = item.com
            })
            this.expressOptions = res.list
          }
        })
      }
    }
  }
}
</script>
<style lang='less' scoped>
.address-box{
  /deep/ .el-form .el-form-item .el-form-item__content .el-input{
    width: 200px;
  }
  .icon-btn{
    margin-left: 9px;
    color: #1C7BEF;
    cursor: pointer;
  }
}
</style>

<template>
    <ever-form-model
      id="opencardtabstwo"
      :schema="schema"
      v-model="obj"
      :api="api"
      :rules="rules"
      @objsaved="afterSave"
      @selectuser="selectUser"
      @deleteuser="deleteUser"
      label-position="right"
      ref="opencardtabstwo">
      <template slot-scope="scope" slot="code">
        <el-input placeholder="请输入会员卡号" v-model="scope.obj['code']">
          <el-button class="input-btn" slot="append" :disabled="!scope.obj.batchId" type="primary" :icon="checkcode?'check':'search'" @click="checkCardCode">验证</el-button>
        </el-input>
      </template>
      <template slot-scope="scope" slot="storedMoney">
        <ever-number v-model="scope.obj['storedMoney']" placeholder="请输入储值金额" number-type="number"></ever-number>
      </template>
      <el-form-item>
        <el-button type="primary" @click="submitForm">确定开卡</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </ever-form-model>
</template>
<script>
  import batchapi from '../store/cardbatchapi'
  import api from '../store/carditemapi.js'
  import form from '../../util/form'
import { debounce1 as debounce } from '@/util/common'

  let schema = [
    {
      name: 'userInfo',
      type: 'selectuser',
      label: '持卡人',
      style: 'label',
      shareCount: 1,
      span: 24
    },
    {
      name: 'batchObj',
      type: 'select',
      label: '会员卡',
      needObjFlag: true,
      options: [],
      span: 13
    },
    {
      type: 'custom',
      name: 'code',
      label: '会员卡号',
      span: 13
    },
    {
      type: 'custom',
      name: 'storedMoney',
      label: '储值金额',
      span: 13
    },
    {
      name: 'datetimes',
      type: 'daterange',
      label: '有效期',
      disabled: true,
      span: 24
    },
    {
      name: 'memberCardShares',
      type: 'selectuser',
      label: '共享人',
      style: 'table',
      placeholder: '可添加5个共享人',
      shareCount: 5,
      span: 13
    }
  ]

  export default {
    mixins: [form],
    props: ['selectData'],
    data () {
      let obj = this.createObjFromSchema(schema)
      obj.memberCardShares = []
      obj.userInfo = []
      obj.batch = ''
      obj.formType = 2
      obj.id = ''
      obj.shareCount = 5
      obj.datetimes = []
      return {
        schema,
        obj: obj,
        objId: this.$route.params.id > -1 ? this.$route.params.id : null,
        api: api,
        rules: {
          code: [
            {required: true, message: '请输入会员卡号', trigger: 'blur'}
          ],
          storedMoney: [
            {required: true, message: '请验证会员卡号获取储值金额', trigger: 'change', type: 'number'}
          ],
          userInfo: [
            {required: true, message: '请选择持卡人', trigger: 'change', type: 'array'}
          ],
          batchObj: [
            {required: true, message: '请选择会员卡批次', trigger: 'change', type: 'object'}
          ],
          datetimes: [
            {message: '请选择有效期，为空代表无限期', trigger: 'change', type: 'array'}
          ]
        },
        checkcode: false
      }
    },
    methods: {
      afterSave () {
        this.$router.push('/card/carditem')
      },
      deleteUser (index, name) {
        this.$emit('deleteuser', index, name)
      },
      selectUser (name) {
        let count = this.$ever.getFieldFromSchema(schema, name).shareCount
        this.$emit('selectuser', name, count)
      },
      getBatchList () {
        let batchOptions = this.$ever.getFieldFromSchema(schema, 'batchObj')
        batchapi.list({offset: 0, pagesize: 20, status: 0}).then(result => {
          batchOptions.options = result.data.resultList
        })
      },
      checkCardCode () {
        this.obj.formType = 9
        if (this.obj.batchId === '') {
          this.$messageTips(this, 'warning', '请输入会员卡号')
          return false
        }
        if (this.obj.code === '') {
          this.$messageTips(this, 'warning', '请输入会员卡号')
          return false
        }
        this.api.createOrUpdate({batchId: this.obj.batchId, code: this.obj.code, formType: 9})
          .then(result => {
            if (!result || !result.data) {
              return false
            }
            if (result.data.bind) {
              this.$messageTips(this, 'warning', '此卡号已绑定过了')
            } else {
              this.checkcode = true
              this.obj.id = result.data.id
              this.obj.storedMoney = result.data.storedMoney
            }
          })
      },
      submitForm: debounce(function () {
        this.obj.datetimes[0] = new Date(new Date().getTime() + 120000)
        this.obj.formType = 2
        this.$refs.opencardtabstwo.$refs.form.validate(valid => {
          if (!valid) { return false }
          this.api.createOrUpdate(this.obj).then(result => {
            this.afterSave(result)
          })
        })
      }, 500),
      resetForm () {
        this.$refs.opencardtabstwo.$refs.form.resetFields()
      }
    },
    watch: {
      'obj.batchObj' (val) {
        let storedMoney = this.$ever.getFieldFromSchema(schema, 'storedMoney')
        let end = new Date()
        let start = new Date()
        start.setHours(start.getHours() + 1)
        end.setMonth(end.getMonth() + val.validPeriod)
        storedMoney.placeholder = '至少充值' + val.moneyThreshold
        this.obj.datetimes = [start, end]
        this.obj.batchId = val.id
        this.obj.shareCount = val.shareCount
      },
      'obj.shareCount' (val) {
        let schemaobj = this.$ever.getFieldFromSchema(schema, 'memberCardShares')
        schemaobj.placeholder = val ? '可添加' + val + '个共享人' : ''
        schemaobj.shareCount = val
      },
      'selectData.userInfo' (val) {
        let user = []
        val.forEach(item => {
          user.push({id: item.id, userName: item.name, userId: item.id, status: 0})
        })
        console.log(user, 'user')
        this.obj.userInfo = user
        this.obj.userId = user.length > 0 ? user[0].id : ''
        this.obj.patientId = user.length > 0 ? user[0].id : ''
      },
      'selectData.memberCardShares' (val) {
        let data = []
        val.forEach(item => {
          let temp = {}
          temp.userId = item.id
          temp.patientId = item.id
          temp.patientName = item.name
          temp.maxShareMoney = ''
          temp.status = 0
          data.push(temp)
        })
        this.obj.memberCardShares = data
      }
    },
    created () {
      this.obj.type = ''
      this.obj.userId = ''
      this.getBatchList()
    },
    beforeCreate () {
      this.api = api
    }
  }
</script>
<style scoped>
 #opencardtabstwo .el-input-group__append button{color: #1C7BEF;}
 #opencardtabstwo .el-input-group__append button.is-disabled{background: rgb(238, 240, 246);color: #bbb;}
 .input-btn {position:relative;right:10px;}
 .el-form /deep/ .el-col:first-child .el-button {background-color: #FEF5BE;}
</style>

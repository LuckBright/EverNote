<template>
  <el-card class="box-card">
    <ever-form-model
      :schema="schema"
      v-model="obj"
      ref="form"
      :api="api"
      :rules="rules"
      @objsaved="afterSave"
      @selectuser="showSelectUserPop"
      @stopUser="stopUser"
      @startUser="startUser "
      @deleteuser="deleteUser"
      label-position="right"
      :btn-name="btnName">
    </ever-form-model>
    <select-user-pop ref="selectuser" :vipUsers="obj.memberCardShares" @selectUserVal="selectUser"></select-user-pop>
    <el-button type="primary" style="margin-left:120px;" @click="submitForm('form')">保存</el-button>
  </el-card>
</template>
<script>
  import api from '../store/shareuserapi.js'
  import form from '../../util/form'
  import selectUserPop from '../page/selectusers'
  let schema = [
    {
      name: 'userName',
      type: 'readonly',
      label: '持卡人',
      span: 24
    },
    {
      name: 'memberCardShares',
      type: 'selectuser',
      label: '共享人',
      style: 'table',
      placeholder: '可添加5个共享人',
      shareCount: 5,
      span: 16
    }
  ]

  export default {
    mixins: [form],
    data () {
      let obj = this.createObjFromSchema(schema)
      obj.memberCardShares = []
      obj.cardId = this.$route.query.id
      obj.userId = this.$route.query.userid
      obj.userName = this.$route.query.username
      return {
        schema,
        obj: obj,
        api: api,
        rules: {},
        selectData: [],
        btnName: ['保存', '重置'],
        vipUsers: []
      }
    },
    created () {
      let memberCardSharesItem = this.$ever.getFieldFromSchema(schema, 'memberCardShares')
      memberCardSharesItem.shareCount = this.$route.query.shareCount
      memberCardSharesItem.placeholder = '可添加' + this.$route.query.shareCount + '个共享人'
      this.api.list({cardId: this.$route.query.id}).then(results => {
        if (results && results.data) {
          let user = []
          results.data.forEach(rs => {
            user.push({
              id: rs.id,
              patientId: rs.patient.id,
              name: rs.patient.name,
              maxShareMoney: rs.maxShareMoney,
              status: rs.status
            })
          })
          this.selectData = user
        }
      })
    },
    methods: {
      submitForm: function () {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.api.createOrUpdate(this.obj).then(result => {
              // this.$emit('objsaved', result)
              this.afterSave()
            })
          }
        })
      },
      afterSave () {
        this.$router.push('/card/carditem')
      },
      showSelectUserPop (name) {
        // this.$refs.selectuser.onDialogOpen(name, this.selectData, this.$route.query.shareCount)
        this.$refs.selectuser.onDialogOpen(name, this.obj.memberCardShares, this.$route.query.shareCount)
      },
      selectUser (selected) {
        selected.data.forEach(item => {
          let row = {}
          row.patientId = item.id
          row.id = ''
          row.maxShareMoney = ''
          row.patientName = item.name
          row.status = 0
          this.obj.memberCardShares.push(row)
          // this.selectData = this.obj.memberCardShares
        })
      },
      startUser (i) {
        this.obj.memberCardShares[i].status = 0
      },
      stopUser (i) {
        this.obj.memberCardShares[i].status = 1
      },
      deleteUser (i) {
        this.obj.memberCardShares.splice(i, 1)
        // this.selectData.splice(i, 1)
      }
    },
    watch: {
      'selectData' (val) {
        let data = []
        val.forEach(item => {
          let temp = {}
          temp.id = item.id
          temp.patientId = item.patientId
          temp.patientName = item.name
          temp.maxShareMoney = item.maxShareMoney
          temp.status = item.status
          data.push(temp)
        })
        this.obj.memberCardShares = data
      }
    },
    components: {
      selectUserPop
    }
  }
</script>

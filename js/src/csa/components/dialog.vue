<template>
  <el-dialog 
    :title="columns.title" 
    :visible="dialog" 
    class="ui_dialog_02 inpatient_base_dialog"
    :close-on-click-modal='false'
    :show-close='true'
    @close='dialog=false'
    width='450px'>
    <div class="diloag_patient_info">
      <p class="name">姓名：{{patient && patient.name}}<span></span></p>
      <p>性别：{{patient && patient.sex | formatSex}}</p>
      <p>出生日期：{{ patient && patient.birthday | formatDateByExp("YYYY-MM-DD")}}</p>
    </div>
     <ever-form2
     ref='form2'
      :schema="columns.schema"
      v-model="queryobj"
      :nosubmit="true"
      labelWidth="100px"
      :inline='false'
      :rules='rules'
      :key='key'
    ></ever-form2>
    <div slot="footer" class="dialog-footer">
      <el-button  @click="dialog=false">取消</el-button>
      <el-button type="primary" @click="save"   
        >确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/csa/store/csaapi.js'
import * as col from '@/csa/components/columns.js'
export default {
  data () {
    return {
      api,
      dialog: false,
      patient: {},
      columns: {},
      key: 1,
      schema: [],
      queryobj: {},
      id: '',
      row: {},
      providerId: '',
      nurseOptions: [],
      sectionOptions: [],
      rules: []
    }
  },
  watch: {
    'queryobj.handoverTo' (val) {
      if (this.id === 'LEAVE_SURGERY_ROOM') {
        if (val === '1' && document.querySelector('.surgery_room')) {
          document.querySelector('.surgery_room').style.display = 'block'
        } else if (document.querySelector('.surgery_room')) {
          document.querySelector('.surgery_room').style.display = 'none'
        }
      } else if (this.id === 'CANCEL_SURGERY') {
        this.queryobj.handoverToRoomId = ''
        this.$ever.getFieldFromSchema(this.columns.schema, 'handoverToRoomId').props.options = []
        if (val === '1') this.getRoomListByParam('LEAVE_SURGERY_ROOM')
        else if (val === '2') this.getRoomListByParam('ENTER_SURGERY_ROOM')
      } else if (this.id === 'LEAVE_RESUSCITATION_ROOM') {
        if (val === '2' && document.querySelector('.surgery_room')) {
          document.querySelector('.surgery_room').style.display = 'block'
        } else if (document.querySelector('.surgery_room')) {
          document.querySelector('.surgery_room').style.display = 'none'
        }
      }
    }
  },
  components: {
  },
  mounted () {
    if (localStorage.getItem('csa_value')) {
      let obj = JSON.parse(localStorage.getItem('csa_value'))
      this.providerId = obj.id
    }
  },
  methods: {
    getName (id, options) {
      let str = ''
      options.forEach(ele => {
        if (ele.id === id) str = ele.name
      })
      return str
    },
    async  save () {
      if (this.id === 'CANCEL_SURGERY') {
        let validate = await this.$refs.form2.$refs.form.validate()
        .catch(e => {})
        if (validate === undefined) return
      }
      let obj = {
        executeId: this.row.executeId,
        adviceId: this.row.adviceId,
        operateCode: this.id,
        ...this.queryobj
      }
      if (this.queryobj.handoverToRoomId) {
        obj.handoverToRoomName = this.getName(this.queryobj.handoverToRoomId, this.sectionOptions)
      }
      if (this.queryobj.handoverToNurseId) {
        obj.handoverToNurseName = this.getName(this.queryobj.handoverToNurseId, this.nurseOptions)
      }
      if (this.queryobj.handoverFromNurseId) {
        obj.handoverFromNurseName = this.getName(this.queryobj.handoverFromNurseId, this.nurseOptions)
      }
      let res = await this.api.handover(obj)
      if (res && res.head && res.head.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        })
        this.dialog = false
        this.$emit('success')
      }
    },
    async getDoctors () {
      let obj = {
        tenantSubjectIdList: [this.providerId],
        baseStaffPermission2CodeList: ['01.03'],
        orgIdList: [this.$store.state.currentUser.organizationId + ''],
        typeCodeList: ['DOCTOR']
      }
      let res = await this.api.getStaffListByCondition(obj)
      if (res.data && res.data.resultList) {
        let arr = res.data.resultList || []
        this.nurseOptions = arr
      }
      this.$ever.getFieldFromSchema(this.columns.schema, 'handoverFromNurseId').props.options = this.nurseOptions
    },
    getnurseOptions (cb) {
      if (localStorage.getItem('csa_value')) {
        let obj = JSON.parse(localStorage.getItem('csa_value'))
        this.api.getStaffListByCondition({
          tenantSubjectIdList: [obj.id, this.row.providerId], // 再加上患者科室就行了
          orgIdList: [this.$store.state.currentUser.organizationId + ''],
          typeCodeList: ['NURSE']
        }).then(res => {
          if (res.data && res.data.resultList) {
            let arr = res.data.resultList || []
            this.nurseOptions = arr
            if (cb)cb()
          }
        })
      }
    },
    async getRoomListByParam (id) {
      if (!(id === 'ENTER_SURGERY_ROOM' || id === 'LEAVE_SURGERY_ROOM' || id === 'LEAVE_RESUSCITATION_ROOM')) return
      let res = await this.api.getRoomListByParam({
        roomPurposeCodeList: id === 'LEAVE_SURGERY_ROOM' ? ['RECOVERY_ROOM'] : ['OPERATION_ROOM'],
        tenantSubjectIds: [this.providerId],
        orgIdList: [this.$store.state.currentUser.organizationId + '']
      })
      if (res.data) {
        this.sectionOptions = res.data
      }
      this.$ever.getFieldFromSchema(this.columns.schema, 'handoverToRoomId').props.options = this.sectionOptions
    },

    open (row, id) {
      this.dialog = true
      this.id = id
      this.key++
      this.row = row
      this.columns = col[id]
      this.patient = row.patientDto || {}
      this.queryobj = this.$ever.createObjFromSchema(this.columns.schema)
      for (let item of this.columns.schema) {
        if (item.name === 'handoverTime') this.queryobj.handoverTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }
      this.getRoomListByParam(id)
      this.getnurseOptions(_ => {
        for (let item of this.columns.schema) {
          if (item.name === 'handoverToNurseId') this.$ever.getFieldFromSchema(this.columns.schema, 'handoverToNurseId').props.options = this.nurseOptions
          if (item.name === 'handoverFromNurseId') this.$ever.getFieldFromSchema(this.columns.schema, 'handoverFromNurseId').props.options = this.nurseOptions
        }
      })
      if (id === 'REJECT') {
        this.getDoctors()
      }
      if (id === 'CANCEL_SURGERY') {
        this.rules = {
          handoverTo: [
            {required: true, message: '请选择返回去向', trigger: 'change', type: 'string'},
          ],
          handoverToRoomId: [
            { required: true, message: '请选择房间', trigger: 'change', type: 'string' }
          ],
        }
      } else {
        this.rules = {}
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.inpatient_base_dialog{
  /deep/ .el-dialog__footer{
    border-top:none;
  }
  /deep/ .surgery_room{
    display: none;
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

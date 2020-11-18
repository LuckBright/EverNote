<template>
  <div id="createconsult">
    <ever-bread-crumb :name="!id ? '创建咨询' : '编辑咨询'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card id="createconsult">
    <el-row class="title" slot="header">
      <el-col :span="24" align="right">
        <el-button type="primary" class="ml10" @click="showAddAppoint=true">添加预约</el-button>  
      </el-col>
    </el-row>
    <ever-form-model
      :schema="schema"
      v-model="obj"
      :api="api"
      :rules="rules"
      ref="form"
      label-position="right">
      <template slot="patientName" slot-scope="scope">
        <div @click="showUserPop">
          <el-input placeholder="请选择客户" v-model="scope.obj.patientName" :disabled="!!scope.obj.id" :readonly="true">
          </el-input>
        </div>
      </template>
      <template slot="callRecord" slot-scope="scope">
        <div @click="showCalledPop">
          <el-input :placeholder="!scope.obj.patientId ? '请先选择咨询客户' : '选择通话录音'" v-model="scope.obj.callRecord.url" :disabled="!scope.obj.patientId || scope.obj.way !=1" :readonly="true">
          </el-input>
        </div>
      </template>
      <el-form-item>
        <el-button type="primary" class="submit-btn" :disabled="!!loading" @click="saveTempalte">
          保存
        </el-button>
        <el-button type="" @click="prevBack" class="cancel-btn">取消</el-button>
      </el-form-item>
    </ever-form-model>
      <user-select title="选择客户" :visible="userPop" @close="closeUserPop" :initdata="obj.patient" @select="setUserItem" @update="updateUserDia" :isradio="true"></user-select>
    <call-select ref="callselect" :initdata="obj.callRecord" v-if="obj.patientId" :patient-id="obj.patientId" :visible="calledPop" @select="setCalledItem" @update="updateCalledDia" :isradio="true"></call-select>
    <add-appoint :show.sync="showAddAppoint"></add-appoint>
  </el-card>
  </div>
</template>
<script>
  import api from '../store/consultapi'
  import depart from '../../warehouse/store/departmentapi'
  import form from '../../util/form'
  import userSelect from '../page/userselect'
  import callSelect from '../page/callselect.vue'
  import addAppoint from '@/arrange/page/register/addappoint.vue'
  let schema = [
    {
      name: 'patientName',
      type: 'custom',
      span: 24,
      label: '选择客户：'
    },
    {
      name: 'dptObj',
      type: 'select',
      options: [],
      label: '咨询部门：',
      needObjFlag: true,
      clearable: true,
      placeholder: '选择部门',
      span: 6
    },
    {
      name: 'way',
      type: 'systype',
      label: '咨询方式',
      code: 'THC_CC_FOLLOWUP',
      clearable: false,
      useValue: true,
      span: 6
    },
    {
      name: 'source',
      type: 'systype',
      code: 'THC_CONSULT_RESOURCE',
      label: '来源',
      clearable: false,
      useValue: true,
      span: 6
    },
    {
      name: 'forWhom',
      type: 'systype',
      code: 'THC_CONSULT_CONFOR',
      label: '为谁咨询',
      placeholder: '选择咨询对象',
      clearable: false,
      useValue: true,
      span: 6
    },
    {
      name: 'content',
      type: 'textarea',
      label: '内容：',
      rows: 8,
      max: 500,
      placeholder: '请输入咨询内容',
      span: 24
    },
    {
      name: 'callRecord',
      type: 'custom',
      span: 24,
      label: '通话记录：'
    }
  ]
  export default {
    mixins: [form],
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      obj.creator = this.$store.state.currentUser.userId
      obj.patientId = ''
      obj.dptId = ''
      obj.dptName = ''
      obj.callRecord = ''
      obj.callRecordId = ''
      return {
        schema,
        id: this.$route.query.id,
        api,
        depart,
        obj,
        userPop: false,
        calledPop: false,
        loading: false,
        showAddAppoint: false,
        rules: {
          patientName: [
            {required: true, message: '请选择咨询客户', trigger: 'change'}
          ],
          way: [
            {required: true, message: '请选择咨询方式', trigger: 'change'}
          ],
          forWhom: [
            {required: true, message: '请选择为谁咨询', trigger: 'change'}
          ],
          source: [
            {required: true, message: '请选择来源', trigger: 'change'}
          ],
          content: [
            {required: true, message: '请输入咨询内容', trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      'obj.dptObj' (val) {
        this.obj.dptId = val.id
        this.obj.dptName = val.name
      },
      'obj.callRecord' (val) {
        if (val) {
          this.obj.callRecordId = val.id
        } else {
          val = {id: '', name: ''}
        }
      },
      'obj.patientId' () {
        if (!this.obj.id) {
          this.obj.callRecord = ''
        }
      }
    },
    created () {
      this.getDptList(schema, 'dptObj')
      this.initData()
    },
    methods: {
      linkCreatePage () {
        this.$router.push({name: 'createmessage', path: 'createmessage'})
      },
      saveTempalte () {
        this.$refs.form.$refs.form.validate(valid => {
          delete this.obj.dptObj
          if (valid) {
            this.loading = true
            this.api.create(this.obj).then(rs => {
              if (rs.head.errCode === 0) {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success'
                })
                this.loading = false
                this.$router.push({name: 'consult', path: 'consult'})
              }
            })
          }
        })
      },
      prevBack () {
        window.history.go(-1)
      },
      showUserPop () {
        this.userPop = !this.obj.id
      },
      showCalledPop () {
        if (this.obj.patientId && this.obj.way === '1') {
          this.calledPop = true
        }
      },
      closeUserPop () {
        this.userPop = false
      },
      closeCallSelect () {
        this.calledPop = false
      },
      updateUserDia (val) {
        this.userPop = val
      },
      updateCalledDia (val) {
        this.calledPop = val
      },
      initData () {
        if (!this.id) {
          return false
        }
        this.api.request({id: this.id}).then(rs => {
          rs.data.source += ''
          rs.data.way += ''
          rs.data.forWhom += ''
          rs.data.patientName = rs.data.patient.name
          rs.data.callRecord = rs.data.callRecord || {id: '', url: ''}
          rs.data.dptObj = {
            id: rs.data.dptId,
            name: rs.data.dptName
          }
          this.obj = Object.assign(this.obj, rs.data)
        })
      },
      getDptList (schema, name) {
        let field = this.$ever.getFieldFromSchema(schema, name)
        this.depart.list().then(rs => {
          field.options = rs
        })
      },
      setUserItem (users) {
        this.userPop = false
        let ids = []
        let names = []
        users.forEach(user => {
          ids.push(user.id)
          names.push(user.name)
        })
        this.obj.patientId = ids.join('')
        this.obj.patientName = names.join(',')
      },
      setCalledItem (val) {
        this.obj.callRecord = val ? val[0] : {id: '', name: ''}
      }
    },
    components: {
      userSelect,
      callSelect,
      addAppoint
    }
  }
</script>
<style scoped>
  #createconsult .el-input-group__append .el-button{background: #1C7BEF;border-radius: 0;color: #fff;}
</style>

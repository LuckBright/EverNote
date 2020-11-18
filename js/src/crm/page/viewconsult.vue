<template>
  <div id="consultdetail">
    <ever-bread-crumb name="咨询详情" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card>
      <el-row class="title" slot="header">
        <el-col :span="24" align="right">
          <el-button @click="updateConsult">修改咨询</el-button>
          <el-button @click="deleteConsult" v-if="$hasPermission('Auth_crm_Consult_delConsultBtn')">删除咨询</el-button>
          <el-button type="primary" class="ml10" @click="showAddAppoint=true">添加预约</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="formline">
          <ever-form-model
              :schema="schema"
              v-model="obj"
              :api="api"
              ref="form"
              label-position="left">
              <template slot="patient" slot-scope="scope">
                <span class="user-name" v-if="scope.obj.patient.name">
                  <a :href="$ever.crmIndex + '/crm/memberinfo/userinfo/memberbaseinfo/' + scope.obj.patient.id" class="col-blue" target="_blank">{{scope.obj.patient.name}}</a>
                  <!-- <i class="iconfont icon-huiyuan_dianhu" @click="calling(scope.obj)"></i> -->
                  <i class="iconfont icon-huiyuan_duanxin" @click="sendMessage"></i>
                </span>
                <router-link v-else :to="{ name: 'userBaseAdd' }" class="col-blue" tag="a" target="_blank">
                  新用户
                </router-link>
              </template>
              <template slot="forWhom" slot-scope="scope">
                <sys-value type="THC_CONSULT_CONFOR" :code="scope.obj.source"></sys-value>
              </template>
              <template slot="way" slot-scope="scope">
                <sys-value type="THC_CC_FOLLOWUP" :code="scope.obj.way"></sys-value>
              </template>
              <template slot="source" slot-scope="scope">
                <sys-value type="THC_CONSULT_RESOURCE" :code="scope.obj.source"></sys-value>
              </template>
              <template slot="duration" slot-scope="scope">
                <label>{{scope.obj.callRecord ? scope.obj.callRecord.duration + '秒' : '无'}}</label>
              </template>
              <template slot="url" slot-scope="scope">
                <a v-if="scope.obj.callRecord" :href="scope.obj.callRecord.url" class="col-blue" target="_blank">{{scope.obj.callRecord.url}}</a>
              </template>
              <template slot="sex">
                <sys-value type="GBT.2261.1" :code="obj.sex"></sys-value>
              </template>
            </ever-form-model>
        </el-col>
      </el-row>
      <send-message ref="sendmessage" :users="users" :allparams="allparams"></send-message>
      <add-appoint :show.sync="showAddAppoint"></add-appoint>
    </el-card>
  </div>
</template>
<script>
  import api from '../store/consultapi'
  import form from '../../util/form'
  import sendMessage from '../page/sendmessage'
  import addAppoint from '@/arrange/page/register/addappoint.vue'
  let schema = [
    {
      name: 'sn',
      type: 'label',
      span: 6,
      label: '咨询ID：'
    },
    {
      name: 'patient',
      type: 'custom',
      span: 6,
      label: '客户姓名：'
    },
    {
      name: 'sex',
      type: 'custom',
      span: 6,
      label: '性别：'
    },
    {
      name: 'mobile',
      type: 'label',
      span: 6,
      label: '手机号码：'
    },
    {
      name: 'dptName',
      type: 'label',
      span: 6,
      label: '咨询科室：'
    },
    {
      name: 'forWhom',
      type: 'custom',
      span: 6,
      label: '为谁咨询：'
    },
    {
      name: 'source',
      type: 'custom',
      span: 6,
      label: '来源：'
    },
    {
      name: 'way',
      type: 'custom',
      span: 6,
      label: '咨询方式：'
    },
    {
      name: 'content',
      type: 'label',
      span: 24,
      label: '咨询内容：'
    },
    {
      name: 'createTime',
      type: 'label',
      span: 8,
      label: '咨询时间：'
    },
    {
      name: 'duration',
      type: 'custom',
      span: 8,
      label: '时长：'
    },
    {
      name: 'creatorName',
      type: 'label',
      span: 8,
      label: '接待人：'
    },
    {
      name: 'url',
      type: 'custom',
      span: 24,
      label: '录音地址：'
    }
  ]
  export default {
    mixins: [form],
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      return {
        schema,
        api: api,
        obj: obj,
        users: '',
        allparams: {
          msgType: 110
        },
        id: this.$route.query.id,
        showAddAppoint: false
      }
    },
    created () {
      this.api.request({id: this.id}).then(rs => {
        if (rs.data) {
          rs.data.mobile = rs.data.patient.mobile
          rs.data.sex = rs.data.patient.sex
          rs.data.patientName = rs.data.patient.name
          this.obj = Object.assign(this.obj, rs.data)
          this.users = [this.obj]
        }
      })
    },
    methods: {
      sendMessage () {
        this.$refs.sendmessage.sendVisible = true
      },
      prevBack () {
        window.history.go(-1)
      },
      updateConsult () {
        this.$router.push({path: 'createconsult', query: {id: this.obj.id}})
      },
      deleteConsult () {
        this.$confirm('您确定要删除此咨询吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api.del({id: this.id}).then(rs => {
            if (rs.head.errMsg === 'successful') {
              this.$notify({title: '成功', type: 'success', message: '删除成功!'})
              this.$router.push({name: 'consult'})
            }
          })
        })
      },
      calling (val) {
        this.$parent.$parent.$parent.callData = {mobile: val.mobile, patientName: val.contact, patientId: val.idenId}
        this.$parent.$parent.$parent.$refs.iphone.visible = true
      }
    },
    components: {
      sendMessage,
      addAppoint
    }
  }
</script>
<style scoped>
  #consultdetail .user-name{line-height: 35px;}
  #consultdetail .user-name > * {display: inline-block;margin-right: 10px;cursor: pointer;font-size: 14px;line-height: 35px;}
  #consultdetail .user-name .iconfont{color: #1C7BEF;font-size:16px;}
</style>

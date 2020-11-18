<template>
  <div id="messagedetail">
    <ever-bread-crumb name="通话详情" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card>
      <el-row>
        <el-col :span="24" class="formline">
          <ever-form-model
            :schema="schema"
            v-model="obj"
            :api="api"
            ref="form"
            label-position="left">
            <template slot="patientName" slot-scope="scope">
              <a v-if="scope.obj.patientName" :href="$ever.crmIndex + '/crm/memberinfo/userinfo/memberbaseinfo/' + scope.obj.patientId" class="col-blue" target="_blank">{{scope.obj.patientName}}</a>
              <a v-else :href="$ever.crmIndex + '/crm/page/memberadd' " class="col-red" target="_blank">
                新用户
              </a>
            </template>
            <template slot="url" slot-scope="scope">
              <a v-if="scope.obj.url" :href="scope.obj.url" class="col-blue" target="_blank">{{scope.obj.url}}</a>
            </template>
          </ever-form-model>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import api from '../store/callapi'
  import form from '../../util/form'
  let schema = [
    {
      name: 'id',
      type: 'label',
      span: 8,
      label: '记录ID：'
    },
    {
      name: 'typeText',
      type: 'label',
      span: 8,
      label: '分类：'
    },
    {
      name: 'patientName',
      type: 'custom',
      span: 8,
      label: '客户姓名：'
    },
    {
      name: 'calling',
      type: 'label',
      span: 8,
      label: '主叫：'
    },
    {
      name: 'called',
      type: 'label',
      span: 8,
      label: '被叫：'
    },
    {
      name: 'duration',
      type: 'label',
      span: 8,
      label: '时长：'
    },
    {
      name: 'createTime',
      type: 'label',
      span: 8,
      label: '通话时间：'
    },
    {
      name: 'doctorName',
      type: 'label',
      span: 8,
      label: '操作者：'
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
      obj.typeText = ''
      return {
        schema,
        api: api,
        obj: obj,
        id: this.$route.query.id
      }
    },
    created () {
      this.api.request({id: this.id}).then(rs => {
        rs.data.typeText = rs.data.type === 1 ? '呼入' : '呼出'
        this.obj = Object.assign(this.obj, rs.data)
      })
    },
    methods: {
      prevBack () {
        window.history.go(-1)
      },
      toAddUser () {
        this.$router.push({name: 'userBaseAdd'})
      }
    },
    components: {}
  }
</script>

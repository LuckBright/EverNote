<template>
  <div>
    <ever-bread-crumb :name="type === 'create' ? '创建' : '编辑'" :path="'/manages/org/staff/punish/' + staffId"></ever-bread-crumb>
    <div class="layout_inner oa">
      <el-row>
        <el-col :span="24">
          <ever-form2
            v-model="form"
            ref="form"
            :schema="schema"
            :rules="rules"
            label-width="150px"
          >
            <template>
              <el-col>
                <el-form-item>
                  <el-button type="primary" @click="save">保存</el-button>
                </el-form-item>
              </el-col>
            </template>
<!--            <template slot="org">-->
<!--              <ever-org-select ></ever-org-select>-->
<!--            </template>-->
          </ever-form2>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import { dateFormat } from '@/util/common'
  import urlMap from '@/manages/page/organization/utils/urls'
  import '@/manages/page/organization/assets/less/index.less'
  const schema = [
    {
      name: 'docName',
      label: '医师姓名',
      props: {
      },
      span: 12,
    },
    {
      name: 'idCard',
      label: '医师身份证号',
      props: {
      },
      span: 12,
    },
    {
      name: 'org',
      label: '处罚医院',
      comp: 'ever-org-select',
      span: 12,
    },
    {
      name: 'punishReason',
      label: '处罚原因',
      span: 12,
    },
    {
      name: 'punishResult',
      label: '处罚结果',
      span: 12,
    },
    {
      name: 'punishTime',
      label: '处罚时间',
      parentClass: 'w',
      comp: 'date',
      props: {
        type: 'datetime',
        'default-time': '12:00:00',
      },
      span: 12,
    },
  ]
  const rules = {
    docName: [
      {required: true, message: '必填项', trigger: 'change'}
    ],
    idCard: [
      {required: true, message: '必填项', trigger: 'change'}
    ],
    org: [
      {required: true, message: '必填项', trigger: 'change'}
    ],
    punishReason: [
      {required: true, message: '必填项', trigger: 'change'}
    ],
    punishResult: [
      {required: true, message: '必填项', trigger: 'change'}
    ],
    punishTime: [
      {required: true, message: '必填项', trigger: 'change'}
    ],
  }
  export default {
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      form.orgCode = ''
      return {
        schema,
        form,
        rules,
        deptId: null,
        orgId: null,
        type: '',
      }
    },
    created () {
      this.type = this.$route.params.type
      this.id = this.$route.params.id // 奖惩信息id
      this.staffId = this.$route.params.staffId // 人员id
      this.searchStaffInfo()
    },
    methods: {
      searchStaffInfo () {
        request(urlMap.staff.load, {id: this.staffId}).then(res => {
          if (res.head.errCode === 0) {
            this.form = {
              ...this.form,
              docName: res.data.name || '',
              idCard: res.data.cardNumber || '',
            }
            if (this.type === 'edit') {
              this.search()
            }
          }
        })
      },
      search () {
        request(urlMap.staffWebCredit.load, {id: this.id}).then(res => {
          if (res.head.errCode === 0) {
            this.form = Object.assign({}, this.form, res.data)
            if (this.form.orgCode) {
              this.form.org = {
                code: this.form.orgCode,
                name: this.form.orgName,
              }
            }
          }
        })
      },
      save () {
        const params = Object.assign({}, this.form)
        params.thcStaffId = this.staffId
        if (params.org) {
          params.orgCode = params.org.code
          params.orgName = params.org.name
        }
        if (params.punishTime) {
          params.punishTime = dateFormat(params.punishTime, 'YYYY-MM-DD HH:mm:ss')
        }
        delete params.org
        request(urlMap.staffWebCredit[this.type === 'edit' ? 'update' : 'insert'], params).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功')
            this.$router.push({name: 'org-staff-punish-list', params: {id: this.staffId}})
          }
        })
      },
      // backTo (path) {
      //   this.$router.push(path + '/' + this.orgId)
      // },
    },
  }
</script>

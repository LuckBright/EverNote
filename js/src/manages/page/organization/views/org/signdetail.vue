<template>
  <div>
    <ever-bread-crumb :name="type === 'create' ? '创建' : '编辑'" :path="'/manages/org/org'"></ever-bread-crumb>
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
  import { dateFormat, listDestValue } from '@/util/common'
  import {hospitalList} from '@/manages/page/organization/views/staff/model'
  import urlMap from '@/manages/page/organization/utils/urls'
  import {mixin} from '@/manages/page/organization/utils/fns'
  import '@/manages/page/organization/assets/less/index.less'
  const schema = [
    {
      name: 'webOrgCode',
      label: '互联网医疗机构',
      comp: 'select',
      parentClass: 'w',
      props: {
        options: hospitalList
      },
      span: 12,
    },
    {
      name: 'orgCode',
      label: '机构编码',
      props: {
      },
      span: 12,
    },
    {
      name: 'orgName',
      label: '机构名称',
      span: 12,
    },
    {
      name: 'orgLevel',
      label: '级别',
      comp: 'select',
      parentClass: 'w',
      props: {
        options: mixin(['三级', '二级', '一级'], ['甲等', '乙等', '丙等']).map(item => ({id: item, name: item}))
      },
      span: 12,
    },
    {
      name: 'nature',
      label: '性质',
      comp: 'select',
      parentClass: 'w',
      props: {
        options: ['综合医院', '中医医院', '中西医结合医院', '民族医院', '专科医院', '康复医院', '妇幼保健院', '其他'].map(item => ({id: item, name: item}))
      },
      span: 12,
    },
    {
      name: 'orgTel',
      label: '机构联系人电话',
      span: 12,
    },
    {
      name: 'orgPrincipaName',
      label: '机构负责人姓名',
      span: 12,
    },
    {
      name: 'orgPrincipaTel',
      label: '机构负责人电话',
      span: 12,
    },
    {
      name: 'address',
      label: '地址',
      span: 12,
    },
    {
      name: 'orgComment',
      label: '机构简介',
      span: 12,
    },
    {
      name: 'signTime',
      label: '签约时间',
      parentClass: 'w',
      comp: 'date',
      props: {
        type: 'datetime'
      },
      span: 12,
    },
    {
      name: 'signLife',
      label: '签约年限',
      span: 12,
    },
  ]
  const rules = schema.map(item => ({[item.name]: [{required: true, message: '必填项', trigger: 'change'}]})).reduce((p, c) => ({
    ...p, ...c
  }), {})
  export default {
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      return {
        schema,
        form,
        rules,
        orgId: null,
        type: '',
      }
    },
    created () {
      this.type = this.$route.params.type
      this.id = this.$route.params.orgId
      this.search()
    },
    methods: {
      search () {
        request(urlMap.tsOrganizationSignHospital.load, {thcOrgId: this.id}).then(res => {
          if (res.head.errCode === 0) {
            if (res.data) {
              this.form = Object.assign({}, this.form, res.data)
              this.type = 'edit'
            } else {
              this.type = 'create'
            }
          }
        })
      },
      save () {
        const params = Object.assign({}, this.form)
        params.thcOrgId = this.id
        if (params.signTime) {
          params.signTime = dateFormat(params.signTime, 'YYYY-MM-DD hh:mm:ss')
        }
        if (params.webOrgCode) {
          params.webOrgName = listDestValue(hospitalList, params.webOrgCode)
        }
        request(urlMap.tsOrganizationSignHospital[this.type === 'edit' ? 'update' : 'insert'], params).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功')
            this.$router.push({name: 'org-org'})
          }
        })
      },
      // backTo (path) {
      //   this.$router.push(path + '/' + this.orgId)
      // },
    },
  }
</script>

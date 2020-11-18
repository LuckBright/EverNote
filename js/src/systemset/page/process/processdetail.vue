<template>
  <div class="layout_inner">
    <div class="main-head oa">
      <el-row>
        <el-col :span="12">
          <ever-form2
            v-model="queryObj"
            ref="form"
            :schema="querySchema"
            :rules="rules"
            label-width="150px"
          >
            <template slot="default">
              <el-col>
                <el-form-item>
                  <el-button size="small" type="primary" @click="save()">保存</el-button>
                  <el-button size="small" @click="back">返回</el-button>
                </el-form-item>
              </el-col>
            </template>
            <template slot="type">
              <sys-type v-model="queryObj.type" code="THC_SYS_BUSINESS" use-object obj-simple @change="changeType"></sys-type>
            </template>
            <template slot="org">
              <el-cascader
                class="w"
                v-model="queryObj.org"
                :options="orgOptions"
                :props="checkStrictlyProps"
                filterable
                @change="changeOrg"
              ></el-cascader>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { debounce1 as debounce } from '@/util/common'
import { request } from '@/util/req'
import urlMap from '@/systemset/urls'
import orgUrlMap from '@/manages/page/organization/utils/urls'
import { convertListToTree, changeToTreeList } from '@/manages/page/organization/utils/fns'
import storage from '@/util/storage'
const querySchema = [
  {
    name: 'modelKey',
    label: '流程核心Key',
    props: {},
    span: 24
  },
  {
    name: 'processKey',
    label: '业务Key',
    props: {},
    span: 24
  },
  {
    name: 'processName',
    label: '流程名称',
    span: 24
  },
  {
    name: 'secondName',
    label: '流程别名',
    span: 24
  },
  {
    name: 'type',
    label: '流程类型',
    comp: 'custom',
    span: 24
  },
  {
    name: 'org',
    label: '所属机构',
    comp: 'custom',
    span: 24
  },
  {
    name: 'version',
    label: '版本',
    span: 24
  },
  {
    name: 'description',
    label: '描述',
    props: {
      type: 'textarea',
    },
    span: 24,
  },
]
const rules = {
  processKey: { required: true },
  modelKey: { required: true },
  processName: { required: true },
  type: { required: true },
}
export default {
  data: function () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.orgId = ''
    queryObj.orgName = ''
    queryObj.typeCode = ''
    queryObj.typeName = ''
    return {
      querySchema,
      queryObj,
      rules,
      routeId: '',
      rulesTemplateList: [],
      orgOptions: [],
      originOrgList: [],
      checkStrictlyProps: {
        checkStrictly: true,
      },
    }
  },
  created () {
    // 查询机构
    request(orgUrlMap.org.loadWithChildsById, { id: storage.getLocalStorage('TENANTID') }).then(res => {
      if (res.head.errCode === 0) {
        this.originOrgList = res.data.pageList
        this.orgOptions = convertListToTree(changeToTreeList(res.data.pageList))
      }
    })
  },
  methods: {
    save: debounce(function () {
      const newWin = window.open('about:blank', '_blank')
      this.$refs.form.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        request(urlMap.process.insert, {
          ...this.queryObj,
        }).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功')
            newWin.location.href = this.$ever.api + '/process-engine/#/editor/' + res.data
          }
        })
      })
    }, 200),
    back () {
      this.$router.push({ name: 'sysprocesslist' })
    },
    changeType (type) {
      this.queryObj.typeCode = type.code
      this.queryObj.typeName = type.name
    },
    changeOrg (orgIdList) {
      if (orgIdList && orgIdList.length) {
        const org = this.originOrgList.find(item => item._id === orgIdList[orgIdList.length - 1])
        if (org) {
          this.queryObj.orgId = org._id
          this.queryObj.orgName = org.name
        }
      } else {
        this.queryObj.orgId = ''
        this.queryObj.orgName = ''
      }
    },
  },
}
</script>
<style scoped lang="less">
</style>

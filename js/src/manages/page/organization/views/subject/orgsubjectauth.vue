<template>
  <div class="layout_inner">
<!--    把当前登录人能管理的集团科室列出来-->
<!--    把已授权的科室查出来，在页面赋值-->
<!--    点击保存，给需要授权的机构进行科室的授权-->
<!--    给xxx机构批量管理科室，批量设置科室权限-->
<!--    点击保存之后，是否需要直接新增权限数据？关系到回到上一个页面时是否需要刷新数据 【授权完成之后直接新增数据】-->
<!--    点击保存时，有删除，有新增-->
    <div class="main-head">
      <div class="detail-title">给<span>{{org.name}}</span>授权科室</div>
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="default">
          <el-form-item class="fr">
            <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
<!--    集团科室树-->
    <tree-table :tree-props="treeProps" :header-columns="headerColumns" content-class="org-subject-auth-content">
      <template slot-scope="{node, data}">
        <div>{{data.tenantSubjectName}}</div>
        <div class="content-col-code">{{data.tenantSubjectCode}}</div>
        <div class="content-col-manage">
          <el-checkbox :value="data.manage" @change="doCheck(data, $event, 'manage', true)"></el-checkbox>
        </div>
        <div class="content-col-use">
          <el-checkbox :value="data.use" @change="doCheck(data, $event, 'use', false)"></el-checkbox>
        </div>
      </template>
      <template slot="manage">
        <el-checkbox v-model="allRelation" :indeterminate="relationIndeterminate" @change="checkAll('manage', true)"></el-checkbox><span class="ml10">管理权</span>
      </template>
      <template slot="use">
        <el-checkbox v-model="allIndependent" :indeterminate="independentIndeterminate" @change="checkAll('use', false)"></el-checkbox><span class="ml10">使用权</span>
      </template>
    </tree-table>
  </div>
</template>
<script>
  import TreeTable from '@/manages/page/organization/components/tree-table'
  import {request} from '@/util/req'
  import urlMap from '@/manages/page/organization/utils/urls'
  import authTree from '@/manages/page/organization/views/subject/authtree'
  import {convertListToTree, changeToTreeList} from '@/manages/page/organization/utils/fns'
  import '@/manages/page/organization/assets/less/index.less'

  /**
   * 注意：该文件已弃用
   */
  const querySchema = [
    {
      name: 'subjectName',
      label: '科室名称'
    },
    {
      name: 'type',
      label: '类别'
    }
  ]
  export default {
    components: {TreeTable},
    mixins: [authTree],
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        querySchema,
        queryObj,
        treeProps: {
          props: {
            data: [],
            defaultExpandAll: true,
            draggable: true,
            expandOnClickNode: false,
          },
        },
        headerColumns: [
          {
            label: '集团科室名称',
          },
          {
            width: '300px',
            label: '科室编码',
          },
          {
            width: '200px', // 调整宽度时需要将css中对应的宽度调整一下
            slot: 'manage',
          },
          {
            width: '200px', // 调整宽度时需要将css中对应的宽度调整一下
            slot: 'use',
          },
        ],
        orgId: null,
        org: {},
        originSubjectList: [],
        changeProp: {label: 'orgSubjectName', id: 'orgSubjectCode', parentId: 'parentOrgSubjectCode'},
      }
    },
    created () {
      this.orgId = this.$route.params.orgId
      this.searchOrg()
      // 查询所有科室数据
      this.search()
    },
    methods: {
      save () {
        // todo 保存成功之后
        this.$router.push({name: 'org-subject-manage', params: {orgId: this.orgId}})
      },
      searchOrg () {
        request(urlMap.org.load, {id: this.orgId}).then(res => {
          this.org = res.data
        })
      },
      search () {
        request(urlMap.subject.pageList).then(res => {
          this.originSubjectList = res.data.pageList
          this.originTreeList = changeToTreeList(this.originSubjectList, this.changeProp)
          // todo 管理权，使用权 赋值
          this.treeProps.props.data = convertListToTree(this.originTreeList)
        })
      },
      del ({id}) {
        request(urlMap.subject.delete, {id}).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
    },
  }
</script>

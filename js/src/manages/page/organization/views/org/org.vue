<template>
  <div class="layout_inner flex_column_full_hidden">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="default">
          <el-form-item class="fr">
            <span v-if="tsOrganizationDTOList.length" class="danger">机构层级已修改，请点击按钮进行保存</span>
            <el-button v-if="tsOrganizationDTOList.length" type="primary" @click="updateStruct" title="若对机构层级进行了拖拽，请点击该按钮保存，否则不生效">保存机构结构</el-button>
<!--            如果存在机构，则不允许新建 【新建只适用于建第一个机构】-->
<!--            <el-button v-if="!treeProps.props.data.length" type="primary" @click="toPage('create', {_id: '-1'})">新建</el-button>-->
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <tree-table :tree-props="treeProps" :header-columns="headerColumns">
      <template slot-scope="{node, data}">
        <div>{{node.label}}<span class="danger">{{data.status === 'N' ? '(已禁用)' : ''}}</span></div>
        <div class="content-col-code">{{data.code}}</div>
        <div class="content-col-op">
          <el-button type="primary" @click="toPage('createSub', data)">创建子机构</el-button>
          <el-button type="primary" @click="toPage('dept', data)">部门管理</el-button>
          <el-button v-if="data.parentCode !== '0'" type="primary" @click="toPage('subject', data)">科室管理</el-button>
          <el-button type="primary" @click="toPage('edit', data)">编辑</el-button>
          <el-button v-if="isManages()" type="primary" @click="toPage('webh', data)">互联网医院</el-button>
          <el-button v-if="data.parentCode === '0' && isManages()" type="primary" @click="toPage('sign', data)">合作机构</el-button>
<!--          <el-button type="primary" @click="setConfig(data)">诊断配置</el-button>-->
<!--          <ever-confirm class="ml10" v-if="hasDelPermission() && node.isLeaf && data.parentCode !== '0'" :msg="'确定要删除吗？'" @confirm="del(data)"></ever-confirm>-->
        </div>
      </template>
    </tree-table>
  </div>
</template>
<script>
  import TreeTable from '@/manages/page/organization/components/tree-table'
  import {request} from '@/util/req'
  import urlMap from '@/manages/page/organization/utils/urls'
  import {convertListToTree, changeToTreeList, getUpdatedStruct, getSearchId, isManages} from '@/manages/page/organization/utils/fns'
  import '@/manages/page/organization/assets/less/index.less'

  const querySchema = []
  export default {
    components: {TreeTable},
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      const me = this
      return {
        currentOrgInfo: null,
        showConfig: false,
        querySchema,
        queryObj,
        tsOrganizationDTOList: [],
        treeProps: {
          props: {
            data: [],
            defaultExpandAll: true,
            draggable: true,
            expandOnClickNode: false,
            'allow-drag' (node) {
              return node.data.parentCode !== '0'
            },
            'allow-drop' (draggingNode, dropNode, type) {
              return !(dropNode.data.parentCode === '0' && type !== 'inner')
            },
          },
          on: {
            'node-drop' (draggingNode, dropNode, dropType) {
              me.tsOrganizationDTOList = getUpdatedStruct(me.tsOrganizationDTOList, draggingNode, dropNode, dropType, 'parentCode')
              me.$messageTips(me, 'success', '拖拽完成，请点击"保存机构结构"使其生效！')
            }
          },
        },
        headerColumns: [
          {
            label: '机构名称',
          },
          {
            width: '200px',
            label: '机构编码',
          },
          {
            width: '560px', // 调整宽度时需要将css中对应的宽度调整一下
            label: '操作',
          },
        ],
      }
    },
    created () {
      // 查询所有机构数据
      this.search()
    },
    methods: {
      hasDelPermission () {
        // 在不同的页面使用不同的值判断
        return this.$hasPermission('auth_button_manages_org_manages_del') || this.$hasPermission('auth_button_warehouse_org_manages_del')
      },
      closeConfig () {
        this.showConfig = false
      },
      setConfig (data) {
        this.currentOrgInfo = data
        this.showConfig = true
      },
      toPage (type, data) {
        if (type === 'dept') {
          this.$router.push({name: 'org-dept', params: {orgId: data._id}})
        } else if (type === 'subject') {
          this.$router.push({name: 'org-subject-manage', params: {orgId: data._id}})
        } else if (type === 'webh') {
          this.$router.push({name: 'org-org-webh', params: {orgId: data._id, tenantId: data.tenantId}})
        } else if (type === 'sign') {
          this.$router.push({name: 'org-org-sign', params: {orgId: data._id}})
        } else {
          this.$router.push({name: 'org-org-detail', params: {orgId: data._id, type}})
        }
      },
      search () {
        request(urlMap.org.loadWithChildsById, {id: getSearchId()}).then(res => {
          this.treeProps.props.data = convertListToTree(changeToTreeList(res.data.pageList))
        })
      },
      del ({_id}) {
        request(urlMap.org.delete, {id: _id}).then(res => {
          if (res.head.errCode === 0) {
            this.search()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      updateStruct () {
        if (!this.tsOrganizationDTOList.length) {
          this.$messageTips(this, 'error', '请拖拽后执行此操作！')
          return
        }
        request(urlMap.org.updateParentCodeRelationByIds, {tsOrganizationDTOList: this.tsOrganizationDTOList}).then(res => {
          if (res.head.errCode === 0) {
            this.tsOrganizationDTOList = []
            this.search()
            this.$messageTips(this, 'success', '执行成功！')
          }
        })
      },
      isManages () {
        return isManages()
      }
    },
  }
</script>

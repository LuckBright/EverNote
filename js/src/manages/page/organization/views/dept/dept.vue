<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb name="返回" :path="getCrtPath() + '/org/org'" :showTitle="true"></ever-bread-crumb>
    <div class="layout_inner flex_column_full_hidden">
      <div class="main-head">
        <div class="detail-title" v-if="org.name">{{org.name}}</div>
        <ever-form2
          v-model="queryObj"
          ref="form"
          :schema="querySchema"
          :inline="true"
          :is-query="true"
        >
          <template slot="default">
            <el-form-item class="fr">
              <span v-if="tsDepartmentDTOList.length" class="danger">部门层级已修改，请点击按钮进行保存</span>
              <el-button v-if="tsDepartmentDTOList.length" type="primary" @click="updateStruct" title="若对部门层级进行了拖拽，请点击该按钮保存，否则不生效">保存部门结构</el-button>
              <el-button type="primary" @click="toPage('createSub', {parentId: '-1'})">新建</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <tree-table :tree-props="treeProps" :header-columns="headerColumns">
        <template slot-scope="{node, data}">
          <div>{{node.label}}{{data.parentId === '-1' ? '（机构）' : ''}}</div>
          <div class="content-col-code">{{data.deptCode}}</div>
          <div class="content-col-op">
            <el-button type="primary" @click="toPage('createSub', data)">创建子部门</el-button>
            <el-button v-if="data.parentId !== '-1'" type="primary" @click="toPage('edit', data)">编辑</el-button>
<!--            <ever-confirm class="ml10" v-if="data.parentId !== '-1' && node.isLeaf" :msg="'确定要删除吗？'" @confirm="del(data)"></ever-confirm>-->
          </div>
        </template>
      </tree-table>
    </div>
  </div>
</template>
<script>
  import TreeTable from '@/manages/page/organization/components/tree-table'
  import {request} from '@/util/req'
  import urlMap from '@/manages/page/organization/utils/urls'
  import {convertListToTree, changeToTreeList, getUpdatedStruct, getCrtPath} from '@/manages/page/organization/utils/fns'
  import '@/manages/page/organization/assets/less/index.less'

  const querySchema = []
  export default {
    components: {TreeTable},
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      const me = this
      return {
        querySchema,
        queryObj,
        tsDepartmentDTOList: [],
        treeProps: {
          props: {
            data: [],
            defaultExpandAll: true,
            draggable: true,
            expandOnClickNode: false,
            allowDrop (draggingNode, dropNode, type) {
              return !(type !== 'inner' && dropNode.data.parentDeptCode === '-1')
            },
            allowDrag (draggingNode) {
              return draggingNode.data.parentDeptCode !== '-1'
            },
          },
          on: {
            'node-drop' (draggingNode, dropNode, dropType) {
              me.tsDepartmentDTOList = getUpdatedStruct(me.tsDepartmentDTOList, draggingNode, dropNode, dropType, 'parentDeptCode')
              me.$messageTips(me, 'success', '拖拽完成，请点击"保存部门结构"使其生效！')
            }
          },
        },
        headerColumns: [
          {
            label: '部门名称',
          },
          {
            width: '200px',
            label: '部门编码',
          },
          {
            width: '500px',
            label: '操作',
          },
        ],
        org: {},
      }
    },
    created () {
      // 查询当前机构下所有的部门
      this.orgId = this.$route.params.orgId
      this.search()
    },
    methods: {
      toPage (type, data) {
        let deptId = data._id
        if (data.parentId === '0' && type === 'edit') {
          // 编辑一级部门
          type = 'editParent'
        } else if (data.parentId === '-1') {
          // 新增一级部门
          deptId = '-1'
        }
        this.$router.push({name: 'org-dept-detail', params: {orgId: this.orgId, deptId, type}})
      },
      search () {
        // 先将机构信息查询出来
        request(urlMap.org.load, {id: this.orgId}).then(res => {
          if (res.head.errCode === 0) {
            this.org = res.data
            // const org = res.data
            // 将org打扮成dept的样子
            // const orgDept = {
            //   deptCode: '0', // 作为根节点
            //   parentDeptCode: '-1', // 作为根节点
            //   deptName: org.name,
            //   id: org.id,
            // }
            // 再查询机构下的部门信息
            request(urlMap.dept.pageList, {orgId: this.orgId}).then(resp => {
              // 将机构作为部门树的根节点显示
              // this.treeProps.props.data = convertListToTree(changeToTreeList([orgDept, ...resp.data.pageList], {label: 'deptName', id: 'deptCode', parentId: 'parentDeptCode'}))
              this.treeProps.props.data = convertListToTree(changeToTreeList(resp.data.pageList, {label: 'deptName', id: 'deptCode', parentId: 'parentDeptCode'}))
            })
          }
        })
      },
      del ({_id}) {
        request(urlMap.dept.delete, {id: _id}).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功')
            this.search()
          }
        })
      },
      updateStruct () {
        if (!this.tsDepartmentDTOList.length) {
          this.$messageTips(this, 'error', '请拖拽后执行此操作！')
          return
        }
        request(urlMap.org.updateParentCodeRelationByIds, {tsDepartmentDTOList: this.tsDepartmentDTOList}).then(res => {
          if (res.head.errCode === 0) {
            this.tsDepartmentDTOList = []
            this.search()
            this.$messageTips(this, 'success', '执行成功！')
          }
        })
      },
      getCrtPath () {
        return getCrtPath()
      },
    },
  }
</script>

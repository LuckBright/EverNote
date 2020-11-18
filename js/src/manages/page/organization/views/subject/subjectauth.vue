<template>
  <div class="layout_inner flex_column_full_hidden">
    <div class="main-head">
      <el-row>
        <el-col :span="24">
          <ever-form2
            v-model="queryObj"
            ref="form"
            :schema="querySchema"
            :inline="true"
            :is-query="true"
          >
            <template slot="default">
              <el-form-item class="fr">
                <el-checkbox v-model="isOrgMain" @change="changeOrgMain">以机构为主</el-checkbox>
                <span v-if="changedList.length" class="danger ml10">权限已更改 {{changedList.length}} 条，请点击按钮进行保存</span>
                <el-button class="ml10" type="primary" @click="saveAuth" title="若对权限进行了更改，请点击该按钮保存，否则不生效">保存权限更改</el-button>
              </el-form-item>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20" class="flex-row">
      <el-col :span="10">
<!--        科室树-->
        <tree-table v-if="!isOrgMain" :key="subjectTreeKey" ref="subjectTree" :tree-props="subjectTreeProps" :header-columns="headerColumns" content-class="subject-auth-content">
          <template slot-scope="{node, data}">
            <div class="subject-name-ellipsis"><span>{{data.tenantSubjectName}}</span><span class="danger status-position">{{data.status === 'N' ? '(已禁用)' : ''}}</span></div>
            <div class="content-col-type">{{data.type1Name}}</div>
            <div class="content-col-cat">{{data.type2Name}}</div>
            <div class="content-col-op">
              <el-button type="primary" @click="toPage('subject', 'edit', data)">{{isConfig ? '查看' : '编辑'}}</el-button>
            </div>
          </template>
        </tree-table>
        <tree-table v-else :key="orgTreeKey" ref="orgTree" :tree-props="orgTreeProps" :header-columns="orgTreeHeaderColumns" content-class="subject-auth-content">
          <template slot-scope="{node, data}">
            <div>{{data.name}}</div>
            <div class="content-col-op">
              <el-button type="primary" @click="toPage('org', 'edit', data)">编辑</el-button>
            </div>
          </template>
        </tree-table>
      </el-col>
      <el-col :span="14">
<!--        机构树-->
        <tree-table v-show="hasData" :tree-props="treeProps" :header-columns="orgHeaderColumns" :content-class="contentClass">
          <template slot-scope="{node, data}">
            <div>{{node.label}}</div>
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import TreeTable from '@/manages/page/organization/components/tree-table'
  import {request} from '@/util/req'
  import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
  import urlMap from '@/manages/page/organization/utils/urls'
  import authTree from '@/manages/page/organization/views/subject/authtree'
  import {convertListToTree, changeToTreeList, getSearchId, isWarehouse, getNodeByName} from '@/manages/page/organization/utils/fns'
  import '@/manages/page/organization/assets/less/index.less'
  import configUrlMap from '@/manages/page/configure/urls'
  import {debounce1 as debounce} from '@/util/common'

  const querySchema = [
    {
      name: 'name',
      label: '科室名称',
    },
  ]
  export default {
    components: {TreeTable},
    mixins: [authTree],
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      const me = this
      return {
        isOrgMain: false,
        querySchema,
        queryObj,
        crtOrg: null,
        crtSubject: null,
        subjectTreeKey: U(),
        orgTreeKey: U(),
        // isAutoSave: false,
        subjectTreeProps: {
          props: {
            data: [],
            defaultExpandAll: true,
            draggable: false,
            expandOnClickNode: false,
            highlightCurrent: true,
            filterNodeMethod (value, data) {
              if (!value) return true
              return data.orgSubjectName.includes(value)
            }
          },
          on: {
            'node-click' (data) {
              me.clickSubjectNode.bind(me)(data)
              // if (me.changedList.length) {
              //   me.$messageTips(me, 'success', '切换时未保存，已取消选中的修改')
              // }
              // me.changedList = []
              // me.crtSubject = data
              // me.searchOrg()
            },
          },
        },
        // 切换为以 org 为主之后的左侧机构树属性
        orgTreeProps: {
          props: {
            data: [],
            defaultExpandAll: true,
            draggable: false,
            expandOnClickNode: false,
            highlightCurrent: true,
            filterNodeMethod (value, data) {
              if (!value) return true
              return data.name.includes(value)
            }
          },
          on: {
            'node-click' (data) {
              me.clickOrgNode.bind(me)(data)
              // if (me.changedList.length) {
              //   me.$messageTips(me, 'success', '切换时未保存，已取消选中的修改')
              // }
              // me.changedList = []
              // me.crtOrg = data
              // me.searchSubject()
            },
          },
        },
        headerColumns: [
          {
            label: '集团科室名称',
          },
          {
            width: '100px',
            label: '科室类别',
          },
          {
            width: '100px',
            label: '临床类别',
          },
          {
            width: '80px', // 调整宽度时需要将css中对应的宽度调整一下
            label: '操作',
          },
        ],
        orgTreeHeaderColumns: [
          {
            label: '机构名称',
          },
          {
            width: '80px', // 调整宽度时需要将css中对应的宽度调整一下
            label: '操作',
          },
        ],
        treeProps: {
          props: {
            data: [],
            defaultExpandAll: true,
            draggable: true,
            expandOnClickNode: false,
          },
        },
        orgHeaderColumns: [
          {
            prop: 'name',
            label: '机构名称',
          },
          {
            width: '80px', // 调整宽度时需要将css中对应的宽度调整一下
            slot: 'manage',
          },
          {
            width: '80px', // 调整宽度时需要将css中对应的宽度调整一下
            slot: 'use',
          },
        ],
        contentClass: 'subject-org-content',
        originList: [],
        originSubjectList: [],
        originOrgList: [],
        changeProp: {label: 'orgSubjectName', id: 'orgSubjectCode', parentId: 'parentOrgSubjectCode'},
        tenantSubjectList: null,
        orgList: null,
        isConfig: false,
        hasData: true,
      }
    },
    created () {
      this.isOrgMain = this.$route.query.isOrgMain === '1'
      this.changeHeaderAndSearch()
      if (isWarehouse()) {
        // 在机构设置工作站下：判断是否集中管控，若是集中管控，则隐藏新建按钮
        request(configUrlMap.list).then(res => {
          // 参照 @/util/warehouseconfig
          this.isConfig = (res.data.find(item => item.type === 106) || {}).isConfig === 1
        })
      } else {
        this.isConfig = false
      }
    },
    watch: {
      // isOrgMain (val) {
      //   if (val && this.changedList && this.changedList.length) {
      //     // 若已经改变了权限，则不允许切换成自动保存，需要先进行保存才可以
      //     this.$messageTips(this, 'error', '请先保存更改之后再进行切换')
      //     this.isOrgMain = false
      //   }
      // },
      'queryObj.name' (val) {
        this.$router.replace({
          query: {...this.$route.query, name: val}
        })
        if (this.isOrgMain && this.$refs.orgTree) {
          this.$refs.orgTree.$refs.tree.filter(val)
          const me = this
          debounce(function () {
            // const searchedData = me.orgList.find(item => item.name.includes(val))
            const searchedData = getNodeByName(convertListToTree(changeToTreeList(JSON.parse(JSON.stringify(me.orgList)))), val)
            if (searchedData) {
              me.$refs.orgTree.$refs.tree.setCurrentKey(searchedData.code)
              me.clickOrgNode(searchedData)
              me.hasData = true
            } else {
              me.hasData = false
            }
          }, 500)()
        } else if (this.$refs.subjectTree) {
          this.$refs.subjectTree.$refs.tree.filter(val)
          const me = this
          debounce(function () {
            // 匹配的数据
            const searchedData = getNodeByName(convertListToTree(changeToTreeList(JSON.parse(JSON.stringify(me.tenantSubjectList)), me.changeProp)), val, 'orgSubjectName')
            if (searchedData) {
              me.$refs.subjectTree.$refs.tree.setCurrentKey(searchedData.orgSubjectCode)
              me.clickSubjectNode(searchedData)
              me.hasData = true
            } else {
              me.hasData = false
            }
          }, 500)()
        }
      },
    },
    methods: {
      saveUrlParams (id, refs = 'subjectTree') {
        this.$router.replace({query: {
          ...this.$route.query,
          crtId: id,
          scroll: this.$refs[refs].$el.querySelector('.tree-table').scrollTop + '',
        }})
      },
      clickSubjectNode (data) {
        // 将当前点击的数据保存在url上
        this.saveUrlParams(data._id)
        if (this.changedList.length) {
          this.$messageTips(this, 'success', '切换时未保存，已取消选中的修改')
        }
        this.changedList = []
        this.crtSubject = data
        this.searchOrg()
      },
      clickOrgNode (data) {
        // 将当前点击的数据保存在url上
        this.saveUrlParams(data._id, 'orgTree')
        if (this.changedList.length) {
          this.$messageTips(this, 'success', '切换时未保存，已取消选中的修改')
        }
        this.changedList = []
        this.crtOrg = data
        this.searchSubject()
      },
      changeOrgMain () {
        if (this.changedList && this.changedList.length) {
          // 若已经改变了权限，则不允许切换成自动保存，需要先进行保存才可以
          this.$messageTips(this, 'error', '请先保存更改之后再进行切换')
          this.isOrgMain = !this.isOrgMain
        } else {
          this.$router.replace({
            query: {...this.$route.query, isOrgMain: this.isOrgMain ? '1' : '0'}
          })
          this.changeHeaderAndSearch()
        }
      },
      changeHeaderAndSearch () {
        this.orgTreeKey = U()
        this.subjectTreeKey = U()
        this.queryObj.name = ''
        if (this.isOrgMain) {
          this.orgHeaderColumns.find(item => item.prop === 'name').label = '集团科室名称'
          this.querySchema = [{name: 'name', label: '机构名称'}]
          this.searchLeftOrg()
        } else {
          this.orgHeaderColumns.find(item => item.prop === 'name').label = '机构名称'
          this.querySchema = [{name: 'name', label: '科室名称'}]
          this.search()
        }
      },
      toPage (treeType, type, data) {
        if (treeType === 'subject') {
          if (type === 'edit') {
            this.saveUrlParams(data._id)
            this.$router.push({ name: 'org-subject-detail', params: { subjectId: data._id, type, from: '2', orgId: '-1', isTenant: '1' } })
          }
        } else if (treeType === 'org') {
          if (type === 'edit') {
            this.$router.push({ name: 'org-org-detail', params: { orgId: data._id, type, from: '2' } })
          }
        }
      },
      getTenantSubject (cb) {
        if (this.tenantSubjectList) {
          cb()
        } else {
          request(urlMap.subject.loadTenantSubjectListByOrgId, {
            orgId: getSearchId(),
            orgManageTenantSubjectPermission: '1',
          }).then(res => {
            // 过滤掉禁用的
            this.tenantSubjectList = res.data.pageList.map(item => ({...item, disabled: item.status === 'N'}))
            cb()
          })
        }
      },
      getOrgList (cb) {
        if (this.orgList) {
          cb()
        } else {
          request(urlMap.org.loadWithChildsById, {id: getSearchId()}).then(res => {
            this.orgList = res.data.pageList
            cb()
          })
        }
      },
      search () {
        this.getTenantSubject(() => {
          this.subjectTreeProps.props.data = convertListToTree(changeToTreeList(JSON.parse(JSON.stringify(this.tenantSubjectList)), this.changeProp))
          // 根据查询参数获取当前的科室
          if (!this.isOrgMain) {
            const crtId = this.$route.query.crtId
            if (crtId) {
              this.$nextTick(() => {
                this.$refs.subjectTree.$refs.tree.setCurrentKey(crtId)
                const node = this.$refs.subjectTree.$refs.tree.getNode(crtId)
                if (node) {
                  this.crtSubject = node.data
                }
                if (this.$refs.subjectTree.$el.querySelector('.tree-table')) {
                  this.$refs.subjectTree.$el.querySelector('.tree-table').scrollTop = Number.parseFloat(this.$route.query.scroll || '0')
                }
              })
            } else {
              if (!this.crtSubject) {
                this.crtSubject = this.subjectTreeProps.props.data[0]
              }
              if (!this.crtSubject) {
                return
              }
              // 将当前点击的数据保存在url上
              this.saveUrlParams(this.crtSubject._id)
              // todo 高亮当前行
              this.$nextTick(() => {
                this.$refs.subjectTree.$refs.tree.setCurrentKey(this.crtSubject.orgSubjectCode)
                if (this.$refs.subjectTree.$el.querySelector('.tree-table')) {
                  this.$refs.subjectTree.$el.querySelector('.tree-table').scrollTop = Number.parseFloat(this.$route.query.scroll || '0')
                }
              })
            }
          }
          // 查询当前登录人拥有权限的所有机构
          this.searchOrg()
        })
      },
      searchOrg () {
        this.getOrgList(() => {
          request(urlMap.tsOrganizationTenantSubjectPermission.loadByTenantSubjectCode, {tenantSubjectCode: this.crtSubject.tenantSubjectCode}).then(resp => {
            this.operateAuthTree(JSON.parse(JSON.stringify(this.orgList)), resp)
          })
        })
      },
      operateAuthTree (rightList, resp) {
        // 通过科室code查出来的权限列表
        const permissionList = resp.data.pageList
        const list = rightList.map(item => {
          const permissionObj = {
            manage: false,
            use: false,
          }
          const permission = permissionList.find(p => this.isOrgMain ? p.tenantSubjectCode === item.tenantSubjectCode : p.orgId === item.id)
          if (permission) {
            if (permission.orgManageTenantSubjectPermission === '1') {
              permissionObj.manage = true
            }
            if (permission.orgUseTenantSubjectPermission === '1') {
              permissionObj.use = true
            }
          }
          // let changedPermission = null
          // if (this.changedList && this.changedList.length) {
          //   changedPermission = this.changedList.find(p => this.isOrgMain ? p.tenantSubjectCode === item.tenantSubjectCode : p.orgId === item.id)
          // }
          // if (changedPermission) {
          //   permissionObj.manage = changedPermission.orgManageTenantSubjectPermission === '1'
          //   permissionObj.use = changedPermission.orgUseTenantSubjectPermission === '1'
          // }
          return {...item, ...permissionObj}
        })
        this.originList = JSON.parse(JSON.stringify(list))
        this.originTreeList = changeToTreeList(list, this.isOrgMain ? this.changeProp : {})
        // todo 给all checkbox 赋值
        this.allRelation = this.originTreeList.length && this.originTreeList.every(item => !!item.manage)
        const allUn = this.originTreeList.length && this.originTreeList.every(item => !item.manage)
        this.relationIndeterminate = !!this.originTreeList.length && !this.allRelation && !allUn
        this.allIndependent = this.originTreeList.length && this.originTreeList.every(item => !!item.use)
        const allUnIndependent = this.originTreeList.length && this.originTreeList.every(item => !item.use)
        this.independentIndeterminate = !!this.originTreeList.length && !this.allIndependent && !allUnIndependent
        this.treeProps.props.data = convertListToTree(this.originTreeList)
      },
      // 点击左侧机构之后查询右侧科室
      searchSubject () {
        this.getTenantSubject(() => {
          // 查询当前科室的权限信息
          request(urlMap.tsOrganizationTenantSubjectPermission.loadByOrgId, {orgId: this.crtOrg._id}).then(resp => {
            this.operateAuthTree(JSON.parse(JSON.stringify(this.tenantSubjectList)), resp)
          })
        })
      },
      // 查询左侧的机构列表
      searchLeftOrg () {
        this.getOrgList(() => {
          this.orgTreeProps.props.data = convertListToTree(changeToTreeList(JSON.parse(JSON.stringify(this.orgList))))
          if (!this.crtOrg) {
            this.crtOrg = this.orgTreeProps.props.data[0]
          }
          // todo 高亮当前行
          this.$nextTick(() => {
            this.$refs.orgTree.$refs.tree.setCurrentKey(this.crtOrg.code)
          })
          this.searchSubject()
        })
      },
      del ({id}) {
        request(urlMap.subject.delete, {id}).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      saveAuth () {
        if (this.changedList && this.changedList.length) {
          request(urlMap.tsOrganizationTenantSubjectPermission.insertList, {
            tsOrganizationTenantSubjectPermissionDTOList: this.changedList
          }).then(res => {
            if (res.head.errCode === 0) {
              // 重置改变过的项
              this.changedList = []
              // 重新查询数据
              this.changeHeaderAndSearch()
              this.$messageTips(this, 'success', '权限已经更改成功')
            }
          })
        } else {
          this.$messageTips(this, 'error', '请改变权限之后再点击此按钮')
        }
      },
      getChangedList () {
        this.changedList = []
        for (let i = 0; i < this.originTreeList.length; i++) {
          const newItem = this.originTreeList[i]
          const oldItem = this.originList[i]
          if (newItem.manage !== oldItem.manage || newItem.use !== oldItem.use) {
            this.changedList.push({
              orgManageTenantSubjectPermission: newItem.manage ? '1' : '0',
              orgUseTenantSubjectPermission: newItem.use ? '1' : '0',
              ...(this.isOrgMain ? {
                orgId: this.crtOrg._id,
                tenantSubjectCode: newItem.tenantSubjectCode,
                tenantSubjectName: newItem.tenantSubjectName,
                nationSubjectCode: newItem.nationSubjectCode,
                nationSubjectName: newItem.nationSubjectName,
                type1Code: newItem.type1Code,
                type1Name: newItem.type1Name,
                type2Code: newItem.type2Code,
                type2Name: newItem.type2Name,
              } : {
                orgId: newItem._id,
                tenantSubjectCode: this.crtSubject.orgSubjectCode,
                tenantSubjectName: this.crtSubject.orgSubjectName,
                nationSubjectCode: this.crtSubject.nationSubjectCode,
                nationSubjectName: this.crtSubject.nationSubjectName,
                type1Code: this.crtSubject.type1Code,
                type1Name: this.crtSubject.type1Name,
                type2Code: this.crtSubject.type2Code,
                type2Name: this.crtSubject.type2Name,
              })
            })
          }
        }
      },
    },
  }
</script>
<style scoped lang="less">
  /*.status-position {*/
  /*  position: absolute;*/
  /*  left: 40%;*/
  /*  margin-left: 20px;*/
  /*}*/
</style>


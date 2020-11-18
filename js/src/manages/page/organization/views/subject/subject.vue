<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb v-if="isOrg && !isWarehouseMenu" name="返回"></ever-bread-crumb>
    <div class="layout_inner flex_column_full_hidden">
      <div class="main-head">
        <div class="detail-title" v-if="isOrg">{{org.name}}</div>
        <ever-form2
          v-model="queryObj"
          ref="form"
          :schema="querySchema"
          :inline="true"
          :is-query="true"
        >
          <template slot="default">
            <el-form-item class="fr">
              <span v-if="tsOrganizationSubjectDTOList.length" class="danger">科室层级已修改，请点击按钮进行保存</span>
              <el-button v-if="tsOrganizationSubjectDTOList.length" type="primary" @click="updateStruct" title="若对科室层级进行了拖拽，请点击该按钮保存，否则不生效">保存科室结构</el-button>
<!--              <el-button v-if="isOrg && !isConfig" type="primary" @click="toPage('dialog-subject')">导入集团科室</el-button>-->
              <el-button v-if="!isConfig" type="primary" @click="toPage('create')">新建</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <tree-table ref="subjectTree" :tree-props="treeProps" :header-columns="headerColumns" content-class="org-subject-content">
        <template slot-scope="{node, data}">
          <div v-if="isOrg">{{data.orgSubjectName}}</div>
          <div :class="{'content-col-tenant': isOrg}">{{data.tenantSubjectName}}<span class="danger">{{data.tenantStatus === 'N' ? '(已禁用)' : ''}}</span></div>
          <div class="content-col-code">{{isOrg ? data.orgSubjectCode : data.tenantSubjectCode}}</div>
          <div class="content-col-type">{{data.type1Name}}</div>
          <div class="content-col-cat">{{data.type2Name}}</div>
          <div class="content-col-op">
            <el-button v-if="!isConfig" type="primary" @click="toPage('createSub', data)">创建子科室</el-button>
            <el-button type="primary" @click="toPage('edit', data)">{{isConfig ? '查看' : '编辑'}}</el-button>
            <el-button type="primary" @click="showEwm(data)">签到二维码</el-button>
<!--            <ever-confirm class="ml10" v-if="hasDelPermission() && node.isLeaf && !isConfig" :msg="'确定要删除吗？'" @confirm="del(data)"></ever-confirm>-->
          </div>
        </template>
      </tree-table>
      <el-dialog :visible.sync="qrVisible" width="320px" title="签到二维码" custom-class="subject-qr">
        <qrcode :value="qrCode" :options="qrcodeOptions" tag="img"></qrcode>
        <p class="tac">方便患者来院自助完成签到</p>
      </el-dialog>
<!--      <el-dialog :visible.sync="dialog" width="30%" custom-class="add-subject">-->
<!--        <template slot="title">-->
<!--          <div>-->
<!--            <span class="mr20">导入集团科室</span>-->
<!--            &lt;!&ndash;          <el-checkbox v-model="unCheckStrictly" @change="changeCheckStrictly">是否级联科室</el-checkbox>&ndash;&gt;-->
<!--          </div>-->
<!--        </template>-->
<!--        <el-tree-->
<!--          ref="addSubject"-->
<!--          class="dialog-subject-tree"-->
<!--          :data="subjectData"-->
<!--          show-checkbox-->
<!--          :check-strictly="true"-->
<!--          node-key="id"-->
<!--          default-expand-all-->
<!--          :default-checked-keys="defaultCheckedSubjectKeys"-->
<!--          :expand-on-click-node="false"-->
<!--          empty-text="请先到【集团科室-集团科室授权】菜单下做授权操作"-->
<!--        ></el-tree>-->
<!--        <template slot="footer">-->
<!--          <div>-->
<!--            <el-button @click="cancelDialog">取消</el-button>-->
<!--            <el-button @click="submitDialog" type="primary">确定</el-button>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-dialog>-->
    </div>
  </div>
</template>
<script>
  import TreeTable from '@/manages/page/organization/components/tree-table'
  import {request} from '@/util/req'
  import storage from '@/util/storage'
  import urlMap from '@/manages/page/organization/utils/urls'
  import {convertListToTree, changeToTreeList, getUpdatedStruct, getObjNoTreeFields, getCrtPath, isWarehouse} from '@/manages/page/organization/utils/fns'
  import configUrlMap from '@/manages/page/configure/urls'
  import '@/manages/page/organization/assets/less/index.less'

  const querySchema = [
    {
      name: 'subjectName',
      label: '科室名称'
    },
    // {
    //   name: 'type',
    //   label: '类别'
    // }
  ]
  export default {
    components: {TreeTable},
    props: {
      subjectOrgId: String,
    },
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      const me = this
      return {
        qrCode: '',
        qrVisible: false,
        qrcodeOptions: {
          errorCorrectionLevel: 'H',
          type: 'image/jpeg',
          rendererOpts: {
            quality: 0.9
          },
          width: 300
        },
        querySchema,
        queryObj,
        treeProps: {
          props: {
            data: [],
            defaultExpandAll: true,
            draggable: true,
            expandOnClickNode: false,
            filterNodeMethod (value, data) {
              if (!value) return true
              return data.orgSubjectName.includes(value)
            }
          },
          on: {
            'node-drop' (draggingNode, dropNode, dropType) {
              me.tsOrganizationSubjectDTOList = getUpdatedStruct(me.tsOrganizationSubjectDTOList, draggingNode, dropNode, dropType, 'parentOrgSubjectCode')
              me.$messageTips(me, 'success', '拖拽完成，请点击"保存科室结构"使其生效！')
            }
          },
        },
        headerColumns: [],
        originHeaderColumns: [
          {
            label: '机构科室名称',
          },
          {
            label: '集团科室名称',
          },
          {
            prop: 'code',
            width: '200px',
            label: '科室编码',
          },
          {
            width: '80px',
            label: '科室类别',
          },
          {
            width: '80px',
            label: '临床类别',
          },
          {
            width: '300px', // 调整宽度时需要将css中对应的宽度调整一下
            label: '操作',
          },
        ],
        isTenant: true,
        isOrg: true,
        dialog: false,
        org: {},
        // unCheckStrictly: true,
        originSubjectData: [], // 弹窗中的科室原始数据
        subjectData: [], // 弹窗中的科室数据
        defaultCheckedSubjectKeys: [], // 弹窗中选中的科室数据
        tsOrganizationSubjectDTOList: [], // 调整了顺序的科室
        isTenantStr: '1',
        checkedSubjectList: [],
        originSubjectList: [], // 机构科室的原始数据
        orgId: null,
        tenantId: null,
        isConfig: false,
        isWarehouseMenu: false,
      }
    },
    created () {
      this.tenantId = storage.getLocalStorage('TENANTID')
      this.tsOrganizationSubjectDTOList = []
      this.initData()
      this.isWarehouseMenu = isWarehouse()
      if (isWarehouse()) {
        // 在机构设置工作站下：判断是否集中管控，若是集中管控，则隐藏新建按钮
        request(configUrlMap.list).then(res => {
          // 参照 @/util/warehouseconfig
          this.isConfig = (res.data.find(item => item.type === 106) || {}).isConfig === 1
          if (this.isConfig) {
            this.treeProps.props.draggable = false
          }
        })
      } else {
        this.isConfig = false
      }
    },
    watch: {
      '$route.params.orgId' () {
        this.initData()
      },
      'queryObj.subjectName' (val) {
        this.$refs.subjectTree.$refs.tree.filter(val)
      },
    },
    methods: {
      hasDelPermission () {
        // 在不同的页面使用不同的值判断
        return this.$hasPermission('auth_button_warehouse_subject_manages_del') || this.$hasPermission('auth_button_manages_subject_manages_del')
      },
      getCheckedSubject () {
        this.checkedSubjectList = this.$refs.addSubject.getCheckedNodes().filter(item => !item.disabled)
      },
      // changeCheckStrictly () {
      //   this.getCheckedSubject()
      //   if (this.checkedSubjectList.length) {
      //     this.unCheckStrictly = !this.unCheckStrictly
      //     this.$messageTips(this, 'success', '请取消所有勾选之后再切换是否级联')
      //   }
      // },
      /* 查询当前机构能够使用的集团科室的信息列表 */
      searchTenantSubject () {
        request(urlMap.subject.loadTenantSubjectListByOrgId, {
          orgId: this.tenantId,
          // orgUseTenantSubjectPermission: '1',
        }).then(res => {
          this.originSubjectData = res.data.pageList
          // 查询所有科室数据
          this.search(true)
          // 将已经选中的数据设置为禁用状态
          // this.originSubjectData.forEach(item => {
          //   if (this.defaultCheckedSubjectKeys.some(key => key === item.tenantSubjectCode)) {
          //     item.disabled = true
          //   }
          // })
          // this.subjectData = convertListToTree(changeToTreeList(res.data.pageList, {label: 'tenantSubjectName', id: 'orgSubjectCode', parentId: 'parentOrgSubjectCode'}))
        })
      },
      initData () {
        // orgId 没有orgId 则表示集团学科专业的管理，有orgId，则表示机构学科专业的管理
        this.orgId = this.subjectOrgId || this.$route.params.orgId || '-1'
        this.isTenant = this.orgId === '-1'
        this.isOrg = !this.isTenant
        if (this.isTenant) {
          this.headerColumns = [...this.originHeaderColumns.slice(1)]
          const tenant = this.headerColumns.find(item => item.label === '集团科室名称')
          const code = this.headerColumns.find(item => item.prop === 'code')
          if (code) {
            code.label = '集团科室编码'
          }
          if (tenant) {
            tenant.width = ''
          }
          this.isTenantStr = '1'
          this.orgId = this.tenantId
        } else {
          this.searchOrg()
          this.isTenantStr = '0'
          this.headerColumns = [...this.originHeaderColumns]
          this.headerColumns.find(item => item.label === '集团科室名称').width = '300px'
          const code = this.headerColumns.find(item => item.prop === 'code')
          if (code) {
            code.label = '机构科室编码'
          }
        }
        this.searchTenantSubject()
      },
      toPage (type, data) {
        if (type === 'edit') {
          if (data.parentId === '0') {
            type = 'editParent'
          }
          // 记住当前编辑的是哪条数据，并记住滚动条的位置，编辑完成之后，需要高亮此数据
          this.$router.replace({query: {
            crtId: data._id,
            scroll: this.$refs.subjectTree.$el.querySelector('.tree-table').scrollTop + ''
          }})
          this.$router.push({name: 'org-subject-detail', params: {subjectId: data._id, orgId: this.orgId, type, isTenant: this.isTenantStr}})
        } else if (type === 'createSub' || type === 'create') {
          let subjectId = '-1'
          if (type === 'createSub') {
            subjectId = data._id
          }
          this.$router.push({name: 'org-subject-detail', params: {subjectId, orgId: this.orgId, type, isTenant: this.isTenantStr}})
        } else if (type === 'subject') {
          // 批量管理科室 管理的是权限和数据
          // this.$router.push({name: 'org-subject-auth', params: {orgId: this.orgId}})
        } else if (type === 'dialog-subject') {
          this.dialog = true
        }
      },
      searchOrg () {
        request(urlMap.org.load, {id: this.orgId}).then(res => {
          this.org = res.data
        })
      },
      search (isInit = false) {
        request(urlMap.subject.loadOrgSubjectListByOrgId, {orgId: this.orgId}).then(res => {
          // 将集团科室中的科室状态合并到机构科室列表中
          const list = res.data.pageList.map(item => {
            const tenantStatusItem = this.originSubjectData.find(s => s.tenantSubjectCode === item.tenantSubjectCode)
            if (tenantStatusItem) {
              return {
                ...item,
                tenantStatus: tenantStatusItem.status,
              }
            } else {
              return item
            }
          })
          this.originSubjectList = list
          this.defaultCheckedSubjectKeys = this.originSubjectList.map(item => item.tenantSubjectCode)
          this.treeProps.props.data = convertListToTree(changeToTreeList(list, {label: 'orgSubjectName', id: 'orgSubjectCode', parentId: 'parentOrgSubjectCode'}))
          // 查询弹窗中的科室数据
          // this.searchTenantSubject()
          // 当初始化页面时，高亮上次选中的数据
          if (isInit) {
            const crtId = this.$route.query.crtId
            if (crtId) {
              this.$nextTick(() => {
                // 高亮当前行 并滚动到行所在的位置
                this.$refs.subjectTree.$refs.tree.setCurrentKey(crtId)
                if (this.$refs.subjectTree.$el.querySelector('.tree-table')) {
                  this.$refs.subjectTree.$el.querySelector('.tree-table').scrollTop = Number.parseFloat(this.$route.query.scroll || '0')
                }
              })
            }
          }
        })
      },
      del ({_id}) {
        request(urlMap.subject.delete, {id: _id}).then(res => {
          if (res.head.errCode === 0) {
            this.search()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      cancelDialog () {
        this.dialog = false
      },
      // 导入集团科室
      submitDialog () {
        this.getCheckedSubject()
        if (this.checkedSubjectList.length) {
          // todo 将所有根节点的 parentCode 设置为 0
          const tempTreeData = convertListToTree(this.checkedSubjectList)
          request(urlMap.subject.insertList, {
            tsOrganizationSubjectDTOList: this.checkedSubjectList
              .map(item => {
                const itemData = tempTreeData.find(temp => temp._id === item._id)
                if (itemData) {
                  item.parentOrgSubjectCode = '0'
                }
                return item
              })
              .map(item => ({...getObjNoTreeFields(item), orgId: this.orgId})),
          }).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功')
              this.search()
              this.dialog = false
            }
          })
        } else {
          this.dialog = false
        }
      },
      updateStruct () {
        if (!this.tsOrganizationSubjectDTOList.length) {
          this.$messageTips(this, 'error', '请拖拽后执行此操作！')
          return
        }
        request(urlMap.subject.updateParentOrgSubjectCodeRelationByIds, {tsOrganizationSubjectDTOList: this.tsOrganizationSubjectDTOList}).then(res => {
          if (res.head.errCode === 0) {
            this.tsOrganizationSubjectDTOList = []
            this.search()
            this.$messageTips(this, 'success', '执行成功！')
          }
        })
      },
      getCrtPath () {
        return getCrtPath()
      },
      showEwm (data) {
        this.qrVisible = true
        this.qrCode = JSON.stringify({orgId: storage.getStorageByClinic('CLINICID'), tenantDeptId: data.tenantSubjectCode})
      }
    },
  }
</script>

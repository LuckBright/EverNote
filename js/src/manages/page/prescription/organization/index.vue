<template>
  <div class="organization">
    <div class="organ-header">
      <h1 class="title">{{name}}关联机构</h1>
    </div>
    <!-- <div class="btn-box">
      <el-button
        class="operate-btn"
        v-if="clinicType !== '0' && !$route.query.type"
        :disabled="!serviceId"
        type="primary"
        @click="save"
      >确认更新</el-button>
      <el-button v-if="false" class="config-btn operate-btn" type="primary" plain>管理字段配置</el-button>
    </div> -->
    <!-- 机构树列表 -->
    <relevance-table
      switchProp="switchDisable"
      :ctrl-switchs="ctrlSwitchs"
      :data="treeData"
      :columns="columns"
      :loading="loadData"
      :rowClassName="handleRowClass"
      :cell-class-name="handleCellClass"
      :handle-check-all-change="handleCheckAllChange"
    ></relevance-table>
    <!-- 科室选择 -->
    <correlation-dialog
      ref="correlation"
      :dialog-show.sync="correlationShow"
      @add="changeOrgService"
    ></correlation-dialog>
  </div>
</template>
<script>
import treeTableComponent from '@/manages/components/treetable'
import treeTable from '@/util/treetable.js'
import relevanceTable from '@/manages/components/relevance.table/index.vue'
import columns from './columns'
import correlationDialog from './correlation.dialog.vue'
import api from '../managesapi'
export default {
  components: {
    treeTableComponent,
    relevanceTable,
    correlationDialog
  },
  mixins: [treeTable],
  props: {
    serviceId: {
      type: String,
      default: ''
    },
    routeType: {
      /**
       * prescription - 医嘱项管理
       * stack - 组套管理
       */
      type: String,
      default: 'prescription'
    }
  },
  data () {
    return {
      treeData: [],
      columns: [],
      correlationShow: false,
      loadData: false,
      ctrlSwitchs: ['managerPermission', 'usePermission'],
      ctrlSwitchStatus: {
        managerPermission: false,
        usePermission: false
      }
    }
  },
  created () {
    this.name = this.routeType === 'stack' ? '组套' : '医嘱项'
    this.columns = columns
    this.treeData = []
    if (this.serviceId) {
      this.refresh()
    }
  },
  methods: {
    openCorrelationDialog (row, key) {
      this.$refs.correlation.getOffices(row, key)
      this.correlationShow = true
    },
    // 获取关联医嘱的机构树配置信息
    async getBindManageService () {
      let list = await api.getChildOrgServiceList(this.serviceId, this.routeType)
      return list
    },
    // 机构树和医嘱关联的机构绑定
    treeFormatter (nodes, listObj, index) {
      /**
       * serviceId 医嘱项档案id
       * orgServiceRelations
       *  - orgId 机构ID
       *  - managerPermission 是否有管理权：1-有；0-没有
       *  - usePermission 是否有使用权：1-有；0-没有
       *  - isValid 状态：1-启用；0-禁用
       *  - openProviderRList 开单科室
       *    - providerId 科室id
       *    - scene 科室使用场景：1-门诊；2-急诊；3-住院
       *  - executeProviderRList 执行科室
       */
      let afterTree = {}
      afterTree.orgId = nodes.id
      afterTree.architectureName = nodes.name
      afterTree.parentCode = nodes.parentCode
      afterTree.treeIndex = index + ''
      // afterTree.disEditor = nodes.parentCode === '0' ? ['managerPermission'] : []
      afterTree.disEditor = afterTree.treeIndex === '0' ? ['managerPermission'] : []
      if (listObj[nodes.id]) {
        let nodeData = listObj[nodes.id]
        afterTree.managerPermission = !!nodeData.managerPermission
        afterTree.usePermission = !!nodeData.usePermission
        afterTree.isValid = !!nodeData.isValid
        afterTree.openProviderRList = nodeData.openProviderRList || []
        afterTree.executeProviderRList = nodeData.executeProviderRList || []
        afterTree.copeSelfId = nodeData.id
      } else {
        // 集团默认具有管理权
        if (nodes.parentCode === '0') {
          afterTree.managerPermission = true
        } else {
          afterTree.managerPermission = false
        }
        afterTree.usePermission = false
        afterTree.isValid = false
        afterTree.openProviderRList = []
        afterTree.executeProviderRList = []
      }
      afterTree.children = nodes.outOrgGetOrgAndChildrenResDTOList && nodes.outOrgGetOrgAndChildrenResDTOList.map((item, k) => this.treeFormatter(item, listObj, index + '-' + k)) || []
      return afterTree
    },
    async serverToTree () {
      // Promise.all([api.getChildOrgServiceList, api.])
      // 没有医嘱项id不请求数据
      if (!this.serviceId) {
        this.loadData = false
        return
      }
      let tree
      tree = await api.getTreeNodes({
        outOrgGetOrgListByConditionReqDTO: { idList: [this.$store.state.currentUser.organizationId] }
      })
      const list = await this.getBindManageService()
      let listObj = {}
      list.forEach(item => {
        listObj[item.orgId] = item
      })
      this.treeData = [...tree.map((item, index) => this.treeFormatter(item, listObj, index))]
      this.loadData = false
    },
    save (params) {
      /**
       * serviceId 医嘱项档案id
       * orgServiceRelations
       *  - orgId 机构ID
       *  - managerPermission 是否有管理权：1-有；0-没有
       *  - usePermission 是否有使用权：1-有；0-没有
       *  - isValid 状态：1-启用；0-禁用
       *  - openProviderRList 开单科室
       *    - providerId 科室id
       *    - scene 科室使用场景：1-门诊；2-急诊；3-住院
       *  - executeProviderRList 执行科室
       */
      api.createOrgService(params, this.routeType).then(res => {
        if (res.head.errCode === 0) {
          if (this.$route.meta.thirdActiveIndex !== '/manages/prescriptionconcise' && this.$route.meta.thirdActiveIndex !== '/manages/stackconcise') this.$messageTips(this, 'success', '保存成功', '提示')
          this.refresh()
        } else {
          this.$messageTips(this, 'warning', '保存失败', '提示')
        }
      })
    },
    // 管理权和使用权与上级机构联动
    permissionUpLinkage (row, type) {
      let indexs = row.treeIndex.split('-').slice(0, -1)
      let nodes = this.treeData
      let index = indexs.shift()
      while (index !== undefined) {
        nodes = nodes[index]
        if (!(nodes.parentCode === '0') && !type) {
          nodes.managerPermission = true
        }
        if (type) {
          nodes.isValid = true
        }
        nodes = nodes.nodes
        index = indexs.shift()
      }
    },
    // 管理权与下级机构联动
    permissionDownLinkage (row, type) {
      let children = row.children
      children.forEach(item => {
        if (!type) {
          item.managerPermission = false
          item.usePermission = false
        } else {
          item.isValid = false
        }
        this.permissionDownLinkage(item, type)
      })
    },
    // 刷新列表
    refresh () {
      this.loadData = true
      this.serverToTree()
    },
    handleRowClass ({ row }) {
      if (row.usePermission) {
        return 'is-use'
      }
      return ''
    },
    handleCellClass ({ column }) {
      if (['managerPermission', 'architectureName'].includes(column.property)) {
        return 'not-border-right'
      } else {
        return ''
      }
    },
    handleCheckAllChange (prop, value, data) {
      /**
       * managerPermission-管理权  usePermission-使用权
       * 1. 使用权关闭 管理权开启 不用联动
       * 2. 使用权开启联动父机构管理权开启
       * 3. 管理权关闭联动子机构管理权(不用考虑)和使用权关闭
       */
      this.ctrlSwitchStatus[prop] = value
      let listObj = {}
      let getParamsList = function (row, key, val) {
        let isValid = 1
        if (!row.usePermission) {
          isValid = row.isValid ? 1 : 0
        } else {
          isValid = 1
        }
        let listParam = {
          id: row.copeSelfId || null,
          orgId: row.orgId,
          managerPermission: row.managerPermission ? 1 : 0,
          usePermission: row.usePermission ? 1 : 0,
          isValid: isValid,
          openProviderRList: row.openProviderRList,
          executeProviderRList: row.executeProviderRList
        }
        listParam[key] = val ? 1 : 0
        if (listObj[row.orgId]) {
          listObj[row.orgId][key] = val ? 1 : 0
        } else {
          listObj[row.orgId] = listParam
        }
      }
      // 管理权
      if (prop === 'managerPermission') {
        // 管理权开启
        if (value) {
          data.forEach(item => {
            if (item[prop] === value) return
            getParamsList(item, prop, value)
          })
        } else {
          data.forEach(item => {
            // 第一节点不允许改管理权
            if (item[prop] === value || item.treeIndex === '0') return
            getParamsList(item, prop, value)
            // 如果下面还有子点找到所有子节点进行使用权关闭
            if (item.children && item.children.length) {
              item.children.forEach(function downChild (v) {
                getParamsList(v, 'usePermission', false)
                if (v.children && v.children.length) {
                  v.children.forEach(k => {
                    downChild(k)
                  })
                }
              })
            }
          })
        }
      }
      // 使用权
      if (prop === 'usePermission') {
        if (value) {
          data.forEach(item => {
            if (item[prop] === value) return
            getParamsList(item, prop, value)
            // 如果上面还有父节点找到所有父级节点进行管理权开启
            let indexs = item.treeIndex.split('-').slice(0, -1)
            let nodes = this.treeData
            let index = indexs.shift()
            while (index !== undefined) {
              if (nodes[index].managerPermission) {
                nodes = nodes[index].children
                index = indexs.shift()
                continue
              }
              getParamsList(nodes[index], 'managerPermission', true)
              nodes = nodes[index].children
              index = indexs.shift()
            }
          })
        } else {
          data.forEach(item => {
            if (item[prop] === value) return
            getParamsList(item, prop, value)
          })
        }
      }
      let params = {
        serviceId: this.serviceId,
        orgServiceRelations: Object.values(listObj)
      }
      this.save(params)
    },
    changeOrgService (row, value, key) {
      // managerPermission 开 上面父节点管理权都打开
      // managerPermission 关 下面所有节点管理权使用权都关
      // usePermission 开 上面父节点管理权都打开
      // usePermission 关 对其他节点没有影响
      this.ctrlSwitchStatus = {
        managerPermission: false,
        usePermission: false
      }
      let isValid = 1
      if (!row.usePermission) {
        isValid = row.isValid ? 1 : 0
      } else {
        isValid = 1
      }
      let data = [{
        id: row.copeSelfId || null,
        orgId: row.orgId,
        managerPermission: row.managerPermission ? 1 : 0,
        usePermission: row.usePermission ? 1 : 0,
        isValid: isValid,
        openProviderRList: row.openProviderRList,
        executeProviderRList: row.executeProviderRList
      }]
      let params = {
        serviceId: this.serviceId,
        orgServiceRelations: data
      }
      if (value) {
        let indexs = row.treeIndex.split('-').slice(0, -1)
        let nodes = this.treeData
        let index = indexs.shift()
        while (index !== undefined) {
          nodes = nodes[index]
          if (!(nodes.parentCode === '0')) {
            nodes.managerPermission = true
            data.push({
              id: nodes.copeSelfId || null,
              orgId: nodes.orgId,
              managerPermission: nodes.managerPermission ? 1 : 0,
              usePermission: nodes.usePermission ? 1 : 0,
              isValid: nodes.isValid ? 1 : 0,
              openProviderRList: nodes.openProviderRList,
              executeProviderRList: nodes.executeProviderRList
            })
          }
          nodes = nodes.nodes
          index = indexs.shift()
        }
      } else if (key === 'managerPermission') {
        let children = row.children
        children.forEach(function permissionDownLinkage (item) {
          item.managerPermission = false
          item.usePermission = false
          data.push({
            id: item.copeSelfId || null,
            orgId: item.orgId,
            managerPermission: item.managerPermission ? 1 : 0,
            usePermission: item.usePermission ? 1 : 0,
            isValid: item.isValid ? 1 : 0,
            openProviderRList: item.openProviderRList,
            executeProviderRList: item.executeProviderRList
          })
          let children = item.children
          children.forEach(permissionDownLinkage)
        })
      }
      this.save(params)
    }
  },
  watch: {
    'serviceId' (val) {
      this.refresh()
    }
  }
}
</script>
<style lang="scss" scoped>
.organization {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  height: calc(100vh - 110px);
  .organ-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title {
      font-size: 16px;
    }
  }
  .operate-btn {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  /deep/ .is-use {
    background-color: #fffef0;
  }
  /deep/ .not-border-right {
    border-right: none;
  }
}
.config-btn {
  background-color: #fff;
  // color: #1c7bef;
}
</style>

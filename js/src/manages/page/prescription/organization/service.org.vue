<template>
  <div class="organization">
    <!-- <template v-if="!isEdit"> -->
    <div class="organ-header" v-if="!isEdit">
      <h1 class="title">{{name}}关联机构</h1>
      <column-filter v-model="priceColumns"></column-filter>
    </div>
    <div class="btn-box">
      <span class="notice-text"> </span>
      <!--
        sourceModule: 'cpoe', // warehouse 或 cope
        source: 'tenant', // 集团：tenant 机构：org
      -->
      <price-mutil
        v-if="!isEdit"
        :org-tree="orgTree"
        source-module="cpoe"
        :is-tenant="true"
        @publishSuccess="publishSuccess"
      ></price-mutil>
      <price-submit-button
        size="small"
        type="primary"
        class="price-submit-btn"
        source="tenant"
        source-module="cpoe"
        :disabled="!priceChangeList.length"
        @submit="priceSubmit"
      ></price-submit-button>
    </div>
    <!-- 机构树列表 -->
    <relevance-table
      ref="relevanceTable"
      switchProp="switchDisable"
      :data="treeData"
      :columns="columns"
      :ctrl-switchs="ctrlSwitchs"
      :ctrl-switch-status="ctrlSwitchStatus"
      :loading="loadData"
      :disabled="disabled"
      :row-className="handleRowClass"
      :cell-class-name="handleCellClass"
      :handle-check-all-change="handleCheckAllChange"
    ></relevance-table>
    <!-- 科室选择 -->
    <correlation-dialog
      ref="correlation"
      :dialog-show.sync="correlationShow"
      :disabled="disabled"
      @add="changeOrgService"
    ></correlation-dialog>
  </div>
</template>
<script>
import treeTableComponent from '@/manages/components/treetable'
// import priceInfo from '@/manages/components/price.manage/price.info'
import columnFilter from '@/manages/components/price.manage/column.filter.vue'
import priceMutil from '@/manages/components/price.manage/price.mutil.vue'
import priceSubmitButton from '@/manages/components/price.manage/price.submit.vue'
import priceInput from '@/manages/components/price.manage/price.input.vue'
import treeTable from '@/util/treetable.js'
import relevanceTable from '@/manages/components/relevance.table/index.vue'
import columnsPrice from './columns.price'
import columnsService from './columns'
import correlationDialog from './correlation.dialog.vue'
import api from '../managesapi'
let columns = []
export default {
  components: {
    treeTableComponent,
    relevanceTable,
    correlationDialog,
    columnFilter,
    priceMutil,
    priceSubmitButton,
    priceInput
  },
  mixins: [treeTable],
  props: {
    isEdit: { // 医嘱的编辑模式
      type: Boolean,
      default: false
    },
    serviceId: {
      type: String,
      default: ''
    },
    serviceInfo: {
      type: Object
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
      disabled: false,
      treeData: [],
      columns: [],
      correlationShow: false,
      loadData: false,
      listType: 0,
      priceColumns: [],
      orgTree: [],
      priceChangeList: [],
      ctrlSwitchStatus: {}
    }
  },
  created () {
    if (this.isEdit) {
      columns = columnsService
      this.ctrlSwitchs = ['managerPermission', 'usePermission']
      this.ctrlSwitchStatus = {
        managerPermission: false,
        usePermission: false
      }
    } else {
      columns = columnsPrice
      this.ctrlSwitchs = []
    }
    this.name = this.routeType === 'stack' ? '组套' : '医嘱项'
    this.columns = columns
    this.treeData = []
    this.priceChangeList = []
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
    selfFormatter (afterTree, nodes, listObj) {
      // afterTree.disEditor = nodes.parentCode === '0' ? ['managerPermission'] : []
      afterTree.disEditor = ['managerPermission']
      if (listObj[nodes.id]) {
        let nodeData = listObj[nodes.id]
        afterTree.managerPermission = !!nodeData.managerPermission
        afterTree.usePermission = !!nodeData.usePermission
        afterTree.isValid = nodeData.isValid
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
        // afterTree.isValid = false
        afterTree.openProviderRList = []
        afterTree.executeProviderRList = []
      }
    },
    async serverToTree () {
      // Promise.all([api.getChildOrgServiceList, api.])
      // 没有医嘱项id不请求数据
      if (!this.serviceId) {
        this.loadData = false
        return
      }
      const list = await this.getBindManageService()
      let disabled = String(this.serviceInfo.isAdvice)[1] !== '1' && this.serviceInfo.isAdvice !== 1
      let data = this.$refs.relevanceTable && await this.$refs.relevanceTable.serverToTree(this.serviceId, list, this.selfFormatter, disabled ? '' : 'usePermission')
      if (data) {
        this.priceColumns = data.columns
        this.columns = [].concat(columns, data.columns.map(item => {
          item.align = 'center'
          return item
        }))
        this.treeData = data.treeData
        this.orgTree = data.orgTree
      }
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
    // 刷新列表
    refresh () {
      this.loadData = true
      this.priceChangeList = []
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
    priceSubmit (submit, param) {
      param.data = this.priceChangeList
      submit(param).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '调价发布成功')
          this.refresh()
        }
      })
    },
    priceChange (orgId, data) {
      data.itemId = this.serviceId
      let priceChangeObj = {}
      this.priceChangeList.forEach(item => {
        item.items.forEach(v => {
          priceChangeObj[item.orgId + '-' + v.scene] = v
        })
      })
      if (
        (data.originalPrice !== null && +data.originalPrice === data.currentPrice) ||
        (data.originalPrice === null && data.currentPrice === '')
      ) {
        delete priceChangeObj[orgId + '-' + data.scene]
      } else {
        priceChangeObj[orgId + '-' + data.scene] = data
      }
      let resObj = {}
      Object.keys(priceChangeObj).forEach(key => {
        let keys = key.split('-')
        let orgId = keys[0]
        if (resObj[orgId]) {
          resObj[orgId].items.push(priceChangeObj[key])
        } else {
          resObj[orgId] = {
            orgId,
            items: [priceChangeObj[key]]
          }
        }
      })
      this.priceChangeList = Object.values(resObj)
    },
    publishSuccess () {
      this.refresh()
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
    'serviceId' (val, oldVal) {
      if (val) {
        this.refresh()
      }
    },
    priceColumns (val) {
      let columnDisplay = {}
      let cols = [...val, ...columns]
      cols.forEach(item => {
        columnDisplay[item.prop] = true
      })
      this.columns.forEach(item => {
        if (!columnDisplay[item.prop]) {
          item.display = false
        } else {
          item.display = true
        }
      })
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
    // display: flex;
    // flex-direction: row;
    justify-content: space-between;
    .title {
      display: inline-block;
      font-size: 16px;
    }
  }
  .notice-text {
    flex: 1;
    line-height: 30px;
  }
  .btn-box {
    margin: 15px 0px;
    font-size: 14px;
    display: flex;
    flex-direction: row;
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
.price-submit-btn {
  margin-left: 15px;
}
</style>

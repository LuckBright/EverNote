<template>
  <div class="organization">
    <div class="organ-header" v-if="!isDateial">
      <h1 class="title">关联机构</h1>
      <column-filter v-if="!ifService" v-model="priceColumns"></column-filter>
    </div>
    <div class="btn-box">
      <span class="notice-text">{{ (!isDateial && !priceManage) ? '当前为集团统一管理价格模式，不允许机构自行修改' : '&nbsp;'}}</span>
      <price-mutil
        v-if="!isDateial && (priceManage || (TENANTID && CLINICID && TENANTID === CLINICID))"
        :orgTree="orgTree"
        sourceModule="warehouse"
        @publishSuccess="publishSuccess"
      ></price-mutil>
      <price-submit-button
        v-if="!ifService && (priceManage || (TENANTID && CLINICID && TENANTID === CLINICID))"
        size="small"
        type="primary"
        class="price-submit-btn"
        source="tenant"
        sourceModule="warehouse"
        :checkLength="true"
        @submit="priceSubmit"
      ></price-submit-button>
      <doc-download
        @downFile="downFile"
        class="ml5"
        :size="'small'"
        @exportStatus="changeStatus"
        ref="childMethodt"
        btnTxt="导出价格"
      ></doc-download>
    </div>
    <!-- 机构树列表 -->
    <relevance-table
      ref="relevanceTable"
      switchProp="switchDisable"
      :ctrlSwitchs="ctrlSwitchs"
      :data="treeData"
      :columns="columns"
      :loading="loadData"
      :disabled="disabled"
      :rowClassName="handleRowClass"
      :cell-class-name="handleCellClass"
      :ctrlSwitchStatus="ctrlSwitchStatus"
      :handleCheckAllChange="handleCheckAllChange"
    ></relevance-table>
  </div>
</template>
<script>
import cityList from '@/manages/page/prescription/organization/cityList.vue'
// import priceInfo from '@/manages/components/price.manage/price.info'
import columnFilter from '@/manages/components/price.manage/column.filter.vue'
import priceMutil from '@/manages/components/price.manage/price.mutil.vue'
import priceSubmitButton from '@/manages/components/price.manage/price.submit.vue'
import priceInput from '@/manages/components/price.manage/price.input.vue'
import treeTable from '@/util/treetable.js'
import relevanceTable from '@/manages/components/relevance.table/index.vue'
import { columns } from '../columns.js'
import api from '@/manages/page/material/materialapi'
import priceApi from '@/manages/api/price.js'
import storage from '@/util/storage'
import { DOWNLOAD_FILE } from '@/warehouse/views/util/constant'
import { debounce } from '@/util/common'

export default {
  components: {
    cityList,
    relevanceTable,
    columnFilter,
    priceMutil,
    priceSubmitButton,
    priceInput
  },
  mixins: [treeTable],
  props: {
    serviceId: {
      type: String,
      default: ''
    },
    priceManage: Boolean,
    isDateial: Boolean,
    serviceInfo: {
      type: Object
    }
  },
  data () {
    return {
      disabled: false,
      citysList: [],
      city: '',
      treeData: [],
      columns: [],
      relationsList: [],
      correlationShow: false,
      loadData: false,
      listType: 0,
      priceColumns: [],
      priceChangeList: [],
      orgTree: [],
      ctrlSwitchStatus: {
        managePermission: false,
        state: false
      },
      ctrlSwitchs: ['managePermission', 'state']
    }
  },
  computed: {
    TENANTID () {
      return storage.getLocalStorage('TENANTID') || ''
    },
    CLINICID () {
      return storage.getLocalStorage('CLINICID') || ''
    },
    ifService () {
      return this.serviceInfo.ifService === 1
    }
  },
  created () {
    this.columns = columns
    this.treeData = []
    this.priceChangeList = []
  },
  methods: {
    changeStatus (a) {
      if (a) {
        this.$messageTips(this, 'success', '导出价格成功')
      }
    },
    downFile () {
      let params = {
        usePermission: 1,
        isClinic: false,
        ifService: [2, 3]
      }
      this.$refs.childMethodt.loading = true
      api.getExcelPrice(params).then(result => {
        if (result) {
          this.$refs.childMethodt.downfile(DOWNLOAD_FILE + result.fileName)
        }
        this.$refs.childMethodt.loading = false
      })
    },
    // 全选批量设置 管理权/使用权 创建价格
    handleCheckAllChange (name, val, tableList) {
      this.ctrlSwitchStatus[name] = val
      let params = []
      tableList.forEach(item => {
        let value = val ? 1 : 0
        if (name === 'state') value = val ? 0 : 1
        let itemObject = Object.assign(this.handlerSubItemData(item), {[name]: value})
        if (name === 'managePermission') itemObject.state = itemObject.state ? 0 : 1
        params.push(itemObject)
      })
      if (name === 'state') {
        let priceInitParams = {initOrgDto: []}
        params.forEach(item => {
          if (val && !item.usePermission) {
            priceInitParams.initOrgDto.push({
              orgId: item.clinicId,
              itemsPriceList: [{
                itemId: item.serviceId,
                price: this.serviceInfo.price || '0'
              }]
            })
            item.usePermission = 1
          }
        })
        !priceInitParams.initOrgDto.legnth ? this.postSaveRelation(params) : this.postSaveRelation(params, priceInitParams)
      } else {
        this.postSaveRelation(params.filter(item => (item.clinicId + '') !== this.CLINICID))
      }
    },
    // 获取关联物资的机构树配置信息
    async getBindManageService () {
      let list = await api.relations(this.serviceInfo.id)
      return list || []
    },
    // 机构树和物资关联的数据绑定
    selfFormatter (afterTree, nodes, listObj) {
      if (listObj[afterTree.orgId]) {
        afterTree = Object.assign(afterTree, listObj[afterTree.orgId])
      } else {
        afterTree = Object.assign(afterTree, this.relationsList[0], {
          orgId: afterTree.orgId,
          clinicId: afterTree.orgId,
          managePermission: 0,
          usePermission: 0,
          state: 0,
          relateionsId: null,
          updateTime: null,
          createTime: null,
          tenantId: this.TENANTID
        })
      }
    },
    // 根据物资serviceId查询价格体系相关数据
    async serverToTree () {
      // 获取物资和机构的管理权使用权关系
      this.relationsList = await this.getBindManageService()
      this.relationsList && this.relationsList.forEach(item => {
        // 去掉关系表的id 改成 relateionsId
        item.orgId = item.clinicId
        item.relateionsId = item.id
        item.state = item.state ? 0 : 1
        delete item.id
      })
      let data = this.$refs.relevanceTable && await this.$refs.relevanceTable.serverToTree(!this.ifService ? this.serviceId : 'xx', this.relationsList, this.selfFormatter, 'state')
      if (data) {
        this.priceColumns = data.columns
        // 物资不是医嘱项和收费项目 表格列表不合并价格体系列
        this.columns = [].concat(columns, !this.ifService ? data.columns || [] : [])
        this.treeData = data.treeData
        this.orgTree = data.orgTree
      }
      this.$nextTick(() => {
        if (this.$refs.relevanceTable && this.$refs.relevanceTable.tableListData && this.relationsList && this.relationsList.length) {
          if (this.relationsList.length >= this.$refs.relevanceTable.tableListData.length) this.setHanderChecked(this.$refs.relevanceTable.tableListData, this.relationsList)
        }
      })
      this.loadData = false
    },
    // 设置管理权/使用权的全选按钮勾选
    setHanderChecked (treeData, relationsList) {
      let handerList = relationsList.filter(item => {
        return treeData.some(child => child.clinicId === item.clinicId)
      })
      if (handerList && handerList.length && handerList.length >= treeData.length) {
        this.ctrlSwitchStatus.managePermission = !handerList.some(item => !item.managePermission)
        this.ctrlSwitchStatus.state = !handerList.some(item => !item.state)
      }
    },
    // 保存 管理权/使用权 相关数据
    save (params, key) {
      let initPrice = false
      params.forEach(item => {
        // 打开启用状态 默认打开usePermission为1的使用权
        if (key === 'state' && item.state && !item.usePermission) {
          params[0].usePermission = 1
          params[0].markupPercentage = this.serviceInfo.markupPercentage
          params[0].ceilingPrice = this.serviceInfo.ceilingPrice
          initPrice = true
        }
        item.state = item.state ? 0 : 1
      })
      // 第一次打开使用权 需要创建价格体系
      if (initPrice && !this.ifService) {
        let priceInitParams = {
          initOrgDto: [
            {
              orgId: params[0].clinicId,
              itemsPriceList: [{
                itemId: params[0].serviceId,
                price: this.serviceInfo.price || '0'
              }]
            }
          ]
        }
        this.postSaveRelation(params, priceInitParams)
      } else {
        this.postSaveRelation(params)
      }
    },
    postSaveRelation (params, priceInitParams) {
      if (priceInitParams) {
        Promise.all([api.saveRelation(params), priceApi.initPriceToService(priceInitParams)]).then(([res, rep]) => {
          if (res && rep) {
            this.$messageTips(this, 'success', '保存成功', '提示')
            this.refresh()
          } else {
            this.$messageTips(this, 'warning', '保存失败', '提示')
          }
        })
      } else {
        api.saveRelation(params).then(res => {
          if (res) {
            this.$messageTips(this, 'success', '保存成功', '提示')
            this.refresh()
          } else {
            this.$messageTips(this, 'warning', '保存失败', '提示')
          }
        })
      }
    },
    // 刷新列表
    refresh: debounce(function () {
      this.loadData = true
      this.priceChangeList = []
      this.serverToTree()
    }),
    handleRowClass ({ row }) {
      if (row.state) {
        return 'is-use'
      }
      return ''
    },
    handleCellClass ({ column }) {
      if (['managePermission', 'architectureName'].includes(column.property)) {
        return 'not-border-right'
      } else {
        return ''
      }
    },
    // 提交修改价格
    priceSubmit (submit, param) {
      param.data = this.priceChangeList
      submit(param).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '调价发布成功')
          this.refresh()
        }
      })
    },
    // 输入框价格发生变动
    priceChange (orgId, data) {
      data.itemId = this.serviceId
      let priceChangeObj = {}
      this.priceChangeList.forEach(item => {
        item.items.forEach(v => {
          priceChangeObj[item.orgId + '-' + v.scene] = v
        })
      })
      if (data.originalPrice !== null && +data.originalPrice === data.currentPrice) {
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
    // 批量操作调价成功
    publishSuccess () {
      this.refresh()
    },
    // 管理权/使用权提交数据处理
    handlerSubItemData (row) {
      let thisItem = {}
      Object.keys(this.relationsList[0]).forEach(item => {
        if (!['updateTime', 'createTime', 'id', 'relateionsId', 'orgId'].includes(item)) {
          thisItem[item] = row[item]
        }
      })
      if (row.relateionsId) thisItem.id = row.relateionsId
      return thisItem
    },
    // 操作 管理权/使用权 开关
    changeOrgService (row, value, key) {
      // managePermission 开 上面父节点管理权都打开
      // managePermission 关 下面所有节点管理权使用权都关
      let params = [this.handlerSubItemData(row)]
      // 操作的为管理权
      if (key === 'managePermission') {
        if (value) {
          let indexs = row.treeIndex.split('-').slice(0, -1)
          let nodes = this.treeData
          let index = indexs.shift()
          while (index !== undefined) {
            nodes = nodes[index]
            if (!(nodes.parentCode === '0')) {
              nodes.managePermission = row.managePermission
              params.push(Object.assign(this.handlerSubItemData(nodes), { managePermission: row.managePermission }))
            }
            nodes = nodes.nodes
            index = indexs.shift()
          }
        } else {
          let children = row.children
          let _this = this
          children.forEach(function permissionDownLinkage (item) {
            // 每个子级节点关闭管理权
            row.nodes.forEach(bbs => {
              bbs.managePermission = row.managePermission
            })
            params.push(Object.assign(_this.handlerSubItemData(item), { managePermission: row.managePermission }))
            let children = item.children
            children.forEach(permissionDownLinkage)
          })
        }
      }
      this.save(params, key)
    }
  },
  watch: {
    'serviceInfo': {
      handler (val) {
        this.refresh()
      },
      deep: true,
      immediate: true
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
  height: calc(100vh - 165px);
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
    margin: 5px 0px;
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

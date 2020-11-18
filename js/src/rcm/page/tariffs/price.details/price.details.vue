<template>
  <div>
    <ever-bread-crumb name="调价详情"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="head_container">
        <div>
          <div class="row_div">
            <span>提交时间：</span>
            {{info.createTime | time}}
          </div>
          <div class="row_div">
            <span>价格更新时间：</span>
            {{info.modifyTime | time}}
          </div>
          <div class="row_div" v-if="info.algorithm">
            <span>舍入规则：</span>
            {{info.algorithm}}
          </div>
          <div class="row_div">
            <el-button v-if="processInstanceId" type="text" @click="check">查看审批流 ></el-button>
          </div>
        </div>
        <div class="pt10">
          <div class="row_div">
            <span>影响机构：</span>
            {{orgs | orgsStr}}
          </div>
        </div>
        <div class="pt10">
          <div class="row_div">
            <span>调价说明：</span>
            {{info.desc}}
          </div>
        </div>
      </div>
      <el-divider >调价明细</el-divider>
      <div class="main_container">
        <el-container class="m pos_re">
          <el-aside width="200px" class="boxshadow pos_re" v-if="isTenant">
            <ul class="org_ul bor_1 ">
              <li v-for="org in orgs" :key="org.id" @click="handlerSelectOrg(org)" :class="{'active': orgId == org.id}">{{org.name}}</li>
            </ul>
          </el-aside>
          <el-container class="bor_1 pos_re" style="left: -1px">
            <el-main >
              <ever-form2
              ref="form"
              v-if="!isBatch"
              :schema="schema"
              v-model="queryObj"
              :inline="true"
              :isQuery="true"
              @query="list(true)">
              <template slot="sysClassList">
                <el-cascader
                  :options="typeOpts"
                  size="small"
                  clearable
                  placeholder="系统分类"
                  valueKey="id"
                  collapse-tags
                  :props="{multiple: true, id: 'code'}"
                  v-model="queryObj.sysClassList">
                </el-cascader>
              </template>
              <template slot="default">
                <el-form-item>
                  <el-button type="primary" @click="list(true)">查询</el-button>
                </el-form-item>
              </template>
            </ever-form2>
            <el-table
              border
              v-loading="loading"
              :data="tableData">
              <el-table-column
                prop="name"
                label="项目名称">
              </el-table-column>
              <el-table-column
                prop="sysClassName"
                label="系统分类">
              </el-table-column>
              <el-table-column
                prop="finTypeName"
                label="财务分类">
              </el-table-column>
              <el-table-column
                prop="spec"
                label="规格">
              </el-table-column>
              <el-table-column
                prop="unitName"
                label="销售单位">
              </el-table-column>
              <template v-if="!isBatch">
                <el-table-column v-for="item in Columns" :key="item.scene" :prop="item.scene" :label="item.sceneName">
                  <template slot-scope="scope">
                    <price-details-template :scene="item.scene" :row="scope.row"></price-details-template>
                  </template>
                </el-table-column>
              </template>
            </el-table>
            <!-- 批次定价表格 -->
            <template v-if="isBatch">
              <batch-price-table :Columns="Columns" :tableData="batchTableData" :loading="loading"></batch-price-table>
            </template>
            </el-main>
            <el-footer v-if="visible" height="38px">
              <ever-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :totalCount="totalCount"
                :pagesize="pagesize"
                :current="current"
              ></ever-pagination>
            </el-footer>
          </el-container>
        </el-container>
      </div>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import api from '@/rcm/store/tariffs/modify.price.api'
import coltd from '@/manages/components/relevance.table/coltd'
import sysvalue from '@/warehouse/store/sysvalueapi'
let schema = [
  {
    name: 'sysClassList',
    comp: 'custom',
    props: {
      placeholder: '系统分类',
      code: 'THC_WH_OBJECT_SUB_TYPE',
      multiple: true
    }
  },
  {
    name: 'finTypeList',
    comp: 'sys-type',
    props: {
      placeholder: '财务分类',
      code: 'THC_RCM_FIN_TYPE',
      multiple: true
    }
  },
  {
    name: 'itemName',
    props: {
      placeholder: '项目名称'
    }
  }
]
export default {
  components: {
    coltd,
    batchPriceTable: () => import('@/rcm/page/tariffs/price.details/batch.price.details.vue'),
    priceDetailsTemplate: () => import('@/rcm/page/tariffs/price.details/price.details.table.vue')
  },
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.requestSwitch = true
    obj.finTypeList = []
    return {
      api,
      schema,
      queryObj: obj,
      isTenant: false,
      orgId: '',
      id: '',
      info: {
        time: '',
        orgs: '',
        desc: '',
        algorithm: ''
      },
      orgs: [],
      isBatch: this.$route.query.isBatch,
      loading: false,
      Columns: [],
      visible: true,
      batchTableData: [],
      typeOpts: []
    }
  },
  created () {
    this.isTenant = this.$route.query.isTenant
    this.id = this.$route.query.id
    this.processInstanceId = this.$route.query.processInstanceId
    this.getHeadData()
    this.getTree()
  },
  methods: {
    getTree () {
      sysvalue.cascade('THC_WH_OBJECT_TYPE', ['294', '296', '798']).then(res => {
        if (Array.isArray(res)) {
          this.typeOpts = res
        }
      })
    },
    initTree (json) {
      let data = []
      json.forEach(item => {
        item.value = item.id
        item.label = item.name
        if (item.parentId) {
          data.push(item)
        } else {
          let info = json.map(lab => lab.id === item.parentId)
          if (info.children) {
            info.children.push(item)
          } else {
            info['children'] = [item]
          }
        }
      })
      this.typeOpts = data
    },
    check () {
      window.open(`${this.$ever.systemsetIndex}/approval/${this.processInstanceId}`)
    },
    handlerSelectOrg (row) {
      this.orgId = row.id
      this.empty()
      this.list()
    },
    empty () {
      this.$refs.form.$refs.form.resetFields()
      this.current = 1
      this.pagesize = 20
      this.totalCount = 0
      this.visible = false
      this.$nextTick(_ => {
        this.visible = true
      })
    },
    getHeadData () {
      api.historyDetails(this.id).then(rs => {
        if (!rs.head.errCode) {
          this.info = rs.data
          this.info.algorithm = rs.data.rule && rs.data.rule.algorithm && rs.data.rule.algorithm.name
          this.orgs = rs.data.rule && rs.data.rule.orgIds
          this.orgId = this.isTenant ? this.orgs[0]['id'] : this.$route.query.modifyOrgId || localStorage.getItem('CLINICID') // 如果是机构下查询集团调价的机构数据，接口返回的是集团id，则取query中的机构id做查询参数
          this.list()
        }
      })
    },
    list () {
      const params = {
        current: this.current,
        size: this.pagesize,
        orgId: this.orgId,
        batchNo: this.id
      }
      if (this.queryObj.itemName) {
        params.itemName = this.queryObj.itemName
      }
      if (this.queryObj.finTypeList.length > 0) {
        params.finTypeList = this.queryObj.finTypeList
      }
      if (this.queryObj.sysClassList.length > 0) {
        params.sysClassList = this.queryObj.sysClassList[0]
      }
      this.loading = true
      api.historyTable(params).then(rs => {
        this.loading = false
        if (!rs.head.errCode) {
          this.initTableHead(rs.data.sceneList)
          this.initTableData(rs.data)
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      }).catch(_ => {
        this.loading = false
        this.tableData = []
        this.totalCount = 0
      })
    },
    initTableHead (data) {
      this.Columns = []
      data.forEach(item => {
        this.Columns.push({
          scene: item.scene,
          sceneName: item.sceneName
        })
      })
    },
    initTableData (json) {
      const records = json.itemsInfo.records
      let sysBatchCodeList = []
      let batchArr = []
      json.itemsPriceList.forEach(item => {
        const { originalPrice, currentPrice } = item
        let info = records.find(lab => lab.itemId === item.itemId)
        if (this.isBatch) {
          if (sysBatchCodeList.includes(item.sysBatchCode)) {
            let batchInfo = batchArr.find(batch => batch.sysBatchCode === item.sysBatchCode)
            batchInfo[item.scene] = { originalPrice, currentPrice }
          } else {
            sysBatchCodeList.push(item.sysBatchCode)
            item[item.scene] = { originalPrice, currentPrice }
            batchArr.push(item)
          }
        } else {
          info[item.scene] = { originalPrice: originalPrice, currentPrice: currentPrice }
        }
      })
      this.batchTableData = batchArr
      this.tableData = records
      this.totalCount = this.isBatch ? batchArr.length : json.itemsInfo.total
    }
  },
  filters: {
    time (val = '') {
      return val.replace('T', ' ')
    },
    orgsStr (arr = []) {
      return arr.map(item => { return item.name }).join(', ')
    }
  }
}
</script>
<style lang="less" scoped>
  .head_container {
    margin: 20px;
    .row_div {
      display: inline-block;
      margin-right: 20px;
    }
  }
  .main_container {
    padding: 0 10px;
  }
  .m {
  margin: 20px;
  margin-bottom: 0;
}
.el-aside {
  box-shadow: none;
}
.org_ul {
  margin: 0;
  padding:0;
  border-right: none;
  li {
    &:hover {
      background: #f7f7f7;
    }
    &.active  {
      border-right: 1px solid #fff;
      color: #1c7bef;
      font-weight: bold;
    }
    &:last-child {
      border-bottom: 1px solid #fff;
    }
    text-align: center;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    line-height: 36px;
    border-right: 1px solid #ddd;
  }
}
.custom_table {
  /deep/ .el-table {
    margin: 0;
  }
}
</style>


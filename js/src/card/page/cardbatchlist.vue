<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          @query="list(true)"
          ref="form"
          class="package-sale"
          :labelWidth="140"
          label-position="right"
          :is-query="true"
          v-ever-bind-enter
          :inline="true">
          <template slot="name">
            <el-select v-model="queryObj.name" clearable placeholder="请选择">
              <el-option
                v-for="item in nameOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <router-link :to="'/card/createcardbatch'"><el-button type="primary" v-if="$hasPermission('Auth_menu_market_card_cardbatchlist_newBtn')">新建</el-button></router-link>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <div v-if="tableData && tableData.length > 0">
        <el-table
          v-loading.body="loading"
          :data="tableData"
          border>
          <el-table-column
            width="60"
            prop=""
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            width="100"
            prop="type"
            label="储值卡类型"
            align="center">
            <template slot-scope="scope">
              <sys-value type="THC_CARD_MEMBERCARD_TYPE" :code="scope.row.type"></sys-value>
            </template>
          </el-table-column>
          <el-table-column
            min-width="200"
            prop="name"
            label="储值卡批次名称">
          </el-table-column>
          <el-table-column
            min-width="150"
            label="使用范围"
            align="center"
            prop="serviceIds">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.type == 1 && $hasPermission('Auth_menu_market_card_cardbatchlist_showRangeBtn')"
                @click="showDetail(scope.$index,scope.row)">查看</el-button>
              <el-button
                type="text"
                v-if="scope.row.type == 1 && $hasPermission('Auth_menu_market_card_cardbatchlist_changeRangeBtn')"
                @click="showDetail1(scope.$index,scope.row)">变更</el-button>
              <span v-if="scope.row.type == 2"> -- -- </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shareCount"
            label="是否可共享">
            <template slot-scope="scope">
              <span v-if="scope.row.shareCount">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            prop="serviceIds"
            label="折扣范围"
            align="center"
            :formatter="formatDiscount">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.type == 2 && $hasPermission('Auth_menu_market_card_cardbatchlist_showRangeBtn')"
                @click="showDetail(scope.$index,scope.row)">查看</el-button>
              <el-button
                type="text"
                v-if="scope.row.type == 2 && $hasPermission('Auth_menu_market_card_cardbatchlist_changeRangeBtn')"
                @click="showDetail1(scope.$index,scope.row)">变更</el-button>
              <span v-if="scope.row.type == 1"> -- -- </span>
            </template>
          </el-table-column>
          <el-table-column
            width="140"
            prop="terminalName"
            label="展示终端"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="shareDiscount"
            label="折扣是否可共享">
            <template slot-scope="scope">
              <span v-if="scope.row.shareDiscount">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            prop="moneyThreshold"
            label="储值门槛"
            align="right">
            <template slot-scope="scope">
              {{scope.row.moneyThreshold | formatToFinacial}}
            </template>
          </el-table-column>
          <el-table-column
            min-width="200"
            prop="discount"
            label="折扣"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.discountRule">{{selftariffArr.filter(v => {
                return v.id == scope.row.discountRule
                })[0] && selftariffArr.filter(v => {
                return v.id == scope.row.discountRule
                })[0].masterName
              }}</span>
              <span v-if="scope.row.discount">{{(scope.row.discount/10).toFixed(1)}}折</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            prop="givedMoney"
            label="赠送金额"
            align="right">
            <template slot-scope="scope">
              <span v-if="scope.row.givedMoney">{{scope.row.givedMoney | formatToFinacial}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            prop="validPeriod"
            label="有效期（月）"
            align="right">
          </el-table-column>
          <el-table-column
            width="100"
            prop="shareCount"
            label="是否共享" :formatter="formatYesno"
            align="right">
            <template slot-scope="scope">
              <span v-if="scope.row.shareCount">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            prop="shareCount"
            label="共享人数"
            align="right">
            <template slot-scope="scope">
              <span v-if="scope.row.shareCount">{{scope.row.shareCount}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            prop="status"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <sys-value type="THC_CARD_MEMBERCARD_BATCH_STATUS" :code="scope.row.status"></sys-value>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="300"
            align="center"
            prop="status"
            fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status == 0 && $hasPermission('Auth_menu_market_card_cardbatchlist_freezeBtn')"
                type="warning"
                @click="handleFreeze(scope.$index,scope.row)">冻结</el-button>
              <el-button
                v-if="scope.row.status == 2 && $hasPermission('Auth_menu_market_card_cardbatchlist_unfreezeBtn')"
                type="success"
                @click="handleFreeze(scope.$index,scope.row)">解冻</el-button>
              <el-button
                type="primary"
                v-if="scope.row.status == 3 || scope.row.status == 5"
                @click="handleApply(scope.row)">申请</el-button>
              <el-button
                type="primary"
                v-if="scope.row.status != 3 && isApproval && scope.row.businessCode"
                @click="showApply(scope.row)">审批详情</el-button>
              <el-button
                type="primary"
                v-if="scope.row.status != 2"
                @click="showChangelist(scope.row)">变更记录</el-button>
              <el-button
                v-if="$hasPermission('Auth_menu_market_card_cardbatchlist_delBtn')"
                :disabled="scope.row.status == 1"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount" :current="current">
        </ever-pagination>
      </div>
      <ever-no-data height="180" v-else></ever-no-data>
    </div>
    <el-dialog title="查看范围" :visible.sync="showItemDataTable" class="ui_dialog_02" :close-on-click-modal="false">
      <el-tabs active-name="dzk">
        <el-tab-pane label="分类" name="dzk">
          <el-card class="box-card">
            <span v-for="(value, i) in checkObjList" :key="i" style="color:#222; font-size:14px; margin-right:10px;">
              {{ value.name }}
            </span>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="项目" name="czk">
          <el-table :data="itemDataList" max-height="400">
            <el-table-column
              width="140"
              prop="code"
              label="编号">
            </el-table-column>
            <el-table-column
              min-width="200"
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              width="100"
              align="center"
              prop="serviceType"
              label="类型">
              <template slot-scope="scope">
                <sys-value type="THC_SOB_SERVICE_TYPE" :code="scope.row.serviceType"></sys-value>
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              align="center"
              prop="price"
              label="价格">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog title="范围变更" :visible.sync="showChangeTab" class="ui_dialog_02" :close-on-click-modal="false">
      <el-tabs active-name="dzk">
        <el-tab-pane label="分类" name="dzk">
          <el-card class="box-card">
            <el-checkbox-group v-model="checkList">
              <el-checkbox v-for="option in checkItemArr" :label="option.id" :key="option.id" @change="handleCheckedChange(option.id)">{{option.name}}</el-checkbox>
            </el-checkbox-group>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="项目" name="czk">
          <el-card class="box-card">
            <div class="clearfix">
              <span>请选择项目</span>
              <el-button class="fr" type="primary" @click="addService(itemDataList)">添加</el-button>
            </div>
            <el-table :data="itemDataList" max-height="400">
              <el-table-column
                width="140"
                prop="code"
                label="编号">
              </el-table-column>
              <el-table-column
                min-width="200"
                prop="name"
                label="名称">
              </el-table-column>
              <el-table-column
                width="100"
                align="center"
                prop="serviceType"
                label="类型">
                <template slot-scope="scope">
                  <sys-value type="THC_SOB_SERVICE_TYPE" :code="scope.row.serviceType"></sys-value>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                align="center"
                prop="price"
                label="价格">
              </el-table-column>
              <el-table-column
                prop=""
                label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    @click="deleteRow(scope.$index, itemDataList)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onTabClose"><i class="iconfont icon-quxiao"></i>取消</el-button>
        <el-button type="primary" @click="saveSerives"><i class="iconfont icon-tijiao"></i>确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="变更记录"
      :close-on-click-modal="false"
      :visible.sync="showChangeVisible">
      <el-row width="100%" class="tb-header" :gutter="8">
        <el-col :span="4" align="center">业务处理</el-col>
        <el-col :span="16" align="center">处理的内容</el-col>
        <el-col :span="4" align="center">操作人</el-col>
      </el-row>
      <template v-if="changeListData.length">
        <div v-for="(item, i) in changeListData" :key="i">
          <el-row class="tb-title">
            <el-col :span="24">处理日期：{{item.createTime}}</el-col>
          </el-row>
          <table width="100%" class="tb-table" cellspacing="0" cellpadding="0">
            <tr v-if="item.categoryDiffs.ADD.length > 0 || item.itemDiffs.ADD.length > 0">
              <td width="16.6666667%" align="center">
                增加
              </td>
              <td width="66.6666667%" align="center">
                <span v-for="(value, k) in item.changeObjList" :key="k" style="color:#222; font-size:14px; margin-right:10px;">
                  {{ value.name }}
                </span>
              </td>
              <td width="16.6666667%" align="center">
                {{item.operatorName}}
              </td>
            </tr>
            <tr v-if="item.categoryDiffs.DEL.length > 0 || item.itemDiffs.DEL.length > 0">
              <td width="16.6666667%" align="center">
                删除
              </td>
              <td width="66.6666667%" align="center">
                <span v-for="(value, j) in item.itemDataList" :key="j" style="color:#222; font-size:14px; margin-right:10px;">
                  {{ value.name }}
                </span>
              </td>
              <td width="16.6666667%" align="center">
                {{item.operatorName}}
              </td>
            </tr>
          </table>
        </div>
      </template>
      <template v-if="changeListData.length == 0">
        <el-row>
          <el-col :span="24" align="center">没有变更记录</el-col>
        </el-row>
      </template>
    </el-dialog>
    <service-dialog ref="service" :itemIds="this.itemDataList" @selectChange="selectChangeSave"></service-dialog>
  </div>
</template>

<script>
import idcard from '../store/idcardapi'
import api from '../store/cardbatchapi'
import sobapi from '../../sob/store/serviceapi'
import utillist from '../../util/list'
import sysvalue from '@/warehouse/store/sysvalueapi'
import serviceDialog from '../../sob/page/servicedialog'
import selftariffsapi from '@/rcm/store/tariffs/selftariffsapi'
import codeApi from '@/card/store/packagemanagement/api'

let querySchema = [
  {
    name: 'type',
    label: '储值卡类型',
    comp: 'sys-type',
    props: {
      code: 'THC_CARD_MEMBERCARD_TYPE'
    }
  },
  {
    name: 'status',
    label: '储值卡状态',
    comp: 'sys-type',
    props: {
      code: 'THC_CARD_MEMBERCARD_STATUS'
    }
  },
  {
    name: 'name',
    label: '储值卡批次名称',
    comp: 'custom'
  }
]

export default {
  mixins: [utillist],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      codeApi,
      tableData: [],
      itemDataList: [],
      changeListData: [],
      checkList: [],
      checkObjList: [],
      querySchema: querySchema,
      queryObj: obj,
      showItemDataTable: false,
      showChangeTab: false,
      showChangeVisible: false,
      checkItemArr: [],
      categoryIds: [],
      selftariffArr: [],
      isApproval: false,
      itemIds: [],
      id: '',
      index: '',
      origId: '',
      nameOptions: [],
    }
  },
  watch: {
    'queryObj.type': function (val) {
      this.queryObj.name = ''
      api.list({ type: val, offset: 0, pagesize: 10000 }).then(result => {
        if (result && result.data && result.data.resultList) this.nameOptions = result.data.resultList
      })
    }
  },
  methods: {
    showChangelist (obj) {
      let params = {
        type: 1,
        objId: obj.id
      }
      idcard.getByTypeAndObjId(params).then(result => {
        this.changeListData = []
        if (result.data) {
          for (let i = 0; i < result.data.length; i++) {
            let row = result.data[i]
            row.changeObjList = []
            row.itemDataList = []
            let categoryIds = row.categoryDiffs.ADD
            if (categoryIds.length) {
              if (categoryIds[0] === '0') {
                row.changeObjList.push({name: '全部分类'})
              } else {
                for (let j = 0; j < categoryIds.length; j++) {
                  sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', categoryIds[j]).then(result => {
                    if (result) row.changeObjList.push({name: result})
                  })
                }
              }
            }
            let categoryIds1 = row.categoryDiffs.DEL
            if (categoryIds1.length) {
              if (categoryIds1[0] === '0') {
                row.itemDataList.push({name: '全部分类'})
              } else {
                for (let k = 0; k < categoryIds1.length; k++) {
                  sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', categoryIds1[k]).then(result => {
                    if (result) row.itemDataList.push({name: result})
                  })
                }
              }
            }
            let itemIds = row.itemDiffs.ADD
            if (itemIds.length) {
              this.sobapi.list({ids: itemIds}).then(result => {
                if (result.data) {
                  result.data.map(item => {
                    row.changeObjList.push(item)
                  })
                }
              })
            }
            let itemIds1 = row.itemDiffs.DEL
            if (itemIds1.length) {
              this.sobapi.list({ids: itemIds1}).then(result => {
                if (result.data) {
                  result.data.map(item => {
                    row.itemDataList.push(item)
                  })
                }
              })
            }
          }
          this.showChangeVisible = true
          this.changeListData = result.data
        } else {
          this.showChangeVisible = true
        }
      })
    },
    handleApply (obj) {
      api.apply(obj.id).then(result => {
        this.list(true)
      })
    },
    showApply (row) {
      this.$router.push({
        path: '/card/createcardbatch',
        query: {
          id: row.id,
          viewApproval: true
        }
      })
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.del(row.id, row)
      }).catch(() => {
      })
    },
    del (id, row) {
      this.api.del(id, row).then(result => {
        if (result.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.list(true)
        }
      })
    },
    showDetail (i, rs) {
      let itemIds = JSON.parse(rs.serviceIds).itemIds ? JSON.parse(rs.serviceIds).itemIds : []
      itemIds.length && this.sobapi.list({ids: itemIds}).then(result => {
        if (result.data) {
          this.itemDataList = result.data
          this.showItemDataTable = true
        }
      })
      this.checkObjList = []
      let categoryIds = JSON.parse(rs.serviceIds).categoryIds ? JSON.parse(rs.serviceIds).categoryIds : []
      if (categoryIds.length === 1 && categoryIds[0] === '0') {
        categoryIds = []
        sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
          var Arr = []
          res.forEach(item => {
            if (item.parentId === '297' || item.parentId === '294' || item.parentId === '296' || item.parentId === '798') {
              Arr.push(item.id)
            }
          })
          categoryIds = Arr
          for (let i = 0; i < categoryIds.length; i++) {
            sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', categoryIds[i], true).then(result => {
              if (result) {
                this.checkObjList.push(result)
                this.showItemDataTable = true
              }
            })
          }
        })
      } else {
        for (let i = 0; i < categoryIds.length; i++) {
          sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', categoryIds[i], true).then(result => {
            if (result) {
              this.checkObjList.push(result)
              this.showItemDataTable = true
            }
          })
        }
      }
    },
    onTabClose () {
      this.showChangeTab = false
    },
    addService (data) {
      if (data) {
        data.forEach(item => {
          item.checked = 1
        })
      }
      this.$refs.service.onDialogOpen(this.currTabs, this.selectData)
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
      this.itemIds.splice(index, 1)
    },
    selectChangeSave (data) {
      this.itemDataList = []
      data.forEach(item => {
        this.itemDataList.push(item)
        this.itemIds.push(item.id)
      })
    },
    handleCheckedChange (id) {
      this.categoryIds = this.checkList
    },
    saveSerives () {
      this.categoryIds = this.checkList
      this.itemIds = this.itemIds
      for (let i = 0; i < this.categoryIds.length; i++) {
        if (this.categoryIds.indexOf(this.categoryIds[i]) !== i) {
          this.categoryIds.splice(i, 1)
          i--
        }
      }
      for (let i = 0; i < this.itemIds.length; i++) {
        if (this.itemIds.indexOf(this.itemIds[i]) !== i) {
          this.itemIds.splice(i, 1)
          i--
        }
      }
      let params = {'itemIds': this.itemIds, 'categoryIds': this.categoryIds, 'id': this.id, 'origId': this.origId}
      this.api.modify(params).then(result => {
        this.showChangeTab = false
        this.tableData[this.index].serviceIds = result.data.serviceIds
        // this.tableData = Object.assign({}, this.tableData)
      })
    },
    showDetail1 (i, rs) {
      this.checkItemArr.forEach(function (item) {
        item.disabled = false
      })
      this.id = rs.id
      this.origId = rs.origId
      this.index = i
      this.itemIds = JSON.parse(rs.serviceIds).itemIds ? JSON.parse(rs.serviceIds).itemIds : []
      this.itemIds.length && this.sobapi.list({ids: this.itemIds}).then(result => {
        if (result.data) {
          result.data.forEach(item => {
            item.noDel = true
          })
          this.itemDataList = result.data
          this.showChangeTab = true
        }
      })
      this.checkList = []
      let categoryIds = JSON.parse(rs.serviceIds).categoryIds ? JSON.parse(rs.serviceIds).categoryIds : []
      if (categoryIds.length === 1 && categoryIds[0] === '0') {
        categoryIds = []
        this.checkItemArr.forEach(item => {
          categoryIds.push(item.id)
        })
      }
      for (let i = 0; i < categoryIds.length; i++) {
        sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', categoryIds[i], true).then(result => {
          if (result) {
            this.checkList.push(result.id)
            this.checkItemArr.forEach(function (item) {
              if (item.id === result.id) {
                item.disabled = true
              }
            })
            this.showChangeTab = true
          }
        })
      }
    },
    handleFreeze (i, rs) {
      let tips = Number(rs.status) === 0 ? '冻结' : '解冻'
      this.$confirm('您确定要' + tips + '该批次会员卡吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.freeze(rs).then(result => {
          if (result.data) {
            this.tableData[i].status = result.data.status
          }
        })
      }).catch(() => {
        return false
      })
    }
  },
  created () {
    selftariffsapi.list().then(result => {
      this.selftariffArr = result.data
    })
    codeApi.getApprovalCode().then(rs => {
      this.isApproval = rs.data === '1'
    })
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
      this.typeoptions = []
      res.forEach(item => {
        if (item.parentId === '297' || item.parentId === '294' || item.parentId === '296' || item.parentId === '798') {
          this.typeoptions.push(item)
        }
      })
      this.checkItemArr = this.typeoptions
    })
  },
  beforeCreate () {
    this.api = api
    this.sobapi = sobapi
  },
  components: {
    serviceDialog
  }
}
</script>
<style scoped>
.tb-header{ background-color: #eef1f6; line-height: 40px; text-align: center; margin-bottom: 10px;}
.tb-title{ background-color: #eef1f6; line-height: 30px; padding: 0 10px;}
.tb-table{ border-left: 1px solid #eef1f6; border-top: 1px solid #eef1f6; line-height: 30px;}
.tb-table td{ border-bottom:1px solid #eef1f6; border-right: 1px solid #eef1f6}
</style>

<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        @query="list()"
        ref="form"
        labelWidth="140px"
        label-position="right"
        v-ever-bind-enter
        :is-query="true"
        :inline="true"
      >
        <template slot="name">
          <el-autocomplete
            clearable
            v-model="queryObj.name"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
            @clear="handleClear"
            placeholder="身份卡名称"
          ></el-autocomplete>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button
              type="primary"
              @click="list()"
            >查询</el-button>
          </el-form-item>
          <el-form-item class="fr" v-if="!isGroupControl">
            <router-link :to="{name: 'idcard'}">
              <el-button type="primary">新建身份卡</el-button>
            </router-link>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div class="flex_col_1_auto main-wrap">
      <el-table
        v-loading.body="loading"
        :data="tableData"
        :border="false">
        <el-table-column
          width="60"
          prop
          type="index"
          :label="$t('序号')"
        ></el-table-column>
        <el-table-column
          min-width="120"
          prop="name"
          :label="$t('身份卡名称')"
        >
          <template slot-scope="scope">
            <a
              href="javascript:void(0)"
              @click="edit(scope.row)"
            >{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          prop="terminalName"
          label="展示终端"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          width="200"
          prop="discount"
          label="折扣"
          :formatter="formatDiscount"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.discountRule">
              {{selftariffArr.filter(v => { return v.id == scope.row.discountRule })[0] && selftariffArr.filter(v => { return v.id == scope.row.discountRule })[0].masterName }}
            </span>
            <span v-else>{{scope.row.discount ? scope.row.discount + '%' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="90"
          prop="validPeriod"
          label="有效期（月）"
        ></el-table-column>
        <el-table-column
          width="120"
          prop="price"
          label="价格"
          align="right"
        >
          <template slot-scope="scope">{{scope.row.price | formatToFinacial}}</template>
        </el-table-column>
        <!-- <el-table-column
          width="100"
          prop="overlayGiftcard"
          label="是否优惠券同时使用"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.overlayGiftcard || scope.row.overlayGiftcard == 0">{{scope.row.overlayGiftcard ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="overlayMemberCard"
          label="是否储值卡同时使用"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.overlayMemberCard || scope.row.overlayMemberCard == 0">{{scope.row.overlayMemberCard ? '是' : '否'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          width="100"
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
            <sys-value
              type="THC_CARD_BENEFIT_STATUS"
              :code="scope.row.status"
            ></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="330"
          fixed="right"
          align="left"
          prop="status"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="showUser(scope.$index, scope.row)"
            >查看会员</el-button>
            <el-button
              type="primary"
              v-if="(scope.row.status == 2 || scope.row.status == 4) && !isGroupControl && !scope.row.isClinic"
              @click="handleApply(scope.row)"
            >申请</el-button>
            <el-button
              type="primary"
              v-if="scope.row.status != 2 && isApproval && scope.row.businessCode && !isGroup"
              @click="showApply(scope.row)"
            >审批详情</el-button>
            <el-button
              type="primary"
              v-if="scope.row.status != 2"
              @click="showChangelist(scope.row)"
            >变更记录</el-button>
            <el-button
              type="danger"
              v-if="!isGroupControl && !scope.row.isClinic"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ever-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount" :current="current"></ever-pagination>
    <el-dialog
      title="变更记录"
      :close-on-click-modal="false"
      :visible.sync="showChangeVisible"
    >
      <el-row
        width="100%"
        class="tb-header"
        :gutter="8"
      >
        <el-col
          :span="4"
          align="center"
        >业务处理</el-col>
        <el-col
          :span="16"
          align="center"
        >处理的内容</el-col>
        <el-col
          :span="4"
          align="center"
        >操作人</el-col>
      </el-row>
      <template v-if="changeListData.length">
        <div
          v-for="(item, i) in changeListData"
          :key="i"
        >
          <el-row class="tb-title">
            <el-col :span="24">处理日期：{{item.createTime}}</el-col>
          </el-row>
          <table
            width="100%"
            class="tb-table"
            cellspacing="0"
            cellpadding="0"
          >
            <tr v-if="item.categoryDiffs.ADD.length > 0 || item.itemDiffs.ADD.length > 0 || (item.orgrangeDiffs && item.orgrangeDiffs.ADD && item.orgrangeDiffs.ADD.length)">
              <td
                width="16.6666667%"
                align="center"
              >增加</td>
              <td
                width="66.6666667%"
                align="center"
              >
                <span
                  v-for="value in item.changeObjList"
                  :key="value.name"
                  style="color:#222; font-size:14px; margin-right:10px;"
                >{{ value.name }}</span>
              </td>
              <td
                width="16.6666667%"
                align="center"
              >{{item.operatorName}}</td>
            </tr>
            <tr v-if="item.categoryDiffs.DEL.length > 0 || item.itemDiffs.DEL.length > 0 || (item.orgrangeDiffs && item.orgrangeDiffs.DEL && item.orgrangeDiffs.DEL.length)">
              <td
                width="16.6666667%"
                align="center"
              >删除</td>
              <td
                width="66.6666667%"
                align="center"
              >
                <span
                  v-for="value in item.itemDataList"
                  :key="value.name"
                  style="color:#222; font-size:14px; margin-right:10px;"
                >{{ value.name }}</span>
              </td>
              <td
                width="16.6666667%"
                align="center"
              >{{item.operatorName}}</td>
            </tr>
          </table>
        </div>
      </template>
      <template v-if="changeListData.length == 0">
        <el-row>
          <el-col
            :span="24"
            align="center"
          >没有变更记录</el-col>
        </el-row>
      </template>
    </el-dialog>
    <service-dialog
      ref="service"
      :itemIds="this.itemDataList"
      @selectChange="selectChangeSave"
    ></service-dialog>
    <id-card-users
      ref="idcardusers"
      :userData="usersData"
      :vipUserList="vipUserList"
      @selectUser="vipData"
    ></id-card-users>
    <select-user-pop
      ref="selectuser"
      :vipUsers="vipUsers"
      @selectUserVal="selectUser"
    ></select-user-pop>
</div>
</template>

<script>
import api from '@/card/store/idcardapi'
import sobApi from '@/sob/store/serviceapi'
import list from '@/util/list'
import sysvalue from '@/warehouse/store/sysvalueapi'
import serviceDialog from '@/sob/page/servicedialog'
import idCardUsers from '@/card/page/idcardmanage/idcardUsers'
import selectUserPop from '@/card/page/idcardmanage/idcardselectusers'
import selftariffsapi from '@/rcm/store/tariffs/selftariffsapi'
import codeApi from '@/card/store/packagemanagement/api.js'
import activityApi from '@/card/store/activityapi'
import {IDENTIFY_CARD_FILE_TYPE} from '@/util/common'

let querySchema = [
  {
    name: 'name',
    label: '身份卡名称',
    comp: 'custom'
  }
]

export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      tableData: [],
      itemDataList: [],
      changeListData: [],
      checkList: [],
      checkObjList: [],
      querySchema: querySchema,
      queryObj: obj,
      showItemDataTable: false,
      showChangeTab: false,
      emptyCntFlag: false,
      showChangeVisible: false,
      checkItemArr: [],
      categoryIds: [],
      itemIds: [],
      changeObjList: [],
      id: '',
      index: '',
      origId: '',
      usersData: [],
      vipUsers: [],
      vipUserList: [],
      selftariffArr: [],
      benefitId: 0,
      validPeriod: '',
      isApproval: false,
      time: null,
      isGroup: this.$route.matched[0].meta.crm ? 1 : 0,
      isGroupControl: true, // 是否集团管控
      mechanismOptions: [], // 机构城市arr
    }
  },
  created () {
    if (!this.isGroup) { // 查询机构是否可编辑
      codeApi.getClinicManageConfigForRecord({type: IDENTIFY_CARD_FILE_TYPE}).then(res => {
        if (res && res.data) this.isGroupControl = (String(res.data.isConfig) === '1')
      })
    } else {
      this.isGroupControl = false
    }
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
    activityApi.getClinicCityList({}).then(res => {
      if (res && res.data) this.mechanismOptions = [...res.data, ...[{ cityCode: '0', cityName: '全国' }]]
    })
  },
  methods: {
    list () {
      let params = Object.assign({}, this.queryObj, { offset: this.offset, pagesize: this.pagesize, isGroup: this.isGroup })
      api.list(params).then(res => {
        this.tableData = res.data.resultList || []
        this.totalCount = res.data.totalCount || 0
      })
    },
    edit (row) {
      this.$router.push({ path: `${ this.isGroup ? '/crm/idcardedit/' : '/card/idcardedit/'}${Number(row.status) === 0}?id=${row.id}` })
    },
    querySearchAsync (queryString, cb) {
      window.clearTimeout(this.time)
      this.time = null
      this.time = window.setTimeout(_ => {
        api.list({ name: String(queryString).trim(), isGroup: this.isGroup }).then(result => {
          this.time = null
          if (result.data && result.data.resultList && result.data.resultList.length) {
            result.data.resultList.forEach(item => {
              item['value'] = item.name
            })
          }
          cb(result.data.resultList || [])
        })
      }, 500)
    },
    handleClear () {
      this.queryObj.name = ''
      this.list()
    },
    handleSelect () {
      this.list()
    },
    onClosePop () {
      this.showChangeVisible = false
    },
    showChangelist (obj) {
      let params = {
        type: 3,
        objId: obj.id
      }
      api.getByTypeAndObjId(params).then(result => {
        this.changeListData = []
        if (result.data) {
          for (let i = 0; i < result.data.length; i++) {
            let row = result.data[i]
            row.changeObjList = []
            row.itemDataList = []
            let categoryIds = row.categoryDiffs.ADD
            if (categoryIds.length) {
              if (categoryIds[0] === '0') {
                row.changeObjList.push({ name: '全部分类' })
              } else {
                for (let j = 0; j < categoryIds.length; j++) {
                  sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', categoryIds[j], true).then(result => {
                    if (result) row.changeObjList.push(result)
                  })
                }
              }
            }
            let categoryIds1 = row.categoryDiffs.DEL
            if (categoryIds1.length) {
              if (categoryIds1[0] === '0') {
                row.itemDataList.push({ name: '全部分类' })
              } else {
                for (let k = 0; k < categoryIds1.length; k++) {
                  sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', categoryIds1[k], true).then(result => {
                    if (result) row.itemDataList.push(result)
                  })
                }
              }
            }
            let itemIds = row.itemDiffs.ADD
            if (itemIds.length) {
              sobApi.list({ ids: itemIds }).then(result => {
                if (result.data) {
                  result.data.map(item => {
                    row.changeObjList.push(item)
                  })
                }
              })
            }
            let itemIds1 = row.itemDiffs.DEL
            if (itemIds1.length) {
              sobApi.list({ ids: itemIds1 }).then(result => {
                if (result.data) {
                  result.data.map(item => {
                    row.itemDataList.push(item)
                  })
                }
              })
            }
            if (row.orgrangeDiffs) {
              if (row.orgrangeDiffs.ADD && row.orgrangeDiffs.ADD.length) this.initChangeLog(row.orgrangeDiffs.ADD, row.changeObjList) // 获取关联机构的新增记录
              if (row.orgrangeDiffs.DEL && row.orgrangeDiffs.DEL.length) this.initChangeLog(row.orgrangeDiffs.DEL, row.itemDataList) // 获取关联机构的删除记录
            }
          }
          this.showChangeVisible = true
          this.changeListData = result.data
        } else {
          this.showChangeVisible = true
        }
      })
    },
    initChangeLog (arr, arrt) {
      if (arr.length) {
        arr.forEach(item => {
          if (this.mechanismOptions.find(val => val.cityCode === item)) arrt.push({ name: (this.mechanismOptions.find(val => val.cityCode === item)).cityName })
        })
      }
    },
    showApply (row) {
      this.$router.push({
        path: '/card/idcard',
        query: {
          id: row.id,
          viewApproval: true
        }
      })
    },
    handleApply (obj) {
      api.apply({id: obj.id, isGroup: this.isGroup}).then(result => {
        this.list()
      })
    },
    handleDelete (i, row) {
      this.$confirm(this.$t('此操作将永久删除该记录, 是否继续?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        api.del({id: row.id, isGroup: this.isGroup}).then(result => {
          if (result.head.errCode !== 0) {
          } else {
            this.$messageTips(this, 'success', '删除成功')
            this.list()
          }
        })
      })
    },
    vipData (data) {
      this.vipUsers = data.tableData
      if (data.tableData) {
        data.tableData.forEach(item => {
          item.checked = 1
        })
      }
      this.$refs.selectuser.onDialogOpen(data.name, data.tableData, this.$route.query.shareCount)
    },
    selectUser (selected) {
      this.vipUserList = selected
    },
    showUser (i, rs) {
      this.benefitId = rs.id
      this.validPeriod = rs.validPeriod
      this.usersData = rs
      this.$refs.idcardusers.dialogTableVisible = true
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
    }
  },
  components: {
    serviceDialog,
    idCardUsers,
    selectUserPop
  }
}
</script>
<style scoped>
.tb-header {
  background-color: #eef1f6;
  line-height: 40px;
  text-align: center;
  margin-bottom: 10px;
}
.tb-title {
  background-color: #eef1f6;
  line-height: 30px;
  padding: 0 10px;
}
.tb-table {
  border-left: 1px solid #eef1f6;
  border-top: 1px solid #eef1f6;
  line-height: 30px;
}
.tb-table td {
  border-bottom: 1px solid #eef1f6;
  border-right: 1px solid #eef1f6;
}
</style>


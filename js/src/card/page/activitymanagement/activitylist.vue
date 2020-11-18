<template>
  <div class="layout_inner df fdc oh h100">
    <div class="main-head">
      <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true" ref="form" class="package-sale" :labelWidth="140" label-position="right" :is-query="true" v-ever-bind-enter @query="list(true)">
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list(true)">查询</el-button>
          </el-form-item>
          <el-form-item class="fr" v-if="!isGroupControl">
            <router-link :to="isGroup ? '/manages/activityadd' : '/card/activityadd'">
              <el-button type="primary">新建活动</el-button>
            </router-link>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div :class="isGroup ? 'flex_col_1_hidden main-wrap' : ''">
      <el-table :class="isGroup ? 'flex_column_full_hidden' : ''" v-loading.body="loading" :data="tableData" style="width: 100%" :border="false">
        <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="活动名称">
          <template slot-scope="scope">
            <a href="javascript:void(0)" @click="edit(scope.row)">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          prop="terminalName"
          label="展示终端"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column width="80" label="折扣">
          <template slot-scope="scope">
            <span v-if="scope.row.discountRule">{{selftariffsArr.filter(v => { return v.id == scope.row.discountRule })[0] && selftariffsArr.filter(v => { return v.id == scope.row.discountRule })[0].masterName }}</span>
            <span v-else-if="scope.row.saleMoney || scope.row.saleMoney == 0">减免金额{{scope.row.saleMoney}}元</span>
            <span v-else>{{scope.row.discount || scope.row.discount == 0 ? scope.row.discount + '%' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" prop="saleMoney" align="right" label="减免金额">
          <template slot-scope="scope">
            <span>{{scope.row.saleMoney | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="活动时间" width="310">
          <template slot-scope="scope">{{scope.row.startDate + ' 至 ' + scope.row.endDate}}</template>
        </el-table-column>
        <!-- <el-table-column width="70" prop="canUseCard" label="能否优惠券同时使用">
          <template slot-scope="scope">{{scope.row.canUseCard?'是':'否'}}</template>
        </el-table-column>
        <el-table-column width="70" prop="canUseBenefit" label="是否身份卡同时使用">
          <template slot-scope="scope">{{scope.row.canUseBenefit?'是':'否'}}</template>
        </el-table-column> -->
        <el-table-column width="70" prop="status" label="状态">
          <template slot-scope="scope">{{scope.row.status==1?'审核中':scope.row.status==2?'激活':scope.row.status==3?'删除':scope.row.status==4?'结束':'取消'}}</template>
        </el-table-column>
        <el-table-column width="120" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop label="操作" width="240">
          <template slot-scope="scope">
            <el-button type="primary" v-if="isApproval && scope.row.businessCode && !isGroup" @click="showApply(scope.row)">审批详情</el-button>
            <el-button type="primary" @click="showChangelist(scope.row)">变更记录</el-button>
            <el-button type="danger" v-if="!isGroupControl && !scope.row.isClinic" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ever-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount" :current="current"></ever-pagination>
    <el-dialog title="变更记录" :close-on-click-modal="false" :visible.sync="showChangeVisible">
      <el-row width="100%" class="tb-header" :gutter="8">
        <el-col :span="4" align="center">业务处理</el-col>
        <el-col :span="16" align="center">处理的内容</el-col>
        <el-col :span="4" align="center">操作人</el-col>
      </el-row>
      <template v-if="changeListData.length">
        <el-row class="tb-title" v-for="(item, index) in changeListData" :key="index">
          <el-col :span="24">处理日期：{{item.createTime}}</el-col>
          <table width="100%" class="tb-table" cellspacing="0" cellpadding="0">
            <tr v-if="item.categoryDiffs.ADD.length || item.itemDiffs.ADD.length || item.dptrangeDiffs.ADD.length || item.orgrangeDiffs.ADD.length">
              <td width="16.6666667%" align="center">增加</td>
              <td width="66.6666667%" align="center">
                <span v-for="(value, index) in item.changeObjList" :key="index" style="color:#222; font-size:14px; margin-right:10px;">{{ value.name }}</span>
              </td>
              <td width="16.6666667%" align="center">{{item.operatorName}}</td>
            </tr>
            <tr v-if="item.categoryDiffs.DEL.length || item.itemDiffs.DEL.length || item.dptrangeDiffs.DEL.length || item.orgrangeDiffs.DEL.length">
              <td width="16.6666667%" align="center">删除</td>
              <td width="66.6666667%" align="center">
                <span v-for="(value, index) in item.itemDataList" :key="index" style="color:#222; font-size:14px; margin-right:10px;">{{ value.name }}</span>
              </td>
              <td width="16.6666667%" align="center">{{item.operatorName}}</td>
            </tr>
          </table>
        </el-row>
      </template>
      <template v-if="changeListData.length == 0">
        <el-row>
          <el-col :span="24" align="center">没有变更记录</el-col>
        </el-row>
      </template>
    </el-dialog>
    <service-dialog ref="service" :itemIds="this.itemDataList" @selectChange="selectChange"></service-dialog>
    <categories-dialog ref="ategories" :catetoriesIds="this.checkList" @selectChange="selectChangeCate"></categories-dialog>
  </div>
</template>
<script>
import api from '@/card/store/activityapi'
import serviceDialog from '@/sob/page/servicedialog'
import categoriesDialog from '@/card/page/categoriesdialog'
import sobapi from '@/sob/store/serviceapi'
import list from '@/util/list'
import selftariffsApi from '@/rcm/store/tariffs/selftariffsapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { ACTIVITY_FILE_TYPE } from '@/util/common'
import packageManagementApi from '@/card/store/packagemanagement/api'
import { CATEGORYIDS_TYPE } from '@/card/util/cardcommon'

let schema = [
  {
    name: 'name',
    label: '活动名称'
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.isGroup = this.$route.matched[0].meta.manage ? 1 : 0
    return {
      querySchema: schema,
      queryObj: obj,
      isApproval: false,
      showChangeVisible: false,
      showItemDataTable: false,
      showChangeTab: false,
      checkObjList: [],
      itemDataList: [],
      checkList: [],
      checkItemArr: [],
      categoryIds: [],
      discountSelect: '',
      discount: '',
      itemIds: [],
      changeObjList: [],
      changeListData: [],
      selectData: [],
      selftariffsArr: [],
      departmentInfo: {
        departmentDialog: false,
        title: '查看科室',
        values: [],
        options: [],
        isEdit: false,
        id: ''
      },
      mechanismInfo: {
        mechanismInfoDialog: false,
        title: '查看机构',
        values: [],
        options: [],
        isEdit: false,
        id: ''
      },
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0,
      isGroupControl: true
    }
  },
  created () {
    if (!this.isGroup) { // 查询机构是否可编辑
      packageManagementApi.getClinicManageConfigForRecord({type: ACTIVITY_FILE_TYPE}).then(res => {
        if (res && res.data) this.isGroupControl = (String(res.data.isConfig) === '1')
      })
    } else {
      this.isGroupControl = false
    }
    this.initCheckboxs()
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
      this.typeoptions = []
      res.forEach(item => {
        if (item.parentId === '297' || item.parentId === '294' || item.parentId === '296' || item.parentId === '798') {
          this.typeoptions.push(item)
        }
      })
      this.checkItemArr = this.typeoptions
    })
    packageManagementApi.getApprovalCode().then(rs => {
      this.isApproval = rs.data === '1'
    })
    selftariffsApi.list().then(res => {
      if (res && res.data) this.selftariffsArr = res.data
    })
  },
  methods: {
    list (refresh) {
      if (refresh) {
        this.offset = 0
      }
      let params = Object.assign({}, this.queryObj, { offset: this.offset, pagesize: this.pagesize, isGroup: this.isGroup })
      api.list(params).then(res => {
        this.tableData = res.data.resultList || []
        this.totalCount = res.data.totalCount || 0
      })
    },
    initCheckboxs () {
      packageManagementApi.getDptsByOrgId({ type1CodeList: [CATEGORYIDS_TYPE[0].id] }).then(result => {
        if (result && result.data && result.data.resultList) this.departmentInfo.options = [...result.data, ...[{ id: '0', orgSubjectCode: '0', orgSubjectName: '全部科室' }]]
      })
      api.getClinicCityList({}).then(res => {
        if (res && res.data) this.mechanismInfo.options = [...res.data, ...[{ cityCode: '0', cityName: '全国' }]]
      })
    },
    edit (row) {
      let statusNum = Number(row.status)
      this.$router.push({ path: `${this.isGroup ? '/manages/activitydetail/' : '/card/activitydetail/'}${statusNum === 2 || statusNum === 4 || statusNum === 5}?id=${row.id}` })
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    handleDelete (i, row) {
      this.$confirm(this.$t('此操作将永久删除该记录, 是否继续?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        Object.assign(row, { isGroup: this.isGroup })
        api.del(row).then(result => {
          if (result.head.errCode === 0) {
            this.list(true)
          }
        })
      })
    },
    showApply (row) {
      this.$router.push({
        path: '/card/activityadd',
        query: {
          id: row.id,
          viewApproval: true
        }
      })
    },
    selectChange (selects) {
      this.itemDataList = []
      selects.forEach(item => {
        if (this.discount) {
          item.discount = this.discount
        }
        item.rangeId = item.id
        this.itemDataList.push(item)
      })
      return this.itemDataList
    },
    selectChangeCate (selects) {
      this.checkList = []
      selects.forEach(item => {
        if (this.discount) {
          item.discount = this.discount
        }
        item.rangeId = item.id
        this.checkList.push(item)
      })
      return this.checkList
    },
    initChange (arr, arrt, key) {
      if (arr.length) {
        if (arr[0] === '0' && key === 1) {
          arrt.push({ name: '全部分类' })
        } else if (key === 2) {
          for (let j = 0; j < arr.length; j++) {
            api.queryService({ ids: [arr[j]] }).then(result => {
              if (result.data && result.data.length) arrt.push(result.data[0])
            })
          }
        } else {
          for (let j = 0; j < arr.length; j++) {
            sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', arr[j]).then(result => {
              if (result) arrt.push({name: result})
            })
          }
        }
      }
    },
    initDepartmentChange (arr, arrt) {
      if (arr.length) {
        arr.forEach(item => {
          if (this.departmentInfo.options.find(val => item === val.id)) arrt.push({ name: (this.departmentInfo.options.find(val => val.id === item)).orgSubjectName })
          if (this.mechanismInfo.options.find(val => (item === val.cityCode))) arrt.push({ name: (this.mechanismInfo.options.find(val => item === val.cityCode)).cityName })
        })
      }
    },
    showChangelist (obj) {
      this.changeListData = []
      let params = {
        type: 4,
        objId: obj.id
      }
      api.getByTypeAndObjId(params).then(result => {
        if (result.data) {
          for (let i = 0; i < result.data.length; i++) {
            let row = result.data[i]
            row.changeObjList = []
            row.itemDataList = []
            this.initChange(row.categoryDiffs.ADD, row.changeObjList, 1) // 获取分类的新增记录
            this.initChange(row.categoryDiffs.DEL, row.itemDataList, 1) // 获取分类的删除记录
            this.initChange(row.itemDiffs.ADD, row.changeObjList, 2) // 获取项目的新增记录
            this.initChange(row.itemDiffs.DEL, row.itemDataList, 2) // 获取项目的删除记录
            this.initDepartmentChange(row.dptrangeDiffs.ADD, row.changeObjList) // 获取科室的新增记录
            this.initDepartmentChange(row.dptrangeDiffs.DEL, row.itemDataList) // 获取科室的删除记录
            this.initDepartmentChange(row.orgrangeDiffs.ADD, row.changeObjList) // 获取关联机构的新增记录
            this.initDepartmentChange(row.orgrangeDiffs.DEL, row.itemDataList) // 获取关联机构的删除记录
          }
          this.showChangeVisible = true
          this.changeListData = [...result.data]
        } else {
          this.showChangeVisible = true
        }
      })
    }
  },
  beforeCreate () {
    this.sobapi = sobapi
  },
  components: {
    serviceDialog,
    categoriesDialog
  }
}
</script>
<style scoped>
.tb-header {
  background-color: #eef1f6;
  line-height: 40px;
  text-align: center;
  margin: 0 0 10px 0 !important;
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
.depart_dialog /deep/ .el-checkbox {
  margin-left: 30px;
  margin-bottom: 10px;
}
</style>

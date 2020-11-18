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
          :inline="true"
        >
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <el-button
                type="primary"
                @click="$router.push('/card/giftbatchadd/-1')"
                v-if="$hasPermission('Auth_menu_market_giftbatchs_giftbatchs_newBtn')"
              >新建</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <div v-if="tableData && tableData.length > 0">
        <el-table
          :data="tableData"
          v-loading.body="loading"
          border
        >
          <el-table-column
            prop
            type="index"
            label="序号"
            width="55"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="type"
            label="类型"
          >
            <template slot-scope="scope">
              <sys-value
                type="THC_CARD_GIFTBATCH_TYPE"
                :code="scope.row.type"
              ></sys-value>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="150"
          >
            <template slot-scope="scope">
              <a
                href="javascript:void(0)"
                @click="modifydetail(scope.row)"
              >{{scope.row.name}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="money"
            align="right"
            width="120"
            label="面额"
          >
            <template slot-scope="scope">{{scope.row.money | formatToFinacial}} 元</template>
          </el-table-column>
          <el-table-column
            prop="threshold"
            label="满减范围"
            width="150"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.threshold > 0">满{{scope.row.threshold}}元可用</span>
              <span v-else>-- --</span>
            </template>
          </el-table-column>
          <el-table-column
            width="140"
            prop="terminalName"
            label="展示终端"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop
            label="使用有效期"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{$moment(scope.row.useStartTime).format('YYYY-MM-DD')}} - {{$moment(scope.row.useEndTime).format('YYYY-MM-DD')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
          >
            <template slot-scope="scope">
              <sys-value
                type="THC_CARD_GIFTBATCH_STATUS"
                :code="scope.row.status"
              ></sys-value>
            </template>
          </el-table-column>
          <el-table-column
            prop="comment"
            label="渠道备注"
            width="150"
          ></el-table-column>
          <el-table-column
            label="计划发行数量"
            width="150"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.totalCount">{{scope.row.totalCount}} 张</span>
              <span v-else>0 张</span>
            </template>
          </el-table-column>
          <el-table-column
            label="制券数量"
            width="150"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.exportCount">{{scope.row.exportCount}} 张</span>
              <span v-else>0 张</span>
            </template>
          </el-table-column>
          <el-table-column
            label="已发券数量"
            width="150"
          >
            <template slot-scope="scope">{{scope.row.sendCount - scope.row.exportCount}} 张</template>
          </el-table-column>
          <el-table-column
            label="已使用数量"
            width="150"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.usedCount">{{scope.row.usedCount}} 张</span>
              <span v-else>0 张</span>
              <!-- {{scope.row.usedCount}} 张 -->
            </template>
          </el-table-column>
          <el-table-column
            label="剩余数量"
            width="150"
          >
            <template slot-scope="scope">{{scope.row.totalCount - scope.row.sendCount}} 张</template>
          </el-table-column>
          <el-table-column
            prop
            header-align="center"
            label="操作"
            width="400"
            fixed="right"
            align="left"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-if="scope.row.status == 2 && (scope.row.totalCount - scope.row.sendCount) > 0 && scope.row.sellChannel != 2 && $hasPermission('Auth_menu_market_giftbatchs_giftbatchs_sendBtn')"
                @click="handleSend(scope.$index, scope.row)"
              >发券</el-button>
              <el-button
                type="primary"
                v-if="scope.row.status == 2 && (scope.row.totalCount - scope.row.sendCount) > 0 && scope.row.sellChannel != 2 && $hasPermission('Auth_menu_market_giftbatchs_giftbatchs_generateBtn')"
                @click="handleGenerate(scope.$index, scope.row)"
              >制券</el-button>
              <el-button
                type="primary"
                v-if="scope.row.status == 0 || scope.row.status == 5"
                @click="handleApply(scope.row)"
              >申请</el-button>
              <el-button
                type="primary"
                v-if="scope.row.status == 0 || scope.row.status == 5"
                @click="$router.push('/card/giftbatch?id=' + scope.row.id)"
              >编辑</el-button>
              <el-button
                type="primary"
                v-if="scope.row.status != 0 && isApproval && scope.row.businessCode"
                @click="showApply(scope.row.businessCode)"
              >审批详情</el-button>
              <el-button
                type="primary"
                v-if="scope.row.status != 0"
                @click="showChangelist(scope.row)"
              >变更记录</el-button>
              <el-button
                type="primary"
                v-if="$hasPermission('Auth_menu_market_giftbatchs_giftbatchs_showDetailBtn')"
                @click="$router.push('/card/giftbatchdetail/' + scope.row.id+'/'+scope.row.money)"
              >查看数据</el-button>
              <el-dropdown
                style="float:right;"
                v-if="scope.row.status != 4"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span
                      v-if="scope.row.status == 2 && $hasPermission('Auth_menu_market_giftbatchs_giftbatchs_pauseBtn')"
                      @click="handlePause(scope.$index, scope.row)"
                    >暂停</span>
                    <span
                      v-if="scope.row.status == 3 && $hasPermission('Auth_menu_market_giftbatchs_giftbatchs_resumeBtn')"
                      @click="handleResume(scope.$index, scope.row)"
                    >恢复</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span
                      v-if="$hasPermission('Auth_menu_market_giftbatchs_giftbatchs_stopBtn')"
                      @click="handleStop(scope.$index, scope.row)"
                    >结束</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ever-no-data height="180" v-else></ever-no-data>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>

    <el-dialog
      title="生成数量"
      :visible.sync="dialogVisible"
      class="ui_dialog_02 spe"
      :close-on-click-modal="false"
    >
      <el-form
        :model="genrateFrm"
        ref="genrateFrm"
        class="demo-form-inline"
        label-width="100px"
      >
        <el-form-item
          label="输入数量"
          prop="num"
          :rules="[
          { required: true, message: '必填项', trigger: 'blur' }
        ]"
        >
          <el-input
            type="number"
            v-model="genrateFrm.num"
            placeholder="输入数量"
          >
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item></el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">
          <i class="iconfont icon-quxiao"></i>取消
        </el-button>
        <el-button
          type="primary"
          @click="handleGenerateSubmit('genrateFrm')"
        >
          <i class="iconfont icon-tijiao"></i>提交
        </el-button>
      </div>
    </el-dialog>
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
        <div v-for="(item, i) in changeListData" :key="i">
          <el-row class="tb-title" :key="i">
            <el-col :span="24">处理日期：{{item.createTime}}</el-col>
          </el-row>
          <table
            width="100%"
            class="tb-table"
            cellspacing="0"
            cellpadding="0"
          >
            <tr v-if="item.categoryDiffs.ADD.length > 0 || item.itemDiffs.ADD.length > 0 || item.dptrangeDiffs.ADD.length > 0">
              <td
                width="16.6666667%"
                align="center"
              >增加</td>
              <td
                width="66.6666667%"
                align="center"
              >
                <span
                  v-for="(value, j) in item.changeObjList"
                  :key="j"
                  style="color:#222; font-size:14px; margin-right:10px;"
                >{{ value.name }}</span>
              </td>
              <td
                width="16.6666667%"
                align="center"
              >{{item.operatorName}}</td>
            </tr>
            <tr v-if="item.categoryDiffs.DEL.length > 0 || item.itemDiffs.DEL.length > 0 || item.dptrangeDiffs.DEL.length > 0">
              <td
                width="16.6666667%"
                align="center"
              >删除</td>
              <td
                width="66.6666667%"
                align="center"
              >
                <span
                  v-for="(value, k) in item.itemDataList"
                  :key="k"
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
      <div style="margin-top:20px;"></div>
    </el-dialog>

    <select-user-pop
      ref="selectuser"
      @selectUserVal="setSelectData"
    ></select-user-pop>
    <service-dialog
      ref="service"
      :itemIds="this.itemDataList"
      @selectChange="selectChangeSave"
    ></service-dialog>
  </div>
</template>

<script>
import idcard from '../store/idcardapi'
import api from '../store/giftbatchapi'
import packageManagementApi from '@/card/store/packagemanagement/api'
import list from '../../util/list'
import selectUserPop from '../page/selectusers'
import serviceDialog from '../../sob/page/servicedialog'
import sysvalue from '@/warehouse/store/sysvalueapi'
import sobapi from '../../sob/store/serviceapi'
import { CATEGORYIDS_TYPE } from '@/card/util/cardcommon'
import activityApi from '@/card/store/activityapi'
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'

var querySchema = [
  {
    name: 'name',
    label: '优惠券名称',
    placeholder: '输入名称'
  },
  {
    name: 'status',
    label: '优惠券状态',
    comp: 'sys-type',
    props: {
      code: 'THC_CARD_GIFTBATCH_STATUS'
    }
  }
]

export default {
  mixins: [list],
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      values: [],
      loading: false,
      isApproval: false,
      tableData: [],
      changeListData: [],
      querySchema,
      queryObj,
      itemDataList: [],
      checkList: [],
      checkObjList: [],
      dialogTableVisible: false,
      showItemDataTable: false,
      showChangeVisible: false,
      showChangeTab: false,
      departmentInfo: {
        id: '',
        radio: '1',
        key: 1,
        visible: false,
        options: [],
        values: []
      },
      testkey: '',
      currentRowId: 0,
      indexRow: 0,
      dialogVisible: false,
      genrateFrm: {},
      checkItemArr: [],
      categoryIds: [],
      itemIds: [],
      id: '',
      index: '',
      origId: '',
      options: []
    }
  },
  methods: {
    modifydetail (row) {
      if (Number(row.status) === 2) {
        this.$router.push('/card/giftbatchedit/' + row.id + '/' + true)
      } else {
        this.$router.push('/card/giftbatch?id=' + row.id)
      }
    },
    getCheckbox () {
      packageManagementApi.getDptsByOrgId({ categoryIds: [CATEGORYIDS_TYPE[0].id] }).then(result => {
        if (result && result.data && result.data.resultList) {
          this.departmentInfo.options = result.data.resultList
        }
      })
    },
    departmentBtn () {
      let params = { id: this.departmentInfo.id }
      if (this.departmentInfo.radio === '1') {
        params.dptIdsList = ['0']
      } else {
        params.dptIdsList = this.departmentInfo.values
      }
      api.modifyDptService(params).then(result => {
        if (result.head.errCode === 0) {
          this.$messageTips(this, 'success', '变更成功')
          this.query()
        }
        this.departmentInfo.visible = false
      })
    },
    showChangelist (obj) {
      let params = {
        type: 2,
        objId: obj.id
      }
      idcard.getByTypeAndObjId(params).then(result => {
        this.changeListData = []
        if (result.data) {
          for (let i = 0; i < result.data.length; i++) {
            let row = result.data[i]
            row.changeObjList = []
            row.itemDataList = []
            this.initChange(row.categoryDiffs.ADD, row.changeObjList, 1) // 获取分类的新增记录
            this.initChange(row.categoryDiffs.DEL, row.itemDataList, 1) // 获取分类的删除记录
            this.initChange(row.itemDiffs.ADD, row.changeObjList, 2) // 获取项目的新增记录
            this.initChange(row.itemDiffs.DEL, row.itemDataList, 2) // 获取项目的删除记录
            this.initDepartmentChange(row.dptrangeDiffs.ADD, row.changeObjList, 1) // 获取科室的新增记录
            this.initDepartmentChange(row.dptrangeDiffs.DEL, row.itemDataList, 1) // 获取科室的删除记录
          }
          this.showChangeVisible = true
          this.changeListData = result.data
        } else {
          this.showChangeVisible = true
        }
      })
    },
    initChange (arr, arrt, key) {
      if (arr.length) {
        if (arr[0] === '0' && key === 1) {
          arrt.push({ name: '全部分类' })
        } else if (key === 2) {
          for (let j = 0; j < arr.length; j++) {
            activityApi.queryService({ ids: [arr[j]] }).then(result => {
              if (result.data && result.data.length) arrt.push(result.data[0])
            })
          }
        } else {
          for (let j = 0; j < arr.length; j++) {
            sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', arr[j], true).then(result => {
              if (result) arrt.push(result)
            })
          }
        }
      }
    },
    initDepartmentChange (arr, arrt, key) {
      if (arr[0] === '0' && key === 1) {
        arrt.push({ name: '全部分类' })
      } else {
        arr.forEach(item => {
          arrt.push({ name: this.departmentInfo.options.find(val => val.id === item) && (this.departmentInfo.options.find(val => val.id === item)).orgSubjectName })
        })
      }
    },
    showApply (businessCode) {
      request(urlMap.process.getInstanceInfoByBusinessCode, { businessCode }).then(res => {
        if (res.head.errCode === 0) window.open(`${this.$ever.systemsetIndex}/approval/${res.data[0].processInstanceId}`)
      })
    },
    handleApply (obj) {
      api.apply(obj.id).then(result => {
        this.list()
      })
    },
    updateLog (row, key) {
      let values = []
      if (row.dptIds) {
        values = row.dptIds.split(',')
      }
      values.pop()
      values.shift()
      this.values = values
      this.departmentInfo.key = key
      this.departmentInfo.id = row.id
      this.departmentInfo.values = values
      this.departmentInfo.radio = this.departmentInfo.values.includes('0') ? '1' : '2'
      this.departmentInfo.visible = true
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
      let params = { 'itemIds': this.itemIds, 'categoryIds': this.categoryIds, 'id': this.id, 'origId': this.origId }
      this.api.modify(params).then(result => {
        this.showChangeTab = false
        this.tableData[this.index].serviceIds = result.data.serviceIds
        // this.tableData = Object.assign({}, this.tableData)
      })
    },
    handlePause (index, row) {
      this.$confirm('确定要暂停该批优惠券吗?').then(() => {
        return this.api.pause(row.id)
      }).then(() => {
        this.list()
      }).catch((e) => {

      })
    },
    handleStop (index, row) {
      this.$confirm('确定要停止该批优惠券吗?').then(() => {
        return this.api.stop(row.id)
      }).then(() => {
        this.list()
      }).catch((e) => {

      })
    },
    handleResume (index, row) {
      this.$confirm('确定要恢复该批优惠券吗?').then(() => {
        return this.api.resume(row.id)
      }).then(() => {
        this.list()
      }).catch((e) => {

      })
    },
    handleGenerate (index, row) {
      this.currentRowId = row.id
      this.indexRow = index
      this.dialogVisible = true
    },
    handleGenerateSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = {
            id: this.currentRowId,
            num: this.genrateFrm.num
          }
          this.api.exportGift(params).then((response) => {
            if (response.head.errCode === 0) {
              this.$messageTips(this, 'success', '成功')
              this.dialogVisible = false
              this.list()
            }
          })
        }
      })
    },
    handleSend (index, row) {
      var initSelect = []
      this.$refs.selectuser.onDialogOpen(this.testkey, initSelect, 1)
      this.currentRowId = row.id
      this.indexRow = index
    },
    setSelectData (selected) {
      var _id = selected.data[0].id
      this.api.send({
        batchId: this.currentRowId,
        patientId: _id
      }).then((result) => {
        this.$messageTips(this, 'success', '成功')
        this.tableData[this.indexRow].sendCount = this.tableData[this.indexRow].sendCount + 1
        this.list()
      })
    }
  },
  created () {
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
    this.getCheckbox()
  },
  beforeCreate () {
    this.api = api
    this.sobapi = sobapi
  },
  components: {
    selectUserPop,
    serviceDialog
  },
  watch: {
    'departmentInfo.radio' (val) {
      if (val === '1' && this.departmentInfo.key === 2) {
        this.departmentInfo.values = []
      } else if (val === '2' && this.departmentInfo.key === 2) {
        this.departmentInfo.values = this.values
      }
    }
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

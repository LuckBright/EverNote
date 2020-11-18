<template>
  <div id="carditem">
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          @query="list(true)"
          ref="form"
          :labelWidth="140"
          label-position="right"
          :inline="true"
          :is-query="true"
          v-ever-bind-enter
        >
          <template slot="patientId">
            <ever-patient-select v-model="queryObj.patientId"></ever-patient-select>
          </template>
          <template slot="cardBuyer">
            <ever-patient-select v-model="queryObj.cardBuyer"></ever-patient-select>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <router-link :to="'/card/sellcard'">
                <el-button type="primary">卡号开卡</el-button>
              </router-link>
              <!-- <router-link :to="'/card/opencard'"><el-button type="primary">开卡</el-button></router-link> -->
              <doc-download @downFile="downFile" @exportStatus="handleExportStatus" ref="childMethod"></doc-download>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <div v-if="tableData && tableData.length > 0">
        <el-table :data="tableData" v-loading.body="loading" border>
          <el-table-column prop label="序号" type="index" width="60"></el-table-column>
          <el-table-column prop="createTime" label="售卡时间" min-width="180"></el-table-column>
          <el-table-column prop="startDate" label="开卡时间" min-width="180"></el-table-column>
          <el-table-column prop="code" label="卡号" min-width="150"></el-table-column>
          <el-table-column label="购买人" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.cardBuyerName">{{scope.row.cardBuyerName}}</span>
              <span v-else-if="scope.row.patient">{{scope.row.patient.name}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="batchType" label="储值卡类型" width="100">
            <template slot-scope="scope">
              <sys-value type="THC_CARD_MEMBERCARD_TYPE" :code="scope.row.batchType"></sys-value>
            </template>
          </el-table-column>
          <el-table-column prop="memberCardBatch.name" label="储值卡名称" min-width="200"></el-table-column>
          <el-table-column label="持卡人档案号" min-width="150">
            <template slot-scope="scope">
              <span v-if="!scope.row.patient">--</span>
              <span v-if="scope.row.patient">{{scope.row.patient.patientNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column label="持卡人手机号" width="110">
            <template slot-scope="scope">
              <span v-if="!scope.row.patient">--</span>
              <span v-if="scope.row.patient">{{scope.row.patient.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column label="持卡人" width="100">
            <template slot-scope="scope">
              <span style="color: #1c7bef" v-if="!scope.row.patient">未开卡</span>
              <span v-if="scope.row.patient">{{scope.row.patient.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="memberCardBatch.moneyThreshold"
            label="开/售卡金额"
            align="right"
            width="100"
          >
            <template
              slot-scope="scope"
            >{{Number(scope.row.memberCardBatch.moneyThreshold) > 0 ? Number(scope.row.memberCardBatch.moneyThreshold) : '0.00' | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column prop label="余额" align="right" width="140">
            <template
              slot-scope="scope"
            >{{Number(scope.row.storedMoney + scope.row.givedMoney) > 0 ? Number(scope.row.storedMoney + scope.row.givedMoney) : '0.00' | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column prop="storedMoney" label="储值金额" align="right" width="140">
            <template
              slot-scope="scope"
            >{{Number(scope.row.storedMoney) > 0 ? Number(scope.row.storedMoney) : '0.00' | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column prop="givedMoney" label="赠送金额" align="right" width="140">
            <template
              slot-scope="scope"
            >{{Number(scope.row.givedMoney) > 0 ? Number(scope.row.givedMoney) : '0.00' | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column label="折扣" width="140" :formatter="formatDiscount">
            <template slot-scope="scope">
              <span
                v-if="scope.row.batchType == 2 && scope.row.memberCardBatch.discount"
              >{{(scope.row.memberCardBatch.discount/10).toFixed(1)}}折</span>
              <span v-else-if="scope.row.memberCardBatch.discountRule">
                {{selftariffArr.filter(v => {
                return v.id == scope.row.memberCardBatch.discountRule
                })[0] && selftariffArr.filter(v => {
                return v.id == scope.row.memberCardBatch.discountRule
                })[0].masterName
                }}
              </span>
              <span
                v-else-if="scope.row.batchType == 1 && scope.row.memberCardBatch.givedMoney"
              >{{scope.row.memberCardBatch.givedMoney}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="卡状态" width="100">
            <template slot-scope="scope">
              <sys-value type="THC_CARD_MEMBERCARD_STATUS" :code="scope.row.status"></sys-value>
            </template>
          </el-table-column>
          <el-table-column label="有效期" width="220">
            <template
              slot-scope="scope"
            >{{$moment(scope.row.startDate).format('YYYY-MM-DD')}} 至 {{scope.row.endDate ? $moment(scope.row.endDate).format('YYYY-MM-DD') : '- -'}}</template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" width="260" fixed="right" align="left">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="showPop1(scope.$index, scope.row, '储值卡转卡')"
                :disabled="scope.row.status == 2"
                v-if="scope.row.status != 3 && scope.row.status != 4 && scope.row.batchId != 99999"
              >转卡</el-button>
              <el-button type="primary" @click="showRecords(scope.$index, scope.row)">交易记录</el-button>
              <el-button
                type="primary"
                @click="shareUsers(scope.$index, scope.row)"
                :disabled="!scope.row.patient || !scope.row.memberCardBatch.shareCount || scope.row.status == 2"
                v-if="scope.row.status == 0 || scope.row.status == 2"
              >管理共享人</el-button>
              <el-dropdown
                @command="showPop"
                style="float:right;"
                v-if="scope.row.status != 3 && scope.row.status != 4 && scope.row.batchId != 99999"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{data: scope, title: '储值卡延期'}">
                    <span
                      v-if="scope.row.memberCardBatch.canDelay == 1 && scope.row.delayedCount < scope.row.memberCardBatch.maxDelayCount && scope.row.status == 0"
                    >延期</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="{data: scope, title: '储值卡退卡'}">
                    <span v-if="scope.row.status != 5">退卡</span>
                  </el-dropdown-item>
                  <el-dropdown-item :command="{data: scope, title: '储值卡冻结'}">
                    <span v-if="scope.row.status == 0">冻结</span>
                    <span v-if="scope.row.status == 2">解冻</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
          :pagesize="pagesize"
        ></ever-pagination>
      </div>
      <ever-no-data height="180" v-else></ever-no-data>
    </div>
    <el-dialog
      title="储值卡延期"
      :visible.sync="delayPopShow"
      class="ui_dialog_02 spe"
      :close-on-click-modal="false"
    >
      <el-form
        :model="delayData"
        ref="delayData"
        :label-position="labelPosition"
        label-width="200px"
      >
        <el-form-item label="已延期次数：" prop="delayedCount">{{delayData.delayedCount}}</el-form-item>
        <el-form-item label="剩余延期次数：" prop="delayCount">{{delayData.delayCount}}</el-form-item>
        <el-form-item label="延期后到期时间为：" prop="endDate">{{delayData.endDate}}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDelayForm('delayData')">
          <i class="iconfont icon-tijiao"></i>确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="popTitle"
      :visible.sync="popShow"
      class="ui_dialog_02 spe carditem"
      :close-on-click-modal="false"
    >
      <ever-form
        ref="upgradeform"
        v-show="popTitle=='储值卡转卡'"
        v-model="upgradeData"
        :schema="upgradeSchema"
        :api="api"
        :rules="rules"
        @objsaved="afterSave"
        @countNum="countNum1"
        @searchCard="searchCard"
        label-width="140px"
        label-position="right"
        :btn-name="submitBtn"
      ></ever-form>
      <ever-form
        ref="exitform"
        v-show="popTitle=='储值卡退卡'"
        :schema="exitSchema"
        v-model="exitData"
        :api="api"
        :rules="rules"
        @objsaved="afterSave"
        @countNum="countNum"
        label-width="140px"
        label-position="right"
        :btn-name="submitBtn"
      ></ever-form>
    </el-dialog>
    <records-pop :data="recordsData" ref="recordslist"></records-pop>
  </div>
</template>

<script>
import api from '../store/carditemapi'
import batchapi from '../store/cardbatchapi'
import utillist from '../../util/list'
import recordsPop from '../page/recordslist'
import selftariffsapi from '@/rcm/store/tariffs/selftariffsapi'

let Schema = {
  search: [
    {
      name: 'batchType',
      label: '储值卡类型',
      comp: 'sys-type',
      props: {
        code: 'THC_CARD_MEMBERCARD_TYPE'
      }
    },
    {
      name: 'batchId',
      label: '储值卡名称',
      comp: 'ever-select',
      props: {
        options: [],
        placeholder: '储值卡名称',
        clearable: true
      }
    },
    {
      name: 'code',
      label: '储值卡卡号'
    },
    {
      name: 'status',
      label: '状态',
      comp: 'sys-type',
      props: {
        code: 'THC_CARD_MEMBERCARD_STATUS'
      }
    },
    {
      name: 'cardBuyer',
      label: '购卡人',
      comp: 'custom'
    },
    {
      name: 'patientId',
      label: '持卡人',
      comp: 'custom'
    }
  ],
  upgrade: [
    {
      name: 'batchObj',
      type: 'select',
      label: '新储值卡批次名称',
      needObjFlag: true,
      nodatatext: '没有更高级别的卡了',
      placeholder: ' 请选择新储值卡批次名称',
      options: [],
      span: 24
    },
    {
      name: 'newCardCode',
      label: '新储值卡编码',
      placeholder: '请输入新储值卡编号',
      type: 'inputSerBtn',
      btnName: '查询新卡',
      span: 24
    },
    {
      name: 'datetimes',
      type: 'daterange',
      label: '有效期',
      placeholder: '如果无值则无限期',
      span: 24
    },
    {
      name: 'poundage',
      label: '退卡手续费',
      span: 24,
      type: 'inputBtn',
      btnName: '计算余额',
      btnFn: 'countNum'
    },
    {
      name: 'turnStoredMoney',
      label: '转移现金余额',
      placeholder: '',
      span: 24,
      disabled: true
    },
    {
      name: 'turnGivedMoney',
      label: '转移赠金余额',
      placeholder: '',
      span: 24,
      disabled: true
    }
  ],
  exit: [
    {
      name: 'totalMoney',
      type: 'spanTxt',
      label: '储值卡余额',
      span: 24
    },
    {
      name: 'storedMoney1',
      type: 'spanTxt',
      label: '现金余额',
      span: 24
    },
    {
      name: 'givedMoney1',
      type: 'spanTxt',
      label: '赠金余额',
      span: 24
    },
    {
      name: 'poundage',
      label: '退卡手续费',
      span: 24,
      type: 'inputBtn',
      btnName: '计算余额'
    },
    {
      name: 'withdrawMoney',
      label: '退卡金额',
      span: 24,
      disabled: true
    }
  ]
}

export default {
  mixins: [utillist],
  data () {
    let obj = {
      search: this.$ever.createObjFromSchema(Schema.search),
      upgrade: this.$ever.createObjFromSchema(Schema.upgrade),
      exit: this.$ever.createObjFromSchema(Schema.exit)
    }
    obj.upgrade.batchId = 0
    obj.upgrade.oldCard = {}
    obj.upgrade.newCard = {}
    obj.upgrade.formType = 4
    obj.exit.formType = 6
    return {
      loading: false,
      tableData: [],
      selftariffArr: [],
      querySchema: Schema.search,
      upgradeSchema: Schema.upgrade,
      delaySchema: Schema.delay,
      exitSchema: Schema.exit,
      queryObj: obj.search,
      upgradeData: obj.upgrade,
      delayData: {
        'delayedCount': '',
        'delayCount': '',
        'endDate': ''
      },
      exitData: obj.exit,
      popTitle: '',
      popShow: false,
      delayPopShow: false,
      currentIndex: 0,
      recordsData: [],
      batchId: 0,
      labelPosition: 'right',
      rules: {
        batchObj: [
          { required: true, message: '请选择储值卡', trigger: 'change', type: 'object' }
        ],
        newCardCode: [
          { required: true, message: '请输入新储值卡号，查询该卡是否存在', trigger: 'blur' }
        ],
        poundage: [
          { required: true, message: '请输入退卡手续费，计算退卡金额', trigger: 'blur' }
        ],
        withdrawMoney: [
          { required: true, message: '请输入退卡手续费，计算退卡金额', trigger: 'blur', type: 'number' }
        ],
        datetimes: [
          { required: true, message: '请选择有效期', trigger: 'change', type: 'array' }
        ],
        storedMoney: [
          { required: true, message: '请输入储值金额', trigger: 'blur' }
        ],
        turnStoredMoney: [
          { required: true, message: '请计算转移现金余额', trigger: 'blur', type: 'number' }
        ],
        turnGivedMoney: [
          { required: true, message: '请计算转移赠金余额', trigger: 'blur', type: 'number' }
        ],
        chargeMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ]
      },
      submitBtn: ['确定', '重置'],
    }
  },
  watch: {
    'upgradeData.batchObj': function (val) {
      let end = new Date()
      let start = new Date()
      start.setHours(start.getHours() + 1)
      end.setMonth(end.getMonth() + val.validPeriod)
      this.upgradeData.datetimes = [start, end]
      this.upgradeData.batchId = val.id
    },
    'queryObj.batchType': function (val) {
      this.queryObj.batchId = ''
      this.$ever.getFieldFromSchema(this.querySchema, 'batchId').props.options = []
      if (val) {
        batchapi.list({ type: val, offset: 0, pagesize: 10000 }).then(result => {
          if (result && result.data && result.data.resultList) this.$ever.getFieldFromSchema(this.querySchema, 'batchId').props.options = result.data.resultList || []
        })
      }
    },
    'popShow': function (val) {
      if (!val) {
        this.exitData.poundage = ''
      }
    }
  },
  methods: {
    submitDelayForm () {
      if (this.delayData.delayCount > 0) {
        this.delayData.formType = 5
        api.createOrUpdate(this.delayData).then(result => {
          this.list(true)
        })
        this.delayPopShow = false
      } else {
        this.$messageTips(this, 'warning', '可延期次数为0，不可延期')
      }
    },
    searchCard (data) {
      let params = { batchId: this.upgradeData.batchId, code: data }
      api.serchNewCard(params).then(result => {
        this.upgradeData.newCard = { id: result.data.id }
        this.$messageTips(this, 'success', '该卡存在')
      })
    },
    countNum (data) {
      this.exitData.withdrawMoney = (this.exitData.storedMoney1 > this.exitData.poundage) ? this.exitData.storedMoney1 - this.exitData.poundage : 0
      // let params = {id: this.exitData.uid, poundage: Number(data)}
      // api.returnMoney(params).then(result => {
      //   this.exitData.withdrawMoney = result.data.storedMoney
      // })
    },
    countNum1 (data) {
      let params = { id: this.upgradeData.uid, poundage: Number(data) }
      api.returnMoney(params).then(result => {
        this.upgradeData.turnStoredMoney = result.data.storedMoney
        this.upgradeData.turnGivedMoney = result.data.givedMoney
      })
    },
    downFile (data) {
      let params = {
        'batchType': this.queryObj.batchType,
        'batchId': this.queryObj.batchId,
        'status': this.queryObj.status,
        'cardBuyer': this.queryObj.cardBuyer,
        'patientId': this.queryObj.patientId
      }
      api.exportFile(params).then(result => {
        if (result && result.data) {
          let filename = `${this.$ever.filePath}${result.data.fileId}`
          this.$refs.childMethod.downfile(filename)
        }
      })
    },
    handleExportStatus (a) { // 导出成功提示
      if (a) this.$messageTips(this, 'success', '导出成功')
    },
    getBatchList (schema, key, type, money) {
      let batchOptions = this.$ever.getFieldFromSchema(schema, key)
      batchapi.list({ type: type, offset: 0, pagesize: 20 }).then(result => {
        batchOptions.options = result.data.resultList
      })
    },
    afterSave (rs) {
      this.popShow = false
      if (rs.data) {
        Object.assign(this.tableData[this.currentIndex], rs.data)
      }
      if (rs.head.errCode === 0) {
        this.$messageTips(this, 'success', '退卡成功')
      }
    },
    showPop (rs) {
      this.popTitle = rs.title
      this.currentIndex = rs.data.$index
      if (rs.title === '储值卡退卡') {
        this.exitData.totalMoney = rs.data.row.givedMoney + rs.data.row.storedMoney
        this.exitData.givedMoney1 = rs.data.row.givedMoney
        this.exitData.storedMoney1 = rs.data.row.storedMoney
        this.exitData.uid = rs.data.row.id
        this.exitData.withdrawMoney = ''
        this.popShow = true
      } else if (rs.title === '储值卡延期') {
        rs.data.row.delayedCount = rs.data.row.delayedCount ? rs.data.row.delayedCount : 0
        rs.data.row.delayCount = rs.data.row.memberCardBatch.maxDelayCount - rs.data.row.delayedCount
        rs.data.row.delayTime = rs.data.row.endDate
        let date = rs.data.row.endDate.split(' ')[0].split('-')
        let month = (Number(date[1]) + rs.data.row.memberCardBatch.delayMonth) % 12 > 9 ? ((Number(date[1]) + rs.data.row.memberCardBatch.delayMonth) % 12 ? (Number(date[1]) + rs.data.row.memberCardBatch.delayMonth) % 12 : 12) : '0' + ((Number(date[1]) + rs.data.row.memberCardBatch.delayMonth) % 12)
        let year = Math.floor((Number(date[1]) + rs.data.row.memberCardBatch.delayMonth) / 12 + Number(date[0]))
        Object.assign(this.delayData, rs.data.row,
          {
            endDate: year + '-' + month + '-' + date[2]
          }
        )
        this.popShow = false
        this.delayPopShow = true
      } else if (rs.title === '储值卡冻结') {
        this.freezeCard(rs.data.$index, rs)
        this.popShow = false
      }
    },
    showPop1 (i, rs, title) {
      this.batchId = rs.batchId
      this.popTitle = title
      this.currentIndex = i
      if (title === '储值卡转卡') {
        this.upgradeData.uid = rs.id
        this.upgradeData.currentMoney = rs.storedMoney
        this.upgradeData.storedMoney = ''
        this.upgradeData.chargeMethod = ''
        this.upgradeData.chargeStatement = ''
        this.upgradeData.datetimes = ''
        this.upgradeData.batchObj = ''
        this.upgradeData.oldCard = { id: rs.id }
        this.getBatchList(this.upgradeSchema, 'batchObj', rs.batchType, rs.memberCardBatch.moneyThreshold)
      }
      this.popShow = true
    },
    freezeCard (i, rs) {
      let obj = {}
      obj.id = rs.data.row.id
      obj.formType = Number(rs.data.row.status) === 0 ? 7 : 8
      let tips = Number(rs.data.row.status) === 0 ? '冻结' : '解冻'
      this.$confirm('您确定要' + tips + '该储值卡吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.createOrUpdate(obj).then(result => {
          if (result.data) {
            this.tableData[i].status = result.data.status
            this.$messageTips(this, 'success', `储值卡${Number(rs.data.row.status) === 0 ? '解冻' : '冻结'}成功`)
          } else {
            this.$messageTips(this, 'error', `储值卡${Number(rs.data.row.status) === 0 ? '解冻' : '冻结'}失败`)
          }
        })
      }).catch(() => {
        return false
      })
    },
    showRecords (i, rs) {
      this.$refs.recordslist.queryObj.cardId = rs.id
      this.$refs.recordslist.isShow = true
    },
    shareUsers (i, rs) {
      this.$router.push({ path: '/card/shareuser', query: { id: rs.id, userid: rs.patient.id, username: rs.patient.name, shareCount: rs.memberCardBatch.shareCount } })
    }
  },
  created () {
    this.$route.query.q = ''
    selftariffsapi.list().then(result => {
      this.selftariffArr = result.data
    })
  },
  beforeCreate () {
    this.api = api
  },
  components: {
    recordsPop
  }
}
</script>
<style scoped>
#carditem {
  padding: 0;
  margin: 0;
}
#carditem .el-dropdown-link {
  color: #1c7bef;
  font-size: 12px;
  cursor: pointer;
}
#carditem-search .el-form-item {
  margin-right: 15px;
}
.clearfix {
  *zoom: 1;
}
.clearfix:after {
  display: block;
  overflow: hidden;
  clear: both;
  height: 0;
  visibility: hidden;
  content: ".";
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.main-head form {
  margin-top: 0;
}
.el-button--danger {
  color: #fa5555;
  background: #fee;
  border-color: #fdbbbb;
}
.el-button--warning {
  color: #eb9e05;
  background: #fdf5e6;
  border-color: #f7d89b;
}
@media screen and (max-width: 1599px) {
  .carditem /deep/ .el-dialog__body {
    min-height: 400px !important;
  }
}
.carditem /deep/ .el-date-editor {
  width: 100%;
}
</style>

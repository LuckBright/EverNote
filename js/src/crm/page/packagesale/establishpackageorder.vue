<template>
  <div id="establishpackage">
    <el-dialog
      :title="title"
      :visible.sync="v"
      width="80%"
      class="order ui_dialog_02 spe "
      :close-on-click-modal="false"
      v-loading="logLoding"
    >
      <ever-form2
        :schema="querySchema"
        class="diy-form"
        v-model="queryObj1"
        v-show="!discountVisi"
        ref="form2"
        :rules="ruless"
        :is-query="true"
        :inline="true"
        label-position="right"
        @query="list()"
      >
        <template slot="patientInfo">
          <ever-patient-select
            v-if="dialogVisible"
            ref="inputSeach"
            v-model="queryObj1.patientId"
            @select="infoChange"
            :allowCreate="false"
            class="focus-packlist"
            :disabled="
              !!medcenterInfo.appointmentId || isDelivery || discountVisi
            "
          ></ever-patient-select>
        </template>
        <template slot="setmealType">
          <el-select
            v-model="queryObj1.setmealType"
            placeholder="请选择"
            :disabled="!!isMedcenter || isDelivery"
          >
            <el-option
              v-for="item in options.tcfl"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
      </ever-form2>
      <div class="personnel-info">
        <label>姓名</label><span>：{{ personnelInfo.name }}</span>
        <label>出生日期</label><span>：{{ personnelInfo.birthday }}</span>
        <label>性别</label
        ><span
          >：<sys-value type="GBT.2261.1" :code="personnelInfo.sex"></sys-value
        ></span>
        <label>患者档案号</label
        ><span
          >：{{
            personnelInfo.patientNumber != 'temporary' &&
              personnelInfo.patientNumber
          }}</span
        >
      </div>
      <ever-form2
        v-if="dialogVisible"
        :schema="querySchema2"
        v-model="queryObj2"
        ref="form"
        :rules="rules"
        :nosubmit="true"
        :is-query="true"
      >
        <template slot="contactUnit">
          <el-select
            v-model="queryObj2.contactUnit"
            clearable
            placeholder="请选择"
            :disabled="discountVisi"
          >
            <el-option
              v-for="item in options.wldw"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
        <template slot="channelType">
          <el-select
            v-model="queryObj2.channelType"
            placeholder="请选择"
            style="width:100px;"
            :disabled="discountVisi"
          >
            <el-option
              v-for="item in options.lx"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
        <template slot="limitUseDate">
          <el-date-picker
            v-model="queryObj2.limitUseDate"
            type="date"
            style="width:150px;"
            :disabled="true"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
          <!-- :disabled="eidtDisabled" -->
        </template>
        <template slot="adviceOrgId">
          <div v-show="adviceTask">
            <el-form-item
              label="机构"
              :class="{ 'is-required': adviceTask }"
              style="margin-left:-120px;"
            >
              <ever-org-select
                ref="eos"
                v-model="queryObj2.adviceOrgId"
                placeholder="机构"
                :isOrg="false"
                :fields="'id'"
                :props="{
                  clearable: false
                }"
              >
              </ever-org-select>
            </el-form-item>
          </div>
        </template>
        <template slot="adviceDptId">
          <div v-show="adviceTask">
            <el-form-item
              label="科室"
              :class="{ 'is-required': adviceTask }"
              style="margin-left:-120px;"
            >
              <ever-subject-select
                ref="ess"
                v-model="queryObj2.adviceDptId"
                fields="orgSubjectCode"
                placeholder="科室"
                :params="subparams"
              >
              </ever-subject-select>
            </el-form-item>
          </div>
        </template>
        <template slot="adviceDoctorId">
          <div v-show="adviceTask">
            <el-form-item
              label="医生"
              :class="{ 'is-required': adviceTask }"
              style="margin-left:-120px;"
            >
              <ever-staff-select
                ref="staf"
                v-model="queryObj2.adviceDoctorId"
                fields="id"
                :params="{
                  tenantSubjectIdList: [...queryObj2.adviceDptId]
                }"
              >
              </ever-staff-select>
            </el-form-item>
          </div>
        </template>
      </ever-form2>
      <div class="dataContainer" v-show="!discountVisi">
        <div
          style="margin-bottom:20px;"
          class="only"
          v-if="historyData.length > 0"
        >
          <div class="diy-tbody">
            <span> {{isPlan ? '已购保障计划' : '已购套餐'}}</span>
            <span>标准售价</span>
            <span>原价</span>
            <span>数量</span>
          </div>
          <el-tree
            :data="historyData"
            :expand-on-click-node="false"
            node-key="id"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }} </span>
              <span v-if="data.isgen" style="position:relative;">
                <p class="type-btn type-btn-1" v-if="data.status == '未支付'">
                  未支付
                </p>
                <p class="type-btn type-btn-2" v-if="data.status == '未用完'">
                  未用完
                </p>
              </span>
              <span class="diy-tr">{{
                data.amountDis | formatToFinacial
              }}</span>
              <span class="diy-tr">{{ data.amount | formatToFinacial }}</span>
              <span class="diy-tr">{{ data.count }}</span>
              <span class="diy-tr" v-if="data.status == '未支付'">
                <el-button
                  type="primary"
                  size="mini"
                  @click="() => packageCancel(data)"
                >
                  作废
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
        <div>
          <div class="diy-tbody">
             <span> {{isPlan ? '可购保障计划' : '可购套餐'}}</span>
            <span>标准售价</span>
            <span>原价</span>
            <span>数量</span>
            <span>使用期限</span>
          </div>
          <el-tree
            :data="data"
            ref="tree"
            show-checkbox
            node-key="id"
            @check-change="handleCheckChange"
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span class="diy-tr">{{
                data.totalPriceDiss | formatToFinacial
              }}</span>
              <span class="diy-tr">{{
                data.totalPrices | formatToFinacial
              }}</span>
              <span class="diy-tr">{{ data.totalCount || 1 }}</span>
              <span class="diy-tr">{{
                checkPackageList.includes(data.id) ? retPackageDate(data) : '--'
              }}</span>
            </span>
          </el-tree>
          <el-select v-if="false" v-model="selectionObj" placeholder="" style="width: 100%">
            <el-option v-for="item in data" :key="item.id" :label="item.id">
              {{item.name}}
              </el-option>
          </el-select>
        </div>
      </div>
      <div class="dataContainer" v-show="discountVisi">
        <el-table
          v-loading.body="discountLoading"
          :data="discountTable"
          style="width: 100%"
          border
          class="dicount-table"
        >
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column
            prop="categoryName"
            label="套餐分类"
          ></el-table-column>
          <el-table-column prop="contacts" label="优惠名称">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.usePreferentialId"
                @change="
                  val => {
                    discountChange(scope.row, val, scope.$index)
                  }
                "
                placeholder="请选择"
              >
                <el-option
                  v-for="item in scope.row.setMealPreferentials"
                  :key="item.id"
                  :label="item.preferentialName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="usePreferentialRemarks"
            label="备注"
          ></el-table-column>
          <el-table-column prop="totalCount" label="项目数量"></el-table-column>
          <el-table-column prop="totalPrices" label="原价">
            <template slot-scope="scope">
              {{ scope.row.totalPrices | formatToFinacial }}
            </template>
          </el-table-column>
          <el-table-column prop="totalPriceDiss" label="售价">
            <template slot-scope="scope">
              {{ scope.row.totalPriceDiss | formatToFinacial }}
            </template>
          </el-table-column>
          <el-table-column label="使用期限">
            <template slot-scope="scope">
              {{ retPackageDate(scope.row) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <span
          >选中售价合计：
          <p style="color:#ee4433;display:inline-block;margin-right:20px;">
            ￥{{ totalAmount | formatToFinacial }}
          </p></span
        >
        <el-button :loading="payLoading" @click="closeLog">取消</el-button>
        <el-button type="primary" v-if="!discountVisi" @click="pay"
          >下一步</el-button
        >
        <el-button
          type="primary"
          v-if="discountVisi"
          :loading="payLoading"
          @click="back"
          >上一步</el-button
        >
        <el-button
          type="primary"
          v-if="discountVisi"
          :loading="payLoading"
          @click="handleSave"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <disposal-content-dialog
      :dialogVisible.sync="visible"
      @appendFun="appendFun"
    ></disposal-content-dialog>
    <paymethodstwo
      :dialogVisible.sync="payVisible"
      :obj="payObj"
      @closedialog="closedialog"
      @payStatus="payStatus"
      @refundstatus="refundStatus"
    ></paymethodstwo>
  </div>
</template>
<script>

import api from '@/crm/store/packageapi'
import disposalContentDialog from './disposalcontentdialog'
import { everprint, objSortBy, MEPC_ID } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import memberApi from '@/crm/store/memberapi'

export default {
  // props: ['dialogVisible', 'initoptions', 'patient', 'isMedcenter', 'isNoPay', 'schemaVal', 'isGroup', 'groupInfos', 'infoInputFocus', 'isReturnInfos'], // isGroup是否为团体下单, infoInputFocus是患者姓名筛选看是否需要自动focus效果, isReturnInfos下单成功后是否返回当前下单患者信息
  props: {
    dialogVisible: { // 控制组件显隐藏
      type: Boolean,
      default: false
    },
    initoptions: { // 初始化销售类型和销售人员默认值
      type: Object,
      default () {
        return {}
      }
    },
    patient: { // 初始化患者信息 {id: '',name:'患者名称',birthday:'出生日期',sex:'性别',patientNumber:'患者档案号'}
      type: Object,
      default () {
        return {}
      }
    },
    isMedcenter: { // 是否是体检
      type: Boolean,
      default: false
    },
    medcenterInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    isNoPay: { // 下单但是不付款
      type: Boolean,
      default: false
    },
    schemaVal: { // 初始化基本信息
      type: Object,
      default () {
        return {}
      }
    },
    infoInputFocus: { // 患者姓名筛选看是否需要自动focus效果
      type: Boolean,
      default: false
    },
    isReturnInfos: { // 下单成功后是否返回当前下单患者信息
      type: Boolean,
      default: false
    },
    isDelivery: { // 是否是产房
      type: Boolean,
      default: false
    }
  },
  components: {
    disposalContentDialog
  },
  data () {
    let rules = {
      saleMan: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      limitUseDate: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      channelType: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      adviceOrgId: [
        { required: false, message: '必填项', trigger: 'change' }
      ],
      adviceDptId: [
        { required: false, message: '必填项', trigger: 'change' }
      ],
      adviceDoctorId: [
        { required: false, message: '必填项', trigger: 'change' }
      ]
    }
    let ruless = {
      patientId: [
        { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    let querySchema = [
      {
        label: '',
        name: 'patientInfo',
        comp: 'custom'
      },
      {
        label: '套餐分类',
        name: 'setmealType',
        comp: 'custom'
      },
      {
        label: '科室',
        name: 'fitDptId',
        comp: 'ever-subject-select',
        props: {
          type: 'select',
          fields: 'orgSubjectCode',
          placeholder: '请选择科室'
        }
      },
      {
        label: '名称',
        name: 'name'
      }
    ]
    let querySchema2 = [
      {
        label: '往来单位',
        name: 'contactUnit',
        comp: 'custom',
        span: 4
      },
      {
        label: '渠道类型',
        name: 'channelType',
        comp: 'custom',
        span: 4
      },
      {
        label: '销售员',
        name: 'saleMan',
        comp: 'ever-staff-select',
        props: {
          fields: 'id',
          clearable: true,
          type: 'select',
          params: {
            everQueryType: 'out'
          }
        },
        span: 4
      },
      // {
      //   label: '使用期限',
      //   name: 'limitUseDate',
      //   comp: 'custom',
      //   span: 4
      // },
      {
        name: 'saleChannel',
        label: '销售渠道',
        comp: 'ever-select',
        props: {
          options: [
            {
              id: 1,
              name: '院内销售'
            },
            {
              id: 2,
              name: '商城销售'
            }
          ],
          clearable: false
        },
        span: 4
      },
      {
        comp: 'div',
        style: {
          height: '33px'
        },
        span: 8
      },
      {
        name: 'adviceOrgId',
        comp: 'custom',
        span: 4
      },
      {
        name: 'adviceDptId',
        comp: 'custom',
        span: 4
      },
      {
        name: 'adviceDoctorId',
        comp: 'custom',
        span: 4
      }
    ]
    var queryObj1 = this.$ever.createObjFromSchema(querySchema)
    var queryObj2 = this.$ever.createObjFromSchema(querySchema2)
    queryObj1.patientId = ''
    queryObj2['saleManName'] = '' // 销售人员名称
    queryObj2.channelType = '2'
    queryObj2.adviceOrgId = ''
    queryObj2.adviceDptId = ''
    queryObj2.adviceDoctorId = ''
    queryObj1.status = 3
    queryObj2.saleChannel = 1
    let patientInit = {
      name: '',
      birthday: '',
      sex: '',
      patientNumber: ''
    }
    return {
      rules,
      ruless,
      objSortBy,
      patientInit,
      logLoding: false,
      visible: false,
      payVisible: false,
      patientId: (this.patient && this.patient.id) || '',
      payObj: {
        iscallback: true,
        patientid: (this.patient && this.patient.id) || '', // 患者id
        settlementId: '', // 结算单id
        settlementNo: '', // 结算单号
        unexefee: 0, // 还需支付
        exefee: 0, // 已收金额
        totalFee: 0, // 总额
        payType: '3', // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        paymethodArr: [], // 支付方式
        isValited: true, // 押金是false,费用为true
        payTradeLog: [], // 支付记录
        isDeposit: 0// 是否押金
      },
      orderId: '', // 订单所对应的id
      data: [],
      historyData: [],
      currentTwoLevel: [],
      queryObj1,
      queryObj2,
      querySchema,
      querySchema2,
      selectionArrs: [], // 必选项目id集合
      selectionObj: [], // 有效项目的所有信息集合
      eidtDisabled: false, // 使用期限是否可以修改
      minCounts: {}, //
      personnelInfo: (this.patient && this.patient.id) ? this.patient : JSON.parse(JSON.stringify(patientInit)),
      returnInfo: {},
      totalAmount: '', // 合计金额
      options: {
        wldw: [],
        lx: [
          { id: '1', name: '院内' },
          { id: '2', name: '院外' }
        ],
        tcfl: []
      },
      payLoading: false,
      loading: false,
      discountLoading: false,
      discountVisi: false,
      discountTable: [],
      setMealArr: [],
      payParams: [],
      memberApi,
      adviceTask: false,
      checkPackageList: [] // 选中的套餐
    }
  },
  methods: {
    back () {
      this.discountVisi = false
      this.adviceTask = false
      this.initTotalAmount()
    },
    init () {
      if (this.isPlan) {
        this.querySchema = this.querySchema.filter(item => item.name !== 'setmealType')
      }
      this.initOptions()
      this.initSchemaVal()
      if (this.patientId) {
        api.selectNoPayAndNoFinish({ patientId: this.patientId, filter: false }).then(result => { // 根据patientId查询患者未支付和未完成的订单
          this.initHistoryData(result.data)
        })
      }
    },
    list () { // 如果传patient时则自动初始化基本信息
      if (this.discountVisi) { return }
      if (this.patientId) {
        api.selectNoPayAndNoFinish({ patientId: this.patientId, filter: false }).then(result => { // 根据patientId查询患者未支付和未完成的订单
          this.initHistoryData(result.data)
        })
      } else {
        this.historyData = []
      }
      this.getTreeData({ categoryId: this.queryObj1.setmealType, status: 3, name: this.queryObj1.name, fitDptId: this.queryObj1.fitDptId }) // 根据套餐分类查询套餐
    },
    initSchemaVal () { // 初始化基本信息默认选中数据
      this.getTypeOptions()
      if (this.schemaVal) {
        this.queryObj2 = Object.assign(this.queryObj2, this.schemaVal)
      }
    },
    initHistoryData (data) { // 初始化历史数据
      data.forEach(item => {
        if (item.catalogInfos) {
          item.isgen = true
          item.children = item.catalogInfos
          item.label = item.setMealName
          item.children.forEach(val => {
            val.children = []
            val.label = val.name
            if (val.serviceInfos) {
              val.children = val.serviceInfos
              val.children.forEach(lab => {
                lab.label = lab.name
              })
            }
          })
        }
      })
      this.historyData = data
    },
    initOptions () { // 获取筛选条件options
      this.queryObj2.saleMan = this.$store.state.currentUser.userId
      this.queryObj2.saleManName = this.$store.state.currentUser.name
      api.getInsurance().then(result => {
        for (var insur of result.data) {
          insur.name = insur.insuranceOrgCnName
          insur.id = String(insur.id)
        }
        this.options.wldw = result.data
      })
    },
    infoChange (val) { // 患者姓名获取基本信息
      if (val && val.id) {
        this.queryObj1.patientId = val.id
        // this.personnelInfo = val
        this.returnInfo = val
        // this.personnelInfo.birthday = val.birthday ? val.birthday.split(' ')[0] : ''
        // this.personnelInfo.patientNumber = val.outpatientNumber || val.patientNumber
      } else {
        this.personnelInfo = JSON.parse(JSON.stringify(this.patientInit))
      }
    },
    getTreeData (params) {
      this.totalAmount = 0
      this.logLoding = true
      if (this.isPlan) {
        params.categoryId = '06'
      }
      api.searchAvailable(params).then(result => {
        this.initTreeData(result.data.resultList)
      })
    },
    initTreeDataCallback (item, val, lab) {
      lab['parentId'] = val.id
      lab['dptId'] = val.dptId || '' // 将目录所对应的分检科室放到项目上
      lab['grandpaId'] = item.id
      lab['setMealName'] = item.name
      lab['id'] = item.id + '&~&' + val.id + '&~&' + lab.id // 所有的套餐都放在一个tree下，不同套餐下的项目会出现重复，拼接上二级目录id设置默认选项时使用
      // lab['disabled'] = lab.isMust === 1
      // if (lab.isMust === 1) {
      //   this.selectionArrs.push(lab['id'])
      // }
    },
    initTreeData (data) { // 将底层数据都打上父级和爷级的id，并且设置disabled
      this.foreEachTreeData(data, this.initTreeDataCallback)
      this.data = data
      setTimeout(_ => {
        this.initSelection()
        this.logLoding = false
      }, 500)
    },
    initSelection () {
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(this.selectionArrs)
      }
    },
    foreEachTreeData (data, callback) { // 格式化tree数据
      for (let i = data.length - 1; i > -1; i--) {
        let item = data[i]
        item.isTC = true
        if (item.setMealCatalogs) {
          item.children = []
          item.label = item.name
          item.setMealCatalogs.forEach((val, index) => {
            val.children = []
            val.isTwo = true
            val.isAll = val.isAll === 1 // 判断是否全选
            val.isNext = val.isNext === 1
            val.nextIsAll = item.children[index - 1] ? item.children[index - 1]['isAll'] : false
            val.isTwoLevel = item.categoryId === MEPC_ID // 判断是否是体检项目，只有体检项目的二级目录可以追加项目
            val['parentId'] = item.id
            val.label = val.name
            if (val.setMealDetails) {
              val.children = []
              val.setMealDetails.forEach(lab => {
                if (lab.serviceName) {
                  lab.isAll = val.isAll // 判断是否全选
                  lab.isNext = val.isNext // 判断是否关联下一目录
                  lab.nextIsAll = val.nextIsAll
                  lab.label = lab.serviceName
                  lab.totalPrices = lab.totalPrice
                  lab.totalPriceDiss = lab.totalPriceDis
                  callback(item, val, lab)
                  val.children.push(lab)
                }
              })
            }
            if (val.setMealDetails.length > 0) {
              item.children.push(val)
            }
          })
        }
        if (item.setMealCatalogs && item.setMealDetails && item.setMealDetails.length > 0) { // 根目录数据也放到二级目录的数组中
          let totalPrices = 0
          let totalPriceDiss = 0
          let children = []
          item.setMealDetails.forEach(lab => {
            if (lab.serviceName) {
              lab.isgen = true
              lab.label = lab.serviceName
              lab.totalPrices = lab.totalPrice
              lab.totalPriceDiss = lab.totalPriceDis
              totalPrices += lab.totalPrices
              totalPriceDiss += lab.totalPriceDiss
              callback(item, item, lab)
              children.push(lab)
            }
          })
          let diygen = {
            totalPriceDiss: totalPriceDiss,
            totalPrices: totalPrices,
            label: '根目录',
            id: item.id,
            children: children,
            setMealDetails: item.setMealDetails
          }
          item.setMealCatalogs.unshift(diygen)
        }
        if (!item.children || item.children.length === 0) {
          data.splice(i, 1)
        }
      }
    },
    handleCheckChange (data, type, c) {
      if (data.isTC) {
        this.initTotalAmount()
        this.initDuration()
        return
      }
      let arr = []
      let arr2 = []
      let v = []
      let twoId = ''
      if (data.isTwo) { // 点击的是二级目录
        v = this.data.find(item => item.id === data.parentId) // 获取所对应的套餐
        twoId = data.id
      } else if (data.grandpaId && data.parentId) { // 点击的是项目
        v = this.data.find(item => item.id === data.grandpaId)
        twoId = data.parentId
      }
      for (var i = 0; i < v.children.length; i++) {
        let item = v.children[i]
        arr.push({ id: item.id, isAll: item.isAll, isNext: item.isNext })
        arr2.push(item.id)
      } // 以上代码是获取点击都当前勾选框所对应都二级目录，并且将该二级目录所对应套餐的所有二级目录放到数组中
      if (type) { // 如果是选中 则从上往下判断
        if (data.isNext) { // 假如关联了下一目录
          let b = arr.splice(arr2.indexOf(twoId), arr.length)
          let c = []
          for (let i = 1; i < b.length; i++) {
            let item = b[i]
            if (b[i - 1]['isNext'] && item.isAll) { // 当前目录被上一级目录关联，并且本身是项目全选
              c.push(item.id)
            } else {
              break
            }
          }
          let curCheck = this.$refs.tree.getCheckedKeys(true)
          c = c.concat(curCheck)
          this.$refs.tree.setCheckedKeys(c)
        } else { // 假如没有关联下一目录

        }
      } else { // 如果是取消选中 则从下往上判断
        let b = false
        let lastTwo = arr[arr2.indexOf(twoId) - 1]
        if (lastTwo && lastTwo.isNext) {
          let t = v.children.find(item => item.id === lastTwo.id)
          let arr = []
          t.children.forEach(item => {
            arr.push(item.id)
          })
          let curCheck = this.$refs.tree.getCheckedKeys(true)
          let newArr = new Set(curCheck.concat(arr))
          if (newArr.size < arr.length + curCheck.length) { // 如果当前取消目录的上一个目录有已选中的项目，则他不能取消
            b = true
            let checkArr = [data.id, ...curCheck]
            this.$refs.tree.setCheckedKeys(checkArr)
          }
          if (b) {
            this.$messageTips(this, 'error', '请先取消上一目录的选中状态')
          }
        }
      }
      let a = false
      if (data.grandpaId && data.parentId && data.isAll) { // 只有点击底层项目时判断该二级目录是否需要全部选择
        let halfCheckedNodes = this.$refs.tree.getHalfCheckedNodes()
        let json = this.$refs.tree.getCheckedKeys(true)
        halfCheckedNodes.forEach(item => {
          if (item.isTwo && item.children.length > 0 && item.isAll) {
            a = true
            let arr2 = []
            item.children.forEach(lab => {
              arr2.push(lab.id)
            })
            arr2.push(...json)
            this.$refs.tree.setCheckedKeys(arr2)
          }
        })
      }
      if (a && !type) {
        this.$messageTips(this, 'error', '请点击目录取消')
      }
      this.initTotalAmount()
      this.initDuration()
    },
    initTotalAmount () { // 计算有效项目的总价格
      let moneyArr = this.$refs.tree.getCheckedNodes(true)
      let allmoney = 0
      moneyArr.forEach(item => {
        allmoney += Number(item.totalPriceDiss)
      })
      this.totalAmount = allmoney
    },
    initDuration () { // 根据所选套餐中最长的有效期初始化使用期限
      let tcArr = this.$refs.tree.getCheckedNodes()
      this.checkPackageList = []
      tcArr.forEach(item => {
        if (item.isTC) {
          this.checkPackageList.push(item.id)
        }
      })
    },
    retPackageDate (row, fullPath) {
      let durationNum = 0
      if (Number(row.validPeriod) > durationNum) durationNum = Number(row.validPeriod)
      let pathDate = fullPath ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
      let retDate = this.$moment(new Date()).add(durationNum, 'M').format(pathDate)
      return retDate
    },
    closeLog () {
      this.$emit('update:dialogVisible', false)
    },
    async pay () { // 验证信息
      let that = this
      //  else if (!this.queryObj2.limitUseDate) {
      //     that.$messageTips(this, 'error', '请选择套餐')
      //   }
      let selectNum = 0
      let currentCheckKeys = this.$refs.tree.getCheckedKeys()
      let treeDataFirst = this.data.map(item => item.id)
      for (let index = 0; index < treeDataFirst.length; index++) {
        const element = treeDataFirst[index]
        if (currentCheckKeys.includes(element)) selectNum++
      }
      if (selectNum > 1) {
        this.$message.error('保障计划不能选择多个套餐')
        return
      }
      that.$refs.form.$refs.form.validate(valid => {
        if (!that.personnelInfo.name) {
          that.$messageTips(this, 'error', '患者信息不能为空')
        } else if (valid) {
          this.selectionObj = this.$refs.tree.getCheckedNodes(true)
          that.ifExistDisabled()
        }
      })
    },
    async ifExistDisabled () { // 验证是否有已停用项目
      let details = this.initPayTreeInfo()
      if (details.length === 0) {
        this.$messageTips(this, 'error', '请选择套餐')
        return
      }
      if (this.isMedcenter && this.medcenterInfo && this.medcenterInfo.appointmentId && !this.mhedcenterInfoCheck()) return // 体检下单时对科室做验证
      if (this.count()) return // 判断套餐选中项目数是否达标
      let params = Object.assign({}, this.queryObj1, this.queryObj2)
      if (!params.patientId) params.patientId = this.patientId
      if (this.isMedcenter && this.medcenterInfo.appointmentId) {
        params['appointmentId'] = this.medcenterInfo.appointmentId
      }
      params['details'] = details
      // this.isHistory(params)
      let isService = await api.ifExistDisabledService(this.initParams(params)) // 验证是否有已被停用的项目
      this.payParams = params
      if (isService.data) {
        this.$confirm(isService.data, '信息提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isHistory()
        }).catch(() => {
        })
      } else {
        this.isHistory()
      }
    },
    isHistory (params) { // 验证是否有历史订单,如果是团体下单则不用验证
      if (this.historyData.length > 0 && !this.isMedcenter) {
        let cancelButtonText = '取消'
        let noPayArr = []
        this.historyData.forEach(item => {
          if (item.status === '未支付') {
            noPayArr.push(item.orderId)
            cancelButtonText = '取消未支付套餐并继续'
          }
        })
        this.$confirm('您存在未付款和未使用完项目的套餐订单，是否确认继续下单？', '信息提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: cancelButtonText,
          type: 'warning'
        }).then(() => {
          this.initDiscountTable()
        }).catch((action) => {
          if (action === 'close') {
            return
          }
          if (noPayArr.length > 0) {
            api.cancelOrderBatch({ ids: noPayArr }).then(result => {
              if (result.head.errCode === 0) {
                this.$messageTips(this, 'success', '取消成功')
                this.initDiscountTable()
              }
            })
          }
        })
      } else if (this.historyData.length === 0 || this.isMedcenter) {
        this.initDiscountTable()
      }
    },
    async initDiscountTable () {
      let json = await api.searchByPreferential(this.setMealArr)
      let data = json.data
      let totalAmount = 0
      data.forEach(item => {
        totalAmount += Number(item.totalPriceDiss)
      })
      this.totalAmount = totalAmount
      this.discountTable = data
      this.discountVisi = true
      this.adviceTask = data.some(item => { return item.badviceTask })
      // 医嘱
    },
    handleSave () { // 生成订单
      let params = Object.assign({}, this.payParams)
      let details = []
      let orderDetails = []
      this.discountTable.forEach(item => {
        (item.setMealDetails || []).forEach(lab => {
          lab.preferentialId = item.usePreferentialId
          lab.limitUseDate = this.retPackageDate(item, true)
        })
        orderDetails.push({
          preferentialId: item.usePreferentialId,
          setMealId: item.id,
          limitUseDate: this.retPackageDate(item, true)
        })
        details = [...details, ...(item.setMealDetails || [])]
      })
      params.details = details
      params.orderDetails = orderDetails
      let flag = true
      if (this.adviceTask) {
        this.$refs.form.$refs.form.validate(valid => {
          if (!valid) {
            flag = false
          } else {
            let adviceObj = {
              adviceOrgId: this.queryObj2.adviceOrgId,
              adviceDptId: this.queryObj2.adviceDptId,
              adviceDoctorId: this.queryObj2.adviceDoctorId
            }
            Object.assign(params, adviceObj)
            flag = true
          }
        })
      }
      if (!flag) { return }
      this.payLoading = true
      params.saleChannel = this.queryObj2.saleChannel
      if (this.isPlan) {
        params.setmealType = '06'
      }
      if (params.hasOwnProperty('limitUseDate') && this.isPlan) {
        delete params.limitUseDate
      }
      api.save(params).then(result => {
        this.orderId = result.data.orderId
        if (Number(params.saleChannel) === 1) {
          this.oneStepSettle(result.data)
        } else {
          this.$emit('update:dialogVisible', false)
          this.$emit('establishCallback', true)
          this.$messageTips(this, 'success', '下单成功')
        }
        this.$bus.$emit('update:setMeal')
      }).catch(rej => {
        this.payLoading = false
      })
    },
    discountChange (row, id, index) {
      let params = [{
        id: row.id,
        usePreferentialIdSet: id,
        setMealDetails: this.setMealArr[index]['setMealDetails']
      }]
      api.searchByPreferential(params).then(rs => {
        this.discountTable.splice(index, 1, rs.data[0])
        let totalAmount = 0
        this.discountTable.forEach(item => {
          totalAmount += Number(item.totalPriceDiss)
        })
        this.totalAmount = totalAmount
      })
    },
    initParams (data) {
      let params = JSON.parse(JSON.stringify(data))
      params.details.forEach(item => {
        delete item.detailes
      })
      return params
    },
    oneStepSettle (data) { // 一站式生成结算单，初始化支付数据 一站式生成结算单，初始化支付数据
      api.oneStepSettle(data).then(result => {
        this.payLoading = false
        if (this.isNoPay) {
          this.$emit('update:dialogVisible', false)
          this.$emit('establishCallback', true)
          this.$messageTips(this, 'success', '下单成功，请提醒患者缴费')
          return
        }
        // 患者id
        this.payObj.patientid = this.patientId
        // 结算单id
        this.payObj.id = result.data.settlementBillId
        // 结算单号
        this.payObj.settleCode = result.data.settlementBillCode
        // 还需支付
        this.payObj.unexefee = this.totalAmount
        // 已收金额
        this.payObj.exefee = 0
        // 总额
        this.payObj.totalFee = this.totalAmount
        this.payVisible = true
        this.$emit('update:dialogVisible', false)
      }).catch(rej => {
        this.payLoading = false
      })
    },
    closedialog (done) { // 关闭支付弹窗
      if (this.isReturnInfos) {
        this.$emit('closePayLogCallback', this.returnInfo)
      } else {
        this.$emit('closePayLogCallback', true)
      }
      this.payLoading = false
      done()
    },
    payStatus () { // 支付成功回掉
      api.changeStatus({ id: this.orderId, payStatus: 1 }).then(result => {
        if (result.head.errCode === 0) {
          if (this.isReturnInfos) {
            this.$emit('establishCallback', this.returnInfo)
          } else {
            this.$emit('establishCallback', true)
          }
          this.payVisible = false
          this.$messageTips(this, 'success', '支付成功')
          this.payLoading = false
          this.payPrint()
        }
      }) // 支付成功之后修改订单的支付状态
    },
    // 作废成功回掉
    refundStatus () {
      console.log('作废成功')
    },
    payPrint () {
      try {
        everprint('PACKAGE_CHARGE_PRINT', { orderId: this.orderId, id: this.orderId }, {
          preview: false,
          cb: _ => {
            console.log('打印完成')
          },
          lang: '01'
        })
      } catch (err) { }
    },
    count () { // 验证套餐选中项目数是否达标
      let arr = ''
      this.data.forEach(item => {
        if (this.minCounts[item.id] && item.minCount > this.minCounts[item.id]) {
          arr += `套餐${item.name}最低起售数量为${item.minCount}个，现已选${this.minCounts[item.id]}个项目。`
        }
      })
      if (arr) {
        this.$messageTips(this, 'error', arr)
      }
      return !!arr
    },
    mhedcenterInfoCheck () {
      let val = false
      if (this.isMedcenter && this.medcenterInfo.deptId) {
        val = this.dptIds.includes(this.medcenterInfo.deptId)
      }
      if (!val && this.isMedcenter && this.medcenterInfo.deptId) {
        this.$messageTips(this, 'error', '选择的套餐与预约挂号科室不符，请重新选择套餐')
      }
      return val
    },
    initPayTreeInfo () { // 将选中有效项目重新组装
      this.dptIds = []
      let arrs = [] // 选中项目的平铺数据集合
      let obj = {} // 有选中项套餐的选中个数
      let setMealObj = {} // 以套餐为单位的项目集合
      this.selectionObj.forEach(item => {
        if (!item.isTwo && !item.isTC) {
          this.dptIds.push(item.dptId || '')
          let ids = item.id.split('&~&')
          if (obj[ids[0]]) {
            obj[ids[0]] += 1
          } else {
            obj[ids[0]] = 1
          }
          let info = {
            setMealId: item.grandpaId,
            setMealCatalogId: item.isgen ? '' : item.parentId, // 如果时根目录中的项目时，这个参数传空
            setMealDetailId: item.isAppend ? '' : ids[2], // isAppend为true时为追加项目，id为前端生成，保存时删掉
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            setMealName: item.setMealName,
            itemNum: item.totalCount,
            totalPrice: item.totalPrice,
            totalPriceDis: item.totalPriceDis,
            price: item.price,
            priceDis: item.priceDis,
            detailes: item.detailes || '',
            isSet: item.isSet || '',
            setMealCatalogName: item.catalogName,
            setMealCatalogOrderNum: item.orderNum,
            serviceContent: item.serviceContent
          }
          arrs.push(info)
          if (setMealObj[ids[0]]) {
            setMealObj[ids[0]].push(info)
          } else {
            setMealObj[ids[0]] = [info]
          }
        }
      })
      let setMealArr = []
      for (let key in setMealObj) {
        let info = { id: key, setMealDetails: setMealObj[key] }
        setMealArr.push(info)
      }
      this.minCounts = obj
      this.setMealArr = setMealArr
      return arrs
    },
    isTwoLevel (node) {
      // 判断是否是二级目录
      return !!node.isTwoLevel
    },
    waitSendList (val) {
      let obj = {}
      if (!val[0]) {
        return []
      }
      // this.orderByWaitData()
      val = objSortBy(val, 'isMain')
      val.map(v => {
        if (obj[v.adviceId]) {
          obj[v.adviceId].push(v)
        } else {
          obj[v.adviceId] = [v]
        }
      })
      return obj
    },
    appendFun (val) { // 追加项目
      let item = val[0]
      let detailes = JSON.stringify(this.waitSendList(val))
      let newChild = {
        label: item.serviceName, // 项目名称=》文案改为已购套餐&可购套餐
        id: this.currentTwoLevel.parentId + '&~&' + this.currentTwoLevel.id + '&~&' + (new Date()).getTime(),
        serviceId: item.serviceId, // 项目id
        parentId: this.currentTwoLevel.id, // 二级目录id
        grandpaId: this.currentTwoLevel.parentId, // 套餐id
        totalPrice: item.price || 0, // 原单价*数量
        totalPrices: item.price || 0,
        totalPriceDis: item.price || 0, // 原售价*数量
        totalPriceDiss: item.price || 0,
        detailes: detailes,
        price: item.price || 0, // 单价
        priceDis: item.price || 0, // 售价
        totalCount: item.count || 1, // 个数
        isAppend: true
      }
      if (item.adviceContent) {
        let json = JSON.parse(item.adviceContent)
        if (json.excuteProvider) {
          // console.log(json.serviceItem.isSet, 'provider')
          newChild.isSet = json.serviceItem && json.serviceItem.isSet
        }
      }
      if (!this.currentTwoLevel.children) {
        this.$set(this.currentTwoLevel, 'children', [])
      }
      this.currentTwoLevel.children.push(newChild)
      this.updatedPrice(val)
    },
    updatedPrice (val) { // 追加项目后套餐和二级目录的价格要随之改变
      let price = val[0].price || 0
      let orderInfo = this.data.find(item => item.id === this.currentTwoLevel.parentId)
      this.currentTwoLevel.totalPriceDiss += price
      this.currentTwoLevel.totalPrices += price
      orderInfo.totalPriceDiss += price
      orderInfo.totalPrices += price
    },
    emptyData () { // 关闭弹窗时清空数据
      this.personnelInfo = JSON.parse(JSON.stringify(this.patientInit))
      this.queryObj1.patientInfo = ''
      this.queryObj1.setmealType = ''
      this.queryObj1.patientId = ''
      this.queryObj2.contactUnit = ''
      this.queryObj2.channelType = '2'
      this.queryObj2.adviceOrgId = ''
      this.queryObj2.adviceDptId = ''
      this.queryObj2.adviceDoctorId = ''
      this.queryObj2.saleMan = ''
      this.queryObj2.limitUseDate = ''
      this.data = []
      this.historyData = []
      this.dptIds = []
      this.discountVisi = false
      this.adviceTask = false
    },
    getTypeOptions () {
      sysvalue.listOnce('THC_MEAL_CLASSIFY_CODE').then(result => {
        this.queryObj1.setmealType = result[this.isMedcenter ? 2 : this.isDelivery ? 3 : 0]['id']
        this.options.tcfl = result.filter(item => item.id !== '06')
        this.getTreeData({ categoryId: this.queryObj1.setmealType, status: 3 })
      })
    },
    packageCancel (data) {
      this.$confirm('确定是要作废此订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.changeStatus({ id: data.orderId, payStatus: 4 }).then(result => {
          if (result.head.errCode === 0) {
            api.selectNoPayAndNoFinish({ patientId: this.patientId, filter: false }).then(result => { // 根据patientId查询患者未支付和未完成的订单
              this.initHistoryData(result.data)
            })
            this.$messageTips(this, 'success', '作废成功')
            this.$bus.$emit('update:setMeal')
          }
        })
      })
    },
    _getByPatientId (id) {
      if (id) {
        memberApi.getBaseInfoById1({
          patientId: id
        }).then(res => {
          if (res && res.head && res.head.errCode === 0) Object.assign(this.personnelInfo, res.data)
          this.personnelInfo.birthday = this.personnelInfo.birthday ? this.personnelInfo.birthday.split(' ')[0] : ''
        }).catch(err => {
          console.error(err)
        })
      }
    }
  },
  computed: {
    v: {
      get () {
        return this.dialogVisible
      },
      set (val) {
        this.$emit('update:dialogVisible', val)
      }
    },
    subparams () {
      return {
        'orgId': this.queryObj2.adviceOrgId,
        'status': 'Y',
        'usePermissionStatus': 'Y'
      }
    },
    isPlan () {
      return this.$route.meta.type === 'plan'
    },
    title () {
      return this.$route.meta.type === 'plan' ? '保障计划下单' : '套餐下单'
    }
  },
  watch: {
    'patientId': {
      handler (val) {
        if (val) {
          this._getByPatientId(val)
        }
      },
      deep: true,
      immediate: true
    },
    'patient': {
      handler (val) {
        if (val && val.id) {
          this.patientId = val.id
          this._getByPatientId(this.patientId)
        } else {
          this.patientId = ''
          this.personnelInfo = JSON.parse(JSON.stringify(this.patientInit))
        }
      },
      deep: true,
      immediate: true
    },
    'queryObj1.patientId': {
      handler (val) {
        if (val) {
          this.patientId = val
          this.init()
        } else {
          if (this.patient && this.patient.id) {
            this.patientId = this.patient.id
            this._getByPatientId(this.patientId)
          } else {
            this.patientId = ''
          }
        }
      },
      deep: true,
      immediate: true
    },
    'dialogVisible': {
      handler: function (val, oldval) {
        if (val) {
          this.payLoading = false
          this.init()
          if (this.patient && this.patient.id) {
            this.patientId = this.patient.id
            this.personnelInfo = this.patient
            this._getByPatientId(this.patientId)
          } else {
            this.patientId = ''
            this.personnelInfo = JSON.parse(JSON.stringify(this.patientInit))
          }
          if (this.infoInputFocus) {
            this.$nextTick(() => {
              this.$refs.inputSeach.$el.getElementsByTagName('input')[0].focus()
            })
          }
        } else {
          this.emptyData()
        }
      }
    },
    'adviceTask': {
      handler (val) {
        ['adviceOrgId', 'adviceDptId', 'adviceDoctorId'].forEach(item => {
          this.rules[item][0].required = val
        })
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
@media screen and (max-width: 1599px) {
  .order /deep/ .el-dialog__body {
    max-height: 600px !important;
    min-height: 550px !important;
  }
}
@media screen and (min-width: 1600px) {
  .order /deep/ .el-dialog__body {
    max-height: 750px !important;
  }
}
#establishpackage {
  .order {
    line-height: 100% !important;
    /deep/ .el-dialog__body {
      padding-top: 0px;
    }
    /deep/ .el-dialog {
      margin-top: 5vh !important;
    }
    .el-dialog__footer {
      border-top: 1px solid #eeeeee;
    }
    .diy-form {
      border-bottom: 1px solid #eeeeee;
    }
    /deep/ .el-tree-node__content {
      height: 30px;
      border-bottom: 1px solid #eeeeee;
      border-left: 1px solid #eeeeee;
      border-right: 1px solid #eeeeee;
    }
    .personnel-info {
      margin: 10px 0;
      font-size: 14px;
      span {
        margin-right: 20px;
        color: #000;
      }
      label {
        color: #666666;
      }
    }
    .dataContainer {
      height: calc(~'100vh - 350px');
      overflow: scroll;
    }
    .el-form {
      /deep/ label {
        color: #666666;
      }
    }
    .custom-tree-node {
      margin: 15px 0;
      position: relative;
      width: 100%;
      font-size: 16px;
    }
    .diy-tbody {
      height: 50px;
      line-height: 50px;
      background-color: #eeeeee;
      span {
        float: right;
        width: 120px;
        text-align: right;
        padding-right: 10px;
        box-sizing: border-box;
      }
      :first-child {
        float: left;
        padding-left: 10px;
        height: 50px;
      }
    }
  }
}
.diy-tr {
  width: 100px;
  height: 10px;
  float: right;
  text-align: right;
  padding-right: 10px;
  box-sizing: border-box;
}
.type-btn {
  margin: 0 0 0 10px;
  display: inline-block;
  font-size: 12px;
  border-radius: 2px;
  width: 45px;
  text-align: center;
  height: 25px;
  line-height: 25px;
}
.type-btn-1 {
  border: 1px solid #ee4433;
  color: #ee4433;
}
.type-btn-2 {
  border: 1px solid #ff9c00;
  color: #ff9c00;
}
.custom-tree-node {
  font-size: 14px !important;
}
.dicount-table /deep/ .el-table__body {
  .el-input__inner {
    height: 24px;
    line-height: 24px;
  }
  .el-input__suffix {
    right: 0;
  }
  .el-input__icon {
    line-height: 24px;
  }
}
</style>


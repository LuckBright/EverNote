<template>
  <div class="layout_inner mt5">
    <ever-form2
      :schema="querySchema"
      v-model="queryObj"
      :rules="querySchemaRules"
      ref="form"
      :inline="true"
      :is-query="true"
      @query="list(false)"
    >
      <template slot="default">
        <el-form-item>
          <el-button
            type="text"
            @click="handleSuperSearch"
          >高级搜索</el-button>
          <el-button
            type="primary"
            @click="list(false)"
          >查询</el-button>
          <el-button
            plain
            @click="reset(false)"
          >重置</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button
            plain
            @click="exportExcel"
          >导出</el-button>
          <el-button
            type="primary"
            @click="NewAppointShow=true"
          >新增</el-button>
        </el-form-item>
      </template>
    </ever-form2>
    <el-table
      :data="tableData"
      :loading="loading"
      style="width:100%;"
    >
      <el-table-column
        prop
        label="状态"
        :formatter="converToStatus"
      ></el-table-column>
      <el-table-column
        prop
        label="入院时间"
        show-overflow-tooltip
        :formatter="convertTime"
        :width="160"
      ></el-table-column>
      <el-table-column
        prop="patientName"
        label="姓名"
        width="90"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="patientBirthday"
        label="生日"
        width="105"
      ></el-table-column>
      <el-table-column
        prop="patientPhoneNumber"
        show-overflow-tooltip
        label="电话"
        width="115"
      ></el-table-column>
      <el-table-column
        prop="preAdmissionDate"
        label="预入院时间"
        width="105"
      ></el-table-column>
      <el-table-column
        prop="expectedDate"
        label="预产期"
        width="105"
      ></el-table-column>
      <el-table-column
        prop="deliveryModeName"
        label="分娩方式"
      ></el-table-column>
      <el-table-column
        prop="outpatientDoctorName"
        label="医生"
        width="90"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="roomTypeName"
        show-overflow-tooltip
        label="房型"
      ></el-table-column>
      <el-table-column
        prop="admitDeposit"
        label="押金"
        align="right"
        min-width="130"
      >
        <template slot-scope="scope">{{scope.row.admitDeposit | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createTime"
        show-overflow-tooltip
        label="登记时间"
        :width="160"
      ></el-table-column>
      <el-table-column
        prop="createByName"
        label="登记人"
        width="90"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        show-overflow-tooltip
        label="修改时间"
        :width="160"
      ></el-table-column>
      <el-table-column
        prop="updateByName"
        label="修改人"
        width="90"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="60"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="showDetail(scope.row)"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
    <el-dialog
      title="床位预约高级搜索"
      :visible.sync="superSearchShow"
      width="70%"
    >
      <ever-form2
        :schema="superQuerySchema"
        v-model="superQueryObj"
        ref="superSearch"
        :inline="true"
        :is-query="true"
        @query="list(true)"
        labelWidth="100px"
      >
        <template slot="createBy">
          <el-select
            v-model="superQueryObj.createBy"
            filterable
            clearable
            remote
            placeholder="请输入关键词"
            :remote-method="createRemoteMethod"
            :loading="createloading"
            style="width:100%;"
          >
            <el-option
              v-for="item in createStaffList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
        <template slot="updateBy">
          <el-select
            v-model="superQueryObj.updateBy"
            filterable
            clearable
            remote
            placeholder="请输入关键词"
            :remote-method="updateRemoteMethod"
            :loading="updateloading"
            style="width:100%;"
          >
            <el-option
              v-for="item in updateStaffList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button
              type="text"
              @click="superSearchShow=false"
            >收起搜索</el-button>
            <el-button
              type="primary"
              @click="list(true)"
            >查询</el-button>
            <el-button
              type="primary"
              plain
              @click="reset(true)"
            >重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </el-dialog>
    <el-dialog
      title="新增床位预约"
      :visible.sync="NewAppointShow"
    >
      <div class="basicInfo">
        <el-row>
          <el-col :span="12">
            <div class="el-form-item">
              <label
                class="el-form-item__label"
                style="width: 80px;"
              >患者姓名</label>
              <div
                class="el-form-item__content"
                style="margin-left: 80px;"
              >
                <hospitalselect
                  v-model="patientName"
                  :placeholder="'请选择患者'"
                  :allowCreate="true"
                  @select="handleSelect"
                  :usePatientId="true"
                ></hospitalselect>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="item">
              <label class="labelLeft">姓名：</label>
              <div class="contentRight">{{NewAppointPerson.patientName}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <label class="labelLeft">电话：</label>
              <div class="contentRight">{{NewAppointPerson.patient&&NewAppointPerson.patient.mobile}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <label class="labelLeft">出生日期：</label>
              <div
                class="contentRight"
                v-if="(NewAppointPerson.patient&&NewAppointPerson.patient.birthday)"
              >{{$moment(NewAppointPerson.patient&&NewAppointPerson.patient.birthday).format('YYYY-MM-DD')}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="6">
            <label class="labelLeft">
              入院证号：
            </label>
            <div class="contentRight">
              {{NewAppointPerson.hospitalizedNumber}}
            </div>
          </el-col>-->
          <el-col :span="8">
            <div class="item">
              <label class="labelLeft">入院押金：</label>
              <div class="contentRight">￥{{NewAppointPerson.deposit | formatToFinacial}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <label class="labelLeft">开立医生：</label>
              <div class="contentRight">{{NewAppointPerson.applianceDoctorName}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <label class="labelLeft">开立时间：</label>
              <div class="contentRight">{{NewAppointPerson.applianceCreateTime&&$moment(NewAppointPerson.applianceCreateTime).format('YYYY-MM-DD HH:MM:SS')}}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <ever-form2
        :schema="NewQuerySchema"
        v-model="NewQueryObj"
        :rules="NewQuerySchemaRules"
        ref="appointform"
      >
        <template slot="default">
          <el-col>
            <el-form-item>
              <el-button
                type="primary"
                plain
                @click="NewAppointShow=false"
              >取消</el-button>
              <el-button
                type="primary"
                @click="addNew"
              >确定</el-button>
            </el-form-item>
          </el-col>
        </template>
      </ever-form2>
    </el-dialog>
  </div>
</template>
<script>
import appointApi from '@/adt/store/bedappoint'
import hospitalselect from '@/components/hospitalselect'
import { wrapTable } from '../../../util/common'
import XLSX from 'xlsx'

let hosStatus = {
  '-1': '已取消',
  '0': '待入院',
  '11': '待入科',
  '12': '已入科',
  '13': '待出科',
  '14': '待出院',
  '2': '已出院'
}
let querySchema = [
  {
    label: '',
    name: 'dateCount',
    comp: 'ever-price',
    props: {
      type: 'number',
      prepend: '登记',
      append: '天以内',
      placeholder: '请输入登记天数以查询'
    },
    span: 4,
    labelWidth: '0'
  },
  {
    label: '患者',
    name: 'patientId',
    comp: hospitalselect,
    props: {
      placeholder: '请选择患者',
      allowCreate: true
    },
    span: 6,
    labelWidth: '55px'
  }
]
let myValidators = {
  checkDays: (rule, value, callback) => {
    if (value < 1 || value > 1000) {
      callback(new Error('查询登记时间必须在0-1000之间'))
    } else {
      callback()
    }
  }
}
let querySchemaRules = {
  dateCount: [
    {
      validator: myValidators.checkDays,
      trigger: 'blur'
    }
  ]
}
let superQuerySchema = [
  {
    label: '姓名',
    name: 'patientName',
    props: {
      placeholder: '请输入患者姓名/ID/手机号'
    },
    span: 8
  },
  // {
  //   label: '状态',
  //   name: 'hosStatus',
  //   props: {
  //     placeholder: '请选择住院状态'
  //   },
  //   span: 8
  // },
  {
    label: '医生',
    name: 'outpatientDoctorId',
    comp: 'ever-select',
    props: {
      placeholder: '请选择医生',
      options: [],
      filterable: true,
      clearable: true
    },
    span: 8
  },
  {
    label: '分娩方式',
    name: 'deliveryModeId',
    comp: 'sys-type',
    props: {
      code: 'CV02.10.003',
      placeholder: '请选择住院状态'
    },
    span: 8
  },
  {
    label: '房型',
    name: 'roomTypeId',
    comp: 'ever-select',
    props: {
      placeholder: '请选择房型',
      options: [],
      filterable: true,
      clearable: true
    },
    span: 8
  },
  {
    label: '登记人',
    name: 'createBy',
    comp: 'custom',
    span: 8
  },
  {
    label: '预入院日期',
    name: 'preadmissionDatetime',
    comp: 'everRangePicker',
    props: {
      autoWidth: true,
      placeholder: '请选择预入院日期'
    },
    style: 'width:100%',
    span: 8
  },
  {
    label: '登记日期',
    name: 'registerDatetime',
    comp: 'everRangePicker',
    props: {
      autoWidth: true,
      placeholder: '请选择登记日期'
    },
    span: 8
  },
  // {
  //   label: '入院时间',
  //   name: 'admitDatetime',
  //   comp: 'everRangePicker',
  //   props: {
  //     autoWidth: true,
  //     placeholder: '请选择入院时间'
  //   },
  //   span: 8
  // },
  {
    label: '修改人',
    name: 'updateBy',
    comp: 'custom',
    span: 8
  }
]
let NewQuerySchema = [
  {
    label: '门诊科室',
    name: 'outpatientDepartment',
    comp: 'ever-select',
    props: {
      placeholder: '请选择门诊科室',
      needObjFlag: true
    },
    span: 12
  },
  {
    label: '门诊医生',
    name: 'outpatientDoctor',
    comp: 'ever-select',
    props: {
      placeholder: '请选择门诊医生',
      needObjFlag: true
    },
    span: 12
  },
  {
    label: '分娩方式',
    name: 'birthType',
    comp: 'sys-type',
    props: {
      code: 'CV02.10.003',
      placeholder: '请选择分娩方式',
      useObject: true
    },
    span: 12
  },
  {
    label: '房型',
    name: 'houseType',
    comp: 'ever-select',
    props: {
      placeholder: '请选择房型',
      needObjFlag: true
    },
    span: 12
  },
  {
    label: '预入院日期',
    name: 'preAdmissionDate',
    comp: 'datePicker',
    props: {
      placeholder: '请选择预入院日期'
    },
    span: 12
  },
  {
    label: '预产期',
    name: 'expectedDate',
    comp: 'datePicker',
    props: {
      placeholder: '请选择预产日期'
    },
    span: 12
  },
  {
    label: '备注',
    name: 'remark',
    props: {
      placeholder: '请填写备注'
    },
    span: 12
  }
]
let NewQuerySchemaRules = {
  outpatientDepartment: [
    {
      required: true,
      message: '门诊科室不能为空',
      trigger: 'blur'
    }
  ],
  outpatientDoctor: [
    {
      required: true,
      message: '门诊医生不能为空',
      trigger: 'blur'
    }
  ],
  birthType: [
    {
      required: true,
      message: '分娩方式不能为空',
      trigger: 'blur'
    }
  ],
  houseType: [
    {
      required: true,
      message: '房型不能为空',
      trigger: 'blur'
    }
  ],
  preAdmissionDate: [
    {
      required: true,
      message: '预入院日期不能为空',
      trigger: 'blur'
    }
  ],
  expectedDate: [
    {
      required: true,
      message: '预产期不能为空',
      trigger: 'blur'
    }
  ],
  remark: [
    {
      max: 50,
      message: '备注不能大于50个字符',
      trigger: 'blur'
    }
  ]
}
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.dateCount = 1
    let superQueryObj = this.$ever.createObjFromSchema(superQuerySchema)
    let NewQueryObj = this.$ever.createObjFromSchema(NewQuerySchema)
    return {
      querySchema: querySchema,
      queryObj: queryObj,
      querySchemaRules: querySchemaRules,
      superQuerySchema: superQuerySchema,
      superQueryObj: superQueryObj,
      NewQuerySchema: NewQuerySchema,
      NewQueryObj: NewQueryObj,
      NewQuerySchemaRules: NewQuerySchemaRules,
      tableData: [],
      createStaffList: [],
      updateStaffList: [],
      superSearchShow: false,
      NewAppointShow: false,
      NewAppointPerson: {
        patientId: ''
      },
      pageSizes: [5, 10, 15, 20],
      pagesize: 20,
      pageIndex: 1,
      totalCount: 0,
      loading: false,
      createloading: false,
      updateloading: false,
      // false表示简单查询，true表示高级搜索
      lastSearchType: false,
      lastSearchParams: {},
      wrapTable,
      patientName: ''
    }
  },
  created () {
    // 获取房型
    this.getAdmitBedTypeList()
    // 获取医生列表
    this.getDocStaffList()
    // 获取科室列表
    this.getDpts()
    this.list()
  },
  watch: {
    NewAppointShow: {
      handler: function (val) {
        if (!val) {
          // this.emptyObject(this.NewAppointPerson)
          this.NewAppointPerson = {
            patientId: ''
          }
          this.patientName = ''
          this.emptyObject(this.NewQueryObj)
        }
      }
    }
  },
  components: {
    hospitalselect
  },
  methods: {
    list (isSuper) {
      this.loading = true
      // 简单搜索方式与高级搜索方式之间切换时，页码归零
      if (isSuper !== this.lastSearchType) {
        this.lastSearchType = isSuper
        this.pageIndex = 1
      }
      let params = {}
      if (isSuper) {
        Object.assign(params, this.superQueryObj)
        params.preAdmissionDateSt =
          this.superQueryObj.preadmissionDatetime &&
          this.superQueryObj.preadmissionDatetime[0]
        params.preAdmissionDateEd =
          this.superQueryObj.preadmissionDatetime &&
          this.superQueryObj.preadmissionDatetime[1]
        params.createTimeSt =
          this.superQueryObj.registerDatetime &&
          this.superQueryObj.registerDatetime[0]
        params.createTimeEd =
          this.superQueryObj.registerDatetime &&
          this.superQueryObj.registerDatetime[1]
        params.patientKeyword = this.superQueryObj.patientName
      } else {
        // 普通搜索
        params.dateCount = this.queryObj.dateCount
        // 如果是对象就要深一层拿patientId,如果是单纯的输入内容就给输入内容
        params.patientKeyword = this.queryObj.patientId.patientId ? this.queryObj.patientId.patientId : this.queryObj.patientId
      }
      params.pagesize = this.pagesize
      params.offset = (this.pageIndex - 1) * this.pagesize
      // 记录查询参数以供导出时使用
      this.lastSearchParams = params
      appointApi
        .getBedAppointList(params)
        .then(res => {
          if (res.head && res.head.errCode === 0) {
            this.tableData = res.data.list
            this.totalCount = res.data.totalCount
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    reset (isSuper) {
      isSuper
        ? this.$refs.superSearch.resetForm()
        : this.$refs.form.resetForm()
    },
    addNew () {
      // 添加逻辑
      if (!this.NewAppointPerson.patientId) {
        this.$messageTips(this, 'error', '请先选择要登记的患者')
        return false
      }
      this.$refs.appointform.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            hospitalizedNumber: this.NewAppointPerson.hospitalizedNumber,
            patientId: this.NewAppointPerson.patientId,
            patientName: this.NewAppointPerson.patientName,
            patientPhoneNumber:
              this.NewAppointPerson.patient &&
              this.NewAppointPerson.patient.mobile,
            patientBirthday: this.$moment(
              this.NewAppointPerson.patient &&
              this.NewAppointPerson.patient.birthday
            ).format('YYYY-MM-DD'),
            admitDeposit: this.NewAppointPerson.deposit,
            // 开立医生id和name
            openTheDoctorId: this.NewAppointPerson.applianceDoctorId,
            openTheDoctorName: this.NewAppointPerson.applianceDoctorName,
            // 开立时间
            openTheDatatime: this.$moment(
              this.NewAppointPerson.applianceCreateTime
            ).format('YYYY-MM-DD HH:MM:SS'),
            outpatientDepartmentId: this.NewQueryObj.outpatientDepartment.id,
            outpatientDepartmentName: this.NewQueryObj.outpatientDepartment
              .name,
            // 门诊医生
            outpatientDoctorId: this.NewQueryObj.outpatientDoctor.id,
            outpatientDoctorName: this.NewQueryObj.outpatientDoctor.name,
            // 分娩方式
            deliveryModeId: this.NewQueryObj.birthType.id,
            deliveryModeName: this.NewQueryObj.birthType.name,
            // 房型
            roomTypeId: this.NewQueryObj.houseType.id,
            roomTypeName: this.NewQueryObj.houseType.name,
            preAdmissionDate: this.NewQueryObj.preAdmissionDate,
            expectedDate: this.NewQueryObj.expectedDate,
            remark: this.NewQueryObj.remark
          }
          appointApi.saveBedAppoint(params).then(res => {
            if (res.head && res.head.errCode === 0) {
              this.$messageTips(this, 'success', '新增预约成功！')
              this.NewAppointShow = false
              this.list()
            }
          })
        }
      })
    },
    handleSuperSearch () {
      this.emptyObject(this.superQueryObj)
      this.superSearchShow = true
    },
    showDetail (row) {
      // this.NewAppointPerson = {}
      // 修改逻辑
      this.writeDataToForm(row)
      this.NewAppointShow = true
    },
    exportExcel () {
      appointApi.exportToExcel(this.lastSearchParams).then(res => {
        if (res.head && res.head.errCode === 0) {
          let data = []
          res.data && res.data.list.forEach((v, i) => {
            data.push({
              '状态': hosStatus[v.hosStatus],
              '入院时间': this.$moment(Number(v.hospitalizedTime)).format(
                'YYYY-MM-DD HH:MM:SS'
              ),
              '姓名': v.patientName,
              '生日': v.patientBirthday,
              '电话': v.patientPhoneNumber,
              '预入院时间': v.preAdmissionDate,
              '预产期': v.expectedDate,
              '分娩方式': v.deliveryModeName,
              '医生': v.outpatientDoctorName,
              '房型': v.roomTypeName,
              '押金': v.admitDeposit,
              '备注': v.remark,
              '登记时间': v.createTime,
              '登记人': v.createByName,
              '修改时间': v.updateTime,
              '修改人': v.updateByName
            })
          })
          /* 创建worksheet */
          let ws = XLSX.utils.json_to_sheet(data)
          /* 新建空workbook，然后加入worksheet */
          let wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, ws, 'People')

          /* 生成xlsx文件 */
          XLSX.writeFile(wb, '床位预约查询汇总表.xlsx')
        }
      })
    },
    handleSelect (val) {
      let params = {
        hospitalizedNumber: val.hospitalizedNumber
      }
      appointApi.getBedAppoint(params).then(res => {
        if (res.head && res.head.errCode === 0) {
          if (res.data && res.data.id) {
            let person = Object.assign({}, val, res.data)
            this.writeDataToForm(person)
            this.$messageTips(this, 'warning', '该患者已进行过床位预约，继续操作将对其信息进行修改操作')
          } else {
            // 把基本信息填上
            this.patientName = val.patientName
            this.NewAppointPerson = Object.assign({}, val)
            // 如果没有登记过，将下面的登记信息清空
            this.emptyObject(this.NewQueryObj)
          }
        }
      })
    },
    // 编辑状态
    writeDataToForm (row) {
      this.patientName = row.patientName
      this.NewAppointPerson = Object.assign({}, row)
      this.NewAppointPerson.patient = {}
      this.NewAppointPerson.patientName = row.patientName
      this.NewAppointPerson.patient.mobile = row.patientPhoneNumber
      this.NewAppointPerson.patient.birthday = row.patientBirthday
      this.NewAppointPerson.deposit = row.admitDeposit
      this.NewAppointPerson.applianceDoctorName = row.openTheDoctorName
      this.NewAppointPerson.applianceCreateTime = row.openTheDatatime
      Object.assign(this.NewQueryObj, row)
      // 回显门诊科室
      this.NewQueryObj.outpatientDepartment = {
        id: row.outpatientDepartmentId,
        name: row.outpatientDepartmentName
      }
      // 回显门诊医生
      this.NewQueryObj.outpatientDoctor = {
        id: row.outpatientDoctorId,
        name: row.outpatientDoctorName
      }
      // 回显生产方式
      this.NewQueryObj.birthType = {
        id: row.deliveryModeId,
        name: row.deliveryModeName
      }
      // 回显房型
      this.NewQueryObj.houseType = {
        id: row.roomTypeId,
        name: row.roomTypeName
      }
    },
    createRemoteMethod (query) {
      if (query !== '') {
        this.createloading = true
        let params = {
          name: query
        }
        appointApi.getStaffList(params).then(res => {
          this.createloading = false
          this.createStaffList = res.data
        })
      } else {
        this.createStaffList = []
      }
    },
    updateRemoteMethod (query) {
      if (query !== '') {
        this.updateloading = true
        let params = {
          name: query
        }
        appointApi.getStaffList(params).then(res => {
          this.updateloading = false
          this.updateStaffList = res.data
        })
      } else {
        this.updateStaffList = []
      }
    },
    downFile (data) {
      let params = {
        batchType: this.queryObj.batchType,
        batchId: this.queryObj.batchId,
        status: this.queryObj.status,
        cardBuyer: this.queryObj.cardBuyer,
        patientId: this.queryObj.patientId
      }
      appointApi.exportFile(params).then(result => {
        let filename = result.data.fileName
        let bucketName = result.data.bucketName
        this.$refs.childMethod.downfile(filename, bucketName)
      })
    },
    emptyObject (obj) {
      for (let v in obj) {
        obj[v] = ''
      }
    },
    converToStatus (row) {
      return hosStatus[row.hosStatus]
    },
    convertTime (row) {
      return row.hospitalizedTime ? this.$moment(Number(row.hospitalizedTime)).format('YYYY-MM-DD HH:mm:SS') : ''
    },
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.list()
    },
    handleCurrentChange (pageIndex) {
      this.pageIndex = pageIndex
      this.list()
    },
    getAdmitBedTypeList () {
      appointApi.getAdmitBedTypeList().then(result => {
        let houseTypeOptions = []
        for (let item of result.data && result.data.resultList) {
          if (item.hospitalBedProperties) {
            for (let v of item.hospitalBedProperties) {
              if (v.propertyCode === 'SXX000126') {
                houseTypeOptions.push({
                  id: v.hospitalBedId,
                  name: v.propertyValue
                })
                break
              }
            }
            continue
          }
        }
        this.$ever.getFieldFromSchema(
          this.superQuerySchema,
          'roomTypeId'
        ).props.options = houseTypeOptions
        this.$ever.getFieldFromSchema(
          this.NewQuerySchema,
          'houseType'
        ).props.options = houseTypeOptions
      })
    },
    getDocStaffList () {
      // 获取医生列表
      let params = {
        staffType: 'DOCTOR'
      }
      appointApi.getStaffList(params).then(res => {
        this.$ever.getFieldFromSchema(
          this.superQuerySchema,
          'outpatientDoctorId'
        ).props.options =
          res.data
        this.$ever.getFieldFromSchema(
          this.NewQuerySchema,
          'outpatientDoctor'
        ).props.options =
          res.data
      })
    },
    getDpts () {
      // 获取科室列表
      appointApi.getClinicInfo().then(result => {
        let params = { clinicId: result.id }
        appointApi.getDptsByOrgId(params).then(result => {
          if (result.data) {
            let DptIdsOptions = []
            for (let v of result.data) {
              DptIdsOptions.push({ id: v.id, name: v.name })
            }
            this.$ever.getFieldFromSchema(
              this.NewQuerySchema,
              'outpatientDepartment'
            ).props.options = DptIdsOptions
          }
        })
      })
    }
  }
}
</script>
<style scoped>
.basicInfo {
  margin-bottom: 15px;
  border-bottom: 1px solid #ccc;
}
.item::before,
.item::after {
  display: table;
  content: "";
}
.item::after {
  clear: both;
}
.labelLeft {
  float: left;
  width: 80px;
  padding: 0 10px 0 0;
  height: 40px;
  line-height: 18px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.contentRight {
  line-height: 40px;
  position: relative;
  margin-left: 80px;
  font-size: 14px;
}
.contentRight::before,
.contentRight::after {
  display: table;
  content: "";
}
.contentRight::after {
  clear: both;
}
</style>

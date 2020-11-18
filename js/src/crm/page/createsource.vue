<template>
  <div id="createvisit">
    <ever-bread-crumb :name="!id ? '添加渠道' : '编辑渠道'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="memlayout_inner">
      <div>
        <el-card>
          <h4>基本信息</h4>
          <ever-form2
            :schema="schema"
            v-model="obj"
            :api="api"
            :rules="rules"
            ref="form"
            label-position="right"
          >
            <template slot="typeId">
              <el-select v-model="sourcetype" placeholder="请选择">
                <el-option
                  v-for="item in sourceTypelist"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-button type="text" class="ml10" @click="showTypePop">管理</el-button>
            </template>
            <template slot="coopCity">
              <el-select v-model="coopCity" multiple filterable allow-create placeholder="请选择合作城市">
                <el-option
                  v-for="item in options5"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <div slot="default"></div>
          </ever-form2>
          <h4>合作情况</h4>
          <div class="el-row">
            <div class="el-col el-col-6">
              <div class="el-form-item">
                <label class="el-form-item__label" style="width: 120px;">签合同：</label>
                <div class="el-form-item__content" style="margin-left: 120px;">
                  <el-select v-model="hasDeal" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <ever-form2
            :schema="schema2"
            v-model="obj2"
            :api="api"
            :rules="rules"
            ref="form2"
            label-position="right"
            v-if="isContract"
          >
            <div slot="default"></div>
            <template slot="dealUrl">
              <el-row v-if="isContract">
                <el-col>
                  <ever-upload1 v-model="obj2.dealUrl" :split="'#'"></ever-upload1>
                </el-col>
              </el-row>
            </template>
            <template slot="coopTypeId" v-if="isContract">
              <el-select v-model="coopType" placeholder="请选择" clearable>
                <el-option
                  v-for="item in cooperationlist"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-button type="text" class="ml10" @click="showCooperation">管理</el-button>
            </template>
            <template slot="coopHospital">
               <ever-org-select ref="eos" v-model="hospital" type="select" multiple></ever-org-select>
            </template>
          </ever-form2>
          <h4>维护人信息</h4>
          <ever-form2
            :schema="schema3"
            v-model="obj3"
            :api="api"
            :rules="rules"
            ref="form3"
            label-position="right"
          >
           <template slot="opOrigId">
              <ever-org-select ref="eos" v-model="obj3.opOrigId" type="select" fields="id" @change="changeOrg"></ever-org-select>
           </template>
           <template slot="opDptId">
              <ever-subject-select v-model="obj3.opDptId" :params="params" fields="orgSubjectCode" type="select" @change="changeDpt"  :disabled="disabledsubject"></ever-subject-select>
            </template>
           <template slot="opDoctorId">
             <ever-staff-select ref="ess" v-model="obj3.opDoctorId" :params="paramsDoctor" fields="id"
             @change="changeDoctor" :disabled="disabledstaff"></ever-staff-select>
            </template>
            <div slot="default"></div>
          </ever-form2>
          <sourcetype-list
            ref="classlist"
            :dialogvisible="classPop"
            @close="closeTypePop"
            @save="getSourceType"
          ></sourcetype-list>
          <cooperation-list
            ref="cooperation"
            :dialogvisible="classPop"
            @close="closeTypePop"
            @save="getCooptype"
            @delete="deleteCooptype"
          ></cooperation-list>
          <div class="save-div">
            <el-col>
              <el-button type="primary" class="submit-btn" @click="createSource">
                <i class="iconfont icon-baocunweimoban"></i> 保存
              </el-button>
              <el-button type class="cancel-btn" @click="prevBack">
                <i class="iconfont icon-quxiao"></i> 取消
              </el-button>
            </el-col>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/sourceapi'
import capi from '../../warehouse/store/clinicapi'
import depart from '../../warehouse/store/departmentapi'
import coopapi from '../store/cooperationapi'
import form from '../../util/form'
import moment from 'moment'
import sourcetypeList from '../page/sourcetypelist'
import cooperationList from '../page/cooperationlist'
let schema = [
  {
    name: 'name',
    label: '渠道名称：',
    props: {
      clearable: true
    },
    span: 6
  },
  {
    name: 'parentId',
    label: '上级渠道：',
    comp: 'ever-select',
    props: {
      options: []
    },
    span: 6
  },
  {
    name: 'typeId',
    label: '类型：',
    comp: 'custom',
    span: 8
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 2
  },
  {
    name: 'coopCity',
    span: 6,
    label: '合作城市：',
    comp: 'custom'
  },
  {
    name: 'address',
    span: 6,
    label: '渠道地址：'
  },
  {
    name: 'contactDpt',
    span: 6,
    props: {
      maxlength: 30
    },
    label: '部门：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 2
  },
  {
    name: 'contactName',
    span: 6,
    props: {
      maxlength: 30
    },
    label: '联系人：'
  },
  {
    name: 'contactTitle',
    span: 6,
    props: {
      maxlength: 30
    },
    label: '职位：'
  },
  {
    name: 'contactMobile',
    type: 'text',
    span: 6,
    label: '联系方式：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 2
  },
  {
    name: 'contactMobile2',
    type: 'text',
    span: 6,
    label: '联系方式2：'
  },
  {
    name: 'contactEmail',
    comp: 'text',
    span: 6,
    label: 'Email：'
  },
  {
    name: 'contactWechat',
    comp: 'text',
    span: 6,
    label: '微信号：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 2
  },
  {
    name: 'status',
    label: '状态：',
    comp: 'sys-type',
    props: {
      code: 'THC_CC_MEMBER_CHANNEL_STATUS',
      useValue: true
    },
    span: 6
  }
]
let schema2 = [
  {
    name: 'dealSn',
    span: 6,
    props: {
      maxlength: 30
    },
    label: '合同编号：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 18
  },
  {
    name: 'dealUrl',
    comp: 'custom',
    span: 24,
    label: '附件：'
  },
  {
    name: 'coopTypeId',
    comp: 'custom',
    span: 6,
    label: '合作方式：'
  },
  {
    name: 'otherRebate',
    comp: 'el-input',
    props: {
      type: 'textarea',
      rows: 1,
      autosize: {
        minRows: 1,
        maxRows: 3
      },
      max: 500
    },
    span: 18,
    label: '其他返利：'
  },
  // {
  //   name: 'coopHospital',
  //   comp: 'ever-org-select',
  //   label: '合作医院：',
  //   props: {
  //     type: 'select',
  //     fields: 'id',
  //   }
  // },
  {
    name: 'coopHospital',
    comp: 'custom',
    span: 6,
    label: '合作医院：'
  },
  {
    name: 'rebatePayee',
    span: 6,
    label: '收款人：'
  },
  {
    name: 'rebatePayeeAccount',
    span: 6,
    label: '收款账号：'
  },
  {
    name: 'billCycle',
    comp: 'sys-type',
    props: {
      code: 'THC_CC_MEMBER_CHANNEL_BILL_CYCLE'
    },
    span: 6,
    label: '结算周期：'
  },
  {
    comp: 'div',
    style: {
      height: '50px'
    },
    span: 18
  },
  {
    name: 'discountInfo',
    span: 18,
    comp: 'el-input',
    props: {
      type: 'textarea',
      rows: 1,
      autosize: {
        minRows: 1,
        maxRows: 3
      },
      max: 500
    },
    label: '优惠信息：'
  },
  {
    name: 'idenMethod',
    span: 18,
    comp: 'el-input',
    props: {
      type: 'textarea',
      rows: 1,
      autosize: {
        minRows: 1,
        maxRows: 3
      },
      max: 100
    },
    label: '识别方式：'
  },
  {
    name: 'payMethod',
    span: 18,
    comp: 'el-input',
    props: {
      type: 'textarea',
      rows: 1,
      autosize: {
        minRows: 1,
        maxRows: 3
      },
      max: 100
    },
    label: '结账方式：'
  },
  {
    name: 'coopTime',
    comp: 'ever-range-picker',
    span: 18,
    label: '合作时间：'
  },
  {
    name: 'comment',
    props: {
      type: 'textarea',
      rows: 1,
      autosize: {
        minRows: 1,
        maxRows: 3
      },
      max: 500
    },
    span: 18,
    label: '说明：'
  }
]
let schema3 = [
  {
    name: 'opOrigId',
    comp: 'custom',
    label: '机构',
    props: {
      type: 'select',
      fields: 'id',
    }
  },
  {
    name: 'opDptId',
    comp: 'custom',
    label: '部门',
    props: {
      isOrg: false,
      type: 'select',
      fields: 'orgSubjectCode',
      disabled: true
    }
  },
  {
    name: 'opDoctorId',
    label: '维护人：',
    comp: 'custom',
    props: {
      options: [],
      fields: 'id',
      disabled: true
    },
    span: 6
  }
  // {
  //   name: 'opOrigId',
  //   comp: 'ever-org-select',
  //   label: '机构',
  //   props: {
  //     type: 'select',
  //     fields: 'id',
  //   }
  // },
  // {
  //   name: 'opDptId',
  //   comp: 'ever-subject-select',
  //   label: '部门',
  //   props: {
  //     isOrg: false,
  //     type: 'select',
  //     fields: 'orgSubjectCode',
  //     disabled: true
  //   }
  // },
  // {
  //   name: 'opDoctorId',
  //   label: '维护人：',
  //   comp: 'ever-staff-select',
  //   props: {
  //     options: [],
  //     fields: 'id',
  //     disabled: true
  //   },
  //   span: 6
  // }
]
export default {
  mixins: [form],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    let obj2 = this.$ever.createObjFromSchema(schema2)
    let obj3 = this.$ever.createObjFromSchema(schema3)
    obj2.coopTime = []
    return {
      params: {
        isOrg: false
      },
      paramsDoctor: {
        everQueryType: 'out'
      },
      disabledsubject: false,
      disabledstaff: false,
      schema,
      schema2,
      schema3,
      api: api,
      capi,
      coopapi,
      depart,
      id: this.$route.query.id,
      obj: obj,
      obj2,
      obj3,
      classPop: false,
      isContract: null,
      options5: [],
      coopCity: [],
      sourceTypelist: [],
      cooperationlist: [],
      uploadImgUrl: [],
      submitImg: [],
      coopType: '',
      coopTypeId: '',
      hasDeal: '',
      sourcetype: '',
      opOrigId: '',
      opDptId: '',
      opDoctorId: '',
      hospital: [],
      hospitallist: [],
      options: [
        {
          id: '0',
          name: '否'
        },
        {
          id: '1',
          name: '是'
        }
      ],
      rules: {
        name: [
          { min: 2, max: 50, required: true, message: '最多50个字符', trigger: 'blur', type: 'string' }
        ],
        typeId: [
          { required: false, message: '请选择类型', trigger: 'click', type: 'string' }
        ],
        coopCity: [
          { required: false, message: '请选择合作城市', trigger: 'blur', type: 'string' }
        ],
        contactName: [
          { required: false, message: '请填写联系人', trigger: 'blur', type: 'string' }
        ],
        contactTitle: [
          { required: false, message: '请填写联系人职位', trigger: 'blur', type: 'string' }
        ],
        contactMobile: [
          { required: false, message: '请填写电话', trigger: 'blur', type: 'string' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码' }
        ], // pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
        contactWechat: [
          { required: false, message: '请输入正确的微信号', trigger: 'blur' },
          { max: 30, message: '长度在30个字符内' }
        ],
        contactEmail: [
          { required: false, message: '请输入正确的email', trigger: 'blur' },
          { max: 30, pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入正确的email' }
        ],
        status: [
          { required: false, message: '请选择状态', trigger: 'blur' }
        ],
        hasDeal: [
          { required: false, message: '请选择是否签订合同', trigger: 'change', type: 'string' }
        ],
        opOrigId: [
          { required: false, message: '请选择机构', trigger: 'change' }
        ],
        opDptId: [
          { required: false, message: '请选择部门', trigger: 'change' }
        ],
        opDoctorId: [
          { required: false, message: '请选择维护人', trigger: 'change' }
        ],
        dealSn: [
          { required: false, max: 30, message: '请填写合同编号', trigger: 'blur' }
        ],
        coopTypeId: [
          { required: false, message: '请选择合作方式', trigger: 'change' }
        ],
        coopHospital: [
          { required: false, message: '请选择合作医院', trigger: 'blur' }
        ],
        coopTime: [
          { required: false, message: '请选择合作时间', trigger: 'blur', type: 'array' }
        ]
      }
    }
  },
  watch: {
    'hasDeal' (val) {
      if (val === '1' || val === '是') {
        this.isContract = true
        this.getCooptype()
      } else {
        this.isContract = false
      }
    },
    // 机构变化之后 科室的值要清空掉
    'obj3.opOrigId' (val) {
      if (!val) {
        this.disabledsubject = true
        this.disabledstaff = true
      } else {
        this.disabledsubject = false
        this.disabledstaff = false
      }
    },
    'obj3.opDptId' (val) {
      if (!val) {
        this.disabledstaff = true
      } else {
        this.disabledstaff = false
      }
    },
    'coopType' (val) {
      this.obj2.coopTypeId = val
      this.coopTypeId = val
    }
  },
  created () {
    if (this.id) {
      this.initData()
    }
    this.getSourceType()
    this.getChannels()
  },
  methods: {
    changeOrg (val) {
      if (val) {
        this.params = {
          orgIdList: [val],
          orgId: val
        }
      } else {
        this.disabledsubject = true
        this.disabledstaff = true
      }
      this.obj3.opDptId = ''
      this.obj3.opDoctorId = ''
    },
    changeDpt (val) {
      this.obj3.opDoctorId = ''
      if (val) {
        this.paramsDoctor = {
          orgIdList: [this.obj3.opOrigId],
          tenantSubjectIdList: [val],
          everQueryType: 'out'
        }
      } else {
        this.disabledstaff = true
      }
    },
    changeDoctor (val) {
    },
    getChannels () {
      this.api.getChannels().then(result => {
        if (result.data && result.data.resultList && result.data.resultList[0]) {
          let arr = result.data.resultList.filter((item) => {
            return item.id !== this.id
          }) || []
          this.$ever.getFieldFromSchema(this.schema, 'parentId').props.options = arr
        }
      })
    },
    prevBack () {
      window.history.go(-1)
    },
    initData () {
      this.api.request({ id: this.id }).then(rs => {
        if (rs.data) {
          this.obj = Object.assign(this.obj, rs.data)
          if (rs.data.parentId === 0 || rs.data.parentId === '0') {
            this.obj.parentId = ''
          }
          this.obj.id = rs.data.id
          this.obj.sn = rs.data.sn
          if (rs.data.channelType && rs.data.channelType.id) {
            this.sourcetype = rs.data.channelType.id
          } else {
            this.sourcetype = ''
          }
          if (rs.data.hasDeal) {
            this.obj2.dealSn = rs.data.dealSn
            this.obj2.coopHospital = rs.data.coopHospital
            this.obj2.otherRebate = rs.data.otherRebate
            this.obj2.rebatePayee = rs.data.rebatePayee
            this.obj2.rebatePayeeAccount = rs.data.rebatePayeeAccount
            this.obj2.billCycle = rs.data.billCycle
            this.obj2.discountInfo = rs.data.discountInfo
            this.obj2.idenMethod = rs.data.idenMethod
            this.obj2.payMethod = rs.data.payMethod
            this.obj2.comment = rs.data.comment
            this.hospital = rs.data.coopHospitalList.map(v => {
              return {
                id: String(v.id),
                name: v.name,
                code: String(v.id)
              }
            })
            // this.hospital = rs.data.coopHospital.split(',')
            this.coopType = rs.data.coopTypeName
            if (rs.data.coopType) {
              this.coopTypeId = rs.data.coopType.id
              this.obj2.coopTypeId = rs.data.coopType.id
              this.coopType = rs.data.coopType.id
            }
            this.obj2.coopTime.push(rs.data.startTime, rs.data.endTime)
            this.obj2.dealUrl = rs.data.dealUrl
          }
          this.hasDeal = rs.data.hasDeal ? '是' : '否'
          if (rs.data.coopCity) {
            this.coopCity = rs.data.coopCity.split(',')
          } else {
            this.coopCity = []
          }
          this.opOrigId = rs.data.opOrigId ? String(rs.data.opOrigId) : ''
          this.opDptId = rs.data.opDptId
          this.opDoctorId = rs.data.opDoctorId
          this.obj3.opOrigId = rs.data.opOrigId ? String(rs.data.opOrigId) : ''
          this.$nextTick(_ => {
            this.obj3.opDptId = rs.data.opDptId
            this.obj3.opDoctorId = rs.data.opDoctorId
          })
          this.obj3.opDptId = rs.data.opDptId
        }
      })
    },
    showTypePop () {
      this.$refs.classlist.dialog = true
    },
    closeTypePop () {
      this.$refs.classlist.dialog = false
    },
    showCooperation () {
      this.$refs.cooperation.dialog = true
    },
    closeCooperation () {
      this.$refs.cooperation.dialog = false
    },
    getSourceType () {
      this.api.getTypelist().then(rs => {
        if (rs.data) {
          this.sourceTypelist = rs.data
        }
      })
    },
    deleteCooptype (id) {
      this.coopapi.list().then(rs => {
        if (rs.data) {
          this.cooperationlist = rs.data
          if (this.obj2.coopTypeId === id) {
            this.obj2.coopTypeId = ''
            this.coopTypeId = ''
            this.coopType = ''
          }
        }
      })
    },
    getCooptype () {
      this.coopapi.list().then(rs => {
        if (rs.data) {
          this.cooperationlist = rs.data
        }
      })
    },
    // 根据机构查询科室
    getDptList (clinicId) {
      this.depart.list({ clinicId: clinicId }).then(rs => {
        if (rs) {
          this.$ever.getFieldFromSchema(this.schema3, 'opDptId').props.options = rs
        }
      })
    },
    uploadChange (fileList) {
      if (fileList && fileList.length) {
        this.uploadImgUrl = [...this.uploadImgUrl, ...fileList]
      }
    },
    createSource () {
      let mainobj = {}
      this.obj.coopCity = this.coopCity && this.coopCity.join()
      this.obj.typeId = this.sourcetype
      if (this.hasDeal === '否') {
        this.obj.hasDeal = 0
      } else if (this.hasDeal === '是') {
        this.obj.hasDeal = 1
      } else {
        this.obj.hasDeal = parseInt(this.hasDeal)
      }
      if (this.hasDeal === '1' || this.hasDeal === '是') {
        this.obj2.startTime = moment(this.obj2.coopTime[0]).format('YYYY-MM-DD 00:00:00')
        this.obj2.endTime = moment(this.obj2.coopTime[1]).format('YYYY-MM-DD 00:00:00')
        this.obj2.coopTypeId = this.coopTypeId ? this.coopTypeId : this.obj2.coopTypeId
        let array = this.hospital && this.hospital[0] ? this.hospital.map(v => { return v.code }) : []
        this.obj2.coopHospital = array && array[0] ? array.join(',') : ''
        Object.assign(mainobj, this.obj, this.obj2, this.obj3)
      } else {
        Object.assign(mainobj, this.obj, this.obj3)
      }
      this.$refs.form.$refs.form.validate(valid1 => {
        if (valid1) {
          this.sourceCreate(mainobj)
        }
      })
    },
    sourceCreate (mainobj) {
      this.api.sourceCreate(mainobj).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '操作成功', '成功')
          this.$router.push({ path: 'sourcedetail', query: { id: rs.data.id } })
        }
      })
    }
  },
  components: {
    sourcetypeList,
    cooperationList
  }
}
</script>
<style scoped>
#createvisit .el-input-group__append .el-button {
  background: #1c7bef;
  border-radius: 0;
  color: #fff;
}
#createvisit .el-input-group__append .is-disabled {
  background: rgb(238, 240, 246) !important;
  color: #bbb !important;
}
#createvisit .el-dialog__header .el-dialog__title {
  padding-left: 10px;
  font-size: 16px;
}
#createvisit .el-card__header strong.title {
  border-left: 3px solid #1c7bef;
  padding-left: 12px;
}
.save-div {
  margin-left: 120px;
  height: 40px;
}
</style>

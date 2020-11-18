<!--
  params
  isreadOnly 是否只读
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    class="ui_dialog_02 restrict"
    :before-close="closeEvent"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    refs="dialogRestrict"
  >
    <el-row v-show="!patientShow">
      <el-col :span="2">
        <span class="height30">搜索客户</span>
      </el-col>
      <el-col :span="10">
        <ever-patient-select
          v-model="patientName"
          :allow-create="true"
          @select="selectPatient"
          :stafftips="true">
      </ever-patient-select>
      </el-col>
    </el-row>
    <el-row v-show="patientShow" class="content">
      <el-col class="height30 mb5">
        <span class="mgl10 fweight">{{patientObj.name}}</span>
        <span class="mgl10 fweight"><sys-value type="GBT.2261.1" :code="patientObj.sex"></sys-value></span>
        <span class="mgl10 fweight">{{patientObj && patientObj.ageShowText}}</span>
        <span class="mgl15">手机号:{{patientObj.mobile}}</span>
        <span class="mgl15">身份证号：{{patientObj.idNo || '--'}}</span>
        <span class="mgl15" v-if="patientObj">档案号：{{patientObj.patientNumber && patientObj.patientNumber != 'temporary' ? patientObj.patientNumber : '--'}}</span>
        <span class="icon-spancard cBlue pointer" @click="editPatient" v-show="!editHide">更换</span>
      </el-col>
    </el-row>
    <ever-form2
      v-show="!isreadOnly"
      :schema="schema"
      v-model="obj"
      :rules="rules"
      ref="restrict"
      label-position="left"
      :label-width="'80px'"
      class="mt10"
    >
      <div slot="default"></div>
      <template slot="labellist">
        <add-tag :tags="tags" :objLabelList="objLabelList"></add-tag>
      </template>
      <template slot="service">
        <el-checkbox-group
          v-model="firm"
          :min="0"
          :max="2">
          <el-checkbox v-for="item in firmArr" :label="item.code" :key="item.code">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </template>
      <template slot="scopeType">
        <el-row>
          <el-col :span="4" class="mr5">
            <ever-select v-model="obj.scopeType" :options="range"></ever-select>
          </el-col>
          <el-col :span="19">
            <ever-staff-select v-model="scopeContent" :params="paramObj" :clearable="true" multiple :disabled="isDisabled" type="select" fields="id"></ever-staff-select>
          </el-col>
        </el-row>
      </template>
      <template slot="timeWay">
        <el-radio v-model="obj.timeWay" :label="1">永久</el-radio>
        <el-radio v-model="obj.timeWay" :label="2">定期</el-radio>
        <span v-show="isSet">{{timeNum}}{{timeTypeArr[timeType]}}</span>
        <span v-show="!isSet">
          <ever-price v-model="timeNum" placeholder="请输入" width="100px" style="display: inline-block;" :disabled="obj.timeWay != 2"></ever-price>
          <el-select v-model="timeType" :disabled="obj.timeWay != 2">
            <el-option
              v-for="item in timeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
        <span class="mgl10">失效日:{{isSet ? obj.invalidTime ? obj.invalidTime : '永不失效' : invalidTime}}</span>
        <span v-show="isEdit" class="col-blue" @click="resetCease">重设限制期</span>
      </template>
    </ever-form2>
    <ever-form2
      v-show="isreadOnly"
      :schema="schema1"
      v-model="obj1"
      label-position="left"
      :label-width="'80px'"
      class="mt10">
      <div slot="default"></div>
      <template slot="labellist">
        {{obj1.patient && obj1.patient.member && obj1.patient.member.labelNames}}
      </template>
      <template slot="service">
        {{obj1.service && obj1.service.split(',').map(item => serviceType[item]).join()}}
      </template>
      <template slot="scopeType">
        <span v-if="obj1.scopeType == 1">集团</span>
        <span v-else>医生 | {{obj1.scopeDoctorNames && obj1.scopeDoctorNames.map(item => item.name).join()}}</span>
      </template>
      <template slot="timeWay">
        <span v-if="obj1.timeWay == 1">永不失效</span>
        <span v-else>{{obj1.timeNum}}{{timeTypeArr[obj1.timeType]}}</span>
        <span class="mgl10">失效日:</span>
        <span v-if="obj1.timeWay == 1">永不失效</span>
        <span v-else>{{$moment(obj1.invalidTime).format('YYYY-MM-DD')}}</span>
      </template>
      <template slot="creator">
        <div class="cGray6 create">
          <span>创建人</span><span class="ml10">{{obj1.creatorName}}</span>
          <span class="ml10">创建时间</span><span class="ml10">{{$moment(obj1.createTime).format('YYYY-MM-DD')}}</span>
        </div>
      </template>
    </ever-form2>
    <span slot="footer" class="dialog-footer" v-if="!isreadOnly">
      <el-button @click="closeEvent">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-else>
      <el-button v-if="obj1.status == 1" type="primary" @click="stopped(obj1.id)">停用</el-button>
      <el-button v-if="obj1.status == 1" type="primary" @click="change">修改</el-button>
    </span>
  </el-dialog>
</template>
<script>
import addTag from '@/crm/components/add.tag'
import sysvalue from '@/warehouse/store/sysvalueapi'
import api from '@/crm/store/greydenyapi'
import { STAFF_TYPE } from '@/crm/util/common'
// import { ageShow } from '@/util/common'
let schema = [
  {
    name: 'labellist',
    label: '客户标签',
    comp: 'custom',
    span: 24
  },
  {
    name: 'service',
    label: '限制业务',
    comp: 'custom',
    span: 24
  },
  {
    name: 'scopeType',
    label: '限制范围',
    comp: 'custom',
    span: 24
  },
  {
    name: 'timeWay',
    label: '限制期',
    comp: 'custom',
    span: 24
  },
  {
    name: 'reason',
    label: '限制原因',
    comp: 'el-input',
    props: {
      type: 'textarea',
      maxlength: 500
    },
    span: 20
  }
]
let schema1 = [
  {
    name: 'labellist',
    label: '客户标签',
    comp: 'custom',
    span: 24
  },
  {
    name: 'service',
    label: '限制业务',
    comp: 'custom',
    span: 24
  },
  {
    name: 'scopeType',
    label: '限制范围',
    comp: 'custom',
    span: 24
  },
  {
    name: 'timeWay',
    label: '限制期',
    comp: 'custom',
    span: 24
  },
  {
    name: 'reason',
    label: '限制原因',
    comp: 'readonlyitem',
    span: 20
  },
  {
    name: 'creator',
    comp: 'custom'
  }
]
export default {
  props: {
    'visible': {
      type: Boolean,
      default: false
    },
    'id': {
      type: String,
      default: ''
    },
    'title': {
      type: String,
      default: '添加客户限制'
    },
    'isEdit': {
      type: Boolean,
      default: false
    },
    'isreadOnly': {
      type: Boolean,
      default: false
    },
    'editHide': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      obj: {},
      obj1: {},
      schema,
      schema1,
      patientName: '',
      dialogVisible: false,
      isDisabled: false,
      patientObj: {},
      patientShow: false,
      isSet: false,
      firm: [],
      firmArr: [],
      tags: [],
      doctorTags: [],
      objLabelList: [],
      STAFF_TYPE,
      scopeContent: [],
      date: this.$moment(new Date()).format('YYYY-MM-DD'),
      range: [
        {
          id: 1,
          name: '集团'
        }, {
          id: 2,
          name: '医生'
        }
      ],
      doctor: '',
      doctorArr: [],
      timeNum: '',
      timeType: '',
      timeArr: [
        {
          value: 1,
          label: '年'
        },
        {
          value: 2,
          label: '月'
        },
        {
          value: 5,
          label: '日'
        }
      ],
      timeTypeArr: {
        1: '年',
        2: '月',
        5: '天'
      },
      serviceType: {
        '1': '预约',
        '2': '挂号'
      },
      loading: false,
      list: [],
      rules: {
        service: [
          { required: true, message: '请选择限制业务', trigger: 'change' }
        ],
        scopeType: [
          { required: true, message: '请选择限制范围', trigger: 'change' }
        ],
        timeWay: [
          { required: true, message: '请选择限制期' }
        ]
      },
      paramObj: { typeCodeList: [STAFF_TYPE[0].id] }
    }
  },
  created () {
    this.getFirm()
    this.getStaffList()
  },
  watch: {
    dialogVisible (val) {
      if (this.dialogVisible) {
        this.obj = this.$ever.createObjFromSchema(this.schema)
        this.obj1 = this.$ever.createObjFromSchema(this.schema1)
        this.scopeContent = ''
        this.obj.service = []
        this.obj.timeWay = 1
      }
      this.id ? this.getByPatientId(this.id) : this.reset()
    },
    'obj.scopeType': {
      handler (val) {
        this.isDisabled = val === 1
      }
    },
    'firm': {
      handler (val) {
        this.obj.service = val.length > 0 && val.join()
      }
    },
    'scopeContent': {
      handler (val) {
        if (val && val.length) {
          if (val.length > 9) {
            this.scopeContent = this.scopeContent.slice(0, 9)
            this.$messageTips(this, 'warning', '最多可以选中10个医生')
          }
        }
      },
      deep: true
    }
  },
  computed: {
    invalidTime: {
      get () {
        if (this.obj.timeWay === 2 && this.timeNum && this.timeType) {
          switch (this.timeType) {
            case 5:
              return this.$moment(this.date).add(this.timeNum, 'days').format('YYYY-MM-DD')
            case 2:
              return this.$moment(this.date).add(this.timeNum, 'months').format('YYYY-MM-DD')
            case 1:
              return this.$moment(this.date).add(this.timeNum, 'years').format('YYYY-MM-DD')
          }
        } else {
          return '永不失效'
        }
      },
      set (val) {
        return val
      }
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
    },
    closeEvent () {
      this.dialogVisible = false
      this.reset()
    },
    save () {
      this.obj.timeType = this.timeType
      this.obj.timeNum = this.timeNum
      this.obj.invalidTime = this.obj.timeWay === 2 ? (this.invalidTime === '永不失效' ? '' : this.$moment(this.invalidTime).format('YYYY-MM-DD')) : ''
      this.obj.service = this.firm.join()
      if (this.obj.scopeType === 2) {
        this.obj.scopeContent = this.scopeContent.length && this.scopeContent.join()
      }
      this.obj.labelIds = this.objLabelList || []
      let request = this.obj.id ? api.modify : api.create
      this.$refs.restrict.$refs.form.validate(valid => {
        valid && request(this.obj).then(rs => {
          if (rs.head.errCode === 0) {
            this.dialogVisible = false
            let msg = this.obj.id ? '修改受限客户成功' : '创建新受限客户成功'
            this.$messageTips(this, 'success', msg)
            setTimeout(() => {
              this.$emit('update', true)
            }, 500)
          }
        })
      })
    },
    selectPatient (val) {
      this.obj.patientId = val.id
      this.patientObj = val
      this.patientShow = true
      this.patientObj && this.returnTags(this.patientObj)
    },
    editPatient () {
      this.reset()
    },
    stopped (id) {
      this.$confirm('你确定要停用此用户的业务限制吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.stop({'id': id}).then(rs => {
          if (rs.head.errCode === 0) {
            this.dialogVisible = false
            this.$emit('update', true)
          }
        })
      })
    },
    reset () {
      this.patientShow = false
      this.isSet = false
      this.isreadOnly || Object.keys(this.patientObj).forEach(keys => {
        this.patientObj[keys] = ''
      })
      this.patientName = ''
      this.tags = []
      this.doctorTags = []
      this.objLabelList = []
      this.doctor = ''
      this.firm = []
      this.timeNum = ''
      this.timeType = ''
      Object.keys(this.obj).forEach(keys => {
        this.obj[keys] = ''
      })
    },
    getFirm () {
      sysvalue.listOnce('THC_CRM_DENY_SERVICE').then(rs => {
        this.firmArr = rs || []
      })
    },
    getByPatientId (id) {
      api.getById({'id': id}).then(rs => {
        this.patientShow = true
        this.isSet = true
        this.obj.id = rs.data.id
        this.obj.patientId = rs.data.patientId
        this.patientObj = rs.data.patient
        this.patientObj && this.returnTags(this.patientObj)
        this.firm = rs.data.service.split(',')
        this.obj.scopeType = rs.data.scopeType
        this.obj.reason = rs.data.reason
        this.obj.invalidTime = rs.data.invalidTime ? this.$moment(rs.data.invalidTime).format('YYYY-MM-DD') : ''
        if (rs.data.scopeType === 2) this.scopeContent = rs.data.scopeContent.split(',')
        this.obj.timeWay = rs.data.timeWay
        if (rs.data.timeWay === 2) {
          this.timeNum = rs.data.timeNum
          this.timeType = rs.data.timeType
        }
        if (this.isreadOnly) {
          this.obj1 = rs.data
          this.obj1.reason = rs.data.reason
        }
      })
    },
    returnTags (val) {
      if (val && val.member && val.member.objLabelList) {
        this.tags = val.member.objLabelList.map(item => {
          return item.labelName
        })
        this.objLabelList = val.member.objLabelList.map(item => {
          return item.labelId
        })
      } else {
        this.tags = []
        this.objLabelList = []
      }
    },
    resetCease (val) {
      this.isSet = false
    },
    querySearch (queryString, cb) {
      let results = queryString ? this.doctorArr.filter(this.createFilter(queryString)) : this.doctorArr
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    getStaffList (name) {
      api.getStaffList({
        typeCodeList: [STAFF_TYPE[0].id]
      })
      .then(rs => {
        if (rs.head.errCode === 0) {
          this.doctorArr = rs.data.resultList
        }
      })
    },
    change () {
      this.$emit('change', false)
    },
    handleSelect (val) {
      if (this.doctorTags.length > 9) {
        this.$messageTips(this, 'warning', '最多可以选中10个医生')
      } else {
        let isReapet = this.doctorTags && this.doctorTags.some(item => {
          return item.id === val.id
        })
        if (isReapet) {
          this.$messageTips(this, 'warning', '此医生已添加过，请勿重复添加')
          this.doctor = ''
          return false
        } else {
          val.id && this.doctorTags.push(val)
        }
      }
      this.doctor = ''
    },
    removeTag (tag) {
      this.doctorTags.splice(this.doctorTags.indexOf(tag), 1)
    }
  },
  components: {
    addTag
  }
}
</script>
<style scoped>
.restrict /deep/ .el-input .el-input__inner {
  height: 30px!important;
}
.restrict /deep/ .iconSpan{
  top: 14px !important;
}
.restrict /deep/ .el-form-item__label {
  height: 30px!important;
}
.restrict /deep/ .el-form-item__content {
  min-height: 30px!important;
  line-height: 30px!important;
}
.restrict /deep/ .el-checkbox {
  height:30px!important;
}
.restrict /deep/ .el-checkbox-group{
  height:30px!important;
}
.restrict /deep/ .el-tag{
  margin-left:10px;
}
.height30{
  height: 30px;
  line-height: 30px;
}
.content{
  border-bottom: 1px solid #BBBBBB;
}
.create{
  border-top:1px solid #ccc;margin-left: -65px;
}
</style>


<template>
  <el-dialog title="新生儿登记" :visible.sync="flag" class="ui_dialog_02" :before-close="close">
    <div class="fixed_info">
      <span>母亲姓名：{{ outofinfo.patient ? outofinfo.patient.name : '--' }}</span>
      <span>住院号：{{outofinfo.patient && outofinfo.patient.patientOrg && outofinfo.patient.patientOrg.inpatientNumber}}</span>
      <span>床号：{{outofinfo.hospitalizedBedName}}</span>
      <span>科别：{{outofinfo.providerName}}</span>
    </div>
    <ever-form2
      :schema="schema"
      v-model="obj"
      :span="12"
      labelWidth="110px"
      label-position="right"
      ref="form"
      :nosubmit="true"
      :rules="rules"
      @objsaved="afterSave"
    >
      <template slot="neonateMidwifeObj">
        <el-select
          v-model="obj.neonateMidwifeObj"
          clearable
          filterable
          placeholder="请选择"
          value-key="id"
        >
          <el-option v-for="item in nurseOptions" :key="item.id" :label="item.name" :value="item"></el-option>
        </el-select>
      </template>
    </ever-form2>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save">保存并打印腕带</el-button>
    </div>
    <!-- <print-wrap v-show="false" id="wristbandPrint" v-if="wristbandConfig && wristbandConfig.length && wristbandData" v-model="wristbandData" :settings="wristbandConfig" :type="1"></print-wrap> -->
  </el-dialog>
</template>
<script>
import api from '../store/mainheaderapi'
import PrintWrap from '@/sob/page/wristband/common/print.wrap'
// import wristbandApi from '@/sob/store/wristband'
// import {doPrint} from '@/util/print'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { singlePrint } from '@/inpatient/components/sendarea.print.js'
let schema = [
  // {
  //   name: 'name',
  //   span: 8,
  //   label: '父亲姓名'
  // },
  // {
  //   name: 'name',
  //   span: 16,
  //   label: '父亲身份证号'
  // },
  // {
  //   name: 'birthday',
  //   label: '出生时间',
  //   span: 8,
  //   comp: 'date',
  //   style: 'width: 100%'
  // },
  {
    label: '出生时间',
    name: 'birthday1',
    comp: 'datePicker',
    props: {
      placeholder: '请选择',
      type: 'datetime',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
      // value: new Date().getTime()
    },
    span: 8
  },
  {
    name: 'sex',
    label: '婴儿性别',
    span: 8,
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.1',
      useValue: true,
      placeholder: '全部'
    }
  },
  {
    name: 'patientName',
    span: 8,
    label: '婴儿姓名'
  },
  {
    name: 'deliveryType',
    label: '分娩方式',
    span: 8,
    comp: 'sys-type',
    props: {
      code: 'CV02.10.003',
      placeholder: '分娩方式'
    }
  },
  {
    name: 'neonateWeight',
    label: '体重',
    span: 8,
    props: {
      placeholder: '请输入体重'
    },
    slots: [
      {
        name: 'append',
        template: '<span>g</span>'
      }
    ]
  },
  {
    name: 'neonateHeight',
    label: '身长',
    span: 8,
    props: {
      placeholder: '请输入身长'
    },
    slots: [
      {
        name: 'append',
        template: '<span>cm</span>'
      }
    ]
  },
  {
    name: 'neonateMidwifeObj',
    label: '接生者',
    span: 8,
    comp: 'custom',
    props: {
      options: [],
      valueKey: 'id'
    }
  },
  {
    name: 'isHighRiskPregnant',
    label: '高危妊娠',
    span: 8,
    comp: 'sys-type',
    props: {
      code: 'THC_ZYGZT_XSEDJ_GWRS'
    }
  },
  {
    name: 'neonateStatus',
    label: '婴儿情况',
    span: 8,
    comp: 'sys-type',
    props: {
      code: 'THC_ZYGZT_XSEDJ_YEQK'
    }
  },
  {
    name: 'neonateHealthCondition',
    label: '健康情况',
    span: 8,
    comp: 'sys-type',
    props: {
      code: 'THC_ZYGZT_XSEDJ_JKQK'
    }
  },
  {
    name: 'neonatePerineum',
    label: '会阴情况',
    span: 8,
    comp: 'sys-type',
    props: {
      code: 'THC_ZYGZT_XSEDJ_HYQK'
    }
  },
  {
    name: 'neonateDefective',
    label: '肉眼可见缺陷',
    span: 16,
    comp: 'sys-type',
    props: {
      code: 'THC_ZYGZT_XSEDJ_RYKJ'
    }
  },
  {
    name: 'description',
    label: '备注',
    comp: 'el-input',
    props: {
      type: 'textarea',
      placeholder: '输入备注',
      max: 200
    },
    span: 24
  }
]

export default {
  props: [],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    function numberval (rule, value, callback) {
      if (isNaN(Number(value))) {
        callback(new Error('请输入数字类型'))
      } else {
        callback()
      }
    }
    let validate = (rule, value, callback) => {
      if (!value) {
        callback('请选择出生日期')
      } else if (this.$moment(value).valueOf() - this.$moment().valueOf() <= 0) {
        callback()
      } else {
        callback(new Error('不能大于当前时间'))
      }
    }
    return {
      api,
      flag: false,
      schema,
      obj,
      sysvalue,
      outofinfo: {},
      nurseOptions: [],
      wristbandConfig: [],
      wristbandData: null,
      returnObj: {},
      sexOptions: [],
      rules: {
        patientName: [
          { required: true, message: '请输入婴儿姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择婴儿性别', trigger: 'blur' }
        ],
        birthday1: [
          { required: true, trigger: 'blur', validator: validate }
        ],
        neonateWeight: [
          { validator: numberval, trigger: 'blur' }
        ],
        neonateHeight: [
          { validator: numberval, trigger: 'blur' }
        ],
        deliveryType: [
          { required: true, message: '请选择分娩方式', trigger: 'select' }
        ],
        neonateMidwifeObj: [
          { required: true, message: '请选择接生人员', trigger: 'select' }
        ]
      }
    }
  },
  watch: {
    async 'obj.sex' (val) {
      if (!this.obj.patientName && val) {
        let res = await this.api.getBabyName({
          hospitalizedNumber: this.outofinfo.hospitalizedNumber
        })
        let num = Number(res.data[val] + 1) || 1
        // let no = Number(res.totalCount) + 1
        if (num === 1) num = ''
        let sex = ''
        this.sexOptions.forEach(ele => {
          if (ele.value === val) {
            sex = ele.name
          }
        })
        this.obj.patientName = this.outofinfo.patient.name + '之' + sex + num
      }
    }
  },
  components: {
    PrintWrap
  },
  created () {
    this.getStaff()
    // this.getWristbandConfig(0)
    this.$bus.$on('dialog:newborn', val => {
      this.open(val)
    })
    // todo 校验逻辑 @建伟 直接取数据自己处理逻辑需要检验
    this.sysvalue.listOnce('GBT.2261.1').then(result => {
      this.sexOptions = result
      this.sexOptions.forEach(ele => {
        if (ele.name === '男') ele.name = '子'
      })
    })
  },
  methods: {
    async getWristbandConfig (type) {
      // const res = await wristbandApi.getConfig({isNewborn: type, visitType: 2})
      // if (res && res.data && res.data.length) {
      //   if (res.data[0] && res.data[0].content) {
      //     this.wristbandConfig = JSON.parse(res.data[0].content)
      //   }
      // }
    },
    async createWristband (done) {
      // let hosRecDiagnosis = this.returnObj.diagnosis
      // if (this.returnObj.position) hosRecDiagnosis = `${hosRecDiagnosis}（${this.returnObj.position}）`
      // let data = {
      //   visitType: 2,
      //   patientId: this.returnObj.patientId || '',
      //   patientName: this.returnObj.patientName || '',
      //   patientSex: this.returnObj.sex || '', //
      //   birthday: this.returnObj.birthday || '', //
      //   outDoctorName: this.returnObj.applianceDoctorName || '',
      //   outDoctorId: this.returnObj.applianceDoctorId || '',
      //   providerId: this.returnObj.providerId,
      //   providerName: this.returnObj.providerName,
      //   hosRecDiagnosis: hosRecDiagnosis, //
      //   // infectedPatchId: this.indepartFormObj.hospitalizedAreaObj.id, //
      //   // infectedPatchName: this.indepartFormObj.hospitalizedAreaObj.name, //
      //   hospitalizedNumber: this.returnObj.hospitalizedNumber, //
      //   // hospitalNum: this.indepartFormObj.hospitalizedBedObj.bedCode,
      //   beHospitalizedTime: this.returnObj.hospitalizedTime,
      //   status: 0
      // }
      // const res = await wristbandApi.createOrUpdate(data)
      // if (res && res.data && res.data.id) {
      //   this.wristbandData = res.data
      //   doPrint(this, 'wristbandPrint', false, false, false, _ => {
      //     if (done) done()
      //   })
      // }
    },
    getStaff () {
      this.api.getStaff({ staffType: 40 }).then(rs => {
        if (rs && rs.data) {
          this.nurseOptions = rs.data
        }
      })
    },
    createNewborn (params) {
      this.api.createNewborn(params).then(rs => {
        if (rs.errCode) {
          return false
        }
        this.$notify({
          type: 'success',
          title: '成功',
          message: '新生儿登记成功',
          duration: 3000
        })
        this.returnObj = rs.data
        this.$emit('success')
        singlePrint('ZY_CPOE_XIN_SHENG_ER_WAN_DAI', {
          patientId: this.returnObj.patientId,
          visitType: 2,
          hospitalizedNumber: this.returnObj.hospitalizedNumber
        })
        this.close()
      })
    },
    afterSave () {

    },
    close () {
      this.$refs.form.$refs.form.resetFields()
      this.flag = false
    },
    async open (obj) {
      this.flag = true
      this.outofinfo = obj
      console.log(obj)
    },
    save () {
      this.$refs.form.$refs.form.validate((valid) => {
        if (valid) {
          this.obj.birthday = this.$moment(this.obj.birthday1).format('YYYY-MM-DD HH:mm:ss')
          if (this.obj.neonateMidwifeObj && this.obj.neonateMidwifeObj.id && this.obj.neonateMidwifeObj.name) {
            this.obj.neonateMidwifeId = this.obj.neonateMidwifeObj.id
            this.obj.neonateMidwifeName = this.obj.neonateMidwifeObj.name
          }
          this.obj.hospitalizedNumberParents = this.outofinfo.hospitalizedNumber
          this.createNewborn(this.obj)
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.title {
  color: #000;
  margin-bottom: 16px;
  span {
    background: #1c7bef;
    width: 3px;
    height: 14px;
    float: left;
    margin-right: 10px;
  }
}
.fixed_info {
  margin-bottom: 18px;
  span {
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>

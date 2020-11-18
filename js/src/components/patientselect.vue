<!--
  患者选择组件
  demo:<ever-patient-select v-model="patientObj.name" @select="setPatientObj" :allowCreate="true" :showAttrType="true"></ever-patient-select>
  传参数：
    'value'：
    'placeholder'：  输入框默认值
    'useText'： 选中之后得到id还是name
    'queryObj'：  ？？ 扫患者id 返显到 输入框内
    'allowCreate'： 是否可以当前建档并预约
    'showAttrType': 是否显示患者的属性（标签和保险信息）
    'size': 输入框大小，默认medium
-->
<template>
  <span>
    <div class="patientWar" v-if="allowCreate">
      <div class="patientObj">
        <el-autocomplete
          v-model.trim="inputselect1"
          ref="input"
          popper-class="ever-patient-select"
          style="width: 100%"
          :disabled="disabled"
          :fetch-suggestions="fetchSuggest"
          :placeholder="placeholder || '姓名／手机号／身份证／患者档案号'"
          :trigger-on-focus="false"
          :size="size || 'small'"
          @select="handleSelect"
          @clear="handleClear"
        >
          <template slot-scope="scope">
            <p :class="{patientErr : !(scope.item.patientNumber)}">
              <span
                class="option-field"
                v-if="scope.item.patientNumber"
              >{{ scope.item.patientNumber != 'temporary' ? scope.item.patientNumber : '--'}}</span>
              <span class="option-field">
                {{ scope.item.name }}（
                <sys-value type="GBT.2261.1" :code="scope.item.sex"></sys-value>
                ）{{ scope.item.birthday | formatDateByExp('YYYY-MM-DD') }}
              </span>
              <span class="option-field" v-if="scope.item.idNo">{{ scope.item.idNo }}</span>
              <span class="option-field">
                <template v-if="scope.item.mobile">{{ scope.item.mobile }}</template>
                <template v-else-if="scope.item.telephone">{{ scope.item.telephone }}</template>
                <template
                  v-else-if="scope.item.contactList && scope.item.contactList.length > 0"
                >{{ scope.item.contactList[0].mobile }}</template>
              </span>
            </p>
          </template>
          <template slot="suffix">
            <span class="cRed pr5" v-if="recordNo && !hideNo">{{recordNoShort}}</span>
            <clinic-card-read v-if="clinicCardFlag === '1'" @getData="getCliniccardData"></clinic-card-read>
            <!--医保信息展示 -->
            <iccard-read
              v-if="icCardFlag === '1'"
              :get-membercard-flag="getMembercardFlag"
              :insuranceOrgId="insuranceOrgId"
              :scence="scence"
              @memberdata="passMemberdata"
              @medicalInfo="passMedicalInfo"
              @select="passSelect"
            ></iccard-read>
            <idcard-read v-if="idCardFlag === '1'" @getData="getIdcardData"></idcard-read>
            <span class="clearWar">
              <i
                class="el-icon-circle-close f18 mr5"
                style="margin-top:6px; cursor:pointer"
                @click="handleClear"
              ></i>
            </span>
          </template>
        </el-autocomplete>
      </div>
      <div class="patientlabel" v-if="showAttrType">
        <span v-if="labelFlag" class="s1" :style="{color: color}">•</span>
        <a
          v-if="busiInsur"
          :href="$ever.crmIndex + '/crm/memberinfo/userinfo/userinsuranceinfo/' + patientId"
          target="_blank"
        >
          <i
            v-if="busiInsur.busiInsurFlag"
            :class="[busiInsur.busiInsurExpire === true ? 'cRed' : 'cGreen', 'icon iconfont icon-menzhen-yibao1']"
          ></i>
          <i
            v-if="busiInsur.busiSupplInsurFlag"
            :class="[busiInsur.busiSupplInsurExpire === true ? 'cRed' : 'cGreen', 'icon iconfont icon-menzhen-shangyebucho']"
          ></i>
        </a>
      </div>
    </div>
    <!-- 选择患者（针对光熙，不能新增患者，只能用查出来的患者预约） -->
    <el-select
      v-else
      v-model="select"
      filterable
      clearable
      remote
      :default-first-option="true"
      :disabled="disabled"
      :placeholder="placeholder || '姓名／手机号／身份证／患者档案号'"
      :remote-method="remoteMethod"
      @change="change"
      @clear="clear"
      :min-width="'200px'"
      :size="size || 'small'"
      :style="{width: width ? width:'100%'}"
    >
      <el-option
        v-for="item in patients"
        :key="item.id"
        :label="item.name"
        :value="useText ? item.name : item.id"
      >
        <span class="option-field">{{ item.name }}</span>
        <span class="option-field">
          <sys-value type="GBT.2261.1" :code="item.sex"></sys-value>
        </span>
        <span class="option-field">{{ item.ageShowText }}</span>
        <span class="option-field">{{ item.mobile }}</span>
      </el-option>
    </el-select>
    <patient-greydenies-dialog :visible.sync="dialogVisible" :grey-denies="greyDenies"></patient-greydenies-dialog>
  </span>
</template>
<script>
import { passport } from '@/card/store/passportapi'
import { debounce1 } from '@/util/common'
import userbaseapi from '@/workspace/store/userbaseapi'
// import medicalInfo from '@/rcm/otmdiscomponent/dialog-medicalinfo.vue'
import memberApi from '@/crm/store/memberapi'
import IdcardRead from '@/components/readdevice/idcard/idcard'
import IccardRead from '@/components/readdevice/iccard/iccard'
import ClinicCardRead from '@/components/readdevice/cliniccard/cliniccard.vue'
import PatientGreydeniesDialog from './patient.greydenies.dialog.vue'

function convertToRead (patient) {
  patient.agebirthday = {
    age: patient.age,
    birthday: patient.birthday,
    isMonth: patient.isMonth,
    isDay: patient.isDay,
  }
  return patient
}

export default {
  // insuranceOrgId医保机构ID
  props: ['value', 'placeholder', 'useText', 'queryObj', 'allowCreate', 'width', 'showAttrType', 'disabled', 'patientName', 'storedMoney', 'showTips', 'size', 'stafftips', 'dialogshow', 'hideNo', 'selectIfOnePatient', 'searchParam', 'insuranceOrgId', 'getMembercardFlag', 'notips', 'scence', 'greyDeniesDialogShow'],
  data () {
    return {
      patients: [],
      inputselect: '',
      medicareObj: {},
      // yibaomesFlag: false,
      color: '#000',
      labelFlag: false,
      insurFlag: false,
      dialogVisible: false,
      patientId: '',
      recordNo: '',
      busiInsur: {},
      greyDenies: [],
      clinicCardFlag: this.$ever.getClinicConfig().showClinicCardFlag, // 是否显示就诊卡标记
      icCardFlag: this.$ever.getClinicConfig().showIcCardFlag, // 是否显示医保卡读取图标
      idCardFlag: this.$ever.getClinicConfig().showIdCardFlag, // 是否显示身份证读取图标
    }
  },
  methods: {
    clear () {
      this.$emit('clear', '')
    },
    // 清空的时候这样操作一下数据（可能还需要清空其他数据需要大家补充）
    handleClear () {
      this.recordNo = ''
      this.inputselect1 = ''
      this.$emit('select', {})
    },
    fetchSuggest (query, cb) {
      query = query && String(query).trim()
      if (query) {
        this.remoteMethod(query).then(result => {
          if (!result || !result.length) {
            this.$emit('newuser')
            this.patientId = ''
            this.recordNo = ''
          }
          let arr = result.map(v => {
            let sex = v.sex === '1' ? '男' : '女'
            let patient = Object.assign({}, v)
            patient = convertToRead(patient)
            patient.value = v.name
            patient.displaySex = sex
            // patient.patientName = v.patientName
            return patient
          })
          cb && cb(arr)
        })
      } else {
        cb([])
      }
    },
    handleSelect (item) {
      // 需要在名字后面显示图标的逻辑 （mdd 葛东要加这个）
      if (this.showAttrType) {
        if (item.member && item.member.objLabelList && item.member.objLabelList.length > 0) {
          this.labelFlag = true
          this.color = item.member.objLabelList[0].color
        } else {
          this.labelFlag = false
        }
        this.busiInsur = item.busiInsur
      }
      this.recordNo = item.patientNumber && item.patientNumber !== 'temporary' ? item.patientNumber : ''
      this.patientId = item.id
      // 点击suggest列表里的患者 把值抛到父组件，然后父组件又把值传进来
      if (item.greyDenies && item.greyDenies.length > 0) {
        this.dialogVisible = true
        this.greyDenies = item.greyDenies
      }
      // rcm 接口返回数据前端自己过滤
      this.stafftips && userbaseapi.getBenefit({ 'patientId': item.id }).then(rs => {
        if (rs.head.errCode === 0) {
          let isStaff = rs.data && rs.data.some(eitem => {
            return eitem.benefit.name === '员工卡'
          })
          if (isStaff) { this.$messageTips(this, 'success', '患者是我院员工') }
        }
      })
      // 某些业务里面需要患者身份卡，这块关联查一下
      if (this.getMembercardFlag) {
        memberApi.getBaseInfoById1({
          patientId: item.id
        }).then(rs => {
          if (rs.head.errCode === 0) {
            this.$emit('memberdata', rs.data)
          }
        })
      }
      this.$emit('select', item)
      // 有点二的逻辑，名字超过9个字要点点点
      if (this.notips) {
        this.inputselect1 = item.name
      } else {
        let _showName = item.name
        if (item.name.length > 9) {
          _showName = item.name.substring(0, 9) + '...'
        }
        this.inputselect1 = _showName
      }
    },
    remoteMethod (query) {
      if (!query) {
        return
      }
      query = query && String(query).trim() || this.patientName
      let params = {
        keyword: query,
        offset: 0,
        pagesize: 10
      }
      Object.assign(params, this.searchParam)
      return passport.get('patient/searchFuzzy', {
        params
      }).then(results => {
        this.patients = results.data.resultList
        if (this.selectIfOnePatient && results.data.resultList.length === 1) {
          let obj = {}
          obj = Object.assign({}, obj, results.data.resultList[0])
          obj.patientId = results.data.resultList[0].id
          this.inputselect1 = results.data.resultList[0].name
          this.select = results.data.resultList[0]
          this.$emit('select', obj)
        }
        return this.patients
      })
    },
    change (val) {
      // 测试伟东
      if (!val) this.patients = []
      if (this.queryObj) {
        if (val) {
          this.queryObj.patientIds = val
        } else {
          this.queryObj.patientIds = ''
        }
      }
      this.$emit('change', val)
    },
    // 医保卡 监听方法 中转一下透传到父组件
    passMemberdata (val) {
      this.$emit('memberdata', val)
    },
    // 医保卡 监听方法 中转一下透传到父组件
    passMedicalInfo (val) {
      this.$emit('medicalInfo', val) // 医保信息
    },
    // 医保卡 监听方法 中转一下透传到父组件
    passSelect (val) {
      this.$emit('select', val) // 医保信息
    },
    // 医保读卡之后，去系统查询该患者，然后将患者的数据渲染到页面上
    // addIcInfo (obj) {
    //   // 用医保读卡返回的身份证号和姓名去查询患者信息
    //   let params = { idNo: obj.idno, keyword: obj.personname }
    //   // let params = { idNo: '210302199311240003', keyword: '柳一' }
    //   userbaseapi.searchFuzzy(params).then(res => {
    //     if (res.data.totalCount > 0) {
    //       let result = res.data.resultList[0]
    //       this.inputselect1 = result.name
    //       result.agebirthday = {
    //         birthday: result.birthday,
    //         age: result.age,
    //         isMonth: result.isMonth,
    //         isDay: result.isDay
    //       }
    //       if (this.getMembercardFlag) {
    //         memberApi.getBaseInfoById1({
    //           patientId: result.id
    //         }).then(rs => {
    //           if (rs.head.errCode === 0) {
    //             this.$emit('memberdata', rs.data)
    //             this.$emit('medicalInfo', obj) // 医保信息
    //           }
    //         })
    //       } else {
    //         this.$emit('select', result)
    //         this.$emit('medicalInfo', obj) // 医保信息
    //       }
    //     } else {
    //       this.$messageTips(this, 'error', '没有查到与该医保卡对应的患者信息，请先到客户中心建档')
    //     }
    //   }, err => {
    //     console.log('err', err)
    //   })
    // },
    // 查询就诊卡信息 todo 细化产品
    getCliniccardData (rs) {
      console.log(rs, 'rssssss')
    },
    // 读取到了身份证信息，然后去查询患者和卡券 441代码优化
    getIdcardData (rs) {
      if (!rs.idCode) {
        return
      }
      let obj = {}
      obj.patientName = rs.name
      obj.iden = {
        idNo: rs.idCode
      }
      obj.sex = rs.sex === '男' ? '1' : '2'
      obj.birthday = rs.birthday
      obj.agebirthday = {
        birthday: obj.birthday
      }
      // obj.nation = getNationId(rs.nation + '族')
      obj.addressDetail = rs.address
      obj.householdAddress = JSON.stringify({
        householdAddressDetail: rs.address
      })
      passport.get('patient/searchFuzzy', {
        params: {
          idNo: obj.iden.idNo
        }
      }).then(result => {
        if (result.data.resultList.length && result.data.resultList.length === 1) {
          obj = Object.assign({}, obj, result.data.resultList[0])
          obj.patientId = result.data.resultList[0].id
          obj.agebirthday.age = result.data.resultList[0].age
          this.inputselect1 = result.data.resultList[0].name
          this.select = result.data.resultList[0].name
        } else {
          this.$refs.input.$el.querySelectorAll('input')[0].focus()
        }
        if (this.getMembercardFlag) {
          memberApi.getBaseInfoById1({
            patientId: obj.patientId
          }).then(rs => {
            if (rs.head.errCode === 0) {
              this.$emit('memberdata', rs.data)
            }
          })
        } else {
          this.$emit('select', obj)
        }
      })
    },
    // readICCard () {
    //   if (!this.insuranceOrgId) {
    //     this.$messageTips(this, 'error', '请先选择医保机构再进行医保读卡操作')
    //     return false
    //   }
    //   this.yibaomesFlag = true
    // },
  },
  computed: {
    inputselect1: {
      set (newVal) {
        if (newVal === '') {
          this.recordNo = ''
        }
        this.$emit('input', newVal)
      },
      get () {
        return this.value
      }
    },
    select: {
      set (newVal) {
        this.$emit('input', newVal)
        this.$emit('select', this.patients.filter(v => v.id === newVal)[0])
      },
      get () {
        return this.value
      }
    },
    recordNoShort () {
      return this.recordNo.length > 16 ? this.recordNo.substring(0, 16) + '...' : this.recordNo
    }
  },
  created () {
  },
  mounted () {
    // 给了默认值要展示出来
    this.remoteMethod(this.value)
  },
  watch: {
    'inputselect1' (val) {
      if (val === '') {
        this.recordNo = ''
      }
    },
    'queryObj': {
      handler: debounce1(function (val) {
        if (val && val.patientIds) {
          return passport.get('/patient/getById', {
            params: {
              id: val.patientIds
            }
          }).then(results => {
            if (results && results.data) {
              this.patients = [].concat(results.data)
              this.$emit('input', val.patientIds)
            } else {
              this.patients = []
              this.$emit('input', '')
            }
          })
        } else {
          this.patients = []
          this.$emit('input', '')
        }
      }, 500),
      deep: true
    }
  },
  components: {
    // medicalInfo,
    IdcardRead,
    IccardRead,
    ClinicCardRead,
    PatientGreydeniesDialog
  }
}
</script>
<style scoped>
.patientWar {
  display: -webkit-box;
}
.patientWar .patientObj {
  position: relative;
  line-height: initial;
  -webkit-box-flex: 1;
}
.patientWar .patientlabel {
  line-height: 32px;
}
.patientWar .patientlabel .icon {
  margin-right: 10px;
}
p {
  margin: 0;
}
.patientErr {
  color: #e43;
}
.option-field {
  display: inline-block;
  margin-right: 10px;
}
.s1 {
  vertical-align: top;
  display: inline-block;
  font-size: 40px;
  padding: 0 5px;
}
::-webkit-scrollbar {
  width: 8px;
  height: 10px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.021);
  border-radius: 10px;
  background-color: #fff;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.055);
  background-color: rgba(85, 85, 85, 0.178);
}
.clearWar{display: inline-block;height: 100%; vertical-align: top}
</style>

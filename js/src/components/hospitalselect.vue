<template>
  <span>
    <div class="patientWar" v-if="allowCreate">
      <div class="patientObj">
        <el-autocomplete
          v-model.trim="inputselect1"
          :disabled="disabled"
          :fetch-suggestions="fetchSuggest"
          :placeholder="placeholder || '请输入患者姓名'"
          style="width: 100%"
          @select="handleSelect"
          popper-class
          ref="input"
        >
          <template slot-scope="scope">
            <p :class="{patientErr : !inpatientNumber}">
              <span
                class="option-field"
              >{{JSON.stringify(scope.item)}}{{ scope.item&&scope.item.patientName }}/{{ scope.item&&scope.item.inpatientNumber }}</span>
            </p>
          </template>
          <i
            class="el-input__icon icon iconfont icon-menzhen-yibaoka iconSpan"
            slot="suffix"
            v-if="shebaoOrgFlag"
            @click="readIDCard()"
          ></i>
          <i
            class="el-input__icon icon iconfont icon-menzhen-shenfenzheng iconSpan"
            slot="suffix"
            @click="readIDCard()"
          ></i>
        </el-autocomplete>
        <!--医保信息展示 -->
        <div v-show="yibaomesFlag" class="showIcInfo">
          <medicarecard-detail
            :medicare-data="medicareObj"
            @confirmFun="addIcInfo()"
            :show-confirm="true"
          ></medicarecard-detail>
        </div>
        <div class="recordNo" v-if="recordNo && select">档案号：{{recordNo}}</div>
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
      :placeholder="placeholder || '请输入关键词'"
      :remote-method="remoteMethod"
      @change="change"
      style="width: 100%"
      value-key="id"
      @clear="clear"
    >
      <template v-if="patients.length">
        <el-option
          v-for="item in patients"
          :key="item.id"
          :label="`${item.patientName || ''}/${(item.inpatientNumber) || ''}`"
          :value="item"
        ></el-option>
      </template>
    </el-select>
  </span>
</template>
<script>
import { passport } from '@/card/store/passportapi'
import userbaseapi from '@/workspace/store/userbaseapi'
import medicarecardDetail from '@/components/medicarecard.detail'
import { getPatientList } from '@/rcm/store/hospital/hospital'

export default {
  props: ['value', 'placeholder', 'useText', 'queryObj', 'allowCreate', 'width', 'showAttrType', 'disabled', 'hosType'],
  data () {
    return {
      patients: [],
      inputselect: '',
      medicareObj: {},
      yibaomesFlag: false,
      shebaoOrgFlag: false,
      color: '#000',
      labelFlag: false,
      insurFlag: false,
      patientId: '',
      recordNo: '',
      busiInsur: {},
      statusMap: {
        '1': ['3', '4', '6', '7', '8'],
        '2': ['9']
      }
    }
  },
  methods: {
    fetchSuggest (query, cb) {
      query = query && String(query).trim()
      this.remoteMethod(query).then(result => {
        if (!result || !result.length) {
          this.$emit('newuser')
        }
        let arr = result.map(v => {
          v.value = v.patientName
          return v
        })
        cb(arr)
      })
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
      this.recordNo = (item.patientOrg && item.patientOrg.outpatientNumber) ? item.patientOrg.outpatientNumber : ''
      // 点击suggest列表里的患者 把值抛到父组件，然后父组件又把值传进来，有点绕啊 todo (也可能只能这样，没时间研究)
      this.$emit('select', item)
    },
    remoteMethod (query) {
      query = query && String(query).trim()
      let params = {
        patientMsg: query,
        // 住院与出院一起使用,出院费用查询，不传即是查询所有状态
        statusList: this.statusMap[this.hosType]
      }
      return getPatientList(params).then(results => {
        this.patients = results.data && results.data.resultList
        return this.patients
      })
    },
    change (val) {
      // 测试伟东
      if (!val) this.patients = []
      this.$emit('change', val)
    },
    addIcInfo () {
      let obj = {}
      this.yibaomesFlag = false
      obj.patientName = this.medicareObj.personname
      obj.iden = {
        idNo: this.medicareObj.idno
      }
      obj.sex = this.medicareObj.sex
      obj.persontype = this.medicareObj.persontype
      obj.birthday = this.medicareObj.birthday
      obj.agebirthday = {
        birthday: obj.birthday
      }
      obj.medPersonInfo = this.medicareObj
      obj.isMedicalInsurance = this.medicareObj && this.medicareObj.useable === 'true' ? 1 : 0
      passport.get('patient/searchFuzzy', {
        params: {
          type: '2',
          idNo: obj.iden.idNo
        }
      }).then(result => {
        if (result.head.errCode === 0 && result.data.resultList.length) {
          obj = Object.assign({}, obj, result.data.resultList[0])
          obj.patientId = result.data.resultList[0].id
          obj.agebirthday.age = result.data.resultList[0].age
        } else {
          let objP = {}
          objP.name = obj.patientName
          objP.sex = obj.sex
          objP.birthday = obj.agebirthday.birthday
          objP.socialIdNo = obj.iden.idNo
          objP.socialSecurityNo = obj.medPersonInfo.cardno
          objP.medicalNo = obj.medPersonInfo.icno
          passport.post('/patient/createOrModify', objP).then(result => {
          })
          obj = Object.assign({}, obj, result.data.resultList[0])
          this.$messageTips(this, 'warning', result.head.errMsg, '提示')
          this.$refs.input.$el.querySelectorAll('input')[0].focus()
        }
        // 添加macid字段。
        obj.macId = this.medicareObj.macId
        this.$emit('select', obj)
      })
    },
    readICCard () {
      userbaseapi.autoReadIcCardInfo().then(res => {
        if (!res || (res.head && res.head.errCode === 9999)) {
          this.$notify({
            title: '警告',
            message: '请连接医保卡读卡器设备并启动读卡识别程序',
            type: 'warning'
          })
          return Promise.reject()
        }
        if (res.head && res.head.errCode !== 0) {
          this.$notify({
            title: res.head.errMsg,
            message: '请将医保卡重新放置到读卡器识别',
            type: 'warning'
          })
          return Promise.reject()
        }
        return res.data
      }).then(result => {
        this.medicareObj = result
        this.yibaomesFlag = true
      })
    },
    // 点击清空时将filter结果重置
    clear () {
      this.remoteMethod()
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
        if (result.data.resultList.length) {
          obj = Object.assign({}, obj, result.data.resultList[0])
          obj.patientId = result.data.resultList[0].id
          obj.agebirthday.age = result.data.resultList[0].age
        } else {
          this.$refs.input.$el.querySelectorAll('input')[0].focus()
        }
        this.$emit('select', obj)
      })
    }
  },
  computed: {
    inputselect1: {
      set (newVal) {
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
    }
  },
  created () {
    let clinicId = this.$store.state.currentUser.organizationId
    userbaseapi.getInsuranceOrg(clinicId).then(res => {
      if (res.head.errCode === 0 && res.data) {
        this.shebaoOrgFlag = true
      }
    })
    this.remoteMethod()
  },
  components: {
    medicarecardDetail
  }
}
</script>
<style scoped>
.patientWar {
  display: -webkit-box;
}
.patientWar .patientObj {
  position: relative;
  -webkit-box-flex: 1;
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
.showIcInfo {
  position: absolute;
  padding: 10px;
  background-color: #fff;
  z-index: 9999;
  border: 1px solid #dcdfe6;
  width: 500px;
}
.s1 {
  vertical-align: top;
  height: 40px;
  line-height: 40px;
  display: inline-block;
  font-size: 40px;
  padding: 0 5px;
}
.recordNo {
  height: 20px;
  line-height: 20px;
  color: #e43;
  font-size: 12px;
  position: absolute;
}
.iconSpan {
  color: #666;
}
.iconSpan:hover {
  color: #1c7bef;
}
</style>

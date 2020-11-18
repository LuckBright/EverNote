<template>
  <div class="container">
    <el-form :inline="true" :model="form" size="mini">
      <el-form-item label="姓名"  :prop="NAME">
        <div class="name">
          <m-input :value="value" :prop="NAME" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="性别" :prop="SEX">
        <m-select :value="value" prop="SEX" @change="changeValue"></m-select>
      </el-form-item>
      <el-form-item label="出生日期" :prop="BIRTHDAY">
        <m-date
          :value="value"
          type="date"
          :prop="BIRTHDAY"
          format="yyyy-MM-dd"
          @change="changeValue"
        ></m-date>
      </el-form-item>
      <el-form-item label="年龄" :prop="AGE">
        <div class="age">
          <m-input :value="value" :prop="AGE" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="国籍" :prop="NATION">
        <m-sys code="GBT.2659" :prop="NATION" :value="value" @change="changeValue"></m-sys>
      </el-form-item>
      <el-form-item class="mr60" label="" :prop="SHI_ZU_NIAN_LING">
        <span>(年龄不足一周岁的)</span>
        <label class="bold">年龄</label>
        <div class="age inline">
          <m-input :value="value" :prop="SHI_ZU_NIAN_LING" @change="changeValue"></m-input>
        </div>月
      </el-form-item>
      <el-form-item label="新生儿出生体重" class="mr60" :prop="CHU_SHENG_TI_ZHONG">
        <div class="age inline">
          <m-input :value="value" :prop="CHU_SHENG_TI_ZHONG" @change="changeValue"></m-input>
        </div>克
      </el-form-item>
      <el-form-item label="新生儿入院体重" :prop="RU_YUAN_TI_ZHONG">
        <div class="age inline">
          <m-input :value="value" :prop="RU_YUAN_TI_ZHONG" @change="changeValue"></m-input>
        </div>克
      </el-form-item>
      <el-form-item label="出生地" :prop="CHU_SHENG_SHENG">
        <div class="wid85 inline">
          <el-address :prop="CHU_SHENG_SHENG" :level="3" :value="value" @change="changeBirthplace"></el-address>
        </div>省(区、市)
        <div class="birth_add inline">
          <m-input readonly :value="value" :prop="CHU_SHENG_SHI"></m-input>
        </div>市
        <div class="birth_add inline">
          <m-input readonly :value="value" :prop="CHU_SHENG_XIAN"></m-input>
        </div>县
      </el-form-item>
      <el-form-item label="籍贯" :prop="JI_GUAN_SHENG">
        <div class="wid85 inline">
          <el-address :prop="JI_GUAN_SHENG" :level="2" :value="value" @change="changeJiguan"></el-address>
        </div>省(区、市)
        <div class="birth_add inline">
          <m-input readonly :value="value" :prop="JI_GUAN_SHI"></m-input>
        </div>市
      </el-form-item>
      <el-form-item label="民族" :prop="JB_MIN_ZU">
        <div class="wid85 inline" style="widht:85px">
          <m-sys code="GBT.3304" :prop="JB_MIN_ZU" :value="value" @change="changeValue"></m-sys>
        </div>
      </el-form-item>
      <el-form-item label="身份证号" :prop="ID_NO">
        <div class="id_no inline">
          <m-input @change="changeValue" :value="value" :prop="ID_NO"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="职业" :prop="CAREER">
        <div class="zhiye inline">
          <m-sys code="GBT.2261.4" :prop="CAREER" :value="value" @change="changeValue"></m-sys>
        </div>
      </el-form-item>
      <el-form-item label="婚姻" :prop="MARRIAGE">
        <m-select :value="value" @change="changeValue" prop="MARRIAGE"></m-select>
      </el-form-item>
      <el-form-item label="现住址" :prop="XIAN_ZHU_ZHI_SHENG">
        <div class="wid370 inline">
          <el-address
            :prop="XIAN_ZHU_ZHI_SHENG"
            :showdetail="true"
            :level="3"
            :value="value"
            @change="changeValue"
          ></el-address>
        </div>
      </el-form-item>
      <el-form-item label="电话" :prop="XIAN_ZHU_ZHI_TELE">
        <div class="wid120 inline">
          <m-input :value="value" :prop="XIAN_ZHU_ZHI_TELE" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="邮编" :prop="XIAN_ZHU_ZHI_POST_CODE">
        <div class="wid100 inline">
          <m-input :value="value" :prop="XIAN_ZHU_ZHI_POST_CODE" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="户口地址" class="mr80" :prop="HU_KOU_SHENG">
        <div class="wid450 inline">
          <el-address
            :prop="HU_KOU_SHENG"
            :showdetail="true"
            :level="3"
            :value="value"
            @change="changeValue"
          ></el-address>
        </div>
      </el-form-item>
      <el-form-item label="邮编" :prop="HU_KOU_POST_CODE">
        <div class="wid100 inline">
          <m-input :value="value" :prop="HU_KOU_POST_CODE" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="工作单位及地址" :prop="GONG_ZUO_SHENG">
        <div class="wid280 inline">
          <el-address
            :prop="GONG_ZUO_SHENG"
            :showdetail="true"
            :level="3"
            :value="value"
            @change="changeValue"
          ></el-address>
        </div>
      </el-form-item>
      <el-form-item label="单位电话" :prop="GONG_ZUO_TELE">
        <div class="wid120 inline">
          <m-input :value="value" :prop="GONG_ZUO_TELE" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="邮编" :prop="GONG_ZUO_POST_CODE">
        <div class="wid100 inline">
          <m-input :value="value" :prop="GONG_ZUO_POST_CODE" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="联系人姓名" :prop="CONTACT_NAME">
        <div class="wid100 inline">
          <m-input :value="value" :prop="CONTACT_NAME" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="关系" :prop="GUAN_XI">
        <div class="wid100 inline">
          <m-sys code="GBT.4761" :prop="GUAN_XI" :value="value" @change="changeValue"></m-sys>
        </div>
      </el-form-item>
      <el-form-item label="地址" :prop="CONTACT_SHENG">
        <div class="wid240 inline">
          <el-address
            :prop="CONTACT_SHENG"
            :showdetail="true"
            :level="3"
            :value="value"
            @change="changeValue"
          ></el-address>
        </div>
      </el-form-item>
      <el-form-item label="电话" :prop="CONTACT_TELE">
        <div class="wid120 inline">
          <m-input :value="value" :prop="CONTACT_TELE" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="入院途径" class="block mr12" :prop="RU_YUAN_TU_JING">
        <m-select :value="value" @change="changeValue" prop="RU_YUAN_TU_JING"></m-select>
      </el-form-item>
      <el-form-item label="入院时间" :prop="RU_YUAN_TIME">
        <div class="wid180">
          <m-date
            :value="value"
            type="datetime"
            :prop="RU_YUAN_TIME"
            format="yyyy-MM-dd HH:mm"
            @change="changeValue"
          ></m-date>
        </div>
      </el-form-item>
      <el-form-item label="入院科室" :prop="RU_YUAN_KE_SHI">
        <div class="wid120">
          <m-input :value="value" @change="changeValue" :prop="RU_YUAN_KE_SHI"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="病房" :prop="RU_YUAN_ROOM">
        <div class="wid120">
          <m-input :value="value" :prop="RU_YUAN_ROOM" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="转科科别" :prop="ZHUAN_KE_KE_BIE">
        <div class="wid120">
          <m-input :value="value" :prop="ZHUAN_KE_KE_BIE" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="出院时间" :prop="CHU_YUAN_TIME">
        <div class="wid180">
          <m-date
            :value="value"
            type="datetime"
            :prop="CHU_YUAN_TIME"
            format="yyyy-MM-dd HH:mm"
            @change="changeValue"
          ></m-date>
        </div>
      </el-form-item>
      <el-form-item label="出院科室" :prop="CHU_YUAN_KE_SHI">
        <div class="wid120">
          <m-input :value="value" @change="changeValue" :prop="CHU_YUAN_KE_SHI"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="病房" :prop="CHU_YUAN_ROOM">
        <div class="wid120">
          <m-input :value="value" :prop="CHU_YUAN_ROOM" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="实际住院" :prop="ZHU_YUAN_DAYS">
        <div class="wid120 inline">
          <m-input readonly :value="value" :prop="ZHU_YUAN_DAYS"></m-input>
        </div>天
      </el-form-item>
      <el-form-item label="门(急)诊诊断" :prop="JI_ZHEN_NAME">
        <div class="wid450 inline">
          <el-diagnosis :value="value" :prop="JI_ZHEN_NAME" @change="changeJizhen"></el-diagnosis>
        </div>
      </el-form-item>
      <el-form-item label="疾病编码" :prop="JI_ZHEN_CODE">
        <div class="wid120 inline">
          <m-input readonly :value="value" :prop="JI_ZHEN_CODE"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="" class="hei100" prop="otherDiagnoses">
        <div>
          <chu-yuan :value="value" @change="changeValue"></chu-yuan>
        </div>
      </el-form-item>
      <el-form-item label="损伤、中毒的外部原因" :prop="ZHONG_DU">
        <div class="wid450 inline">
          <el-diagnosis :value="value" :prop="ZHONG_DU" @change="changeZhongdu"></el-diagnosis>
        </div>
      </el-form-item>
      <el-form-item label="疾病编码" :prop="ZHONG_DU_CODE">
        <div class="wid120 inline">
          <m-input readonly :value="value" :prop="ZHONG_DU_CODE"></m-input>
        </div>
      </el-form-item>
      <hr-div></hr-div>
      <el-form-item label="病理诊断" :prop="BING_LI_NAME">
        <div class="wid450 inline">
          <el-diagnosis :value="value" :prop="BING_LI_NAME" @change="changeBingli"></el-diagnosis>
        </div>
      </el-form-item>
      <el-form-item label="疾病编码" :prop="BING_LI_CODE">
        <div class="wid120 inline">
          <m-input readonly :value="value" :prop="BING_LI_CODE"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="" prop="JB_BING_LI_HAO">
        <div class="wid520 inline">
          <el-input readonly clearable v-model="form.age" placeholder="—"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="病理号" :prop="JB_BING_LI_HAO">
        <div class="wid120 inline">
          <m-input :value="value" :prop="JB_BING_LI_HAO" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <hr-div></hr-div>
      <el-form-item label="药物过敏" :prop="YAO_WU_GUO_MIN">
        <m-select :value="value" @change="changeValue" prop="YAO_WU_GUO_MIN"></m-select>
      </el-form-item>
      <el-form-item label="过敏药物" :prop="GUO_MIN_YAO_WU">
        <div class="wid280 inline">
          <m-input :value="value" :prop="GUO_MIN_YAO_WU" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="死亡患者验尸" prop="SHI_JIAN">
        <m-select :value="value" @change="changeValue" prop="SHI_JIAN"></m-select>
      </el-form-item>
      <hr-div></hr-div>
      <el-form-item label="血型" class="mr60" prop="XUE_XING">
        <m-select :value="value" @change="changeValue" prop="XUE_XING"></m-select>
      </el-form-item>
      <el-form-item label="Rh" prop="RH">
        <m-select :value="value" @change="changeValue" prop="RH"></m-select>
      </el-form-item>
      <hr-div></hr-div>
      <el-form-item label="科主任" :prop="KE_ZHU_REN">
        <div class="s4 inline">
          <m-input :value="value" :prop="KE_ZHU_REN" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="主任（副主任）医师" :prop="FU_ZHU_REN">
        <div class="s4 inline">
          <m-input :value="value" :prop="FU_ZHU_REN" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="主治医师" :prop="ZHU_ZHI_YI_SHI">
        <div class="s4 inline">
          <m-input :value="value" :prop="ZHU_ZHI_YI_SHI" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="住院医师" :prop="ZHU_YUAN_YI_SHI">
        <div class="s4 inline">
          <m-input :value="value" :prop="ZHU_YUAN_YI_SHI" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="责任护士" :prop="ZE_REN_HU_SHI">
        <div class="s4 inline">
          <m-input :value="value" :prop="ZE_REN_HU_SHI" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="进修医师" :prop="JIN_XIU_YI_SHI">
        <div class="s4 inline">
          <m-input :value="value" :prop="JIN_XIU_YI_SHI" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="实习医师" :prop="SHI_XI_YI_SHI">
        <div class="s4 inline">
          <m-input :value="value" :prop="SHI_XI_YI_SHI" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="编码员" :prop="BIAN_MA_YUAN">
        <div class="s4 inline">
          <m-input :value="value" :prop="BIAN_MA_YUAN" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <hr-div></hr-div>
      <el-form-item label="病案质量" :prop="BING_AN_ZHI_LIANG">
        <m-select :value="value" @change="changeValue" prop="BING_AN_ZHI_LIANG"></m-select>
      </el-form-item>
      <el-form-item label="质控医师" :prop="ZHI_KONG_YI_SHI">
        <div class="s4 inline">
          <m-input :value="value" :prop="ZHI_KONG_YI_SHI" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="质控护士" :prop="ZHI_KONG_HU_SHI">
        <div class="s4 inline">
          <m-input :value="value" :prop="ZHI_KONG_HU_SHI" @change="changeValue"></m-input>
        </div>
      </el-form-item>
      <el-form-item label="质控日期" :prop="ZHI_KONG_DATE">
        <div class="s4 inline">
          <m-date
            :value="value"
            type="date"
            :prop="ZHI_KONG_DATE"
            format="yyyy-MM-dd"
            @change="changeValue"
          ></m-date>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { keyMap } from '@/components/medicalindex/keymap'
import chuYuan from '@/components/medicalindex/hospitaltable'
import hrDiv from '@/components/medicalindex/hrdiv'
import moment from 'moment'
import elDiagnosis from '@/components/medicalindex/diagnosis'
import elAddress from '@/components/medicalindex/address'
import mInput from '@/components/medicalindex/minput'
import mSys from '@/components/medicalindex/msystype'
import mSelect from '@/components/medicalindex/mselect'
import mDate from '@/components/medicalindex/mdate'
import mDept from '@/components/medicalindex/mdept'

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      ...keyMap,
      form: {
        name: '',
        age: '',
        sex: '',
        birthday: '',
        nation: '',
        idNo: '',
        date: '',
        chuyuan: '',
        ruyuan: '',
        days: '',
        diseaseName: '',
        diseaseCode: '',
        address: '',
        provinceName: '',
        countyName: '',
        cityName: ''
      },
      diagnosis: [],
      dialogVisible: false
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {
    'value.HDSD00_11_085' (val) {
      // 入院时间
      this.getDays(this.value.HDSD00_11_019, val)
    },
    'value.HDSD00_11_019' (val) {
      // 出院时间
      this.getDays(val, this.value.HDSD00_11_085)
    }
  },
  methods: {
    changeValue (key, val) {
      this.$emit('change', key, val)
    },
    changeBirthplace (val) {
      if (val && typeof val === 'object' && val.provinceName) {
        this.changeValue(this.CHU_SHENG_SHENG, val.provinceName)
        this.changeValue(this.CHU_SHENG_SHI, val.cityName)
        this.changeValue(this.CHU_SHENG_XIAN, val.countyName)
      } else {
        this.changeValue(this.CHU_SHENG_SHENG, '')
        this.changeValue(this.CHU_SHENG_SHI, '')
        this.changeValue(this.CHU_SHENG_XIAN, '')
      }
    },
    changeJiguan (val) {
      if (val && typeof val === 'object' && val.provinceName) {
        this.changeValue(this.JI_GUAN_SHENG, val.provinceName)
        this.changeValue(this.JI_GUAN_SHI, val.cityName)
      } else {
        this.changeValue(this.JI_GUAN_SHENG, '')
        this.changeValue(this.JI_GUAN_SHI, '')
      }
    },
    changeJizhen (item) {
      this.changeValue(keyMap.JI_ZHEN_NAME, item.diseaseName)
      this.changeValue(keyMap.JI_ZHEN_CODE, item.diseaseCode)
    },
    changeZhongdu (item) {
      this.changeValue(keyMap.ZHONG_DU, item.diseaseName)
      this.changeValue(keyMap.ZHONG_DU_CODE, item.diseaseCode)
    },
    changeBingli (item) {
      this.changeValue(keyMap.BING_LI_NAME, item.diseaseName)
      this.changeValue(keyMap.BING_LI_CODE, item.diseaseCode)
    },
    getDays (start, end) {
      if (start && end) {
        const days = moment(start).diff(moment(end), 'days')
        if (isNaN(days)) {
          this.changeValue(keyMap.ZHU_YUAN_DAYS, '')
        } else {
          this.changeValue(keyMap.ZHU_YUAN_DAYS, days)
        }
      } else {
        this.changeValue(keyMap.ZHU_YUAN_DAYS, '')
      }
    }
  },
  components: {
    mSys,
    chuYuan,
    hrDiv,
    elDiagnosis,
    elAddress,
    mInput,
    mSelect,
    mDate,
    mDept
  }
}
</script>
<style scoped lang="scss">
.inline {
  display: inline-block;
}
.container {
  width: 100%;
  height: 100%;
  margin-top: 2px;
  margin-left: 2px;
  margin-bottom: 2px;
  /deep/ .el-form-item__label {
    font-size: 10pt;
    font-weight: bold;
  }
  .mr12 {
    /deep/ .el-form-item__label {
      margin-bottom: -12px;
    }
  }
  /deep/ .el-form--inline .el-form-item {
    margin-bottom: 0px;
    margin-right: 0px;
    height: 27px;
  }
  /deep/ .el-input__inner {
    border: none;
    border-radius: unset;
    border-bottom: 1px solid black;
    height: 20px;
    line-height: 20px;
    padding: 0px;
  }
  .noborder /deep/ .el-input__inner {
    border: none;
    border-radius: unset;
    border-bottom: 0px solid black;
    height: 20px;
    line-height: 20px;
    padding: 0px;
  }
  /deep/ .el-form--inline .el-form-item.mr60 {
    margin-bottom: 0px;
    margin-right: 60px;
  }
  /deep/ .el-form--inline .el-form-item.block {
    display: block;
  }
  /deep/ .el-form--inline .el-form-item.hei100 {
    height: 100%;
    margin-bottom: -13px;
  }
  /deep/ .diag .el-input .el-input__inner {
    padding: 0px 8px;
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 2px;
    border: 1px solid #bbb;
    box-sizing: border-box;
    color: #000;
    display: inline-block;
    font-size: inherit;
    height: 36px;
    line-height: 36px;
    outline: none;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }
  .wid280 {
    width: 280px;
  }
  .wid370 {
    width: 370px;
  }
  .wid240 {
    width: 240px;
  }
  .wid160 {
    width: 160px;
  }
  .wid120 {
    width: 120px;
  }
  .wid100 {
    width: 100px;
  }
  .wid450 {
    width: 448px;
  }
  .wid80 {
    width: 80%;
  }
  .wid85 {
    width: 85px;
  }
  .name {
    width: 100px;
  }
  .sex {
    width: 50px;
    margin-right: 2px;
  }
  .age {
    width: 45px;
  }
  .sage {
    width: 45px;
  }
  .wid520 {
    width: 520px;
  }
  .bold {
    font-weight: bold;
    margin-right: 5px;
  }
  .birth_add {
    width: 70px;
  }
  .id_no {
    width: 190px;
  }
  .zhiye {
    width: 130px;
  }
  .s4 {
    width: 31mm;
  }
}
</style>

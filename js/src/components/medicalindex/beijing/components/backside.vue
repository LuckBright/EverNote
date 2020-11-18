<template>
  <div class="container a4">
    <div class="border">
      <el-form :inline="true" :model="form" size="mini">
        <el-form-item label class="hei100" prop="surgeries">
          <shou-shu :dpt-id="dptId" :value="value" @change="change"></shou-shu>
        </el-form-item>
        <el-form-item label="离院方式" :value="value[LI_YUAN_FANG_SHI]" class="hei100 block">
          <div class="sex inline">
            <el-select
              class="border-select"
              clearable
              :value="value[LI_YUAN_FANG_SHI]"
              @change="changeFangshi"
              placeholder="—"
            >
              <el-option
                v-for="(n,key) in fangshi"
                :label="key"
                :value="key"
                :key="key"
              >{{key}} {{n}}</el-option>
            </el-select>
          </div>1.医嘱离院 2.医嘱转院,
          拟接收医疗机构名称:
          <div class="wid240 inline">
            <m-input :value="value" :prop="NI_JIE_SHOU_JI_GOU" @change="change"></m-input>
          </div>
          <br>3.医嘱转社区卫生服务机构/乡镇卫生院,拟接收医疗机构名称:
          <div class="wid240 inline">
            <m-input :value="value" :prop="WXY_NI_JIE_SHOU_JI_GOU" @change="change"></m-input>
          </div>
          <br>4.非医嘱离院 5.死亡 9.其他
        </el-form-item>
        <hr-div></hr-div>
        <el-form-item label="是否有出院31天内再住院计划" prop="ZAI_ZHU_YUAN_JI_HUA" class="block">
          <div class="inline">
            <m-select :value="value" @change="change" prop="ZAI_ZHU_YUAN_JI_HUA"></m-select>
          </div>,目的:
          <div class="wid240 inline">
            <m-input :value="value" :prop="MU_DI" @change="change"></m-input>
          </div>
        </el-form-item>
        <hr-div></hr-div>
        <el-form-item label="颅脑损伤患者昏迷时间" :prop="HUNMI_QIAN_DAY">
          入院前
          <div class="age inline">
            <m-input :value="value" :prop="HUNMI_QIAN_DAY" @change="change"></m-input>
          </div>天
          <div class="age inline">
            <m-time :value="value" :times="23" @change="change" :prop="HUNMI_QIAN_HOUR"></m-time>
          </div>小时
          <div class="age inline">
            <m-time :value="value" :times="59" @change="change" :prop="HUNMI_QIAN_MIN"></m-time>
          </div>分钟
          入院后
          <div class="age inline">
            <m-input :value="value" :prop="HUNMI_HOU_DAY" @change="change"></m-input>
          </div>天
          <div class="age inline">
            <m-time :value="value" :times="23" @change="change" :prop="HUNMI_HOU_HOUR"></m-time>
          </div>小时
          <div class="age inline">
            <m-time :value="value" :times="59" @change="change" :prop="HUNMI_HOU_MIN"></m-time>
          </div>分钟
        </el-form-item>
        <el-form-item label="住院费用(元)" :prop="ZONG_FEI_YONG">总费用
          <div class="wid240 inline">
            <m-input :value="value" :prop="ZONG_FEI_YONG" @change="change"></m-input>
          </div>(自付金额
          <div class="wid240 inline">
            <m-input :value="value" :prop="ZI_FU_JIN_E" @change="change"></m-input>
          </div>)
        </el-form-item>
        <el-form-item label="1.综合医疗服务类" class="mt10" :prop="YI_BAN_YI_LIAO_FEI">(1)一般医疗服务费
          <div class="wid120 inline">
            <m-input :value="value" :prop="YI_BAN_YI_LIAO_FEI" @change="change"></m-input>
          </div>(2)一般治疗操作费
          <div class="wid120 inline">
            <m-input :value="value" :prop="YI_BAN_YI_LIAO_CAO_ZUO_FEI" @change="change"></m-input>
          </div>(3)护理费
          <div class="wid120 inline">
            <m-input :value="value" :prop="HU_LI_FEI" @change="change"></m-input>
          </div>
          <br>(4)其他费用
          <div class="birth_add inline">
            <m-input :value="value" :prop="QI_TA_FEI_YONG" @change="change"></m-input>
          </div>
        </el-form-item>
        <el-form-item label="2.诊断类" class="mt10" :prop="BING_LI_ZHEN_DUAN_FEI">(5)病理诊断费
          <div class="wid120 inline">
            <m-input :value="value" :prop="BING_LI_ZHEN_DUAN_FEI" @change="change"></m-input>
          </div>(6)实验室诊断费
          <div class="wid120 inline">
            <m-input :value="value" :prop="SHI_YAN_SHI_ZHEN_DUAN_FEI" @change="change"></m-input>
          </div>(7)影像学诊断费
          <div class="wid120 inline">
            <m-input :value="value" :prop="YING_XIANG_XUE" @change="change"></m-input>
          </div>
          <br>(8)临床诊断项目费
          <div class="birth_add inline">
            <m-input :value="value" :prop="LIN_CHUANG" @change="change"></m-input>
          </div>
        </el-form-item>
        <el-form-item label="3.治疗类" :prop="FEI_SHOU_SHU" class="mt10">(9)非手术治疗项目费
          <div class="wid120 inline">
            <m-input :value="value" :prop="FEI_SHOU_SHU" @change="change"></m-input>
          </div>(临床物理治疗费
          <div class="wid120 inline">
            <m-input :value="value" :prop="LIN_CUANG_WU_LI" @change="change"></m-input>
          </div>)
          <br>(10)手术治疗费
          <div class="wid120 inline">
            <m-input :value="value" :prop="SHOU_SHU_ZHI_LIAO" @change="change"></m-input>
          </div>(麻醉费
          <div class="birth_add inline">
            <m-input :value="value" :prop="MA_ZUI" @change="change"></m-input>
          </div>手术费
          <div class="birth_add inline">
            <m-input :value="value" :prop="SHOU_SHU_FEI" @change="change"></m-input>
          </div>)
        </el-form-item>
        <el-form-item label="4.康复类" :prop="KANG_FU_FEI">(11)康复费
          <div class="wid450 inline">
            <m-input :value="value" :prop="KANG_FU_FEI" @change="change"></m-input>
          </div>
          <br>
        </el-form-item>
        <el-form-item label="5.中医类" :prop="ZHONG_YI_ZHI_LIAO">(12)中医治疗费
          <div class="wid450 inline">
            <m-input :value="value" :prop="ZHONG_YI_ZHI_LIAO" @change="change"></m-input>
          </div>
        </el-form-item>
        <el-form-item label="6.西药类" :prop="XI_YAO">(13)西药费
          <div class="wid120 inline">
            <m-input :value="value" :prop="XI_YAO" @change="change"></m-input>
          </div>(抗菌药物费用
          <div class="wid120 inline">
            <m-input :value="value" :prop="KANG_JUN" @change="change"></m-input>
          </div>)
        </el-form-item>
        <el-form-item label="7.中药类" :prop="ZHONG_CHENG_YAO">(14)中成药费
          <div class="wid120 inline">
            <m-input :value="value" :prop="ZHONG_CHENG_YAO" @change="change"></m-input>
          </div>(15)中草药费
          <div class="wid120 inline">
            <m-input :value="value" :prop="ZHONG_CAO_YAO" @change="change"></m-input>
          </div>
        </el-form-item>
        <el-form-item label="8.血液和血液制品类" :prop="XUE_FEI" class="mt10">(16)血费
          <div class="wid100 inline">
            <m-input :value="value" :prop="XUE_FEI" @change="change"></m-input>
          </div>(17)白蛋白类制品费
          <div class="wid100 inline">
            <m-input :value="value" :prop="BAI_DAN_BAI" @change="change"></m-input>
          </div>(18)球蛋白类制品费
          <div class="wid100 inline">
            <m-input :value="value" :prop="QIU_DAN_BAI" @change="change"></m-input>
          </div>
          <br>(19)凝血因子类制品费
          <div class="wid120 inline">
            <m-input :value="value" :prop="NING_XUE_YIN_ZI" @change="change"></m-input>
          </div>(20)细胞因子类制品费
          <div class="wid120 inline">
            <m-input :value="value" :prop="XI_BAO_YIN_ZI" @change="change"></m-input>
          </div>
        </el-form-item>
        <el-form-item label="9.耗材类" :prop="JIAN_CHA_YI_CI" class="mt10">(21)检查用一次性医用材料费
          <div class="wid100 inline">
            <m-input :value="value" :prop="JIAN_CHA_YI_CI" @change="change"></m-input>
          </div>(22)治疗用一次性医用材料费
          <div class="wid100 inline">
            <m-input :value="value" :prop="ZHI_LIAO_YI_CI" @change="change"></m-input>
          </div>
          <br>(23)手术用一次性医用材料费
          <div class="wid100 inline">
            <m-input :value="value" :prop="SHOU_SHU_YI_CI" @change="change"></m-input>
          </div>
        </el-form-item>
        <el-form-item label="10.其他类" :prop="QI_TA_FEI">(24)其他费
          <div class="wid100 inline">
            <m-input :value="value" :prop="QI_TA_FEI" @change="change"></m-input>
          </div>
        </el-form-item>
        <hr-div></hr-div>
        <div style="height:49px"></div>
      </el-form>
    </div>
    <footer-el></footer-el>
  </div>
</template>

<script>
import shouShu from './oprationtable'
import hrDiv from '@/components/medicalindex/components/hrdiv'
import footerEl from '@/components/medicalindex/components/footer'
import { keyMap } from '../keymap'
import mSelect from './mselect'
import mInput from '@/components/medicalindex/components/minput'
import mTime from '@/components/medicalindex/components/mtimes'

export default {
  props: {
    value: Object,
    dptId: String
  },
  data () {
    return {
      ...keyMap,
      fangshi: {
        1: '医嘱离院',
        2: '医嘱转院',
        3: '医嘱转社区卫生服务机构/乡镇卫生院',
        4: '非医嘱离院',
        5: '死亡',
        9: '其他'
      },
      form: {
        name: '',
        age: '',
        sex: '',
        birthday: '',
        nation: '',
        idNo: ''
      }
    }
  },
  computed: {},
  // created () {
  //   this.$nextTick(_ => {
  //     setTimeout(() => {
  //       this.$bus.$emit('backToCanvas')
  //     }, 400)
  //   })
  // },
  mounted () { },
  watch: {},
  methods: {
    change (key, val) {
      this.$emit('change', key, val)
    },
    changeFangshi (val) {
      this.change(this.LI_YUAN_FANG_SHI, val)
    }
  },
  components: {
    shouShu,
    hrDiv,
    footerEl,
    mSelect,
    mInput,
    mTime
  }
}
</script>
<style scoped lang="scss">
.a4 {
  width: 210mm;
}
.border-select {
  border: 1px solid black;border-bottom: 0px;height:24px;margin-top: 1px
}
.border {
  border: 2px solid black;
}
.inline {
  display: inline-block;
}
.container {
  margin-top: 2px;
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
    height: 23px;
    .el-input .el-input__inner {
      border: none;
      border-radius: unset;
      border-bottom: 1px solid black;
      height: 20px;
      line-height: 20px;
      padding: 0px;
    }
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
    margin-top: -8px;
  }
  /deep/ .el-form--inline .el-form-item.mt10 {
    height: 100%;
    margin-top: -1px;
  }
  .wid280 {
    width: 280px;
  }
  .wid240 {
    width: 240px;
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

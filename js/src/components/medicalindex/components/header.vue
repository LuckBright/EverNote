<template>
  <div class="height">
    <div class="show_box" v-if="!printMode">
      <div class="clear">
        <div class="fl">医疗机构: {{ value[keyMap.YI_LIAO_JI_GOU] }}</div>
        <div class="fr">(组织机构代码：{{ value.orgCode }})</div>
      </div>
      <div class="clear">
        <div class="header-title center">{{headerTitle}}</div>
        <div class="fl cash small">
          医疗付费方式：
          <div class="inline type">
            <el-select
              style="border: 1px solid black;border-bottom: 0px;margin-top: 2px;"
              :value="value[keyMap.YI_LIAO_FU_FEI_code]"
              @change="changeType"
              @focus="getTypes"
              clearable
              placeholder="—"
              size="mini"
            >
              <el-option
                v-for="item in cashOptions"
                :label="item.code"
                :value="item.code"
                :key="item.code"
              >
                <span>{{ item.code }} {{ item.name }}</span>
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="clear small">
        <div class="s3">
          健康卡号：
          <div class="inline cash" style="width:180px">
            <m-input
              :value="value"
              :prop="keyMap.JIAN_KANG_KA_HAO"
              @change="change"
            ></m-input>
          </div>
        </div>
        <div class="s3">
          第
          <div class="inline cash">
            <m-input
              :value="value"
              :prop="keyMap.ZHU_YUAN_TIMES"
              @change="change"
            ></m-input>
          </div>
          次住院
        </div>
        <div class="s3">
          病案号：
          <div class="inline cash" style="width:180px">
            <m-input
              :value="value"
              :prop="keyMap.JB_BING_AN_HAO"
              @change="change"
            ></m-input>
          </div>
        </div>
      </div>
    </div>
    <div class="print_box" v-else>
      <div class="clear">
        <div class="fl">医疗机构: {{ value[keyMap.YI_LIAO_JI_GOU] }}</div>
        <div class="fr">(组织机构代码：{{ value.orgCode }})</div>
      </div>
      <div class="clear">
        <div class="header-title center">中 医 住 院 病 案 首 页</div>
        <div class="fl cash small">
          医疗付费方式: <input :value="value[keyMap.YI_LIAO_FU_FEI_code]" class="b cash_box" placeholder="—">
        </div>
      </div>
      <div class="clear small">
        <div class="s3">
          健康卡号：<input class="bb inline_box wid180" placeholder="—" :value="value[keyMap.JIAN_KANG_KA_HAO]">
        </div>
        <div class="s3">
          第 <input placeholder="—" class="bb inline_box times" :value="value[keyMap.ZHU_YUAN_TIMES]">次住院
        </div>
        <div class="s3">
          病案号：<input placeholder="—" class="bb inline_box wid180" :value="value[keyMap.JB_BING_AN_HAO]">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
import mInput from '@/components/medicalindex/components/minput'
export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    printMode: {
      type: Boolean,
      default: false
    },
    keyMap: {
      type: Object
    },
    headerTitle: {
      type: String
    }
  },
  data () {
    return {
      cashOptions: []
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {},
  methods: {
    change (key, val) {
      this.$emit('change', key, val)
    },
    changeType (val) {
      this.change(this.keyMap.YI_LIAO_FU_FEI_code, val)
    },
    getTypes () {
      sysvalue.listOnce('CV07.10.005').then(result => {
        if (result && result.length) {
          this.cashOptions = result
        }
      })
    }
  },
  components: {
    mInput
  }
}
</script>
<style scoped lang="scss">
.print_box {
  .b {
    border: 1px solid black;
  }
  .cash_box {
    width: 20px
  }
  .times {
    width: 40px
  }
  .span_box {
    border: 1px solid black;
  }
  .cash {
    margin-top: -21px;
  }
  .bb {
    border: 0px;
    border-bottom: 1px solid black;
  }
  .inline_box {
    display: inline-block;
  }
  .wid180 {
    width: 180px
  }
  .wid40 {
    width: 40px
  }
}
.center {
  text-align: center;
}
.height {
  height: 16mm;
}
.header-title {
  font-size: 15pt;
  font-weight: bold;
}
.small {
  font-size: 10pt;
  margin-bottom: -5px;
  /deep/ .el-input--mini .el-input__icon {
    line-height: 20px;
  }
  /deep/.el-input.el-input--suffix .el-input__suffix {
    right: 0;
    top: -10px;
  }
}
.cash {
  margin-top: -24px;
  /deep/ .el-input .el-input__inner {
    border: none;
    border-radius: unset;
    border-bottom: 1px solid black;
    height: 20px;
    line-height: 20px;
    padding: 0px;
  }
  /deep/ .el-input--mini .el-input__icon {
    line-height: 18px;
  }
  .type /deep/.el-input.el-input--suffix .el-input__suffix {
    right: 0;
    top: 0px;
  }
}
.middle {
  font-size: 12pt;
}
.s3 {
  width: 70mm;
  float: left;
}
.inline {
  display: inline-block;
  width: 40px;
}
</style>

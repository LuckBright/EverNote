<template>
  <div class="height">
    <div class="clear middle bolder">
      <div class="fl">医疗机构: {{value[YI_LIAO_JI_GOU]}}</div>
      <div class="fr">(组织机构代码：{{value.orgCode}})</div>
    </div>
    <div class="clear">
      <div class="header-title center">住 院 病 案 首 页</div>
      <div class="fl cash small">
        医疗付费方式:
        <div class="inline type">
          <el-select
            :value="value[YI_LIAO_FU_FEI_code]"
            @change="changeType"
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
              <span>{{item.code}} {{item.name}}</span>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="clear small">
      <div class="s3">
        健康卡号：
        <div class="inline cash" style="width:180px">
          <m-input :value="value" :prop="JIAN_KANG_KA_HAO" @change="change"></m-input>
        </div>
      </div>
      <div class="s3">
        第
        <div class="inline cash">
          <m-input :value="value" :prop="ZHU_YUAN_TIMES" @change="change"></m-input>
        </div>次住院
      </div>
      <div class="s3">
        病案号：
        <div class="inline cash" style="width:180px">
          <m-input :value="value" :prop="JB_BING_AN_HAO" @change="change"></m-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
import { keyMap } from './keymap'
import mInput from './minput'
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
      name: '涿州医疗机构',
      cashType: 6,
      time: 2,
      number: 12121212,
      cashCode: 'CV07.10.005',
      cashOptions: []
    }
  },
  computed: {},
  created () {
    sysvalue.listOnce(this.cashCode).then(result => {
      if (result && result.length) {
        this.cashOptions = result
      }
    })
  },
  mounted () {},
  watch: {},
  methods: {
    change (key, val) {
      this.$emit('change', key, val)
    },
    changeType (val) {
      this.change(keyMap.YI_LIAO_FU_FEI_code, val)
    },
  },
  components: {
    mInput
  }
}
</script>
<style scoped lang="scss">
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
.bolder {
  font-weight: 550;
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

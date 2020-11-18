<!-- 牙齿选择
  交互数据格式：
  toothValue: {
    input: '',   // 字符串，例如，针对一些牙齿的治疗方案
    toothPick: {
      lefttop: '',  // 左上位置的牙齿编号 1-8 乳牙为 A-E
      righttop: '',  // 右上位置的牙齿编号 1-8 乳牙为 A-E
      leftbottom: '', // 左下位置的牙齿编号 1-8 乳牙为 A-E
      rightbottom: ''  // 右下位置的牙齿编号 1-8 乳牙为 A-E
    }
  }
-->
<template>
  <div>
    <el-popover placement="bottom" :disabled="disabled" width="640" trigger="click">
      <tooth-select :selectd="toothValue.toothPick" ref="toothsel" @status="toothSelect"></tooth-select>
      <div slot="reference" class="toothSel">
        <div class="cell c1">{{toothValue.toothPick.lefttop}}</div>
        <div class="cell c2">{{toothValue.toothPick.righttop}}</div>
        <div class="cell c3">{{toothValue.toothPick.leftbottom}}</div>
        <div class="cell c4">{{toothValue.toothPick.rightbottom}}</div>
      </div>
    </el-popover>

    <div class="toothInput">
      <el-input
        type="textarea"
        ref="input"
        :rows="4"
        v-model="toothValue.input"
        @focus="showToothInputDia"
      ></el-input>
      <tooth-input ref="toothinput" :inputvalue.sync="toothValue.input" code="dict1"></tooth-input>
    </div>
  </div>
</template>

<script>
import toothSelect from './tooth.select'
import toothInput from './tooth.input'

export default {
  props: ['value', 'disabled'],
  data () {
    return {
      toothValue: {
        input: '',
        toothPick: {
          lefttop: '',
          righttop: '',
          leftbottom: '',
          rightbottom: ''
        }
      }
    }
  },
  watch: {
    'value' (val) {
      Object.assign(this.toothValue, this.value)
    },
    'toothValue': {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  created () {
    if (this.value) {
      this.toothValue = this.value
    }
  },
  methods: {
    showToothInputDia () {
      this.$refs.toothinput.isShow = true
    },
    showToothSelDia () {
      this.$refs.toothsel.isShow = true
    },
    // setToothSelect (val) {
    //   this.toothValue.toothPick = val
    // },
    toothSelect (status) {
      for (let item in status) {
        let sattusArr = status[item].filter(sitem => { return sitem.status })
        this.toothValue.toothPick[item] = sattusArr && sattusArr.length ? sattusArr.map(sitem => sitem.key).join('') : ''
      }
    }
  },
  components: {
    toothSelect,
    toothInput
  }
}
</script>
<style scoped>
.toothInput {
  position: relative;
}
.toothSel {
  width: 250px;
  float: left;
  margin-right: 20px;
}
.toothSel .cell {
  float: left;
  width: 50%;
  line-height: 30px;
  height: 30px;
  padding: 0 2px;
  box-sizing: border-box;
  word-wrap: break-word;
}
.toothSel .c1 {
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  text-align: right;
}
.toothSel .c2 {
  border-bottom: 1px solid #000;
}
.toothSel .c3 {
  border-right: 1px solid #000;
  text-align: right;
}
.toothInput {
  margin-left: 270px;
  height: 120px;
}
</style>

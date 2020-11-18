<template>
  <div class="layout_inner">
    <p>读取社保卡组件 by liujiekun@everjiankang.com lvjiangtao@everjiankang.com</p>
    <p><b class="cRed">iccard-read (src/components/readdevice/iccard/iccard.vue)</b></p>
    <p>监听方法</p>
    <ever-table
      :columns="columns"
      :data="tableData"
      border
    ></ever-table>
    <!-- <pre class="bor_rad bor_1 p10 m20" style="background:#f1f1f1;padding-top:15px">
      受限于物理设备，调试的时候可能没有真正的读卡设备，可以切换下面的代码用本地数据模拟真实数据<br>
      this.getLocalIdCardData().then(rs => {  // 本地数据（身份证数据内由于数据较大，剪掉了图片内容“image”）<br>
      axios.get('http://127.0.0.1:9999/idcard/get', {}).then(rs => { // 真实接口数据
    </pre> -->
    <iccard-read @memberdata="passMemberdata" @medicalInfo="passMedicalInfo" @select="passSelect"></iccard-read>
    <br>
    <iccard-read @memberdata="passMemberdata" @medicalInfo="passMedicalInfo" @select="passSelect">
      <span slot="default" class="cBlue">读取医保卡</span>
    </iccard-read>
  </div>
</template>
<script>
import IccardRead from '@/components/readdevice/iccard/iccard'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { demoTableColumnArr as columns } from '@/demo/store/config'

export default {
  data () {
    return {
      columns,
      tableData: [
        {
          id: U(),
          param: 'memberdata',
          description: '监听方法',
          type: 'function',
          required: true,
          default: 'function',
        },
        {
          id: U(),
          param: 'medicalInfo',
          description: '监听方法',
          type: 'function',
          required: true,
          default: 'function',
        },
        {
          id: U(),
          param: 'select',
          description: '监听方法',
          type: 'function',
          required: true,
          default: 'function',
        },
      ]
    }
  },
  methods: {
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
  },
  components: {
    IccardRead
  }
}
</script>

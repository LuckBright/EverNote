<template>
  <div class="layout_inner">
    <p>读取身份证组件 by lvjiangtao@everjiankang.com</p>
    <p><b class="cRed">idcard-read (src/components/readdevice/idcard/idcard.vue)</b></p>
    <p>监听方法</p>
    <ever-table
      :columns="columns"
      :data="tableData"
      border
    ></ever-table>
    <pre class="bor_rad bor_1 p10 m20" style="background:#f1f1f1;padding-top:15px">
      受限于物理设备，调试的时候可能没有真正的读卡设备，可以切换下面的代码用本地数据模拟真实数据<br>
      this.getLocalIdCardData().then(rs => {  // 本地数据（身份证数据内由于数据较大，剪掉了图片内容“image”）<br>
      axios.get('http://127.0.0.1:9999/idcard/get', {}).then(rs => { // 真实接口数据
    </pre>
    <idcard-read @getData="getidcardData"></idcard-read>
    <br>
    <idcard-read @getData="getidcardData">
      <span slot="default" class="cBlue">实名读取</span>
    </idcard-read>
    <p>
      iddata:{{iddata}}
    </p>
  </div>
</template>
<script>
import IdcardRead from '@/components/readdevice/idcard/idcard'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { demoTableColumnArr as columns } from '@/demo/store/config'

export default {
  data () {
    return {
      iddata: {},
      columns,
      tableData: [
        {
          id: U(),
          param: 'getData',
          description: '监听读取身份证拿到的身份证数据',
          type: 'function',
          required: true,
          default: 'function',
        },
      ]
    }
  },
  methods: {
    getidcardData (data) {
      this.iddata = data
    }
  },
  components: {
    IdcardRead
  }
}
</script>

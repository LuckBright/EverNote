<template>
  <div class="medical beijing a4">
    <el-button type="text" @click="back=!back">
            <i class="el-icon-document-checked">正反面</i>
    </el-button>
    <div class="a4 main_wrap con_box"
         :class="{active: !back}"
         v-show="!back">
      <div class="inner_wrap"
           ref="main">
        <m-header
                  header-title="住 院 病 案 首 页"
                  :value="form"
                  ></m-header>
        <div class="border">
          <m-body :dpt-id="dptId"
                  :value="form"
                  ></m-body>
        </div>
        <div class="mask"
             v-if="readonly"></div>
      </div>
    </div>
    <div v-if="back"
         class="back_wrap con_box"
         :class="{active: back}">
      <div class="inner_wrap"
           ref="back">
        <back-side :dpt-id="dptId"
                   :value="form"
                   ></back-side>
        <div class="mask"
             v-if="readonly"></div>
      </div>
    </div>
  </div>
</template>

<script>
import mHeader from '@/components/medicalindex/beijing/phrcomponents/header'
import mBody from '@/components/medicalindex/beijing/phrcomponents/mainbody'
import backSide from '@/components/medicalindex/beijing/phrcomponents/backside'
import api from '@/workspace/store/component'
import { keyMap, form } from '@/components/medicalindex/beijing/phrmap'
const { MARRIAGE, GUAN_XI, RU_YUAN_TIME, CHU_YUAN_TIME } = keyMap
export default {
  props: {
    visitId: {
      type: String,
      required: true
    },
    patientId: {
      type: String,
      required: true
    },
    dptId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      form: JSON.parse(JSON.stringify(form)),
      readonly: true,
      keyMap,
      back: false
    }
  },
  methods: {
    async getData () {
      if (!this.visitId) return
      try {
        const res = await api.getHomePageById({ visitSerialNumber: this.visitId, })
        if (res && res.data && typeof res.data.westernMedicineHomePage === 'object') {
          for (let key in res.data.westernMedicineHomePage) {
            const data = res.data.westernMedicineHomePage
            this.form[key] = data[key] !== null ? data[key] : ''
          }
        }
      } catch (err) {}
      // 计算住院天数
      this.getDays(this.form[RU_YUAN_TIME], this.form[CHU_YUAN_TIME], false)
      this.changeMarriage()
      this.$emit('init', this.form.id)
    },
    getDays (start, end, isUpdate) {
      start = this.$moment(start).format('YYYY-MM-DD')
      end = this.$moment(end).format('YYYY-MM-DD')
      if (start && end) {
        let days = this.$moment(end).diff(this.$moment(start), 'days')
        if (isNaN(days)) {
          this.form[keyMap.ZHU_YUAN_DAYS] = ''
        } else {
          if (days === 0) days = 1
          this.form[keyMap.ZHU_YUAN_DAYS] = days
        }
      } else {
        this.form[keyMap.ZHU_YUAN_DAYS] = ''
      }
      this.$emit('update', isUpdate)
    },
    changeGuanxi () {
      // 关系值与平台值不同导致
      const val = String(this.form[GUAN_XI])
      if (val === null) return ''
      if (val === '10') {
        this.form[GUAN_XI] = '1'
      } else if (val === '20') {
        this.form[GUAN_XI] = '2'
      } else if (val === '30') {
        this.form[GUAN_XI] = '3'
      } else if (val === '40') {
        this.form[GUAN_XI] = '4'
      } else if (val === '50') {
        this.form[GUAN_XI] = '5'
      } else if (val === '60') {
        this.form[GUAN_XI] = '6'
      } else if (val === '70') {
        this.form[GUAN_XI] = '7'
      } else if (val === '80') {
        this.form[GUAN_XI] = '8'
      } else {
        const keyArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
        if (!keyArr.includes(val)) {
          this.form[GUAN_XI] = ''
        } else {
          this.form[GUAN_XI] = val
        }
      }
    },
    changeMarriage () {
      // 婚姻与平台值不同导致
      const val = Number(this.form[MARRIAGE])
      if (val === null) return ''
      if (val === 10) {
        this.form[MARRIAGE] = '1'
      } else if (val === 20) {
        this.form[MARRIAGE] = '2'
      } else if (val === 30) {
        this.form[MARRIAGE] = '3'
      } else if (val === 22) {
        this.form[MARRIAGE] = '4'
      } else {
        const keyArr = [1, 2, 3, 4, 9]
        if (!keyArr.includes(val)) {
          this.form[MARRIAGE] = ''
        } else {
          this.form[MARRIAGE] = val
        }
      }
    }
  },
  created () {
    this.getData()
  },
  watch: {
    patientId (val) {
      this.form = JSON.parse(JSON.stringify(form))
    }
  },
  components: {
    mHeader,
    mBody,
    backSide
  },
  beforeDestroy () {
    this.form = null
  }
}
</script>
<style scoped lang='less'>
@import "../style/style.less";
.beijing {
  width: 100%;
  height: 370mm;
  background-color: white;
  padding: 10px;
}
</style>

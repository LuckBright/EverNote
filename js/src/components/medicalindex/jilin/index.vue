 <template>
  <div class="medical jilin">
    <div class="a4 main_wrap con_box"
         :class="{active: !back}"
         v-show="!back">
      <div class="inner_wrap"
           ref="main">
        <m-header :key-map="keyMap"
                  header-title="中 医 住 院 病 案 首 页"
                  :value="form"
                  @change="change"></m-header>
        <div class="border">
          <m-body :dpt-id="dptId"
                  :value="form"
                  @change="change"></m-body>
        </div>
        <div class="mask"
             v-if="readonly"></div>
      </div>
    </div>
    <div v-if="backShow"
         class="back_wrap con_box"
         :class="{active: back}">
      <div class="inner_wrap" ref="back">
        <back-side :dpt-id="dptId"
                   :value="form"
                   @change="change"></back-side>
      </div>
      <div class="mask"
           v-if="readonly"></div>
    </div>
  </div>
</template>

<script>
import mHeader from '@/components/medicalindex/components/header'
import mBody from './components/mainbody'
import backSide from './components/backside'
import api from '@/workspace/store/component'
import { keyMap, form } from './keymap'
import mix from '../mixins/index'
const { MARRIAGE, GUAN_XI, RU_YUAN_TIME, CHU_YUAN_TIME } = keyMap
export default {
  name: 'jilin',
  mixins: [mix],
  data () {
    return {
      form: JSON.parse(JSON.stringify(form)),
      keyMap
    }
  },
  methods: {
    async getData () {
      if (!this.visitId) return
      try {
        const res = await api.jilin({ visitId: this.visitId })
        if (res.data && typeof res.data === 'object') {
          for (let key in res.data) {
            this.form[key] =
              res.data[key] && res.data[key] !== null ? res.data[key] : null
          }
        }
      } catch (err) {}
      // 计算住院天数
      this.getDays(this.form[RU_YUAN_TIME], this.form[CHU_YUAN_TIME], false)
      if (!this.form.id) {
        await this.echoData()
      }
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
    async add () {
      this.form.visitId = this.visitId
      this.form.patientId = this.patientId
      this.form.dptId = this.dptId
      const res = await api.addJilin(this.form)
      if (res.data && res.data.id) {
        this.form.id = res.data.id
      }
      this.$emit('success', { id: this.form.id, success: true })
      let type = this.back ? 'back' : 'main'
      this.domToCanvas(type)
    },
    async echoData () {
      const res = await api.echoJilin({ visitId: this.visitId, patientId: this.patientId })
      if (res.data && res.data !== null) {
        for (let key in res.data) {
          this.form[key] = res.data[key]
        }
      }
      this.getDays(this.form[RU_YUAN_TIME], this.form[CHU_YUAN_TIME], false)
      this.changeMarriage()
      this.changeGuanxi()
      if (!this.form.id) {
        this.$emit('update', false) // 点击同步，有小红点提示
      } else {
        this.$emit('update', true)
      }
    },
    change (key, val) {
      if (this.readonly) return
      if (key === 'HDSD00_12_019' || key === 'HDSD00_12_095' || key === 'HDSD00_12_171') {
        this.form[key] = val.name
        this.form[key + '_code'] = val.code
      } else {
        this.form[key] = val
      }
      if (key === RU_YUAN_TIME || key === CHU_YUAN_TIME) {
        this.getDays(this.form[RU_YUAN_TIME], this.form[CHU_YUAN_TIME], false)
      }
      this.$emit('update', true)
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
  mounted () { },
  watch: {
    patientId (val) {
      this.form = JSON.parse(JSON.stringify(form))
    }
  },
  components: {
    mHeader,
    mBody,
    backSide
  }
}
</script>
<style scoped lang='less'>
@import "../style/style.less";
</style>

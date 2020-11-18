/**
 * phrform中预检计算孕周和BMI
*/
import {TZ_SHEN_GAO, TZ_TI_ZHONG, TZ_BMI} from '@/emr/config/uniform.field.js'
export default{
  methods: {
    getYunZhou (val) {
      let dayEnd = new Date(val).getTime()
      let dayNow = new Date().getTime()
      let total = parseInt(Math.abs(dayNow - dayEnd) / 1000 / 60 / 60 / 24)
      let week = parseInt(Math.abs(dayNow - dayEnd) / 1000 / 60 / 60 / 24 / 7)
      this.obj.TUISUANYUNZHOUZHOUTIAN = week + '周' + (total - week * 7) + '天'
    },
     // BMI的自动计算(根据身高体重)
    computerBMI () {
      if (this.obj.hasOwnProperty(TZ_SHEN_GAO) && this.obj.hasOwnProperty(TZ_TI_ZHONG) && this.obj.hasOwnProperty(TZ_BMI)) {
        let weight = Number(this.obj[TZ_TI_ZHONG])
        let height = Number(this.obj[TZ_SHEN_GAO]) / 100
        let bmi = (weight / (height * height)).toFixed(2)
        if (!this.obj[TZ_TI_ZHONG] || !this.obj[TZ_SHEN_GAO]) {
          this.obj[TZ_BMI] = null
        } else if (weight > 0 && height > 0) {
          this.obj[TZ_BMI] = Number(bmi)
        }
      }
    }
  },
  watch: {
    'obj.QT_MO_CI_YUE_JING' (val) {
      if (val && ['YUN_ZAO_QI_CHAN_QIAN_SHAI_CHA_SHEN_QING_DAN', 'YUN_ZHONG_QI_CHAN_QIAN_SHAI_CHA_SHEN_QING_DAN'].includes(this.code)) {
        this.getYunZhou(val)
      }
    },
    'obj.TZ_SHEN_GAO' (val) {
      this.computerBMI()
    },
    'obj.TZ_TI_ZHONG' (val) {
      this.computerBMI()
    },
  }
}

import {DL_XUE_YA, ZD_MEN_ZHEN_ZHEN_DUAN} from '@/emr/config/uniform.field.js'
import {blood1, blood2} from '@/emr/config/temperaturedata.js'
export default{
  methods: {
    checkForm (currentForm) {
      let isValid = true
      if (currentForm) {
        if (currentForm.$refs.selfvalidate) {
          let comps = currentForm.$refs.selfvalidate
          if (!Array.isArray(comps)) {
            comps = [comps]
          }
          for (let i = 0; i < comps.length; i++) {
            if (comps[i] && comps[i].$refs.form) {
              if (Array.isArray(comps[i].$refs.form)) {
                for (let j = 0; j < comps[i].$refs.form.length; j++) {
                  if (
                    comps[i].$refs.form[j] &&
                    comps[i].$refs.form[j].validate
                  ) {
                    comps[i].$refs.form[j].validate(valid => {
                      if (!valid) {
                        isValid = false
                      }
                    })
                  }
                }
              } else if (comps[i].$refs.form.validate) {
                comps[i].$refs.form.validate(valid => {
                  if (!valid) {
                    isValid = false
                  }
                })
              }
            }
          }
        }
        let toothCheck = true
        if (currentForm.$refs.toothSelect) {
          let comps = currentForm.$refs.toothSelect
          if (!Array.isArray(comps)) {
            comps = [comps]
          }
          for (let i = 0; i < comps.length; i++) {
            if (
              comps[i] &&
              comps[i].toothValue &&
              comps[i].toothValue.toothPick
            ) {
              let isSelect = false
              for (let tooth in comps[i].toothValue.toothPick) {
                if (comps[i].toothValue.toothPick[tooth]) {
                  isSelect = true
                }
              }
              // 当齿科组件选择  input必须有值
              if (isSelect && !comps[i].toothValue.input) {
                isValid = false
                toothCheck = false
              }
            }
          }
        }
        if (!toothCheck) {
          this.$messageTips(
            this,
            'warning',
            '您选择了患者牙位，请填写对应描述！',
            '提示'
          )
        }
      }
      return isValid
    },
    validate (cb, currentForm = this.$refs.form) {
      currentForm.$refs.form.validate(cb)
    },
    focusErrorInput () {
      this.$nextTick(_ => {
        setTimeout(() => {
          let errorDom = document.querySelectorAll('.is-error')
          if (errorDom && errorDom.length) {
            let input = errorDom[0].querySelector('.el-input__inner')
            input && input.focus()
          }
        }, 300)
      })
    },
    setDiagnosisValue (obj) {
      if (this.obj[ZD_MEN_ZHEN_ZHEN_DUAN] && this.obj[ZD_MEN_ZHEN_ZHEN_DUAN].length) {
        this.obj[ZD_MEN_ZHEN_ZHEN_DUAN].map(item => {
          if (!item.value) {
            if (item.diseaseCode && item.diseaseName.indexOf(item.diseaseCode) === -1) {
              item.value = `${item.diseaseName}（${item.diseaseCode}）`
            } else {
              item.value = item.diseaseName
            }
          }
          return item
        })
      } else {
        if (this.allDisabled) {
          this.obj[ZD_MEN_ZHEN_ZHEN_DUAN] = [{ disabled: this.allDisabled }]
        }
      }
    },
    setBlood () {
      let blood = DL_XUE_YA
      if (this.obj[blood]) {
        if (!this.obj[blood][blood1] && !this.obj[blood][blood2]) {
          this.obj[blood] = null
        }
      }
    }
  }
}

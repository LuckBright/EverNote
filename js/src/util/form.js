import { diction } from '@/store/common'
// import { Notification } from 'element-ui'
export default {
  data () {
    return {
      disabled: false
    }
  },
  methods: {
    createObjFromSchema (schema) {
      return diction.createObjFromSchema(schema)
    },
    getFieldFromSchema (schema, name) {
      return diction.getFieldFromSchema(schema, name)
    },
    submitForm: function () {
      // this.disabled = true
      return new Promise((resolve, reject) => {
        if (this.$refs.selfvalidate) {
          let comps = this.$refs.selfvalidate
          if (!Array.isArray(comps)) {
            comps = [comps]
          }
          for (let i = 0; i < comps.length; i++) {
            if (typeof comps[i].validate === 'function') {
              console.log(comps[i], 'comps[i]')
              comps[i].validate(valid => {
                if (!valid) {
                  return reject('validate false')
                }
              })
            }
          }
        }
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.api.createOrUpdate(this.obj, this.isWarehouse).then(result => {
              if (result.head.errCode === 0) {
                this.disabled = true
                this.afterSave('objsaved', result)
              }
              resolve(result)
            }).catch(_ => {
              this.disabled = false
              reject('save error')
            })
          } else {
            this.disabled = false
            setTimeout(() => {
              var isError = document.getElementsByClassName('is-error')
              if (isError.length) {
                isError[0].querySelector('input').focus()
              }
            }, 1)
            reject('validate error')
          }
        })
      })
    },
    afterSave () {
      if (this.successPath) {
        this.$router.push(this.successPath)
      }
    },
    resetForm (formName) {
      this.disabled = false
      this.$refs[formName].$refs.form.resetFields()
    },
    getDetail: function (id) {
      this.api.getById(id || this.objId).then(result => {
        if (result) {
          let data = {}
          if (result.id) {
            data = result
          }
          if (result[0] && result[0].id) {
            data = result[0]
          }
          this.objDetail = JSON.parse(JSON.stringify(data))
          Object.assign(this.obj, data)
        }
      })
    }
  },
  created: function () {
    this.objId = this.$route.params.id === '-1' ? undefined : this.$route.params.id
    if (this.objId) {
      this.getDetail()
    }
  },
  watch: {
    '$route': function () {
      this.objId = this.$route.params.id === '-1' ? undefined : this.$route.params.id
      if (this.objId) {
        this.getDetail()
      }
      this.init && this.init()
    }
  }
}

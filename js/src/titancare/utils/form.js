// import { Notification } from 'element-ui'
export default {
  data () {
    return {
      loadingSubmit: false
    }
  },
  methods: {
    submitForm: function () {
      this.loadingSubmit = true
      return new Promise((resolve, reject) => {
        if (this.$refs.selfvalidate) {
          let comps = this.$refs.selfvalidate
          if (!Array.isArray(comps)) {
            comps = [comps]
          }
          for (let i = 0; i < comps.length; i++) {
            if (typeof comps[i].validate === 'function') {
              comps[i].validate(valid => {
                if (!valid) {
                  return reject(valid)
                }
              })
            }
          }
        }
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            // 如需发起请求之前处理数据或者其他操作  定义该方法
            this.resetObj && this.resetObj()
            this.api.createOrUpdate(this.obj, this.isWarehouse).then(result => {
              this.loadingSubmit = false
              // result 为假时，阻止继续执行
              if (!result) return
              this.afterSave('objsaved', result)
              resolve(result)
            }, _ => {
              this.loadingSubmit = false
              reject(_)
            })
          } else {
            this.loadingSubmit = false
            reject(valid)
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
      this.loadingSubmit = false
      this.$refs[formName].$refs.form.resetFields()
    },
    getDetail: function (id) {
      this.api.getById(id || this.objId).then(result => {
        if (result && result.id) {
          this.objDetail = JSON.parse(JSON.stringify(result))
          Object.assign(this.obj, result)
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

<template>
  <el-form :rules="rules" :model="data" ref="form" :show-message="false" :disabled="disabled">
    <el-form-item prop="doctor">
      <el-select
        v-model="select"
        :placeholder="(field && field.placeholder) ? field.placeholder : '请选择'"
        :size="(field && field.size) ? field.size : ''"
        :clearable="(field && field.clearable) ? true : false"
        :style="{width: (field && field.width) ? field.width : '100%'}"
        :disabled="field && field.disabled"
        :no-data-text="(field && field.nodatatext) ? field.nodatatext : ''"
        :filterable="(field && field.remote) ? true : field && field.filterable"
        :remote="(field && field.remote) ? true : false"
        :remote-method="(field && field.remote) ? remoteMethod : function () {}"
        :allow-create="field && field.allowCreate"
        :value-key="(field && field.needObjFlag) ? 'id' : 'value'"
        v-bind="{'multiple': (field && field.multiple) ? true : false}"
        :loading="loading">
        <el-option
          v-for="option in options"
          :key="option.id || option"
          :label="(field && field.customValue) ? option[customValue] : (option.aptitudeTxt ? (option.name + '-' + option.aptitudeTxt) : option.name)"
          :disabled="option.disabled"
          :value="((field && field.needObjFlag) || (field && field.remote)) ? option : (field && field.customValue) ? option[field.customValue] : option.id">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
  import staffapi from '@/warehouse/store/staffapi'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  export default {
    /**
     * props                        字段含义
     * @param noNeed                字段是否必填
     */
    props: ['value', 'providerId', 'field', 'maxLength', 'noNeed', 'disabled'],
    data () {
      let checkDoctor = function (rule, value, callback) {
        if (!value) {
          return callback(new Error('必填项'))
        }
        if (Array.isArray(value) && !value.length) {
          return callback(new Error('必填项'))
        }
        if (this.maxLength) {
          if (value.length > this.maxLength) {
            return callback(new Error(`最多选${this.maxLength}位`))
          }
        }
        callback()
      }
      return {
        staffapi,
        sysvalue,
        options: [],
        data: {
          doctor: []
        },
        loading: false,
        rules: {
          doctor: [
            {validator: checkDoctor, required: this.noNeed ? null : 'true', trigger: ['blur', 'change']}
          ]
        }
      }
    },
    computed: {
      select: {
        set (newVal) {
          this.$emit('input', newVal)
          this.$emit('change', newVal)
        },
        get () {
          this.data.doctor = this.value
          return this.value || this.value === '' ? this.value : '请选择'
        }
      }
    },
    async created () {
      await this.getDepartment()
    },
    methods: {
      async getDepartment (query) {
        let res
        if (this.providerId) {
          let params = {
            relationType: 401,
            relationId: this.providerId,
            staffType: 'DOCTOR'
          }
          res = await staffapi.getDoctorList(params)
          this.loading = false
          if (res && res.length) {
            this.options = res
          } else {
            this.options = []
          }
        } else {
          // 查询机构所有在职医生
          let params = {
            offset: 0,
            pagesize: 20,
            jobStatus: 50,
            staffType: 'DOCTOR'
          }
          if (query) params.name = query
          res = await staffapi.list(params)
          this.loading = false
          if (res && res.length) {
            let newArr = []
            res.forEach(item => {
              if (item.aptitude) {
                sysvalue.listOnce('THC_WH_RYZC1').then(result => {
                  if (result) {
                    let arr = result.filter(v => {
                      if (v.value === '' + item.aptitude) {
                        return v.value === '' + item.aptitude
                      } else if (v.id === Number(item.aptitude)) {
                        return v.id === Number(item.aptitude)
                      }
                    })
                    newArr.push({id: item.id, name: item.name, aptitude: item.aptitude, aptitudeTxt: arr.length ? arr[0].name : ''})
                  } else {
                    newArr.push({id: item.id, name: item.name})
                  }
                })
              } else {
                newArr.push({id: item.id, name: item.name})
              }
            })
            this.options = newArr
          } else {
            this.options = []
          }
        }
      },
      async remoteMethod (query) {
        if (query !== '') {
          let start = query.indexOf('-')
          if (start >= 0) {
            query = (query.split('-'))[0]
          }
          this.loading = true
          await this.getDepartment(query)
        } else {
          await this.getDepartment()
        }
      },
      getStringVal () {
        if (!this.value || !this.value.length) {
          return null
        }
        return this.value.map(v => {
          return v.name
        }).join(',')
      }
    },
    watch: {
      'providerId': {
        async handler () {
          await this.getDepartment()
        }
      }
    }
  }
</script>

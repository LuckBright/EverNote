<template>
  <span>
    <el-select
      v-model="select"
      filterable
      clearable
      remote
      :multiple="multiple"
      reserve-keyword
      :placeholder="placeholder || '请输入关键词'"
      :remote-method="remoteMethod"
      @change="change"
      style="width: 100%">
      <el-option
        v-for="item in patients"
        :key="item.id"
        :label="item.name"
        :value="item.id">
        <span class="option-field">{{ item.name }}</span>
      </el-option>
    </el-select>
  </span>
</template>
<script>
  import {crm} from '../store/api'
  import {debounce1} from '@/util/common'

  export default {
    props: ['value', 'placeholder', 'queryObj', 'multiple'],
    data () {
      return {
        patients: []
      }
    },
    methods: {
      remoteMethod (query) {
        query = query && String(query).trim()
        return crm.get('/memberChannel/search', {
          params: {
            name: query
          }
        }).then(results => {
          this.patients = results.data.resultList.map(v => {
            if (!v.mobile) {
              if (v.contactList && v.contactList.length) {
                v.mobile = v.contactList[0].mobile
              }
            }
            return v
          })
          return this.patients
        })
      },
      change (val) {
        if (this.queryObj) {
          if (val) {
            this.queryObj.patientIds = val
          } else {
            this.queryObj.patientIds = ''
          }
        }
        this.$emit('change', val)
      }
    },
    computed: {
      select: {
        set (newVal) {
          this.$emit('input', newVal)
          this.$emit('select', this.patients.filter(v => v.id === newVal)[0])
        },
        get () {
          return this.value
        }
      }
    },
    created () {
      this.remoteMethod()
    },
    watch: {
      'queryObj': {
        handler: debounce1(function (val) {
          if (val && val.patientIds) {
            return crm.get('/memberChannel/getById', {
              params: {
                id: val.patientIds
              }
            }).then(results => {
              if (results && results.data) {
                this.patients = [].concat(results.data)
                this.$emit('input', val.patientIds)
              } else {
                this.patients = []
                this.$emit('input', '')
              }
            })
          } else {
            this.patients = []
            this.$emit('input', '')
          }
        }, 500),
        deep: true
      }
    }
  }
</script>
<style scoped>
  .option-field{
    display: inline-block;
    margin-right: 10px;
  }
</style>

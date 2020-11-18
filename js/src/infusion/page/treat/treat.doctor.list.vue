<template>
  <span>
    <el-select :value='value' @input='input' @focus="remoteMethod('')"  :placeholder="placeholder" filterable clearable remote :remote-method='remoteMethod'>
      <el-option
      v-for="ls in doctorList"
      :key="ls.id"
      :label="ls.name"
      :value="ls.id + ''">
      </el-option>
    </el-select>
  </span>
</template>
<script>
import api from '@/infusion/store/infusion.js'
export default {
  props: ['value', 'clinic', 'edit', 'placeholder'],
  data () {
    return {
      api,
      doctorList: [],
      val: '',
      first: false
    }
  },
  filters: {
    option (val, arr) {
      let str = '--'
      arr.forEach(ele => {
        if (ele.id === val && val) {
          str = ele.name
        }
      })
      return str
    }
  },
  watch: {
    value (val) {
      if (!this.doctorList.length) {
        this.remoteMethod()
      }
    }
  },
  mounted () {

  },
  methods: {
    getName () {
      let name
      this.doctorList.forEach(ele => {
        if (ele.id === this.value) {
          name = ele.name
        }
      })
      return name
    },
    input (val) {
      this.val = val
      this.$emit('input', val)
    },
    async remoteMethod (query = '') {
      // if (this.clinic) obj.sourceId = this.$store.state.currentUser.organizationId
      let obj = JSON.parse(localStorage.getItem('tech_value'))
      let tenantDeptId = obj.provider && obj.provider.id
      let res = await this.api.getStaffListHasOrgByCondition({
        outStaffGetStaffListByConditionReqDTO: {
          nameList: [query],
          orgIdList: [this.$store.state.currentUser.organizationId],
          tenantSubjectIdList: [tenantDeptId],
          typeCodeList: ['DOCTOR', 'MEDTECH', 'NURSE'],
          statusCodeList: ['0']
        }
      })
      res.data = res.data || {}
      let arr = res.data.resultList || []
      this.doctorList = arr
      console.log(this.first)
      if (!this.first) {
        this.first = true
        let flag = false
        let id = this.$store.state.currentUser.userId
        arr.forEach(ele => {
          if (ele.id === id)flag = true
        })
        console.log(flag)
        if (flag) this.$emit('input', id)
      }
    },
    init (arr) {
      this.doctorList = JSON.parse(JSON.stringify(arr))
    }
  }
}
</script>

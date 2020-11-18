<!--
 * @Author: renpengfei
 * @Date: 2019-08-19 11:41:45
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-08-22 14:32:36
 -->
<template>
  <div>
    <el-select
      :clearable="true"
      v-model="name"
      filterable
      remote
      :remote-method="remoteMethod"
      :loading="loading"
      placeholder="请选择"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
import carditemapi from '@/card/store/carditemapi'
export default {
  props: {
    orgId: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      options: [],
      loading: false
    }
  },
  created () {
    this.getPatientListByOrgId(this.orgId, this.name)
  },
  methods: {
    remoteMethod (query) {
      this.getPatientListByOrgId(this.orgId, query)
    },
    async getPatientListByOrgId (orgId, name) {
      this.loading = true
      let params = {
        checkOrg: true,
        orgId,
        name: name
      }
      try {
        let data = await carditemapi.getPatientList(params)
        this.options = data.data.resultList
        // this.name = ''
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    }
  },
  computed: {
    name: {
      set (newVal) {
        this.$emit('input', newVal)
      },
      get () {
        return this.value
      }
    }
  },
  watch: {
    orgId: {
      handler (val) {
        this.name = ''
        this.getPatientListByOrgId(val, this.name)
      }
    }
  }
}
</script>    

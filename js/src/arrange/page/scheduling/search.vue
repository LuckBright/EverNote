<template>
  <el-row id="search-head" class="mb20">
    <el-col :span="19">
      <el-form :model="params" :inline="true" label-width="10" label-position="right">
        <el-form-item>
          <el-select v-model="params.orgId" placeholder="请选择机构">
            <el-option v-for="item in orgList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="params.tenantDeptId" placeholder="全部科室">
            <el-option v-for="item in dptList" :key="item.id" :value="item.name" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="params.doctorName" placeholder="医生名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
          <slot name="afther"></slot>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import api from '@/arrange/store/workapi'
  import sapi from '@/arrange/store/settingapi'
  export default {
    data () {
      return {
        api,
        sapi,
        orgId: '',
        orgList: [],
        dptList: [],
        params: {
          orgId: '',
          tenantDeptId: '',
          doctorName: ''
        }
      }
    },
    watch: {
      'params.orgId': {
        handler (val) {
          val && this.getdocByorgDpt(val)
        },
        deep: true
      },
    },
    created () {
      this.getOrgList()
    },
    methods: {
      onSearch () {
        this.$emit('query', this.params)
      },
      getOrgList () {
        this.api.getAllcliniclist().then(rs => {
          if (rs.head.errCode === 0) {
            this.orgList = rs.data.resultList
          }
        })
      },
      getdocByorgDpt (clinicId = null) {
        this.sapi.getdocByorgDpt({'clinicId': clinicId}).then(rs => {
          if (rs.head.errCode === 0) {
            this.dptList = rs.data
          }
        })
      }
    }
  }
</script>

<style scoped>
  #search-head{border-bottom: 1px solid #ddd}
</style>

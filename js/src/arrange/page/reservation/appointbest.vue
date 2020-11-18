<template>
  <el-row>
    <el-col :span="12">
      <el-select v-model="bestDept" clearable value-key="id" :disabled="disabled" placeholder="爱院科室">
        <el-option v-for="(item, i) in deptList" :key="i" :label="item.name" :value="item"></el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="bestResource" clearable value-key="id" :disabled="disabled" class="ml10" placeholder="爱院人">
        <el-option v-for="(item, i) in resourceList" :key="i" :label="item.name" :value="item"></el-option>
      </el-select>
    </el-col>    
  </el-row>
</template>
<script>
  import api from '@/arrange/store/appointapi'
  export default {
    props: ['value', 'disabled'],
    data () {
      return {
        api,
        deptList: [],
        resourceList: [],
        bestDept: '',
        bestResource: ''
      }
    },
    watch: {
      value (val) {
        this.bestDept = val && val.referrerDept && val.referrerDept.id ? val.referrerDept : ''
        this.bestResource = val && val.referrer && val.referrer.id ? val.referrer : ''
      },
      bestResource (val) {
        this.$emit('input', {referrerDept: this.bestDept, referrer: this.bestResource})
      },
      bestDept (val, old) {
        if (!val || !val.id) {
          this.bestResource = ''
          this.resourceList = []
          return false
        }
        if (old) {
          this.bestResource = ''
        }
        this.getResouceList()
      }
    },
    created () {
      this.bestDept = this.value && this.value.referrerDept && this.value.referrerDept.id ? this.value.referrerDept : ''
      this.bestResource = this.value && this.value.referrer && this.value.referrer.id ? this.value.referrer : ''
      this.getDeptList()
    },
    methods: {
      getDeptList () {
        this.api.getWarehouseDeptList().then(rs => {
          this.deptList = rs.data
        })
      },
      getResouceList () {
        this.api.getWarehouseResourceList({
          relationType: 401,
          relationId: this.bestDept.id
        }).then(rs => {
          this.resourceList = rs.data
        })
      }
    }
  }
</script>


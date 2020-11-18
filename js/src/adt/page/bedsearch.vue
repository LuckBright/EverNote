<template>
  <div class='layout_inner'>
    <div class='main-head mb10'>
      <span>请选择病区：</span>
      <el-select v-model="wardId" placeholder="请选择病区" @change='getBedList'>
        <el-option
          v-for="item in tableData"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="flex-column">
      <box-list v-loading="loading" :patients="bedList" :isAdt="true" class="oxhya"></box-list>
    </div>
  </div>
</template>
<script>
import boxList from '@/inpatient/page/boxlist'
import api from '@/adt/store/register'
export default {
  components: {
    boxList
  },
  data () {
    return {
      wardId: '',
      tableData: [],
      bedList: [],
      loading: false
    }
  },
  created () {
    this.getWardList()
  },
  methods: {
    getWardList () {
      api.getAdmitWardSelect({}).then(res => {
        if (res && res.head.errCode === 0) {
          res.data.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.label = item.sickAreaName
            this.tableData.push(obj)
          })
        }
      })
    },
    getBedList () {
      this.loading = true
      let params = {
        areaId: this.wardId
      }
      api.getBedList(params).then(res => {
        if (res && res.head.errCode === 0) {
          this.bedList = res.data
          this.loading = false
        }
      })
    }
  }
}
</script>

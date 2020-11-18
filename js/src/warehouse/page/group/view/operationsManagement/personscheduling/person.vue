<template>
  <div id="calender">
    <el-row id="search-head" class="head pt20 pl20 pr20">
      <el-col :span="12">
        <el-form :inline="true" label-width="10" label-position="right" class="demo-form-inline" @submit.native.prevent>
            <el-form-item>
              <el-input  v-model="params.doctorName"  placeholder="人员"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="publish">发布</el-button>
            </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" class="changeweek">
        <arrange-week v-model="changeDate" @update="updateWeek"></arrange-week>
      </el-col>
    </el-row>
    <crmtable 
      ref="crmtable"
      :arrange-week="weeks" 
      :arrange-list="arrangeList"
      :tempArr="tempArr"
      :tableData="tableData" 
      :changeDate="changeDate && changeDate.substring(8)" 
      :td-width="90"
      @update="upshow"
      @loadmore="loadMore"
      >
    </crmtable>
    <personpup v-if="showdialog" :dialogFormVisible="showdialog" :titleData="titleData" @closepup="closedialog" @update="update"></personpup>
  </div>
</template>
<script>
  import api from '@/arrange/store/settingapi'
  import wapi from '@/arrange/store/workapi'
  import personpup from './personpup.vue'
  import crmtable from './crmtable.vue'
  import arrangeWeek from './arrange.week.vue'
  export default {
    data () {
      return {
        api,
        wapi,
        weeks: [],
        arrangeList: [],
        tempArr: [],
        tableData: [],
        changeDate: this.$moment().format('YYYY-MM-DD'),
        showdialog: false,
        params: {
          doctorName: '', // 人员名称
          startDate: '', // 开始日期
          endDate: '', // 结束日期
          categoryIds: [],
          clinicalTypeIds: []
        },
        doctorIds: [],
        offset: 0,
        pagesize: 20,
        noMore: false,
        count: 0
      }
    },
    async created () {
      // render search
      this.$nextTick(_ => {
        this.getList()
      })
    },
    watch: {
      'params.doctorName': {
        handler (val) {
          this.tempArr = []
          this.arrangeList.map(item => {
            if (item.name === val) {
              this.tempArr.push(item)
            }
          })
        },
        deep: true
      }
    },
    methods: {
      loadMore (val) {
        if (this.noMore) {
          this.offset = (this.count - 1) * this.pagesize
          this.$refs.crmtable.resetCount()
        } else {
          this.offset = (val - 1) * this.pagesize
        }
        this.getList(true)
      },
      update (data) {
        this.showdialog = false
        this.offset = 0
        this.$refs.crmtable.resetCount()
        this.getList()
      },
      async getList (isMore) {
        if (this.noMore) this.offset = 0
        let params = {
          resourceName: this.params.doctorName,
          startDate: this.weeks[0].date,
          endDate: this.weeks[this.weeks.length - 1].date,
          offset: this.offset,
          pagesize: this.pagesize
        }
        this.api.search(params).then(rs => {
          if (rs.head.errCode === 0) {
            if (isMore) {
              this.noMore = !rs.data.resultList.length
              if (!rs.data.resultList.length) {
                this.count = this.$refs.crmtable.count
              }
              this.tableData = rs.data.resultList ? this.tableData.concat(rs.data.resultList) : this.tableData
              let tempObj = {}
              this.tableData = this.tableData && this.tableData.reduce((cur, next) => {
                tempObj[next.id] ? '' : tempObj[next.id] = true && cur.push(next)
                return cur
              }, [])
            } else {
              this.tableData = rs.data.resultList
            }
          }
        })
      },
      upshow (val) {
        this.showdialog = true
        this.titleData = val
      },
      closedialog () {
        this.showdialog = false
      },
      successDialog () {
        this.closedialog()
        this.getList()
      },
      onSearch () {
        this.offset = 0
        this.pagesize = 20
        this.getList()
      },
      updateWeek (val, date) {
        if (date) {
          this.$nextTick(_ => {
            this.$refs.crmtable.resetCount()
            this.onSearch()
          })
        }
        this.weeks = val
      },
      publish () {
        this.params.startDate = this.weeks[0].date
        this.params.endDate = this.weeks[this.weeks.length - 1].date
        this.wapi.publishByStaff(this.params).then(rs => {
          if (rs.head.errCode === 0) {
            this.$notify({
              title: '提示',
              type: 'success',
              message: '发布排班成功',
              duration: 2000
            })
            this.getList()
          }
        })
      }
    },
    components: {
      crmtable,
      personpup,
      arrangeWeek
    },
    beforecreated () {
      this.api = api
    }
  }
</script>

<style scoped>
    #calender {background: #fff;overflow: hidden;}
    #calender .title{line-height: 36px;}
    #calender .changeweek {vertical-align: bottom;text-align: right;padding-right:20px;}
    #calender .changeweek /deep/ .el-button{border-radius: 0; width: 100px;}
    #calender .changeweek /deep/ .el-button:hover{border-color: #dcdfe6;}
    #calender .changeweek /deep/ .el-button + .el-button {margin-left: -1px;}
</style>

<template>
  <div>
    <ever-bread-crumb></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <el-form ref="form">
          <el-input
            class="inline-input"
            v-model="doctorName"
            placeholder="搜索医生"
          ></el-input>
          <el-button @click="list(true)" class="ml10">查找</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form>
      </div>
      <el-row class="p20_30_20_40">
        <el-col>
          <el-table
            class="mt20"
            border
            v-loading.body="loading"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column label="头像">
              <template slot-scope="scope">
                <ever-image :key="scope.row.id" :src="formattePhoto(scope.row)" style="width:70px;height:70px;"></ever-image>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column label="职称/科室" :formatter="formatteKeshi"></el-table-column>
            <el-table-column label="标签" :formatter="formatteLabel"></el-table-column>
            <el-table-column label="简介" :formatter="formatteDesc"></el-table-column>
            <el-table-column prop="modifyTime" label="操作时间"></el-table-column>
            <el-table-column prop="modifyUserName" label="操作人"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button v-if="!isFirst(scope)" size="small" @click="handleSort(scope.row, true)">上移</el-button>
                <el-button v-if="!isLast(scope)" size="small" @click="handleSort(scope.row, false)">下移</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="end">
            <ever-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pagesize="pagesize"
              :totalCount="totalCount"
              :current="current"
            ></ever-pagination>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '@/titancare/api/homemanage/homemanageapi'
import list from '@/titancare/mixins/list'
import { HOME_STATUS_SELECT, HOME_MANAGE_TYPE, LINK_SELECT } from '@/titancare/utils/common'
import storage from '@/util/storage'

export default {
  mixins: [list],
  data () {
    return {
      doctorName: '',
      api,
      storage,
      sortMax: '',
      restaurants: [],
      deptId: ''
    }
  },
  created () {
    this.deptId = this.$route.query.deptId
    this.list(true)
  },
  methods: {
    isFirst (scope) {
      if (this.current === 1) {
        return scope.row.id === this.tableData[0].id
      }
    },
    isLast (scope) {
      if (this.current * this.pagesize >= this.totalCount) {
        // 到达最后一页，
        // 判断当前 scope 是否为 最后一条数据
        return scope.row.id === this.tableData[this.tableData.length - 1].id
      }
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      this.deptId = item.id
    },
    createDoctor (data) {
      let params = {
        actionId: LINK_SELECT[0].id,
        context: 'doctor',
        img: data.photoUrl,
        name: data.name,
        sort: this.sortMax || this.sortMax === 0 ? Number(this.sortMax) + 10 : 0,
        status: HOME_STATUS_SELECT[2].id,
        subTitle: JSON.stringify(data),
        type: HOME_MANAGE_TYPE[4].id
      }
      this.api.createOrUpdate(params).then(res => {
        if (res && res.errCode === 0) {
          this.list()
        }
      })
    },
    list (refresh) {
      this.loading = true
      if (refresh) {
        this.current = 1
        this.offset = 0
      }
      let params = {
        pagesize: this.pagesize,
        offset: this.offset,
        deptId: this.deptId,
        name: this.doctorName,
        type: this.$route.query.type
      }
      try {
        this.api.getDeptDoctors(params).then(res => {
          this.loading = false
          if (res && res.data && res.data.resultList && res.data.resultList.length) {
            this.totalCount = res.data.totalCount
            this.tableData = res.data.resultList
          } else {
            this.tableData = []
          }
        })
      } catch (err) {
        this.loading = false
      }
    },
    handleSort (row, type) {
      this.$post('region/deptDoctorUpDown?x-org-id=' + row.orgId, {
        deptId: this.deptId,
        id: row.id,
        sort: row.sort,
        type: type,
        configType: this.$route.query.type
      }).then(res => {
        if (res.head.errCode === 0) {
          this.list()
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
        }
      })
    },
    resetSearch () {
      this.doctorName = ''
      this.list(true)
    },
    formatteLabel (row) {
      try {
        const subTitle = JSON.parse(row.subTitle)
        return subTitle.infoText
      } catch (e) {
        return '--'
      }
    },
    formatteDesc (row) {
      try {
        const subTitle = JSON.parse(row.subTitle)
        return subTitle.infoRemark
      } catch (e) {
        return '--'
      }
    },
    formatteKeshi (row) {
      try {
        const subTitle = JSON.parse(row.subTitle)
        const typeName = subTitle.typeName
        const keshi = subTitle.tsStaffSubjectList.map(item => item.orgSubjectName).join(',')
        return `${typeName}${keshi ? '\\' + keshi : ''}`
      } catch (e) {
        return '--'
      }
    },
    formattePhoto (row) {
      try {
        const subTitle = JSON.parse(row.subTitle)
        return subTitle.photo
      } catch (e) {
        return ''
      }
    },
    back () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.mb15 {
  margin-bottom: 30px;
}
.ml10 {
  margin-left: 10px;
}
  /deep/ .el-input{
    width: auto !important;
  }
</style>

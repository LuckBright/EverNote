<template>
  <div class="layout_inner">
    <div class="main-head">
      <el-form ref="form">
        <el-autocomplete
          class="inline-input"
          v-model="dept"
          :fetch-suggestions="querySearch"
          placeholder="搜索集团科室"
          @select="handleSelect"
        ></el-autocomplete>
        <el-button @click="list(true)" class="ml10">查找</el-button>
        <el-button @click="resetSearch">重置</el-button>
        <el-button @click="isShowAdd = true">添加推荐科室</el-button>
      </el-form>
    </div>
    <el-table
      border
      class="ever-table-wrap"
      v-loading.body="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop="orgSubjectName" label="科室"></el-table-column>
      <el-table-column prop label="图标">
        <template slot-scope="scope">
          <ever-image :key="scope.row.id" :src="scope.row.photo" style="width:70px;height:70px;"></ever-image>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="操作时间"></el-table-column>
      <el-table-column prop="createUser" label="操作人"></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button size="small" type="danger" @click="handleEdit(scope.row)">更换图标</el-button>
          <el-button size="small" @click="goRecom(scope.row)">设置推荐医生</el-button>
          <el-popover
            placement="top"
            width="160"
            v-model="scope.row.visible"
          >
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0;">
              <el-button
                size="mini"
                type="text"
                @click="scope.row.visible = false"
              >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="del(scope.row)"
                :loading="scope.row.loading"
              >确定</el-button
              >
            </div>
            <el-button
              size="small"
              slot="reference"
              :loading="scope.row.loading"
            >删除</el-button
            >
          </el-popover>
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
    <icon ref="iconDialog" :api="api" @seachList="list()"></icon>
    <el-dialog
      title="添加推荐科室"
      width="400px"
      :visible.sync="isShowAdd"
      :close-on-click-modal="false"
      center
    >
      <dept @update="list(true)"></dept>
    </el-dialog>
  </div>
</template>
<script>
import icon from '../components/icon.vue'
import dept from '../components/dept.vue'
import api from '@/titancare/api/homemanage/homemanageapi'
import list from '@/titancare/mixins/list'
// import { HOME_STATUS_SELECT, HOME_MANAGE_TYPE, LINK_SELECT } from '@/titancare/utils/common'
import storage from '@/util/storage'

export default {
  mixins: [list],
  data () {
    return {
      api,
      storage,
      isShowAdd: false,
      sortMax: '',
      restaurants: [],
      visibleDel: false,
      dept: '',
      deptId: ''
    }
  },
  watch: {
    'dept': {
      handler: function (v) {
        if (!v) {
          this.deptId = ''
        }
      },
      deep: true
    }
  },
  created () {
    this.list(true)
    this.getdept()
  },
  methods: {
    async del (val) {
      val.loading = true
      const params = {
        'x-org-id': storage.getLocalStorage('CLINICID'),
        key: val.id,
        type: this.$route.query.tab === 'online' ? '3' : '2'
      }
      await api.removeConfig(params)
      val.loading = false
      val.visible = false
      this.list(true)
    },
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
    // createDoctor (data) {
    //   let params = {
    //     actionId: LINK_SELECT[0].id,
    //     context: 'doctor',
    //     img: data.photoUrl,
    //     name: data.name,
    //     sort: this.sortMax || this.sortMax === 0 ? Number(this.sortMax) + 10 : 0,
    //     status: HOME_STATUS_SELECT[2].id,
    //     subTitle: JSON.stringify(data),
    //     type: HOME_MANAGE_TYPE[4].id
    //   }
    //   this.api.createOrUpdate(params).then(res => {
    //     if (res && res.errCode === 0) {
    //       this.list()
    //     }
    //   })
    // },
    resetSearch () {
      this.dept = ''
      this.deptId = ''
      this.list(true)
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
        configType: this.$route.query.tab === 'online' ? 3 : 2,
      }
      if (this.deptId) params.idList = [this.deptId]
      try {
        this.api.getTenantSubjectListByPhoto(params).then(res => {
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
    getdept () {
      let params = {
        pagesize: 1000,
        offset: 0,
        configType: this.$route.query.tab === 'online' ? 3 : 2,
      }
      api.getTenantSubjectListByPhoto(params).then(res => {
        this.loading = false
        if (res && res.data) {
          if (res.data.resultList) {
            res.data.resultList.map(item => {
              item.value = item.tenantSubjectName
            })
            this.restaurants = res.data.resultList
          }
        }
      })
    },
    goRecom (row) {
      let type = this.$route.query.tab === 'consult' ? '1' : '2'
      this.$router.push({name: 'depticonrecom', query: {deptId: row.id, type}})
    },
    handleEdit (row) {
      this.$refs.iconDialog.open(row)
    },
    handleSort (row, type) {
      this.$post('region/itemDeptUpDown?x-org-id=' + storage.getLocalStorage('CLINICID'), {
        id: row.id,
        sort: row.sort,
        type,
        configType: this.$route.query.tab === 'online' ? 3 : 2,
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
    }
  },
  components: {
    icon,
    dept
  }
}
</script>

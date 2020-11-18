<!--
 * @Author: renpengfei
 * @Date: 2019-08-19 15:06:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-13 19:15:13
 -->

<template>
  <div class="flex_column_full_hidden main-wrap" v-loading="loading">
    <el-table
      :data="tableData"
      class="no-border table-hover-blue"
      height="100%"
      :highlight-current-row="true"
      @row-click="rowClick"
    >
      <el-table-column prop="status" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="s1" v-if="scope.row.status">{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="patientName"
        label="姓名"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="outpatientNumber"
        label="患者档案号"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="clinicName"
        label="看诊机构"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="doctorName"
        label="开单医生"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <el-footer>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pagerCount="5"
        :totalCount="totalCount"
        :small="true"
        :layout="'total, prev, pager, next'"
      ></ever-pagination>
    </el-footer>
  </div>
</template>
<script>
import list from '@/util/list'
import { getTodoList } from '@/rcm/store/outpatient/outpatient.js'
import sessionapi from '@/auth/store/sessionapi'
import { request } from '@/util/req'
import urlMap from '@/login/store/urls'
import storage from '@/util/storage'
// import staticvars from '@/store/staticvars'
export default {
  mixins: [list],
  props: {
    type: {
      type: Number,
      default: 1
    },
    activeName: {
      type: String,
      default: 'first'
    },
    queryObj: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      tableData: [],
      loading: false
    }
  },
  // watch: {
  //   queryObj: {
  //     handler () {
  //       this.list()
  //     },
  //     deep: true
  //   }
  // },
  created () { },
  methods: {
    async rowClick (val) {
      this.handleChangeOrg(val.clinicId, val)
    },
    async handleChangeOrg (orgId, val) {
      if (orgId === Number(storage.getStorageByClinic('CLINICID'))) {
        this.$emit('sendPatientId', val)
      }
      // 删除库房管理：库房所有状态数据
      storage.removeLocalStorage('MATERIAL_TYPE')
      storage.removeLocalStorage('INIT_STORAGE_ID')
      storage.removeLocalStorage('STORAGE_ID')
      storage.removeLocalStorage('STORAGE_ID_VUEX')
      storage.removeLocalStorage('STORAGE_ITEM')
      storage.removeStorageByClinic('CLINICID')
      try {
        request(urlMap.myBench.switchOrgToReplaceToken, {
          orgId: orgId,
          // version: staticvars.version,
          tenantId: localStorage.getItem('TENANTID')
        }).then((res) => {
          if (res.head.errCode === 0) {
            if (!res || !res.head || res.head.errCode !== 0) {
              return
            }
            storage.setStorageByClinic('TOKEN', res.data)
            return this.getUserInfo(val)
          }
        })
      } catch (error) { }
    },
    getUserInfo (val) {
      sessionapi.user().then(rs => {
        rs.name = rs.displayName
        this.$store.commit('setUser', rs)
        storage.setLocalStorage('USERID', rs.userId)
        this.$emit('sendPatientId', val)
      })
    },
    // 患者列表
    async list () {
      this.loading = true
      let params = {
        todo: this.type === 1,
        offset: this.offset,
        pagesize: this.pagesize,
        ...this.queryObj,
        beginDate:
          this.queryObj && this.queryObj.beginDate
            ? this.$moment(this.queryObj.beginDate).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            : '',
        endDate:
          this.queryObj && this.queryObj.endDate
            ? this.$moment(this.queryObj.endDate).format('YYYY-MM-DD HH:mm:ss')
            : ''
      }
      delete params.daterange
      try {
        let data = await getTodoList(params)
        this.tableData = data.data
        if (this.tableData.length > 0) {
          this.rowClick(this.tableData[0])
        } else {
          this.$emit('sendPatientId', '')
        }
        this.totalCount = data.totalCount
        this.loading = false
        // 如果有参数则从参数获取
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    }
  }
}
</script>
<style scoped>
.s1 {
  background: #d1e8c4;
  border-radius: 2px;
  padding: 0 3px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #000;
}
</style>


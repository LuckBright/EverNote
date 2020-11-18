<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        :rules="rules"
        :is-query="true"
        @query="list(true)"
      >
        <template slot="default">
          <el-form-item>
            <el-button @click="list(true)">查找</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button plain type="primary" @click="handleAdd">添加医生</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <el-table
      class="ever-table-wrap"
      border
      v-loading.body="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop label="头像">
        <template slot-scope="scope">
          <ever-image
            style="width: 70px; height: 70px"
            :src="getAvatar(scope.row)"
          >
          </ever-image>
        </template>
      </el-table-column>
      <el-table-column prop label="姓名">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop label="职称/科室">
        <template slot-scope="scope">
          <div v-if="scope.row.subTitle">
            <span
              v-if="JSON.parse(scope.row.subTitle).skillsTitle2Name"
            >{{JSON.parse(scope.row.subTitle).skillsTitle2Name}}</span>
            <span
              v-if="JSON.parse(scope.row.subTitle).tsStaffSubjectList[0]"
            >{{'/'+JSON.parse(scope.row.subTitle).tsStaffSubjectList[0].tenantSubjectName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop label="标签">
        <template slot-scope="scope">
          <span>{{scope.row.subTitle ? JSON.parse(scope.row.subTitle).infoText : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop label="简介">
        <template slot-scope="scope">
          <span>{{scope.row.subTitle ? JSON.parse(scope.row.subTitle).infoRemark : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="操作时间" width="160"></el-table-column>
      <el-table-column prop="modifyUserName" label="操作人" width="100"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-popover placement="right" v-model="scope.row.visibleFlag">
            <p>确认删除该医生吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visibleFlag = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDel(scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" size="small" type="danger">移除</el-button>
          </el-popover>
          <!--              <el-button size="small" @click="handleSort(scope.row, true)">上移</el-button>-->
          <!--              <el-button size="small" @click="handleSort(scope.row, false)">下移</el-button>-->
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
    <home-info ref="passInfoDialog" :api="api" :type="queryObj.type" @seachList="list()"></home-info>
    <el-dialog
      title="添加医生"
      :visible.sync="isShowAdd"
      center
      width="400px"
      :close-on-click-modal="false"
    >
      <doctor-select
        :api="api"
        graphic="true"
        :statusFlag="isShowAdd"
        @itemObj="createDoctor"
        @cancel="handleDoctorCancel"
        @seachList="list()"
      ></doctor-select>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/titancare/api/homemanage/homemanageapi'
  import list from '@/titancare/mixins/list'
  import { HOME_STATUS_SELECT, HOME_MANAGE_TYPE, LINK_SELECT, lgfixImgSrc } from '@/titancare/utils/common'
  import DoctorSelect from '@/titancare/views/homemanage/components/doctorselect.vue'
  import HomeInfo from '@/titancare/views/homemanage/components/homeinfo.vue'

  export default {
    mixins: [list],
    data () {
      let querySchema = [
        {
          name: 'name',
          props: {
            placeholder: '搜索医生名',
            clearable: true
          }
        }
      ]
      let queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.status = HOME_STATUS_SELECT[0].id
      queryObj.type = HOME_MANAGE_TYPE[5].id
      queryObj.sortField = 'createTime'
      queryObj.sortOrder = 'desc'
      return {
        api,
        querySchema,
        queryObj,
        rules: {},
        isShowAdd: false,
        doctorInfo: '',
        sortMax: '',
        visibleDel: false
      }
    },
    created () {
      this.list(true)
    },
    methods: {
      getAvatar (row) {
        return (JSON.parse(row.subTitle).photo) + ''
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
      renderPrev (obj) {
        let res = []
        if (JSON.parse(obj).photo && JSON.parse(obj).photo !== '') {
          res = [lgfixImgSrc(JSON.parse(obj).photo)]
          return res
        } else {
          return []
        }
      },
      createDoctor (data) {
        if (!data.name) {
          return
        }
        let params = {
          actionId: LINK_SELECT[0].id,
          context: 'doctor',
          img: data.photoUrl,
          name: data.name,
          sort: this.sortMax || this.sortMax === 0 ? Number(this.sortMax) + 10 : 0,
          status: HOME_STATUS_SELECT[2].id,
          subTitle: JSON.stringify(data),
          type: this.$route.query.tab === 'online' ? HOME_MANAGE_TYPE[6].id : HOME_MANAGE_TYPE[5].id,
        }
        this.api.createOrUpdate(params).then(res => {
          if (res && res.errCode === 0) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.list()
          }
        })
      },
      resetSearch () {
        this.queryObj.name = ''
        this.list(true)
      },
      handleEdit (row) {
        row.img = lgfixImgSrc(JSON.parse(row.subTitle).photo)
        this.$refs.passInfoDialog.open(row)
      },
      list (refresh) {
        this.loading = true
        if (refresh) {
          this.current = 1
          this.offset = 0
        }
        let params = Object.assign({}, this.queryObj)
        params.pageSize = this.pagesize
        params.currentPage = this.current
        params.type = this.$route.query.tab === 'online' ? HOME_MANAGE_TYPE[6].id : HOME_MANAGE_TYPE[5].id
        try {
          api.list(params).then(res => {
            this.loading = false
            if (res && res.data) {
              if (res.data.resultList) {
                let resData = res.data
                resData.resultList.forEach(item => {
                  item.statusFlag = false
                  item.visibleFlag = false
                  if (item.status === Number(HOME_STATUS_SELECT[2].id)) item.statusFlag = true
                })
                this.tableData = resData.resultList.length ? resData.resultList : []
                this.totalCount = resData.totalCount
                if (this.tableData.length) this.sortMax = this.tableData[0].sort
              }
            }
          })
        } catch (err) {
          this.loading = false
        }
      },
      handleAdd () {
        this.isShowAdd = true
      },
      handleSort (row, type) {
        this.$post('region/itemDoctorUpDown?x-org-id=' + row.orgId, {
          id: row.id,
          sort: row.sort,
          type,
          configType: this.$route.query.tab === 'online' ? '3' : '2'
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
      handleDel (row) {
        let params = {
          type: this.$route.query.tab === 'online' ? HOME_MANAGE_TYPE[6].id : HOME_MANAGE_TYPE[5].id,
          status: row.status,
          sortOrder: '',
          sortField: '',
          pageSize: this.pagesize,
          currentPage: this.current,
          id: row.id
        }
        api.remove(params).then(res => {
          if (res && res.errCode === 0) {
            this.visibleDel = false
            this.list()
          }
        })
      },
      handleDoctorCancel () {
        this.isShowAdd = false
      },
      save () {
        this.isShowAdd = false
      },
      cancel () {
        this.isShowAdd = false
      },
    },
    components: {
      DoctorSelect,
      HomeInfo
    }
  }
</script>

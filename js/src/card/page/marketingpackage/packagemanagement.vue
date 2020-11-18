<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        :is-query="true"
        v-ever-bind-enter
        @query="list(true)"
      >
        <template slot="default">
          <el-form-item class="fr">
            <el-button
              type="primary"
              class="querybtn"
              :disabled="!hasOrganPower"
              style="float:right;"
              @click="navgateTo"
              size="small"
            > {{isPlan ? '新建保障计划' : '新建套餐'}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="list(true)">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div class="ever-table-wrap flex_col_1_hidden main-wrap">
      <el-table
        class="w ever-table"
        :data="tableData"
        border
        v-loading="loading">
        <el-table-column
          prop="name"
          label="名称"
          min-width="130"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <a
              href="javascript:void(0)"
              @click="querydetail(scope.row)"
            >{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$route.meta.type !== 'plan'"
          prop="categoryName"
          label="分类"
        ></el-table-column>
        <el-table-column
          prop="fitOrigName"
          label="适用机构"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="有效期"
          :formatter="formatterTime"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="totalPrices"
          label="总金额"
          align="right"
        ><template slot-scope="scope">
            {{scope.row.totalPrices | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          label="折扣"
          :formatter="formmatterDiscount"
          width="60"
        ></el-table-column>
        <el-table-column
          prop="totalPriceDiss"
          label="折后总金额"
          align="right"
        >
          <template slot-scope="scope">
            {{scope.row.totalPriceDiss | formatToFinacial}}
          </template></el-table-column>
        <el-table-column
          prop="statusName"
          label="停用项目">
          <template slot-scope="scope">
            <span v-if="scope.row.isServiceValid || scope.row.isServiceValid == 0">{{scope.row.isServiceValid ? '否' : '是'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusName"
          label="状态"
        ></el-table-column>
        <el-table-column
          prop="creatorName"
          label="创建人"
          width="90"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="220"
        >
          <template slot-scope="scope">
            <package-confirm
              @confirm="deletePackage(scope.row.id)"
              :msg="'确定要删除吗？'"
              :disabled ="!hasOrganPower || scope.row.isClinic == 1"
              :iconType="0"
            ></package-confirm>
            <package-confirm
              @confirm="changeStatus(scope.row, 5)"
              v-if="scope.row.status == 3"
              :disabled ="!hasOrganPower || scope.row.isClinic == 1"
              :msg="'确定要停用吗？'"
              :buttonVal="'停用'"
              :type="'danger'"
              :plain="true"
              :iconType="0"
            ></package-confirm>
            <package-confirm
              @confirm="changeStatus(scope.row, 3)"
              :disabled ="!hasOrganPower || scope.row.isClinic == 1"
              v-if="scope.row.status == 5"
              :msg="'确定要启用吗？'"
              :buttonVal="'启用'"
              :type="'primary'"
              :plain="false"
              :iconType="0"
            ></package-confirm>
            <el-button type="primary" :disabled ="!hasOrganPower || scope.row.isClinic == 1" @click="copy(scope.row)">复制</el-button>
            <el-button type="primary" v-if="scope.row.categoryId === '06' && $route.meta.type !== 'plan'" @click="showQrcode(scope.row.id, scope.row.name)">二维码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ever-pagination
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="pageIndex"
      :pagesize="pagesize"
    >
    </ever-pagination>
    <dialog-qrcode ref="qrcode" :fileId="fileId" :fileName="fileName"></dialog-qrcode>
  </div>
</template>
<script>
import api from '@/card/store/packagemanagement/api'
import PackageConfirm from '@/card/page/packagemanagement/packageconfirm'
import dialogQrcode from '@/card/page/marketingpackage/dialog.qrcode.vue'
// import {getFirstRoutePath} from '@/util/common'
let querySchema = [
  {
    label: '',
    name: 'name',
    props: {
      placeholder: '请输入名称'
    },
  },
  {
    label: '分类',
    name: 'categoryId',
    comp: 'sys-type',
    props: {
      placeholder: '请选择分类',
      code: 'THC_MEAL_CLASSIFY_CODE',
      filtercodes: ['01', '02', '03']
    },
  },
  {
    label: '状态',
    name: 'status',
    comp: 'ever-select',
    props: {
      placeholder: '请选择状态',
      options: [
        {id: 3, name: '启用'},
        {id: 5, name: '停用'}
      ]
    },
  }
]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    let _querySchema = querySchema.slice()

    return {
      querySchema: _querySchema,
      queryObj,
      tableData: [],
      pageSizes: [5, 10, 15, 20],
      pagesize: Number(this.$route.query.pagesize) || 20,
      pageIndex: Number(this.$route.query.pageIndex) || 1,
      totalCount: 0,
      loading: false,
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0, // 是否集团
      hasOrganPower: true, // 是否机构管控
      fileId: '',
      fileName: ''
    }
  },
  components: {
    PackageConfirm,
    dialogQrcode
  },
  created () {
    if (!this.isGroup) {
      api.getClinicManageConfigForRecord({type: '119'}).then(rs => {
        if (rs.head.errCode === 0 && rs.data) {
          this.hasOrganPower = (String(rs.data.isConfig) === '0')
        }
      })
    }
    this.ctrlForm(this.$route.path)
    this.list()
  },
  computed: {
    isPlan () {
      return this.$route.meta.type === 'plan'
    }
  },
  watch: {
    '$route': function(to, form) {
      this.ctrlForm(to.path)
    }
  },
  methods: {
    ctrlForm (path) {
      this.list()
      if (path === '/card/protectionplan/list') {
        if (this.querySchema.findIndex(item => item.name === 'categoryId') >= 0) {
          this.querySchema.splice(this.querySchema.findIndex(item => item.name === 'categoryId'), 1)
        }
      } else {
        this.querySchema = querySchema.slice()
      }
    },
    copy (row) {
      let params = {
        id: row.id,
        isGroup: this.isGroup
      }
      api.createNewById(params).then(rs => {
        if (rs.head.errCode === 0) {
          let obj = {
            id: rs.data.id,
            categoryId: rs.data.categoryId
          }
          this.$messageTips(this, 'success', '复制成功')
          this.querydetail(obj)
        }
      })
    },
    changeStatus (row, type) {
      let params = {
        id: row.id,
        status: type,
        isGroup: this.isGroup
      }
      api.updateStatus(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', Number(type) === 5 ? '停用' : '启用' + '成功')
          this.list(true)
        }
      })
    },
    navgateTo () {
      let url = this.isGroup ? '/manages/marketingpackageadd' : this.isPlan ? '/card/marketinprotecorderadd' : '/card/marketingpackageadd'
      this.$router.push({path: url, query: {type: this.$route.meta.type}})
    },
    list (flag) {
      this.loading = true
      // 如果是通过改变条件查询的，需要将页码重置
      if (flag) {
        this.pageIndex = 1
        this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, pageIndex: this.pageIndex }
        })
      }
      let params = {
        categoryId: this.queryObj.categoryId,
        name: this.queryObj.name,
        status: this.queryObj.status,
        pagesize: this.pagesize,
        isGroup: this.isGroup,
        offset: (this.pageIndex - 1) * this.pagesize
      }
      if (this.isPlan) {
        params.categoryId = '06'
      } else {
        params.categoryIds = this.queryObj.categoryId || '01,02,03'
      }
      api.getPackageList(params).then(result => {
        this.tableData = result.data && result.data.resultList || []
        this.totalCount = result.data && result.data.totalCount || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    querydetail (row) {
      let routePath = this.isGroup ? '/manages/marketingpackageedit' : this.isPlan ? '/card/marketingplanedit' : '/card/marketingpackageedit'
      this.$router.push({
        path: routePath,
        query: {
          packageId: row.id,
          pageIndex: this.pageIndex,
          pagesize: this.pagesize,
          categoryId: row.categoryId
        }
      })
    },
    deletePackage (id) {
      api.deletePackageById({ id: id, isGroup: this.isGroup }).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '操作成功')
          this.list(true)
        }
      }).catch(error => {
        console.log('错误原因是' + error)
      })
    },
    formatterTime (row) {
      let startTime = ''
      let endTime = ''
      if (row.startDate) {
        startTime = this.Stringformatter(row.startDate)
      }
      if (row.endDate) {
        endTime = this.Stringformatter(row.endDate)
      }
      return startTime + '-' + endTime
    },
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, pagesize: pagesize }
      })
      this.list(false)
    },
    handleCurrentChange (pageIndex) {
      this.pageIndex = pageIndex
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, pageIndex: pageIndex }
      })
      this.list(false)
    },
    Stringformatter (str) {
      return str.substring(0, 10)
    },
    formmatterDiscount (row) {
      return row.discount / 10 + '折'
    },
    showQrcode (id, name) {
      api.getQrCode({'setMealId': id}).then(rs => {
        if (rs.head.errCode === 0) {
          this.fileId = rs.data
          this.fileName = name
          this.$refs.qrcode.open()
        }
      })
    }
  }
}
</script>
<style scoped>
.querybtn {
  margin: 0 0 0 10px;
}
.packagecontainer /deep/.el-input--medium .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.packagecontainer /deep/.el-input__inner {
  height: 32px;
  line-height: 32px;
}
.packagecontainer /deep/ .el-form .el-form-item {
  margin-bottom: 0;
}
</style>

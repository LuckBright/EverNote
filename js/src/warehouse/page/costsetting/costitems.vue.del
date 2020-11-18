<template>
  <div>
    <!-- <ever-bread-crumb name="成本项目" path="/warehouse/costitems"></ever-bread-crumb> -->
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <!-- <el-button type="primary" @click="createReceivables" style="margin-right:10px;">导入</el-button>
          <el-button type="primary" @click="createReceivables" style="margin-right:10px;">导出</el-button>-->
          <router-link :to="'/financeistall/costitemsadd'">
            <el-button size="small" type="primary" @click="createReceivables" style="margin-right:10px;">新建</el-button>
          </router-link>
          <!-- <el-button type="primary" @click="createReceivables" style="margin-right:10px;">删除</el-button> -->
        </div>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        :border="false"
      >
        <el-table-column prop="code" label="成本项目代码" align="center"></el-table-column>
        <el-table-column prop="name" label="成本项目名称" align="center"></el-table-column>
        <el-table-column prop="parentCode" label="上级代码" align="center"></el-table-column>
        <el-table-column prop="costType" label="成本分类" align="center"></el-table-column>
        <el-table-column prop="type" label="成本类型" align="center">
          <template slot-scope="scope">{{scope.row.type==1?'固定成本':'变动成本'}}</template>
        </el-table-column>
        <el-table-column prop="healthIden" label="医疗/药品标识" align="center">
          <template slot-scope="scope">{{scope.row.healthIden==1?'医疗成本':'药品成本'}}</template>
        </el-table-column>
        <el-table-column prop="status" label="是否停用" align="center">
          <template slot-scope="scope">{{scope.row.status==1?'可用':'停用'}}</template>
        </el-table-column>
        <el-table-column prop="last" label="是否末级" align="center">
          <template slot-scope="scope">{{scope.row.last?'是':'否'}}</template>
        </el-table-column>
        <el-table-column prop="spell" label="拼音码" align="center"></el-table-column>
        <el-table-column prop="createUser" label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="$router.push('/financeistall/costitemsedit/' + scope.row.id)"
            >编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-row>
    </div>
    <upload-excel-log :ipNo="curId" :showLog="showLog" @update="updateUser"></upload-excel-log>
  </div>
</template>
<script>
import list from '@/util/list'
import api from '@/warehouse/store/costapi.js'
import uploadExcelLog from '@/warehouse/page/costsetting/uploadexcellog'
import sysvalue from '@/warehouse/store/sysvalueapi'

var schema = [
  {
    name: 'name',
    label: '成本项目名称'
  },
  {
    name: 'costType',
    label: '成本分类',
    type: 'systype',
    code: 'THC_RCM_DICT_COST_TYPE'
  },
  {
    name: 'type',
    label: '成本类型',
    type: 'select',
    options: [
      { id: 1, name: '固定成本' },
      { id: 2, name: '变动成本' }
    ]
  },
  {
    name: 'status',
    label: '是否停用',
    type: 'select',
    options: [
      { id: '1', name: '可用' },
      { id: '0', name: '停用' }
    ]
  },
  {
    name: 'last',
    label: '是否末级',
    type: 'select',
    options: [
      { id: '1', name: '是' },
      { id: '0', name: '否' }
    ]
  },
  {
    name: 'spell',
    label: '拼音码'
  }

]
export default {
  // 0:否 1:是  成本类型 固定成本：1  变动成本：2
  components: {
    uploadExcelLog
  },
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.confirmBeginDate = ''
    obj.confirmEndDate = ''
    obj.submitBeginDate = ''
    obj.submitEndDate = ''
    return {
      querySchema: schema,
      queryObj: obj,
      api,
      insurancercvtypeStr: api.insurancercvtypeStr,
      payStatusStr: api.payStatusStr,
      checkArr: [],
      showLog: false,
      curId: '11',
      costoptions: {}
    }
  },
  methods: {
    updateUser () {

    },
    async list () {
      this.loading = true
      var params = Object.assign({}, this.queryObj)
      for (let key in params) {
        if (params[key] === '' || key === 'requestSwitch') {
          delete params[key]
        }
      }
      if (params.last === '1') {
        params.last = true
      } else if (params.last === '0') {
        params.last = false
      }
      params.offset = this.offset
      params.pagesize = this.pagesize
      try {
        this.tableData = []
        // this.listApiName 自定义api名称
        this.api.list(params).then(result => {
          this.loading = false
          if (result) {
            this.initdata(result.data)
            this.totalCount = result.totalCount ? result.totalCount : 0
          } else {
            this.emptyData = true
          }
        })
      } catch (err) {
        this.loading = false
        this.emptyData = false
        // console.log(err)
      }
    },
    handleDelete (id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return api.del({ id: id })
      }).then(() => {
        this.$messageTips(this, 'success', '删除成功')
        this.list()
      })
    },
    handleSelectionChange (val) {
      this.checkArr = val
    },
    createReceivables () {
      this.showLog = true
    },
    initdata (data) {
      if (Object.keys(this.costoptions) > 0) {
        data.forEach(item => {
          item.costType = this.costoptions[item.costType]
        })
        this.tableData = data
      } else {
        sysvalue.listOnce('THC_RCM_DICT_COST_TYPE').then(res => {
          if (res && res.length > 0) {
            res.forEach(item => {
              this.costoptions[item.id] = item.name
            })
          }
          data.forEach(item => {
            item.costType = this.costoptions[item.costType]
          })
          this.tableData = data
        })
      }
    }
  },
  created () {

  }
}
</script>

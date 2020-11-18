<template>
  <div>
    <div class="layout_inner">
      <div class="main-head pos_re">
        <ever-form2
          :schema="querySchema"
          v-model="obj"
          :inline="true"
          @query="customList">
          <template slot="default">
            <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
            <el-button size="small" class="btnW" @click="handlerReset">重置</el-button>
          </template>
        </ever-form2>
        <div class="pos_ab head-btn-right" v-if="isNew">
          <!-- <h4>采购单列表</h4> -->
          <router-link :to="'/goods/drugpurcheaseadd'">
            <el-button size="small" type="primary">新增采购单</el-button>
          </router-link>
        </div>
      </div>
      <el-table
        v-loading.body="loading"
        border
        :data="tableData">
        <el-table-column align="center" width="60">
          <template slot-scope="scope">{{scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column align="center" prop="code" width="220" label="采购单号">
          <template slot-scope="scope">
            <a
              @click="handlerRoute(scope.row)"
            >{{scope.row.code}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" width="100" prop="printCode" v-if="printCodeSetting === 1">
        </el-table-column>
        <el-table-column align="center" label="采购申请单号" width="220">
          <template slot-scope="scope">
            <a
              v-if="scope.row.applyCode"
              @click="$router.push(`/goods/drugprocurementdetail/${scope.row.applyId}`)"
            >{{scope.row.applyCode}}</a>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" v-if="isNew" align="center"></el-table-column>
        <el-table-column align="center" label="收货库房" prop="storageRoomName">
        </el-table-column>
        <!-- 现在只有购销暂时先隐藏 -->
        <!-- <el-table-column align="center" label="供销方式" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.supplyMode === 1 ? '购销' : '代销'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center" prop="totalPrice" label="采购单总金额" width="200">
          <template slot-scope="scope">{{scope.row.totalPrice | formatToFinacial(4)}}</template>
        </el-table-column>
        <el-table-column align="center" prop="operatorName" label="创建人" width="100"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width="160px">
          <template slot-scope="scope">
            <span>{{scope.row.createTime || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="采购单状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{setName(FULL_STATE.purchase, scope.row.status, true)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="arriveStatus" label="入库状态" width="100">
          <template slot-scope="scope">
            <span
              v-if="scope.row.arriveStatus && scope.row.status !== 1"
            >{{setName(FULL_STATE.instock, scope.row.arriveStatus, true)}}</span>
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
    </div>
  </div>
</template>
<script>
import api from './purcheasenewapi'
import storageroomApi from '../../store/storageroomapi'
import customList from '@/warehouse/page/storages/util/customList'
// import getMaterialInfoApi from '../../store/getmaterialinfoapi'
import sets from '@/util/setstatusname'
import { FULL_STATE, drugOrMaterialType, MATERIA_TYPE_OPTIONS } from '@/util/common'
import beforeRouteEnter from '@/warehouse/page/storages/util/beforer.route.enter.js'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import printCodeSettingMixmins from '@/warehouse/page/storages/mixins/printCodeSetting.mixins.js'
// const MODE = [ 12月27日安佰强要求隐藏
//   // { id: '', name: '全部' },
//   { id: '1', name: '购销' },
//   // { id: 2, name: '代销' }
// ]
var querySchema = [
  {
    name: 'code',
    label: '采购单号',
  },
  {
    name: 'applyCode',
    label: '采购申请单号',
  },
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { materialType: '', splitFlag: 0 },
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'printCode',
    label: '序号',
    style: {
      width: '100px'
    }
  },
  {
    name: 'storageRoomId',
    label: '库房',
    comp: 'sys-select',
    props: {
      options: []
    },
    style: 'width: 200px'
  },
  {
    name: 'materialType',
    label: '物资类型',
    comp: 'sys-select',
    props: {
      options: MATERIA_TYPE_OPTIONS
    },
    style: 'width: 100px'
  }
  // {12月27日安佰强要求隐藏
  //   name: 'supplyMode',
  //   label: '供销方式',
  //   comp: 'sys-select',
  //   props: {
  //     options: MODE,
  //     clearable: false
  //   },
  //   style: 'width: 100px'
  // }
]
export default {
  mixins: [customList, sets, beforeRouteEnter, printCodeSettingMixmins],
  props: {
    isNew: {
      type: Boolean,
      default: true
    }
  },
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      drugOrMaterialType,
      MATERIA_TYPE_OPTIONS,
      querySchema,
      api,
      supplierLocalId: this.$route.params.supplierId,
      FULL_STATE,
      obj,
    }
  },
  created () {
    this.obj.supplyMode = '1'
    this.querySchema = this.createdSchema(this.querySchema)
    this.customList()
    this._getStorageRoom()
  },
  activated () {
    this.customList()
  },
  methods: {
    handlerRoute (v) { // 跳转查看或者新建页面
      if (this.$route.params.supplierId) {
        this.$router.push(`/goods/drugpurchease/${v.id}?drug=drug`)
      } else {
        this.$router.push(v.status !== 1 ? '/goods/drugpurchease/' + v.id : `/goods/drugpurcheaseadd/${v.id}?status=${v.status}`)
      }
    },
    handlerReset () { // 重置
      this.obj = this.$ever.createObjFromSchema(querySchema)
    },
    handlerQuery () {
      this.customList(true)
    },
    // handleSizeChange (val) {
    //   this.pagesize = val
    //   console.log(this.current, '999')
    //   this.offset = (this.current - 1) * this.pagesize
    //   this.current = 1
    //   this.customList()
    // },
    // handleCurrentChange (val) {
    //   this.current = val
    //   this.offset = (val - 1) * this.pagesize || 0
    //   console.log(this.offset)
    //   const refresh = Object.keys(this.obj).find(keys => { return this.obj[keys] !== '' })
    //   this.customList(refresh)
    // },
    customList: function (flag) {
      let params = {}
      params.offset = flag ? 0 : this.offset
      params.pagesize = this.pagesize
      Object.assign(params, this.obj)
      if (!this.isNew) params.supplierLocalId = this.supplierLocalId
      params.purchaseType = 1
      this.api.list(params).then(res => {
        if (res && res.list) {
          let results = JSON.parse(JSON.stringify(res.list))
          this.tableData = results
          this.totalCount = res.totalCount
          if (flag) this.current = 1
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
    },
    async _getStorageRoom (id) {
      let initoptions = await storageroomApi.list({ name: '', offset: 0, pagesize: 9999 }).then()
      if (initoptions && initoptions.list) {
        this.$ever.getFieldFromSchema(this.querySchema, 'storageRoomId').props.options = initoptions.list
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.main-option h4 {
  margin: 0;
  float: left;
  line-height: 36px;
}
.btnW {
  width: 60px;
}
</style>

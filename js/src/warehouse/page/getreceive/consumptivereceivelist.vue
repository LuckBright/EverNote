<template>
  <div>
    <div class="layout_inner">
      <div class="main-head pos_re">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          :inline="true"
          style="width: calc(100% - 110px)">
          <template slot="date">
            <ever-range-picker
              :start.sync="queryObj.startDate"
              outformat="YYYY-MM-DD HH:mm:ss"
              :defaultTime="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions"
              :end.sync="queryObj.endDate">
            </ever-range-picker>
          </template>
          <template slot="default">
            <el-button type="primary" size="small" @click="handleList">查询</el-button>
            <el-button size="small" @click="handlerReset">重置</el-button>
          </template>
        </ever-form2>
        <div class="head-btn-right pos_ab">
          <!-- <h4>领用单列表</h4> -->
          <el-button size="small" type="primary" @click="handleNewAdd">新建领用单</el-button>
        </div>
      </div>
      <el-table
        v-loading.body="loading"
        border
        :data="tableData">
        <el-table-column show-overflow-tooltip prop="code" align="center" label="领用单号">
          <template slot-scope="scope">
            <a @click="handleRouterTo(scope.row)">{{scope.row.code}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" prop="printCode"  width="100" v-if="printCodeSetting === 1"></el-table-column>
        <el-table-column label="领用科室" align="center" prop="sectionName"></el-table-column>
        <el-table-column label="发货库房" align="center" prop="storageRoomName"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createName"
          align="center"
          label="申请人"></el-table-column>
        <el-table-column
          prop="applyTime"
          align="center"
          label="申请时间">
          <template
            slot-scope="scope"
          >{{$moment(scope.row.createDate).format('YYYY-MM-DD HH:mm:ss')}}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="业务状态">
          <template slot-scope="scope">
            <span :class="{ 'red': scope.row.status === 53 }">{{setName(FULL_STATE.use, scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 54 && scope.row.pricingModel === isBatch" size="small" @click="handleCopy(scope.row)">复制</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :pagesize="pagesize"
          :current="current">
        </ever-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from './receiveapi'
import list from '@/util/list'
import sets from '@/util/setstatusname'
import supplyapi from '@/warehouse/page/supplyapi/supplyapi.js'
import storageroomApi from '@/warehouse/store/storageroomapi.js'
import storage from '@/util/storage'
import { FULL_STATE } from '@/util/common'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import printCodeSettingMixmins from '@/warehouse/page/storages/mixins/printCodeSetting.mixins.js'
let querySchema = [
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    params: {},
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'code',
    label: '领用单号'
  },
  {
    name: 'sectionId',
    label: '领用科室',
    comp: 'sys-select',
    props: {
      options: []
    }
  },
  {
    label: '序号',
    name: 'printCode',
    style: {
      width: '100px'
    }
  },
  {
    name: 'storageRoomId',
    label: '发货库房',
    comp: 'sys-select',
    props: {
      options: []
    }
  },
  {
    name: 'date',
    label: '申请日期',
    comp: 'custom',
    style: 'width: 360px;',
    class: 'data_picker',
  },
  {
    name: 'status',
    label: '业务状态',
    comp: 'sys-select',
    props: {
      options: []
    }
  }
]
export default {
  mixins: [sets, list, printCodeSettingMixmins],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    let _this = this
    return {
      materialType: '',
      querySchema,
      api,
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
      queryObj: obj,
      FULL_STATE,
      noClearParams: ['materialType'],
      pathName: '/goods/consumptivereceives',
      changeMaterialTypeId: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > _this.$moment('23:59:59', 'hh:mm:ss').valueOf()
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!['consumptivereceive'].includes(from.name)) {
        for (let key in vm.queryObj) {
          vm.queryObj[key] = ''
        }
      }
      vm.list(!['consumptivereceive'].includes(from.name))
    })
  },
  created () {
    this.getSchemaOptions()
    this.querySchema = this.createdSchema(this.querySchema)
  },
  computed: {
    path () {
      return this.isBatch ? 'consumptivereceiveaddbatch' : 'consumptivereceiveadd'
    }
  },
  methods: {
    getRoutePath (pricingModel) {
      return pricingModel === 1 ? 'consumptivereceiveaddbatch' : 'consumptivereceiveadd'
    },
    handleList () {
      this.list(this.queryObj)
    },
    // 获取科室&&发货库房&&业务状态 options
    getSchemaOptions () {
      // 获取当前机构所有开启的科室
      let sectionProps = this.$ever.getFieldFromSchema(this.querySchema, 'sectionId').props
      let params = {
        orgIdList: [storage.getStorageByClinic('CLINICID') || ''],
        pagesize: 10000,
        offset: 0,
        usePermissionStatus: 'Y'
      }
      supplyapi.getTenantSubjectListByCondition(params).then(res => {
        let sectionArr = []
        if (res && res.data) {
          res.data.resultList.map(item => {
            sectionArr.push({
              id: item.id,
              name: item.tenantSubjectName
            })
          })
          sectionProps.options = sectionArr
        }
      })
      // 获取当前机构下的全部库房
      let storageRoomProps = this.$ever.getFieldFromSchema(this.querySchema, 'storageRoomId').props
      storageroomApi.list({ materialType: '', name: '', isInvented: 0, offset: 0, pagesize: 99999 }).then(res => {
        if (res && res.list) {
          let storageroomArr = JSON.parse(JSON.stringify(res.list))
          storageRoomProps.options = storageroomArr
        }
      })
      // 获取业务状态
      let statusProps = this.$ever.getFieldFromSchema(this.querySchema, 'status').props
      statusProps.options = [{ id: '', name: '全部' }, ...FULL_STATE.use]
    },
    handlerReset () {
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
      this.query(this.queryObj)
    },
    handleCopy (row) {
      this.$router.push(`/goods/${this.path}/${row.id}`)
    },
    handleRouterTo (row) {
      const { id, status, pricingModel } = row
      if (this.$route.path === '/goods/consumptivereceives') {
        this.$router.push(`/goods/${status === 51 ? this.getRoutePath(pricingModel) : 'consumptivereceive'}/${id}`)
      } else {
        this.$router.push(`/csa/warehouseuse/${id}`)
      }
    },
    handleNewAdd () {
      if (this.$route.path === '/goods/consumptivereceives') {
        this.$router.push(`/goods/${this.path}`)
      } else {
        this.$router.push('/csa/warehouseuseadd')
      }
    },
  },
  watch: {
    '$route' (v) {
      this.pathName = v.path
    },
  }
}
</script>
<style lang="scss" scoped>
.main-option h4 {
  margin: 0;
  float: left;
  line-height: 36px;
}
</style>

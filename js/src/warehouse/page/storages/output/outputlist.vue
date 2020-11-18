<template>
  <div :key="'outputlist' + statusRoute">
    <div class="layout_inner">
      <div class="main-head pos_re">
        <ever-form2
          :class="$route.path !== '/storages/output/outputs/21' ? 'form_mr_time' : ''"
          :schema="querySchema"
          v-model="queryObj"
          :inline="true"
          :is-query="true"
          @query="list()">
            <template slot="default">
              <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
              <el-button size="small" @click="handlerReset">重置</el-button>
            </template>
          </ever-form2>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
        <el-table-column show-overflow-tooltip prop align="center" width="300" label="出库任务单号">
          <template slot-scope="scope">
            <span
              class="btn_code blue"
              @click="handlerRoute(scope.row)"
            >{{scope.row.code}}</span>
            <span v-if="scope.row.status == 23" class="lack_goods bg_OOS">
              {{ scope.row.status | formateValueToFnt({
              list: FULL_STATE.outstock
              }) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" width="100" prop="printCode" v-if="printCodeSetting === 1"></el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" width="100" label="出库类型">
          <template slot-scope="scope">{{setName(FULL_IN_OUT_TYPE.outtype, scope.row.type, true)}}</template>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop align="center" width="100" label="关联单据">
          <template slot-scope="scope">{{setName(FULL_ORDER_NAME.outtype, scope.row.type, true)}}</template>
        </el-table-column> -->
        <el-table-column show-overflow-tooltip prop align="center" width="300" label="来源单号">
          <template slot-scope="scope">
            <span>{{scope.row.billCode}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" label="创建时间">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime">{{scope.row.createTime}}</span>
            <span v-else>{{'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" label="出库时间">
          <template slot-scope="scope">
            <span v-if="scope.row.outDate">{{scope.row.outDate}}</span>
            <span v-else>{{'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" width="100" label="出库状态">
          <template slot-scope="scope">{{setName(FULL_STATE.outstock, scope.row.status, true)}}</template>
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
import api from '../store/outputapi'
import list from '@/util/list'
import setName from '@/util/setstatusname'
import { FULL_STATE, FULL_IN_OUT_TYPE, FULL_ORDER_NAME } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_WIDTH, BUSINESS_TYPE_COLLECT } from '@/warehouse/views/util/constant'
// import printCodeSettingMixmins from '../mixins/printCodeSetting.mixins.js'
import storageroomapi from '@/warehouse/store/storageroomapi.js'

let querySchema = []
let codeSchema = [
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { materialType: '' }
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'code',
    label: '出库任务单号'
  },
  {
    name: 'billCode',
    label: '来源单号',
  },
  {
    label: '序号',
    name: 'printCode',
    style: {
      width: '100px'
    }
  },
  {
    name: 'type',
    label: '出库类型',
    comp: 'ever-select',
    props: {
      options: [],
    }
  }
]
let typeSchema = [
  {
    name: 'status',
    label: '出库状态',
    comp: 'ever-select',
    props: {
      options: [{ id: '', name: '全部' }, { id: '20', name: '待出库' }, { id: '200', name: '待审核' }, { id: '24', name: '驳回' }, { id: '23', name: '缺货' }]
    }
  },
]
export default {
  mixins: [list, setName, getstorage],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      typeSchema,
      codeSchema,
      queryObj: obj,
      FULL_STATE,
      FULL_IN_OUT_TYPE,
      FULL_ORDER_NAME,
      api,
      noStoreQuery: true,
      listParams: { 'materialType': '', statusString: '20,23,200,24' },
      inStockType: [],
      schemaList: [],
      once: true,
      printCodeSetting: 2,
      printName: 'outputList',
      statusRoute: 20
    }
  },
  created () {
    this._info()
  },
  methods: {
    createdSchema (schema, printCode) {
      if (printCode !== 1) {
        let printCodeIndex = schema.findIndex(key => key.name === 'printCode')
        if (~printCodeIndex) {
          schema.splice(printCodeIndex, 1)
        }
      }
      return schema
    },
    handlerRoute (row) {
      this.$router.push(!['200', '24', '21'].includes(`${row.status}`) ? `/storages/output/outputsee/${row.id}` : `/storages/output/outputedit/${row.id}?${['200', '21'].includes(`${row.status}`) ? 'look=' : 'look'}${row.id}`)
    },
    handlerReset () { // 重置
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
      this.query(this.queryObj)
    },
    handlerQuery () {
      this.query(this.queryObj)
    },
    async _info (status, refresh) {
      let arr = [{ id: '', name: '全部' }]
      let typeOptions = []
      BUSINESS_TYPE_COLLECT.forEach(item => {
        if (['13', '31', '14', '2', '20', '15'].includes(item.id)) {
          let name = item.name.replace('单', '')
          arr.push({
            id: item.id,
            name: name
          })
        }
      })
      if (this.once) {
        await storageroomapi.selectSystemSettingByClinicId().then(res => {
          if (res && res.id) {
            this.printCodeSetting = res.printCodeSetting || 2
          }
        })
      }
      this.once = false
      this.codeSchema = this.createdSchema(this.codeSchema, this.printCodeSetting)
      if (this.$route.path === '/storages/output/outputs/21') {
        this.querySchema = [...this.codeSchema]
        this.statusRoute = this.$route.params.status
        delete this.listParams.statusString
        this.listParams.status = this.$route.params.status
        typeOptions = [...arr, { id: '3', name: '盘亏出库' }, { id: '22', name: '拆零出库' }]
      } else {
        this.querySchema = [...this.codeSchema, ...this.typeSchema]
        typeOptions = [...arr]
      }
      this.$ever.getFieldFromSchema(this.querySchema, 'type').props.options = typeOptions
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
      this.$ever.getFieldFromSchema(this.querySchema, 'localMaterialId').props.params.materialType = this.materialType
      this.$ever.getFieldFromSchema(this.querySchema, 'localMaterialId').props.params.storageRoomId = this.storageId
      this.listParams.materialType = this.materialType
      if ((status && this.cacheCurrentStatus !== status) || refresh) {
        this.queryObj.startDate = ''
        this.queryObj.endDate = ''
        this.queryObj.localMaterialId = ''
        this.queryObj.code = ''
        setTimeout(_ => {
          this.cacheCurrentStatus = status
        }, 100)
      }
    }
  },
  watch: {
    '$route.params.status' (val) {
      let statusNum = parseInt(val)
      if (statusNum === this.statusRoute || this.$route.name !== 'outputs') return
      if (statusNum === 20) {
        this.statusRoute = statusNum
        delete this.listParams.status
        this.listParams.statusString = '20,23,200,24'
      } else {
        this.statusRoute = statusNum
        delete this.listParams.statusString
        this.listParams.status = statusNum
      }
      this._info(statusNum)
      if (this.current > 1 && statusNum === this.cacheCurrentStatus) {
        this.handleCurrentChange(this.current)
      } else {
        this.list(true)
      }
    },
    queryObj: {
      handler (v) {
        if (this.listParams.statusString) {
          if (v.status) {
            this.listParams.statusString = v.status
          } else {
            this.listParams.statusString = '20,23,200,24'
          }
        }
      },
      deep: true
    },
    'queryObj.code' (v) {
      v && this.query(this.queryObj)
    }
  }
}
</script>
<style lang="scss" scoped>
.layout_inner {
  border: none;
  border-radius: 0;
}
.success {
  position: absolute;
  right: 40px;
  top: 100px;
}

.btn_code {
  float: left;
  width: 70%;
  text-align: right;
}
.lack_goods {
  float: right;
  width: 20%;
  padding: 4px 0 0 0;
}
.bg_OOS {
  line-height: 17px;
}
</style>

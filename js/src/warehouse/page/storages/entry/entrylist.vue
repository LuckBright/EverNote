<template>
  <div :key="'entrylist' + statusRoute">
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :key="statusRoute"
          :class="$route.path !== '/storages/entry/entrys/11' ? 'form_mr_time' : ''"
          :schema="querySchema"
          v-model="queryObj"
          :inline="true"
          :is-query="true"
          @query="list()">
          <template slot="default">
            <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
            <el-button size="small" class="btnW" @click="handlerReset">重置</el-button>
          </template>
        </ever-form2>
      </div>
      <el-table v-loading.body="loading" :data="tableData">
        <el-table-column show-overflow-tooltip prop align="center" width="300" label="入库任务单号">
          <template slot-scope="scope">
            <span
              class="blue"
              @click="routerLink(scope.row)"
            >{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" width="100" prop="printCode" v-if="printCodeSetting === 1"></el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" width="120" label="入库类型">
          <template slot-scope="scope">{{setName(FULL_IN_OUT_TYPE.intype, scope.row.type, true)}}</template>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop align="center" width="100" label="关联单据">
          <template slot-scope="scope">{{setName(FULL_ORDER_NAME.intype, scope.row.type, true)}}</template>
        </el-table-column> -->
        <el-table-column show-overflow-tooltip prop align="center" width="300" label="来源单号">
          <template slot-scope="scope">
            <span>{{scope.row.billCode}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" label="创建时间">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" label="入库时间">
          <template slot-scope="scope">
            <span>{{scope.row.inDate || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" width="100" label="状态">
          <template slot-scope="scope">{{setName(FULL_STATE.instock, scope.row.status, true)}}</template>
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
import api from '../store/enterapi'
import list from '@/util/list'
import { FULL_STATE, FULL_IN_OUT_TYPE, FULL_ORDER_NAME } from '@/util/common'
import setName from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_WIDTH, BUSINESS_TYPE_COLLECT } from '@/warehouse/views/util/constant'
import storageroomapi from '@/warehouse/store/storageroomapi.js'
// import printCodeSettingMixmins from '../mixins/printCodeSetting.mixins.js'
// const INVOICE = [{ name: '全部', id: '' }, { name: '已到', id: '3' }, { name: '未到', id: '1' }, { name: '部分未到', id: '2' }]

let querySchema = []
let codeSchema = [
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { materialType: '', filterOverdueRecord: true },
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'code',
    label: '入库任务单号'
  },
  {
    name: 'billCode',
    label: '来源单号'
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
    label: '入库类型',
    comp: 'ever-select',
    props: {
      options: []
    }
  }
]
let statusSchema = [
  {
    name: 'status',
    label: '入库状态',
    comp: 'ever-select',
    props: {
      options: [{ id: '', name: '全部' }, { id: '9', name: '暂存' }, { id: '10', name: '待入库' }, { id: '100', name: '待审核' }, { id: '13', name: '驳回' }]
    }
  }
]

export default {
  mixins: [list, setName, getstorage],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      codeSchema,
      statusSchema,
      queryObj: obj,
      api,
      noStoreQuery: true,
      FULL_STATE,
      FULL_ORDER_NAME,
      FULL_IN_OUT_TYPE,
      printName: 'entryList',
      once: true,
      printCodeSetting: 2,
      listParams: Object.assign({ 'inOutstockType': 0, 'materialType': '' }, this.$route.params.status === '10' ? { statusList: [9, 10, 100, 13] } : { status: this.$route.params.status }),
      statusRoute: 10
    }
  },
  created () {
    this._info()
  },
  methods: {
    handlerQuery () { // 查询
      this.query(this.queryObj)
    },
    handlerReset () { // 重置
      this._info()
    },
    routerLink (data) {
      if (data.type === '10') {
        if (data.status === 9) {
          this.$router.push(`/storages/entry/entryadd/${data.id}`)
        } else if (data.status === 10) {
          if (data.isStaging) {
            this.$router.push(`/storages/entry/purchaseentry/${data.id}`)
          } else {
            this.$router.push(`/storages/entry/purchasesee/${data.id}`)
          }
        } else {
          this.$router.push(`/storages/entry/purchaseentry/${data.id}`)
        }
      } else {
        if (data.status === 10) {
          this.$router.push(`/storages/entry/entrysee/${data.id}`)
        } else if (data.status === 13) {
          this.$router.push(`/storages/entry/entryother/${data.id}`)
        } else {
          this.$router.push(`/storages/entry/entryedit/${data.id}?look=${data.id}`)
        }
      }
    },
    createdSchema (schema, printCode) {
      if (printCode !== 1) {
        let printCodeIndex = schema.findIndex(key => key.name === 'printCode')
        if (~printCodeIndex) {
          schema.splice(printCodeIndex, 1)
        }
      }
      return schema
    },
    async _info (status, refresh) {
      let arr = [{ id: '', name: '全部' }]
      let typeOptions = []
      BUSINESS_TYPE_COLLECT.forEach(item => {
        if (['10', '11', '32', '12', '33', '40', '41'].includes(item.id)) {
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
      this.codeSchema = this.createdSchema(this.codeSchema, this.printCodeSetting)
      if (this.$route.path === '/storages/entry/entrys/11') {
        this.statusRoute = this.$route.params.status
        this.listParams.status = this.$route.params.status
        this.querySchema = [...codeSchema]
        typeOptions = [...arr, { id: '7', name: '盘盈入库' }, { id: '23', name: '拆零入库' }]
      } else {
        this.querySchema = [...codeSchema, ...statusSchema]
        typeOptions = [...arr]
      }
      this.$ever.getFieldFromSchema(this.querySchema, 'type').props.options = typeOptions
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
      this.$ever.getFieldFromSchema(this.querySchema, 'localMaterialId').props.params.materialType = this.materialType
      this.$ever.getFieldFromSchema(this.querySchema, 'localMaterialId').props.params.storageRoomId = this.storageId
      // this.listParams.materialType = this.materialType
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
    'queryObj.status' (v) {
      this.$nextTick(() => {
        if (this.$route.params.status === '11') {
          if (this.listParams.statusList) delete this.listParams.statusList
        } else {
          this.listParams.statusList = v ? [Number(v)] : [9, 10, 100, 13]
        }
      })
    },
    '$route.params.status' (val) {
      // this.$route.params.status === '10' ? {statusList: [9, 10, 100, 13]} : {status: this.$route.params.status, statusList: [11]}
      let statusNum = parseInt(val)
      if (statusNum === this.statusRoute || this.$route.name !== 'entrys') return
      if (statusNum === 10) {
        this.statusRoute = statusNum
        this.listParams.status = statusNum
        this.listParams.statusList = [9, 10, 100, 13]
      } else {
        this.statusRoute = statusNum
        this.listParams.status = statusNum
        if (this.listParams.statusList) delete this.listParams.statusList
      }
      this._info(statusNum)
      if (this.current > 1 && statusNum === this.cacheCurrentStatus) {
        this.handleCurrentChange(this.current)
      } else {
        this.list(true)
      }
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
.main-option h4 {
  margin: 0;
  float: left;
  line-height: 36px;
}
</style>

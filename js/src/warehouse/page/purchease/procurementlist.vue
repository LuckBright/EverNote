<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="obj"
          :inline="true"
          @query="customList">
          <template slot="default">
            <el-form-item>
              <el-button type="primary" size="small" @click="customList">查询</el-button>
              <el-button size="small" class="btnW" @click="handlerReset">重置</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <el-button size="small" type="primary" @click="$router.push('/goods/procurementdetail')">新增采购申请</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <!-- <h4>采购申请单列表</h4> -->
      <procurement-list :loading="loading" :tableData="tableData" path="/goods/procurementdetail/" :print-code-setting="printCodeSetting"></procurement-list>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :totalCount="totalCount" :current="current">
        </ever-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '../storages/store/procurementapi'
import storageroomApi from '@/warehouse/store/storageroomapi'
// import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import customList from '@/warehouse/page/storages/util/customList'
import sets from '@/util/setstatusname'
import beforeRouteEnter from '@/warehouse/page/storages/util/beforer.route.enter.js'
import procurementList from '@/warehouse/page/components/procurement/procurementlist'
import { MATERIA_TYPE_OPTIONS, FULL_STATE } from '@/util/common'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import printCodeSettingMixmins from '@/warehouse/page/storages/mixins/printCodeSetting.mixins.js'
var querySchema = [
  {
    name: 'code',
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
    label: '收货库房',
    comp: 'sys-select',
    props: {
      placeholder: '请选择库房',
      options: []
    }
  },
  {
    name: 'materialType',
    label: '物资类型',
    comp: 'sys-select',
    props: {
      options: MATERIA_TYPE_OPTIONS
    }
  },
  {
    name: 'status',
    label: '申请单状态',
    comp: 'sys-select',
    props: {
      options: []
    }
  }
]

export default {
  mixins: [customList, sets, beforeRouteEnter, printCodeSettingMixmins],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      // materialType: '',
      status: '1',
      querySchema,
      FULL_STATE,
      MATERIA_TYPE_OPTIONS,
      obj,
      statusOpions: [],
      noClearParams: ['materialType'],
      changeMaterialTypeId: []
    }
  },
  created () {
    this._info()
  },
  methods: {
    handlerReset () {
      this.obj = this.$ever.createObjFromSchema(querySchema)
    },
    _info () {
      this.querySchema = this.createdSchema(this.querySchema)
      this.statusOpions = [{ id: '', name: '全部' }]
      Object.keys(FULL_STATE.procurement).map(key => {
        if (key !== '813') {
          this.statusOpions.push({
            id: key,
            name: FULL_STATE.procurement[key]
          })
        }
      })
      this.$ever.getFieldFromSchema(this.querySchema, 'status').props.options = this.statusOpions
      if (!this.$route.query.q) {
      } else {
        this.offset = (this.current - 1) * this.pagesize
        let query = JSON.parse(this.$route.query.q)
        Object.assign(this.obj, query)
      }
      this.customList()
      this._getStorageRoom()
    },
    async _getStorageRoom () {
      let initoptions = await storageroomApi.list({ name: '', offset: 0, pagesize: 9999 }).then()
      if (initoptions && initoptions.list) {
        this.$ever.getFieldFromSchema(this.querySchema, 'storageRoomId').props.options = initoptions.list
      }
    },
    customList: function (refresh) {
      if (refresh) {
        this.offset = 0
      }
      let params = Object.assign({}, this.obj)
      params.offset = this.offset
      params.pagesize = this.pagesize
      this.api.list(params).then(res => {
        if (res && res.list) {
          let results = JSON.parse(JSON.stringify(res.list))
          this.tableData = results
          this.totalCount = res.totalCount
        } else {
          this.tableData = []
          this.totalCount = 0
        }
        this._encodeSearchParams(this.obj)
      })
    }
  },
  watch: {
    'status' (type) {
      if (type === '1') {
        this.$ever.getFieldFromSchema(this.querySchema, 'localMaterialId').params.status = ''
        this.obj.status = ''
      } else {
        this.$ever.getFieldFromSchema(this.querySchema, 'localMaterialId').params.status = type
        this.obj.status = type
      }
      this.customList()
    }
  },
  components: {
    procurementList
  }
}
</script>

<style lang="scss" scoped>
  .main-option h4 { margin: 0;float: left; line-height: 36px;}
</style>

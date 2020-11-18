<template>
  <div class="layout_inner">
    <div class="main-head js-main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
        :has-ext="false"
      >
        <template slot="sendTime">
          <ever-range-picker
            dateType="daterange"
            :autoWidth="false"
            width="260px"
            :start.sync="queryObj.startTime"
            :end.sync="queryObj.endTime"
            :outformat="`YYYY-MM-DD HH:mm:ss`"
            :default-time="['00:00:00', '23:59:59']"
          ></ever-range-picker>
        </template>
        <template slot="areaId">
          <el-select v-model="queryObj.areaId" filterable clearable placeholder="请选择病区">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button size="small" type="primary" @click="list()">查询</el-button>
            <el-button size="small" @click="resetSearchForm()">重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      :showIndex="true"
      ref="table"
      border
      method="post"
      :columns="columns"
      :url="url"
      fixed-elements="js-main-head"
      :params.sync="queryObj"
      @eventChange="eventChange"
    >
      <template slot="code" slot-scope="scope">
        <a href="javascript:" @click="showDetail(scope.row)">{{scope.row.code}}</a>
      </template>
    </ever-table>
    <ever-full-dialog v-if="showDetailStatus" v-model="showDetailStatus"  :leftMargin="200">
      <template>
      </template>
    </ever-full-dialog>
  </div>
</template>
<script>
import { request } from '@/util/req'
import { warehouse as axios } from '@/warehouse/store/api'
import everFullDialog from '@/components/full-dialog'
import { tableColWidth } from '@/util/table-config'
import urlObj from '@/warehouse/views/drug/api/focusdispenseapi'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import getstorage from '@/warehouse/page/storages/util/getstorage'

const querySchema = [
  {
    name: 'billscode',
    label: '摆药单',
    props: {
      placeholder: '请输入摆药单号',
      clearable: true,
    }
  },
  {
    label: '病区',
    name: 'areaId',
    comp: 'custom'
  },
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    style: REMOTE_METHODS_WIDTH,
    props: {
      params: { materialType: '' }
    },
  },
  {
    name: 'patientId',
    label: '患者',
    comp: 'ever-patient-select-query',
    props: {
      placeholder: '输入患者姓名、患者档案号、就诊卡号',
      clearable: true,
    },
  },
  {
    label: '执行科室',
    name: 'executeProviderId',
    comp: 'ever-select',
    props: {
      options: []
    }
  },
  {
    label: '发药时间',
    name: 'sendTime',
    comp: 'custom'
  }
]
export default {
  mixins: [getstorage],
  components: {
    everFullDialog
  },
  data: function () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      areaOptions: [],
      showDetailStatus: false,
      columns: [
        {
          prop: 'code',
          label: '摆药单号',
          slot: 'code',
        },
        {
          prop: 'areaName',
          label: '病区',
        },
        {
          prop: 'createBy',
          label: '发药人',
          minWidth: tableColWidth.name7W120,
        },
        {
          prop: 'sendTime',
          label: '发药时间',
          minWidth: tableColWidth.datetimeAllW160,
        }
      ],
      querySchema,
      queryObj,
      url: urlObj.getRecordList,
    }
  },
  created () {
    this.initExecuteProviderOptions()
    this.getAreas()
  },
  computed: {
    // 当前库房流程配置数据
    currentProcessConfig () {
      return this.$store.state.processConfig.thisStorageroomProcessConfig
    },
    // 流程id
    processConfigurationId () {
      return this.currentProcessConfig.id
    },
    // 当前流程配置code  100001 100002 100003 等
    processId () {
      return this.currentProcessConfig.processId
    }
  },
  methods: {
    // 获取执行科室
    async initExecuteProviderOptions () {
      let params = {
        containOtherStorageroom: 0,
        storageRoomId: this.storageId,
        processId: this.processId,
        processConfigurationId: this.processConfigurationId,
        type: this.$route.path.indexOf('/outpaitent') > -1 ? 1 : 3,
        orderType: this.$route.path.indexOf('back') > -1 ? 2 : 1
      }
      await axios.cancelPost('order/searchProviderList', params).then(res => {
        if (res && res.length) {
          this.$ever.getFieldFromSchema(this.querySchema, 'executeProviderId').props.options = res.map(item => {
            return {
              id: item.executeProviderId,
              name: item.executeProviderName
            }
          })
        }
      })
    },
    /**
     * 显示详情（弹窗形式）
     */
    showDetail (row) {
      // this.showDetailStatus = true
      this.$router.push({
        path: this.$route.path + '/detail',
        query: {
          id: row.id
        }
      })
    },
    /**
     *重置搜索条件
     */
    resetSearchForm () {
      this.queryObj = this.$ever.createObjFromSchema(querySchema)
    },
    /**
     * 关闭弹窗
     */
    hideDialog (done) {
      done()
    },
    /**
     * 请求列表
     */
    list () {
      this.$refs.table.list(true)
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    getAreas () {
      request(urlObj.getAreasNew, { status: 3 }, 'post').then(res => {
        if (res.head.errCode === 0) {
          this.areaOptions = res.data.map((item, index) => {
            return {
              label: item.areaName,
              value: item.areaId
            }
          })
        }
      })
    },
  },
}
</script>
<style scoped lang="less">
    .add-form{
      margin-bottom: 16px;
    }
</style>

<template>
  <div id="saleservice">
    <div class="layout_inner">
      <ever-query-form :schema="querySchema" v-model="queryObj" @query="list(true)"></ever-query-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="sn"
          label="售后单号"
          width="180">
          <!-- <template slot-scope="scope">
            <a href="javascript:;">{{scope.row.sn}}</a>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="orderSn"
          label="订单号"
          width="180">
          <!-- <template slot-scope="scope">
            <a href="javascript:;">{{scope.row.orderSn}}</a>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="productSkuName"
          label="商品名称">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.productSkuName" placement="bottom-start">
              <span>{{scope.row.productSkuName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="申请时间">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <sys-value type="THC_MALL_RETURN_ORDER_STATUS" :code="scope.row.status"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-button
                type="primary"
                size="small"
                @click="$router.push('/card/saleservicedetail/' + scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="">
        <el-col :span="24" align="center">
          <ever-pagination
            justify="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount" :current="current">
          </ever-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import api from '../store/saleserviceapi'
  import list from '@/util/list'
  let querySchema = [
    {
      startName: 'startTime',
      endName: 'endTime',
      name: 'daterange',
      type: 'daterange',
      dateType: 'daterange',
      label: '申请时间',
      placeholder: '请选择申请时间',
      format: 'YYYY-MM-DD',
      editable: false
    },
    {
      name: 'productSkuName',
      label: '商品名称',
      placeholder: '请输入商品名称'
    },
    {
      name: 'sn',
      label: '售后单号',
      placeholder: '请输入售后编号'
    }
  ]
  export default {
    mixins: [list],
    data () {
      let obj = this.$ever.createObjFromSchema(querySchema)
      obj.queryTimeType = 0
      return {
        api: api,
        totalCount: 0,
        tableData: [],
        querySchema: querySchema,
        queryObj: obj
      }
    },
    created () {
    },
    methods: {
      list (refresh) {
        if (refresh) {
          this.offset = 0
        }
        let params = {}
        Object.assign(params, this.queryObj)
        params.page = this.current // 兼容需要page作为分页参数的接口
        params.offset = this.offset
        params.pagesize = this.pagesize
        delete params.daterange
        api.list(params).then(res => {
          this.tableData = res.data.resultList || []
          this.totalCount = res.data.totalCount || 0
        })
      }
    },
    components: {
    }
  }
</script>


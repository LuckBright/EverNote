<template>
  <div class="bg">
    <el-row class="pdt20 pdl20">
      <ever-form2
        class="gray-label-form"
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
        :has-ext="false"
        :ext-class-name="'fr'"
      >
      <template slot="default">
        <el-form-item>
          <el-button type="primary" @click="list()">查询</el-button>
        </el-form-item>
      </template>
      </ever-form2>
    </el-row>
    <el-row class="pdb20">
      <el-col :span="24">
        <ever-table
        ref="table"
        border
        :columns="columns"
        :url="url"
        :params="params"
        :show-index="true"
        index-label
        :fixed-height="23"
        fixed-elements="js-fixed-header js-classify"
        :isPagination="false"
        @update:params="changeParams">
        <template slot="bedStatusCode" slot-scope="scope">
          <sys-value type="THC_WH_CWZT" :code="scope.row.bedStatusCode"></sys-value>
        </template>
        </ever-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import urlMap from '@/crm/store/bedapi'
import { request } from '@/util/req'
import utillist from '@/util/list'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'

let querySchema = [
  {
    name: 'sickAreaId',
    label: '',
    comp: 'ever-select',
    props: {
      options: [],
      clearable: false
    },
    placeholder: '',
  },
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      queryObj,
      querySchema,
      tableData: [],
      patientArr: [],
      areaArr: [],
      url: urlMap.bed.getBedListByCondition,
      params: {
        sickAreaId: ''
      },
      columns: [
        {
          prop: 'sickAreaName',
          label: '病区',
        },
        {
          prop: 'roomName',
          label: '房间',
        },
        {
          prop: 'bedName',
          label: '床位名称',
        },
        {
          prop: 'bedId',
          label: '床号',
        },
        {
          prop: 'bedStatusCode',
          label: '床位可用',
          slot: 'bedStatusCode'
        }
      ]
    }
  },
  created () {
    // 获取病区
    this.getSickAreaListByCondition()
  },
  methods: {
    async getSickAreaListByCondition () {
      let userID = localStorage.getItem('USERID')
      let params = {
        relationType: 302,
        relationId: userID
      }
      const rs = await request(urlMap.bed.getSickAreaListByCondition, params)
      if (rs && rs.data && rs.data[0]) {
        let data = rs.data.map(v => ({ id: v.id, name: v.sickAreaName }))
        this.$ever.getFieldFromSchema(querySchema, 'sickAreaId').props.options = data
        this.queryObj.sickAreaId = data[0].id
        this.list()
      } else {
        this.$ever.getFieldFromSchema(querySchema, 'sickAreaId').props.options = []
        this.queryObj.sickAreaId = ''
      }
    },
    changeParams (params) {
      this.queryObj = { ...this.queryObj, ...params }
      this.list(false)
    },
    list (searchFirstPage = true) {
      // 只有在点击查询时才查询，参数变化时不实时查询
      this.params = {
        ...this.queryObj,
        _uuid: U(),
        // 该参数能够控制此次查询是否查第一页
        searchFirstPage,
      }
    }
  }
}
</script>

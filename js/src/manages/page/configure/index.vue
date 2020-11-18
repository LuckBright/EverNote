<template>
  <div class="layout_inner">
    <!-- <configure-comp
      class="flex_col_1_auto main-wrap"
      @switch:update="handlerSwitch"
      v-model="tableData"
      ></configure-comp> -->
    <!-- <ever-table
      ref="table"
      border
      :columns="columns"
      :url="url"
      :params="params"
      :show-index="true"
      index-label
      :fixed-height="23"
      fixed-elements="js-fixed-header js-classify"
      @update:params="changeParams"
      > -->
    <ever-table
      ref="table"
      class="flex_col_1_auto main-wrap"
      is-auto-height
      :columns="columns"
      :params.sync="params"
      :url="url"
    >
      <template slot="isConfig">
        <el-table-column prop="isConfig" label="是否集团统一管控" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isConfig" @change="handlerSwitch(scope.row)" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <!-- <ever-table
      :columns="columns"
      class="flex_col_1_auto main-wrap"
      :url="url"
      :data="tableData">
      <template slot="isConfig">
        <el-table-column prop="isConfig" label="是否集团统一管控" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isConfig" @change="handlerSwitch(scope.row)" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
      </template>
    </ever-table> -->
  </div>
</template>

<script>
// import ConfigureComp from '@/manages/components/configure.comp'
// import api from '@/manages/page/configure/configapi'
// import { STENCIL_TYPE } from '@/util/warehouseconfig'
import urlMap from '@/manages/page/configure/urls'
import {request} from '@/util/req'
export default {
  data () {
    return {
      // tableData: [],
      columns: [
        {
          prop: 'description',
          label: '数据字典',
          width: 400
        },
        {
          prop: 'isConfig',
          slotName: 'isConfig'
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          formatter: ({ value }) => {
            return this.$filters.formatDateByExp(value)
          }
        },
      ],
      url: urlMap.list,
      params: {}
    }
  },
  mounted () {
    // this.tableDataList()
  },
  methods: {
    // changeParams () {
    //   this.list()
    // },
    list () {
      this.$refs.table.list(true)
    },
    // tableDataList () {
    //   // api.list().then(result => {
    //   request(urlMap.list).then(result => {
    //     result = result.data
    //     result.map(item => {
    //       item.name = this.$filters.formateValueToFnt(item.type, { list: STENCIL_TYPE }) + '管理'
    //     })
    //     this.tableData = result
    //   })
    // },
    handlerSwitch (row) {
      // api.update(row).then(res => {
      request(urlMap.update, row).then(res => {
        res = res.data
        if (res && res.id) {
          this.$messageTips(this, 'success', res.description + ' 修改成功')
          this.list()
        }
      })
    }
  },
  components: {
    // ConfigureComp
  }
}
</script>
